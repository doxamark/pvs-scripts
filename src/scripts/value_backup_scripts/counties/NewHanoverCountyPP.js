import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class NewHanoverCountyPPScript extends BaseScript {

    async performScraping() {
        await this.page.evaluateOnNewDocument(() => {
            window.print = () => {
                console.log("Print dialog suppressed")
            };
        });

        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);
        await this.page.waitForSelector("#printableversion")

        this.page.on('dialog', async dialog => {
            await dialog.dismiss(); // Dismiss the dialog (use dialog.accept() if you need to accept it)
        });
       
    
        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('#printableversion');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('No Data')) {
                noBillFound = true;
                break;
            }
        }
    
        if (noBillFound) {
            console.error('No Data Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Data Found. Please check your account number. ${this.account}` };
        }

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

export default NewHanoverCountyPPScript;
