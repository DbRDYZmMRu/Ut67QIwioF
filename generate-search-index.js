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

    $('div[id^="pills-integration"]').find('div[v-for]').each((i, elem) => {
      const chapterTitle = $(elem).find('h5').text().trim();
      let chapterContent = $(elem).find('div[v-html]').html();
      chapterContent = chapterContent ? chapterContent.trim() : '';
      chapters.push({ chapterTitle, chapterContent });
    });

    output.push({ bookTitle, chapters });
  }
});

fs.writeFileSync('search-index.json', JSON.stringify(output, null, 2), 'utf8');
console.log('Search index generated.');