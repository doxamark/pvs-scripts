import requests
from bs4 import BeautifulSoup
from utils.PDF_Generator import PdfGenerator
import os

class RegularScript:
    def __init__(self, account_id, year, url):
        self.account_id = account_id
        self.year = year
        self.url = url

    def fetch_page(self):
        response = requests.get(self.url)
        if response.status_code == 200:
            return BeautifulSoup(response.text, 'html.parser')
        else:
            print(f"Failed to retrieve the page. Status code: {response.status_code}")
            return None

    def save_result_as_pdf(self, result, output_path):
        if result:
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            pdf_file = PdfGenerator([result]).main()
            with open(output_path, "wb") as outfile:
                outfile.write(pdf_file[0].getbuffer())
            print(f"Page saved as {output_path}")
            return output_path

    def run(self):
        soup = self.fetch_page()
        if soup:
            data = self.scrape_data(soup)
            return data

    def scrape_data(self, soup):
        raise NotImplementedError("Subclasses should implement this method")
