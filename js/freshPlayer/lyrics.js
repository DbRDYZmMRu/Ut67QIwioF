// lyrics.js
import { normalizeName, rgbToHex } from './utils.js';
import { store } from './store.js';

// [Unchanged functions: fetchLyrics, getFetchUrl, renderLyrics, updatePageContent, highlightAndOpenAlbum]
export async function fetchLyrics(albumName, songTitle) {
  try {
    const statusDiv = document.getElementById('status');
    const fetchUrl = getFetchUrl(albumName, songTitle);
    if (!fetchUrl) {
      const errorMsg = 'Error: Invalid album or song';
      console.error(errorMsg, { albumName, songTitle });
      if (statusDiv) {
        statusDiv.textContent = errorMsg;
        statusDiv.className = 'error';
      }
      return null;
    }
    if (statusDiv) {
      statusDiv.textContent = 'Loading lyrics...';
      statusDiv.className = 'loading';
    }
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error(`Failed to fetch ${fetchUrl}: ${response.status}`);
    const data = await response.json();
    if (statusDiv) {
      statusDiv.textContent = 'Lyrics loaded';
      statusDiv.className = 'success';
    }
    return data;
  } catch (err) {
    const errorMsg = `Error: ${err.message}`;
    console.error('Fetch error:', err.message, { albumName, songTitle });
    const statusDiv = document.getElementById('status');
    if (statusDiv) {
      statusDiv.textContent = errorMsg;
      statusDiv.className = 'error';
    }
    return null;
  }
}

function getFetchUrl(albumName, songTitle) {
  try {
    if (!albumName || !songTitle) throw new Error('Missing album or song');
    const normalizedAlbumQuery = normalizeName(albumName);
    const album = store.albums.find(a => normalizeName(a.name) === normalizedAlbumQuery);
    if (!album) throw new Error(`Album "${albumName}" not found`);
    const normalizedSongTitle = normalizeName(songTitle);
    const song = album.tracks.find(t => normalizeName(t) === normalizedSongTitle);
    if (!song) throw new Error(`Song "${songTitle}" not found in album "${albumName}"`);
    return `../pages/lyricsDB/json/${album.name}/${song}.json`;
  } catch (err) {
    console.error('Error building fetch URL:', err.message, { albumName, songTitle });
    return null;
  }
}

export function renderLyrics(lyricsData) {
  try {
    const lyricsContainer = document.querySelector('.lyrics');
    const annotationPanel = document.getElementById('annotations-panel');
    if (!lyricsContainer || !annotationPanel || !lyricsData) {
      console.error('Missing lyrics container, annotation panel, or lyrics data');
      return;
    }
    const annotationText = document.getElementById('annotation-text');
    const closePanelBtn = document.getElementById('close-panel');
    const overlay = document.querySelector('.overlay') || document.createElement('div');
    if (!overlay.className) {
      overlay.className = 'overlay';
      document.body.appendChild(overlay);
    }
    
    function openPanel(annotation) {
      try {
        annotationText.innerHTML = annotation || 'No annotation available.';
        annotationPanel.classList.add('active');
        overlay.classList.add('active');
      } catch (err) {
        console.error('Error in renderLyrics openPanel:', err.message);
      }
    }
    
    function closePanel() {
      try {
        annotationPanel.classList.remove('active');
        overlay.classList.remove('active');
      } catch (err) {
        console.error('Error in renderLyrics closePanel:', err.message);
      }
    }
    
    lyricsContainer.innerHTML = '';
    lyricsData.forEach((entry, index) => {
      const lineElement = document.createElement('div');
      lineElement.classList.add('lyric-line');
      lineElement.dataset.timestamp = entry.timestamp;
      if (entry.line === '') {
        lineElement.innerHTML = ' ';
      } else {
        let processedLine = entry.line;
        processedLine = processedLine.replace(
          /\[([^\]]+)\]/g,
          '<span class="bold-content">[$1]</span>'
        );
        if (entry.annotations) {
          for (const [word, annotation] of Object.entries(entry.annotations)) {
            const escapedWord = word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            const annotatedWord = `<span class="annotated-word" data-annotation="${annotation}">${word}</span>`;
            processedLine = processedLine.replace(
              new RegExp(`\\b${escapedWord}(?=\\s|$|[.,!?])`, 'g'),
              annotatedWord
            );
          }
        }
        lineElement.innerHTML = processedLine;
      }
      lyricsContainer.appendChild(lineElement);
    });
    
    const annotatedWords = document.querySelectorAll('.annotated-word');
    annotatedWords.forEach(word => {
      word.addEventListener('click', () => {
        try {
          const annotation = word.dataset.annotation;
          openPanel(annotation);
        } catch (err) {
          console.error('Error in renderLyrics annotated word click:', err.message);
        }
      });
    });
    
    closePanelBtn?.removeEventListener('click', closePanel);
    closePanelBtn?.addEventListener('click', closePanel);
    overlay.removeEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);
  } catch (err) {
    console.error('Error in renderLyrics:', err.message);
  }
}

