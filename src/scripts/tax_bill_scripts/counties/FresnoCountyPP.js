import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class FresnoCountyPPScript extends BaseScript {
    async performScraping() {
        this.accountLookupString = 'https://sonant.fresnocountyca.gov/paymentapplication'
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);


        const inputs = this.account.split(" ")
        if (inputs.length != 2) {
            console.error(`Bad Account Lookup - ${this.account}`)
            return { is_success: false, msg: `Bad Account Lookup - ${this.account}` };
        }

        let parcel_number = inputs[0]
        let sub_number = inputs[1]

        if (parcel_number.length < 8 || sub_number.length != 5 ) {
            console.error(`Bad Account Lookup - ${this.account}`)
            return { is_success: false, msg: `Bad Account Lookup - ${this.account}` };
        }

        let parcel_number_inputs = parcel_number.split("-")

        if (parcel_number_inputs.length != 3) {
            console.error(`Bad Account Lookup - ${this.account}`)
            return { is_success: false, msg: `Bad Account Lookup - ${this.account}` };
        }

        // Click the "Start Search" button
        await this.page.click('#StartSearch');

        // Wait for the "Property Type" element
        await this.page.waitForSelector('#timerow');

        // Select "Unsecured Property"
        await this.page.click('#PropertyTypeUnsecured');

        // Populate parcel number fields
        await this.page.type('#parcelnumber1', parcel_number_inputs[0]);
        await this.page.type('#parcelnumber2', parcel_number_inputs[1]);
        await this.page.type('#parcelnumber3', parcel_number_inputs[2]);

        // Populate sub number field
        await this.page.type('#subnumber', sub_number);

        // Click the "Submit" button
        await this.page.click('#Submit');

        // Wait for either the error message or the bill view to be visible
        await Promise.race([
            this.page.waitForSelector('input[value="View Tax Info"]', { visible: true }),
            this.page.waitForSelector('#NoRows', { visible: true })
        ]);

        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('#NoRows');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('There are no property taxes that match the Parcel Number you searched.')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        // Wait for the "View Tax Info" button
        await this.page.waitForSelector('input[value="View Tax Info"]');

        // Click the "View Tax Info" button
        await this.page.click('input[value="View Tax Info"]');

        // Wait for the "unsecuredDetails" element
        await this.page.waitForSelector('#unsecuredDetails');

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
            printBackground: true
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }
}

export default FresnoCountyPPScript;
