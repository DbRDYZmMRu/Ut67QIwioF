const fs = require('fs');
const archiver = require('archiver');

const output = fs.createWriteStream('files.zip');
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

output.on('close', () => {
  console.log(`${archive.pointer()} total bytes`);
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('warning', (err) => {
  if (err.code !== 'ENOENT') {
    throw err;
  } else {
    console.warn(`Warning: ${err.message}`);
  }
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

const files = [
  'cookies.html',
  'index.html',
  'pages/who-is-frith-hilton.html',
  'pages/freshPlayer.html',
  'pages/not-found.html',
  'pages/player.html',
  'published/books.html',
  'published/journal/a-life-worth-living.html',
  'published/poetry/collection-II.html',
  'published/poetry/collection-III-ii.html',
  'published/poetry/collection-III.html',
  'published/poetry/collection-IV.html',
  'published/poetry/collection-IX.html',
  'published/poetry/collection-V.html',
  'published/poetry/collection-VI.html',
  'published/poetry/collection-VII.html',
  'published/poetry/collection-VIII.html',
  'published/poetry/collection-X.html',
  'published/poetry/collection-XI-ii.html',
  'published/poetry/collection-XI.html',
  'published/poetry/collection-XII.html',
  'published/poetry/collection-XIII.html',
  'published/poetry/collection-XIV.html',
  'published/poetry/collection-XIX.html',
  'published/poetry/collection-XV.html',
  'published/poetry/collection-XVI.html',
  'published/poetry/collection-XVII.html',
  'published/poetry/collection-XVIII.html',
  'published/poetry/collection-XX.html',
  'published/poetry/collection-XXI.html',
  'published/poetry/dr-carl-hill-collection-I.html',
  'published/poetry/dr-carl-hill-collection-II.html',
  'published/poetry/dr-carl-hill-collection-III.html',
  'published/poetry/dr-carl-hill-collection-IV.html',
  'published/poetry/dr-carl-hill-collection-V.html',
  'published/poetry/west-to-west-collection-I.html',
  'published/poetry/west-to-west-collection-II.html',
  'published/poetry/west-to-west-collection-III.html',
  'published/search.html'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    archive.file(file, { name: file });
  } else {
    console.warn(`File not found: ${file}`);
  }
});

archive.finalize();