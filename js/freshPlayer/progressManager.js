// progressManager.js
import gsap from 'https://esm.sh/gsap';
import { playerState } from './state.js';
import { formatTime } from './utils.js';
import { audioPlayer } from './audioPlayback.js';
import { store } from './store.js';
import { highlightCurrentLyric } from './lyricsManager.js';

const seekBar = document.getElementById('seekBar');
const seekProgress = document.getElementById('seekProgress');
const seekHandle = document.getElementById('seekHandle');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');

export function updateProgress() {
  try {
    const progressPercent = playerState.totalTime ? (playerState.currentTime / playerState.totalTime) * 100 : 0;
    if (seekProgress) {
      gsap.to(seekProgress, {
        duration: 0.3,
        width: progressPercent + '%',
        ease: 'power2.out'
      });
    } else {
      console.error('Error in updateProgress: Missing seekProgress');
    }
  } catch (err) {
    console.error('Error in updateProgress:', err.message);
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

export function startProgressTimer() {
  try {
    stopProgressTimer();
    if (!isFinite(playerState.totalTime)) {
      playerState.totalTime = 0;
    }
    playerState.progressTimer = setInterval(() => {
      if (!playerState.isDragging && !playerState.isManualSpinning) {
        playerState.currentTime = audioPlayer.currentTime;
        if (playerState.currentTime >= playerState.totalTime) {
          store.nextTrack();
        }
        updateProgress();
        updateTimeDisplay();
        highlightCurrentLyric(store.lyricsData, playerState.currentTime);
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

export function initializeSeekBar() {
  try {
    if (seekBar && seekHandle && seekProgress) {
      // Click handler for seekBar (existing functionality)
      seekBar.addEventListener('click', e => {
        try {
          // Prevent click handling if dragging is in progress
          if (playerState.isDragging) return;
          const rect = seekBar.getBoundingClientRect();
          const clickPosition = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          playerState.currentTime = clickPosition * playerState.totalTime;
          audioPlayer.currentTime = playerState.currentTime;
          updateProgress();
          updateTimeDisplay();
          gsap.to(seekHandle, {
            duration: 0.3,
            scale: 1.2,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out'
          });
        } catch (err) {
          console.error('Error in seekBar click:', err.message);
        }
      });
      
      // Drag functionality for seekHandle
      let isDraggingSeek = false;
      
      const startDrag = (e) => {
        try {
          e.preventDefault();
          isDraggingSeek = true;
          playerState.isDragging = true;
          // Animate handle on drag start
          gsap.to(seekHandle, {
            duration: 0.2,
            scale: 1.2,
            ease: 'power2.out'
          });
          // Handle both mouse and touch events
          const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
          updateSeekPosition(clientX);
        } catch (err) {
          console.error('Error in startDrag:', err.message);
        }
      };
      
      const updateSeekPosition = (clientX) => {
        try {
          if (!isDraggingSeek) return;
          const rect = seekBar.getBoundingClientRect();
          const progress = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
          playerState.currentTime = progress * playerState.totalTime;
          audioPlayer.currentTime = playerState.currentTime;
          updateProgress();
          updateTimeDisplay();
          highlightCurrentLyric(store.lyricsData, playerState.currentTime);
        } catch (err) {
          console.error('Error in updateSeekPosition:', err.message);
        }
      };
      
      const stopDrag = () => {
        try {
          if (isDraggingSeek) {
            isDraggingSeek = false;
            playerState.isDragging = false;
            // Reset handle scale on drag end
            gsap.to(seekHandle, {
              duration: 0.2,
              scale: 1,
              ease: 'power2.out'
            });
          }
        } catch (err) {
          console.error('Error in stopDrag:', err.message);
        }
      };
      
      // Mouse event listeners for seekHandle
      seekHandle.addEventListener('mousedown', startDrag);
      document.addEventListener('mousemove', (e) => {
        if (isDraggingSeek) {
          updateSeekPosition(e.clientX);
        }
      });
      document.addEventListener('mouseup', stopDrag);
      
      // Touch event listeners for seekHandle
      seekHandle.addEventListener('touchstart', startDrag, { passive: false });
      document.addEventListener('touchmove', (e) => {
        if (isDraggingSeek) {
          updateSeekPosition(e.touches[0].clientX);
        }
      }, { passive: false });
      document.addEventListener('touchend', stopDrag);
    } else {
      console.error('Error in initializeSeekBar: Missing seekBar, seekHandle, or seekProgress');
    }
  } catch (err) {
    console.error('Error in initializeSeekBar:', err.message);
  }
}