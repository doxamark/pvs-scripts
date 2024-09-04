import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class MecklenburgCountyRE extends BaseScript {
    async performScraping() {

        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        if (!/^-?\d+$/.test(this.account)) {
            console.error('Bad Account Lookup', this.account)
            return { is_success: false, msg: `Bad account lookup: ${this.account}` };
        }

        // Step 1: Select "Abstract Number" from the dropdown
        await this.page.select('#lookupCriterion', 'Bill Number');

        // Step 2: Input text into the search box
        await this.page.type('#txtSearchString', this.account);

        // Step 3: Select the year
        await this.page.select('#taxYear', this.year);

        // Step 4: Click the "Go" button
        await this.page.click('#btnGo');

        // Wait for either the error message or the bill view to be visible
        await Promise.race([
            this.page.waitForSelector('#G_dgResults', { visible: true }),
            this.page.waitForSelector('#lblNoDataFound', { visible: true })
        ]);

        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('#lblNoDataFound');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('NO DATA FOUND, PLEASE REDEFINE YOUR SEARCH CRITERIA')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        // Step 5: Wait for the results table to appear
        await this.page.waitForSelector('#G_dgResults');

        // Step 6: Click the first result link
        await this.page.click('#dgResults_r_0 a');


        // Step 7: Wait for and click the "Printable Version" button
        await this.page.waitForSelector('#btnPrint');
        const [newPagePromise] = await Promise.all([
            new Promise(resolve => this.browser.once('targetcreated', target => resolve(target.page()))),
            this.page.click('#btnPrint')
        ]);


        const newPage = await newPagePromise;
        const newPageUrl = newPage.url();

        // // Optionally navigate to the new this.page URL if needed
        await this.page.goto(newPageUrl);
        await newPage.close();
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
            landscape: true,  // Set to landscape orientation
            printBackground: true
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }


}

export default MecklenburgCountyRE;
