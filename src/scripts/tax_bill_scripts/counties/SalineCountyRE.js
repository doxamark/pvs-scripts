import SpecialScript from '../../../core/SpecialScript.js';
import fs from 'fs';
import path from 'path';

class SalineCountyREScript extends SpecialScript {
    async performScraping() {
        this.year = 2023
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);
        await this.page.waitForSelector("#ppan")
        await this.page.type("#ppan", this.account)

        await this.page.click("#searchy")

        await new Promise(resolve => setTimeout(resolve, 1000));
        // Wait for either the error message or the bill view to be visible
        await Promise.race([
            this.page.waitForSelector('.success'),
            this.page.waitForSelector('.alert.alert-dismissible.alert-danger')
        ]);
  
        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('.alert.alert-dismissible.alert-danger');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('No Records Returned') || text.trim().includes("Search Input Error")) {
                noBillFound = true;
                break;
            }
        }
    
        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector('td');

        const targetYearLabels = await this.page.$$('td');
        let hasTargetYear = false
        for (let element of targetYearLabels) {
            const year = await this.page.evaluate(el => el.textContent, element);
            if (year.trim().includes(this.year)) {
                hasTargetYear = true
                break;
            }
        }

        if (!hasTargetYear) {
            console.error('Target year does not match for account', this.account);
            return { is_success: false, msg: `Target year does not match for account ${this.account}` };
        }

        const clickElement = await this.page.$('td a');
        if (!clickElement) {
            console.error('Click element not found', this.account);
            return { is_success: false, msg: `Click element not found ${this.account}` };
        }

        await clickElement.click();

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

export default SalineCountyREScript;
