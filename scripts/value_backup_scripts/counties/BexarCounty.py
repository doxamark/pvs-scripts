from utils.RegularScraper import RegularScript

class BexarCountyScript(RegularScript):
    def scrape_data(self, soup):
        legal_description_elem = soup.find('td', class_='propertyDetailsLegalDescription')
        legal_description = legal_description_elem.text.strip() if legal_description_elem else None
        
        assessed_value_elem = soup.find(string='(=) Assessed Value:')
        if assessed_value_elem:
            assessed_value_currency = assessed_value_elem.find_next('td', class_='currency')
            assessed_value = assessed_value_currency.text.strip() if assessed_value_currency else None
        else:
            assessed_value = None

        if legal_description and assessed_value:
            try:
                # and assessed_value != 'N/A'
                # assessed_value_numeric = float(assessed_value.replace(',', ''))
                return self.url
            except ValueError:
                print("Assessed Value is not numeric.")
                return None
        else:
            print("Legal Description or Assessed Value not found.")
            return None
