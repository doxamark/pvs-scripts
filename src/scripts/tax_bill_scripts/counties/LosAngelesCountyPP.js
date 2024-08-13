import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class LosAngelesCountyPPScript extends BaseScript {
  async performScraping() {
    await this.page.goto(this.accountLookupString);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Navigated to: ${this.page.url()}`);
    
    await this.page.waitForSelector('button.g-recaptcha');
    const buttons = await this.page.$$('button.g-recaptcha');
    let targetButton = null;

    for (const button of buttons) {
      const buttonTextContent = await this.page.evaluate(el => el.innerText, button);
      if (buttonTextContent.trim() === 'Submit') {
        targetButton = button;
        break;
      }
    }

    if (targetButton) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await targetButton.click({ clickCount: 1 });
      await targetButton.click({ clickCount: 1 });
    } else {
      return false;
    }

    // Wait for and click the link with the specific text
    await this.page.waitForSelector('a[href="unsecure/index.php"] div.options span');
    await this.page.click('a[href="unsecure/index.php"]');


    // Wait for the form to appear
    await this.page.waitForSelector('form#theform');
    // Select the appropriate year
    await this.page.select('select[name="rollyear"]', this.year);
    // Input the bill number
    await this.page.type('input[name="billnumber"]', this.account);
    // Submit the form
    await this.page.click('input[type="submit"].submitButton');
    // Wait for the "Inquiry Only" button and click it
    await this.page.waitForSelector('input.submitButton#inquirebutton[value="Inquiry Only"]');
    await this.page.click('input.submitButton#inquirebutton[value="Inquiry Only"]');
    // Wait for the "Yes" button and click it
    await this.page.waitForSelector('input.submitButton[value="Yes"]');
    await this.page.click('input.submitButton[value="Yes"]');
    // Wait for the table to appear
    await this.page.waitForSelector('table.unsecInquiryDetailTable');

    return true;
  }

  async saveAsPDF(){
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

export default LosAngelesCountyPPScript;
