import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class ChathamCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector("#btAgree")
        await this.page.click("#btAgree")

        await this.page.waitForSelector('#inpParid')
        await this.page.type('#inpParid', this.account);

        await this.page.click('#btSearch')

        await Promise.race([
            this.page.waitForSelector('#searchResults', { visible: true }),
            this.page.waitForSelector('p', { visible: true })
          ]);

        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('p');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('Your search did not find any records.')) {
                noBillFound = true;
                break;
            }
        }
    
        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        const billItems = await this.page.$$('#searchResults td');
        let billItem = null;
        for (let element of billItems) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes(this.account)) {
                billItem = element;
                break;
            }
        }
    
        if (!billItem) {
            console.error('No Bills Found on the table. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        
        
        const yearLabels = await this.page.$$("#searchResults td")
        let hasTargetYear = false
        for (let element of yearLabels) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes(this.year)) {
                hasTargetYear = true;
                break;
            }
        }
    
        if (!hasTargetYear) {
            console.error('Target year does not match', this.account);
            return { is_success: false, msg: `Target year does not match. ${this.account}` };
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        await billItem.click()



        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.page.waitForSelector("td#DTLNavigator_lbPrintThis")
        await new Promise(resolve => setTimeout(resolve, 1000));


        return { is_success: true, msg: `` };
    }

    async saveAsPDF() {
        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create the directory and any missing parent directories
        }

        await this.page.addStyleTag({
            content: `
                #sidemenu, #trTaxYear, #footerarea, #outerheader {
                    display: none !important;
                }

                /* Specifically show only the #frmMain element */
                #frmMain {
                    display: block !important;
                    // width: 100vw !important;
                    // height: 100vh !imporatant;
                }

                .contentpanel {
                    -webkit-box-shadow: none !important; /* For older versions of Safari */
                    box-shadow: none !important; /* Standard box-shadow removal */
                    border: none !important;
                }

                #wrapper {
                    margin-top: 0px !important;
                }

                table {
                    display: block  !important;
                }

            `
        });

        await this.page.pdf({
            path: this.outputPath,
            format: 'A4',
            printBackground: true,
            scale: 1.4,
            margin: {
                top: '0.1in',    // Adjust the margin size as needed
                right: '0.7in',
                bottom: '0.1in',
                left: '0.7in'
            }
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }


}

export default ChathamCountyPPScript;
