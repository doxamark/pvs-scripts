import BaseScript from '../../../core/BaseScript.js';

class HarrisCountyScript extends BaseScript {
  async performScraping() {
    await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
    console.log(`Navigated to: ${this.page.url()}`);
  
    try {
      const acctInput = await this.page.waitForSelector('#acct', { visible: true, timeout: 5000 });
      await acctInput.type(this.account);
      
      const taxYearSelect = await this.page.waitForSelector('select[name="TaxYear"]', { visible: true, timeout: 5000 });
      const options = await taxYearSelect.$$('option');
      
      let yearSelected = false;
      for (const option of options) {
        const value = await option.evaluate(el => el.value);
        if (value === this.year) {
          await option.evaluate(b => b.click());
          yearSelected = true;
          break;
        }
      }
      
      const submitButton = await this.page.waitForSelector('input[type="submit"][value="Search"]', { visible: true, timeout: 10000 });
      await this.page.evaluate(button => button.click(), submitButton);
      
      const printLinkElement = await this.page.waitForSelector('td.subheader a[target="_blank"]', { visible: true, timeout: 10000 });
      this.printLink = await printLinkElement.evaluate(el => el.href);
    } catch (error) {
      console.error(`An error occurred: ${error.message}`);
    }
  }
}

export default HarrisCountyScript;
