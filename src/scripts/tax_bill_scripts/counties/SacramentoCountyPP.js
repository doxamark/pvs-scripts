import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class SacramentoCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector('#billDetailGrid');

        // Click the bill number link
        await this.page.click('a[data-bind*="text: FullBillNumber"]');
    }

    async saveAsPDF() {

        if (!this.outputPath) {
            return;
        }

        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const customPath = path.resolve(`src/temp/${this.account}`);
        const client = await this.page.createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow', downloadPath: customPath
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        await this.page.waitForSelector('a[target="_blank"][data-bind*="BillImageLink"]');
        const billLinkSelector = 'a[target="_blank"][data-bind*="BillImageLink"]'
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

export default SacramentoCountyPPScript;
