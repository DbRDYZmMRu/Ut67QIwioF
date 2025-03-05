const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const booksDir = './published/poetry'; // Directory containing your HTML files
const output = [];

fs.readdirSync(booksDir).forEach(file => {
  if (path.extname(file) === '.html') {
    const filePath = path.join(booksDir, file);
    const html = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(html);

    const bookTitle = $('meta[property="og:title"]').attr('content');
    const chapters = [];

    // Extract chapter titles and content from the Vue instance's method output
    const pageResources = $('script').html().match(/pageResources\s*:\s*function\s*\(\)\s*{[\s\S]*?return\s*({[\s\S]*?})\s*;}/);
    if (pageResources) {
      const resources = eval(`(${pageResources[1]})`);

      resources.chapterTitles.forEach((title, index) => {
        const content = resources.chapters[index];
        chapters.push({
          chapterTitle: title,
          chapterContent: content
        });
      });
    }

    output.push({ bookTitle, chapters });
  }
});

fs.writeFileSync('search-index.json', JSON.stringify(output, null, 2), 'utf8');
console.log('Search index generated.');