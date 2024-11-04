import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class LauderdaleCountyREScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector("#ctl00_ContentPlaceHolder2_ddlTaxYear")
        await this.page.select("#ctl00_ContentPlaceHolder2_ddlTaxYear", this.year)
        await this.page.select("#ctl00_ContentPlaceHolder2_ddlSearchType", "ppin")
        await this.page.type('#ctl00_ContentPlaceHolder2_tbSearch', this.account);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.page.click("#ctl00_ContentPlaceHolder2_btnSearch")

        await Promise.race([
            this.page.waitForSelector('#ctl00_lblError', { visible: true }),
            this.page.waitForSelector('#ctl00_ContentPlaceHolder2_btnViewBDetails_0', { visible: true })
        ]);

        const errors = await this.page.$$("#ctl00_lblError")
        let noBill = false;
        for (let err of errors) {
            const label = await this.page.evaluate(el => el.textContent, err);
            if (label.trim().includes("Your search term did not return any results.")) {
                noBill = true
                break
            }
        }

        if (noBill) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.click('#ctl00_ContentPlaceHolder2_btnViewBDetails_0');

        await this.page.waitForSelector("#ctl00_ContentPlaceHolder2_tblDoc")

        const printLinks = await this.page.$$('#ctl00_ContentPlaceHolder2_tblDoc a');
        let printLink = null
        for (let link of printLinks) {
            const label = await this.page.evaluate(el => el.textContent, link);
            if (label.trim().includes(`Assessment_${2024}`)) {
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

        const printLinks = await this.page.$$('#ctl00_ContentPlaceHolder2_tblDoc a');
        let printLink = null
        for (let link of printLinks) {
            const label = await this.page.evaluate(el => el.textContent, link);
            if (label.trim().includes(`Assessment_${2024}`)) {
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

export default LauderdaleCountyREScript;
