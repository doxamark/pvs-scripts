import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class GalvestonCountyREScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        // Wait for either the error message or the bill view to be visible
        await Promise.race([
            this.page.waitForSelector('h6', { visible: true }),
            this.page.waitForSelector('.errorBlock .errorTitle', { visible: true })
        ]);
    
        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('.errorBlock .errorTitle');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('Invalid Account')) {
            noBillFound = true;
            break;
            }
        }
    
        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector("h6")
        let newPage = null
        let targetYearMatch = false
        const detailLabels = await this.page.$$('h5');
        for (let label of detailLabels) {
            const labelText = await this.page.evaluate(el => el.textContent, label);
            if (labelText.trim().includes(`tax information for ${this.year}`)) {
                targetYearMatch = true;
                const linkLabels = await this.page.$$('h3 a');
                for (let linkLabel of linkLabels) {
                    const linkLabelText = await this.page.evaluate(el => el.textContent, linkLabel);
                    if (linkLabelText.trim().includes('Print a Current Tax Statement')) {
                        let [newPagePromise] = await Promise.all([
                            new Promise(resolve => this.browser.once('targetcreated', target => resolve(target.page()))),
                            linkLabel.click()
                        ]);

                        newPage = await newPagePromise;
                    }
                }
                break
            }
        }

        if (!targetYearMatch) {
            console.error("Target year does not match.")
            return { is_success: false, msg: `Target year does not match.` };
        }

        if (!newPage) {
            console.error("Couldn't get print element", this.account);
            return { is_success: false, msg: `Couldn't get print element. ${this.account}` };
        }

        const newPageUrl = newPage.url();


        // Optionally navigate to the new page URL if needed
        await this.page.goto(newPageUrl), { waitUntil: 'networkidle2' };
        await newPage.close();
        await new Promise(resolve => setTimeout(resolve, 3000));
        await this.page.waitForSelector("h3 a")
        const printLinks = await this.page.$$('h3');
        
        for (let label of printLinks) {
            const labelText = await this.page.evaluate(el => el.textContent, label);
            if (labelText.trim().includes('A copy of your current Tax Statement is available')) {
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

        await this.page.waitForSelector("h3 a")

        const printLinks = await this.page.$$('h3');
        let printLink = null;
        await new Promise(resolve => setTimeout(resolve, 2000));
        for (let label of printLinks) {
            const labelText = await this.page.evaluate(el => el.textContent, label);
            if (labelText.trim().includes('A copy of your current Tax Statement is available')) {
                printLink = await label.$('a')

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

export default GalvestonCountyREScript;
