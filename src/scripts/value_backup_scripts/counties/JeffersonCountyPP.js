import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class JeffersonCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector("#pin")
        await this.page.type("#pin", this.account)


        // Wait for either the error message or the bill view to be visible
        await Promise.race([
            this.page.waitForSelector('.text-accessibility-sm.text-accessibility-noclip', { visible: true }),
            this.page.waitForSelector('.row.form-group.has-warning.ng-scope', { visible: true })
        ]);
    
        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('.row.form-group.has-warning.ng-scope');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('No records found.')) {
                noBillFound = true;
                break;
            }
        }
    
        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        

        await this.page.waitForSelector(".text-accessibility-sm.text-accessibility-noclip")
        await this.page.click(".text-accessibility-sm.text-accessibility-noclip")
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.page.waitForSelector("#propertyRecordsSearchMiniSpaModule")

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
            printBackground: true,
            scale: 0.6,
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

export default JeffersonCountyPPScript;
