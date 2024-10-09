import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class EastBatonRougeParishPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector('#searchFor1')
        await this.page.type('#searchFor1', this.account);

        const options = await this.page.$$eval('#taxyear option', elements =>
            elements.map(option => option.value)
        );
        
        this.year = String(this.year)
        if (options.includes(this.year)) {
            await this.page.select('#taxyear', this.year);
        } else {
            console.error('Target year does not match', this.account);
            return { is_success: false, msg: `Target year does not match. ${this.account}` };
        }

        await this.page.click("#searchButton")

        await new Promise(resolve => setTimeout(resolve, 2000));

        await this.page.waitForSelector(".detailsLink a")

        const viewLink = await this.page.$(".detailsLink a")

        if (!viewLink) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await viewLink.click()

        await this.page.waitForSelector("#details")

        const printBtns = await this.page.$$(".btn-primary")
        let printbtn = null
        for (let element of printBtns) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes(`Print`)) {
                printbtn = element;
            }
        }

        if (!printbtn) {
            console.error('Print button not found');
            return { is_success: false, msg: `Print button not found ${this.account}` };
        }

        return { is_success: true, msg: `` };
    }

    async saveAsPDF() {
        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); 
        }

        await this.page.waitForSelector("#dialog");
        await this.page.evaluate(() => {
            const dialogElement = document.querySelector('#dialog');

            // Check if #dialog element exists and is valid
            if (dialogElement) {
                // Clone the #dialog element to avoid moving the original one
                const clonedDialog = dialogElement.cloneNode(true);
                document.body.innerHTML = '';
                // Create a new div and append the cloned #dialog element to it
                const container = document.createElement('div');
                container.appendChild(clonedDialog);

                // Append the container to the now-empty body
                document.body.appendChild(container);

                const containerElements = document.getElementsByClassName('btn-primary');

                // If the element exists, remove it from the DOM
                Array.from(containerElements).forEach(element => {
                    element.remove();
                });

                return true; // Successfully added the element
            }
            return false; // Element not found or invalid
        });

        await this.page.addStyleTag({
            content: `
                .ui-widget-content {
                    border: none !important;
                }
            `
        });


        await new Promise(resolve => setTimeout(resolve, 1000));

        // Now generate the PDF with the updated DOM
        await this.page.pdf({
            path: this.outputPath,
            format: 'A4',
            printBackground: false,
        });

        console.log(`PDF saved: ${this.outputPath}`);

    }

}

export default EastBatonRougeParishPPScript;
