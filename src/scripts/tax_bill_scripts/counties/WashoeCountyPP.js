import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class WashoeCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);
        
        const inputSelector = 'input.form-control.ng-untouched.ng-pristine.ng-valid.ng-star-inserted';
        await Promise.race([
            this.page.waitForSelector(inputSelector, { visible: true }),
            this.page.waitForSelector('h4.text-center.ng-star-inserted', { visible: true })
        ]);

        const errorMessages = await this.page.$$('h4.text-center.ng-star-inserted');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('No Result Found.')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Results Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Results Found. Please check your account number. ${this.account}` };
        }



        // Type text into the input element
        await this.page.type(inputSelector, this.account);
        const searchButtonSelector = 'button.btn.btn-primary.btn-icon.mr-2[title="Search"]';
        await this.page.click(searchButtonSelector);

        const printButtonSelector = 'button.mr-2.mb-2.k-button.k-primary[title="Print Page"]';
        await this.page.waitForSelector(printButtonSelector);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const zeroBill = await this.page.$$('.public-access-payment-bill-module payment-bill .bill-main .bill-header__total-amount', { visible: true });
        let hasZeroBill = false;
        for (let element of zeroBill) {
        const text = await this.page.evaluate(el => el.textContent, element);
        if (text.includes('$0.00')) {
            hasZeroBill = true;
            break;
        }
        }

        if (hasZeroBill) {
            console.error('Result has $0.00 payable. Id =', this.account);
            return { is_success: false, msg: `Result has $0.00 payable.` };
        }

        return { is_success: true, msg: "" };
        

    }

    async saveAsPDF() {
        await new Promise(resolve => setTimeout(resolve, 3000));
        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        await this.page.addStyleTag({
            content: `
                * {
                    background: #fff !important;
                    color: #000 !important;
                }

                .dnn-page-header, .skin-top-page-toolbar, .breadcrumb-area__container, .skin-page-footer{
                    display: none !important;
                }

                .breadcrumb-area {
                    padding: 10px !important;
                }

                @media print {
                    * {
                        background: #fff !important;
                        color: #000 !important;
                    }
                }
            `
        });
    
        await this.page.pdf({
            path: this.outputPath,
            format: 'A4',
            printBackground: false
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }
}

export default WashoeCountyPPScript;
