import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class LakeCountyREScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await Promise.race([
            this.page.waitForSelector('input#cphMain_imgBtnSubmit', { visible: true }),
            this.page.waitForSelector('input#cphMain_rblRealTangible_0', { visible: true })
        ]);

        await this.page.waitForSelector('input#cphMain_imgBtnSubmit');
        await this.page.click('input#cphMain_imgBtnSubmit');

        // Select the 'Real Property' radio button
        await this.page.waitForSelector('input#cphMain_rblRealTangible_0');
        await this.page.click('input#cphMain_rblRealTangible_0');

        this.account = this.account.replace('-', '')

        if (this.account.length !== 18) {
            console.error('Bad Account Lookup')
        }

        // Extract values from the input text
        const section = this.account.substring(0, 2);
        const township = this.account.substring(2, 4);
        const range = this.account.substring(4, 6);
        const subdivisionNum = this.account.substring(6, 10);
        const block = this.account.substring(10, 13);
        const lot = this.account.substring(13, 18);

        // Fill in the input fields with the extracted values
        await this.page.type('input#cphMain_txtSection', section);
        await this.page.type('input#cphMain_txtTownship', township);
        await this.page.type('input#cphMain_txtRange', range);
        await this.page.type('input#cphMain_txtSubdivisionNum', subdivisionNum);
        await this.page.type('input#cphMain_txtBlock', block);
        await this.page.type('input#cphMain_txtLot', lot);

        // Click the 'Search' button
        await this.page.click('input#cphMain_btnSearch');

        // Wait for the table containing search results to load
        await this.page.waitForSelector('table#cphMain_gvParcels');

        await Promise.race([
            this.page.waitForSelector('.gv_empty', { visible: true }),
            this.page.waitForSelector('.gv_head', { visible: true })
        ]);

        const errorMessages = await this.page.$$('.gv_empty');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('There are no results found that meet your criteria.')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Results Found. Please check your account number.', this.account);
            return false;
        }

        // Click the 'view' link in the search results
        await this.page.click('a#cphMain_gvParcels_lView_0');

        // Wait for the Proposed Tax Notice link to appear
        await this.page.waitForSelector('a#cphMain_lnkTRIM');
        return true;
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

        await this.page.waitForSelector('a#cphMain_lnkTRIM');
        const billLinkSelector = 'a#cphMain_lnkTRIM';
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.page.click(billLinkSelector, { clickCount: 1 });

        await new Promise(resolve => setTimeout(resolve, 2000));

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

export default LakeCountyREScript;
