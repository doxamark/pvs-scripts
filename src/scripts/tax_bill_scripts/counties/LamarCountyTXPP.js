import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class LamarCountyTXPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);
        
        await Promise.race([
            this.page.waitForSelector('#detail-page', { visible: true }),
            this.page.waitForSelector('.well h4', { visible: true })
        ]);

        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('.well h4');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('An Error Occurred')) {
                noBillFound = true;
                break;
            }
        }
    
        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector("#detail-page")



        const valueElements = await this.page.$$(".table-number");
        let hasNoValue = false;
        for (let element of valueElements) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('N/A')) {
                hasNoValue = true;
                break;
            }
        }
    
        if (hasNoValue) {
            console.error('Bill has no value yet. Please check your account number.', this.account);
            return { is_success: false, msg: `Bill has no value yet. Please check your account number. ${this.account}` };
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
            scale: 0.9,
            margin: {
                top: '0.1in',    // Adjust the margin size as needed
                right: '0.2in',
                bottom: '0.1in',
                left: '0.2in'
            }
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }


}

export default LamarCountyTXPPScript;
