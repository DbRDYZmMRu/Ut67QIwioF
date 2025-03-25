const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'images', 'share', 'FHC');
const targetDir = path.join(outputDir, '1');

// Create the target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Move images from outputDir to targetDir
fs.readdir(outputDir, (err, files) => {
    if (err) {
        console.error('Error reading output directory:', err);
        return;
    }

    files.forEach(file => {
        const sourcePath = path.join(outputDir, file);
        const targetPath = path.join(targetDir, file);

        // Only move PNG files
        if (path.extname(file).toLowerCase() === '.png') {
            fs.rename(sourcePath, targetPath, err => {
                if (err) {
                    console.error(`Error moving file ${file}:`, err);
                } else {
                    console.log(`Moved ${file} to ${targetDir}`);
                }
            });
        }
    });
});