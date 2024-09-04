import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class OrangeCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const targetYear = this.year;

        // Select the desired year in the dropdown
        let isBillYearAvailable = false
        const options = await this.page.$$('select[name="TaxBills"] option');
        for (const option of options) {
            const text = await this.page.evaluate(el => el.textContent, option);
            if (text.includes(targetYear)) {
                await this.page.evaluate(el => el.selected = true, option);
                isBillYearAvailable = true
                break;
            }
        }

        if (!isBillYearAvailable) {
            console.error('No Bills Found With Target Year. Please check your account number.', this.account);
            await new Promise(resolve => setTimeout(resolve, 3000));
            return { is_success: false, msg: `Target year is not available` };
        }

        const billNotEmpty = await this.page.$('.buttonccp');

        if (!billNotEmpty) {
            console.error('No Bills Found With Target Year. Please check your account number.', this.account);
            await new Promise(resolve => setTimeout(resolve, 3000));
            return { is_success: false, msg: `No Bills Found With Target Year. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector('input[type="button"][value="Go"]');
    
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

        await this.page.waitForSelector('input[type="button"][value="Go"]');
        const billLinkSelector = 'input[type="button"][value="Go"]'
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.page.click(billLinkSelector, { clickCount: 1 });

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

export default OrangeCountyPPScript;
