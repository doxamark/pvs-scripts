import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class DekalbCountyPPScript extends BaseScript {
    async performScraping() {
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
        await this.page.waitForSelector(".unsel")
        
        const sections = await this.page.$$('.unsel');
        let section = null
        for (let sec of sections) {
            const labelText = await this.page.evaluate(el => el.textContent, sec);
            if (labelText.trim().includes("Personal Property Profile")) {
                section = sec
                break
            }
        }

        if (!section) {
            console.error("Couldn't get Personal Property Profile", this.account);
            return { is_success: false, msg: `Couldn't get Personal Property Profile. ${this.account}` };
        }

        await section.click()

        await this.page.waitForSelector("#DTLNavigator_lbPrintThis a")

        

        return { is_success: true, msg: `` };
    }

    async saveAsPDF() {
        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create the directory and any missing parent directories
        }

        await this.page.addStyleTag({
            content: `
                #outerheader, footer, #sidemenu, #trTaxYear  {
                    display: none !important;
                }
            `
        });

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
            scale: 1.1,
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }
}

export default DekalbCountyPPScript;
