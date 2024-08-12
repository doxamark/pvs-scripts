import DatabaseManager from './core/DatabaseManager.js';
import ScriptFactory from './core/ScriptFactory.js';
import fs from 'fs';
import { format } from 'date-fns';
import path from 'path';


const dateTime = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
const logsDir = path.join('src/logs');
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
  const startTime = new Date(); // Start time
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

  const factory = new ScriptFactory('src/scripts/tax_bill_scripts/tbs_map.json', 'tax_bill_scripts');
  let failureCount = 0;
  for (const record of records) {
    const collectorID = record.CollectorID;
    const type = record.REPP;
    const mapID = `${collectorID}${type}`;
    const ScriptClass = await factory.getScriptClass(mapID);

    // for testing - comment the code below if you run for production.
    testDocumentName =  record.DocumentName.replace('O:', "C:\\Users\\pvsscripts\\Documents")
    testDocumentName = getUniqueFilename(testDocumentName)

    record.InsertString = record.InsertString.replace(record.InsertString.split(",")[2], `'${testDocumentName}' as DocumentName`)
    record.DocumentName = testDocumentName
    if (ScriptClass) {
      const script = new ScriptClass(record, year);
      try {
        console.log("---------------------------")
        const has_succeeded = await script.run();

        if (!has_succeeded) {
          failureCount++;
          continue;
        }

        
        try {
          let insertQuery = record.InsertString;
          insertQuery = insertQuery.replaceAll('"',"").replaceAll('INSERT INTO Document', 'INSERT INTO tso.Document')
          console.log(insertQuery)
          await dbManager.insert(insertQuery);
          console.log("Successfully inserted data to database.")
        } catch (error) {
          console.error(`Failed to insert data: ${error.message}`);
        }

      } catch (error) {
        console.error(`Failed to run script for collector ID ${collectorID}: ${error.message}`);
      }

    } else {
      console.error(`No script class found for collector ID ${collectorID}`);
    }
  }
  
  console.log("========================================")
  console.log(`Total successful runs: ${records.length - failureCount}`)
  console.log(`Total failed runs: ${failureCount}`)
  console.log("========================================")

  const endTime = new Date(); // End time
  const timeTaken = (endTime - startTime) / 1000; // Time in seconds
  console.log(`Total execution time - ${timeTaken} seconds.`);
})();



function getUniqueFilename(filePath) {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);

  let uniquePath = filePath;
  let counter = 1;

  while (fs.existsSync(uniquePath)) {
      uniquePath = path.join(dir, `${baseName} (${counter})${ext}`);
      counter++;
  }

  return uniquePath;
}
