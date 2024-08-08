import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class RiversideCountyPPScript extends BaseScript {
    async performScraping() {

        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        // // Click the element with the text "BILL NUMBER"
        // await this.page.waitForSelector('h3.w-100.ml-3.ng-star-inserted');
        // const headers = await this.page.$$('h3.w-100.ml-3.ng-star-inserted');
        // for (const header of headers) {
        //     const text = await this.page.evaluate(el => el.textContent, header);
        //     console.log(text)
        //     if (text.trim() === 'BILL NUMBER') {
        //         await header.click();
        //         break;
        //     }
        // }

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

        // Wait for the table element
        await this.page.waitForSelector('table.table.table-condensed a');

        // Click the 'a' tag with 'view account' text
        const links = await this.page.$$('table.table.table-condensed a');
        for (const link of links) {
            const text = await this.page.evaluate(el => el.textContent, link);
            if (text.trim().includes('View Account')) {
                await link.click();
                break;
            }
        }
        // Wait for the element with the text "View Bill Detail" and click it
        await this.page.waitForSelector('a.btn.btn-default[style*="background-color:#aba7a7;float:right"]');
        const billLinks = await this.page.$$('a.btn.btn-default[style*="background-color:#aba7a7;float:right"]');
        for (const link of billLinks) {
            const text = await this.page.evaluate(el => el.textContent, link);
            if (text.trim().includes('View Bill Detail')) {
                await link.click();
                break;
            }
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
        
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
