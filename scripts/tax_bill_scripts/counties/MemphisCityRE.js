import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';
import MemphisCityPPScript from './MemphisCityPP.js';

class MemphisCityREScript extends MemphisCityPPScript {
    // the same site with Memphis PP
    constructor(){
        super();
        this.outputPath = `outputs/MemphisCityRE/${this.account}/${this.account}-${this.year}.pdf`;
    }
}

export default MemphisCityREScript;
