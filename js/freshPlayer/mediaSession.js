// mediaSession.js
import { playerState } from './state.js';
import { togglePlayPause, getAudio } from './player.js';
import { store } from './store.js';

export function initializeMediaSession() {
  try {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        console.log('Media Session: Play action triggered');
        togglePlayPause();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        console.log('Media Session: Pause action triggered');
        togglePlayPause();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        console.log('Media Session: Previous track action triggered');
        store.prevTrack();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        console.log('Media Session: Next track action triggered');
        store.nextTrack();
      });
      navigator.mediaSession.setActionHandler('seekforward', () => {
        console.log('Media Session: Seek forward action triggered');
        const audio = getAudio();
        if (audio) {
          audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
          playerState.currentTime = audio.currentTime;
        }
      });
      navigator.mediaSession.setActionHandler('seekbackward', () => {
        console.log('Media Session: Seek backward action triggered');
        const audio = getAudio();
        if (audio) {
          audio.currentTime = Math.max(audio.currentTime - 10, 0);
          playerState.currentTime = audio.currentTime;
        }
      });
      navigator.mediaSession.setActionHandler('stop', () => {
        console.log('Media Session: Stop action triggered');
        const audio = getAudio();
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
          playerState.isPlaying = false;
          playerState.currentTime = 0;
        }
      });
      console.log('Media Session action handlers initialized');
    } else {
      console.warn('Media Session API not supported');
    }
    
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      }).catch(err => {
        console.error('Error requesting notification permission:', err.message);
      });
    } else {
      console.warn('Notifications API not supported');
    }
  } catch (err) {
    console.error('Error in initializeMediaSession:', err.message);
  }
}

export function updateMediaMetadata() {
  try {
    if ('mediaSession' in navigator && store.currentTrack && store.currentAlbum) {
      const metadata = new MediaMetadata({
        title: store.currentTrack.name,
        artist: store.currentTrack.artist || 'Frith Hilton',
        album: store.currentAlbum.title,
        artwork: [
          { src: store.currentTrack.cover || '../images/default.jpg', sizes: '96x96', type: 'image/jpeg' },
          { src: store.currentTrack.cover || '../images/default.jpg', sizes: '128x128', type: 'image/jpeg' },
          { src: store.currentTrack.cover || '../images/default.jpg', sizes: '192x192', type: 'image/jpeg' },
          { src: store.currentTrack.cover || '../images/default.jpg', sizes: '256x256', type: 'image/jpeg' },
          { src: store.currentTrack.cover || '../images/default.jpg', sizes: '384x384', type: 'image/jpeg' },
          { src: store.currentTrack.cover || '../images/default.jpg', sizes: '512x512', type: 'image/jpeg' }
        ]
      });
      navigator.mediaSession.metadata = metadata;
      console.log('Media Session metadata updated:', {
        title: store.currentTrack.name,
        artist: store.currentTrack.artist,
        album: store.currentAlbum.title,
        artwork: store.currentTrack.cover
      });
      
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(store.currentTrack.name, {
          body: `Artist: ${store.currentTrack.artist || 'Frith Hilton'}\nAlbum: ${store.currentAlbum.title}`,
          icon: store.currentTrack.cover || '../images/default.jpg',
          badge: store.currentTrack.cover || '../images/default.jpg',
          tag: 'song-change',
          renotify: true
        });
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
        console.log('Notification sent for song change:', store.currentTrack.name);
      }
    } else {
      console.warn('Skipping media metadata update: Missing track or album');
    }
  } catch (err) {
    console.error('Error in updateMediaMetadata:', err.message);
  }
}

export function updateMediaPlaybackState(isPlaying) {
  try {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
      const audio = getAudio();
      if (audio && isFinite(audio.duration)) {
        navigator.mediaSession.setPositionState({
          duration: audio.duration,
          playbackRate: audio.playbackRate,
          position: playerState.currentTime
        });
      }
    }
  } catch (err) {
    console.error('Error in updateMediaPlaybackState:', err.message);
  }
}