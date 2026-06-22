import puppeteer from 'puppeteer';

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 1000 });
        await page.goto('http://localhost:5173/#dentists', { waitUntil: 'domcontentloaded' });
        
        // Wait 3 seconds for animations and layout to settle
        await new Promise(r => setTimeout(r, 3000));
        
        await page.screenshot({ path: 'screenshot.png', fullPage: true });
        console.log("Screenshot saved.");
        await browser.close();
    } catch (e) {
        console.error("Error:", e);
    }
})();
