import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class LauderdaleCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector("#ctl00_ContentPlaceHolder2_ddlTaxYear")
        await this.page.select("#ctl00_ContentPlaceHolder2_ddlTaxYear", this.year)
        await this.page.select("#ctl00_ContentPlaceHolder2_ddlSearchType", "bppin")
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

        await this.page.waitForSelector("#ctl00_ContentPlaceHolder2_tblDivTrans")

        return { is_success: true, msg: `` };
    }

    async saveAsPDF() {
        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create the directory and any missing parent directories
        }
        await this.page.pdf({
            path: this.outputPath,
            format: 'A4',
            printBackground: false
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }
}

export default LauderdaleCountyPPScript;
