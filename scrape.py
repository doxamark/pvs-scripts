import requests
from bs4 import BeautifulSoup
from utils.pdf_generator import PdfGenerator

# Define the variables
cid = "110"
prop_id = "1172107"
year = "2024"

# Construct the URL
url = f"https://bexar.trueautomation.com/clientdb/Property.aspx?cid={cid}&prop_id={prop_id}&year={year}"

# Send a GET request to the URL
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    # Parse the page content
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find the legal description element
    legal_description_elem = soup.find('td', class_='propertyDetailsLegalDescription')
    legal_description = legal_description_elem.text.strip() if legal_description_elem else None
    
    if legal_description:
        # Find the Assessed Value text and its next element
        assessed_value_elem = soup.find(string='(=) Assessed Value:')
        if assessed_value_elem:
            assessed_value_currency = assessed_value_elem.find_next('td', class_='currency')
            assessed_value = assessed_value_currency.text.strip() if assessed_value_currency else None
            if assessed_value and assessed_value != 'N/A':
                try:
                    assessed_value_numeric = float(assessed_value.replace(',', ''))
                    print(f"Assessed Value: {assessed_value_numeric}")
                    
                    # Save the page as a PDF
                    pdf_output = f"pdfs/{prop_id}_{year}_property_details.pdf"

                    pdf_file = PdfGenerator([url]).main()
                    with open(pdf_output, "wb") as outfile:
                        outfile.write(pdf_file[0].getbuffer())

                    print(f"Page saved as {pdf_output}")

                except ValueError:
                    print("Assessed Value is not numeric.")
                
            else:
                print("Assessed Value is N/A or not found.")
        else:
            print("Assessed Value text not found.")
    else:
        print("Legal Description not found.")
else:
    print("Failed to retrieve the page. Status code:", response.status_code)
