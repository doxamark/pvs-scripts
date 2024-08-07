import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class AlamedaCountyPPScript extends BaseScript {
  async performScraping() {
    this.account = this.account.replaceAll('-', '')
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

    await this.page.type('#acctClass', acctClass);
    await this.page.type('#acctAssesseeId', acctAssesseeId);
    await this.page.type('#acctDivision', acctDivision);
    await this.page.type('#acctLocation', acctLocation);
    await this.page.type('#acctYear', acctYear);
    await this.page.type('#acctType', acctType);
    await this.page.type('#acctCorrNum', acctCorrNum);

    await this.page.click('input[name="searchByAccountNum"]');

    await this.page.waitForSelector('.pplviewbill', { visible: true });

    const viewBillLink = await this.page.$eval('.pplviewbill', el => el.href);
    const viewBillElement = await this.page.$('.pplviewbill');
    this.printLink = viewBillElement

  }

  async saveAsPDF() {
    this.outputPath = `outputs/AlamedaCountyPP/${this.account}/${this.account}-${this.year}.pdf`;
    const dir = path.dirname(this.outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Create the directory and any missing parent directories
    }

    const customPath = path.resolve(`custom-download-folders/${this.account}`);

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
        fs.renameSync(downloadedFile, outputFilePath);
        fs.rmdirSync(customPath);
    }

    console.log(`PDF saved: ${this.outputPath}`);

  }
}

export default AlamedaCountyPPScript;
