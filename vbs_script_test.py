from utils.ScriptFactory import ScriptFactory

# FOR BAXER - TESTING
# county_id="622"
# cid = "110" 
# account_id = "1172107"
# year = "2024"
# url = f"https://bexar.trueautomation.com/clientdb/Property.aspx?cid={cid}&prop_id={account_id}&year={year}"
# output_path = f'outputs/{account_id}/{account_id}-{year}.pdf'

# # FOR HARRIS - TESTING
county_id = "260" 
account_id = "1160310000013"
year = "2024"
url = 'https://public.hcad.org/records/personal/Print.asp'
output_path = f'outputs/{account_id}/{account_id}-{year}.pdf'


factory = ScriptFactory('scripts/value_backup_scripts/vbs_map.json', 'value_backup_scripts')
script_class = factory.get_script_class(county_id)

if script_class:
    script = script_class(account_id, year, url)
    result = script.run()
    data = script.save_result_as_pdf(result, output_path)
else:
    print(f"No script class found for county ID {county_id}")
