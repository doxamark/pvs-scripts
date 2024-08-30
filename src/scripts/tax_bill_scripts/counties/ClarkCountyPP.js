import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class ClarkCountyPPScript extends BaseScript {
    async performScraping() {
        console.log(`Navigated to: ${this.accountLookupString}`);
        this.printLink = this.accountLookupString
        return { is_success: true, msg: "" };
    }
}

export default ClarkCountyPPScript;
