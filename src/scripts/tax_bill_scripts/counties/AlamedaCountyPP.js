import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class AlamedaCountyPPScript extends BaseScript {
  async performScraping() {
    console.log(`Scraping data for Alameda County with account_lookup ${this.account}`)
    this.account = this.account.replaceAll('-', '').replaceAll("'", '')

    if (this.account.length < 19) {
      console.error(`Bad Account Lookup ${this.account}`)
      return false;
    }

    const accountNumberParts = [
      this.account.slice(0, 2),
      this.account.slice(2, 8),
      this.account.slice(8, 10),
      this.account.slice(10, 13),
      this.account.slice(13, 15),
      this.account.slice(15, 17),
      this.account.slice(17, 19)
    ];

    await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
    console.log(`Navigated to: ${this.page.url()}`);

    const [
      acctClass,
      acctAssesseeId,
      acctDivision,
      acctLocation,
      acctYear,
      acctType,
      acctCorrNum
    ] = accountNumberParts;

    if (acctYear != this.year.toString().slice(-2)) {
      console.log("Search year does not match with the target year.")
      return false
    }

    await this.page.type('#acctClass', acctClass);
    await this.page.type('#acctAssesseeId', acctAssesseeId);
    await this.page.type('#acctDivision', acctDivision);
    await this.page.type('#acctLocation', acctLocation);
    await this.page.type('#acctYear', acctYear);
    await this.page.type('#acctType', acctType);
    await this.page.type('#acctCorrNum', acctCorrNum);

    await this.page.click('input[name="searchByAccountNum"]');

    // Wait for either the error message or the bill view to be visible
    await Promise.race([
      this.page.waitForSelector('.pplviewbill', { visible: true }),
      this.page.waitForSelector('.pplerrortext', { visible: true })
    ]);

    // Check if the error message is present and contains the specific text
    const errorMessages = await this.page.$$('.pplerrortext');
    let noBillFound = false;
    for (let element of errorMessages) {
      const text = await this.page.evaluate(el => el.textContent, element);
      if (text.includes('No Bills Found. Please check your account number.')) {
        noBillFound = true;
        break;
      }
    }

    if (noBillFound) {
      console.error('No Bills Found. Please check your account number.', this.account);
      return false;
    }

    const viewBillLink = await this.page.$eval('.pplviewbill', el => el.href);
    const viewBillElement = await this.page.$('.pplviewbill');
    this.printLink = viewBillElement
    
    return true;

  }

  async saveAsPDF() {

    if (!this.printLink) {
      return false;
    }

    const dir = path.dirname(this.outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Create the directory and any missing parent directories
    }

    const customPath = path.resolve(`src/temp/${this.account}`);

    const tempFileName = 'UnSecuredBill.pdf';
    const tempFilePath = path.join(customPath, tempFileName);

    const client = await this.page.createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow', downloadPath: customPath
    });

    await this.printLink.click({ clickCount: 1 });

    // await fs.promises.writeFile(folder, buffer);
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

export default AlamedaCountyPPScript;
