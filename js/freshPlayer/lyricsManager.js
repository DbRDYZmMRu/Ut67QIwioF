// lyricsManager.js
import { store } from './store.js';
import { rgbToHex } from './utils.js';

export async function fetchTrackData(trackId) {
  try {
    console.log('fetchTrackData called with:', { trackId });
    const statusDiv = document.getElementById('status');
    if (statusDiv) {
      statusDiv.textContent = 'Loading track data...';
      statusDiv.className = 'loading';
    }
    const response = await fetch(`http://www.frithhilton.com.ng/resource/${trackId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch track data: ${response.status}`);
    }
    const data = await response.json();
    console.log('Track data:', data);
    if (statusDiv) {
      statusDiv.textContent = 'Track data loaded';
      statusDiv.className = 'success';
    }
    return data;
  } catch (err) {
    console.error('Error in fetchTrackData:', err.message, { trackId });
    const statusDiv = document.getElementById('status');
    if (statusDiv) {
      statusDiv.textContent = `Error: ${err.message}`;
      statusDiv.className = 'error';
    }
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
    
    // Function to set dynamic height
    function setLyricsContainerHeight() {
      try {
        const lyricsContainerParent = document.querySelector('.lyrics-container');
        if (!lyricsContainerParent) {
          console.error('Missing .lyrics-container');
          return;
        }
        // Calculate total height of lyrics content
        const totalHeight = lyricsContainer.scrollHeight;
        // Set max-height to half the content height, with constraints
        const minHeight = 400; // Minimum height to prevent tiny containers
        const maxCap = window.innerWidth <= 480 ? 1000 : 2000; // Respect original max-height for mobile/desktop
        const calculatedHeight = Math.max(minHeight, Math.min(totalHeight / 2, maxCap));
        lyricsContainerParent.style.maxHeight = `${calculatedHeight}px`;
      } catch (err) {
        console.error('Error in setLyricsContainerHeight:', err.message);
      }
    }
    
    // Clear existing content
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
    
    // Set initial height
    setLyricsContainerHeight();
    
    // Update height on window resize
    window.removeEventListener('resize', setLyricsContainerHeight); // Prevent duplicate listeners
    window.addEventListener('resize', setLyricsContainerHeight);
    
    // Handle annotations
    const annotatedWords = document.querySelectorAll('.annotated-word');
    annotatedWords.forEach(word => {
      word.addEventListener('click', () => {
        try {
          const annotation = word.dataset.annotation;
          annotationText.innerHTML = annotation || 'No annotation available.';
          annotationPanel.classList.add('active');
          overlay.classList.add('active');
        } catch (err) {
          console.error('Error in annotated word click:', err.message);
        }
      });
    });
    
    closePanelBtn?.removeEventListener('click', closePanel);
    closePanelBtn?.addEventListener('click', closePanel);
    overlay.removeEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);
    
    function closePanel() {
      try {
        annotationPanel.classList.remove('active');
        overlay.classList.remove('active');
      } catch (err) {
        console.error('Error in closePanel:', err.message);
      }
    }
  } catch (err) {
    console.error('Error in renderLyrics:', err.message);
  }
}

