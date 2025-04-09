const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// Define the folder containing the HTML files
const htmlFolderPath = './html_files'; // Replace with your folder path
const outputFolderPath = './Lyrics Folder';

// Ensure the output folder exists
if (!fs.existsSync(outputFolderPath)) {
  fs.mkdirSync(outputFolderPath);
}

// Read all HTML files in the folder
const htmlFiles = fs.readdirSync(htmlFolderPath).filter(file => file.endsWith('.html'));

htmlFiles.forEach(file => {
  const filePath = path.join(htmlFolderPath, file);
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Parse the HTML file
  const dom = new JSDOM(fileContent);
  const document = dom.window.document;

  // Extract the title from the meta tag
  const metaTag = document.querySelector('meta[property="og:title"]');
  if (!metaTag) return;

  const rawTitle = metaTag.getAttribute('content');
  const titleMatch = rawTitle.match(/- (.*?) lyrics/i);
  if (!titleMatch) return;

  const title = titleMatch[1]
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Extract lyrics nested between <div id="konten"></div>
  const kontenDivs = document.querySelectorAll('div#konten');
  if (kontenDivs.length < 2) return;

  const lyricsHtml = [];
  let isRecording = false;

  kontenDivs[0].parentNode.childNodes.forEach(node => {
    if (node === kontenDivs[0]) {
      isRecording = true;
    } else if (node === kontenDivs[1]) {
      isRecording = false;
    } else if (isRecording) {
      // Collect the HTML content between the divs
      lyricsHtml.push(node.outerHTML || node.textContent);
    }
  });

  // Convert the collected HTML to plain text
  const lyricsText = lyricsHtml
    .join('')
    .replace(/<br\s*\/?>/gi, '\n') // Replace <br> with newlines
    .replace(/<\/?p>/gi, '\n') // Replace <p> with newlines
    .replace(/<\/?[^>]+(>|$)/g, '') // Remove all other HTML tags
    .trim();

  // Save the lyrics to a text file
  const outputFilePath = path.join(outputFolderPath, `${title}.txt`);
  fs.writeFileSync(outputFilePath, lyricsText, 'utf-8');
  console.log(`Saved lyrics to ${outputFilePath}`);
});

console.log('Lyrics extraction complete.');