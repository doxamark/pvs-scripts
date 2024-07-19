from utils.SpecialScraper import SpecialScript
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

class HarrisCountyScript(SpecialScript):
    def perform_scraping(self):
        self.url = 'https://public.hcad.org/records/Real.asp'
        self.driver.get(self.url)

        acct_input = self.wait.until(EC.presence_of_element_located((By.ID, 'acct')))
        acct_input.send_keys(self.lookup_value)

        tax_year_select = self.wait.until(EC.presence_of_element_located((By.NAME, 'TaxYear')))
        for option in tax_year_select.find_elements(By.TAG_NAME, 'option'):
            if option.get_attribute('value') == self.year:
                option.click()
                break

        submit_button = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="submit"][value="Search"]')))
        submit_button.click()

        print_link_element = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'td.subheader a[target="_blank"]')))

        self.print_link = print_link_element.get_attribute('href')