const fs = require('fs');
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

    const zipStream = fs.createReadStream(zipFilePath)
        .pipe(unzipper.Extract({ path: extractTo }));
    
    return new Promise((resolve, reject) => {
        zipStream.on('close', () => {
            console.log(`Extraction complete! Files are located at: ${extractTo}`);
            resolve();
        });
        zipStream.on('error', (err) => {
            reject(err);
        });
    });
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