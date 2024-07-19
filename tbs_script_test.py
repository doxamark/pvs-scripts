from utils.ScriptFactory import ScriptFactory

county_id = "27" 
account_id = "1172107"
year = "2024"
url = 'sample'
output_path = f'outputs/{account_id}/{account_id}-{year}.pdf'


factory = ScriptFactory('scripts/tax_bill_scripts/tbs_map.json', 'tax_bill_scripts')
script_class = factory.get_script_class(county_id)

if script_class:
    script = script_class(account_id, year, url)
    result = script.run()
    data = script.save_result_as_pdf(result, output_path)
else:
    print(f"No script class found for county ID {county_id}")
