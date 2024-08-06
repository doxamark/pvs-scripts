import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class MemphisCityPPScript extends BaseScript {
    async performScraping() {
        
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        this.page.on('dialog', async dialog => {
            await dialog.dismiss(); // Dismiss the dialog (use dialog.accept() if you need to accept it)
        });

        const [newPagePromise] = await Promise.all([
            new Promise(resolve => this.browser.once('targetcreated', target => resolve(target.page()))),
            this.page.waitForSelector('a#MainBodyPlaceHolder_hlinkPrint2'),
            this.page.click('a#MainBodyPlaceHolder_hlinkPrint2')
            ]);
            
            const newPage = await newPagePromise;
            const newPageUrl = newPage.url();

            newPage.on('dialog', async dialog => {
                await dialog.dismiss(); // Dismiss the dialog (use dialog.accept() if you need to accept it)
            });
            
            // Optionally navigate to the new page URL if needed
            await this.page.goto(newPageUrl);
            await newPage.close();
    }

    async saveAsPDF() {
        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create the directory and any missing parent directories
        }
        await this.page.pdf({
            path: this.outputPath,
            format: 'A4',
            printBackground: true
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }


}

export default MemphisCityPPScript;
