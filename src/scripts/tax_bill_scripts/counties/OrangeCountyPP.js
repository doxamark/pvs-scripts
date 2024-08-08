import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class OrangeCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

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
            this.outputPath = null
        }
    }

    async saveAsPDF() {

        if (!this.outputPath) {
            return;
        }

        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const customPath = path.resolve(`src/downloads/${this.account}`);
        const client = await this.page.createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow', downloadPath: customPath
        });

        await this.page.waitForSelector('input[type="button"][value="Go"]');
        const billLinkSelector = 'input[type="button"][value="Go"]'
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.page.click(billLinkSelector, { clickCount: 1 });

        await new Promise(resolve => setTimeout(resolve, 3000));

        // Wait for the file to download
        while (!fs.existsSync(customPath) || fs.readdirSync(customPath).length === 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Rename the file inside the customPath to this.outputPath
        const files = fs.readdirSync(customPath);
        if (files.length > 0) {
            const downloadedFile = path.join(customPath, files[0]);
            const outputFilePath = path.resolve(this.outputPath);
            fs.renameSync(downloadedFile, outputFilePath);
            fs.rmdirSync(customPath);
        }

        console.log(`PDF saved: ${this.outputPath}`);

    }
}

export default OrangeCountyPPScript;
