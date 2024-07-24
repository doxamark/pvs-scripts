import BaseScript from '../../../core/BaseScript.js';

class SaltLakeCountyScript extends BaseScript {
  async performScraping() {
    await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
    console.log(`Navigated to: ${this.page.url()}`);

    try {
      const printLinkElement = await this.page.waitForSelector('a[title="Printer Friendly Version"]', { visible: true, timeout: 10000 });
      this.printLink = await printLinkElement.evaluate(el => `https://slco.org/assessor/new/${el.getAttribute('href')}`);
      console.log(`Print link found: ${this.printLink}`);
    } catch (error) {
      console.error(`An error occurred: ${error.message}`);
    }
  }
}

export default SaltLakeCountyScript;
