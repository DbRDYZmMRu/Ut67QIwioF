const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function executeCommand(command) {
    console.log(`Executing: ${command}`);
    try {
        const output = execSync(command, { stdio: 'inherit' });
        return output;
    } catch (error) {
        // Return the error so we can handle it explicitly
        console.error(`Error executing command: ${command}`);
        return error;
    }
}

function registerExtractionFolder(zipFilePath, extractionFolder) {
    const defaultFolder = path.basename(zipFilePath, '.zip'); // Default folder is the ZIP file name without extension
    return extractionFolder || defaultFolder;
}

// Main workflow
(async () => {
    // ZIP file and extraction folder details
    const zipFilePath = 'final_pages.zip'; // Set ZIP file name here
    const extractionFolder = registerExtractionFolder(zipFilePath, 'lyrics_html_folder'); // Provide a default or custom folder

    // Ensure ZIP file exists
    if (!fs.existsSync(zipFilePath)) {
        console.error(`ZIP file not found: ${zipFilePath}`);
        process.exit(1);
    }

    // Configure Git
    console.log("Configuring Git user...");
    executeCommand("git config --global user.name 'github-actions[bot]'");
    executeCommand("git config --global user.email 'github-actions[bot]@users.noreply.github.com'");

    // Install Git LFS
    console.log("Installing Git LFS...");
    executeCommand("curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash");
    executeCommand("sudo apt-get install git-lfs -y");
    executeCommand("git lfs install");

    // Install dependencies
    console.log("Installing dependencies...");
    executeCommand("npm install unzipper");

    // Extract ZIP file
    console.log(`Extracting ${zipFilePath} to ${extractionFolder}...`);
    executeCommand(`node extractZipWorkflow.js ${zipFilePath} ${extractionFolder}`);

    // Add changes to Git
    console.log("Adding changes to Git...");
    executeCommand("git add .");

    // Check for changes and commit
    console.log("Checking for changes...");
    const diffError = executeCommand("git diff --cached --quiet");

    // If there are changes (non-zero exit code), commit and push them
    if (diffError && diffError.status !== 0) {
        console.log("Changes detected, committing...");
        executeCommand("git commit -m 'Process and extract poetry files from compressed ZIP'");
        executeCommand("git push origin HEAD:main");
    } else {
        console.log("No changes to commit");
    }
})();