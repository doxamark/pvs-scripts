import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class DetroitCityPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        // Use $$ to find all buttons
        await this.page.waitForSelector('button');
        const buttons = await this.page.$$('button');
        let propertyTaxButton = null;

        for (const button of buttons) {
            const buttonText = await this.page.evaluate(el => el.innerText, button);
            if (buttonText.includes('Property Tax')) {
                propertyTaxButton = button;
                break;
            }
        }

        if (propertyTaxButton) {
            await propertyTaxButton.click();
        }

        // Wait for the input field to appear and enter the Parcel ID
        await this.page.waitForSelector('#mat-input-0');
        await this.page.type('#mat-input-0', this.account);

        // Wait for the "Find account" button to appear and click it
        await this.page.waitForSelector('button.mat-raised-button.mat-primary');
        await this.page.click('button.mat-raised-button.mat-primary');

        await new Promise(resolve => setTimeout(resolve, 3000));
        await this.page.waitForSelector('dx-list');
        const dxLists = await this.page.$$('dx-list');

        // Identify the specific dx-list by checking its children or other properties
        let specificDxList = null;
        for (const dxList of dxLists) {
            const childText = await this.page.evaluate(el => el.textContent, dxList);

            // Check if the dx-list contains specific characteristics
            if (childText.includes('Property Tax') && childText.includes('Parcel ID')) {
                specificDxList = dxList;
                break;
            }
        }
    }


    async saveAsPDF() {

        await this.page.evaluate(() => {
            document.querySelectorAll('.no-print').forEach(element => {
                element.classList.remove('no-print');
            });
        });
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

export default DetroitCityPPScript;
