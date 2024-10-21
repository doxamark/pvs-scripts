import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class KingCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        // Wait for the input field next to h6 with text 'Bill Number' and input a value
        await this.page.waitForSelector('#searchParcel');
        await this.page.type('#searchParcel', this.account)
        await this.page.click('.btn.btn-primary')

        await this.page.waitForSelector("#parcelPanels")

        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('.alert.alert-danger');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('NO TAXES ARE DUE AT THIS TIME.')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
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

        await this.page.addStyleTag({
            content: `
              .panel.panel-accordion-primary-dark:not(:first-child) {
                display: none !important;
              }
            `
          });

        await this.page.pdf({
            path: this.outputPath,
            format: 'A4',
            printBackground: true
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }
}

export default KingCountyPPScript;
