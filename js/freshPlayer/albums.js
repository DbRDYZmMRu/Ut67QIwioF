// albums.js
$(document).ready(function() {
  function loadAlbums() {
    $.getJSON('../data/albums.json', function(albums) {
      albums.forEach(album => {
        // Populate track lists in div3 (static sections in freshPlayer.html)
        const trackList = $(`#track-list-${album.id}`);
        album.songs.forEach(song => {
          trackList.append(`
            <li class="album-track" data-song="${song.title}" data-album-id="${album.id}" data-track-id="${song.id}">
              ${song.track}. ${song.title}
            </li>
          `);
        });
        
        $(document).on('click', `#track-list-${album.id} .album-track`, function(e) {
          e.preventDefault();
          const trackId = $(this).data('track-id');
          console.log('Track clicked in div3:', { trackId });
          if (trackId) {
            window.store.playTrack(trackId);
            window.store.switchView_ii('div4');
          } else {
            console.error('Error in track click: Missing trackId');
          }
        });
        
        const tracks = album.songs.map(song => `
          <li class="track-item" data-song="${song.title}" data-album-id="${album.id}" data-track-id="${song.id}">
            ${song.track}. ${song.title}
          </li>
        `);
        console.log('Generating tracks for div4:', { albumId: album.id, albumTitle: album.title, trackCount: tracks.length });
        const albumCard = `
          <div class="album-card" data-album-id="${album.id}">
            <div class="album-item" data-album-id="${album.id}">
              <div class="album-cover">
                <img src="${album.cover}" alt="${album.title}" />
              </div>
              <div class="album-info">
                <p class="album-title">${album.title}</p>
                <p class="album-meta">Release Date: ${album.releaseDate} | Songs: ${album.songs.length}</p>
              </div>
            </div>
            <div class="track-list" id="track-list-${album.id}-div4" style="display: none;">
              <ul class="track-list-ul">
                ${tracks.join('')}
              </ul>
            </div>
          </div>
        `;
        $('#album-list').append(albumCard);
      });
      
      setTimeout(() => {
        document.querySelectorAll('.track-list').forEach(list => {
          const trackItems = list.querySelectorAll('.track-item');
          console.log('Track list populated:', { listId: list.id, trackCount: trackItems.length });
        });
      }, 100);
      
      $('#album-list').on('click', '.album-item', function(e) {
        e.preventDefault();
        const albumId = $(this).data('album-id');
        console.log('toggleTrackList triggered:', { albumId });
        window.toggleTrackList(albumId);
      });
      
      $('#album-list').on('click', '.track-item', function(e) {
        e.preventDefault();
        const trackId = $(this).data('track-id');
        console.log('Track clicked in div4:', { trackId });
        if (trackId) {
          window.store.playTrack(trackId);
          window.store.switchView_ii('div4');
        } else {
          console.error('Error in track click: Missing trackId');
        }
      });
      
      if (window.PetiteVue) {
        window.PetiteVue.createApp({ store: window.store, getAlbumCover: window.getAlbumCover }).mount();
      }
    }).fail(function(jqXHR, textStatus, error) {
      console.error('Failed to load albums.json:', textStatus, error);
    });
  }
  
  window.toggleTrackList = function(albumId, highlightSong) {
    console.log('toggleTrackList called (albums.js):', { albumId, highlightSong });
    const trackList = document.getElementById(`track-list-${albumId}-div4`);
    if (!trackList) {
      console.error('trackList not found:', { albumId });
      return;
    }
    console.log('Current trackList display:', { albumId, display: trackList.style.display });
    document.querySelectorAll('.track-list').forEach(list => {
      list.classList.remove('active');
      list.style.display = 'none';
    });
    trackList.classList.toggle('active');
    trackList.style.display = trackList.classList.contains('active') ? 'block' : 'none';
    console.log('New trackList display:', { albumId, display: trackList.style.display });
    const trackItems = trackList.querySelectorAll('.track-item');
    console.log('Track items in list:', { albumId, trackCount: trackItems.length });
    if (highlightSong) {
      trackItems.forEach(track => {
        const trackName = track.dataset.song.toLowerCase().replace(/['’]/g, '');
        if (trackName === highlightSong) {
          console.log('Highlighting track:', track.dataset.song);
          track.classList.add('highlighted');
        } else {
          track.classList.remove('highlighted');
        }
      });
    }
  };
  
  window.getAlbumCover = function(albumId) {
    try {
      return window.store.getAlbumCover(albumId);
    } catch (err) {
      console.error('Error in getAlbumCover:', err.message, { albumId });
      return '../images/default.jpg';
    }
  };
  
  loadAlbums();
});