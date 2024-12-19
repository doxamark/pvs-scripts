import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class MecklenburgCountyPPScript extends BaseScript {

    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        if (!this.account || isNaN(this.account)) {
            console.error('The account value must be numeric. Please check your account number.', this.account);
            return { is_success: false, msg: `The account value must be numeric. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector("#lookupCriterion")
        await this.page.select("#lookupCriterion", "Abstract Number")

        await this.page.type("#txtSearchString", this.account)

        const targetYears = await this.page.$$("#taxYear option")
        let hasTargetYear = false
        for (let element of targetYears) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes(this.year)) {
                hasTargetYear = true;
                break;
            }
        }
    
        if (!hasTargetYear) {
            console.error('Target year does not match for account', this.account);
            return { is_success: false, msg: `Target year does not match for account ${this.account}` };
        }


        await this.page.click("#btnGo")

        await Promise.race([
            this.page.waitForSelector('#G_dgResults', { visible: true }),
            this.page.waitForSelector('#lblNoDataFound', { visible: true })
        ]);

        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('#lblNoDataFound');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('NO DATA FOUND, PLEASE REDEFINE YOUR SEARCH CRITERIA')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector("#G_dgResults #dgResults_r_0")
        await this.page.click("#dgResults_r_0 a")

        await this.page.waitForSelector("#lblTotalAmountDueLabel")
        
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
                top: '0.3in',    // Adjust the margin size as needed
                right: '0.7in',
                bottom: '0.3in',
                left: '0.7in'
            },
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }
}

export default MecklenburgCountyPPScript;
