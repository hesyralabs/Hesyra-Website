import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
    let logs = [];
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        page.on('console', msg => logs.push(`TYPE: ${msg.type()} TEXT: ${msg.text()}`));
        page.on('pageerror', error => logs.push(`UNCAUGHT ERROR: ${error.message}`));
        
        await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 10000 });
        await new Promise(r => setTimeout(r, 2000));
        await browser.close();
        
        fs.writeFileSync('browser-errors.txt', logs.join('\n'));
    } catch (e) {
        fs.writeFileSync('browser-errors.txt', 'SCRIPT EXCEPTION: ' + e.message + '\n' + logs.join('\n'));
    }
})();
