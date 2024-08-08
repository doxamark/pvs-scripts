import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert __filename and __dirname to file URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ScriptFactory {
  constructor(mappingFile, origin) {
    this.mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
    this.origin = origin;
  }

  async getScriptClass(countyId) {
    const countyName = this.mapping[countyId.toString()];
    if (countyName) {
      try {
        const modulePath = path.join(__dirname, '..', 'scripts', this.origin, 'counties', `${countyName}.js`);
        const module = await import(`file://${modulePath}`);
        const scriptClass = module.default;
        return scriptClass;
      } catch (e) {
        console.error(`Error loading script class for county '${countyName}': ${e}`);
        return null;
      }
    } else {
      console.error(`County ID ${countyId} not found in mapping.`);
      return null;
    }
  }
}

export default ScriptFactory;