export function updatePageContent(albumName, songTitle, data) {
  try {
    const normalizedAlbumQuery = normalizeName(albumName);
    const album = store.albums.find(a => normalizeName(a.name) === normalizedAlbumQuery);
    if (!album) {
      console.error(`Album "${albumName}" not found`, { albumName });
      return;
    }
    const normalizedSongTitle = normalizeName(songTitle);
    const song = album.tracks.find(t => normalizeName(t) === normalizedSongTitle);
    if (!song) {
      console.error(`Song "${songTitle}" not found in album "${albumName}"`, { songTitle, albumName });
      return;
    }
    const trackTitleEl = document.getElementById('track-title');
    const albumNameEl = document.getElementById('album-name');
    const trackCoverEl = document.getElementById('track-cover');
    const header = document.getElementById('dynamic-header');
    if (trackTitleEl) trackTitleEl.textContent = song;
    if (albumNameEl) albumNameEl.textContent = album.name;
    if (trackCoverEl) {
      const coverSrc = data.cover || '../images/default.jpg';
      trackCoverEl.src = coverSrc;
      trackCoverEl.alt = `${song} Cover`;
      if (header) {
        header.style.background = 'linear-gradient(135deg, #444444, #666666)';
      }
      if (typeof ColorThief !== 'undefined' && header) {
        const applyColors = () => {
          try {
            const colorThief = new ColorThief();
            const palette = colorThief.getPalette(trackCoverEl, 2);
            if (palette && palette.length >= 2) {
              const [dominantColor, secondaryColor] = palette;
              const dominantHex = rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2]);
              const secondaryHex = rgbToHex(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
              header.style.background = `linear-gradient(135deg, ${dominantHex}, ${secondaryHex})`;
            }
          } catch (err) {
            console.error(`Error extracting colors for ${coverSrc}:`, err.message);
          }
        };
        if (trackCoverEl.complete) {
          applyColors();
        } else {
          trackCoverEl.onload = applyColors;
          trackCoverEl.onerror = () => console.error(`Failed to load image: ${coverSrc}`);
        }
      }
    }
    const creditWriterEl = document.getElementById('credit-writer');
    const creditLabelEl = document.getElementById('credit-label');
    const creditReleaseDateEl = document.getElementById('credit-release-date');
    if (creditWriterEl) creditWriterEl.textContent = 'Frith Hilton';
    if (creditLabelEl) creditLabelEl.textContent = 'Fresh Boy Chilling';
    if (creditReleaseDateEl) creditReleaseDateEl.textContent = data.release_date || album.releaseDate;
    const songBioEl = document.getElementById('song-bio');
    if (songBioEl) {
      songBioEl.textContent = data.bio || 'Song information will be displayed here when available.';
    }
  } catch (err) {
    console.error('Error in updatePageContent:', err.message, { albumName, songTitle });
  }
}

