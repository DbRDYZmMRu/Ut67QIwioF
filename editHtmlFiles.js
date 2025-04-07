const fs = require('fs');
const path = require('path');

// Function to read all files in a directory recursively
const readFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      readFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
};

// Function to delete code block in HTML files using keyword matching
const deleteCodeBlock = (fileContent, keyword) => {
  const startIndex = fileContent.indexOf(keyword);
  if (startIndex === -1) return fileContent;

  const endIndex = fileContent.indexOf('</section>', startIndex) + '</section>'.length;
  if (endIndex === -1) return fileContent;

  console.log("Found code block to delete.");
  return fileContent.slice(0, startIndex) + fileContent.slice(endIndex);
};

// Function to replace code block in HTML files using keyword matching
const replaceCodeBlock = (fileContent, keyword, newBlock) => {
  const startIndex = fileContent.indexOf(keyword);
  if (startIndex === -1) return fileContent;

  const endIndex = fileContent.indexOf('</footer>', startIndex) + '</footer>'.length;
  if (endIndex === -1) return fileContent;

  console.log("Found code block to replace.");
  return fileContent.slice(0, startIndex) + newBlock + fileContent.slice(endIndex);
};

// Define the directory containing the HTML files (root of the current repository)
const htmlDir = '.';

// Define the keywords to search for deletion and replacement
const deleteKeyword = '<section id="contact-us" class="position-relative">';
const replaceKeyword = '<footer class="footer">';

// Define the new code block to replace the old one
const newBlock = `<footer class="footer">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 position-relative mb-5 mb-sm-0">
          <div class="position-absolute top-0 start-0 slice-pt ps-5 ps-lg-8"></div>
        </div>
        <div class="col-lg-6">
        </div>
      </div>
    </div>
  </footer>`;

// Get all HTML files in the directory
const htmlFiles = readFiles(htmlDir).filter((file) => file.endsWith('.html'));

// Track updated files
const updatedFiles = [];

// Delete and replace code blocks in each HTML file
htmlFiles.forEach((file) => {
  const originalContent = fs.readFileSync(file, 'utf8');
  let updatedContent = originalContent;
  
  console.log(`Processing file: ${file}`);

  updatedContent = deleteCodeBlock(updatedContent, deleteKeyword);
  updatedContent = replaceCodeBlock(updatedContent, replaceKeyword, newBlock);
  
  if (updatedContent !== originalContent) {
    fs.writeFileSync(file, updatedContent, 'utf8');
    updatedFiles.push(file);
    console.log(`Updated ${file}`);
  } else {
    console.log(`No changes made to ${file}`);
  }
});

// Write updated files to a text file
fs.writeFileSync('updated_files.txt', updatedFiles.join('\n'), 'utf8');
console.log('Updated files list written to updated_files.txt');