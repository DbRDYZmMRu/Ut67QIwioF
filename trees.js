const fs = require('fs');
const path = require('path');

function printTree(dir, indent = '', result = '') {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const isDirectory = fs.statSync(filePath).isDirectory();
    result += `${indent}${isDirectory ? '### ' : '- '} ${file}\n`;
    if (isDirectory) {
      result += `${indent}>\n`; // Markdown directory separator
      result = printTree(filePath, indent + '  ', result);
      result += `${indent}<\n`; // Markdown directory separator
    }
  });
  return result;
}

const repoPath = path.resolve(__dirname, '/storage/emulated/0/Android/data/io.spck.editor.node/files/web');
const outputPath = path.join(__dirname, '(link unavailable)');

const tree = `# Directory Tree
${printTree(repoPath)}`;
fs.writeFileSync(outputPath, tree);

console.log(`Directory tree saved to ${outputPath}`);