export function updatePageContent(trackId, data) {
  try {
    const album = store.albums.find(a => a.id === Number(data.album));
    if (!album) {
      console.error('Album not found', { albumId: data.album });
      return;
    }
    const song = album.songs.find(s => s.id === Number(trackId));
    if (!song) {
      console.error('Song not found', { trackId, albumId: data.album });
      return;
    }
    const trackTitleEl = document.getElementById('track-title');
    const albumNameEl = document.getElementById('album-name');
    const trackCoverEl = document.getElementById('track-cover');
    const header = document.getElementById('dynamic-header');
    if (trackTitleEl) trackTitleEl.textContent = data.json.song_title;
    if (albumNameEl) albumNameEl.textContent = album.title;
    if (trackCoverEl) {
      const coverSrc = data.cover || '../images/default.jpg';
      trackCoverEl.src = coverSrc;
      trackCoverEl.alt = `${data.json.song_title} Cover`;
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
    if (creditWriterEl) creditWriterEl.textContent = data.json.writer || 'Frith Hilton';
    if (creditLabelEl) creditLabelEl.textContent = 'Fresh Boy Chilling';
    if (creditReleaseDateEl) creditReleaseDateEl.textContent = data.json.release_date || album.releaseDate;
    const songBioEl = document.getElementById('song-bio');
    if (songBioEl) {
      songBioEl.textContent = data.json.bio || 'Song information will be displayed here when available.';
    }
  } catch (err) {
    console.error('Error in updatePageContent:', err.message, { trackId });
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
    
    for (let i = 0; i < lyrics.length; i++) {
      const timestamp = parseFloat(lyrics[i].timestamp);
      const isEmpty = lyrics[i].line.trim() === '';
      const isValidTimestamp = timestamp > 0 || (timestamp === 0 && !isEmpty);
      if (isValidTimestamp && !isEmpty && timestamp <= currentTime) {
        lastNonEmptyIndex = i;
      }
      if (lastNonEmptyIndex !== -1 && (i === lyrics.length - 1 || getNextNonEmptyTimestamp(lyrics, i + 1) > currentTime)) {
        currentIndex = lastNonEmptyIndex;
        break;
      }
    }
    
    lyricLines.forEach((line, index) => {
      if (index === currentIndex) {
        line.classList.add('highlight');
        if (store.lyricsFocusEnabled) {
          // Calculate the scroll position to center the highlighted line
          const containerHeight = lyricsContainer.clientHeight;
          const lineHeight = line.offsetHeight;
          const lineTop = line.offsetTop;
          const scrollTop = lineTop - (containerHeight / 2) + (lineHeight / 2);
          
          // Ensure the scroll position stays within bounds
          const maxScroll = lyricsContainer.scrollHeight - containerHeight;
          const finalScrollTop = Math.max(0, Math.min(scrollTop, maxScroll));
          
          // Smoothly scroll to the calculated position
          lyricsContainer.scrollTo({
            top: finalScrollTop,
            behavior: 'smooth'
          });
        }
      } else {
        line.classList.remove('highlight');
      }
    });
  } catch (err) {
    console.error('Error in highlightCurrentLyric:', err.message, { currentTime });
  }
}

function getNextNonEmptyTimestamp(lyrics, startIndex) {
  for (let i = startIndex; i < lyrics.length; i++) {
    const timestamp = parseFloat(lyrics[i].timestamp);
    if (lyrics[i].line.trim() !== '' && timestamp > 0) {
      return timestamp;
    }
  }
  return Infinity;
}

export function highlightAndOpenAlbum(trackId) {
  try {
    console.log('highlightAndOpenAlbum called with:', { trackId });
    const albumList = document.getElementById('album-list');
    if (!albumList) {
      console.error('Error in highlightAndOpenAlbum: Missing album-list');
      return;
    }
    const album = store.albums.find(a => a.songs.some(s => s.id === Number(trackId)));
    if (!album) {
      console.error('Error in highlightAndOpenAlbum: Album not found for track', { trackId });
      return;
    }
    const albumId = album.id;
    const albumCards = albumList.querySelectorAll('.album-card');
    const currentAlbumCard = Array.from(albumCards).find(card => card.dataset.albumId === String(albumId));
    if (!currentAlbumCard) {
      console.error('Error in highlightAndOpenAlbum: Album card not found', { albumId });
      return;
    }
    albumList.prepend(currentAlbumCard);
    document.querySelectorAll('.track-list').forEach(list => {
      list.classList.remove('active');
      list.style.display = 'none';
    });
    document.querySelectorAll('.track-item, .album-track').forEach(track => {
      track.classList.remove('highlighted');
    });
    const track = album.songs.find(s => s.id === Number(trackId));
    if (!track) {
      console.error('Error in highlightAndOpenAlbum: Track not found', { trackId, albumId });
      return;
    }
    const normalizedSongTitle = track.title.toLowerCase().replace(/['’]/g, '');
    window.toggleTrackList(albumId, normalizedSongTitle);
  } catch (err) {
    console.error('Error in highlightAndOpenAlbum:', err.message, { trackId });
  }
}