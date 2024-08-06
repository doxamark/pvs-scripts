import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import { PDFDocument } from 'pdf-lib';

puppeteer.use(StealthPlugin());

// Helper function to handle file download
const downloadFile = (url, filePath) => {
    return new Promise((resolve, reject) => {
        const handleRedirect = (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                downloadFile(response.headers.location, filePath).then(resolve).catch(reject);
            } else if (response.statusCode === 200) {
                const fileStream = fs.createWriteStream(filePath);
                response.pipe(fileStream);

                fileStream.on('finish', () => {
                    fileStream.close();
                    resolve();
                });

                fileStream.on('error', (err) => {
                    fs.unlink(filePath, () => reject(err));
                });
            } else {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
            }
        };

        const protocol = url.startsWith('https') ? https : http;
        protocol.get(url, (response) => {
            handleRedirect(response);
        }).on('error', (err) => {
            fs.unlink(filePath, () => reject(err));
        });
    });
};

// Function to extract HTML from PDF (dummy implementation for demo purposes)
const extractHtmlFromPdf = async (pdfPath) => {
    const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfPath));
    // This is a dummy function: PDF-lib does not extract HTML, only text and metadata
    // Replace with actual HTML extraction logic if you have another tool or method
    return '<html><body>Extracted content goes here</body></html>';
};

// Function to convert HTML to PDF
const convertHtmlToPdf = async (htmlContent, outputPath) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
    });

    await browser.close();
    console.log(`PDF saved to ${outputPath}`);
};

(async () => {
    const downloadUrl = 'https://www.acgov.org/ptax_pub_app/PublicDownload.do?getStreamInfo=true&pubBillType=UNS&pubBillId=00-004419-00-007-21-00-00';
    const customPath = path.resolve('./custom_download_path');
    const filePath = path.join(customPath, 'downloaded.pdf');

    if (!fs.existsSync(customPath)) {
        fs.mkdirSync(customPath, { recursive: true });
    }

    try {
        await downloadFile(downloadUrl, filePath);
        console.log(`PDF downloaded and saved to ${filePath}`);
    } catch (error) {
        console.error(`Error downloading PDF: ${error.message}`);
        return;
    }

    try {
        const htmlContent = await extractHtmlFromPdf(filePath);
        console.log(`Extracted HTML content.`);
        
        const pdfPath = path.join(customPath, 'converted.pdf');
        await convertHtmlToPdf(htmlContent, pdfPath);
        console.log(`HTML converted to PDF and saved to ${pdfPath}`);
    } catch (error) {
        console.error(`Error processing PDF: ${error.message}`);
    }
})();
