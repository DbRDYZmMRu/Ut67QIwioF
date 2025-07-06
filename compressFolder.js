const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

/**
 * Compresses a folder into a ZIP file.
 *
 * @param {string} folderPath - The path to the folder to compress.
 * @param {string} outputFilePath - The path to the output ZIP file.
 */
function compressFolder(folderPath, outputFilePath) {
  if (!fs.existsSync(folderPath)) {
    throw new Error(`The folder ${folderPath} does not exist.`);
  }
  
  console.log(`Compressing folder: ${folderPath}`);
  console.log(`Output ZIP file: ${outputFilePath}`);
  
  const output = fs.createWriteStream(outputFilePath);
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  output.on('close', () => {
    console.log(`Compression complete! ${archive.pointer()} total bytes written.`);
  });
  
  archive.on('error', (err) => {
    throw err;
  });
  
  archive.pipe(output);
  archive.directory(folderPath, false);
  archive.finalize();
}

// Main script logic
(async () => {
  const folderPath = './js/freshPlayer'; // Set the folder name here
  const outputFilePath = 'freshPlayer.zip'; // Set the output ZIP file name here
  
  try {
    compressFolder(folderPath, outputFilePath);
  } catch (error) {
    console.error(`Error compressing folder: ${error.message}`);
    process.exit(1);
  }
})();