const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const url = "https://genius.com/Frith-hilton-oliver-sacks-lyrics";
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Extract the lyrics
    const lyrics = await page.evaluate(() => {
        const lyricsElement = document.querySelector('.lyrics');
        return lyricsElement ? lyricsElement.innerText : 'Lyrics not found';
    });

    // Save the lyrics to a text file
    fs.writeFileSync('lyrics.txt', lyrics);

    await browser.close();
})();