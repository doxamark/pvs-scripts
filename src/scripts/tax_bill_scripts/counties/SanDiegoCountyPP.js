import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class SanDiegoCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);
        let modifiedAccount = ""
        if (this.account.split("-").length == 2) {
            this.year = this.account.split("-")[0].trim()
            modifiedAccount = this.account.split("-")[1].trim()
        }
        
        if (this.year.length != 4 || modifiedAccount.length != 4)  {
            console.error(`Bad Account Lookup - Pattern should be year-bill_no - ${this.account}`)
            return { is_success: false, msg: `Bad Account Lookup - Pattern should be year-bill_no - ${this.account}` };
        }

        // Click "Option 3: Unsecured Bill Number"
        await this.page.click('#BillSearchPanelGroup-heading-SearchByUnsecureBillNumberBlock a[aria-controls="BillSearchPanelGroup-body-SearchByUnsecureBillNumberBlock"]');

        // Input the year
        await this.page.type('#year', this.year);

        // Input the bill number
        await this.page.type('#unsecuredBillNumber', modifiedAccount);

        const buttons = await this.page.$$('#search-by-unsecured-bill-number-block-form button.btn-primary.btn-custom');
        for (const button of buttons) {
          const buttonText = await this.page.evaluate(el => el.textContent, button);
          if (buttonText.trim() === 'Begin Search') {
            await button.click();
            break;
          }
        }

        // Wait for the search results to appear
        await this.page.waitForSelector('.search-result-tables-td');

        // Click the "View Bill" button in the search result
        await this.page.click('button.btn-info.btn-xs');

        // Wait for the modal to appear
        await this.page.waitForSelector('.modal-dialog');
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

        await new Promise(resolve => setTimeout(resolve, 1000));

        await this.page.waitForSelector('.modal-dialog .btn-primary');
        const billLinkSelector = '.modal-dialog .btn-primary'
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.page.click(billLinkSelector, { clickCount: 1 });

        await new Promise(resolve => setTimeout(resolve, 10000));

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

export default SanDiegoCountyPPScript;
