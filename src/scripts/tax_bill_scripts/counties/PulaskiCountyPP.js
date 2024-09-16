import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class PulaskiCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        const firstframes = this.page.frames(); // Get all frames
        let firstIframe = null;
        
        for (const frame of firstframes) {
            if (frame.url().includes('taxlogin.html')) { // Adjust URL check if needed
                firstIframe = frame;
                break;
            }
        }

        if (!firstIframe) {
            console.error('First Iframe not found');
            return { is_success: false, msg: `First Iframe not found ${this.account}` };
        }

        await firstIframe.waitForSelector("#Login1")
        await firstIframe.click("#Login1")

        await new Promise(resolve => setTimeout(resolve, 1500));

        const secondframes = this.page.frames(); // Get all frames
        let secondIframe = null;
        
        for (const frame of secondframes) {
            if (frame.url().includes('STDFIND')) { // Adjust URL check if needed
                secondIframe = frame;
                break;
            }
        }

        if (!secondIframe) {
            console.error('Second Iframe not found');
            return { is_success: false, msg: `Second Iframe not found ${this.account}` };
        }


        await secondIframe.waitForSelector(".findtable2")


        let inputs = await secondIframe.$$(".findtable2 input")
        let inputElement = null
        for (let element of inputs) {
            const placeholder = await secondIframe.evaluate(el => el.getAttribute('placeholder'), element);
            if (placeholder && placeholder.includes('Taxpayer ID ( Pin # )')) {
                inputElement = element;
                break;
            }
        }

        if (!inputElement) {
            console.error('Input field not found', this.account);
            return { is_success: false, msg: `Input field not found. ${this.account}` };
        }

        await inputElement.type(this.account);

        await secondIframe.waitForSelector(".findtd2 img.button2")

        await new Promise(resolve => setTimeout(resolve, 1000));

        await secondIframe.click(".findtd2 img.button2")

        await new Promise(resolve => setTimeout(resolve, 1500));

        let alertComponent = await secondIframe.$("#ALERTLAYER")
        let alertMessage = await secondIframe.evaluate(el => el.textContent, alertComponent)
        if (alertMessage.trim().includes("Invalid Parcel or PPAN.  Please try again.")) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }


        await secondIframe.waitForSelector("#HdrTbl1")
        let yearLabels = await secondIframe.$$(".R1 td")
        let hasTargetYear = false
        for (let element of yearLabels) {
            const placeholder = await secondIframe.evaluate(el => el.textContent, element);
            if (placeholder.includes(this.year)) {
                hasTargetYear = true;
                break;
            }
        }

        if (!hasTargetYear) {
            console.error('Target Year does not match', this.account);
            return { is_success: false, msg: `Target Year does not match. ${this.account}` };
        }

        await secondIframe.click(".R1 .B")

        let buttonElements = await secondIframe.$$("#HdrTbl1 button")
        let continueBtn = null
        for (let element of buttonElements) {
            const value = await secondIframe.evaluate(el => el.getAttribute('value'), element);
            if (value && value.includes('Continue')) {
                continueBtn = element;
                break;
            }
        }

        if (!continueBtn) {
            console.error('Continue button not found', this.account);
            return { is_success: false, msg: `'Continue button not found' ${this.account}` };
        } 

        await new Promise(resolve => setTimeout(resolve, 1500));

        await continueBtn.click()

        await new Promise(resolve => setTimeout(resolve, 1500));

        const thirdframes = this.page.frames(); // Get all frames
        let thirdIframe = null;
        
        for (const frame of thirdframes) {
            if (frame.url().includes('PUBLIC.SEARCH')) { // Adjust URL check if needed
                thirdIframe = frame;
                break;
            }
        }

        if (!thirdIframe) {
            console.error('Third Iframe not found');
            return { is_success: false, msg: `Third Iframe not found ${this.account}` };
        }

        await thirdIframe.waitForSelector(".GridFieldGr")
        let viewBillElements = await thirdIframe.$$(".GridFieldGr button")
        let viewBill = null
        for (let element of viewBillElements) {
            const text = await thirdIframe.evaluate(el => el.textContent, element);
            if (text.includes('View Bill')) {
                viewBill = element;
                break;
            }
        }

        if (!viewBill) {
            console.error('view bill button not found', this.account);
            return { is_success: false, msg: `'view bill button not found' ${this.account}` };
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

        const thirdframes = this.page.frames(); // Get all frames
        let thirdIframe = null;
        
        for (const frame of thirdframes) {
            if (frame.url().includes('PUBLIC.SEARCH')) { // Adjust URL check if needed
                thirdIframe = frame;
                break;
            }
        }

        if (!thirdIframe) {
            console.error('Third Iframe not found');
            return { is_success: false, msg: `Third Iframe not found ${this.account}` };
        }

        await thirdIframe.waitForSelector(".GridFieldGr")
        let viewBillElements = await thirdIframe.$$(".GridFieldGr button")
        let viewBill = null
        for (let element of viewBillElements) {
            const text = await thirdIframe.evaluate(el => el.textContent, element);
            if (text.includes('View Bill')) {
                viewBill = element;
                break;
            }
        }

        await new Promise(resolve => setTimeout(resolve, 1500));
        await viewBill.click()

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
        await new Promise(resolve => setTimeout(resolve, 1000));

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

export default PulaskiCountyPPScript;
