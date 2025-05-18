const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Define paths for the covers and thumbnails folders
const coversFolder = path.join(__dirname, 'musicpool', 'covers');
const thumbnailsFolder = path.join(__dirname, 'musicpool', 'thumbnails');

// Function to sanitize names by removing all whitespace
function sanitizeName(name) {
  return name.replace(/\s+/g, ''); // Remove all spaces from the name
}

// Function to generate thumbnails recursively
async function processFolder(sourceFolder, targetFolder) {
  try {
    // Ensure the target folder exists
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    // Read all files and directories in the source folder
    const items = fs.readdirSync(sourceFolder);

    for (const item of items) {
      const sanitizedItemName = sanitizeName(item); // Sanitize the item name
      const sourcePath = path.join(sourceFolder, item);
      const targetPath = path.join(targetFolder, sanitizedItemName);

      const stats = fs.statSync(sourcePath);

      if (stats.isDirectory()) {
        // If the item is a directory, process it recursively
        await processFolder(sourcePath, targetPath);
      } else if (/\.(jpg|jpeg|png|gif)$/i.test(item)) {
        // If the item is an image, generate a thumbnail
        await sharp(sourcePath)
          .resize(500, 500) // Set thumbnail dimensions (e.g., 500x500 pixels)
          .toFile(targetPath);

        console.log(`Thumbnail created for ${sourcePath} at ${targetPath}`);
      } else {
        console.log(`Skipping non-image file: ${sourcePath}`);
      }
    }
  } catch (error) {
    console.error('Error processing folder:', error);
    process.exit(1); // Exit the script with an error code
  }
}

// Start the thumbnail generation for the root folder
(async () => {
  console.log('Starting thumbnail generation...');
  await processFolder(coversFolder, thumbnailsFolder);
  console.log('Thumbnail generation completed.');
})();