// audioPlayback.js
import { playerState } from './state.js';
import { updatePlayerUI, showLoadingOverlay, hideLoadingOverlay } from './playerControls.js';
import { updateProgress, updateTimeDisplay } from './progressManager.js';
import { highlightCurrentLyric } from './lyricsManager.js';
import { store } from './store.js';
import { updateMediaMetadata } from './mediaSessionManager.js';

export const audioPlayer = document.getElementById('audioPlayer');

export function initializeAudioPlayback() {
  try {
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
  } catch (err) {
    console.error('Error in initializeAudioPlayback:', err.message);
  }
}

export function playTrack(mp3_url) {
  try {
    if (!mp3_url) {
      console.error('Error in playTrack: Missing mp3_url');
      mp3_url = store.mp3; // Fallback
    }

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

    if (!playerState.audio.paused) {
      console.log('Pausing current track');
      playerState.audio.pause();
      updatePlayerUI(false);
    }
    playerState.audio.currentTime = 0;
    playerState.audio.src = '';
    playerState.audio.src = mp3_url;
    playerState.currentTrackUrl = mp3_url;
    console.log('Loading new track:', mp3_url);
    showLoadingOverlay();

    updateMediaMetadata();

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