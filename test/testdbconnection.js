import DatabaseManager from '../src/core/DatabaseManager.js';

(async () => {
  const dbManager = new DatabaseManager();

  // // Example insert
  // try {
  //   await dbManager.insert("INSERT INTO Employees (EmployeeID, FirstName, LastName, HireDate) VALUES (15, 'Anna', 'Brown', '2024-07-23')");
  //   console.log('Data inserted successfully.');
  // } catch (error) {
  //   console.error(`Failed to insert data: ${error.message}`);
  // }
  // , 29, 835, 1165, 1372, 1033, 101, 867, 27, 861, 834, 1401, 1169, 277, 281
  // Example fetch
  // SELECT * FROM tso.TaxBillBackupNeededScript()
  try {
    const records = await dbManager.fetch("SELECT * FROM tso.TaxBillBackupNeededScript() WHERE CollectorID in (1397)");
    // const records = await dbManager.fetch("SELECT * FROM tso.ParcelValueBackupNeededScript() WHERE AssessorID in (495,1721)");
    // const identity = await dbManager.insertWithIdentity('INSERT INTO tso.ParcelValueBackupLog WITH AUTO NAME SELECT Current TimeStamp as StartTime;');
    // const LID = identity + "";
    // const result = await dbManager.fetch('SELECT @@Identity as LastID')
    // const LID = identity + "";
    // console.log(LID)
    // await dbManager.insert('INSERT INTO tso.ParcelValueBackupLogDetail WITH AUTO NAME SELECT 23 as LogID, 1234 as ParcelID, current timestamp as runtime, 1 as Successful;');
    // await dbManager.insert('INSERT INTO tso.ParcelValueBackupLogDetail WITH AUTO NAME SELECT 3 as LogID, 12344 as ParcelID, current timestamp as runtime, 1 as Successful, "Successfully retrieved" as Note;');
    // const records = await dbManager.fetch("SELECT * FROM tso.ParcelValueBackupNeededScript() WHERE AssessorID in (1721)");
    console.log('Fetched records:', records);
  } catch (error) {
    console.error(`Failed to fetch data: ${error.message}`);
  }
})();
