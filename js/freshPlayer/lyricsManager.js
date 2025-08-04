import { store } from './store.js';
import { rgbToHex } from './utils.js';

// Allowed tags and attributes (aligned with editor)
const allowedTags = [
  'a', 'img', 'iframe', 'p', 'strong', 'em', 'br', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ol', 'ul', 'li', 'hr', 's', 'sub', 'sup', 'pre', 'code', 'blockquote', 'q'
];
const allowedAttributes = {
  a: ['href', 'target', 'rel'],
  img: ['src', 'alt', 'width', 'height'],
  iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen'],
  p: [], strong: [], em: [], br: [], div: [], h1: [], h2: [], h3: [], h4: [], h5: [], h6: [],
  ol: [], ul: [], li: [], hr: [], s: [], sub: [], sup: [], pre: [], code: [],
  blockquote: ['cite'], q: ['cite']
};

// Simple HTML sanitizer with DOMPurify fallback
function sanitizeHTML(html) {
  // Try DOMPurify first
  if (typeof DOMPurify !== 'undefined') {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: Object.values(allowedAttributes).flat()
    });
  }

  // Fallback to original sanitizer
  const allowedTagsLocal = ['a', 'img', 'iframe', 'p', 'strong', 'em', 'br', 'div'];
  const allowedAttributesLocal = {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
    iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen']
  };

  const parser = new DOMParser();
  const dom = parser.parseFromString(`<!DOCTYPE html><body>${html}`, 'text/html');
  const cleanElement = document.createElement('div');

  function cleanNode(node, parent) {
    if (node.nodeType === Node.TEXT_NODE) {
      parent.appendChild(document.createTextNode(node.textContent));
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const tag = node.tagName.toLowerCase();
    if (!allowedTagsLocal.includes(tag)) {
      Array.from(node.childNodes).forEach(child => cleanNode(child, parent));
      return;
    }

    const cleanNodeElement = document.createElement(tag);
    Array.from(node.attributes).forEach(attr => {
      const attrName = attr.name.toLowerCase();
      if (allowedAttributesLocal[tag]?.includes(attrName)) {
        if (['href', 'src'].includes(attrName)) {
          const value = attr.value;
          if (!value.match(/^(https?:\/\/|\/)/)) return;
        }
        cleanNodeElement.setAttribute(attr.name, attr.value);
      }
    });

    if (tag === 'a') {
      cleanNodeElement.setAttribute('target', '_blank');
      cleanNodeElement.setAttribute('rel', 'noopener noreferrer');
    }
    if (tag === 'iframe') {
      cleanNodeElement.setAttribute('frameborder', '0');
      cleanNodeElement.setAttribute('allow', 'autoplay; encrypted-media');
    }

    Array.from(node.childNodes).forEach(child => cleanNode(child, cleanNodeElement));
    parent.appendChild(cleanNodeElement);
  }

  Array.from(dom.body.childNodes).forEach(child => cleanNode(child, cleanElement));
  return cleanElement.innerHTML;
}

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
        const totalHeight = lyricsContainer.scrollHeight;
        const minHeight = 800;
        const maxHeight = 1500;
        const calculatedHeight = Math.max(minHeight, Math.min(totalHeight / 2, maxHeight));
        lyricsContainerParent.style.maxHeight = `${calculatedHeight}px`;
      } catch (err) {
        console.error('Error in setLyricsContainerHeight:', err.message);
      }
    }

    // Function to center lyrics container
    function centerLyricsContainer() {
      try {
        const lyricsContainerParent = document.querySelector('.lyrics-container');
        if (!lyricsContainerParent) {
          console.error('Missing .lyrics-container');
          return;
        }
        if (store.lyricsFocusEnabled) {
          const viewportHeight = window.innerHeight;
          const containerRect = lyricsContainerParent.getBoundingClientRect();
          const containerHeight = containerRect.height;
          const containerTop = containerRect.top + window.scrollY;
          const scrollTarget = containerTop - (viewportHeight - containerHeight) / 2;
          window.scrollTo({
            top: Math.max(0, scrollTarget),
            behavior: 'smooth'
          });
        }
      } catch (err) {
        console.error('Error in centerLyricsContainer:', err.message);
      }
    }

    renderLyrics.centerLyricsContainer = centerLyricsContainer;

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
          // Split line into words, preserving spaces
          const words = entry.line.split(/(\s+)/);
          let wordIndex = -1;
          const annotatedWords = new Map();
          // Map annotations to their word indices
          for (const [key, annotation] of Object.entries(entry.annotations)) {
            const [word, timestamp, index] = key.split('_');
            if (timestamp === entry.timestamp) {
              annotatedWords.set(parseInt(index), { word, annotation });
            }
          }
          // Process each word
          const processedWords = words.map((word, i) => {
            if (/\s+/.test(word)) return word; // Preserve spaces
            wordIndex++;
            const annotationData = annotatedWords.get(wordIndex);
            if (annotationData && word.toLowerCase() === annotationData.word.toLowerCase()) {
              const encodedAnnotation = encodeURIComponent(annotationData.annotation);
              return `<span class="annotated-word" data-annotation="${encodedAnnotation}" data-annotation-key="${annotationData.word}_${entry.timestamp}_${wordIndex}">${word}</span>`;
            }
            return word;
          });
          processedLine = processedWords.join('');
        }
        lineElement.innerHTML = processedLine;
      }
      lyricsContainer.appendChild(lineElement);
    });

    setLyricsContainerHeight();
    centerLyricsContainer();

    window.removeEventListener('resize', setLyricsContainerHeight);
    window.addEventListener('resize', setLyricsContainerHeight);
    window.removeEventListener('resize', centerLyricsContainer);
    window.addEventListener('resize', centerLyricsContainer);

    // Handle annotations
    const annotatedWords = document.querySelectorAll('.annotated-word');
    annotatedWords.forEach(word => {
      word.addEventListener('click', () => {
        try {
          const annotation = decodeURIComponent(word.dataset.annotation);
          annotationText.innerHTML = sanitizeHTML(annotation) || 'No annotation available.';
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
        annotationText.innerHTML = '';
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
          const containerHeight = lyricsContainer.clientHeight;
          const lineHeight = line.offsetHeight;
          const lineTop = line.offsetTop;
          const scrollTop = lineTop - (containerHeight / 2) + (lineHeight / 2);
          const maxScroll = lyricsContainer.scrollHeight - containerHeight;
          const finalScrollTop = Math.max(0, Math.min(scrollTop, maxScroll));
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