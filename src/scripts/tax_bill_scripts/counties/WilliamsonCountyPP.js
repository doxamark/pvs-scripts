import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class WilliamsonCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector(".modal-footer .btn-primary")
        this.page.click(".modal-footer .btn-primary")

        await this.page.type('#searchBox', this.account);

        this.page.click('span.input-group-btn button.btn.btn-primary')

        await new Promise(resolve => setTimeout(resolve, 1000));

        await this.page.waitForSelector("#filters")

        const statusLabels = await this.page.$$('label');
        for (let label of statusLabels) {
            const labelText = await this.page.evaluate(el => el.textContent, label);
            if (labelText.trim().includes('Unpaid')) {
                let checkbox = await label.$('input[type="checkbox')
                checkbox.click()
                break
            }
        }

        const typeLabels = await this.page.$$('label');
        for (let label of typeLabels) {
            const labelText = await this.page.evaluate(el => el.textContent, label);
            if (labelText.trim().includes('Personal Property')) {
                let checkbox = await label.$('input[type="checkbox')
                checkbox.click()
                break
            }
        }

        const yearLabels = await this.page.$$('label');
        for (let label of yearLabels) {
            const labelText = await this.page.evaluate(el => el.textContent, label);
            if (labelText.trim().includes(this.year)) {
                let checkbox = await label.$('input[type="checkbox')
                checkbox.click()
                break
            }
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

        await this.page.waitForSelector('table.searchResults');
        const rows = await this.page.$$('table.searchResults tbody tr');
        let hasTargetYear = false;
        for (let row of rows) {
            const yearElement = await row.$('td.ng-binding');
            if (yearElement) {
                const yearText = await this.page.evaluate(el => el.textContent, yearElement);
                if (yearText.trim() === this.year) {
                    const viewButton = await row.$('button.btnView');
                    if (viewButton) {
                        await viewButton.click();
                        hasTargetYear = true;
                        break; // Exit after clicking the first matching view button
                    }
                }
            }
        }

        if (!hasTargetYear) {
            console.error('No Bills Found With Target Year. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found With Target Year. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector('li.nav-item')
        const navItems = await this.page.$$('li.nav-item');
        let print_element = null
        for (let element of navItems) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('View & Print Bill')) {
                print_element = element
                break;
            }
        }

        if (!print_element) {
            console.error('Cannot find print element.', this.account);
            return { is_success: false, msg: `Cannot find print element. ${this.account}` };

        }

        await print_element.click()

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

        const btnItems = await this.page.$$('a.btn.btn-default');
        let save_pdf_btn = null
        for (let element of btnItems) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('Save PDF')) {
                save_pdf_btn = element
                break;
            }
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        await save_pdf_btn.click()

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

export default WilliamsonCountyPPScript;
