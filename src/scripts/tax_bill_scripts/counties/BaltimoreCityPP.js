import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class BaltimoreCityPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector('#accountNumber')
        await this.page.type('#accountNumber', this.account);

        await this.page.click('#buttonSubmitAccountNumber')

        await Promise.race([
            this.page.waitForSelector('#SelectPersonalPropertySearchModalTable_wrapper', { visible: true }),
            this.page.waitForSelector('.modal-body h5', { visible: true })
          ]);

        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('.modal-body h5');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('No Accounts found')) {
                noBillFound = true;
                break;
            }
        }
    
        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector("#SelectPersonalPropertySearchModalTable_wrapper")


        const btnLinks = await this.page.$$("a.btn.btn-primary")
        let btnLink = null
        for (let element of btnLinks) {
            const text = await this.page.evaluate(el => el.getAttribute("href"), element);
            if (text.includes(this.account)) {
                btnLink = element;
                break;
            }
        }
    
        if (!btnLink) {
            console.error('Target year does not match for account', this.account);
            return { is_success: false, msg: `Target year does not match for account ${this.account}` };
        }

        await btnLink.click()

        await new Promise(resolve => setTimeout(resolve, 1000));

        await this.page.waitForSelector(".table.table-striped")

        const yearLabels = await this.page.$$(".table.table-striped tr")
        let hasTargetYear = false
        for (let element of yearLabels) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes(`Tax Year`) && text.includes(this.year)) {
                hasTargetYear = true;
                break;
            }
        }
    
        if (!hasTargetYear) {
            console.error('Target year does not match for account', this.account);
            return { is_success: false, msg: `Target year does not match for account ${this.account}` };
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
            scale: 1,
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

export default BaltimoreCityPPScript;
