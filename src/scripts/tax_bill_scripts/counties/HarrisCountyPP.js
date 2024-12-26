import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class HarrisCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        this.account = this.account.replace("-", "")
        await this.page.waitForSelector("#txtSearchValue")
        await this.page.type('#txtSearchValue', this.account);
        await this.page.click("#btnSubmitTaxSearch")

        

        await Promise.race([
            this.page.waitForSelector('.jtable-data-row', { visible: true }),
            this.page.waitForSelector('.jtable-no-data-row', { visible: true })
        ]);

        await new Promise(resolve => setTimeout(resolve, 2000));
        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('.jtable-no-data-row');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('The property information you have entered is not available.')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector(".jtable-data-row")

        const navBtn = await this.page.$('.jtable-data-row a')

        if (!navBtn) {
            console.error('Cannot find navigation button', this.account);
            return { is_success: false, msg: `Cannot find navigation button. ${this.account}` };
        }
        await navBtn.click()

        await this.page.waitForSelector("#CurrentStatement")
        await this.page.waitForSelector("a.StatementPrint")

        const links = await this.page.$$('.left');
        let printBtn = false;
        for (let link of links) {
            const text = await this.page.evaluate(el => el.textContent, link);
            if (text.includes('Print Statement')) {
                printBtn = link;
                break;
            }
        }

        if (!printBtn) {
            console.error('No Print Link Statement Found.', this.account);
            return { is_success: false, msg: `No Print Link Statement Found. ${this.account}` };
        }

        // const printBtn = await this.page.$('a.StatementPrint')
        // console.log(printBtn)
        // if (!printBtn) {
        //     console.error('Cannot find print button', this.account);
        //     return { is_success: false, msg: `Cannot find print button. ${this.account}` };
        // }

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

        const links = await this.page.$$('.left');
        let printBtn = false;
        for (let link of links) {
            const text = await this.page.evaluate(el => el.textContent, link);
            if (text.includes('Print Statement')) {
                printBtn = link;
                break;
            }
        }

        if (!printBtn) {
            console.error('No Print Link Statement Found.', this.account);
            return { is_success: false, msg: `No Print Link Statement Found. ${this.account}` };
        }

        await printBtn.click()

        // Wait for the file to download
        while (!fs.existsSync(customPath) || fs.readdirSync(customPath).length === 0 || !this.hasPdfFiles(customPath)) {
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
            return extname === '.pdf' && !extname.includes('.crdownload');
        });
    }
}

export default HarrisCountyPPScript;
