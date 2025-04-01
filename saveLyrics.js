

const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const url = "https://genius.com/Frith-hilton-oliver-sacks-lyrics";
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait for the lyrics to load
  await page.waitForFunction(() => {
    return document.querySelector('*')?.textContent.includes('Oliver Sacks Lyrics');
  }, { timeout: 10000 });

  // Extract the lyrics
  const lyrics = await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    let lyricsHeader;
    elements.forEach((element) => {
      if (element.textContent.includes('Oliver Sacks Lyrics')) {
        lyricsHeader = element;
      }
    });
    if (lyricsHeader) {
      const lyricsContainer = lyricsHeader.nextElementSibling;
      return lyricsContainer ? lyricsContainer.innerText : 'Lyrics not found';
    }
    return 'Lyrics not found';
  });

  // Save the lyrics to a text file
  fs.writeFileSync('lyrics.txt', lyrics);

  await browser.close();
})();