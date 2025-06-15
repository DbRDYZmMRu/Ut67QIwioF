// main.js
import { store, mountApp } from './store.js';
import { initializeAnimations, initializeDraggable, initializeSeekBar, updateProgress } from './animations.js'; // Removed updateTimeDisplay
import { initializePlayer, updateTimeDisplay } from './player.js'; // Added updateTimeDisplay
import { initializeSearch } from './search.js';
import { initAlbumTrackLists, normalizeName } from './utils.js';

let playTimeout = null;

export function handleTrackClick(trackElement, albumId, isPetiteVue) {
  try {
    const trackClass = isPetiteVue ? '.album-track' : '.track-item';
    const track = trackElement.closest(trackClass);
    if (!track) {
      console.error('Error in handleTrackClick: Track element not found', { trackClass });
      return;
    }
    if (albumId < 1 || albumId > store.albums.length) {
      console.error('Error in handleTrackClick: Invalid albumId', { albumId });
      return;
    }
    const album = store.albums[albumId - 1].name;
    const song = track.dataset.song;
    if (!song) {
      console.error('Error in handleTrackClick: Missing song data', { albumId });
      return;
    }
    console.log('handleTrackClick:', { album, song });
    
    // Clear any pending play requests
    if (playTimeout) {
      clearTimeout(playTimeout);
    }
    
    // Debounce play request
    playTimeout = setTimeout(() => {
      store.playTrack(album, song);
      if (isPetiteVue) {
        store.switchView_ii('div4');
      }
      // Highlight track in div4
      const normalizedSong = normalizeName(song);
      const trackList = document.getElementById(`track-list-${albumId}`);
      if (trackList) {
        const tracks = trackList.querySelectorAll('.track-item');
        tracks.forEach(t => {
          if (normalizeName(t.dataset.song) === normalizedSong) {
            console.log('Highlighting track:', t.dataset.song);
            t.classList.add('highlighted');
          } else {
            t.classList.remove('highlighted');
          }
        });
      }
    }, 100); // 100ms debounce
  } catch (err) {
    console.error('Error in handleTrackClick:', err.message, { albumId, song, isPetiteVue });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    initializeAnimations();
    initializeDraggable();
    initializeSeekBar();
    updateTimeDisplay();
    updateProgress();
    initializePlayer();
    initializeSearch();
    initAlbumTrackLists();
    
    const urlParams = new URLSearchParams(window.location.search);
    const albumName = urlParams.get('album');
    const songTitle = urlParams.get('song');
    if (albumName && songTitle) {
      store.playTrack(albumName, songTitle);
    }
    
    if (typeof Swiper !== 'undefined') {
      new Swiper('.swiper-container', {
        slidesPerView: 3,
        spaceBetween: 20,
        loop: true,
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        pagination: { el: '.swiper-pagination', clickable: true },
        breakpoints: {
          76768: { slidesPerView: 2, spaceBetween: 15 },
          576: { slidesPerView: 1, spaceBetween: 10 }
        }
      });
    }
    
    mountApp();
  } catch (err) {
    console.error('Error in DOMContentLoaded:', err.message);
  }
});