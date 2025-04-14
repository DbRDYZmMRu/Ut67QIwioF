const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const lyricsFolder = './Lyrics Folder'; // Path to the lyrics folder
const jsonFolder = path.join(lyricsFolder, 'Json'); // Path to the Json subfolder
const zipFilePath = path.join(lyricsFolder, 'Json.zip'); // Path to the ZIP file

function processLyricsFile(filePath) {
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  const lyrics = [];
  let foundFirstBracketLine = false; // Flag to skip lines before the first square bracket line

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (!foundFirstBracketLine) {
      // Start processing only when a square bracket line is found
      if (trimmedLine.startsWith('[') && trimmedLine.endsWith(']')) {
        foundFirstBracketLine = true;
      } else {
        return; // Skip lines before the first square bracket line
      }
    }

    if (trimmedLine === '') {
      lyrics.push({ line: '', annotations: {} }); // Retain empty lines
    } else {
      const annotations = {};
      const words = trimmedLine.split(' ');
      words.forEach((word) => {
        if (word.includes('[') || word.includes(']')) {
          annotations[word.replace(/[\[\]]/g, '')] = `Annotation for ${word}`;
        }
      });

      lyrics.push({ line: trimmedLine, annotations });
    }
  });

  return lyrics;
}

function generateLyricsJson() {
  if (!fs.existsSync(jsonFolder)) {
    fs.mkdirSync(jsonFolder, { recursive: true }); // Create the Json folder if it doesn't exist
  }

  const files = fs.readdirSync(lyricsFolder).filter((file) => file.endsWith('.txt'));

  files.forEach((file) => {
    const filePath = path.join(lyricsFolder, file);
    const fileLyrics = processLyricsFile(filePath);

    const outputData = { lyrics: fileLyrics };
    const outputFile = path.join(jsonFolder, file.replace('.txt', '.json')); // Save as a JSON file with the same name
    fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));
    console.log(`Lyrics JSON for ${file} saved at ${outputFile}`);
  });
}

function createZip() {
  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`ZIP file created at ${zipFilePath} (${archive.pointer()} total bytes)`);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(jsonFolder, false); // Add the Json folder to the ZIP
  archive.finalize();
}

generateLyricsJson();
createZip();