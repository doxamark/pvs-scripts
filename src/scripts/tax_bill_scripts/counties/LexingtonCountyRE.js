import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class LexingtonCountyREScript extends BaseScript {
    async performScraping() {
        this.year = 2023
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector('#ctl00_MainContent_txtCriteriaBox')
        await this.page.type('#ctl00_MainContent_txtCriteriaBox', this.account);

        const selectElement = await this.page.$('#ctl00_MainContent_ddlCriteriaList');

        // Select the "Tax ID" option by value
        await selectElement.select('Map');

        await this.page.click('#ctl00_MainContent_btnSearch')


        await this.page.waitForSelector(".gridview")

        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('td');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('No records matched')) {
                noBillFound = true;
                break;
            }
        }
    
        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        const yearLinks = await this.page.$$(".gvrow")
        let viewLink = null
        for (let yearRow of yearLinks) {
            const year = await yearRow.$('td:nth-child(3)'); // Assuming amount is in the second column
            if (year) {
                const yearText = await this.page.evaluate(el => el.textContent, year);
                if (yearText.includes(this.year)) {
                    viewLink = await yearRow.$('td a.btn-primary'); // Capture the link for the maximum amount
                }
            }

        }

        if (!viewLink) {
            console.error('Target year does not match for account', this.account);
            return { is_success: false, msg: `Target year does not match for account ${this.account}` };
        }

        await viewLink.click()

        await this.page.waitForSelector("#ctl00_MainContent_ButtonViewBill")
        await this.page.click("#ctl00_MainContent_ButtonViewBill")

        await new Promise(resolve => setTimeout(resolve, 2000));

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
            printBackground: false,
            margin: {
                top: '0.1in',    // Adjust the margin size as needed
                right: '0.5in',
                bottom: '0.1in',
                left: '0.5in'
            }
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }

}

export default LexingtonCountyREScript;
