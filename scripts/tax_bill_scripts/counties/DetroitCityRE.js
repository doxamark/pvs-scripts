import BaseScript from '../../../core/BaseScript.js';
import DetroitCityPPScript from './DetroitCityPP.js';
import fs from 'fs';
import path from 'path';

class DetroitCityREScript extends DetroitCityPPScript {
    // the same site with Detroit PP
    constructor(){
        super();
        this.outputPath = `outputs/DetroitCityRE/${this.account}/${this.account}-${this.year}.pdf`;
    }
}

export default DetroitCityREScript;
