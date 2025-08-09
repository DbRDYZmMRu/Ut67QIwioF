import { store, mountApp } from './store.js';
import { initializeAnimations, initializeDraggable } from './animationManager.js';
import { initializePlayerControls } from './playerControls.js';
import { initializeSeekBar, updateProgress } from './progressManager.js';
import { initializeSearch } from './searchManager.js';
import { initializeTrackList } from './trackListManager.js';
import { initializeAudioPlayback } from './audioPlayback.js';
import { initializeMediaSession } from './mediaSessionManager.js';
import { renderLyrics } from './lyricsManager.js';
import { initializePlaylists } from './playlistManager.js';

// Debounce function to limit event frequency
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Function to update toggle position
function updateTogglePosition() {
  try {
    const toggleSwitch = document.querySelector('.form-check.form-switch');
    if (!toggleSwitch) {
      console.warn('Toggle switch not found');
      return;
    }
    // Add .floating-toggle when lyricsFocusEnabled is true
    if (store.lyricsFocusEnabled) {
      toggleSwitch.classList.add('floating-toggle');
    } else {
      toggleSwitch.classList.remove('floating-toggle');
    }
    console.log('updateTogglePosition:', {
      lyricsFocusEnabled: store.lyricsFocusEnabled,
      hasFloatingToggle: toggleSwitch.classList.contains('floating-toggle'),
      checkboxChecked: document.getElementById('lyricsFocusToggle')?.checked,
      togglePosition: toggleSwitch.getBoundingClientRect()
    });
  } catch (err) {
    console.error('Error in updateTogglePosition:', err.message);
  }
}

// Function to ensure lyrics container is centered, with retry
function ensureLyricsCentered() {
  try {
    const lyricsContainerParent = document.querySelector('.lyrics-container');
    if (!lyricsContainerParent) {
      console.warn('Lyrics container not found, retrying...');
      setTimeout(ensureLyricsCentered, 100); // Retry after 100ms
      return;
    }
    if (store.lyricsFocusEnabled) {
      renderLyrics.centerLyricsContainer();
      console.log('ensureLyricsCentered: Centering triggered');
    }
  } catch (err) {
    console.error('Error in ensureLyricsCentered:', err.message);
  }
}

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
    initializePlaylists();
    
    // Handle URL track parameter
    const urlParams = new URLSearchParams(window.location.search);
    const trackId = urlParams.get('track');
    if (trackId) {
      store.playTrack(trackId).then(() => {
        updateTogglePosition();
        ensureLyricsCentered();
      });
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
    
    // Watch for lyricsFocusEnabled changes via checkbox
    const lyricsFocusToggle = document.getElementById('lyricsFocusToggle');
    if (lyricsFocusToggle) {
      // Force initial sync
      lyricsFocusToggle.checked = store.lyricsFocusEnabled;
      lyricsFocusToggle.addEventListener('change', () => {
        try {
          // Ensure store matches checkbox state
          store.lyricsFocusEnabled = lyricsFocusToggle.checked;
          updateTogglePosition();
          if (store.lyricsFocusEnabled) {
            ensureLyricsCentered(); // Center immediately when toggled on
          }
          console.log('Toggle changed:', {
            lyricsFocusEnabled: store.lyricsFocusEnabled,
            checkboxChecked: lyricsFocusToggle.checked,
            togglePosition: document.querySelector('.form-check.form-switch')?.getBoundingClientRect()
          });
        } catch (err) {
          console.error('Error in lyricsFocusToggle change:', err.message);
        }
      });
    } else {
      console.warn('Lyrics focus toggle not found');
    }
    
    // Re-center on scroll when lyricsFocusEnabled is true
    const handleScroll = debounce(() => {
      try {
        if (store.lyricsFocusEnabled) {
          renderLyrics.centerLyricsContainer();
        }
      } catch (err) {
        console.error('Error in scroll handler:', err.message);
      }
    }, 200);
    
    window.addEventListener('scroll', handleScroll);
    
    // Update toggle position and centering on resize
    const handleResize = debounce(() => {
      try {
        updateTogglePosition();
        ensureLyricsCentered();
      } catch (err) {
        console.error('Error in resize handler:', err.message);
      }
    }, 200);
    
    window.addEventListener('resize', handleResize);
    
    // Mount Petite-Vue app and ensure initial state
    mountApp();
    // Delay to ensure DOM and Petite-Vue reactivity are ready
    setTimeout(() => {
      if (lyricsFocusToggle) {
        lyricsFocusToggle.checked = store.lyricsFocusEnabled;
        console.log('Initial sync:', {
          lyricsFocusEnabled: store.lyricsFocusEnabled,
          checkboxChecked: lyricsFocusToggle.checked,
          togglePosition: document.querySelector('.form-check.form-switch')?.getBoundingClientRect()
        });
      }
      updateTogglePosition();
      ensureLyricsCentered();
    }, 0);
    
  } catch (err) {
    console.error('Error in DOMContentLoaded:', err.message);
  }
});