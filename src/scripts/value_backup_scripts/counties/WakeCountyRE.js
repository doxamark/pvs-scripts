import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class WakeCountyREScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector("div font")
    
        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('div font');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('No matching records were found')) {
                noBillFound = true;
                break;
            }
        }
    
        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        // Check if the error message is present and contains the specific text
        const labels = await this.page.$$('div font');
        let billFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('Account Summary')) {
                billFound = true;
                break;
            }
        }
    
        if (!billFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
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
            printBackground: false,
            scale: 0.9,
            margin: {
                top: '0.4in',    // Adjust the margin size as needed
                right: '0.4in',
                bottom: '0.4in',
                left: '0.4in'
            }
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }
}

export default WakeCountyREScript;
