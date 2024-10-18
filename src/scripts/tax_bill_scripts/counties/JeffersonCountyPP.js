import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class JeffersonCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await Promise.race([
            this.page.waitForSelector('tbody tr', { visible: true }),
            this.page.waitForSelector('nav[aria-label="No records found."', { visible: true })
        ]);

        const errorMessage = await this.page.$('nav[aria-label="No records found."')
        if (errorMessage) {
            const error = await this.page.evaluate(el => el.textContent, errorMessage);
            if (error.trim().includes("No records found.")) {
                console.error('Account not found. Please check your account number.', this.account);
                return { is_success: false, msg: `Error Occured. Please check your account number. ${this.account}` };
            }
        }
        
        await this.page.waitForSelector("tbody tr")
        await this.page.click("tbody tr")

        await this.page.waitForSelector(".ibox-title .text-accessibility-lg.ng-binding")
        const links = await this.page.$$(".text-accessibility-lg.ng-binding")
        let hasTargetYear = false
        for (let element of links) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes(`${this.year} Tax Information`)) {
                hasTargetYear = true;
                break;
            }
        }
        if (!hasTargetYear) {
            console.error('Target year does not match', this.account);
            return { is_success: false, msg: `Target year does not match. ${this.account}` };
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

        const printBtn = await this.page.$('.ibox-tools button[type="button"]');
        if (!printBtn) {
            console.error('No Print Function Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Print Function Found. Please check your account number. ${this.account}` };
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

        const printBtn = await this.page.$('.ibox-tools button[type="button"]');
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

export default JeffersonCountyPPScript;
