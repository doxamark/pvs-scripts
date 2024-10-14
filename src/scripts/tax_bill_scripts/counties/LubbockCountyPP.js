import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class LubbockCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        // Wait for either the error message or the bill view to be visible
        await Promise.race([
            this.page.waitForSelector('#tdBillsTab', { visible: true }),
            this.page.waitForSelector('#dnn_ctl01_dnnSkinMessage', { visible: true })
        ]);
    
        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('#dnn_ctl01_dnnSkinMessage');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('critical error has occurred')) {
                noBillFound = true;
                break;
            }
        }
    
        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector("#tdBillsTab")
        await this.page.click("#tdBillsTab")

        await this.page.waitForSelector(".avoidPageBreak")

        let targetYearMatch = false
        const detailLabels = await this.page.$$('.avoidPageBreak .sectionHeader');
        for (let label of detailLabels) {
            const labelText = await this.page.evaluate(el => el.textContent, label);
            if (labelText.trim() == this.year) {
                targetYearMatch = true
            }
        }

        if (!targetYearMatch) {
            console.error("Target year does not match.")
            return { is_success: false, msg: `Target year does not match.` };
        }

        const printLink = await this.page.$(`#btnPrintTaxStatement${this.year}`);

        if (!printLink) {
            console.error("Couldn't get print element", this.account);
            return { is_success: false, msg: `Couldn't get print element. ${this.account}` };
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


        const printLink = await this.page.$(`#btnPrintTaxStatement${this.year}`);

        if (!printLink) {
            console.error("Couldn't get print element", this.account);
            return { is_success: false, msg: `Couldn't get print element. ${this.account}` };
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        await printLink.click()

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

export default LubbockCountyPPScript;
