import { connect } from 'puppeteer-real-browser';
import fs from 'fs';
import path from 'path';
import UserPreferencesPlugin from 'puppeteer-extra-plugin-user-preferences';

class SpecialScript {
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
        const { browser, page } = await connect({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ],
            customConfig: {},
            turnstile: true,
            connectOption: {},
            disableXvfb: false,
            ignoreAllFlags: false,
            plugins: [
                UserPreferencesPlugin({
                    userPrefs: {
                        download: {
                            prompt_for_download: false,
                            open_pdf_in_system_reader: true,
                        },
                        plugins: {
                            always_open_pdf_externally: true,
                        },
                    },
                })
                
            ]
        });

        this.browser = browser;
        this.page = page;
        this.page.setDefaultTimeout(60000);
    }

    async closeDriver() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async run() {
        try {
            await this.setupDriver();

            const { is_success, msg } = await this.performScraping();

            if (!is_success) {
                return { is_success: false, msg: msg };
            }

            await this.saveAsPDF();
            return { is_success: true, msg: "" };
        } catch (error) {
            console.error(`An error occurred: ${error.message}`);
            return { is_success: false, msg: error.message };
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

        return true, null;
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
            console.error(`Error moving mouse randomly: ${error.message}`);
        }
    }

    async getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export default SpecialScript;
