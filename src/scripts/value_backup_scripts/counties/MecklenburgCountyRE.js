import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class MecklenburgCountyREScript extends BaseScript {

    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await Promise.race([
            this.page.waitForSelector('#prccontent', { visible: true }),
            this.page.waitForSelector('#alert-content', { visible: true })
        ]);

        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('#alert-content');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('No results found')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector("#prccontent")

        await new Promise(resolve => setTimeout(resolve, 2000));
        

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
                top: '0.3in',    // Adjust the margin size as needed
                right: '0.7in',
                bottom: '0.3in',
                left: '0.7in'
            },
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }
}

export default MecklenburgCountyREScript;
