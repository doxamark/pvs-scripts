import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class StTammanyParishPPcript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector('#ContentPlaceHolder1_body_cboSearchBy')
        await this.page.select('#ContentPlaceHolder1_body_cboSearchBy', 'Bill#');

        await this.page.waitForSelector('#ContentPlaceHolder1_body_ddlTaxYear');

        this.year = String(this.year)
        const options = await this.page.$$eval('#ContentPlaceHolder1_body_ddlTaxYear option', elements =>
            elements.map(option => option.value)
        );

        if (options.includes(this.year)) {
            await this.page.select('#ContentPlaceHolder1_body_ddlTaxYear', this.year);
        } else {
            console.error('Target year does not match', this.account);
            return { is_success: false, msg: `Target year does not match. ${this.account}` };
        }

        await this.page.waitForSelector('#ContentPlaceHolder1_body_txtTaxBillNum_In')
        await this.page.type('#ContentPlaceHolder1_body_txtTaxBillNum_In', this.account);

        await this.page.click("#ContentPlaceHolder1_body_btSearch")

        await Promise.race([
            this.page.waitForSelector('#ContentPlaceHolder1_body_dvOneResult', { visible: true }),
            this.page.waitForSelector('#ContentPlaceHolder1_body_lblError', { visible: true })
        ]);

        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('#ContentPlaceHolder1_body_lblError');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('No properties were found for your search.')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector("#ContentPlaceHolder1_body_dvOneResult")

        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await this.page.waitForSelector("#ContentPlaceHolder1_body_btViewHistory")
        await this.page.click("#ContentPlaceHolder1_body_btViewHistory")

        return { is_success: true, msg: `` };
    }

    async saveAsPDF() {
        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create the directory and any missing parent directories
        }

        await this.page.addStyleTag({
            content: `
                * {
                    background: #fff !important;
                    color: #000 !important;
                }

                img, input {
                    filter: grayscale(100%);
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

export default StTammanyParishPPcript;
