// utils.js
import { store } from './store.js';
import { handleTrackClick } from './main.js';

export function normalizeName(str) {
  try {
    return str
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/['’]/g, '');
  } catch (err) {
    console.error('Error in normalizeName:', err.message, { str });
    return '';
  }
}

export function rgbToHex(r, g, b) {
  try {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, '0')}`;
  } catch (err) {
    console.error('Error in rgbToHex:', err.message, { r, g, b });
    return '#000000';
  }
}

export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function toggleTrackList(id, highlightSong = null) {
  try {
    console.log('toggleTrackList called with id:', id, 'highlightSong:', highlightSong);
    const trackList = document.getElementById(`track-list-${id}`);
    if (!trackList) {
      console.error('Error in toggleTrackList: Track list not found', { id });
      return;
    }
    console.log('Found trackList:', trackList);
    const albumCard = trackList.closest('.album-card');
    if (!albumCard) {
      console.error('Error in toggleTrackList: Album card not found', { id });
      return;
    }
    const isOpening = !trackList.classList.contains('active');
    trackList.classList.toggle('active');
    console.log('Track list toggled, isOpening:', isOpening);
    if (isOpening) {
      albumCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const tracks = trackList.querySelectorAll('.track-item');
    console.log(`Found ${tracks.length} track items for album id ${id}`);
    tracks.forEach(track => {
      if (highlightSong && normalizeName(track.dataset.song) === highlightSong) {
        track.classList.add('highlighted');
      } else {
        track.classList.remove('highlighted');
      }
      // Remove existing listeners to prevent duplicates
      track.removeEventListener('click', handleTrackClickWrapper);
      // Define a named function for the event listener to ensure proper removal
      function handleTrackClickWrapper() {
        console.log('Track item clicked:', { id, song: track.dataset.song });
        handleTrackClick(track, id, false); // false for non-Petite-Vue context
        //store.switchView_ii('div4'); // Ensure view is div4
      }
      track.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from bubbling to .album-item
        console.log('Track item clicked:', { id, song: track.dataset.song });
        handleTrackClick(track, id, false);
        store.switchView_ii('div4');
      });
      console.log('Click listener added to track:', track.dataset.song);
    });
    // Handle Petite-Vue track list for div3
    const petiteVueTrackList = document.querySelector(`#album-${id} .album-track-list`);
    if (petiteVueTrackList) {
      const tracks = petiteVueTrackList.querySelectorAll('.album-track');
      console.log('Found album tracks for album', id, tracks.length);
      tracks.forEach(tr => {
        if (highlightSong && normalizeName(tr.dataset.song) === highlightSong) {
          tr.classList.add('highlighted');
        } else {
          tr.classList.remove('highlighted');
        }
        tr.removeEventListener('click', handleTrackClick);
        tr.addEventListener('click', () => {
          console.log('Album track clicked:', { id, song: tr.dataset.song });
          handleTrackClick(tr, id, true); // true for Petite-Vue context
        });
      });
    } else {
      console.warn('Petite-Vue track list not found for album', id);
    }
  } catch (err) {
    console.error('Error in toggleTrackList:', err.message, { id, highlightSong });
  }
}

export function initAlbumTrackLists() {
  try {
    for (let id = 1; id <= store.albums.length; id++) {
      const trackList = document.querySelector(`#album-${id} .album-track-list`);
      if (trackList) {
        const tracks = trackList.querySelectorAll('.album-track');
        console.log(`Initializing album ${id} with ${tracks.length} tracks`);
        tracks.forEach(track => {
          track.removeEventListener('click', handleTrackClick);
          track.addEventListener('click', () => {
            console.log('Album track initialized click:', { id, song: track.dataset.song });
            handleTrackClick(track, id, true);
          });
        });
      } else {
        console.warn(`Album track list not found for album ${id}`);
      }
    }
    // Initialize static track lists in div4
    const albumCards = document.querySelectorAll('.album-card');
    console.log(`Found ${albumCards.length} album cards in div4`);
    albumCards.forEach(card => {
      const albumItem = card.querySelector('.album-item');
      if (albumItem) {
        const onclickAttr = albumItem.getAttribute('onclick');
        const toggleMatch = onclickAttr?.match(/toggleTrackList\((\d+)\)/);
        if (toggleMatch) {
          const id = parseInt(toggleMatch[1]);
          console.log(`Initializing static track list for album id ${id}`);
          toggleTrackList(id); // Initialize listeners for static track lists
        }
      }
    });
  } catch (err) {
    console.error('Error in initAlbumTrackLists:', err.message);
  }
}