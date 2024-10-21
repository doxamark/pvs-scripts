import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class SpokaneCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector("#txtSearch")
        await this.page.type("#txtSearch", this.account)
        await this.page.click("#MainContent_btnSearch")

        await Promise.race([
            this.page.waitForSelector('a.pull-left', { visible: true }),
            this.page.waitForSelector('#MainContent_lblMsg', { visible: true })
        ]);

        const errors = await this.page.$$("#MainContent_lblMsg")
        let noBill = false;
        for (let err of errors) {
            const label = await this.page.evaluate(el => el.textContent, err);
            if (label.trim().includes("No record found by that search criteria.")) {
                noBill = true
                break
            }
        }

        if (noBill) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector(".footable-visible")

        const yearLabels = await this.page.$$('.footable-visible');
        let hasTargetYear = false;
        for (let element of yearLabels) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim() == `Total Taxes for ${this.year}`) {
                hasTargetYear = true;
                break;
            }
        }

        if (!hasTargetYear) {
            console.error('Target year does not match', this.account);
            return { is_success: false, msg: `Target year does not match. ${this.account}` };
        }


        const [newPagePromise] = await Promise.all([
            new Promise(resolve => this.browser.once('targetcreated', target => resolve(target.page()))),
            this.page.waitForSelector('a.pull-left'),
            this.page.click('a.pull-left')
        ]);

        const newPage = await newPagePromise;
        const newPageUrl = newPage.url();

        // Optionally navigate to the new page URL if needed
        await this.page.goto(newPageUrl);
        await newPage.close();
        return { is_success: true, msg: `` };
    }

    async saveAsPDF() {
        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create the directory and any missing parent directories
        }
        await this.page.pdf({
            path: this.outputPath,
            format: 'A4',
            printBackground: true
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }


}

export default SpokaneCountyPPScript;
