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
    if (seekBar && seekHandle) {
      let isDraggingSeek = false;
      seekBar.addEventListener('click', e => {
        try {
          if (isDraggingSeek) return;
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
          console.error('Error in initializeSeekBar click:', err.message);
        }
      });
      seekBar.addEventListener('mousedown', e => {
        try {
          isDraggingSeek = true;
          const rect = seekBar.getBoundingClientRect();
          
          function onMouseMove(event) {
            try {
              const progress = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
              playerState.currentTime = progress * playerState.totalTime;
              audioPlayer.currentTime = playerState.currentTime;
              updateProgress();
              updateTimeDisplay();
            } catch (err) {
              console.error('Error in initializeSeekBar onMouseMove:', err.message);
            }
          }
          
          function onMouseUp() {
            try {
              isDraggingSeek = false;
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
            } catch (err) {
              console.error('Error in initializeSeekBar onMouseUp:', err.message);
            }
          }
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
          onMouseMove(e);
        } catch (err) {
          console.error('Error in initializeSeekBar mousedown:', err.message);
        }
      });
    } else {
      console.error('Error in initializeSeekBar: Missing seekBar or seekHandle');
    }
  } catch (err) {
    console.error('Error in initializeSeekBar:', err.message);
  }
}