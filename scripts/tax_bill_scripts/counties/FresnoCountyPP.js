import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class FresnoCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);


        const inputs = this.account.split(" ")
        if (inputs.length != 2) {
            return;
        }

        let parcel_number = inputs[0]
        let sub_number = inputs[1]

        let parcel_number_inputs = parcel_number.split("-")

        if (parcel_number_inputs.length != 3) {
            return;
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

        // Wait for the "View Tax Info" button
        await this.page.waitForSelector('input[value="View Tax Info"]');

        // Click the "View Tax Info" button
        await this.page.click('input[value="View Tax Info"]');

        // Wait for the "unsecuredDetails" element
        await this.page.waitForSelector('#unsecuredDetails');
    }


    async saveAsPDF() {
        this.outputPath = `outputs/FresnoCountyPP/${this.account}/${this.account}-${this.year}.pdf`;
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
