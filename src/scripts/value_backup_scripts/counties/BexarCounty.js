import BaseScript from '../../../core/BaseScript.js';

class BexarCountyScript extends BaseScript {
  async performScraping() {
    await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
    console.log(`Navigated to: ${this.page.url()}`);

    try {
      // Retrieve the legal description using document.evaluate
      const legalDescriptionElem = await this.page.evaluateHandle(() => {
        return document.evaluate("//td[@class='propertyDetailsLegalDescription']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      });
      let legalDescription = null;
      if (legalDescriptionElem) {
        legalDescription = await this.page.evaluate(el => el.textContent.trim(), legalDescriptionElem);
      }

      this.printLink = this.accountLookupString;

    //   // Retrieve the assessed value using document.evaluate
    //   const assessedValueElem = await this.page.evaluateHandle(() => {
    //     return document.evaluate("//td[contains(text(), 'Assessed Value:')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    //   });
    //   console.log(assessedValueElem)
    //   let assessedValue = null;
    //   if (assessedValueElem) {
    //     const assessedValueCurrency = await this.page.evaluateHandle(node => {
    //       const nextTd = node.nextElementSibling;
    //       if (nextTd && nextTd.classList.contains('currency')) {
    //         return nextTd;
    //       }
    //       return null;
    //     }, assessedValueElem);

    //     if (assessedValueCurrency) {
    //       assessedValue = await this.page.evaluate(el => el.textContent.trim(), assessedValueCurrency);
    //       console.log(`Assessed Value: ${assessedValue}`);
    //     }
    //   }

    //   if (legalDescription && assessedValue) {
    //     try {
    //       // Validate the assessed value if necessary
    //       // const assessedValueNumeric = parseFloat(assessedValue.replace(/,/g, ''));
    //       this.printLink = this.accountLookupString;
    //     } catch (error) {
    //       console.error("Assessed Value is not numeric.");
    //       return null;
    //     }
    //   } else {
    //     console.error("Legal Description or Assessed Value not found.");
    //     return null;
    //   }
    } catch (error) {
      console.error(`An error occurred: ${error.message}`);
      return null;
    }
  }
}

export default BexarCountyScript;
