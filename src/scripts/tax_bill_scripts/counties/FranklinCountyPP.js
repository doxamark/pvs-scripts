import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class FranklinCountyPPScript extends BaseScript {
    constructor(record, year) {
        super(record, year);
        this.statementNo = record.StatementNo;
    }

    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        const hasLetters = /[a-zA-Z]/.test(this.account);
    
        if (hasLetters) {
            console.error('Invalid account. Please check your account number.', this.account);
            return {
                is_success: false,
                msg: `Invalid account. Please check your account number: ${this.account}`
            };
        }

        await this.page.waitForSelector("#tdcb3")
        await this.page.click("#tdcb3")

        await this.page.waitForSelector(".searchTextBox.form-control")
        await this.page.type(".searchTextBox.form-control", this.account)

        await new Promise(resolve => setTimeout(resolve, 1000));

        await this.page.waitForSelector(".searchButton")
        await this.page.click(".searchButton")


        // Wait for either the error message or the bill view to be visible
        await Promise.race([
            this.page.waitForSelector('#propertyHeaderList', { visible: true }),
            this.page.waitForSelector('#ctl00_cphBodyContent_lNoResult', { visible: true }),
        ]);
  
        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('#ctl00_cphBodyContent_lNoResult');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('There are no results to be returned')) {
                noBillFound = true;
                break;
            }
        }
    
        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }


        await this.page.waitForSelector('#propertyHeaderList');
        await this.page.waitForSelector(`#ctl00_cphBodyContent_fcDetailsHeader_TaxBillLink${this.statementNo}Half`)

        const printLink = await this.page.$(`#ctl00_cphBodyContent_fcDetailsHeader_TaxBillLink${this.statementNo}Half`)
        const label = await this.page.evaluate(el => el.getAttribute("title"), printLink);
        let hasTargetYear = false;
        if (label && label.trim().includes(this.year)) {
            hasTargetYear = true;
        }

        if (!hasTargetYear) {
            console.error('Target year does not match', this.account);
            return { is_success: false, msg: `Target year does not match. ${this.account}` };
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

        await this.page.waitForSelector(`#ctl00_cphBodyContent_fcDetailsHeader_TaxBillLink${this.statementNo}Half`)
        await this.page.click(`#ctl00_cphBodyContent_fcDetailsHeader_TaxBillLink${this.statementNo}Half`)

        // Wait for the file to download
        while (!fs.existsSync(customPath) || fs.readdirSync(customPath).length === 0 || !this.hasPdfFiles(customPath)) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Rename the file inside the customPath to this.outputPath
        const files = fs.readdirSync(customPath);
        if (files.length > 0) {
            const downloadedFile = path.join(customPath, files[0]);
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

    hasPdfFiles(dir) {
        const files = fs.readdirSync(dir);
        return files.some(file => {
            const extname = path.extname(file).toLowerCase();
            const basename = path.basename(file, extname);
            // Check if the file has a .pdf extension and does not have additional extensions
            return extname === '.pdf' && !extname.includes('.crdownload');
        });
    }

}

export default FranklinCountyPPScript;
