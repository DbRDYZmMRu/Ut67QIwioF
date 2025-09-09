// store.js
import { createApp, reactive } from './petite-vue.js';
import { fetchTrackData, renderLyrics, updatePageContent, highlightAndOpenAlbum } from './lyricsManager.js';
import { playTrack } from './audioPlayback.js';
import { playerState } from './state.js';
import { updateNowPlaying } from './playlistManager.js';

export const store = reactive({
  albumCount: 17,
  currentAlbumId: null,
  baseStylesheet: '../css/style.css',
  albumsStyleSheet: '../css/freshPlayer.css',
  stylesheetId: 'dynamic-stylesheet',
  view: 'div1',
  innerView: 'div3',
  mp3: './musicpool-db/mp3/ValenceEve/1.mp3',
  albums: [],
  currentTrack: null,
  currentAlbum: null,
  currentTrackIndex: -1,
  lyricsData: null,
  lyricsFocusEnabled: false,
  playlists: { nowPlaying: [], favourites: [], musePlaylists: {} },
  currentPlaylist: null, // Track the active playlist (e.g., 'nowPlaying', 'favourites', 'muse-taylorSwift')
  queue: [], // Array of track IDs for playback queue
  
  async loadAlbums() {
    try {
      const response = await fetch('https://raw.githubusercontent.com/freshBoyChilling/discography/refs/heads/main/data/albums.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch albums.json: ${response.status}`);
      }
      this.albums = await response.json();
      this.albums.sort((a, b) => b.id - a.id);
      console.log('Albums loaded:', this.albums);
    } catch (error) {
      console.error('Error in loadAlbums:', error.message);
    }
  },
  
  // Initialize the playback queue based on playlist or album context
  setQueue(trackId, playlistId = null) {
    try {
      if (playlistId) {
        // Playing from a playlist
        const playlist = playlistId === 'nowPlaying' ? this.playlists.nowPlaying :
          playlistId === 'favourites' ? this.playlists.favourites :
          this.playlists.musePlaylists[playlistId.replace('muse-', '')];
        if (!playlist || !playlist.tracks) {
          console.error('Error in setQueue: Playlist not found', { playlistId });
          return;
        }
        const trackIndex = playlist.tracks.findIndex(t => t.id === Number(trackId));
        if (trackIndex === -1) {
          console.error('Error in setQueue: Track not found in playlist', { trackId, playlistId });
          return;
        }
        // Set queue starting from the selected track, looping to the start
        this.queue = [
          ...playlist.tracks.slice(trackIndex).map(t => t.id),
          ...playlist.tracks.slice(0, trackIndex).map(t => t.id)
        ];
        this.currentPlaylist = playlistId;
        this.currentTrackIndex = 0; // Start at the selected track
        // Update Now Playing to match the playlist
        if (playlistId !== 'nowPlaying') {
          this.playlists.nowPlaying = playlist.tracks;
          localStorage.setItem('nowPlaying', JSON.stringify(this.playlists.nowPlaying));
        }
      } else {
        // Playing from an album
        const album = this.albums.find(a => a.songs.some(s => s.id === Number(trackId)));
        if (!album) {
          console.error('Error in setQueue: Album not found for track', { trackId });
          return;
        }
        const trackIndex = album.songs.findIndex(s => s.id === Number(trackId));
        if (trackIndex === -1) {
          console.error('Error in setQueue: Track not found in album', { trackId });
          return;
        }
        // Set queue starting from the selected track, looping to the start
        this.queue = [
          ...album.songs.slice(trackIndex).map(s => s.id),
          ...album.songs.slice(0, trackIndex).map(s => s.id)
        ];
        this.currentPlaylist = null; // No playlist context
        this.currentTrackIndex = 0;
        updateNowPlaying(album.id);
      }
      console.log('Queue set:', { queue: this.queue, currentPlaylist: this.currentPlaylist });
    } catch (err) {
      console.error('Error in setQueue:', err.message, { trackId, playlistId });
    }
  },
  
  async showAlbumTracks(id) {
    try {
      if (!this.albums.length) {
        await this.loadAlbums();
        if (!this.albums.length) {
          console.error('Error in showAlbumTracks: Failed to load albums');
          return;
        }
      }
      const albumId = Number(id);
      if (!this.albums.some(album => album.id === albumId)) {
        console.error('Error in showAlbumTracks: Invalid album ID', { id: albumId });
        return;
      }
      for (let i = 1; i <= this.albumCount; i++) {
        if (i !== albumId) {
          const div = document.getElementById(`album-${i}`);
          if (div) div.style.display = 'none';
        }
      }
      const newDiv = document.getElementById(`album-${albumId}`);
      if (newDiv) {
        newDiv.style.display = newDiv.style.display === 'none' ? 'block' : 'none';
        if (newDiv.style.display === 'block') {
          const stickyHeaderHeight = 80;
          const top = newDiv.getBoundingClientRect().top + window.scrollY - stickyHeaderHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      } else {
        console.error('Error in showAlbumTracks: Album div not found', { id: albumId });
      }
    } catch (err) {
      console.error('Error in showAlbumTracks:', err.message, { id });
    }
  },
  
  buyAlbum(id) {
    try {
      if (id === 17) {
        alert("Album 'whereIsTheMoodRobot' is in session and not available for purchase.");
        return;
      }
      const album = this.albums.find(album => album.id === Number(id));
      if (album && album.paymentLink) {
        window.open(album.paymentLink, '_blank');
      } else {
        console.error('Error in buyAlbum: No payment link for album ID', { id });
      }
    } catch (err) {
      console.error('Error in buyAlbum:', err.message, { id });
    }
  },
  
  getAlbumCover(id) {
    try {
      const album = this.albums.find(album => album.id === Number(id));
      return album ? album.cover : '../images/default.jpg';
    } catch (err) {
      console.error('Error in getAlbumCover:', err.message, { id });
      return '../images/default.jpg';
    }
  },
  
  async playTrack(trackId, playlistId = null) {
    try {
      console.log('playTrack called with:', { trackId, playlistId });
      if (!trackId) {
        console.error('Error in playTrack: Missing trackId');
        return;
      }
      if (!this.albums.length) {
        await this.loadAlbums();
        if (!this.albums.length) {
          console.error('Error in playTrack: Failed to load albums');
          return;
        }
      }
      const album = this.albums.find(a => a.songs.some(s => s.id === Number(trackId)));
      if (!album) {
        console.error('Error in playTrack: Album not found for track', { trackId });
        return;
      }
      const track = album.songs.find(s => s.id === Number(trackId));
      if (!track) {
        console.error('Error in playTrack: Track not found', { trackId, albumId: album.id });
        return;
      }
      console.log('Found track:', { trackId, trackTitle: track.title, albumTitle: album.title });
      const data = await fetchTrackData(trackId);
      if (!data) {
        console.error('Error in playTrack: No track data', { trackId });
        playTrack(this.mp3);
        renderLyrics([]);
        return;
      }
      this.currentAlbum = album;
      this.currentAlbumId = album.id;
      this.currentTrack = {
        name: data.json.song_title,
        artist: data.json.writer || 'Frith Hilton',
        cover: data.cover || album.cover || '../images/default.jpg',
        mp3_url: data.audio
      };
      playerState.totalTime = data.json.duration || 0;
      this.lyricsData = data.json.lyrics || [];
      // Set the queue based on context
      this.setQueue(trackId, playlistId);
      playTrack(data.audio);
      renderLyrics(data.json.lyrics || []);
      updatePageContent(trackId, data);
      highlightAndOpenAlbum(trackId);
      const query = `?track=${trackId}`;
      window.history.pushState({}, '', query);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.switchView_ii('div4');
    } catch (err) {
      console.error('Error in playTrack:', err.message, { trackId, playlistId });
      const statusDiv = document.getElementById('status');
      if (statusDiv) {
        statusDiv.textContent = `Error: ${err.message}`;
        statusDiv.className = 'error';
      }
    }
  },
  
  nextTrack() {
    try {
      if (!this.queue.length || this.currentTrackIndex === -1) {
        console.error('Error in nextTrack: No queue or invalid track index');
        return;
      }
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.queue.length;
      const nextTrackId = this.queue[this.currentTrackIndex];
      this.playTrack(nextTrackId, this.currentPlaylist);
      this.switchView_ii('div4');
    } catch (err) {
      console.error('Error in nextTrack:', err.message);
    }
  },
  
  prevTrack() {
    try {
      if (!this.queue.length || this.currentTrackIndex === -1) {
        console.error('Error in prevTrack: No queue or invalid track index');
        return;
      }
      this.currentTrackIndex = (this.currentTrackIndex - 1 + this.queue.length) % this.queue.length;
      const prevTrackId = this.queue[this.currentTrackIndex];
      this.playTrack(prevTrackId, this.currentPlaylist);
      this.switchView_ii('div4');
    } catch (err) {
      console.error('Error in prevTrack:', err.message);
    }
  },
  
  acceptCookieUse() {
    try {
      localStorage.setItem('cookieUse', true);
    } catch (err) {
      console.error('Error in acceptCookieUse:', err.message);
    }
  },
  
  showLoader() {
    try {
      const loaderHtml = `
        <div id="loader-container">
          <div class="template-loader">
            <div class="loaderCenter">
              <div class="book">
                <div class="book__pg-shadow"></div>
                <div class="book__pg"></div>
                <div class="book__pg book__pg--2"></div>
                <div class="book__pg book__pg--3"></div>
                <div class="book__pg book__pg--4"></div>
                <div class="book__pg book__pg--5"></div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', loaderHtml);
      setTimeout(() => {
        const loaderContainer = document.getElementById('loader-container');
        if (loaderContainer) loaderContainer.remove();
      }, 1000);
    } catch (err) {
      console.error('Error in showLoader:', err.message);
    }
  },
  
  switchView(view) {
    try {
      this.showLoader();
      this.view = view;
      this.loadStylesheet(view === 'div1' ? `${this.albumsStyleSheet}` : '../../player/music/style.css');
    } catch (err) {
      console.error('Error in switchView:', err.message, { view });
    }
  },
  
  switchView_ii(innerView) {
    try {
      document.body.style.opacity = 0;
      setTimeout(() => {
        this.innerView = innerView;
        this.loadStylesheet(innerView === 'div3' ? '../css/freshPlayer.css' : innerView === 'div4' ? '../css/player.css' : '');
        document.body.style.opacity = 1;
      }, 500);
    } catch (err) {
      console.error('Error in switchView_ii:', err.message, { innerView });
    }
  },
  
  loadStylesheet(href) {
    try {
      const existingLink = document.getElementById(this.stylesheetId);
      if (existingLink) existingLink.remove();
      if (href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.id = this.stylesheetId;
        document.head.appendChild(link);
      }
    } catch (err) {
      console.error('Error in loadStylesheet:', err.message, { href });
    }
  },
  
  getView() {
    try {
      return this.view;
    } catch (err) {
      console.error('Error in getView:', err.message);
      return 'div1';
    }
  },
  
  getInnerView() {
    try {
      return this.innerView || 'div3';
    } catch (err) {
      console.error('Error in getInnerView:', err.message);
      return 'div3';
    }
  }
});

export function mountApp() {
  try {
    createApp({ store }).mount('#ctrlArea');
    window.store = store;
    store.loadAlbums();
  } catch (err) {
    console.error('Error in mountApp:', err.message);
  }
}