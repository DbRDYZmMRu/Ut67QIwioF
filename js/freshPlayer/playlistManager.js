// playlistManager.js
import { store } from './store.js';
import { playTrack } from './audioPlayback.js';
import { toggleTrackList } from './trackListManager.js';
import { camelCaseToTitleCase } from './utils.js';

export async function initializePlaylists() {
  try {
    // Ensure albums are loaded
    if (!store.albums.length) {
      await store.loadAlbums();
      console.log('Albums loaded in initializePlaylists:', store.albums);
    }
    
    // Load playlists from localStorage
    const nowPlaying = JSON.parse(localStorage.getItem('nowPlaying')) || [];
    const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
    
    // Generate muse playlists
    const musePlaylists = await generateMusePlaylists();
    
    store.playlists = {
      nowPlaying: nowPlaying.map(track => ({
        id: track.id,
        title: track.title,
        albumId: track.albumId,
        cover: track.cover
      })),
      favourites: favourites.map(track => ({
        id: track.id,
        title: track.title,
        albumId: track.albumId,
        cover: track.cover
      })),
      musePlaylists
    };
    renderPlaylists();
    console.log('Playlists initialized:', store.playlists);
  } catch (err) {
    console.error('Error in initializePlaylists:', err.message);
  }
}

async function generateMusePlaylists() {
  try {
    // Fetch muse.json for cover images
    const museResponse = await fetch('https://raw.githubusercontent.com/freshBoyChilling/discography/refs/heads/main/data/muse.json');
    if (!museResponse.ok) {
      throw new Error(`Failed to fetch muse.json: ${museResponse.status}`);
    }
    const museData = await museResponse.json();
    console.log('Muse data from muse.json:', museData);

    // Create a map of muse IDs to cover images
    const museCoverMap = {};
    museData.forEach(muse => {
      museCoverMap[muse.id] = muse.cover || '../images/default.jpg';
    });

    // Verify albums data
    if (!store.albums || !Array.isArray(store.albums)) {
      console.error('Error in generateMusePlaylists: store.albums is invalid', store.albums);
      return {};
    }
    
    // Count tracks per muse and collect tracks
    const museCounts = {};
    const museTracks = {};
    
    store.albums.forEach(album => {
      if (!album.songs || !Array.isArray(album.songs)) {
        console.warn('Invalid songs array for album:', album.id, album.title);
        return;
      }
      album.songs.forEach(song => {
        if (song.muse) {
          // Use raw muse name as key, preserving original format
          const rawMuse = song.muse.trim();
          museCounts[rawMuse] = (museCounts[rawMuse] || 0) + 1;
          if (!museTracks[rawMuse]) museTracks[rawMuse] = [];
          museTracks[rawMuse].push({
            id: song.id,
            title: song.title,
            albumId: album.id,
            cover: song.cover || album.cover || '../images/default.jpg'
          });
        }
      });
    });
    
    // Log muse counts and tracks
    console.log('Muse counts:', museCounts);
    console.log('Muse tracks:', museTracks);
    
    // Create playlists for muses with >5 tracks
    const musePlaylists = {};
    Object.keys(museCounts).forEach(muse => {
      if (museCounts[muse] > 5) {
        // Normalize only for ID, preserve original muse for title
        const normalizedMuse = muse.toLowerCase().replace(/[^a-z0-9]/g, '');
        musePlaylists[normalizedMuse] = {
          id: `muse-${normalizedMuse}`,
          title: camelCaseToTitleCase(muse), // Use original muse name for title
          tracks: museTracks[muse],
          cover: museCoverMap[muse] || museTracks[muse][0]?.cover || '../images/default.jpg', // Use muse.json cover
          meta: `Songs: ${museTracks[muse].length}`
        };
      }
    });
    
    console.log('Generated muse playlists:', musePlaylists);
    return musePlaylists;
  } catch (err) {
    console.error('Error in generateMusePlaylists:', err.message);
    return {};
  }
}

export function updateNowPlaying(albumId) {
  try {
    const album = store.albums.find(a => a.id === Number(albumId));
    if (!album) {
      console.error('Album not found for Now Playing:', { albumId });
      return;
    }
    store.playlists.nowPlaying = album.songs.map(song => ({
      id: song.id,
      title: song.title,
      albumId: album.id,
      cover: song.cover || album.cover || '../images/default.jpg'
    }));
    localStorage.setItem('nowPlaying', JSON.stringify(store.playlists.nowPlaying));
    renderPlaylists(document.querySelector('.badge.active')?.dataset.playlistId || null);
    console.log('Now Playing updated:', store.playlists.nowPlaying);
  } catch (err) {
    console.error('Error in updateNowPlaying:', err.message);
  }
}

export function toggleFavourite(trackId) {
  try {
    const track = findTrackById(trackId);
    if (!track) {
      console.error('Track not found for Favourites:', { trackId });
      return;
    }
    const favourites = store.playlists.favourites;
    const index = favourites.findIndex(fav => fav.id === track.id);
    if (index === -1) {
      favourites.push({
        id: track.id,
        title: track.title,
        albumId: track.albumId,
        cover: track.cover
      });
    } else {
      favourites.splice(index, 1);
    }
    localStorage.setItem('favourites', JSON.stringify(favourites));
    renderPlaylists(document.querySelector('.badge.active')?.dataset.playlistId || null);
    console.log('Favourites updated:', store.playlists.favourites);
  } catch (err) {
    console.error('Error in toggleFavourite:', err.message);
  }
}

