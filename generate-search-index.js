const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const booksDir = './published/poetry';
const output = [];

fs.readdirSync(booksDir).forEach(file => {
  if (path.extname(file) === '.html') {
    const filePath = path.join(booksDir, file);
    const html = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(html);

    const bookTitle = $('meta[property="og:title"]').attr('content');
    if (!bookTitle) {
      console.error(`Book title not found in ${filePath}`);
      return;
    }

    const scriptContent = $('script[type="module"]').html();
    if (!scriptContent) {
      console.error(`Script content not found in ${filePath}`);
      return;
    }

    const pageResourcesMatch = scriptContent.match(/pageResources\s*\(\)\s*{\s*return\s*({[\s\S]*?})\s*;\s*}/);
    if (!pageResourcesMatch) {
      console.error(`pageResources method not found in ${filePath}`);
      return;
    }

    const resources = eval(`(${pageResourcesMatch[1]})`);
    if (!resources.chapterTitles || !resources.chapters) {
      console.error(`chapterTitles or chapters not found in ${filePath}`);
      return;
    }

    const chapters = [];
    resources.chapterTitles.forEach((title, index) => {
      if (index > 0) { // Skip the first empty item
        const content = resources.chapters[index];
        let textContent = $(content).text(); // Strip HTML tags
        textContent = textContent.replace(/\s+/g, ' ').trim(); // Clean up extra whitespace
        chapters.push({
          chapterTitle: title,
          chapterContent: content,
          chapterTextContent: textContent,
          chapterLink: `${file}/${index}` // Link to individual chapter
        });
      }
    });

    output.push({ 
      bookTitle, 
      bookLink: `${file}`, // Link to individual book
      chapters 
    });
  }
});

fs.writeFileSync('search-index.json', JSON.stringify(output, null, 2), 'utf8');
console.log('Search index generated.');