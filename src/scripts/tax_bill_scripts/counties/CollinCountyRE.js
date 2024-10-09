import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class CollinCountyREScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await new Promise(resolve => setTimeout(resolve, 1000));

        await this.page.waitForSelector('#Query\\.SearchText')
        await this.page.type('#Query\\.SearchText', this.account);

        await this.page.select("#Query\\.PropertyType", "1")

        await new Promise(resolve => setTimeout(resolve, 1000));

        await this.page.click(".btn.btn-primary.col")

        await new Promise(resolve => setTimeout(resolve, 1000));

        await Promise.race([
            this.page.waitForSelector('.d-flex.flex-column.justify-content-between.align-items-start', { visible: true }),
            this.page.waitForSelector('.container h1', { visible: true })
        ]);

        const errorMessage = await this.page.$(".container h1")
        if (errorMessage) {
            const error = await this.page.evaluate(el => el.textContent, errorMessage);

            if (error.trim().includes("An error occurred while executing this request.")) {
                console.error('Error Occured. Please check your account number.', this.account);
                return { is_success: false, msg: `Error Occured. Please check your account number. ${this.account}` };
            }
        }

        await this.page.waitForSelector(".d-flex.flex-column.justify-content-between.align-items-start")

        const result = await this.page.$(".d-flex.flex-column.justify-content-between.align-items-start")
        const text = await this.page.evaluate(el => el.textContent, result);

        if (text.trim().includes("0 results found")) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector("a.btn.btn-link")
        await this.page.click("a.btn.btn-link")

        await new Promise(resolve => setTimeout(resolve, 2000));
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

export default CollinCountyREScript;
