import BaseScript from '../../../core/BaseScript.js';
import fs from 'fs';
import path from 'path';

class KnoxvilleCityPPScript extends BaseScript {
    async performScraping() {
        await this.page.goto(this.accountLookupString, { waitUntil: 'networkidle2' });
        console.log(`Navigated to: ${this.accountLookupString}`);

        await this.page.waitForSelector('.pcC', { visible: true })

        const billingDate = await this.page.$$('.dfv span');
        let billingDateFound = false;
        for (let element of billingDate) {
            const text = await this.page.evaluate(el => el.textContent, element);
            if (text.trim().includes(this.year)) {
                billingDateFound = true;
                break;
            }
        }

        if (!billingDateFound) {
            console.error('No Bills Found With Target Year. Please check your account number.', this.account);
            await new Promise(resolve => setTimeout(resolve, 3000));
            return { is_success: false, msg: `No Bills Found With Target Year. Please check your account number. ${this.account}` };
        }

        return { is_success: true, msg: "" };
    }

    async saveAsPDF() {
        const dir = path.dirname(this.outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Create the directory and any missing parent directories
        }

        await this.page.addStyleTag({
            content: `
                * {
                    background: #fff !important;
                    color: #000 !important;
                }

                @media print {
                    * {
                        background: #fff !important;
                        color: #000 !important;
                    }
                }
            `
        });

        await this.page.pdf({
            path: this.outputPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0.4in',    // Adjust the margin size as needed
                right: '0.4in',
                bottom: '0.4in',
                left: '0.4in'
            }
        });
        console.log(`PDF saved: ${this.outputPath}`);
    }
}

export default KnoxvilleCityPPScript;
