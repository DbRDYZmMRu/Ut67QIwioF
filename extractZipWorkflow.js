const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');

/**
 * Extracts the contents of a ZIP file to a specified directory.
 *
 * @param {string} zipFilePath - Path to the ZIP file.
 * @param {string} extractTo - Directory where the contents will be extracted.
 */
async function extractZip(zipFilePath, extractTo) {
    if (!fs.existsSync(zipFilePath)) {
        throw new Error(`The file ${zipFilePath} does not exist.`);
    }

    if (!fs.existsSync(extractTo)) {
        fs.mkdirSync(extractTo, { recursive: true });
    }

    console.log(`Starting extraction of ${zipFilePath} to ${extractTo}...`);
    const directory = fs.createReadStream(zipFilePath).pipe(unzipper.Parse());

    for await (const entry of directory) {
        const filePath = path.join(extractTo, entry.path);
        if (entry.type === 'Directory') {
            console.log(`Creating directory: ${filePath}`);
            fs.mkdirSync(filePath, { recursive: true });
        } else {
            console.log(`Extracting file: ${filePath}`);
            entry.pipe(fs.createWriteStream(filePath));
        }
    }

    console.log(`Extraction complete! Files are located at: ${extractTo}`);
}

// Main script logic
(async () => {
    const [,, zipFilePath, extractTo] = process.argv;

    if (!zipFilePath || !extractTo) {
        console.error("Usage: node extractZipWorkflow.js <zipFilePath> <extractTo>");
        process.exit(1);
    }

    try {
        await extractZip(zipFilePath, extractTo);
    } catch (error) {
        console.error(`Error extracting ZIP file: ${error.message}`);
        process.exit(1);
    }
})();