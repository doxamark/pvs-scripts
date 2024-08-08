import ScriptFactory from '../core/ScriptFactory.js';
import fs from 'fs/promises';

// Function to read the JSON file asynchronously
async function readRecords(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading records file:', error);
    return [];
  }
}

// Function to run tests on each record
async function runTests(records) {
  for (const record of records) {
    await runTest(record);
  }
}

// Function to run a test for a single record
async function runTest(record) {
  const year = '2024';
  const timestamp = new Date().toISOString();
  record.DocumentName = `src/test_outputs/${timestamp}/${record.Account}/${record.Account}-${year}.pdf`;

  const factory = new ScriptFactory('src/scripts/tax_bill_scripts/tbs_map.json', 'tax_bill_scripts');
  const ScriptClass = await factory.getScriptClass(record.CollectorID);

  if (ScriptClass) {
    const script = new ScriptClass(record, year);
    try {
      await script.run();
    } catch (error) {
      console.error(`Error running script for account ${record.Account}:`, error);
    }
  } else {
    console.error(`No script class found for county ID ${record.CollectorID}`);
  }
}

// Main function to initiate the process
async function main() {
  const records = await readRecords('./testData.json');
  await runTests(records);
}

// Execute the main function
main();
