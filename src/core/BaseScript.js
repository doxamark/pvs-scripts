import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import UserPreferencesPlugin from 'puppeteer-extra-plugin-user-preferences';

// Use the Stealth plugin to make Puppeteer less detectable
puppeteer.use(
    UserPreferencesPlugin({
        userPrefs: {
            download: {
                prompt_for_download: false,
                open_pdf_in_system_reader: true,
            },
            plugins: {
                always_open_pdf_externally: true, // this should do the trick
            },
        },
    })
);
puppeteer.use(StealthPlugin());

class BaseScript {
    constructor(record, year) {
        this.accountLookupString = record.AccountLookupString; // Access JSON properties directly
        this.account = record.AccountLookup;
        this.year = year;
        this.outputPath = record.DocumentName;
        this.browser = null;
        this.page = null;
        this.printLink = null;
    }

    async setupDriver() {
        this.browser = await puppeteer.launch({
            headless: false, // Set to false to see the browser UI
            args: [
                '--disable-blink-features=AutomationControlled',
                '--disable-infobars',
                '--disable-extensions',
                '--disable-notifications',
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--log-level=3'
            ],
        });

        this.page = await this.browser.newPage();
        this.page.setDefaultTimeout(60000);
        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await this.page.setExtraHTTPHeaders({
          'Accept-Language': 'en-US,en;q=0.9',
        });
        // const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'));
        // await page.setCookie(...cookies);
        await this.page.evaluateOnNewDocument(() => {
            // Add extra configurations to make the browser less detectable
            window.navigator.__defineGetter__('plugins', function () { return []; });
            window.navigator.__defineGetter__('languages', function () { return ['en-US', 'en']; });
        });
    }

    async closeDriver() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async run() {
        try {
            await this.setupDriver();
            this.moveMouseRandomly(this.page, 0, 1000, 0, 1000).catch(console.error);

            const is_success = await this.performScraping();

            if (!is_success) {
                return false;
            }

            await this.saveAsPDF();
            return true;
        } catch (error) {
            console.error(`An error occurred: ${error.message}`);
            return false;
        } finally {
            await this.closeDriver();
        }
    }

    async performScraping() {
        throw new Error("Subclasses should implement this method");
    }

    async saveAsPDF() {
        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create the directory and any missing parent directories
        }
        await this.page.goto(this.printLink, { waitUntil: 'networkidle2' });
        await this.page.pdf({
            path: this.outputPath,
            format: 'A4',
            printBackground: true
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }

    async moveMouseRandomly(page, minX, maxX, minY, maxY) {
        try {
            while (page) {
                const x = await this.getRandomInt(minX, maxX);
                const y = await this.getRandomInt(minY, maxY);
                await page.mouse.move(x, y);
                await new Promise(resolve => setTimeout(resolve, 500));
              }
        } catch (error) {
            
        }

      }

      async getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
}

export default BaseScript;
