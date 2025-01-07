import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class GuilfordCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        if (/[^0-9]/.test(this.account)) {
            console.error('Invalid account number. Please check your account number.', this.account);
            return { is_success: false, msg: `Invalid account number. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector("#lookupCriterion")

        await this.page.select("#lookupCriterion", "Abstract Number")
        await this.page.type("#txtSearchString", this.account)
        await this.page.click("#btnGo")



        // Wait for either the error message or the bill view to be visible

        await Promise.race([
            this.page.waitForSelector('#dgResults_r_0', { visible: true }),
            this.page.waitForSelector('#lblNoDataFound', { visible: true })
            
        ]);
    
        // Check if the error message is present and contains the specific text
        let errorMessages = await this.page.$$('#lblNoDataFound');
        let hasError = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('NO DATA FOUND, PLEASE REDEFINE YOUR SEARCH CRITERIA')) {
                hasError = true;
                break;
            }
        }
    
        if (hasError) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }
        

        await this.page.click("#dgResults_r_0 a")

        await this.page.waitForSelector("#pageLabel")

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
            margin: {
                top: '0.5in',    // Adjust the margin size as needed
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            }
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }
}

export default GuilfordCountyPPScript;
