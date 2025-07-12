// search.js
import { store } from './store.js';

export function initializeSearch() {
  try {
    const searchButton = document.getElementById('open-search-popup');
    if (searchButton) {
      const stickyHeaderHeight = 90;
      const initialTop = 20;
      const initialBackground = 'rgba(0, 0, 0, 0.2)';
      const transparentBackground = 'transparent';
      const searchIconBtn = document.getElementById('open-search-popup');
      const searchIconPosition = searchIconBtn.getBoundingClientRect().top + window.scrollY;
      
      function adjustSearchIconPosition() {
        try {
          const scrollY = window.scrollY;
          if (scrollY + stickyHeaderHeight >= searchIconPosition) {
            searchButton.style.position = 'fixed';
            searchButton.style.top = `${stickyHeaderHeight + 10}px`;
            searchButton.style.background = transparentBackground;
          } else {
            searchButton.style.position = 'absolute';
            searchButton.style.top = `${initialTop}px`;
            searchButton.style.background = initialBackground;
          }
        } catch (err) {
          console.error('Error in adjustSearchIconPosition:', err.message);
        }
      }
      window.addEventListener('scroll', adjustSearchIconPosition);
      adjustSearchIconPosition();
    }
    
    const openSearchPopupBtn = document.querySelector('#open-search-popup');
    const searchPopup = document.querySelector('#search-popup');
    if (openSearchPopupBtn && searchPopup) {
      const closeSearchBtn = document.querySelector('#close-search-popup');
      const searchInput = document.querySelector('#search-input');
      const searchResults = document.querySelector('#search-results');
      searchPopup.style.display = 'none';
      openSearchPopupBtn.addEventListener('click', () => {
        try {
          searchPopup.style.display = 'flex';
          searchInput.focus();
        } catch (err) {
          console.error('Error in openSearchPopupBtn click:', err.message);
        }
      });
      closeSearchBtn.addEventListener('click', () => {
        try {
          searchPopup.style.display = 'none';
          searchResults.innerHTML = '';
        } catch (err) {
          console.error('Error in closeSearchBtn click:', err.message);
        }
      });
      searchPopup.addEventListener('click', e => {
        try {
          if (e.target === searchPopup) {
            searchPopup.style.display = 'none';
            searchResults.innerHTML = '';
          }
        } catch (err) {
          console.error('Error in searchPopup click:', err.message);
        }
      });
      searchInput.addEventListener('input', () => {
        try {
          const query = searchInput.value.toLowerCase();
          searchResults.innerHTML = '';
          if (query.trim() === '') return;
          const results = [];
          store.albums.forEach(album => {
            if (album.title.toLowerCase().includes(query)) {
              results.push({
                type: 'Album',
                name: album.title,
                albumId: album.id
              });
            }
            album.songs.forEach(song => {
              if (song.title.toLowerCase().includes(query)) {
                results.push({
                  type: 'Track',
                  name: song.title,
                  album: album.title,
                  albumId: album.id,
                  trackId: song.id
                });
              }
            });
          });
          if (results.length) {
            results.forEach(item => {
              const resultItem = document.createElement('div');
              resultItem.className = 'search-result-item';
              resultItem.innerHTML = `<strong>${item.type}:</strong> ${item.name}`;
              resultItem.addEventListener('click', () => {
                try {
                  if (item.type === 'Track') {
                    store.playTrack(item.trackId);
                    searchPopup.style.display = 'none';
                    searchResults.innerHTML = '';
                    store.switchView_ii('div4');
                    window.toggleTrackList(item.albumId, item.name.toLowerCase().replace(/['’]/g, ''));
                  } else {
                    store.switchView_ii('div4');
                    window.toggleTrackList(item.albumId);
                    searchPopup.style.display = 'none';
                    searchResults.innerHTML = '';
                  }
                } catch (err) {
                  console.error('Error in searchResult click:', err.message, { item });
                }
              });
              searchResults.appendChild(resultItem);
            });
          } else {
            searchResults.innerHTML = "<p class='text-secondary'>No results found.</p>";
          }
        } catch (err) {
          console.error('Error in searchInput:', err.message, { query });
        }
      });
    }
  } catch (err) {
    console.error('Error in initializeSearch:', err.message);
  }
}