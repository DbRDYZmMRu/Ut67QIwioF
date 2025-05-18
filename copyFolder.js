const fs = require('fs-extra');
const path = require('path');

// Define source and destination folder paths
const sourceFolder = path.join(__dirname, 'source-repo', 'mp3'); // Source repo's mp3 folder
const destinationFolder = path.join(__dirname, 'mp3'); // Destination repo's mp3 folder

async function copyFolder() {
  try {
    // Ensure the destination folder exists
    await fs.ensureDir(destinationFolder);

    // Copy the folder from source to destination
    await fs.copy(sourceFolder, destinationFolder);

    console.log(`Folder copied successfully from ${sourceFolder} to ${destinationFolder}`);
  } catch (err) {
    console.error('Error copying folder:', err);
    process.exit(1); // Exit with error code
  }
}

// Run the script
copyFolder();