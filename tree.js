const fs = require('fs');
const path = require('path');

function printTree(dir, indent = '') {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const isDirectory = fs.statSync(filePath).isDirectory();

        console.log(`${indent}${isDirectory ? '📁 ' : '📄 '}${file}`);

        if (isDirectory) {
            printTree(filePath, indent + '   ');
        }
    });
}

const repoPath = path.resolve(__dirname, '/storage/emulated/0/Android/data/io.spck.editor.node/files/web'); // Replace with your repo path
printTree(repoPath);