import DatabaseManager from './core/DatabaseManager.js';
import ScriptFactory from './core/ScriptFactory.js';
import fs from 'fs';
import { format } from 'date-fns';
import path from 'path';


const dateTime = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
const logsDir = path.join('logs');
const logFile = path.join(logsDir, `log_${dateTime}.log`);

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

console.log = (...messages) => {
  const timestamp = new Date().toISOString();
  const logMessage = messages.join(' ');
  fs.appendFileSync(logFile, `${timestamp} - INFO: ${logMessage}\n`);
};
console.error = (...messages) => {
  const timestamp = new Date().toISOString();
  const errorMessage = messages.join(' ');
  fs.appendFileSync(logFile, `${timestamp} - ERROR: ${errorMessage}\n`);
};

(async () => {
  const dbManager = new DatabaseManager();
  const fetchQuery = 'SELECT * FROM tso.TaxBillBackupNeededScript()';
  let records = [];

  try {
    records = await dbManager.fetch(fetchQuery);
  } catch (error) {
    console.error(`Failed to fetch data: ${error.message}`);
    return;
  }

  console.log(`Total Records: ${records.length}`)

  const year = new Date().getFullYear();

  const factory = new ScriptFactory('scripts/tax_bill_scripts/tbs_map.json', 'tax_bill_scripts');
  let successCount = 0;
  let failureCount = 0;
  for (const record of records) {
    const collectorID = record.CollectorID;
    const type = record.REPP;
    const mapID = `${collectorID}${type}`;
    const ScriptClass = await factory.getScriptClass(mapID);

    if (ScriptClass) {
      const script = new ScriptClass(record, year);
      try {
        console.log("---------------------------")
        const has_succeeded = await script.run();

        if (!has_succeeded) {
          successCount++;
          return;
        }

        // const insertQuery = record.InsertString;
        // try {
        //   await dbManager.insert(insertQuery);
        // } catch (error) {
        //   console.error(`Failed to insert data: ${error.message}`);
        // }

      } catch (error) {
        failureCount++;
        console.error(`Failed to run script for collector ID ${collectorID}: ${error.message}`);
      }

    } else {
      failureCount++;
      console.error(`No script class found for collector ID ${collectorID}`);
    }
  }

  console.log("========================================")
  console.log(`Total successful runs: ${successCount}`)
  console.log(`Total failed runs: ${failureCount}`)
  console.log("========================================")
})();
