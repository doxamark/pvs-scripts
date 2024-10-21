import SpecialScript from '../../../core/SpecialScript.js';
import fs from 'fs';
import path from 'path';

class PierceCountyPPScript extends SpecialScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        // Wait for either the error message or the bill view to be visible
        await Promise.race([
            this.page.waitForSelector('#propertySummaryReport'),
            this.page.waitForSelector('.modal-content')
        ]);
  
        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('.modal-content');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('could not prepare statement')) {
                noBillFound = true;
                break;
            }
        }
    
        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector('#propertySummaryReport');

        const targetYearLabels = await this.page.$$('.ux-pt-5');
        let hasTargetYear = false
        for (let element of targetYearLabels) {
            const year = await this.page.evaluate(el => el.textContent, element);
            if (year.trim().includes(`${this.year} Tax`)) {
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

export default PierceCountyPPScript;
