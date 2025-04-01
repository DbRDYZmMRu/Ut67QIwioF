const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const url = "https://genius.com/Frith-hilton-oliver-sacks-lyrics";
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Extract the lyrics by simulating text copy action
    const lyrics = await page.evaluate(() => {
        const bodyText = document.body.innerText;
        const startIndex = bodyText.indexOf("Oliver Sacks Lyrics");
        if (startIndex === -1) return 'Lyrics not found';
        
        // Extract the text starting from "Oliver Sacks Lyrics" to the end
        return bodyText.substring(startIndex);
    });

    // Save the lyrics to a text file
    fs.writeFileSync('lyrics.txt', lyrics);

    await browser.close();
})();