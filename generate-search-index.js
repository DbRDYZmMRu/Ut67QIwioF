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

    // Locate and extract the pageResources method content
    const scriptContent = $('script[type="module"]').html();
    const pageResourcesMatch = scriptContent.match(/pageResources\s*\(\)\s*{[\s\S]*?return\s*({[\s\S]*?})\s*;}/);

    if (pageResourcesMatch) {
      const resources = eval(`(${pageResourcesMatch[1]})`);

      resources.chapterTitles.forEach((title, index) => {
        if (index > 0) { // Skip the first empty item
          const content = resources.chapters[index];
          chapters.push({
            chapterTitle: title,
            chapterContent: content
          });
        }
      });
    }

    output.push({ bookTitle, chapters });
  }
});

fs.writeFileSync('search-index.json', JSON.stringify(output, null, 2), 'utf8');
console.log('Search index generated.');