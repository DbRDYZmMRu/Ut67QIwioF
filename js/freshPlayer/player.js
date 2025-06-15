// player.js
import gsap from 'https://esm.sh/gsap';
import { store } from './store.js';
import { formatTime } from './utils.js';
import { playerState } from './state.js';
import { updateProgress, startSpinning, stopSpinning } from './animations.js';
import { highlightCurrentLyric } from './lyrics.js';
import { initializeMediaSession, updateMediaMetadata, updateMediaPlaybackState } from './mediaSession.js';

export const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
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

function showLoadingOverlay() {
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

function hideLoadingOverlay() {
  try {
    const overlay = document.getElementById('track-loading-overlay');
    if (overlay) overlay.remove();
  } catch (err) {
    console.error('Error in hideLoadingOverlay:', err.message);
  }
}

function updatePlayerUI(isPlaying) {
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

export function playTrack(mp3_url) {
  try {
    if (!mp3_url) {
      console.error('Error in playTrack: Missing mp3_url');
      alert('Failed to play track.');
      updatePlayerUI(false);
      hideLoadingOverlay();
      return;
    }

    // Initialize audio if not created
    if (!playerState.audio) {
      playerState.audio = audioPlayer || new Audio();
      playerState.audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        alert('Failed to play track.');
        updatePlayerUI(false);
        hideLoadingOverlay();
      });
      playerState.audio.addEventListener('ended', () => {
        console.log('Track ended');
        updatePlayerUI(false);
        hideLoadingOverlay();
        store.nextTrack();
      });
      playerState.audio.addEventListener('timeupdate', () => {
        if (!playerState.isDragging) {
          playerState.currentTime = playerState.audio.currentTime;
          updateProgress();
          updateTimeDisplay();
          highlightCurrentLyric(store.lyricsData, playerState.currentTime);
        }
      });
      playerState.audio.addEventListener('loadedmetadata', () => {
        playerState.totalTime = playerState.audio.duration;
        updateTimeDisplay();
      });
    }

    // Handle same track
    if (playerState.currentTrackUrl === mp3_url && !playerState.audio.ended) {
      if (playerState.audio.paused) {
        console.log('Resuming track');
        playerState.audio.play()
          .then(() => {
            console.log('Playback resumed successfully');
            updatePlayerUI(true);
            hideLoadingOverlay();
          })
          .catch(err => {
            console.error('Playback error in resume:', err.message);
            alert('Failed to play track.');
            updatePlayerUI(false);
            hideLoadingOverlay();
          });
      } else {
        console.log('Restarting track');
        playerState.audio.currentTime = 0;
        playerState.audio.play()
          .then(() => {
            console.log('Playback restarted successfully');
            updatePlayerUI(true);
            hideLoadingOverlay();
          })
          .catch(err => {
            console.error('Playback error in restart:', err.message);
            alert('Failed to play track.');
            updatePlayerUI(false);
            hideLoadingOverlay();
          });
      }
      return;
    }

    // Stop and reset current track
    if (!playerState.audio.paused) {
      console.log('Pausing current track');
      playerState.audio.pause();
      updatePlayerUI(false);
    }
    playerState.audio.currentTime = 0;
    playerState.audio.src = ''; // Clear src to reset state
    playerState.audio.src = mp3_url;
    playerState.currentTrackUrl = mp3_url;
    console.log('Loading new track:', mp3_url);
    showLoadingOverlay();

    // Update Media Session metadata and send notification
    updateMediaMetadata();

    // Add canplay listener for this track
    const onCanPlay = () => {
      console.log('Audio canplay event fired');
      playerState.audio.play()
        .then(() => {
          console.log('Playback started successfully');
          updatePlayerUI(true);
          hideLoadingOverlay();
        })
        .catch(err => {
          console.error('Playback error after canplay:', err.message);
          alert('Failed to play track.');
          updatePlayerUI(false);
          hideLoadingOverlay();
        });
      playerState.audio.removeEventListener('canplay', onCanPlay);
    };
    playerState.audio.addEventListener('canplay', onCanPlay);
    playerState.audio.load();
  } catch (err) {
    console.error('Error in playTrack:', err.message, { mp3_url });
    alert('Failed to play track.');
    updatePlayerUI(false);
    hideLoadingOverlay();
  }
}

export function pauseTrack() {
  try {
    if (playerState.audio && !playerState.audio.paused) {
      playerState.audio.pause();
      updatePlayerUI(false);
      hideLoadingOverlay();
      console.log('Track paused');
    }
  } catch (err) {
    console.error('Error in pauseTrack:', err.message);
  }
}

export function getAudio() {
  return playerState.audio;
}

export function isAudioPlaying() {
  return playerState.isPlaying;
}

export function togglePlayPause() {
  try {
    if (!playerState.audio) {
      console.warn('No audio loaded in togglePlayPause');
      return;
    }
    if (playerState.isPlaying && !playerState.audio.paused) {
      playerState.audio.pause();
      updatePlayerUI(false);
      hideLoadingOverlay();
    } else {
      // Only attempt play if not already loading
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

export function startProgressTimer() {
  try {
    stopProgressTimer();
    playerState.progressTimer = setInterval(() => {
      if (!playerState.isDragging && !playerState.isManualSpinning) {
        playerState.currentTime = playerState.audio.currentTime;
        if (playerState.currentTime >= playerState.totalTime) {
          store.nextTrack();
        }
        updateProgress();
        updateTimeDisplay();
        highlightCurrentLyric(store.lyricsData, playerState.currentTime);
        updateMediaPlaybackState(playerState.isPlaying);
      }
    }, 100);
  } catch (err) {
    console.error('Error in startProgressTimer:', err.message);
  }
}

export function stopProgressTimer() {
  try {
    if (playerState.progressTimer) {
      clearInterval(playerState.progressTimer);
      playerState.progressTimer = null;
    }
  } catch (err) {
    console.error('Error in stopProgressTimer:', err.message);
  }
}

export function updateTimeDisplay() {
  try {
    if (currentTimeEl && totalTimeEl) {
      currentTimeEl.textContent = formatTime(playerState.currentTime);
      totalTimeEl.textContent = formatTime(playerState.totalTime);
    }
  } catch (err) {
    console.error('Error in updateTimeDisplay:', err.message);
  }
}

export function initializePlayer() {
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

    if (playerState.audio) {
      playerState.audio.addEventListener('loadedmetadata', () => {
        playerState.totalTime = playerState.audio.duration;
        updateTimeDisplay();
      });
      playerState.audio.addEventListener('error', () => {
        console.error('Audio playback error:', playerState.audio.error);
        alert('Failed to load track. Please try another.');
        updatePlayerUI(false);
        hideLoadingOverlay();
      });
    }

    // Initialize Media Session and Notifications
    initializeMediaSession();
  } catch (err) {
    console.error('Error in initializePlayer:', err.message);
  }
}