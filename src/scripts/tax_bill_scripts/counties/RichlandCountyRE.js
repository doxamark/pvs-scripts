import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class RichlandCountyREScript extends BaseScript {
    async performScraping() {
        this.year = String(this.year)
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector('.mnuMain_1.menuItem.mnuMain_3')

        const typeLinks = await this.page.$$('.mnuMain_1.menuItem.mnuMain_3');
        let realEstateLink = null;
        for (let element of typeLinks) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('Real Estate')) {
                realEstateLink = element;
                break;
            }
        }
    
        if (!realEstateLink) {
            console.error('Type not found. Please check your account number.', this.account);
            return { is_success: false, msg: `Type not found. Please check your account number. ${this.account}` };
        }
        await realEstateLink.click()


        await this.page.waitForSelector("#txtYearRealEstate3")
        await this.page.type('#txtYearRealEstate3', this.year);

        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.page.waitForSelector("#txtTMSRealEstate")
        await this.page.type('#txtTMSRealEstate', this.account)


        await this.page.click('#btnSubmitRealEstate')

        await Promise.race([
            this.page.waitForSelector('#gvRealEstate', { visible: true }),
            this.page.waitForSelector('#lblErrorRealEstate6', { visible: true })
          ]);
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('#lblErrorRealEstate6');
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


        await this.page.waitForSelector("#gvRealEstate a")
        await this.page.click("#gvRealEstate a")

        await this.page.waitForSelector("#btnTaxInfoPrintReal")
        await this.page.click("#btnTaxInfoPrintReal")

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

export default RichlandCountyREScript;
