const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function executeCommand(command) {
    console.log(`Executing: ${command}`);
    try {
        const output = execSync(command, { stdio: 'inherit' });
        return output;
    } catch (error) {
        console.error(`Error executing command: ${command}`, error);
        process.exit(1);
    }
}

function registerExtractionFolder(zipFilePath, extractionFolder) {
    const defaultFolder = path.basename(zipFilePath, '.zip'); // Default folder is the ZIP file name without extension
    return extractionFolder || defaultFolder;
}

// Main workflow
(async () => {
    // ZIP file and extraction folder details
    const zipFilePath = 'compressed-poetry-folder.zip'; // Set ZIP file name here
    const extractionFolder = registerExtractionFolder(zipFilePath, 'extracted_poetry'); // Provide a default or custom folder

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

    // Commit and push changes
    console.log("Checking for changes...");
    try {
        executeCommand("git diff --cached --quiet");
        console.log("No changes to commit");
    } catch {
        console.log("Changes detected, committing...");
        executeCommand("git commit -m 'Process and extract poetry files from compressed ZIP'");
        executeCommand("git push origin HEAD:main");
    }
})();