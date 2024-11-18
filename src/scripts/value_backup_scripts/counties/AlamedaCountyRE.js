import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class AlamedaCountyREScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);
        
        await new Promise(resolve => setTimeout(resolve, 4000));
        if (this.account.split("-").length - 1 < 2) {
            console.error('Parcel Number must contain either two or three dashes. Please check your account number.', this.account);
            return { is_success: false, msg: `Parcel Number must contain either two or three dashes. Please check your account number. ${this.account}` };
        }

        if (this.account.length > 15) {
            console.error('Parcel Number max length is 15. Please check your account number.', this.account);
            return { is_success: false, msg: `Parcel Number max length is 15. Please check your account number. ${this.account}` };
        }

        // Wait for the input field next to h6 with text 'Bill Number' and input a value
        await this.page.waitForSelector('.k-input-inner');
        await this.page.type('.k-input-inner', this.account)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Click the button with the title "Search"
        await this.page.click('button[title="Search Button"]');

        await Promise.race([
            this.page.waitForSelector('.divTable', { visible: true }),
            this.page.waitForSelector('.k-grid-norecords.k-table-row', { visible: true })
        ]);

        
                                    
        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('.k-grid-norecords.k-table-row');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('Search criteria did not find any properties')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector(".divTable")

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Click the 'a' tag with 'view account' text
        const rows = await this.page.$$('td.k-table-td div');
        let targetYearLink = null
        let yearLinks = []
        for (const row of rows) {
            const text = await this.page.evaluate(el => el.textContent, row);
            if (text && text.trim().includes(this.year)) {
                targetYearLink = row
            }
        }

        if (!targetYearLink) {
            console.error('Target year does not match for account', this.account);
            return { is_success: false, msg: `Target year does not match for account ${this.account}` };
        }

        await targetYearLink.click()

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
            printBackground: true
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }


}

export default AlamedaCountyREScript;
