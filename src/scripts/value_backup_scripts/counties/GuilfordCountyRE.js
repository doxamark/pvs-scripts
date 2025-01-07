import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class GuilfordCountyREScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        // Wait for either the error message or the bill view to be visible

        await Promise.race([
            this.page.waitForSelector('#ctl00_PageHeader1_ReidLabelInfo', { visible: true }),
            this.page.waitForSelector('#ctl00_PageHeader1_ErrorMessageLabel', { visible: true }),
            this.page.waitForSelector('.masterTableClass', { visible: true })
            
        ]);
    
        // Check if the error message is present and contains the specific text
        let errorMessages = await this.page.$$('#ctl00_PageHeader1_ErrorMessageLabel');
        let hasError = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('No Records Found')) {
                hasError = true;
                break;
            }
        }
    
        if (hasError) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        // Check if the error message is present and contains the specific text
        errorMessages = await this.page.$$('.masterTableClass');
        hasError = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('Application is currently unavailable.')) {
                hasError = true;
                break;
            }
        }
    
        if (hasError) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }
        

        await this.page.goto(this.accountLookupString.replace("PropertySummary.aspx", "PrintPRC.aspx"), { waitUntil: 'networkidle2' })

        await this.page.waitForSelector("#headerPlaceholder")

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

export default GuilfordCountyREScript;
