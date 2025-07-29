// albums.js
import { store } from './store.js';
import { loadAlbums } from './albumManager.js';
import { toggleTrackList } from './trackListManager.js';

$(document).ready(function() {
  loadAlbums();
  
  // Handle album item clicks
  $('#album-list').on('click', '.album-item', function(e) {
    e.preventDefault();
    const albumId = $(this).data('album-id');
    console.log('toggleTrackList triggered:', { albumId });
    toggleTrackList(albumId);
  });
  
  // Handle track item clicks in div4
  $('#album-list').on('click', '.track-item', function(e) {
    e.preventDefault();
    const trackId = $(this).data('track-id');
    console.log('Track clicked in div4:', { trackId });
    if (trackId) {
      store.playTrack(trackId);
      store.switchView_ii('div4');
    } else {
      console.error('Error in track click: Missing trackId');
    }
  });
  
  // Handle track clicks in div3 (static sections)
  $(document).on('click', '.album-track', function(e) {
    e.preventDefault();
    const trackId = $(this).data('track-id');
    console.log('Track clicked in div3:', { trackId });
    if (trackId) {
      store.playTrack(trackId);
      store.switchView_ii('div4');
    } else {
      console.error('Error in track click: Missing trackId');
    }
  });
  
  // Expose toggleTrackList and getAlbumCover globally
  window.toggleTrackList = toggleTrackList;
  window.getAlbumCover = function(albumId) {
    try {
      return store.getAlbumCover(albumId);
    } catch (err) {
      console.error('Error in getAlbumCover:', err.message, { albumId });
      return '../images/default.jpg';
    }
  };
  
  // Mount Petite-Vue app if available
  if (window.PetiteVue) {
    window.PetiteVue.createApp({ store, getAlbumCover: window.getAlbumCover }).mount();
  }
});