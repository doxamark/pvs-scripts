import json
import importlib

class ScriptFactory:
    def __init__(self, mapping_file, origin):
        with open(mapping_file, 'r') as file:
            self.mapping = json.load(file)
            self.origin = origin

    def get_script_class(self, county_id):
        county_name = self.mapping.get(str(county_id))
        if county_name:
            try:
                path = f'scripts.{self.origin}.counties.{county_name}'
                module = importlib.import_module(path)
                script_class = getattr(module, f'{county_name}Script')
                return script_class
            except (ImportError, AttributeError) as e:
                print(f"Error loading script class for county '{county_name}': {e}")
                return None
        else:
            print(f"County ID {county_id} not found in mapping.")
            return None