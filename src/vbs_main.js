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

const originalConsoleLog = console.log;
const originalConsoleError = console.error;

console.log = (...messages) => {
  const timestamp = new Date().toISOString();
  const logMessage = messages.join(' ');
  fs.appendFileSync(logFile, `${timestamp} - INFO: ${logMessage}\n`);

  originalConsoleLog.apply(console, messages);
};

console.error = (...messages) => {
  const timestamp = new Date().toISOString();
  const errorMessage = messages.join(' ');
  fs.appendFileSync(logFile, `${timestamp} - ERROR: ${errorMessage}\n`);

  originalConsoleError.apply(console, messages);
};

(async () => {
  const startTime = new Date(); // Start time
  console.log(`Start Value Backup Scripts - ${getStartTime(startTime)}`)

  const availableParcelIDs = [
    575, 495, 1721, 28, 32, 39, 391, 206, 213,
    200, 204, 207, 210, 283, 564, 211, 229, 722
  ];

  const dbManager = new DatabaseManager();
  const fetchQuery = `SELECT * FROM tso.ParcelValueBackupNeededScript() WHERE AssessorID in (${availableParcelIDs.join(', ')});`;
  let records = [];
  
  try {
    records = await dbManager.fetch(fetchQuery);
  } catch (error) {
    console.error(`Failed to fetch data: ${error.message}`);
    return;
  }

  console.log(`Total Records: ${records.length}`)

  const year =  new Date().getFullYear() + '';

  const factory = new ScriptFactory('src/scripts/value_backup_scripts/vbs_map.json', 'value_backup_scripts');
  let failureCount = 0;

  const identity = await dbManager.insertWithIdentity('INSERT INTO tso.ParcelValueBackupLog WITH AUTO NAME SELECT Current TimeStamp as StartTime;');
  const LID = identity + "";

  for (const record of records) {
    const assessorID = record.AssessorID;
    const type = record.REPP;
    const mapID = `${assessorID}${type}`;
    const ScriptClass = await factory.getScriptClass(mapID);

    record.AccountLookup = record.Account

    // for testing - comment the code below if you run for production.
    // let testDocumentName =  record.DocumentName.replace('O:', "C:\\Users\\pvsscripts\\Documents")
    let testDocumentName = getUniqueFilename(record.DocumentName)

    record.InsertString = record.InsertString.replace(record.InsertString.split(",")[3], `'${testDocumentName}' as DocumentName`)
    record.DocumentName = testDocumentName
    if (ScriptClass) {
      const script = new ScriptClass(record, year);
      try {
        console.log("---------------------------")
        const {is_success, msg} = await script.run();
        
        if (!is_success) {
          failureCount++;
          console.log("Failed")
          await dbManager.insert(`INSERT INTO tso.ParcelValueBackupLogDetail WITH AUTO NAME SELECT ${LID} as LogID, ${record.ParcelID} as ParcelID, current timestamp as runtime, 0 as Successful, 'Failed to Retrieve - error: ${msg}' as Note;`);
          continue;
        }

        try {
          let insertQuery = record.InsertString;
          insertQuery = insertQuery.replaceAll('"',"").replaceAll('INSERT INTO Document', 'INSERT INTO tso.Document')
          console.log(insertQuery)
          await dbManager.insert(insertQuery);
          console.log("Successfully inserted data to database.")
          await dbManager.insert(`INSERT INTO tso.ParcelValueBackupLogDetail WITH AUTO NAME SELECT ${LID} as LogID, ${record.ParcelID} as ParcelID, current timestamp as runtime, 1 as Successful, 'Successfully Retrieved.' as Note;`);
        } catch (error) {
          console.error(`Failed to insert data: ${error.message}`);
          await dbManager.insert(`INSERT INTO tso.ParcelValueBackupLogDetail WITH AUTO NAME SELECT ${LID} as LogID, ${record.ParcelID} as ParcelID, current timestamp as runtime, 0 as Successful, 'Failed to Retrieve - error: ${error.message}' as Note;`);
        }
      } catch (error) {
        console.error(`Failed to run script for assessor ID ${assessorID}: ${error.message}`);
        await dbManager.insert(`INSERT INTO tso.ParcelValueBackupLogDetail WITH AUTO NAME SELECT ${LID} as LogID, ${record.ParcelID} as ParcelID, current timestamp as runtime, 0 as Successful, 'Failed to run script for assessor ID ${assessorID}: ${error.message}' as Note;`);
      }
    } else {
      console.error(`No script class found for assessor ID ${assessorID}`);
      await dbManager.insert(`INSERT INTO tso.ParcelValueBackupLogDetail WITH AUTO NAME SELECT ${LID} as LogID, ${record.ParcelID} as ParcelID, current timestamp as runtime, 0 as Successful, 'No script class found for assessor ID ${assessorID}' as Note;`);
    }
  }

  await dbManager.insert(`UPDATE tso.ParcelValueBackupLog SET EndTime = Current Timestamp, RecordCount = ${records.length} WHERE LogID = ${LID};`);
  
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

function getStartTime(startTime) {
  const readableStartTime = startTime.toLocaleString('en-US', {
    weekday: 'long', // e.g., "Monday"
    year: 'numeric', // e.g., "2024"
    month: 'long',   // e.g., "August"
    day: 'numeric',  // e.g., "27"
    hour: '2-digit', // e.g., "03 PM"
    minute: '2-digit', // e.g., "05 PM"
    second: '2-digit', // e.g., "45 PM"
    timeZoneName: 'short' // e.g., "PDT"
  });

  return readableStartTime
}
