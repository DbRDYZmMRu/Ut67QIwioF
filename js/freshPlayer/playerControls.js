// playerControls.js
import gsap from 'https://esm.sh/gsap';
import { playerState } from './state.js';
import { store } from './store.js';
import { startSpinning, stopSpinning } from './animationManager.js';
import { updateProgress, updateTimeDisplay, startProgressTimer, stopProgressTimer } from './progressManager.js';
import { updateMediaPlaybackState } from './mediaSessionManager.js';
import { highlightCurrentLyric } from './lyricsManager.js';
import { pauseTrack, playTrack } from './audioPlayback.js';

const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const mainContainer = document.getElementById('mainContainer');

const playIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24" stroke="white" stroke-width="2">
    <polygon points="6 3 20 12 6 21 6 3"></polygon>
  </svg>
`;

const pauseIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="14" y="4" width="4" height="16" rx="1"></rect>
    <rect x="6" y="4" width="4" height="16" rx="1"></rect>
  </svg>
`;

export function showLoadingOverlay() {
  try {
    const existingOverlay = document.getElementById('track-loading-overlay');
    if (existingOverlay) existingOverlay.remove();
    const overlay = document.createElement('div');
    overlay.id = 'track-loading-overlay';
    overlay.innerHTML = `
      <div class="track-loader">
        <div class="content">
          <div class="cube"></div>
        </div>
      </div>
    `;
    mainContainer.appendChild(overlay);
  } catch (err) {
    console.error('Error in showLoadingOverlay:', err.message);
  }
}

export function hideLoadingOverlay() {
  try {
    const overlay = document.getElementById('track-loading-overlay');
    if (overlay) overlay.remove();
  } catch (err) {
    console.error('Error in hideLoadingOverlay:', err.message);
  }
}

export function updatePlayerUI(isPlaying) {
  try {
    playerState.isPlaying = isPlaying;
    if (playPauseBtn) {
      playPauseBtn.innerHTML = isPlaying ? pauseIcon : playIcon;
    }
    if (isPlaying) {
      startSpinning();
      startProgressTimer();
    } else {
      stopSpinning();
      stopProgressTimer();
    }
    updateProgress();
    updateTimeDisplay();
    updateMediaPlaybackState(isPlaying);
  } catch (err) {
    console.error('Error in updatePlayerUI:', err.message);
  }
}

export function togglePlayPause() {
  try {
    if (!playerState.audio) {
      console.warn('No audio loaded in togglePlayPause');
      return;
    }
    if (playerState.isPlaying && !playerState.audio.paused) {
      pauseTrack();
    } else {
      if (!playerState.audio.src || playerState.audio.readyState >= 2) {
        playerState.audio.play()
          .then(() => {
            updatePlayerUI(true);
            hideLoadingOverlay();
          })
          .catch(err => {
            console.error('Playback error in togglePlayPause:', err.message);
            updatePlayerUI(false);
            hideLoadingOverlay();
          });
      } else {
        console.log('Audio still loading, waiting for canplay');
      }
    }
    gsap.to(playPauseBtn, {
      duration: 0.1,
      scale: 0.9,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out'
    });
  } catch (err) {
    console.error('Error in togglePlayPause:', err.message);
  }
}

export function initializePlayerControls() {
  try {
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
    if (nextBtn) nextBtn.addEventListener('click', () => store.nextTrack());
    if (prevBtn) prevBtn.addEventListener('click', () => store.prevTrack());
    
    [prevBtn, nextBtn].forEach(btn => {
      if (btn) {
        btn.addEventListener('mouseenter', () => {
          gsap.to(btn, { duration: 0.3, scale: 1.1, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { duration: 0.3, scale: 1, ease: 'power2.out' });
        });
      }
    });
  } catch (err) {
    console.error('Error in initializePlayerControls:', err.message);
  }
}