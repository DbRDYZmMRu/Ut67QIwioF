// trackListManager.js
import { store } from './store.js';

export function toggleTrackList(id, highlightSong = null) {
  try {
    console.log('toggleTrackList called with id:', id, 'highlightSong:', highlightSong);
    const trackList = document.getElementById(`track-list-${id}-div4`);
    if (!trackList) {
      console.error('Error in toggleTrackList: Track list not found', { id });
      return;
    }
    const albumCard = trackList.closest('.album-card');
    if (!albumCard) {
      console.error('Error in toggleTrackList: Album card not found', { id });
      return;
    }
    const isOpening = !trackList.classList.contains('active');
    trackList.classList.toggle('active');
    trackList.style.display = trackList.classList.contains('active') ? 'block' : 'none';
    if (isOpening) {
      albumCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const tracks = trackList.querySelectorAll('.track-item');
    tracks.forEach(track => {
      if (highlightSong && track.dataset.song.toLowerCase().replace(/['’]/g, '') === highlightSong) {
        track.classList.add('highlighted');
      } else {
        track.classList.remove('highlighted');
      }
      track.removeEventListener('click', handleTrackClick);
      track.addEventListener('click', (event) => {
        event.stopPropagation();
        handleTrackClick(track, id, false);
      });
    });
    const petiteVueTrackList = document.querySelector(`#album-${id} .album-track-list`);
    if (petiteVueTrackList) {
      const tracks = petiteVueTrackList.querySelectorAll('.album-track');
      tracks.forEach(tr => {
        if (highlightSong && tr.dataset.song.toLowerCase().replace(/['’]/g, '') === highlightSong) {
          tr.classList.add('highlighted');
        } else {
          tr.classList.remove('highlighted');
        }
        tr.removeEventListener('click', handleTrackClick);
        tr.addEventListener('click', () => {
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

export function initializeTrackList() {
  try {
    for (let id = 1; id <= store.albums.length; id++) {
      const trackList = document.querySelector(`#album-${id} .album-track-list`);
      if (trackList) {
        const tracks = trackList.querySelectorAll('.album-track');
        tracks.forEach(track => {
          track.removeEventListener('click', handleTrackClick);
          track.addEventListener('click', () => {
            handleTrackClick(track, id, true);
          });
        });
      }
      const albumCards = document.querySelectorAll('.album-card');
      albumCards.forEach(card => {
        const albumItem = card.querySelector('.album-item');
        if (albumItem) {
          const albumId = albumItem.dataset.albumId;
          toggleTrackList(albumId);
        }
      });
    }
  } catch (err) {
    console.error('Error in initializeTrackList:', err.message);
  }
}

function handleTrackClick(trackElement, albumId, isPetiteVue) {
  try {
    const trackClass = isPetiteVue ? '.album-track' : '.track-item';
    const track = trackElement.closest(trackClass);
    if (!track) {
      console.error('Error in handleTrackClick: Track element not found', { trackClass });
      return;
    }
    const trackId = track.dataset.trackId;
    if (!trackId) {
      console.error('Error in handleTrackClick: Missing trackId', { albumId });
      return;
    }
    console.log('handleTrackClick:', { trackId });
    let playTimeout = null;
    if (playTimeout) {
      clearTimeout(playTimeout);
    }
    store.playTrack(trackId);
    if (isPetiteVue) {
      store.switchView_ii('div4');
    }
    const trackList = document.getElementById(`track-list-${albumId}-div4`);
    if (trackList) {
      const tracks = trackList.querySelectorAll('.track-item');
      tracks.forEach(t => {
        if (t.dataset.trackId === trackId) {
          console.log('Highlighting track:', t.dataset.song);
          t.classList.add('highlighted');
        } else {
          t.classList.remove('highlighted');
        }
      });
    }
  } catch (err) {
    console.error('Error in handleTrackClick:', err.message, { albumId, isPetiteVue });
  }
}