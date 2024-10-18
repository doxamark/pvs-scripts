import SpecialScript from '../../../core/SpecialScript.js';
import fs from 'fs';
import path from 'path';

class LuzerneCountyPPScript extends SpecialScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);
        await this.page.waitForSelector("#parcel")
        await this.page.type("#parcel", this.account)

        await this.page.click("input[type='SUBMIT'")

        await new Promise(resolve => setTimeout(resolve, 1000));
        // Wait for either the error message or the bill view to be visible
        await Promise.race([
            this.page.waitForSelector('.TableContent a'),
            this.page.waitForSelector('td')
        ]);
  
        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('td');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('There is no information to display')) {
                noBillFound = true;
                break;
            }
        }
    
        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        const clickElement = await this.page.$('.TableContent a');
        if (!clickElement) {
            console.error('Click element not found', this.account);
            return { is_success: false, msg: `Click element not found ${this.account}` };
        }

        await clickElement.click();

        await new Promise(resolve => setTimeout(resolve, 3000));

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

export default LuzerneCountyPPScript;
