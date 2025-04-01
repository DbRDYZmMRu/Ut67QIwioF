const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const url = "https://genius.com/Frith-hilton-oliver-sacks-lyrics";
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Extract the text displayed on the screen
    const textOnScreen = await page.evaluate(() => {
        return document.body.innerText;
    });

    // Save the text to a file
    fs.writeFileSync('lyrics.txt', textOnScreen);

    await browser.close();
})();