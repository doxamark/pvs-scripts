import ScriptFactory from '../core/ScriptFactory.js';

// // HARRIS
// const record = {
//   AccountLookupString: 'https://public.hcad.org/records/personal/Print.asp',
//   Account: '1160310000013',
//   AssessorID: '260',
//   DocumentName: ''
// };

// // EL PASO
// const record = {
//   AccountLookupString: 'https://epcad.org/Property/Services/730825/2024',
//   Account: '730825',
//   AssessorID: '256',
//   DocumentName: ''
// };

// // SALT LAKE
// const record = {
//   AccountLookupString: 'https://slco.org/assessor/new/valuationInfoExpanded.cfm?parcel_id=28-16-152-033-0000',
//   Account: '28-16-152-033-0000',
//   AssessorID: '283',
//   DocumentName: ''
// };


// // PIERCE
// const record = {
//   AccountLookupString: 'https://atip.piercecountywa.gov/app/propertyDetail/0121168009/summary',
//   Account: '0121168009',
//   AssessorID: '13996',
//   DocumentName: ''
// };

// BEXAR
const record = {
  AccountLookupString: 'https://bexar.trueautomation.com/clientdb/Property.aspx?cid=110&prop_id=1172107&year=2024',
  Account: '1172107',
  AssessorID: '622',
  DocumentName: ''
};

const year = '2024';
record.DocumentName = `src/outputs/${record.Account}/${record.Account}-${year}.pdf`;

(async () => {
  const factory = new ScriptFactory('src/scripts/value_backup_scripts/vbs_map.json', 'value_backup_scripts');
  const ScriptClass = await factory.getScriptClass(record.AssessorID);
  if (ScriptClass) {
    const script = new ScriptClass(record, year);
    await script.run();
  } else {
    console.error(`No script class found for county ID ${record.AssessorID}`);
  }
})();
