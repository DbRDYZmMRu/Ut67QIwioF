const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const url = "https://genius.com/Frith-hilton-oliver-sacks-lyrics";
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Extract the lyrics
    const lyrics = await page.evaluate(() => {
        return document.querySelector('.lyrics').innerText;
    });

    // Save the lyrics to a text file
    fs.writeFileSync('lyrics.txt', lyrics);

    await browser.close();
})();