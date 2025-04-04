const fs = require('fs');
const path = require('path');
const axios = require('axios');
const jsonFilePath = path.join(__dirname, 'Musicpool', 'albums.json');
const logFilePath = path.join(__dirname, 'Musicpool', 'covers', 'log.txt');

async function downloadImage(url, savePath) {
  try {
    const response = await axios({
      url,
      responseType: 'stream',
    });
    const writer = fs.createWriteStream(savePath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    throw new Error(`Failed to download image from ${url}: ${error.message}`);
  }
}

async function processAlbum(albumId, albumData) {
  const albumDir = path.join(__dirname, 'Musicpool', 'covers', albumId);
  const albumCoverDir = path.join(albumDir, 'album_cover');
  if (!fs.existsSync(albumDir)) {
    fs.mkdirSync(albumDir, { recursive: true });
  }
  if (!fs.existsSync(albumCoverDir)) {
    fs.mkdirSync(albumCoverDir, { recursive: true });
  }

  try {
    const albumCoverPath = path.join(albumCoverDir, `${albumId}.jpg`);
    await downloadImage(albumData.cover, albumCoverPath);
    albumData.cover = albumCoverPath;
  } catch (error) {
    fs.appendFileSync(logFilePath, `${error.message}\n`);
  }

  for (const track of albumData.tracks) {
    const trackCoverPath = path.join(albumDir, `${track.id}.jpg`);
    try {
      await downloadImage(track.cover, trackCoverPath);
      track.cover = trackCoverPath;
    } catch (error) {
      fs.appendFileSync(logFilePath, `${error.message}\n`);
    }
  }
}

async function main() {
  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
  const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

  for (const [albumId, albumData] of Object.entries(jsonData)) {
    await processAlbum(albumId, albumData);
  }

  fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
  logStream.end();
}

main().catch((error) => {
  console.error('Error:', error);
});