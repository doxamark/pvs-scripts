from utils.ScriptFactory import ScriptFactory

factory = ScriptFactory('scripts/tax_bill_scripts/tbs_map.json', 'tax_bill_scripts')
needed_records = [] # get records from database

for record in needed_records:
    county_id = record.county_id 
    account_id = record.account_id 
    year = record.year 
    url = record.url

    script_class = factory.get_script_class(county_id)

    if script_class:
        script = script_class(account_id, year, url)
        script.run()
    else:
        print(f"No script class found for county ID {county_id}")
