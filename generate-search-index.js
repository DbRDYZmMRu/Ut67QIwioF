const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const booksDir = './published/poetry';
const output = [];

// Read all HTML files in the directory
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
        const textContent = convertChapterContentToText(content, $);
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
      bookLink: file, // Link to individual book
      chapters 
    });
  }
});

// Write the output to a JSON file
fs.writeFileSync('search-index.json', JSON.stringify(output, null, 2), 'utf8');
console.log('Search index generated.');

/**
 * Convert chapter content to plain text by preserving spaces and line breaks.
 * @param {string} chapterContent - The HTML content of the chapter.
 * @param {object} $ - The loaded Cheerio instance.
 * @returns {string} - The plain text content of the chapter.
 */
function convertChapterContentToText(chapterContent, $) {
  const tempDiv = $('<div>').html(chapterContent);
  const paragraphs = tempDiv.find('p');
  const textContent = Array.from(paragraphs).map(p => $(p).text()).join(' ');
  return textContent;
}