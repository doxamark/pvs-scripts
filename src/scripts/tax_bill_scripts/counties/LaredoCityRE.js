import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class LaredoCityREScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.accountLookupString}`);

        await this.page.waitForSelector('#contentPanel', { visible: true })

        await this.page.waitForSelector('#searchMethod')
        // Select "Parcel" from the dropdown
        await this.page.select('#searchMethod', '4');

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Input the sample parcel number into the fields
        const parcelNumber = this.account;
        const [division, block, lot] = parcelNumber.split('-');

        await this.page.type('#parcel\\.parcelNumber1', division); // Division
        await this.page.type('#parcel\\.parcelNumber2', block);    // Block
        await this.page.type('#parcel\\.parcelNumber3', lot);      // Lot

        // Input the year
        await this.page.type('#taxYear4', this.year);

        // Click the submit button
        await this.page.click('#parcelSbmtBtn');

        // Wait for results
        await Promise.race([
            this.page.waitForSelector('.tableScroll', { visible: true }),
            this.page.waitForSelector('.dataTables_empty', { visible: true })
        ]);

        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('.dataTables_empty');
        let noBillFound = false;
        for (let element of errorMessages) {
        const text = await this.page.evaluate(el => el.textContent, element);
        if (text.includes('No data available in table')) {
            noBillFound = true;
            break;
        }
        }

        if (noBillFound) {
        console.error('No Bills Found. Please check your account number.', this.account);
        return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        // Loop through the results and find the correct link
        const links = await this.page.$$('table .odd a')
        let billLink = null 
        for (let link of links) {
            const text = await this.page.evaluate(el => el.textContent, link);
            if (text.trim().includes(this.account.replace(/-+$/, ''))) {
                billLink = link
                break;
            }    
        }

        if (!billLink) {
            console.error('No Print Link Found', this.account.replace(/-+$/, ''));
            return { is_success: false, msg: `No Print Link Found. ${this.account}` };
        }

        await billLink.click()

        // Wait for the result page to load
        await this.page.waitForSelector('.card-header.sub-header');

        const yearInfo = await this.page.$$('.card-header.sub-header')
        let targetYearMatch = false 
        for (let link of yearInfo) {
            const text = await this.page.evaluate(el => el.textContent, link);
            if (text.trim().includes(this.year)) {
                targetYearMatch = true
                break;
            }    
        }

        if (!targetYearMatch) {
            console.error("Target year does not match.")
            return { is_success: false, msg: `Target year does not match.` };
        }

        const billLinks = await this.page.$$('a.list-group-item')

        let viewBillLink = null 
        for (let bLink of billLinks) {
            const text = await this.page.evaluate(el => el.textContent, bLink);
            if (text.trim().includes('View Bill')) {
                viewBillLink = bLink
                break;
            }    
        }

        if (!viewBillLink) {
            console.error("No Bill Link Found")
            return { is_success: false, msg: `No Bill Link Found` };
        }

        viewBillLink.click()

        await new Promise(resolve => setTimeout(resolve, 3000));

        return { is_success: true, msg: "" };
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
            printBackground: true,
            margin: {
                top: '0.4in',    // Adjust the margin size as needed
                right: '0.4in',
                bottom: '0.4in',
                left: '0.4in'
            }
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }
}

export default LaredoCityREScript;
