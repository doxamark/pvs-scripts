import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class OuachitaParishREcript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
         // Wait for the dropdown list to be visible
        await this.page.waitForSelector("#searchBy")
        await this.page.click("#searchBy")
        await this.page.waitForSelector('.MuiMenu-list');
        await this.page.click('.MuiMenu-list li[data-value="Parcel Number"]');

        await this.page.waitForSelector('#searchFor')
        await this.page.type('#searchFor', this.account);

        await new Promise(resolve => setTimeout(resolve, 500));
        await this.page.click("#taxYear")
        await this.page.waitForSelector('#menu-taxYear');

        const targetYearLabels = await this.page.$$('#menu-taxYear .MuiMenu-list li');
        let yearElement = null
        for (let element of targetYearLabels) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes(this.year)) {
                yearElement = element;
                break;
            }
        }
        if (!yearElement) {
            console.error('Target year does not match', this.account);
            return { is_success: false, msg: `Target year does not match. ${this.account}` };
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        await yearElement.click()
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await this.page.waitForSelector("button#submit")
        await this.page.click("button#submit")

        await new Promise(resolve => setTimeout(resolve, 1000));

        const containers = await this.page.$$(".MuiBox-root")
        let noBillFound = false;
        for (let element of containers) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('No Records')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector("#VisibilityOutlinedIcon")
        const printBtns = await this.page.$$('#VisibilityOutlinedIcon');
        let printBtn = null;
        for (let element of printBtns) {
            const attributeValue = await this.page.evaluate(el => el.getAttribute("aria-label"), element);
            if (attributeValue && attributeValue.includes('Print Corrected Notice')) {
                printBtn = element;
                break;
            }
        }

        if (!printBtn) {
            console.error('No Print Function Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Print Function Found. Please check your account number. ${this.account}` };
        }

        await printBtn.click()

        await this.page.waitForSelector(".MuiDialog-paperFullWidth")
        const proceedBtns = await this.page.$$('.MuiDialog-paperFullWidth button');
        let proceedBtn = null;
        for (let element of proceedBtns) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes("Print")) {
                proceedBtn = element;
                break;
            }
        }

        if (!proceedBtn) {
            console.error('No Proceed Button Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Proceed Button Found. Please check your account number. ${this.account}` };
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

        await this.page.waitForSelector(".MuiDialog-paperFullWidth")
        const proceedBtns = await this.page.$$('.MuiDialog-paperFullWidth button');
        let proceedBtn = null;
        for (let element of proceedBtns) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes("Print")) {
                proceedBtn = element;
                break;
            }
        }

        if (!proceedBtn) {
            console.error('No Proceed Button Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Proceed Button Found. Please check your account number. ${this.account}` };
        } 

        await proceedBtn.click()

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

export default OuachitaParishREcript;
