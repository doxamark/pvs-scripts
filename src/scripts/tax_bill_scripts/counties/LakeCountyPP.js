import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class LakeCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector(".menulevel2")
        const navLinks = await this.page.$$(".menulevel2")
        let navBtn = null;
        for (let link of navLinks) {
            const label = await this.page.evaluate(el => el.textContent, link);
            if (label.trim().includes("Tax Search")) {
                navBtn = link
                break
            }
        }

        if (!navBtn) {
            console.error('Tax Search does not exist. Please check your account number.', this.account);
            return { is_success: false, msg: `Tax Search does not exist. Please check your account number. ${this.account}` };
        }

        await navBtn.click()
        await new Promise(resolve => setTimeout(resolve, 1000));

        await this.page.waitForSelector(".menulevel2")
        const navLinks2 = await this.page.$$(".menulevel2")
        let nav = null;
        for (let link of navLinks2) {
            const label = await this.page.evaluate(el => el.textContent, link);
            if (label.trim().includes("Personal Property")) {
                nav = link
                break
            }
        }

        if (!nav) {
            console.error('Personal Property Search does not exist. Please check your account number.', this.account);
            return { is_success: false, msg: `Personal Property Search does not exist. Please check your account number. ${this.account}` };
        }

        await nav.click()
        await new Promise(resolve => setTimeout(resolve, 1000));

        await this.page.waitForSelector("input[name='account2']")
        await this.page.type("input[name='account2']", this.account)
        await this.page.click("input[type='SUBMIT']")

        await new Promise(resolve => setTimeout(resolve, 2000));

        await Promise.race([
            this.page.waitForSelector('.listlink', { visible: true }),
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

        await this.page.waitForSelector('.listlink')
        await new Promise(resolve => setTimeout(resolve, 2000));
        const taxBillLinks = await this.page.$$('.listlink');
        let taxBillLink = null;
        for (let element of taxBillLinks) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes(`${this.account}`)) {
                taxBillLink = element;
                break;
            }
        }

        if (!taxBillLink) {
            console.error('Tax bill link does not exist', this.account);
            return { is_success: false, msg: `Tax bill link does not exist. ${this.account}` };
        }

        await taxBillLink.click()
        await new Promise(resolve => setTimeout(resolve, 2000));
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

export default LakeCountyPPScript;
