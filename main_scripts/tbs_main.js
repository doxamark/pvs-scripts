import DatabaseManager from '../core/DatabaseManager.js';
import ScriptFactory from '../core/ScriptFactory.js';

(async () => {
  const dbManager = new DatabaseManager();

  // Fetch records from the database that require a value backup script
  const fetchQuery = 'SELECT * FROM tso.TaxBillBackupNeededScript()';
  let records = [];

  try {
    records = await dbManager.fetch(fetchQuery);
  } catch (error) {
    console.error(`Failed to fetch data: ${error.message}`);
    return;
  }

  const year = new Date().getFullYear();

  // Initialize the script factory with the script configuration file and directory
  const factory = new ScriptFactory('scripts/tax_bill_scripts/tbs_map.json', 'tax_bill_scripts');

  // Iterate over each record fetched from the database
  for (const record of records) {
    const collectorID = record.CollectorID;  // Extract collector ID
    const type = record.REPP
    const mapID = `${collectorID}${type}`
    console.log(mapID, record.AccountLookup)
    // Get the script class for the given collector ID from the factory
    const ScriptClass = await factory.getScriptClass(mapID);

    // Check if a script class was found for the collector ID
    if (ScriptClass) {
      // Instantiate the script class with account ID, year, and URL
      const script = new ScriptClass(record, year);

      // Run the script and get the result
      try {
        await script.run();
      } catch (error) {
        console.error(`Failed to run script for collector ID ${collectorID}: ${error.message}`);
      }

      // // Insert the data into the specified table in the database
      // const insertQuery = record.InsertString;
      // try {
      //   await dbManager.insert(insertQuery);
      // } catch (error) {
      //   console.error(`Failed to insert data: ${error.message}`);
      // }
    } else {
      // Print a message if no script class was found for the collector ID
      console.log(`No script class found for collector ID ${collectorID}`);
    }
  }
})();
