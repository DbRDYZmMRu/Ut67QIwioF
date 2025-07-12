// utils.js
import { store } from './store.js';
import { handleTrackClick } from './main.js';

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
    const trackList = document.getElementById(`track-list-${id}-div4`);
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
      if (highlightSong && track.dataset.song.toLowerCase().replace(/['’]/g, '') === highlightSong) {
        track.classList.add('highlighted');
      } else {
        track.classList.remove('highlighted');
      }
      track.removeEventListener('click', handleTrackClickWrapper);
      function handleTrackClickWrapper(event) {
        event.stopPropagation();
        console.log('Track item clicked:', { id, song: track.dataset.song, trackId: track.dataset.trackId });
        handleTrackClick(track, id, false);
      }
      track.addEventListener('click', handleTrackClickWrapper);
      console.log('Click listener added to track:', track.dataset.song);
    });
    const petiteVueTrackList = document.querySelector(`#album-${id} .album-track-list`);
    if (petiteVueTrackList) {
      const tracks = petiteVueTrackList.querySelectorAll('.album-track');
      console.log('Found album tracks for album', id, tracks.length);
      tracks.forEach(tr => {
        if (highlightSong && tr.dataset.song.toLowerCase().replace(/['’]/g, '') === highlightSong) {
          tr.classList.add('highlighted');
        } else {
          tr.classList.remove('highlighted');
        }
        tr.removeEventListener('click', handleTrackClick);
        tr.addEventListener('click', () => {
          console.log('Album track clicked:', { id, song: tr.dataset.song, trackId: tr.dataset.trackId });
          handleTrackClick(tr, id, true);
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
            console.log('Album track initialized click:', { id, song: track.dataset.song, trackId: track.dataset.trackId });
            handleTrackClick(track, id, true);
          });
        });
      } else {
        console.warn(`Album track list not found for album ${id}`);
      }
    }
    const albumCards = document.querySelectorAll('.album-card');
    console.log(`Found ${albumCards.length} album cards in div4`);
    albumCards.forEach(card => {
      const albumItem = card.querySelector('.album-item');
      if (albumItem) {
        const albumId = albumItem.dataset.albumId;
        console.log(`Initializing static track list for album id ${albumId}`);
        toggleTrackList(albumId);
      }
    });
  } catch (err) {
    console.error('Error in initAlbumTrackLists:', err.message);
  }
}