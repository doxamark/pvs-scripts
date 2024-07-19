import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from utils.PDF_Generator import PdfGenerator
import os

class SpecialScript:
    def __init__(self, lookup_value, year, url):
        self.url = url
        self.lookup_value = lookup_value
        self.year = year
        self.driver = None
        self.wait = None
        self.print_link = None

    def setup_driver(self):
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920x1080')
        chrome_options.add_argument('--disable-logging')
        chrome_options.add_argument('--log-level=3')
        chrome_options.add_argument('--blink-settings=imagesEnabled=false')

        self.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=chrome_options)
        self.wait = WebDriverWait(self.driver, 10)

    def close_driver(self):
        if self.driver:
            self.driver.quit()

    def run(self):
        start_time = time.time()
        try:
            self.setup_driver()
            self.perform_scraping()
            return self.print_link
        
        except Exception as e:
            print(f"An error occurred: {e}")
            return None
        
        finally:
            self.close_driver()
            end_time = time.time()
            execution_time = end_time - start_time
            print(f"Script executed in {execution_time:.2f} seconds.")

    def perform_scraping(self):
        raise NotImplementedError("Subclasses should implement this method")

    def save_result_as_pdf(self, print_link, output_path):
        if print_link:
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            pdf_files = PdfGenerator([print_link]).main()
            with open(output_path, "wb") as outfile:
                outfile.write(pdf_files[0].getbuffer())
            print(f"PDF saved: {output_path}")
            return output_path
        else:
            print("No print link found to save as PDF.")
            return None