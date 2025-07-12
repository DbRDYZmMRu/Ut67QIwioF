// main.js
import { store, mountApp } from './store.js';
import { initializeAnimations, initializeDraggable, initializeSeekBar, updateProgress } from './animations.js';
import { initializePlayer, updateTimeDisplay } from './player.js';
import { initializeSearch } from './search.js';
import { initAlbumTrackLists } from './utils.js';

let playTimeout = null;

export function handleTrackClick(trackElement, albumId, isPetiteVue) {
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
    const trackId = urlParams.get('track');
    if (trackId) {
      store.playTrack(trackId);
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