export function renderPlaylists(activePlaylistId = null) {
  try {
    const badgesContainer = document.getElementById('playlist-badges');
    const playlistCardContainer = document.getElementById('playlist-card');
    
    if (!badgesContainer || !playlistCardContainer) {
      console.error('Error in renderPlaylists: DOM elements not found');
      return;
    }
    
    // Define default playlists
    const playlists = [
      {
        id: 'now-playing',
        title: 'Now Playing',
        cover: store.playlists.nowPlaying[0]?.cover || '../images/default.jpg',
        tracks: store.playlists.nowPlaying,
        meta: `Songs: ${store.playlists.nowPlaying.length}`
      },
      {
        id: 'favourites',
        title: 'Favourites',
        cover: store.playlists.favourites[0]?.cover || '../images/default.jpg',
        tracks: store.playlists.favourites,
        meta: `Songs: ${store.playlists.favourites.length}`
      },
      ...Object.values(store.playlists.musePlaylists)
    ];
    
    // Sort playlists: keep 'Now Playing' and 'Favourites' at the top, sort muse playlists by track count (descending) then title (alphabetically)
    const sortedPlaylists = [
      playlists.find(p => p.id === 'now-playing'), // Keep 'Now Playing' first
      playlists.find(p => p.id === 'favourites'), // Keep 'Favourites' second
      ...playlists
      .filter(p => p.id !== 'now-playing' && p.id !== 'favourites') // Exclude default playlists
      .sort((a, b) => b.tracks.length - a.tracks.length || a.title.localeCompare(b.title)) // Sort by track count, then title
    ].filter(Boolean); // Remove any undefined entries
    
    // Log sorted playlists for debugging
    console.log('Sorted playlists:', sortedPlaylists.map(p => ({ title: p.title, trackCount: p.tracks.length })));
    
    // Render badges with formatted titles
    badgesContainer.innerHTML = sortedPlaylists.map(playlist => `
      <span class="badge badge-pill badge-primary ${activePlaylistId === playlist.id ? 'active' : ''}" data-playlist-id="${playlist.id}">
        ${playlist.title}
      </span>
    `).join('');
    
    // Render active playlist card
    if (activePlaylistId) {
      const playlist = sortedPlaylists.find(p => p.id === activePlaylistId);
      if (playlist) {
        const tracks = playlist.tracks.map(track => `
          <li class="track-item d-flex align-items-center" data-song="${track.title}" data-album-id="${track.albumId}" data-track-id="${track.id}">
            <span class="flex-grow-1">${track.title}</span>
            <button class="btn btn-sm btn-outline-primary favourite-btn ms-2" data-track-id="${track.id}">
              ${store.playlists.favourites.some(fav => fav.id === track.id) ? '★' : '☆'}
            </button>
          </li>
        `).join('');
        
        playlistCardContainer.innerHTML = `
          <div class="album-card" data-album-id="${playlist.id}">
            <div class="album-item" data-album-id="${playlist.id}">
              <div class="album-cover">
                <img src="${playlist.cover}" alt="${playlist.title}" />
              </div>
              <div class="album-info">
                <p class="album-title">${playlist.title}</p>
                <p class="album-meta">${playlist.meta}</p>
              </div>
            </div>
            <div class="track-list" id="track-list-${playlist.id}-div4" style="display: none;">
              <ul class="track-list-ul">
                ${tracks}
              </ul>
            </div>
          </div>
        `;
        
        // Add event listeners for track list toggle
        const albumItem = playlistCardContainer.querySelector('.album-item');
        if (albumItem) {
          albumItem.addEventListener('click', () => {
            toggleTrackList(playlist.id);
          });
        }
        
        // Add event listeners for tracks
        playlistCardContainer.querySelectorAll('.track-item').forEach(track => {
          const trackId = track.dataset.trackId;
          track.querySelector('.flex-grow-1').addEventListener('click', () => {
            store.playTrack(trackId, activePlaylistId); // Pass playlistId
            store.switchView_ii('div4');
          });
          const favouriteBtn = track.querySelector('.favourite-btn');
          if (favouriteBtn) {
            favouriteBtn.addEventListener('click', () => {
              toggleFavourite(Number(trackId));
            });
          }
        });
        
        // Highlight current track
        if (store.currentTrack) {
          const currentTrackId = store.currentTrack.id;
          playlistCardContainer.querySelectorAll('.track-item').forEach(track => {
            if (track.dataset.trackId === String(currentTrackId)) {
              track.classList.add('highlighted');
            } else {
              track.classList.remove('highlighted');
            }
          });
        }
      } else {
        playlistCardContainer.innerHTML = '';
      }
    } else {
      playlistCardContainer.innerHTML = '';
    }
    
    // Add event listeners for badges
    badgesContainer.querySelectorAll('.badge').forEach(badge => {
      badge.addEventListener('click', () => {
        const playlistId = badge.dataset.playlistId;
        renderPlaylists(playlistId);
      });
    });
  } catch (err) {
    console.error('Error in renderPlaylists:', err.message);
  }
}

function findTrackById(trackId) {
  try {
    for (const album of store.albums) {
      const song = album.songs.find(s => s.id === Number(trackId));
      if (song) {
        return {
          id: song.id,
          title: song.title,
          albumId: album.id,
          cover: song.cover || album.cover || '../images/default.jpg'
        };
      }
    }
    return null;
  } catch (err) {
    console.error('Error in findTrackById:', err.message);
    return null;
  }
}