import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class MarionCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector(".tab-container")
        const sections = await this.page.$$(".tab-container .tab")
        let searchByParcel = null;
        for (let section of sections) {
            const label = await this.page.evaluate(el => el.textContent, section);
            if (label.trim().includes("Search by parcel number")) {
                searchByParcel = section
                break
            }
        }

        if (!searchByParcel) {
            console.error('No Search By Parcel. Please check your account number.', this.account);
            return { is_success: false, msg: `No Search By Parcel. Please check your account number. ${this.account}` };
        }
        
        await searchByParcel.click()

        await this.page.type('#parcel_number_entry', this.account);
        await new Promise(resolve => setTimeout(resolve, 1000));

        await this.page.click("a.btn.secondary")

        await Promise.race([
            this.page.waitForSelector('.alert.error.visible', { visible: true }),
            this.page.waitForSelector('.checkbox-wrapper', { visible: true }),
        ]);

        const errors = await this.page.$$(".alert.error.visible")
        let noBill = false;
        for (let err of errors) {
            const label = await this.page.evaluate(el => el.textContent, err);
            if (label.trim().includes("No tax bills were found")) {
                noBill = true
                break
            }
        }

        if (noBill) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.click(".checkbox-wrapper input[type='checkbox']")

        await this.page.click("a.btn.secondary")

        await this.page.waitForSelector(".rt-td-val a")

        const printLinks = await this.page.$$('.rt-td-val a');
        let printLink = null
        for (let link of printLinks) {
            const label = await this.page.evaluate(el => el.textContent, link);
            if (label.trim().includes(`View tax bill`)) {
                printLink = link
                break
            }
        }

        if (!printLink) {
            console.error('No Print Link Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Print Link Found With Target Year. Please check your account number. ${this.account}` };
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

        const printLinks = await this.page.$$('.rt-td-val a');
        let printLink = null
        for (let link of printLinks) {
            const label = await this.page.evaluate(el => el.textContent, link);
            if (label.trim().includes(`View tax bill`)) {
                printLink = link
                break
            }
        }

        if (!printLink) {
            console.error('No Print Link Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Print Link Found With Target Year. Please check your account number. ${this.account}` };
        }

        await printLink.click()

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

export default MarionCountyPPScript;
