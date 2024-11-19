import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class DekalbCountyREScript extends BaseScript {

    async performScraping() {
        await this.page.evaluateOnNewDocument(() => {
            window.print = () => {
                console.log("Print dialog suppressed")
            };
        });

        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);
        await this.page.waitForSelector("#btAgree")
        await this.page.click("#btAgree")

        await this.page.waitForSelector("#inpParid")
        await this.page.type("#inpParid", this.account)
        await this.page.click("#btSearch")

        // Wait for either the error message or the bill view to be visible
        await Promise.race([
            this.page.waitForSelector('.SearchResults', { visible: true }),
            this.page.waitForSelector('p', { visible: true })
        ]);
    
        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('p');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('Your search did not find any records')) {
                noBillFound = true;
                break;
            }
        }
    
        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector(".SearchResults")
        await this.page.click(".SearchResults")

        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.page.waitForSelector(".sel")
        
        

        

        const [newPagePromise] = await Promise.all([
            new Promise(resolve => this.browser.once('targetcreated', target => resolve(target.page()))),
            await this.page.waitForSelector("#DTLNavigator_lbPrintAll a"),
            this.page.click('#DTLNavigator_lbPrintAll a')
        ]);

        const newPage = await newPagePromise;
        const newPageUrl = newPage.url();

        newPage.on('dialog', async dialog => {
            await dialog.dismiss(); // Dismiss the dialog (use dialog.accept() if you need to accept it)
        });

        // Optionally navigate to the new page URL if needed
        await new Promise(resolve => setTimeout(resolve, 3000));
        await newPage.close();

        await this.page.goto(newPageUrl, { waitUntil: 'networkidle2' });
        

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

export default DekalbCountyREScript;
