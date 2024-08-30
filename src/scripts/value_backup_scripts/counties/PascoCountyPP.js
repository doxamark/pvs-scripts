import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class PascoCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        const resultsTableSelector = 'table.results';
        const notFoundSelector = 'div.pacontent';

        await Promise.race([
            this.page.waitForSelector(resultsTableSelector, { visible: true }),
            this.page.waitForSelector(notFoundSelector, { visible: true })
        ]);

        const errorMessages = await this.page.$$('div.pacontent div');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('NOT FOUND')) {
                noBillFound = true;
                break;
            }
        }

        if (noBillFound) {
            console.error('No Results Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Results Found. Please check your account number. ${this.account}` };
        }

        // Wait for the results table to load
        await this.page.waitForSelector(resultsTableSelector);

        const links = await this.page.$$('a.pdf');
        for (const link of links) {
            const text = await this.page.evaluate(el => el.textContent, link);
            if (text === this.year) {
                return {is_success: true, msg: ''};
            }
        }

        console.error("Target year does not match.")
        return { is_success: false, msg: `Target year does not match.` };
    }

    async saveAsPDF() {
        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const customPath = path.resolve(`src/temp/${this.account}`);
        const tempFileName = 'showdoc.pdf';
        const tempFilePath = path.join(customPath, tempFileName);

        const client = await this.page.createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow', downloadPath: customPath
        });

        let links = await this.page.$$('a.pdf');
        for (const link of links) {
            const text = await this.page.evaluate(el => el.textContent, link);
            if (text === this.year) {
                await link.click();
                break;
            }
        }

        let attempt = 0;
        let success = false;
        let retries = 5

        while (attempt < retries && !success) {

            // Wait for the file to download
            const startTime = Date.now();
            const timeout = 2000; // Timeout for download check
            while (Date.now() - startTime < timeout) {
                if (fs.existsSync(customPath) && fs.readdirSync(customPath).length > 0) {
                    success = true;
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            if (!success) {
                attempt++;
                console.log(`Download failed, retrying (${attempt}/${retries})...`);
                // Clean up if retrying
                if (fs.existsSync(customPath)) {
                    fs.rmdirSync(customPath, { recursive: true });
                }
                // Optionally, you may want to click the link again if required.
                // Uncomment if you want to retry the click action as well
                const newLinks = await this.page.$$('a.pdf');
                for (const link of newLinks) {
                    const text = await this.page.evaluate(el => el.textContent, link);
                    if (text === this.year) {
                        await link.click();
                        break;
                    }
                }
            }
        }

        links = await this.page.$$('a.pdf');
        for (const link of links) {
            const text = await this.page.evaluate(el => el.textContent, link);
            if (text === this.year) {
                await link.click();
                break;
            }
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

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

export default PascoCountyPPScript;
