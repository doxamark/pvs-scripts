import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

// Use the Stealth plugin to make Puppeteer less detectable
puppeteer.use(StealthPlugin());

class BaseScript {
    constructor(record, year) {
        this.accountLookupString = record.AccountLookupString; // Access JSON properties directly
        this.account = record.Account;
        this.year = year;
        this.outputPath = record.DocumentName;
        this.browser = null;
        this.page = null;
        this.printLink = null;
    }

    async setupDriver() {
        this.browser = await puppeteer.launch({
            headless: true, // Set to false to see the browser UI
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
            await this.performScraping();
            await this.saveAsPDF();
        } catch (error) {
            console.error(`An error occurred: ${error.message}`);
            return null;
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
}

export default BaseScript;
