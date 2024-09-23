import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class StatesboroCityREScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector('#ParcelNumber')
        await this.page.type('#ParcelNumber', this.account);

        await this.page.click("#btnSubmit")

        await Promise.race([
            this.page.waitForSelector('.forge-table', { visible: true }),
            this.page.waitForSelector('.forge-typography--body1.card-padding', { visible: true })
        ]);

        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('.forge-typography--body1.card-padding');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('No parcels found.')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector(".forge-table-body__row--clickable")
        await this.page.click(".forge-table-body__row--clickable")

        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.page.waitForSelector(".collapse-row.collapsed")
        const yearLabelPrintButtons = await this.page.$$('button.forge-button--outlined');
        let printButton = null;
        let hasTargetYear = false
        for (let element of yearLabelPrintButtons) {
            const text = await this.page.evaluate(el => el.getAttribute('onclick'), element);
            if (text.includes(`taxYear=${this.year}`)) {
                printButton = element;
                hasTargetYear = true
                break;
            }
        }

        if (!hasTargetYear) {
            console.error('Target year does not match', this.account);
            return { is_success: false, msg: `Target year does not match. ${this.account}` };
        }

        if (!printButton) {
            console.error('No print button found for target year. Please check your account number.', this.account);
            return { is_success: false, msg: `No print button found for target year. Please check your account number. ${this.account}` };
        }


        await new Promise(resolve => setTimeout(resolve, 1000));
        await printButton.click()

        await this.page.waitForSelector(".card-margin")

        const frames = this.page.frames(); // Get all frames
        let printIframe = null;
        for (const frame of frames) {
            if (frame.url().includes('tax/report')) { // Adjust URL check if needed
                printIframe = frame;
                break;
            }
        }

        if (!printIframe) {
            console.error('Print Iframe not found');
            return { is_success: false, msg: `First Iframe not found ${this.account}` };
        }


        return { is_success: true, msg: `` };
    }

    async saveAsPDF() {
        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const customPath = path.resolve(`src/temp/${this.account}`);
        const client = await this.page.createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow', downloadPath: customPath
        });

        const frames = this.page.frames(); // Get all frames
        let printIframe = null;
        for (const frame of frames) {
            if (frame.url().includes('tax/report')) { // Adjust URL check if needed
                printIframe = frame;
                break;
            }
        }

        if (!printIframe) {
            console.error('Print Iframe not found');
            return { is_success: false, msg: `First Iframe not found ${this.account}` };
        }

        let printUrl = printIframe.url().replace("/form", "").replace("?", ".pdf?");

        // Inject the anchor tag and click it
        await this.page.evaluate((url) => {
            // Create an anchor element
            let a = document.createElement('a');
            a.href = url;
            a.innerText = 'Click here to download the PDF';
            a.style.display = 'none';  // Hide the element

            // Append the anchor to the body
            document.body.appendChild(a);

            // Simulate a click on the anchor
            a.click();
        }, printUrl);

        await new Promise(resolve => setTimeout(resolve, 5000));
        // Wait for the file to download
        while (!fs.existsSync(customPath) || fs.readdirSync(customPath).length === 0 && this.hasPdfFiles(customPath)) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Rename the file inside the customPath to this.outputPath
        const files = fs.readdirSync(customPath);
        if (files.length > 0) {
            const downloadedFile = path.join(customPath, files[0]);
            const outputFilePath = path.resolve(this.outputPath);
            try {
                // Attempt to rename the file
                fs.renameSync(downloadedFile, outputFilePath);
            } catch (err) {
                if (err.code === 'EXDEV') {
                    // Handle cross-device link error by copying and then deleting
                    fs.copyFileSync(downloadedFile, outputFilePath);
                    fs.unlinkSync(downloadedFile);
                } else {
                    throw err; // Re-throw error if it's not an EXDEV error
                }
            }

            // Remove the directory if needed
            fs.rmSync(customPath, { recursive: true });
        }

        console.log(`PDF saved: ${this.outputPath}`);

    }

    hasPdfFiles(dir) {
        const files = fs.readdirSync(dir);
        return files.some(file => {
            const extname = path.extname(file).toLowerCase();
            const basename = path.basename(file, extname);
            // Check if the file has a .pdf extension and does not have additional extensions
            return extname === '.pdf' && !basename.includes('.crdownload');
        });
    }


}

export default StatesboroCityREScript;
