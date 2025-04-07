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

// Function to delete code block in HTML files
const deleteCodeBlock = (fileContent, codeBlockRegex) => {
  return fileContent.replace(codeBlockRegex, '');
};

// Function to replace code block in HTML files
const replaceCodeBlock = (fileContent, oldBlockRegex, newBlock) => {
  return fileContent.replace(oldBlockRegex, newBlock);
};

// Define the directory containing the HTML files (root of the current repository)
const htmlDir = '.';

// Define the regex patterns for the code blocks to delete and replace
const deleteBlockRegex = /<section id="contact-us" class="position-relative">\s*<div class="google-map">\s*<iframe[^>]*><\/iframe>\s*<\/div>\s*<\/section>/g;
const oldBlockRegex = /<footer class="footer">\s*<div class="container">\s*<div class="row">\s*<div class="col-lg-6 position-relative mb-5 mb-sm-0">\s*<div class="position-absolute top-0 start-0 slice-pt ps-5 ps-lg-8"><\/div>\s*<\/div>\s*<div class="col-lg-6">\s*<div class="text-center slice-ptb">\s*<h4 class="mb-4 mt-5 mt-lg-0">Time Open<\/h4>\s*<div class="mb-4">\s*<h5>Monday to Friday<\/h5>\s*<p>8:30 am to 5 pm<\/p>\s*<\/div>\s*<h4 class="mb-4">Address<\/h4>\s*<div class="mb-4">\s*<h5>11, Akindenoh street Ota, Ogun State.<\/h5>\s*<p><a href="mailto:hello@frithhilton.com.ng">Send Frith Hilton Mail<\/a><\/p>\s*<\/div>\s*<h2 class="text-green mb-0 mt-5"><i class="feather icon-phone-call"><\/i> \(234\) 815 813 2408<\/h2>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/footer>/g;

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

  updatedContent = deleteCodeBlock(updatedContent, deleteBlockRegex);
  updatedContent = replaceCodeBlock(updatedContent, oldBlockRegex, newBlock);
  
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