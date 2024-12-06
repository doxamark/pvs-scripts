import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class SumnerCountyREScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        let accts = this.account.split(" ")

        if (accts.length != 5) {
            console.error('Invalid account number. Please check your account number.', this.account);
            return { is_success: false, msg: `Invalid account number. Please check your account number. ${this.account}` };
        }


        await this.page.waitForSelector('select[name="selectMenu"]')
        await this.page.select("select[name='selectMenu']", "parcelinfo")
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await this.page.select("select#tax_year", this.year)
        await this.page.type("input#control_map", accts[0].replace("_", ""))
        await this.page.type("input#parcel_group", accts[1].replace("_", ""))
        await this.page.type("input#parcel_number", accts[2].replace("_", ""))
        await this.page.type("input#identifier", accts[3].replace("_", ""))
        await this.page.type("input#special_interest", accts[4].replace("_", ""))

        await this.page.click("#submit_btn")

        await new Promise(resolve => setTimeout(resolve, 1000));

        await Promise.race([
            this.page.waitForSelector('.tableheader', { visible: true }),
            this.page.waitForSelector('.error.message', { visible: true }),
        ]);

        const errors = await this.page.$$(".error.message")
        let noBill = false;
        for (let err of errors) {
            const label = await this.page.evaluate(el => el.textContent, err);
            if (label.trim().includes("0 results matched your search criteria")) {
                noBill = true
                break
            }
        }

        if (noBill) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }


        const links = await this.page.$$(".noPrint a")
        let viewBillLink = null;
        for (let link of links) {
            const label = await this.page.evaluate(el => el.textContent, link);
            if (label.trim().includes("View Bill")) {
                viewBillLink = link
                break
            }
        }

        if (!viewBillLink) {
            console.error('No View Bill Link. Please check your account number.', this.account);
            return { is_success: false, msg: `No View Bill Link. Please check your account number. ${this.account}` };
        }
        
        await viewBillLink.click()

        await this.page.waitForSelector(".information")

        const printBillLinks = await this.page.$$("#content a")
        let printBill = null;
        for (let printBillLink of printBillLinks) {
            const label = await this.page.evaluate(el => el.textContent, printBillLink);
            if (label.trim() === "Bill") {
                printBill = printBillLink
                break
            }
        }

        if (!printBill) {
            console.error('No Print Bill Link Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Print Bill Link Found. Please check your account number. ${this.account}` };
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

        const printBillLinks = await this.page.$$("#content a")
        let printBill = null;
        for (let printBillLink of printBillLinks) {
            const label = await this.page.evaluate(el => el.textContent, printBillLink);
            if (label.trim() === "Bill") {
                printBill = printBillLink
                break
            }
        }

        if (!printBill) {
            console.error('No Print Bill Link Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Print Bill Link Found. Please check your account number. ${this.account}` };
        }

        await printBill.click()

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

export default SumnerCountyREScript;
