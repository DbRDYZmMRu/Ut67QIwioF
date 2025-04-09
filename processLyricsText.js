const fs = require('fs');
const path = require('path');

/**
 * Transforms the content of a text file according to the specified rules:
 * - Capitalizes the first letter inside square brackets.
 * - Ensures exactly one free line before lines with square brackets.
 * - Removes free lines between regular text lines.
 *
 * @param {string} content - The original content of the text file.
 * @returns {string} - The transformed content.
 */
function transformContent(content) {
    // Split the content into lines
    let lines = content.split('\n');
    let transformedLines = [];
    let previousLineWasEmpty = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check if the line contains square brackets
        if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
            // Ensure there is exactly one free line before this line
            if (!previousLineWasEmpty) {
                transformedLines.push(''); // Add a free line if not already present
            }

            // Capitalize the first letter inside the square brackets
            const transformedLine = line.replace(/\[(\w)/, (match, firstLetter) => {
                return `[${firstLetter.toUpperCase()}`;
            });
            transformedLines.push(transformedLine);
            previousLineWasEmpty = false; // Reset because this line is not empty
        } else if (line.trim() === '') {
            // Skip free lines unless the next line starts with square brackets
            previousLineWasEmpty = true;
            continue;
        } else {
            // Regular text line: add it without any free line
            transformedLines.push(line);
            previousLineWasEmpty = false; // Reset because this line is not empty
        }
    }

    // Join the transformed lines back into a single string
    return transformedLines.join('\n');
}

/**
 * Processes all text files in the specified folder, applying the transformation.
 *
 * @param {string} folderPath - The path to the folder containing text files.
 */
function processLyricsFiles(folderPath) {
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

            // Transform the content
            const transformedContent = transformContent(content);

            // Write the transformed content back to the file
            fs.writeFileSync(filePath, transformedContent, 'utf-8');
        }
    });

    console.log('All files have been processed successfully!');
}

// Main script logic
(async () => {
    const folderPath = 'Lyrics Folder'; // Set the folder name here

    try {
        processLyricsFiles(folderPath);
    } catch (error) {
        console.error(`Error processing lyrics files: ${error.message}`);
        process.exit(1);
    }
})();