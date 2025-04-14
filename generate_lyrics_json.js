const fs = require('fs');
const path = require('path');

const lyricsFolder = './Lyrics Folder'; // Path to the lyrics folder
const jsonFolder = './Json'; // Path to the Json subfolder

function processLyricsFile(filePath) {
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  const lyrics = [];

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine === '') {
      lyrics.push({ line: '', annotations: {} }); // Retain empty lines
    } else {
      const annotations = {}; // Add logic for annotations if needed
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
    fs.mkdirSync(jsonFolder); // Create the Json folder if it doesn't exist
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

generateLyricsJson();