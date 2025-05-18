const fs = require('fs');
const path = require('path');

// Define the folder to scan
const targetFolder = path.join(__dirname, 'mp3'); // Adjust the folder name if needed
const outputFile = path.join(__dirname, 'contents.txt'); // Output file

/**
 * Recursively get all files and folders in a directory
 * @param {string} dir - Directory to scan
 * @param {Array<string>} fileList - Accumulator for file paths
 * @returns {Array<string>} - List of file and folder paths
 */
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      fileList.push(`Directory: ${fullPath}`);
      getAllFiles(fullPath, fileList); // Recurse into subdirectory
    } else {
      fileList.push(`File: ${fullPath}`);
    }
  });

  return fileList;
}

try {
  // Check if the target folder exists
  if (!fs.existsSync(targetFolder)) {
    console.error(`Error: The folder "${targetFolder}" does not exist.`);
    process.exit(1);
  }

  // Get all files and directories
  const allContents = getAllFiles(targetFolder);

  // Write the contents to the output file
  fs.writeFileSync(outputFile, allContents.join('\n'), 'utf8');
  console.log(`Contents written to ${outputFile}`);
} catch (error) {
  console.error('Error:', error);
}