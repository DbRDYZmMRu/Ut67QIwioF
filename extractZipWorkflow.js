const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');

/**
 * Extracts the contents of a ZIP file to a specified directory.
 *
 * @param {string} zipFilePath - Path to the ZIP file.
 * @param {string} [extractTo] - Directory where the contents will be extracted. 
 *                               If not provided, it extracts to a folder with the same name as the ZIP file.
 */

const zipFilePath = "compressed-poetry-folder.zip";

async function extractZip(zipFilePath, extractTo) {
    // Check if the ZIP file exists
    if (!fs.existsSync(zipFilePath)) {
        console.error(`The file ${zipFilePath} does not exist.`);
        return;
    }

    // Check if the file is a valid ZIP file
    if (path.extname(zipFilePath).toLowerCase() !== '.zip') {
        console.error(`The file ${zipFilePath} is not a valid ZIP file.`);
        return;
    }

    // Determine the extraction folder
    const defaultExtractTo = path.join(path.dirname(zipFilePath), path.basename(zipFilePath, '.zip'));
    const extractionPath = extractTo || defaultExtractTo;

    // Ensure the extraction directory exists
    fs.mkdirSync(extractionPath, { recursive: true });

    try {
        // Extract the ZIP file
        console.log(`Extracting ${zipFilePath} to ${extractionPath}...`);
        await fs.createReadStream(zipFilePath)
            .pipe(unzipper.Extract({ path: extractionPath }))
            .promise();

        console.log(`Extraction complete! Files are located at: ${extractionPath}`);
    } catch (err) {
        console.error(`Error during extraction: ${err.message}`);
    }
}

// Example workflow pattern
(async () => {
    const zipFilePath = process.argv[2]; // Take ZIP file path as the 1st argument
    const extractionFolder = process.argv[3]; // Take extraction folder as the 2nd argument (optional)

    if (!zipFilePath) {
        console.error("Usage: node extractZipWorkflow.js <path-to-zip-file> [extraction-folder]");
        return;
    }

    await extractZip(zipFilePath, extractionFolder);
})();