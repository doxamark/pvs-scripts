import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';


class PierceCountyScript extends BaseScript {
    async performScraping() {
        this.accountLookupString = `https://atip.piercecountywa.gov/propertySummary/${this.account}`;
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        try {
            // Wait for the 'btn-success' element to be present
            await this.page.waitForSelector('.btn-success', { visible: true, timeout: 20000 });

            // Set the print link to the current page URL
            this.printLink = this.page.url();
            console.log(`Print link found: ${this.printLink}`);
        } catch (error) {
            console.error(`An error occurred: ${error.message}`);
        }
    }

    async saveAsPDF() {
        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create the directory and any missing parent directories
        }
        await this.page.goto(this.printLink, { waitUntil: 'networkidle2' });

        await this.page.waitForSelector('.btn-success', { visible: true, timeout: 30000 });
        // Simulate wait for 5 seconds
        await this.page.evaluate(() => new Promise(resolve => setTimeout(resolve, 5000)));

        await this.page.pdf({
            path: this.outputPath,
            format: 'A4',
            printBackground: true
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }
}

export default PierceCountyScript;
