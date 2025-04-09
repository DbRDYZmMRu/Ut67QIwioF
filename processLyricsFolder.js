const fs = require('fs');
const path = require('path');

/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} - The string with the first letter capitalized.
 */
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Processes the content of a text file according to the rules:
 * - Capitalizes the first word of each paragraph.
 * - Replaces "+" with a single space.
 * - Removes redundant single empty lines between paragraphs.
 * - Adds three empty lines at the beginning and end of the text.
 *
 * @param {string} content - The original content of the text file.
 * @returns {string} - The processed content.
 */
function processContent(content) {
    // Split the content into lines
    let lines = content.split('\n');

    // Process each line: replace "+" and capitalize the first word if the line is not empty
    lines = lines.map((line) => {
        if (line.trim() === '') return line; // Keep empty lines as is
        return capitalizeFirstLetter(line.replace(/\+/g, ' '));
    });

    // Remove redundant single empty lines (leave only one empty line between paragraphs)
    let processedLines = [];
    let emptyLineCount = 0;

    for (const line of lines) {
        if (line.trim() === '') {
            emptyLineCount++;
            if (emptyLineCount <= 1) {
                processedLines.push(line); // Allow only one empty line
            }
        } else {
            emptyLineCount = 0; // Reset empty line count when a non-empty line is found
            processedLines.push(line);
        }
    }

    // Add three empty lines at the beginning and end
    const threeEmptyLines = '\n\n\n';
    return `${threeEmptyLines}${processedLines.join('\n')}${threeEmptyLines}`;
}

/**
 * Processes all text files in the specified folder.
 *
 * @param {string} folderPath - The path to the folder containing text files.
 */
function processLyricsFolder(folderPath) {
    // Ensure the folder exists
    if (!fs.existsSync(folderPath)) {
        console.error(`Folder not found: ${folderPath}`);
        process.exit(1);
    }

    // Read all files in the folder
    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
        const filePath = path.join(folderPath, file);

        // Process only .txt files
        if (path.extname(file) === '.txt') {
            console.log(`Processing file: ${filePath}`);

            // Read the file content
            const content = fs.readFileSync(filePath, 'utf-8');

            // Process the content
            const processedContent = processContent(content);

            // Write the updated content back to the file
            fs.writeFileSync(filePath, processedContent, 'utf-8');
        }
    });

    console.log('All files have been processed successfully!');
}

// Main script logic
(async () => {
    const folderPath = 'Lyrics Folder'; // Set the folder name here

    try {
        processLyricsFolder(folderPath);
    } catch (error) {
        console.error(`Error processing lyrics folder: ${error.message}`);
        process.exit(1);
    }
})();