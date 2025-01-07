import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class BuncombeCountyREScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        // Wait for either the error message or the bill view to be visible

        await this.page.waitForSelector(".submitButton")
        await this.page.click(".submitButton")

        await new Promise(resolve => setTimeout(resolve, 1000));

        await Promise.race([
            this.page.waitForSelector('.print-preview', { visible: true }),
            this.page.waitForSelector('.error-template', { visible: true })
        ]);
    
        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('.error-template');
        let hasError = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('Sorry, the requested page has not been found')) {
                hasError = true;
                break;
            }
        }
    
        if (hasError) {
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
            printBackground: true
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }
}

export default BuncombeCountyREScript;
