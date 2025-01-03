import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class MultnomahCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector('.searchText.defaultTextValue')
        await this.page.type('.searchText.defaultTextValue', this.account);

        await this.page.click('#SearchButtonDiv')

        await this.page.waitForSelector('#grid')

        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('#grid td');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('No properties found.')) {
            noBillFound = true;
            break;
            }
        }
    
        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        const billItems = await this.page.$$('#grid td');
        let billItem = null;
        for (let element of billItems) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes(this.account)) {
                billItem = element;
                break;
            }
        }
    
        if (!billItem) {
            console.error('No Bills Found on the table. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await billItem.click()

        await new Promise(resolve => setTimeout(resolve, 2000));

        await this.page.waitForSelector("#dnn_ctr380_View_thTotalAssessedValueTitle")
        const yearLabels = await this.page.$$("#dnn_ctr380_View_thTotalAssessedValueTitle")
        let hasTargetYear = false
        for (let element of yearLabels) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes(this.year)) {
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
            printBackground: false
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }


}

export default MultnomahCountyPPScript;
