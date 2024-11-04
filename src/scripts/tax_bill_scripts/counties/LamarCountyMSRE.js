import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class LamarCountyMSREScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        // Wait for either the error message or the bill view to be visible
    await Promise.race([
        this.page.waitForSelector('table', { visible: true }),
        this.page.waitForSelector('p b', { visible: true })
      ]);
  
      // Check if the error message is present and contains the specific text
      const errorMessages = await this.page.$$('p b');
      let noBillFound = false;
      for (let element of errorMessages) {
        const text = await this.page.evaluate(el => el.textContent, element);
        if (text.trim().includes('GET-RECORD RECORD-NOT-FOUND')) {
          noBillFound = true;
          break;
        }
      }
  
      if (noBillFound) {
        console.error('No Bills Found. Please check your account number.', this.account);
        return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
      }
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
            printBackground: true
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }


}

export default LamarCountyMSREScript;