export function highlightCurrentLyric(lyrics, currentTime) {
  try {
    const lyricsContainer = document.querySelector('.lyrics');
    if (!lyricsContainer) {
      console.error('Error in highlightCurrentLyric: Missing lyrics container');
      return;
    }
    const lyricLines = lyricsContainer.querySelectorAll('.lyric-line');
    let currentIndex = -1;
    let lastNonEmptyIndex = -1;

    // Find the last non-empty line with valid timestamp before or at currentTime
    for (let i = 0; i < lyrics.length; i++) {
      const timestamp = parseFloat(lyrics[i].timestamp);
      const isEmpty = lyrics[i].line.trim() === '';
      const isValidTimestamp = timestamp > 0 || (timestamp === 0 && !isEmpty);

      if (isValidTimestamp && !isEmpty && timestamp <= currentTime) {
        lastNonEmptyIndex = i;
      }

      // Check if this is the last valid line or if the next non-empty line's timestamp is > currentTime
      if (lastNonEmptyIndex !== -1 && (i === lyrics.length - 1 || getNextNonEmptyTimestamp(lyrics, i + 1) > currentTime)) {
        currentIndex = lastNonEmptyIndex;
        break;
      }
    }

    // Apply highlight class to the current non-empty line
    lyricLines.forEach((line, index) => {
      if (index === currentIndex) {
        line.classList.add('highlight');
      } else {
        line.classList.remove('highlight');
      }
    });
  } catch (err) {
    console.error('Error in highlightCurrentLyric:', err.message, { currentTime });
  }
}

// Helper function to find the timestamp of the next non-empty line with valid timestamp
function getNextNonEmptyTimestamp(lyrics, startIndex) {
  for (let i = startIndex; i < lyrics.length; i++) {
    const timestamp = parseFloat(lyrics[i].timestamp);
    if (lyrics[i].line.trim() !== '' && timestamp > 0) {
      return timestamp;
    }
  }
  return Infinity; // No more non-empty lines with valid timestamps
}

export function highlightAndOpenAlbum(albumName, songTitle) {
  try {
    console.log('highlightAndOpenAlbum called with:', { albumName, songTitle });
    const albumList = document.querySelector('.album-list');
    if (!albumList) {
      console.error('Error in highlightAndOpenAlbum: Missing album list');
      return;
    }
    const normalizedAlbumQuery = normalizeName(albumName);
    const albumIndex = store.albums.findIndex(a => normalizeName(a.name) === normalizedAlbumQuery);
    if (albumIndex === -1) {
      console.error('Error in highlightAndOpenAlbum: Album not found', { albumName });
      return;
    }
    const toggleId = albumIndex + 1;
    console.log('Album index:', albumIndex, 'toggleId:', toggleId);
    const albumCards = Array.from(albumList.children);
    const currentAlbumCard = albumCards.find(albumCard => {
      const albumItem = albumCard.querySelector('.album-item');
      if (!albumItem) return false;
      const onclickAttr = albumItem.getAttribute('onclick') || '';
      const toggleMatch = onclickAttr.match(/toggleTrackList\((\d+)\)/);
      return toggleMatch && parseInt(toggleMatch[1]) === toggleId;
    });
    if (!currentAlbumCard) {
      console.error('Error in highlightAndOpenAlbum: Album card not found', { toggleId });
      return;
    }
    albumList.prepend(currentAlbumCard);
    const allTrackLists = document.querySelectorAll('.track-list');
    allTrackLists.forEach(list => list.classList.remove('active'));
    document.querySelectorAll('.track-item, .album-track').forEach(track => {
      track.classList.remove('highlighted');
    });
    const normalizedSongTitle = normalizeName(songTitle);
    console.log('Calling toggleTrackList with id:', toggleId, 'highlightSong:', normalizedSongTitle);
    toggleTrackList(toggleId, normalizedSongTitle);
    // Force re-highlight after a short delay to ensure DOM updates
    setTimeout(() => {
      const trackList = document.getElementById(`track-list-${toggleId}`);
      if (trackList) {
        const tracks = trackList.querySelectorAll('.track-item');
        tracks.forEach(track => {
          if (normalizeName(track.dataset.song) === normalizedSongTitle) {
            console.log('Highlighting track:', track.dataset.song);
            track.classList.add('highlighted');
          } else {
            track.classList.remove('highlighted');
          }
        });
      }
    }, 100);
  } catch (err) {
    console.error('Error in highlightAndOpenAlbum:', err.message, { albumName, songTitle });
  }
}