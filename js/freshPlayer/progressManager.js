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
const loadingIndicator = document.getElementById('loadingIndicator');

playerState.isBuffering = false;

export function updateProgress() {
  try {
    // Calculate progress percent, clamped between 0 and 100
    const progressPercent = playerState.totalTime ? Math.max(0, Math.min(100, (playerState.currentTime / playerState.totalTime) * 100)) : 0;
    if (seekProgress) {
      gsap.to(seekProgress, {
        duration: 0.3,
        width: `${progressPercent}%`,
        ease: 'power2.out'
      });
    } else {
      console.error('Error in updateProgress: Missing seekProgress');
    }
    // seekHandle is inside seekProgress, so its right: -8px positioning is relative to seekProgress
    // No need to update seekHandle position explicitly, as it follows seekProgress
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
      if (!playerState.isDragging && !playerState.isManualSpinning && !playerState.isBuffering) {
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
      const handleSeek = async (clientX, isTouch = false) => {
        try {
          if (playerState.isDragging) return;
          const wasPlaying = playerState.isPlaying && !audioPlayer.paused;
          console.log('handleSeek: wasPlaying=', wasPlaying, 'readyState=', audioPlayer.readyState, 'src=', audioPlayer.src);

          // Calculate target time and position
          const rect = seekBar.getBoundingClientRect();
          const targetProgress = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
          const targetTime = targetProgress * playerState.totalTime;
          const currentProgress = playerState.currentTime / playerState.totalTime;
          console.log('handleSeek: Current time=', playerState.currentTime, 'Target time=', targetTime);

          // Check if audio is ready
          if (audioPlayer.readyState < 2) {
            console.warn('Audio not ready for seeking, waiting for canplay event');
            playerState.isBuffering = true;
            if (loadingIndicator) loadingIndicator.style.display = 'block';
            try {
              await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Timeout waiting for canplay')), 5000);
                audioPlayer.addEventListener('canplay', () => {
                  clearTimeout(timeout);
                  resolve();
                }, { once: true });
              });
            } catch (err) {
              console.error('Error waiting for canplay:', err.message);
              playerState.isBuffering = false;
              if (loadingIndicator) loadingIndicator.style.display = 'none';
              return;
            }
          }

          // Check if target time is seekable
          const seekable = audioPlayer.seekable;
          console.log('handleSeek: Seekable ranges:', Array.from({ length: seekable.length }, (_, i) => ({
            start: seekable.start(i),
            end: seekable.end(i)
          })));
          let isSeekable = false;
          for (let i = 0; i < seekable.length; i++) {
            if (targetTime >= seekable.start(i) && targetTime <= seekable.end(i)) {
              isSeekable = true;
              break;
            }
          }
          if (!isSeekable) {
            console.warn('Requested seek time not seekable:', targetTime);
            let closestTime = targetTime;
            for (let i = 0; i < seekable.length; i++) {
              if (targetTime < seekable.start(i)) {
                closestTime = seekable.start(i);
                break;
              } else if (targetTime > seekable.end(i)) {
                closestTime = seekable.end(i);
              }
            }
            console.log('Falling back to closest seekable time:', closestTime);
            targetTime = closestTime;
          }

          // Animate seekProgress only (seekHandle follows due to right: -8px)
          playerState.isBuffering = true;
          if (loadingIndicator) loadingIndicator.style.display = 'block';
          const cleanup = () => {
            audioPlayer.removeEventListener('waiting', onWaiting);
            audioPlayer.removeEventListener('canplay', onCanPlay);
            audioPlayer.removeEventListener('playing', onPlaying);
            audioPlayer.removeEventListener('error', onError);
            clearTimeout(playTimeout);
          };

          const onWaiting = () => {
            console.log('Audio buffering during seek animation');
            playerState.isBuffering = true;
            if (loadingIndicator) loadingIndicator.style.display = 'block';
          };

          const onCanPlay = () => {
            console.log('Audio can play during seek animation');
            playerState.isBuffering = false;
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            if (wasPlaying && audioPlayer.paused) {
              console.log('Attempting to resume playback after canplay');
              audioPlayer.play().catch(err => {
                console.error('Error resuming playback after canplay:', err.message);
              });
            }
          };

          const onPlaying = () => {
            console.log('Audio playback resumed');
            playerState.isBuffering = false;
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            cleanup();
          };

          const onError = (e) => {
            console.error('Audio error during seek:', e);
            playerState.isBuffering = false;
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            cleanup();
          };

          audioPlayer.addEventListener('waiting', onWaiting);
          audioPlayer.addEventListener('canplay', onCanPlay);
          audioPlayer.addEventListener('playing', onPlaying);
          audioPlayer.addEventListener('error', onError);

          // Animate seekProgress
          await new Promise(resolve => {
            gsap.to({ progress: currentProgress }, {
              progress: targetTime / playerState.totalTime,
              duration: 0.5,
              ease: 'linear',
              onUpdate: function () {
                playerState.currentTime = this.targets()[0].progress * playerState.totalTime;
                audioPlayer.currentTime = playerState.currentTime;
                updateProgress();
                updateTimeDisplay();
                highlightCurrentLyric(store.lyricsData, playerState.currentTime);
                console.log('Animation update: currentTime=', playerState.currentTime);
              },
              onComplete: () => {
                console.log('Seek animation completed to', targetTime);
                resolve();
              }
            });

            // Animate seekProgress width
            gsap.to(seekProgress, {
              duration: 0.5,
              width: `${targetProgress * 100}%`,
              ease: 'linear'
            });

            // Animate seekHandle scale only (position handled by seekProgress)
            gsap.to(seekHandle, {
              duration: 0.3,
              scale: 1.2,
              yoyo: true,
              repeat: 1,
              ease: 'power2.out'
            });
          });

          // Handle playback after animation
          if (wasPlaying) {
            if (audioPlayer.paused) {
              console.log('Attempting immediate playback after seek animation');
              audioPlayer.play().catch(err => {
                console.error('Error in immediate playback:', err.message);
              });
            }

            // Fallback: Reload audio if stuck
            const playTimeout = setTimeout(async () => {
              if (playerState.isBuffering && audioPlayer.paused) {
                console.warn('Playback not resumed, attempting reload...');
                try {
                  const currentSrc = audioPlayer.src;
                  audioPlayer.src = ''; // Reset
                  audioPlayer.src = currentSrc + `#t=${targetTime}`;
                  audioPlayer.load();
                  await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => reject(new Error('Timeout waiting for reload canplay')), 5000);
                    audioPlayer.addEventListener('canplay', () => {
                      clearTimeout(timeout);
                      resolve();
                    }, { once: true });
                  });
                  if (wasPlaying) {
                    audioPlayer.play().catch(err => {
                      console.error('Error in reload playback:', err.message);
                    });
                  }
                } catch (err) {
                  console.error('Error in reload:', err.message);
                }
                playerState.isBuffering = false;
                if (loadingIndicator) loadingIndicator.style.display = 'none';
                cleanup();
              }
            }, 3000);
          } else {
            playerState.isBuffering = false;
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            cleanup();
          }
        } catch (err) {
          console.error('Error in handleSeek:', err.message);
          playerState.isBuffering = false;
          if (loadingIndicator) loadingIndicator.style.display = 'none';
          cleanup();
        }
      };

      // Click handler for mouse
      seekBar.addEventListener('click', e => {
        handleSeek(e.clientX);
      });

      // Touchend handler for touch devices
      seekBar.addEventListener('touchend', e => {
        e.preventDefault();
        const clientX = e.changedTouches[0].clientX;
        handleSeek(clientX, true);
      }, { passive: false });

      // Drag functionality for seekHandle
      let isDraggingSeek = false;

      const startDrag = (e) => {
        try {
          e.preventDefault();
          isDraggingSeek = true;
          playerState.isDragging = true;
          gsap.to(seekHandle, {
            duration: 0.2,
            scale: 1.2,
            ease: 'power2.out'
          });
          const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
          updateSeekPosition(clientX);
        } catch (err) {
          console.error('Error in startDrag:', err.message);
        }
      };

      const updateSeekPosition = (clientX) => {
        try {
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
            gsap.to(seekHandle, {
              duration: 0.2,
              scale: 1,
              ease: 'power2.out'
            });
            if (playerState.isPlaying && audioPlayer.paused) {
              playerState.isBuffering = true;
              if (loadingIndicator) loadingIndicator.style.display = 'block';
              audioPlayer.addEventListener('canplay', () => {
                console.log('Audio can play after drag');
                playerState.isBuffering = false;
                if (loadingIndicator) loadingIndicator.style.display = 'none';
                audioPlayer.play().catch(err => {
                  console.error('Error resuming playback after drag:', err.message);
                });
              }, { once: true });
            }
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