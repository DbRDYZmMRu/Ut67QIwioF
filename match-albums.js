import { albums } from './albums.js';
import fs from 'fs';
import path from 'path';

// Load mp3-metadata.json
const metadataArr = JSON.parse(fs.readFileSync('mp3-metadata.json', 'utf-8'));

// Build maps for fast lookup
const byTitle = new Map();
const byFile = new Map();

for (const meta of metadataArr) {
  // title match: use as-is
  if (meta.title) byTitle.set(meta.title, meta);

  // file match: strip folder and extension, keep symbols
  if (meta.file) {
    const fileBase = path.basename(meta.file, path.extname(meta.file)); // e.g. "6.)Just let me go"
    byFile.set(fileBase, meta);
  }
}

const output = [];

albums.forEach(album => {
  album.tracks.forEach(track => {
    // 1. Try title match first (must match symbols/case)
    let meta = byTitle.get(track);

    // 2. If not found, try file match (strip folder & extension)
    if (!meta) {
      // find any file whose base name matches the track (case-insensitive)
      for (const [fileBase, fileMeta] of byFile.entries()) {
        if (fileBase.toLowerCase() === track.toLowerCase()) {
          meta = fileMeta;
          break;
        }
      }
    }

    output.push({
      album: album.name,
      title: track,
      duration: meta && meta.duration ? meta.duration : null
    });
  });
});

// Write to file
fs.writeFileSync('album-track-durations.json', JSON.stringify(output, null, 2));
console.log('Wrote album-track-durations.json');