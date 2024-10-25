import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class LakeCountyREScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector("input[name='parcelid']")
        await this.page.type("input[name='parcelid']", this.account)
        await this.page.click("input[type='SUBMIT']")

        await new Promise(resolve => setTimeout(resolve, 2000));

        await Promise.race([
            this.page.waitForSelector('table[rules="ALL"] td', { visible: true }),
            this.page.waitForSelector('i', { visible: true }),
            this.page.waitForSelector('font[color="Red"]', { visible: true })
        ]);

        const errors = await this.page.$$("i")
        let noBill = false;
        for (let err of errors) {
            const label = await this.page.evaluate(el => el.textContent, err);
            if (label.trim().includes("No records found! Please try again")) {
                noBill = true
                break
            }
        }

        const errors2 = await this.page.$$("font[color='Red']")
        for (let err of errors2) {
            const label = await this.page.evaluate(el => el.textContent, err);
            if (label.trim().includes("Number only")) {
                noBill = true
                break
            }
        }

        if (noBill) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

       
        await this.page.waitForSelector('table[rules="ALL"] td')
        const yearLabels = await this.page.$$('table[rules="ALL"] td');
        let hasTargetYear = false;
        for (let element of yearLabels) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes(`Pay ${this.year}`)) {
                hasTargetYear = true;
                break;
            }
        }

        if (!hasTargetYear) {
            console.error('Target year does not match for account', this.account);
            return { is_success: false, msg: `Target year does not match for account ${this.account}` };
        }

        const [newPagePromise] = await Promise.all([
            new Promise(resolve => this.browser.once('targetcreated', target => resolve(target.page()))),
            this.page.waitForSelector('a.menulevel3'),
            this.page.click('a.menulevel3')
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

export default LakeCountyREScript;
