import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class CookCountyPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.page.url()}`);

        await this.page.waitForSelector(".pinsearch")

        const pinParts = this.account.split('-');

        if (pinParts.length != 5) {
            console.error('Invalid account number. Please check your account number.', this.account);
            return { is_success: false, msg: `Invalid account number. Please check your account number. ${this.account}` };
        }

        // Select and input values into each input field
        await this.page.type('#ContentPlaceHolder1_ASPxPanel1_SearchByPIN1_txtPIN1', pinParts[0]);
        await this.page.type('#ContentPlaceHolder1_ASPxPanel1_SearchByPIN1_txtPIN2', pinParts[1]);
        await this.page.type('#ContentPlaceHolder1_ASPxPanel1_SearchByPIN1_txtPIN3', pinParts[2]);
        await this.page.type('#ContentPlaceHolder1_ASPxPanel1_SearchByPIN1_txtPIN4', pinParts[3]);
        await this.page.type('#ContentPlaceHolder1_ASPxPanel1_SearchByPIN1_txtPIN5', pinParts[4]);


         // Wait for the dropdown list to be visible
        await this.page.waitForSelector("#ContentPlaceHolder1_ASPxPanel1_SearchByPIN1_cmdContinue")
        await this.page.click("#ContentPlaceHolder1_ASPxPanel1_SearchByPIN1_cmdContinue")


        // Wait for either the error message or the bill view to be visible
        await Promise.race([
            this.page.waitForSelector('#ContentPlaceHolder1_panViewDataResults', { visible: true }),
            this.page.waitForSelector('.errormessage', { visible: true })
        ]);
  
        // Check if the error message is present and contains the specific text
        const errorMessages = await this.page.$$('.errormessage');
        let noBillFound = false;
        for (let element of errorMessages) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.includes('No current property records are available')) {
                noBillFound = true;
                break;
            }
        }
    
        if (noBillFound) {
            console.error('No Bills Found. Please check your account number.', this.account);
            return { is_success: false, msg: `No Bills Found. Please check your account number. ${this.account}` };
        }

        await this.page.waitForSelector('#ContentPlaceHolder1_panViewDataResults');

        const targetYearLabels = await this.page.$$('.taxingdistrictpropertydebtdesktop a');
        let clickElement = null
        for (let element of targetYearLabels) {
            const link = await this.page.evaluate(el => el.getAttribute("href"), element);
            if (link && link.trim().includes("taxbillhistoryresults")) {
                clickElement = element;
                break;
            }
        }
        if (!clickElement) {
            console.error('Click element is missing', this.account);
            return { is_success: false, msg: `Click element is missing. ${this.account}` };
        }
        
        await clickElement.click();

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await this.page.waitForSelector("#ContentPlaceHolder1_TaxBillHistoryResultsControl1_GeneralTaxesDesktop_ListView1_itemPlaceholderContainer tr")
        const tableRows = await this.page.$$("#ContentPlaceHolder1_TaxBillHistoryResultsControl1_GeneralTaxesDesktop_ListView1_itemPlaceholderContainer tr")
        
        let hasTargetYear = false;
        let printLink = null;
        for (let row of tableRows) {
            let yearElement = await row.$(".taxyearhistory-taxyear")
            let year = await this.page.evaluate(el => el.textContent, yearElement)
            if(year && year.includes(this.year)) {
                hasTargetYear = true
                printLink = row.$(".taxbillhistory-pdf")
                break
            }
        }

        if (!hasTargetYear) {
            console.error('Target year does not match for account', this.account);
            return { is_success: false, msg: `Target year does not match for account ${this.account}` };
        }

        if (!printLink) {
            console.error('Print Link not found', this.account);
            return { is_success: false, msg: `Print Link not found ${this.account}` };
        }


        return { is_success: true, msg: `` };
    }

    async saveAsPDF() {
        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const customPath = path.resolve(`src/temp/${this.account}`);
        const client = await this.page.createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow', downloadPath: customPath
        });

        const tableRows = await this.page.$$("#ContentPlaceHolder1_TaxBillHistoryResultsControl1_GeneralTaxesDesktop_ListView1_itemPlaceholderContainer tr")
        let printLink = null;
        for (let row of tableRows) {
            let yearElement = await row.$(".taxyearhistory-taxyear")

            let year = await this.page.evaluate(el => el.textContent, yearElement)
            if(year && year.includes(this.year)) {
                printLink = await row.$(".taxbillhistory-pdf")
                break
            }
        }

        if (!printLink) {
            console.error('Print Link not found', this.account);
            return { is_success: false, msg: `Print Link not found ${this.account}` };
        }

        await printLink.click()

        // Wait for the file to download
        while (!fs.existsSync(customPath) || fs.readdirSync(customPath).length === 0 || !this.hasPdfFiles(customPath)) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Rename the file inside the customPath to this.outputPath
        const files = fs.readdirSync(customPath);
        if (files.length > 0) {
            const downloadedFile = path.join(customPath, files[0]);
            const outputFilePath = path.resolve(this.outputPath);
            try {
                // Attempt to rename the file
                fs.renameSync(downloadedFile, outputFilePath);
              } catch (err) {
                if (err.code === 'EXDEV') {
                  // Handle cross-device link error by copying and then deleting
                  fs.copyFileSync(downloadedFile, outputFilePath);
                  fs.unlinkSync(downloadedFile);
                } else {
                  throw err; // Re-throw error if it's not an EXDEV error
                }
              }
        
              // Remove the directory if needed
              fs.rmSync(customPath, { recursive: true });
        }

        console.log(`PDF saved: ${this.outputPath}`);

    }

    hasPdfFiles(dir) {
        const files = fs.readdirSync(dir);
        return files.some(file => {
            const extname = path.extname(file).toLowerCase();
            const basename = path.basename(file, extname);
            // Check if the file has a .pdf extension and does not have additional extensions
            return extname === '.pdf' && !extname.includes('.crdownload');
        });
    }

}

export default CookCountyPPScript;
