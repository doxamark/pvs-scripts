import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class ClarkCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.accountLookupString}`);
        this.printLink = this.accountLookupString
        

        await Promise.race([
            this.page.waitForSelector('#MainContent_pnlRecordFound', { visible: true }),
            this.page.waitForSelector('#MainContent_lblNoRecordFound', { visible: true })
        ]);

        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('#MainContent_lblNoRecordFound');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('No record found for your selection.')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        const billingDate = await this.page.$$('#MainContent_lblBillingDate');
        let noBillingDateFound = false;
        for (let element of billingDate) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim() == '') {
                noBillingDateFound = true;
                break;
            }
        }

        if (noBillingDateFound) {
            console.error('No Billing Date Found.');
            return { is_success: false, msg: `No Billing Date Found.` };
        }


        return { is_success: true, msg: "" };
    }
}

export default ClarkCountyPPScript;
