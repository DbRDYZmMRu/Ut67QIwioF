// main.js
import { store, mountApp } from './store.js';
import { initializeAnimations, initializeDraggable } from './animationManager.js';
import { initializePlayerControls } from './playerControls.js';
import { initializeSeekBar, updateProgress } from './progressManager.js';
import { initializeSearch } from './searchManager.js';
import { initializeTrackList } from './trackListManager.js';
import { initializeAudioPlayback } from './audioPlayback.js';
import { initializeMediaSession } from './mediaSessionManager.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize all modules
    initializeAnimations();
    initializeDraggable();
    initializeSeekBar();
    initializePlayerControls();
    initializeAudioPlayback();
    initializeSearch();
    initializeTrackList();
    initializeMediaSession();
    
    // Handle URL track parameter
    const urlParams = new URLSearchParams(window.location.search);
    const trackId = urlParams.get('track');
    if (trackId) {
      store.playTrack(trackId);
    }
    
    // Initialize Swiper for carousel
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
    
    // Mount Petite-Vue app
    mountApp();
  } catch (err) {
    console.error('Error in DOMContentLoaded:', err.message);
  }
});