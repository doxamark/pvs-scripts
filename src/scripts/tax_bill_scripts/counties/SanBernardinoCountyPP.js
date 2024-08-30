import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class SanBernardinoCountyPPScript extends BaseScript {
    async performScraping() {
        this.account = this.account.replaceAll('-', '')
        console.log(`Scraping data for San Bernardino County with account_lookup ${this.account}`)
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        // Find the input element and type a value
        await this.page.type('input[name="txtParcelNumber"]', this.account);

        // Click the search button
        await this.page.click('input[name="ctl00$contentHolder$cmdSearch"]');

        const noBillsSelector = 'div:contains("Sorry, there were no current bills found for this parcel.")';
        const successSelector = 'table.propInfoTable';

        // Wait for either of the selectors to be present        
        await Promise.race([
            this.page.waitForSelector(noBillsSelector, { visible: true }),
            this.page.waitForSelector(successSelector, { visible: true })
        ]);

        const divMessages = await this.page.$$('.main-wrapper div');
        let noBillFound = false;
        for (let element of divMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('Sorry, there were no current bills found for this parcel.')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.$eval(successSelector, el => el.href);
        await this.page.$(successSelector);

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

        await this.page.waitForSelector('table.propInfoTable');
        const billLinkSelector = 'table.propInfoTable tbody tr td a';
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

export default SanBernardinoCountyPPScript;
