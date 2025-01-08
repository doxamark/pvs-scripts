import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class SaltLakeCountyREScript extends BaseScript {
    async performScraping() {
        
        if (this.accountLookupString) {
            this.accountLookupString = this.accountLookupString.replaceAll("-", "")
        }
        
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await Promise.race([
            this.page.waitForSelector('a[title="Printer Friendly Version"]', { visible: true }),
            this.page.waitForSelector('#content', { visible: true }),
            this.page.waitForSelector('#detailDiv', { visible: true })

            
        ]);
	
        let errorMessages = await this.page.$$('#content');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('An error occurred while executing the application.')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Results Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Results Found. Please check your account number. ${this.account}` };
        }

        errorMessages = await this.page.$$('#detailDiv');
        noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('does not seem to exist on the Tax Rolls')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Results Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Results Found. Please check your account number. ${this.account}` };
        }

        await this.page.click('a[title="Printer Friendly Version"]')

        await this.page.waitForSelector('#parcelFieldNames', { visible: true });

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
                top: '0.4in',    // Adjust the margin size as needed
                right: '0.4in',
                bottom: '0.4in',
                left: '0.4in'
            }
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }

}

export default SaltLakeCountyREScript;
