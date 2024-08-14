import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class WakeCountyPP extends BaseScript {
    async performScraping() {

        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        // Create a selector for the <td> element with class 'medFont' that contains the <a> tag with the specific title
        const tdSelector = 'td.medFont a[title="Go To Billing Statement"]';

        // Wait for the <td> elements with the correct <a> tag to appear
        await this.page.waitForSelector(tdSelector);

        // Get all matching <a> elements
        const links = await this.page.$$eval(tdSelector, (elements) => {
            return elements.map(element => ({
                href: element.getAttribute('href'),
                text: element.innerText.trim(),
            }));
        });

        // Loop through the results to find the one with the matching account and year pattern
        let foundLink = null;
        for (const link of links) {
            const regex = new RegExp(`${this.account}-${this.year}-${this.year}-\\d{6}`);
            if (regex.test(link.text)) {
                foundLink = link.href;
                break;
            }
        }

        if (!foundLink) {
            return false;
        }

        await this.page.evaluate((link) => {
            eval(link); // Trigger the JavaScript function
        }, foundLink);

        // Now look for the element containing the printer-friendly version link
        const printerLinkSelector = 'td a[onclick*="media=print"]';

        // Wait for the printer-friendly link to appear
        await this.page.waitForSelector(printerLinkSelector);

        const [newPagePromise] = await Promise.all([
            new Promise(resolve => this.browser.once('targetcreated', target => resolve(target.page()))),
            this.page.click(printerLinkSelector)
        ]);


        const newPage = await newPagePromise;
        const newPageUrl = newPage.url();

        // // Optionally navigate to the new this.page URL if needed
        await this.page.goto(newPageUrl);
        await newPage.close();

        const printLinkSelector = 'a[href="javascript:window.print();"]';

        // Wait for the print link to appear
        await this.page.waitForSelector(printLinkSelector, { visible: true });

        return true;
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
                top: '0.4in',    // Adjust the margin size as needed
                right: '0.4in',
                bottom: '0.4in',
                left: '0.4in'
            }
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }

}

export default WakeCountyPP;
