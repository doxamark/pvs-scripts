import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class PotterCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        // Wait for either the error message or the bill view to be visible
        await Promise.race([
            this.page.waitForSelector('#account-details-header', { visible: true }),
            this.page.waitForSelector('.mt-4.container h2', { visible: true })
        ]);
    
        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('.mt-4.container h2');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('Tax Account Number not found')) {
                noBillFound = true;
                break;
            }
        }
    
        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector(".account-property-tax-record")
        const accountPropertyTax = await this.page.$$('.account-property-tax-record h2');
        let hasTargetYear = false
        for (let year of accountPropertyTax) {
            const labelText = await this.page.evaluate(el => el.textContent, year);
            if (labelText.trim().includes(this.year)) {
                hasTargetYear = true;
            }
        }

        if (!hasTargetYear) {
            console.error("Target year does not match.")
            return { is_success: false, msg: `Target year does not match.` };
        }

        await this.page.waitForSelector("#account-details-header a")
        const links = await this.page.$$("#account-details-header a")
        for (let link of links) {
            const labelText = await this.page.evaluate(el => el.textContent, link);
            if (labelText.trim().includes('e-Statement')) {
                return { is_success: true, msg: `` };
            }
        }

        console.error("Print Link Not Found", this.account);
        return { is_success: false, msg: `Print Link Not Found` };
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

        const links = await this.page.$$("#account-details-header a")
        let printLink = null;
        for (let link of links) {
            const labelText = await this.page.evaluate(el => el.textContent, link);
            if (labelText.trim().includes('e-Statement')) {
                printLink = link
            }
        }

        if (!printLink) {
            console.error("Print Link Not Found For Saving PDF", this.account);
            return { is_success: false, msg: `Print Link Not Found For Saving PDF` };
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        printLink.click()

        // Wait for the file to download
        while (!fs.existsSync(customPath) || fs.readdirSync(customPath).length === 0 && this.hasPdfFiles(customPath)) {
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
        await new Promise(resolve => setTimeout(resolve, 1000));

    }

    hasPdfFiles(dir) {
        const files = fs.readdirSync(dir);
        return files.some(file => {
            const extname = path.extname(file).toLowerCase();
            const basename = path.basename(file, extname);
            // Check if the file has a .pdf extension and does not have additional extensions
            return extname === '.pdf' && !basename.includes('.crdownload');
        });
    }
}

export default PotterCountyPPScript;
