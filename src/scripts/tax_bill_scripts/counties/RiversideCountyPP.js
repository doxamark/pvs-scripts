import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class RiversideCountyPPScript extends BaseScript {
    async performScraping() {

        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        // Wait for the input field next to h6 with text 'Bill Number' and input a value
        await this.page.waitForSelector('div.mb-1.mt-1.col-sm-12.d-flex.align-items-center.ng-star-inserted');
        const divs = await this.page.$$('div.mb-1.mt-1.col-sm-12.d-flex.align-items-center.ng-star-inserted');
        for (const div of divs) {
            const h6 = await div.$('h6.d-inline-block.col-sm-2');
            if (h6) {
                const text = await this.page.evaluate(el => el.textContent, h6);
                if (text.trim() === 'PIN (9-digits)') {
                    const input = await div.$('input.form-control.col-sm-2');
                    if (input) {
                        await input.type(this.account);
                    }
                    break;
                }
            }
        }

        // Click the button with the title "Search"
        await this.page.waitForSelector('button[title="Search"]');
        const buttons = await this.page.$$('button[title="Search"]');
        for (const button of buttons) {
            const text = await this.page.evaluate(el => el.textContent, button);
            if (text.trim().includes('Search')) {
                await button.click();
                break;
            }
        }

        // Wait for either the error message or the bill view to be visible
    await Promise.race([
        this.page.waitForSelector('.table.table.table-condensed a', { visible: true }),
        this.page.waitForSelector('h4.ng-star-inserted', { visible: true })
      ]);
  
      // Check if the error message is present and contains the specific text
      const errorMessages = await this.page.$$('h4.ng-star-inserted');
      let noBillFound = false;
      for (let element of errorMessages) {
        const text = await this.page.evaluate(el => el.textContent, element);
        if (text.includes('No Result Found')) {
          noBillFound = true;
          break;
        }
      }
  
      if (noBillFound) {
        console.error('No Bills Found. Please check your account number.', this.account);
        return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
      }
      
        // Wait for the table element
        await this.page.waitForSelector('table.table.table-condensed a');

        const status = await this.page.$('.badge.badge-warning')
        if (status) {
            const textStatus = await this.page.evaluate(el => el.textContent, status);
            if (textStatus && textStatus.trim().includes('Inactive')) {
                console.error('Bill is inactive.', this.account);
                return { is_success: false, msg: `Bill is inactive. ${this.account}` };
            }
        }
        

        // Click the 'a' tag with 'view account' text
        const links = await this.page.$$('table.table.table-condensed a');
        for (const link of links) {
            const text = await this.page.evaluate(el => el.textContent, link);
            if (text.trim().includes('View Account')) {
                await link.click();
                break;
            }
        }

        await this.page.waitForSelector('#headingPaid button')
        await this.page.click('#headingPaid button');

        // Wait for the element with the text "View Bill Detail" and click it
        await this.page.waitForSelector('a.btn.btn-default[style*="background-color:#aba7a7;float:right"]');
        const billLinks = await this.page.$$('a.btn.btn-default[style*="background-color:#aba7a7;float:right"]');
        for (const link of billLinks) {
            const text = await this.page.evaluate(el => el.textContent, link);
            if (text.trim().includes('View Bill Detail')) {
                const parentTh = await this.page.evaluateHandle(el => el.closest('th'), link);

                // Get the sibling <span> element that contains the bill number
                const billNumberSpan = await parentTh.$('span');

                if (billNumberSpan) {
                    // Extract the text content of the span
                    const billNumberText = await this.page.evaluate(el => el.textContent, billNumberSpan);

                    // Use a regular expression to extract the bill year from the bill number
                    const yearMatch = billNumberText.match(/Bill Number:\s(\d{4})/);
                    if (yearMatch && yearMatch[1] === this.year) {
                        // Click the link if the bill year is 2023
                        await link.click();
                        break;
                    }
                }
            }
        }

        await new Promise(resolve => setTimeout(resolve, 3000));

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
            printBackground: true
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }


}

export default RiversideCountyPPScript;
