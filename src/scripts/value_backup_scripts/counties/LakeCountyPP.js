import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class LakeCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await Promise.race([
            this.page.waitForSelector('input#cphMain_imgBtnSubmit', { visible: true }),
            this.page.waitForSelector('input#cphMain_rblRealTangible_1', { visible: true })
        ]);

        await this.page.waitForSelector('input#cphMain_imgBtnSubmit');
        await this.page.click('input#cphMain_imgBtnSubmit');

        // Select the 'Real Property' radio button
        await this.page.waitForSelector('input#cphMain_rblRealTangible_1');
        await this.page.click('input#cphMain_rblRealTangible_1');

        // Wait for the specific input field to appear
        const inputSelector = 'input#cphMain_txtAltKey';
        await this.page.waitForSelector(inputSelector);

        this.account = this.account.trim().replaceAll("'", "").replaceAll("-", "")

        const containsLetters = /[a-zA-Z]/.test(this.account);

        if (containsLetters) {
            console.error('Bad account lookup');
            return { is_success: false, msg: `Bad account lookup: ${this.account}` };
        }

        // Input data into the text field
        await this.page.type(inputSelector, this.account); // Replace with the actual account number

        // Click the 'Search' button
        await this.page.click('input#cphMain_btnSearch');

        // Wait for the table containing search results to load
        await this.page.waitForSelector('table#cphMain_gvTPP');

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
            return { is_success: false, msg: `No Results Found. Please check your account number. ${this.account}` };
        }

        // Click the 'view' link in the search results
        await this.page.click('a#cphMain_gvTPP_lView_0');

         // Wait for the Proposed Tax Notice link to appear
         await this.page.waitForSelector('a#cphMain_lnkTRIM');

        // check year
        const yearStatement = await this.page.$$('.red');
        let correctYear = false;
        for (let element of yearStatement) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes(this.year)) {
                correctYear = true;
                break;
            }
        }

        if (!correctYear) {
            console.error("Target year does not match.")
            return { is_success: false, msg: `Target year does not match.` };
        }

        return {is_success: true, msg: ''};
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

export default LakeCountyPPScript;
