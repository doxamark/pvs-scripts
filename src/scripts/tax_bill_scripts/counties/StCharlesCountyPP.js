import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class StCharlesCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await new Promise(resolve => setTimeout(resolve, 2000));
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
        let hasTargetYear = false;
        for (let label of yearLabels) {
            const labelText = await this.page.evaluate(el => el.textContent, label);
            if (labelText.trim().includes(this.year)) {
                let checkbox = await label.$('input[type="checkbox')
                checkbox.click()
                hasTargetYear = true;
                break
            }
        }

        if (!hasTargetYear) {
            console.error('No Bills Found With Target Year. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found With Target Year. Please check your account number. ${this.account}` };
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

        await this.page.waitForSelector('table.searchResults');
        const rows = await this.page.$$('table.searchResults tbody tr');
        for (let row of rows) {
            const viewButton = await row.$('button.btnView');
            await viewButton.click();
            break
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
        await this.page.waitForSelector('.btn-default')
        const navItems = await this.page.$$('.btn-default');
        let print_element = null
        for (let element of navItems) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes('Print')) {
                print_element = element
                break;
            }
        }

        if (!print_element) {
            console.error('Cannot find print element.', this.account);
            return { is_success: false, msg: `Cannot find print element. ${this.account}` };
        }

        return { is_success: true, msg: `` };
    }

    async saveAsPDF() {
        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create the directory and any missing parent directories
        }

        await this.page.addStyleTag({
            content: `
                * {
                    background: #fff !important;
                    color: #000 !important;
                }

                img, input {
                    filter: grayscale(100%);
                }

                @media print {
                    * {
                        background: #fff !important;
                        color: #000 !important;
                    }
                }
            `
        });

        await this.page.pdf({
            path: this.outputPath,
            format: 'A4',
            printBackground: false
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }

}

export default StCharlesCountyPPScript;
