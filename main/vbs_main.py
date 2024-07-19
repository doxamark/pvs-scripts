from utils.ScriptFactory import ScriptFactory
from utils.DBClient import DBClient

# Initialize the database client with connection parameters
db_client = DBClient(user='username', password='password', host='localhost', port=5000, database='testdb')

# Fetch records from the database that require a value backup script
records = db_client.fetch_from_database('ParcelValueBackupNeededScript')

# Initialize the script factory with the script configuration file and directory
factory = ScriptFactory('scripts/value_backup_scripts/vbs_map.json', 'value_backup_scripts')

# Iterate over each record fetched from the database
for record in records:
    county_id = record.county_id  # Extract county ID
    account_id = record.account_id  # Extract account ID
    year = record.year  # Extract year
    url = record.url  # Extract URL
    output_path = record.output_path  # Extract output path

    # Get the script class for the given county ID from the factory
    script_class = factory.get_script_class(county_id)

    # Check if a script class was found for the county ID
    if script_class:
        # Instantiate the script class with account ID, year, and URL
        script = script_class(account_id, year, url)
        
        # Run the script and get the result
        result = script.run()
        
        # Save the result as a PDF and get the data to be inserted into the database
        data = script.save_result_as_pdf(result, output_path)
        
        # Insert the data into the specified table in the database
        db_client.insert_to_database('table_name', data)
    else:
        # Print a message if no script class was found for the county ID
        print(f"No script class found for county ID {county_id}")
