import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class SacramentoCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString.replaceAll("-",""), { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await new Promise(resolve => setTimeout(resolve, 3000));
        
        await Promise.race([
            this.page.waitForSelector('#billDetailGrid', { visible: true }),
            this.page.waitForSelector('div.alert-info', { visible: true })
        ]);

        const errorMessages = await this.page.$$('div.alert-info');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('No bills are payable at this time.')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Results Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Results Found. Please check your account number. ${this.account}` };
        }

        // Click the bill number link
        await this.page.click('a[data-bind*="text: FullBillNumber"]');
        return { is_success: true, msg: `` };
    }

    async saveAsPDF() {

        if (!this.outputPath) {
            return;
        }

        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const customPath = path.resolve(`src/temp/${this.account}`);

        const match = this.page.url().match(/\/BillDetail\/(\d+)/);
        const tempFileName = `${match}.pdf`;
        const tempFilePath = path.join(customPath, tempFileName);


        const client = await this.page.createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow', downloadPath: customPath
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        await this.page.waitForSelector('a[target="_blank"][data-bind*="BillImageLink"]');
        const billLinkSelector = 'a[target="_blank"][data-bind*="BillImageLink"]'
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.page.click(billLinkSelector, { clickCount: 1 });

        await new Promise(resolve => setTimeout(resolve, 3000));

        // Wait for the file to download
        while (!fs.existsSync(tempFilePath)) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Rename the downloaded file
        const files = fs.readdirSync(customPath);
        if (files.length > 0) {
            const downloadedFile = path.resolve(tempFilePath);
            const outputFilePath = path.resolve(this.outputPath);

            try {
                // Attempt to rename the file
                fs.renameSync(downloadedFile, outputFilePath);
            } catch (err) {
                if (err.code === 'EXDEV') {
                    // Handle cross-device link error by copying and then deleting
                    fs.copyFileSync(downloadedFile, outputFilePath);
                    fs.unlinkSync(downloadedFile);
                } else {
                    throw err; // Re-throw error if it's not an EXDEV error
                }
            }

            // Remove the directory if needed
            fs.rmSync(customPath, { recursive: true });
        }

        console.log(`PDF saved: ${this.outputPath}`);

    }
}

export default SacramentoCountyPPScript;
