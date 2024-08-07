import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class ClarkCountyPPScript extends BaseScript {
    async performScraping() {
        this.printLink = this.accountLookupString
        this.outputPath = `outputs/ClarkCountyPP/${this.account}/${this.account}-${this.year}.pdf`;
    }
}

export default ClarkCountyPPScript;
