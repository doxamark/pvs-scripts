import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class ClarkCountyREScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);
        this.year = this.year + ""
       
        // Wait for either the error message or the bill view to be visible
        await Promise.race([
            this.page.waitForSelector('#MainContent_lblFiscalYear', { visible: true }),
            this.page.waitForSelector('#MainContent_lblNoRecordFound', { visible: true })
        ]);

        // Check if the error message is present and contains the specific text
        const errorMesages = await this.page.$$('#MainContent_lblNoRecordFound');
        let noBillFound = false;
        for (let element of errorMesages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes("No record found for your selection.")) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }



        // Check if the error message is present and contains the specific text
        const yearLabels = await this.page.$$('#MainContent_lblFiscalYear');
        let hasTargetYear = false;
        for (let element of yearLabels) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes(this.year.replace("20", ""))) {
                hasTargetYear = true;
                break;
            }
        }

        if (!hasTargetYear) {
            console.error('Target year does not match', this.account);
            return { is_success: false, msg: `Target year does not match. ${this.account}` };
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

export default ClarkCountyREScript;