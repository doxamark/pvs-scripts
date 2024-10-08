import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class CharlestonCountyREScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector('.mb-3.mt-1.col-sm-12 input.form-control.ng-untouched.ng-pristine.ng-valid');
        await this.page.type('.mb-3.mt-1.col-sm-12 input.form-control.ng-untouched.ng-pristine.ng-valid', this.account)

        // Click the button with the title "Search"
        await this.page.waitForSelector('button[title="Search"]');
        const buttons = await this.page.$$('button[title="Search"]');
        for (const button of buttons) {
            const text = await this.page.evaluate(el => el.textContent, button);
            if (text && text.trim().includes('Search')) {
                await button.click();
                break;
            }
        }


        // Check if the error message is present and contains the specific text
        await new Promise(resolve => setTimeout(resolve, 1000));
        const errorMessages = await this.page.$$('h4.text-center');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('No Result')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        // Wait for the table element

        await this.page.waitForSelector("table.table.table-striped")

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Click the 'a' tag with 'view account' text
        const rows = await this.page.$$('tr');
        let yearLinks = []
        for (const row of rows) {
            const link = await row.$('a.btn-primary')
            if (link) {
                const text = await this.page.evaluate(el => el.textContent, link);
                if (text && text.trim().includes(this.year)) {
                    yearLinks.push(row)
                }
            }

        }

        if (!yearLinks) {
            console.error('Target year does not match for account', this.account);
            return { is_success: false, msg: `Target year does not match for account ${this.account}` };
        }

        let maxAmount = 0;
        let maxLink = null;
        for (let yearRow of yearLinks) {
            const amountCell = await yearRow.$('td:nth-child(8)'); // Assuming amount is in the second column
            if (amountCell) {
                const amountText = await this.page.evaluate(el => el.textContent, amountCell);
                const totalAmount = parseFloat(amountText.trim().replace(/[^0-9.-]+/g, "")); // Convert to a number, handling currency symbols
                if (totalAmount >= maxAmount) {
                    maxAmount = totalAmount;
                    maxLink = await yearRow.$('td a.btn-primary'); // Capture the link for the maximum amount
                }
            }

        }

        if (!maxLink) {
            console.error('Target year does not match for account', this.account);
            return { is_success: false, msg: `Target year does not match for account ${this.account}` };
        }

        await maxLink.click()

        await this.page.waitForSelector("a[title='Print Tax Detail']")
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

export default CharlestonCountyREScript;
