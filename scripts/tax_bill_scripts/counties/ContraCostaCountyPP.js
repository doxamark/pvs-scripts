import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class ContraCostaCountyPPScript extends BaseScript {
  async performScraping() {
    await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
    console.log(`Navigated to: ${this.page.url()}`);

    // Select the "Unsecured" option from the dropdown
    await this.page.select('select[name="billtype"]', 'LookupBarWidget-BillTypes-Unsecured');

    // Input a value into the search field
    await this.page.type('input[name="searchField"]', this.account); // Replace 'your_value_here' with the actual value

    // Click the "GO" button
    await this.page.click('input[type="submit"][value="GO"]');

    // Wait for the results table to appear
    await this.page.waitForSelector('table.SelectableResultsTableWidget.ResultsTableWidget');
  }

  async saveAsPDF() {
    const dir = path.dirname(this.outputPath);
     if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const customPath = path.resolve(`custom-download-folders/${this.account}`);

    const client = await this.page.createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow', downloadPath: customPath
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    const billLinkSelector = 'table.SelectableResultsTableWidget.ResultsTableWidget tbody tr td div.ResponsiveContent a';
    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.page.click(billLinkSelector, { clickCount: 1});

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

export default ContraCostaCountyPPScript;
