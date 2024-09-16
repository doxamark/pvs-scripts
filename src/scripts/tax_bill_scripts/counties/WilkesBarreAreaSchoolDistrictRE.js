import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class WilkesBarreAreaSchoolDistrictREScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.accountLookupString}`);

        let hasBillFound = await this.page.$('.claimpage')
        if (!hasBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        const billingDate = await this.page.$$('.claimpage td');
        let targetYearMatch = false;
        for (let element of billingDate) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes(`${this.year} Current Taxes Due`)) {
                targetYearMatch = true;
                break;
            }
        }

        if (!targetYearMatch) {
            console.error('Target year does not match');
            return { is_success: false, msg: `Target year does not match.` };
        }

        return { is_success: true, msg: "" };
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

export default WilkesBarreAreaSchoolDistrictREScript;
