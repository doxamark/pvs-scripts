import fs from 'fs';
import path from 'path';
import BaseScript from '../../../core/BaseScript.js';

class DentonCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await Promise.race([
            this.page.waitForSelector('.ml-1.vertical-line.row h2', { visible: true }),
            this.page.waitForSelector('.container h1', { visible: true }),
            this.page.waitForSelector('.mt-4.container h2', { visible: true }),
        ]);

        const errorMessage = await this.page.$(".container h1")
        if (errorMessage) {
            const error = await this.page.evaluate(el => el.textContent, errorMessage);

            if (error.trim().includes("An error occurred while executing this request.")) {
                console.error('Error Occured. Please check your account number.', this.account);
                return { is_success: false, msg: `Error Occured. Please check your account number. ${this.account}` };
            }

        }

        const errorMessage2 = await this.page.$(".mt-4.container h2")
        if (errorMessage2) {
            const error = await this.page.evaluate(el => el.textContent, errorMessage2);

            if (error.trim().includes("Tax Account Number not found")) {
                console.error('No Tax Bill Found. Please check your account number.', this.account);
                return { is_success: false, msg: `No Tax Bill Found. Please check your account number. ${this.account}` };
            }

        }

        

        await this.page.waitForSelector(".ml-1.vertical-line.row h2")
        const targetYearLabels = await this.page.$$('.ml-1.vertical-line.row h2');
        let hasTargetYear = false
        for (let element of targetYearLabels) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes(this.year)) {
                hasTargetYear = true;
                break;
            }
        }
        if (!hasTargetYear) {
            console.error('Target year does not match', this.account);
            return { is_success: false, msg: `Target year does not match. ${this.account}` };
        }

        const printBtns = await this.page.$$('#account-details-header a');
        let printBtn = null;
        for (let element of printBtns) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text && text.trim().includes('e-Statement')) {
                printBtn = element;
                break;
            }
        }

        if (!printBtn) {
            console.error('No Print Function Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Print Function Found. Please check your account number. ${this.account}` };
        }

        await printBtn.click()

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

        const printBtns = await this.page.$$('#account-details-header a');
        let printBtn = null;
        for (let element of printBtns) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text && text.trim().includes('e-Statement')) {
                printBtn = element;
                break;
            }
        }

        if (!printBtn) {
            console.error('No Print Function Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Print Function Found. Please check your account number. ${this.account}` };
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

export default DentonCountyPPScript;
