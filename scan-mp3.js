const mm = require('music-metadata');
const fs = require('fs');
const path = require('path');

function getAllMp3Files(dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllMp3Files(fullPath, files);
    } else if (file.toLowerCase().endsWith('.mp3')) {
      files.push(fullPath);
    }
  });
  return files;
}

function saveCover(coverData, coverPath) {
  fs.mkdirSync(path.dirname(coverPath), { recursive: true });
  fs.writeFileSync(coverPath, coverData);
}

(async () => {
  const mp3Folder = path.resolve(__dirname, 'mp3');
  const coverFolder = path.resolve(__dirname, 'covers');
  const mp3Files = getAllMp3Files(mp3Folder);
  const results = [];

  for (const file of mp3Files) {
    try {
      const metadata = await mm.parseFile(file);
      let coverPath = null;
      if (metadata.common.picture && metadata.common.picture.length > 0) {
        const picture = metadata.common.picture[0];
        // Preserve subfolder structure and change extension to .jpg or .png as appropriate
        const relative = path.relative(mp3Folder, file);
        const ext = picture.format === 'image/png' ? '.png' : '.jpg';
        coverPath = path.join(coverFolder, relative.replace(/\.mp3$/i, ext));
        saveCover(picture.data, coverPath);
      }

      // Exclude the picture buffer from the JSON result
      const { picture, ...commonWithoutPicture } = metadata.common;

      results.push({
        file: path.relative(mp3Folder, file),
        title: metadata.common.title,
        composer: metadata.common.composer,
        writer: metadata.common.writer,
        album: metadata.common.album,
        artist: metadata.common.artist,
        duration: metadata.format.duration,
        cover: coverPath ? path.relative(__dirname, coverPath) : null,
        ...commonWithoutPicture // now safe: no 'picture' buffer included!
      });
    } catch (err) {
      console.error(`Error reading ${file}:`, err.message);
    }
  }

  fs.writeFileSync('mp3-metadata.json', JSON.stringify(results, null, 2));
  console.log('Metadata written to mp3-metadata.json');
})();