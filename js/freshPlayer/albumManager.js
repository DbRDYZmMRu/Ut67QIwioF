// albumManager.js
import { store } from './store.js';

export function loadAlbums() {
  $.getJSON('../data/albums.json', function(albums) {
    albums.forEach(album => {
      const trackList = $(`#track-list-${album.id}`);
      album.songs.forEach(song => {
        trackList.append(`
          <li class="album-track" data-song="${song.title}" data-album-id="${album.id}" data-track-id="${song.id}">
            ${song.track}. ${song.title}
          </li>
        `);
      });
      
      const tracks = album.songs.map(song => `
        <li class="track-item" data-song="${song.title}" data-album-id="${album.id}" data-track-id="${song.id}">
          ${song.track}. ${song.title}
        </li>
      `);
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
  }).fail(function(jqXHR, textStatus, error) {
    console.error('Failed to load albums.json:', textStatus, error);
  });
}