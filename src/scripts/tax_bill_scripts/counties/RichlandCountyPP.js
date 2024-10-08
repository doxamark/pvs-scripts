import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class RichlandCountyPPScript extends BaseScript {
    async performScraping() {
        this.year = String(this.year)
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector('.mnuMain_1.menuItem.mnuMain_3')

        const typeLinks = await this.page.$$('.mnuMain_1.menuItem.mnuMain_3');
        let businessPropertyLink = null;
        for (let element of typeLinks) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('Business')) {
                businessPropertyLink = element;
                break;
            }
        }
    
        if (!businessPropertyLink) {
            console.error('Type not found. Please check your account number.', this.account);
            return { is_success: false, msg: `Type not found. Please check your account number. ${this.account}` };
        }
        await businessPropertyLink.click()


        await this.page.waitForSelector("#txtYearBusiness3")
        await this.page.type('#txtYearBusiness3', this.year);

        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.page.waitForSelector("#txtStateNumberBusiness")
        await this.page.type('#txtStateNumberBusiness', this.account)


        await this.page.click('#btnSubmitBusiness')

        await Promise.race([
            this.page.waitForSelector('#gvBusiness', { visible: true }),
            this.page.waitForSelector('#lblErrorBusiness6', { visible: true })
          ]);
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('#lblErrorBusiness6');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('not found')) {
                noBillFound = true;
                break;
            }
        }
    
        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }


        await this.page.waitForSelector("#gvBusiness a")
        await this.page.click("#gvBusiness a")

        await this.page.waitForSelector("#btnTaxInfoPrintBusiness")
        await this.page.click("#btnTaxInfoPrintBusiness")

        await this.page.waitForSelector(".receipttable")

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
                top: '0.1in',    // Adjust the margin size as needed
                right: '0.5in',
                bottom: '0.1in',
                left: '0.5in'
            }
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }


}

export default RichlandCountyPPScript;
