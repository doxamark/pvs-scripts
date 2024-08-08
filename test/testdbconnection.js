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

  // Example fetch
  try {
    const records = await dbManager.fetch("SELECT * FROM tso.TaxBillBackupNeededScript()");
    // const records = await dbManager.fetch("SELECT * FROM tso.ParcelValueBackupNeededScript()");
    console.log('Fetched records:', records);
  } catch (error) {
    console.error(`Failed to fetch data: ${error.message}`);
  }
})();
