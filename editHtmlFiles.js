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
const deleteCodeBlock = (fileContent, codeBlock) => {
  if (fileContent.includes(codeBlock)) {
    console.log("Found code block to delete.");
    return fileContent.replace(codeBlock, '');
  }
  return fileContent;
};

// Function to replace code block in HTML files
const replaceCodeBlock = (fileContent, oldBlock, newBlock) => {
  if (fileContent.includes(oldBlock)) {
    console.log("Found code block to replace.");
    return fileContent.replace(oldBlock, newBlock);
  }
  return fileContent;
};

// Define the directory containing the HTML files (root of the current repository)
const htmlDir = '.';

// Define the code block to delete
const deleteBlock = `<section id="contact-us" class="position-relative">
    <div class="google-map">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.629367104963!2d3.2316144785641425!3d6.692744576034127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b996ae457d243%3A0x63b338921b72fdf9!2sFrith%20Nightswan%20Enterprises!5e0!3m2!1sen!2sng!4v1683451340692!5m2!1sen!2sng"
        width="800" height="600" style="border: 0" allowfullscreen="" loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </section>`;

// Define the old and new code blocks for replacement
const oldBlock = `<footer class="footer">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 position-relative mb-5 mb-sm-0">
          <div class="position-absolute top-0 start-0 slice-pt ps-5 ps-lg-8"></div>
        </div>
        <div class="col-lg-6">
          <div class="text-center slice-ptb">
            <h4 class="mb-4 mt-5 mt-lg-0">Time Open</h4>
            <div class="mb-4">
              <h5>Monday to Friday</h5>
              <p>8:30 am to 5 pm</p>
            </div>
            <h4 class="mb-4">Address</h4>
            <div class="mb-4">
              <h5>11, Akindenoh street Ota, Ogun State.</h5>
              <p><a href="mailto:hello@frithhilton.com.ng">Send Frith Hilton Mail</a></p>
            </div>
            <h2 class="text-green mb-0 mt-5"><i class="feather icon-phone-call"></i> (234) 815 813 2408</h2>
          </div>
        </div>
      </div>
    </div>
  </footer>`;

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
  
  updatedContent = deleteCodeBlock(updatedContent, deleteBlock);
  updatedContent = replaceCodeBlock(updatedContent, oldBlock, newBlock);
  
  if (updatedContent !== originalContent) {
    fs.writeFileSync(file, updatedContent, 'utf8');
    updatedFiles.push(file);
    console.log(`Updated ${file}`);
  }
});

// Write updated files to a text file
fs.writeFileSync('updated_files.txt', updatedFiles.join('\n'), 'utf8');
console.log('Updated files list written to updated_files.txt');