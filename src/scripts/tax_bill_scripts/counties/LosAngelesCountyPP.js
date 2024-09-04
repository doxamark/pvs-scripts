import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class LosAngelesCountyPPScript extends BaseScript {
  async performScraping() {
    this.accountLookupString = 'https://vcheck.ttc.lacounty.gov'
    await this.page.goto(this.accountLookupString);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Navigated to: ${this.page.url()}`);

    await this.bypassCaptcha();

    // Wait for either the error message or the bill view to be visible
    await Promise.race([
      this.page.waitForSelector('a[href="unsecure/index.php"] div.options span', { visible: true }),
      this.page.waitForSelector('.message', { visible: true })
    ]);

    // Check if the error message is present and contains the specific text
    const blockedMessage = await this.page.$$('.message');
    if (blockedMessage) {
      const link = await this.page.$('.link a');
      if (link) {
        await link.click();
        await this.bypassCaptcha();
      }
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

    // Wait for either the error message or the bill view to be visible
    await Promise.race([
      this.page.waitForSelector('input.submitButton#inquirebutton[value="Inquiry Only"]', { visible: true }),
      this.page.waitForSelector('#message', { visible: true })
    ]);

    // Check if the error message is present and contains the specific text
    const errorMessages = await this.page.$$('#message');
    let noBillFound = false;
    for (let element of errorMessages) {
      const text = await this.page.evaluate(el => el.textContent, element);
      if (text.includes('The information entered was not found in our records.')) {
        noBillFound = true;
        break;
      }
    }

    if (noBillFound) {
      console.error('No Bills Found. Please check your account number.', this.account);
      return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
    }

    // Wait for the "Inquiry Only" button and click it
    await this.page.waitForSelector('input.submitButton#inquirebutton[value="Inquiry Only"]');
    await this.page.click('input.submitButton#inquirebutton[value="Inquiry Only"]');
    // Wait for the "Yes" button and click it
    await this.page.waitForSelector('input.submitButton[value="Yes"]');
    await this.page.click('input.submitButton[value="Yes"]');
    // Wait for the table to appear
    await this.page.waitForSelector('table.unsecInquiryDetailTable');

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


  async bypassCaptcha(){
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
    }
  }
}

export default LosAngelesCountyPPScript;
