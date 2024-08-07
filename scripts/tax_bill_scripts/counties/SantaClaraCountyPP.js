import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class SantaClaraCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        this.account = this.account.replaceAll('-', '')
        // Click the "Assessor Account Number" tab
        await this.page.waitForSelector('#tab2_link a');
        await this.page.click('#tab2_link a');

        // Input value into the "AcctNum" text box
        await this.page.waitForSelector('#AcctNum');
        await this.page.type('#AcctNum', this.account);

        // Click the "Submit" button
        await this.page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button.btn.btn-primary'));
            const submitButton = buttons.find(button => button.textContent.trim() === 'Submit');
            submitButton.click();
        });

        // Wait for the table to load and find the link starting with "24"
        await this.page.waitForSelector('tbody');
        const assessmentLink = await this.page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('tbody a.btn.btn-primary'));
            const assessmentLink = links.find(link => link.textContent.startsWith('24'));
            assessmentLink.click();
        });
    }

    async saveAsPDF() {
        this.outputPath = `outputs/SantaClaraCountyPP/${this.account}/${this.account}-${this.year}.pdf`;
        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const customPath = path.resolve(`custom-download-folders/${this.account}`);
        const client = await this.page.createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow', downloadPath: customPath
        });

        await this.page.waitForSelector('a[aria-label="View Unsecured Bill"]');
        const billLinkSelector = 'a[aria-label="View Unsecured Bill"]';
        await new Promise(resolve => setTimeout(resolve, 2000));
        await this.page.click(billLinkSelector, { clickCount: 1});

        await new Promise(resolve => setTimeout(resolve, 3000));

        // Wait for the file to download
        while (!fs.existsSync(customPath) || fs.readdirSync(customPath).length === 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Rename the file inside the customPath to this.outputPath
        const files = fs.readdirSync(customPath);
        if (files.length > 0) {
            const downloadedFile = path.join(customPath, files[0]);
            const outputFilePath = path.resolve(this.outputPath);
            fs.renameSync(downloadedFile, outputFilePath);
            fs.rmdirSync(customPath);
        }

        console.log(`PDF saved: ${this.outputPath}`);

    }
}

export default SantaClaraCountyPPScript;
