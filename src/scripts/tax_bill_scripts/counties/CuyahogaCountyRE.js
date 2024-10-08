import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class CuyahogaCountyREScript extends BaseScript {
    async performScraping() {

        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector('#txtData')
        await this.page.type('#txtData', this.account);

        await this.page.click('#btnSearch')

        await Promise.race([
            this.page.waitForSelector('#btnLgcyTaxes', { visible: true }),
            this.page.waitForSelector('.notFoundMessage', { visible: true })
          ]);

        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('.notFoundMessage');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('No results found.')) {
                noBillFound = true;
                break;
            }
        }
    
        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector("#btnLgcyTaxes")
        await this.page.click("#btnLgcyTaxes")
        await this.page.waitForSelector(".taxDataBody")


        const yearLabels = await this.page.$$(".taxDataBody h3")
        let hasTargetYear = false
        for (let element of yearLabels) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes(`Tax Year ${this.year}`)) {
                hasTargetYear = true;
                break;
            }
        }
    
        if (!hasTargetYear) {
            console.error('Target year does not match for account', this.account);
            return { is_success: false, msg: `Target year does not match for account ${this.account}` };
        }

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
            scale: 0.5,
            landscape: true,
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

export default CuyahogaCountyREScript;
