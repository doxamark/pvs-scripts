import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class StanislausCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        // Wait for the search filters div and select the current year
        await this.page.waitForSelector('#SearchDiv');
        await this.page.select('#SelTaxYear', this.year);

        await this.page.waitForSelector('select#SearchVal');
        await this.page.select('select#SearchVal', 'asmt');

        // Input the search term
        await this.page.type('#SearchValue', this.account);

        // Click the search button
        await this.page.click('#SearchSubmit');

        // Wait for the results section
        await this.page.waitForSelector('#ResultDiv');

        await Promise.race([
            this.page.waitForSelector('#ResultDiv .title a', { visible: true }),
            this.page.waitForSelector('#ResultDiv .alert-warning', { visible: true })
        ]);

        const errorMessages = await this.page.$$('#ResultDiv .alert-warning');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('no matching records were found')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Results Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Results Found. Please check your account number. ${this.account}` };
        }

        const links = await this.page.$$('#ResultDiv .title a');
        for (const link of links) {
            const text = await this.page.evaluate(el => el.textContent, link);
            if (text === this.account) {
                await link.click();
                break;
            }
        }

        // Wait for the this.page to load after clicking the link
        await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
        const isTextDangerPresent = await this.page.evaluate(() => {
            return document.querySelector('a.text-danger') !== null;
          });
        
        if (!isTextDangerPresent) {
            console.error('No download link');
            return { is_success: false, msg: `No download link.` };
        }
        return { is_success: true, msg: `` };
    }

    async saveAsPDF() {
        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const customPath = path.resolve(`src/temp/${this.account}`);
        const client = await this.page.createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow', downloadPath: customPath
        });

        // Wait for and click the "VIEW TAX BILL" link
        await this.page.waitForSelector('a.text-danger');
        const billLinkSelector = 'a.text-danger';
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.page.click(billLinkSelector, { clickCount: 1});
        
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Wait for the file to download
        while (!fs.existsSync(customPath) || fs.readdirSync(customPath).length === 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Rename the file inside the customPath to this.outputPath
        const files = fs.readdirSync(customPath);
        if (files.length > 0) {
            const downloadedFile = path.join(customPath, files[0]);
            const outputFilePath = path.resolve(this.outputPath);

            try {
                fs.renameSync(downloadedFile, outputFilePath);
            } catch (err) {
                if (err.code === 'EXDEV') {
                    fs.copyFileSync(downloadedFile, outputFilePath);
                    fs.unlinkSync(downloadedFile);
                } else {
                    throw err;
                }
            }

            fs.rmSync(customPath, { recursive: true });
        }

        console.log(`PDF saved: ${this.outputPath}`);

    }
}

export default StanislausCountyPPScript;
