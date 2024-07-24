import BaseScript from '../../../core/BaseScript.js';

class ElPasoCountyScript extends BaseScript {
  async performScraping() {
    this.accountLookupString = `https://epcad.org/Search/Print/${this.account}/${this.year}`;
    this.printLink = this.accountLookupString;
    console.log(`Navigated to: ${this.accountLookupString}`);
  }
}

export default ElPasoCountyScript;
