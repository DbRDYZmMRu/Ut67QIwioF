// Album data with release dates
const albums = [
  {
    name: 'H.I.V',
    releaseDate: 'April 17, 2019',
    tracks: [
      'What Is Love', 'Real Friends', 'Spotlight', 'Bleeding Heart', 'Rollie Dreams',
      'Bad Vibez', 'My Heart', 'Interlude', 'What Is Real', 'Sunday Special',
      'Hurt You', 'Two Bad Bitches', "What's The Price?"
    ]
  },
  {
    name: 'colourful light',
    releaseDate: 'January 18, 2023',
    tracks: [
      'Conterminous', 'Forever', 'Not On My Mobile', 'No Prolix', 'Clones', 'Needle',
      'Gold Pack', 'Endorphin', 'Never What It Means', 'How You Had Me', "I Won't Say It",
      'On You', 'Little Girl', 'Ogre', 'Living Video Record', 'So Long', 'No Telling',
      'Pepperoni Freestyle', 'May 1St', 'Plunge (Interlude)', 'Next To You', 'Above',
      'Warden', 'Automatic', 'Colourful Light', 'Gravity', 'Malady', 'Favourite Girl',
      'Baby Sways', 'What She Does'
    ]
  },
  {
    name: 'December 13',
    releaseDate: 'January 10, 2022',
    tracks: [
      'Anarchy', 'December 13', "Can't Have You", 'Got A Bitch A Valve', 'Tom',
      "Still Can't Swim", 'Well With Her Eff Fame', 'Lili Fallon', 'Missing You',
      'My Girl', 'Forest', 'Flutter', 'No. 13 A Bore', 'Partner', 'Something Simple',
      'Aperient Flow', 'Six', 'Beethovenian', 'Outside', 'I Think I Am',
      'Sound Of Tears', 'What’s Next?', 'Scribbling With A Gun', "I'm Okay",
      'Milou Christmas'
    ]
  },
  {
    name: 'Frith',
    releaseDate: 'May 5, 2022',
    tracks: [
      'Take No Buck', 'Triple To The X', 'Facts', 'Consumed', 'Anon', 'Curveball',
      'Sovereign', 'Playing', 'Lili', 'Hope', 'Popsicle', 'Ape', 'Close Friends',
      'Dad (Interlude)', 'Paris', 'Warn Me You’re Ready', 'Unfurled',
      'Every Door Taylor', 'Milk', 'Admissible Emotions', 'Euphoria', 'Beat Me Down',
      'Ready To Begin'
    ]
  },
  {
    name: 'screen time',
    releaseDate: 'July 2, 2022',
    tracks: [
      'From The Start', 'Reverse', 'Get On With Jack', 'Too Deep', 'Andalucía',
      'Friends', 'Text', 'Sunny', 'Humming', 'Waves', 'Addison Rae', 'Pauline',
      'Skyline Grey', 'Bittersweet', 'Over You', 'Dreaming', 'Relapse Holding',
      'Not Lost', 'Hideaway', 'Superficial', 'Warning Sign', 'Tears To My Heart',
      "I'm Sorry", 'Yearning', 'Silver All Gone', 'Your Eyes', 'Hold Over Me',
      'A Minute', 'Mariam', 'Mine', 'Back Home', 'Heaven Knows', 'Assets',
      'Just Us Two'
    ]
  },
  {
    name: 'Jacaranda',
    releaseDate: 'September 24, 2022',
    tracks: [
      'Home', 'Qwerty', 'Blue Heeler', 'Gargoyle', 'Silly Hen', 'June', 'Thoth',
      'Real Sad', 'Tangerine Clouds', 'What If Cell Like', "Can't Hide Your Theme",
      'Paying Only You', 'The Pain You Need', 'Mona Lisa', 'Reusable Bag',
      'Street Lights', 'Beautiful', 'Pro Hac Vice', 'Cobber Momma',
      'Get That Education', 'Telescopic', 'Christmas Sleepover'
    ]
  },
  {
    name: 'Theo',
    releaseDate: 'December 15, 2022',
    tracks: [
      'Easy Son', 'Ex, Your Relay', 'Easy, Hard', 'Apogee', 'Caret', 'Moment',
      'Trauma', 'Yodel In A Vial', 'Tate Jersey Love', 'Favourite', 'Rose', 'Swan',
      'Demola (Zenosyne)', 'Heavy Keys', 'Crash', 'Oh Din!', 'Soured Love',
      'The One', 'Post Soul', 'Our Fall', 'Send Me To Sleep', 'Purpose',
      'Waste The Time', 'Mound Gold', 'Jail', 'Stuck', 'Doobry', 'Cull Sigh',
      "I'm On Air", 'Bread', 'I Pray', 'My Fantasy', 'A Nearer Echo',
      'Happy Married Life', 'Polygamy', 'Sofia'
    ]
  },
  {
    name: 'lantern',
    releaseDate: 'February 24, 2023',
    tracks: [
      'Do I Ever Do?', 'Number Busy', 'Emma I Feel', 'Raunch Child', 'Jekyll',
      'God Of Clean', 'Hungry Man', 'Lantern', '3:30', 'Be My Lover', 'Purple Zone',
      'Shire', 'Pussy Power', 'Scent', 'Yeehaw', 'Mind Talk', 'Cautious', 'Sarah',
      'Call For More', 'Higher Calling', 'Say It', 'Avalon', 'How I Lose It'
    ]
  },
  {
    name: 'the Lover tap3',
    releaseDate: 'June 19, 2023',
    tracks: [
      'Fair This Time', 'Envy', 'Hump', 'Show Me A Girl', 'Disclose', 'On One',
      'Boink', 'Seventeen', "All Girls Aren't The Same"
    ]
  },
  {
    name: 'Nightswan',
    releaseDate: 'August 4, 2023',
    tracks: [
      'Curandera', 'Marilyn', 'Being Friends', 'Darbies', 'Amor Fati', 'Pale',
      'Nominal Now', 'Best Stan', 'Different Man', 'Fresh', 'Bad Descriptions',
      'Backstage Friday', 'Amusing', 'Party Ho', 'Love God', 'Hungry Ladies',
      'Dreadnought', 'Get It Out', 'Liar', 'Skin', 'Line', 'Boss Woman',
      'Solid Ground'
    ]
  },
  {
    name: 'troubadour',
    releaseDate: 'January 21, 2024',
    tracks: [
      'Eviction', 'Waste Away', 'West To West', "I'll Never", 'Cave',
      'Just Let Me Go', 'Cheetah', 'Find Me', 'Baby Girl', 'My Hope',
      'Someone Asked', 'Let It Go', 'Testa', 'Respiring', 'Pretty Girl',
      'Vacation', 'Heathrow', 'Benny', 'Beginning', 'Bedroom', 'Goodness',
      'Sure We Lit', 'Old Door'
    ]
  },
  {
    name: "it's pop",
    releaseDate: 'March 8, 2024',
    tracks: [
      'Low Life Dirty Rat', 'A Seal', 'Summit', 'New Hemp Plant', 'Melly',
      'Stuck In Life', 'Heart Census', 'Kevin Hart', 'Head', 'Imagination',
      'Lonely Note', 'Hubble', 'Take Me Out', 'Reward Money', 'Big Fat Lie',
      'The Calm', "I Don't Know", 'I Get The Ghetto', 'Sliving',
      'Bagging This Home', 'Bag Grips', 'Outro'
    ]
  },
  {
    name: 'the Sessions',
    releaseDate: 'June 14, 2024',
    tracks: [
      'Savour', 'Dizzy Morning', 'Dirty Laundry', 'Canticle', 'Sza', 'Undecided',
      'Different', 'Session 8', "I'll Be There", 'Back To The Store',
      "Sorry I'm Alive", 'Long Way Home', 'Field Of Faeries', 'Magical'
    ]
  },
  {
    name: 'Farther Memes',
    releaseDate: 'February 15, 2025',
    tracks: [
      'Oliver Sacks', 'Oliver Sacks Ii', 'Palacio De La Zarzuela', 'The Preacher',
      'Rick Reflection', 'End Of Summer', 'Sex Is Everything', 'Fool For You',
      'Hathaway', 'Crush', 'Jealousy', 'Obligations', 'Rust', 'Best Cardigan',
      'Unwilling', 'Applish', 'Home Alone', 'Aureole Sigh', 'First Lines',
      'Spaghetti Code', 'Fire', 'Fish', 'Greener', 'Lens', 'Keyhole',
      'Bright-Eyed', 'Cut In Fame', 'Feel Good', 'Adios', 'Woah', 'Locked In',
      'Heartbeat', 'Barefoot'
    ]
  },
  {
    name: 'Valence Eve',
    releaseDate: 'December 31, 2024',
    tracks: [
      'I Try', 'Kill Time', 'Alarms', 'Smile On Me', "Queen's Daughter",
      'The Game We Play', 'Yahoo', 'Beautiful Taylor', 'Farce Emotions', 'To You',
      'Honest', 'Recruits', 'Butcher Feel', 'Porn Star', 'Taking You Home',
      'Kai Trump', 'Dime Piece', 'Fisherman', 'Bedtime', 'Madness', 'Clubing Sad'
    ]
  }
];

// Loader function
function showLoader() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (loaderContainer) {
      loaderContainer.remove();
    }
  }, 1000); // Remove after 1 second
}

// Modular lyrics loading functions
function normalizeName(str) {
  return str
    .replace(/_/g, ' ') // Replace underscores with spaces
    .toLowerCase()
    .replace(/['’]/g, ''); // Remove apostrophes for matching
}

function getFetchUrl(albumName, songTitle) {
  try {
    if (!albumName || !songTitle) {
      throw new Error('Missing album or song');
    }
    
    // Find album (case-insensitive, underscores to spaces)
    const normalizedAlbumQuery = normalizeName(albumName);
    const album = albums.find(a => normalizeName(a.name) === normalizedAlbumQuery);
    if (!album) {
      throw new Error(`Album "${albumName}" not found`);
    }
    
    // Normalize song title (underscores to spaces, remove apostrophes for matching)
    const normalizedSongTitle = normalizeName(songTitle);
    
    // Find song (case-insensitive, ignoring apostrophes)
    const song = album.tracks.find(t => normalizeName(t) === normalizedSongTitle);
    if (!song) {
      throw new Error(`Song "${songTitle}" not found in album "${albumName}"`);
    }
    
    // Build file path (retain spaces and apostrophes)
    return `../pages/lyricsDB/json/${album.name}/${song}.json`;
  } catch (err) {
    console.error('Error building fetch URL:', err.message);
    return null;
  }
}

async function fetchLyrics(albumName, songTitle) {
  const statusDiv = document.getElementById('status');
  const fetchUrl = getFetchUrl(albumName, songTitle);
  
  if (!fetchUrl) {
    const errorMsg = 'Error: Invalid album or song';
    console.error(errorMsg);
    if (statusDiv) {
      statusDiv.textContent = errorMsg;
      statusDiv.className = 'error';
    }
    return null;
  }
  
  try {
    if (statusDiv) {
      statusDiv.textContent = 'Loading lyrics...';
      statusDiv.className = '';
    }
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${fetchUrl}: ${response.status}`);
    }
    const data = await response.json();
    if (statusDiv) {
      statusDiv.textContent = 'Lyrics loaded';
      statusDiv.className = 'success';
    }
    return data; // Return full JSON (includes lyrics, cover, etc.)
  } catch (err) {
    const errorMsg = `Error: ${err.message}`;
    console.error('Fetch error:', err.message);
    if (statusDiv) {
      statusDiv.textContent = errorMsg;
      statusDiv.className = 'error';
    }
    return null;
  }
}

function renderLyrics(lyricsData) {
  const lyricsContainer = document.querySelector('.lyrics');
  const annotationPanel = document.getElementById('annotations-panel');
  if (!lyricsContainer || !annotationPanel || !lyricsData) {
    console.error('Missing lyrics container, annotation panel, or lyrics data');
    return;
  }
  
  const annotationText = document.getElementById('annotation-text');
  const closePanelBtn = document.getElementById('close-panel');
  const overlay = document.querySelector('.overlay') || document.createElement('div');
  
  if (!overlay.className) {
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
  }
  
  function openPanel(annotation) {
    annotationText.innerHTML = annotation || 'No annotation available.';
    annotationPanel.classList.add('active');
    overlay.classList.add('active');
  }
  
  function closePanel() {
    annotationPanel.classList.remove('active');
    overlay.classList.remove('active');
  }
  
  // Clear existing lyrics
  lyricsContainer.innerHTML = '';
  
  // Render new lyrics
  lyricsData.forEach((entry) => {
    const lineElement = document.createElement('div');
    lineElement.classList.add('lyric-line');
    
    if (entry.line === '') {
      lineElement.innerHTML = ' '; // Non-breaking space for empty line
    } else {
      let processedLine = entry.line;
      
      // Highlight square bracket content
      processedLine = processedLine.replace(
        /\[([^\]]+)\]/g,
        '<span class="bold-content">[$1]</span>'
      );
      
      // Highlight and annotate words
      if (entry.annotations) {
        for (const [word, annotation] of Object.entries(entry.annotations)) {
          const escapedWord = word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
          const annotatedWord = `<span class="annotated-word" data-annotation="${annotation}">${word}</span>`;
          processedLine = processedLine.replace(
            new RegExp(`\\b${escapedWord}(?=\\s|$|[.,!?])`, 'g'),
            annotatedWord
          );
        }
      }
      
      lineElement.innerHTML = processedLine;
    }
    
    lyricsContainer.appendChild(lineElement);
  });
  
  // Add event listeners for annotated words
  const annotatedWords = document.querySelectorAll('.annotated-word');
  annotatedWords.forEach((word) => {
    word.addEventListener('click', () => {
      const annotation = word.dataset.annotation;
      openPanel(annotation);
    });
  });
  
  // Update panel event listeners
  closePanelBtn?.removeEventListener('click', closePanel); // Remove old listener
  closePanelBtn?.addEventListener('click', closePanel);
  overlay.removeEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);
}

function updatePageContent(albumName, songTitle, data) {
  // Find album
  const normalizedAlbumQuery = normalizeName(albumName);
  const album = albums.find(a => normalizeName(a.name) === normalizedAlbumQuery);
  if (!album) {
    console.error(`Album "${albumName}" not found`);
    return;
  }
  
  // Find song
  const normalizedSongTitle = normalizeName(songTitle);
  const song = album.tracks.find(t => normalizeName(t) === normalizedSongTitle);
  if (!song) {
    console.error(`Song "${songTitle}" not found in album "${albumName}"`);
    return;
  }
  
  // Update Header
  const trackTitleEl = document.getElementById('track-title');
  const albumNameEl = document.getElementById('album-name');
  const trackCoverEl = document.getElementById('track-cover');
  const header = document.getElementById('dynamic-header');
  if (trackTitleEl) trackTitleEl.textContent = song;
  if (albumNameEl) albumNameEl.textContent = album.name;
  
  if (trackCoverEl) {
    const coverSrc = data.cover || '../images/default.jpg';
    console.log(`Setting cover for ${song}: ${coverSrc}`);
    trackCoverEl.src = coverSrc;
    trackCoverEl.alt = `${song} Cover`;
    
    // Apply default gradient
    if (header) {
      header.style.background = 'linear-gradient(135deg, #444444, #666666)';
    }
    
    // Extract colors with Color Thief
    if (typeof ColorThief !== 'undefined' && header) {
      const applyColors = () => {
        try {
          const colorThief = new ColorThief();
          const palette = colorThief.getPalette(trackCoverEl, 2); // Get 2 colors
          if (palette && palette.length >= 2) {
            console.log(`Color Thief palette for ${coverSrc}:`, palette);
            const [dominantColor, secondaryColor] = palette;
            const dominantHex = rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2]);
            const secondaryHex = rgbToHex(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            header.style.background = `linear-gradient(135deg, ${dominantHex}, ${secondaryHex})`;
          } else {
            console.warn(`No valid palette for ${coverSrc}`);
          }
        } catch (err) {
          console.error(`Error extracting colors for ${coverSrc}:`, err.message || err);
        }
      };
      
      // Wait for image to load
      if (trackCoverEl.complete) {
        applyColors();
      } else {
        trackCoverEl.onload = applyColors;
        trackCoverEl.onerror = () => {
          console.error(`Failed to load image: ${coverSrc}`);
        };
      }
    } else {
      console.warn('ColorThief not loaded or header missing');
    }
  } else {
    console.warn('Track cover element not found');
  }
  
  // Update Credits
  const creditWriterEl = document.getElementById('credit-writer');
  const creditLabelEl = document.getElementById('credit-label');
  const creditReleaseDateEl = document.getElementById('credit-release-date');
  if (creditWriterEl) {
    creditWriterEl.textContent = 'Frith Hilton';
  } else {
    console.warn('Credit writer element (#credit-writer) not found');
  }
  if (creditLabelEl) {
    creditLabelEl.textContent = 'Fresh Boy Chilling';
  } else {
    console.warn('Credit label element (#credit-label) not found');
  }
  if (creditReleaseDateEl) {
    creditReleaseDateEl.textContent = data.release_date || 'Unknown';
  } else {
    console.warn('Credit release date element (#credit-release-date) not found');
  }
  
  // Update Bio
  const songBioEl = document.getElementById('song-bio');
  if (songBioEl) {
    songBioEl.textContent = data.bio || 'Song information will be displayed here when available.';
  } else {
    console.warn('Song bio element (#song-bio) not found');
  }
  
  // Skip Other Tracks section (optional, as section may be hidden or removed)
  const albumTracksNameEl = document.getElementById('album-tracks-name');
  const otherTracksListEl = document.getElementById('other-tracks-list');
  if (albumTracksNameEl) {
    albumTracksNameEl.textContent = '';
  }
  if (otherTracksListEl) {
    otherTracksListEl.innerHTML = '';
  }
}

// Helper function to convert RGB to Hex
function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, '0')}`;
}

// Highlight the current track and open its album in the album list
function highlightAndOpenAlbum(albumName, songTitle) {
  const albumList = document.querySelector('.album-list');
  if (!albumList) {
    console.warn('Album list not found');
    return;
  }
  
  // Find album index
  const normalizedAlbumQuery = normalizeName(albumName);
  const albumIndex = albums.findIndex(a => normalizeName(a.name) === normalizedAlbumQuery);
  if (albumIndex === -1) {
    console.error(`Album "${albumName}" not found in albums data`);
    return;
  }
  
  // Normalize song title
  const normalizedSongTitle = normalizeName(songTitle);
  
  // Map album index to toggle ID (albums array index + 1)
  const toggleId = albumIndex + 1;
  
  // Get all album cards
  const albumCards = Array.from(albumList.children);
  
  // Find the current album card
  const currentAlbumCard = albumCards.find((albumCard) => {
    const albumItem = albumCard.querySelector('.album-item');
    if (!albumItem) return false;
    const onclickAttr = albumItem.getAttribute('onclick');
    if (!onclickAttr) return false;
    const toggleMatch = onclickAttr.match(/toggleTrackList\((\d+)\)/);
    return toggleMatch && parseInt(toggleMatch[1]) === toggleId;
  });
  
  if (!currentAlbumCard) {
    console.warn(`Album card for toggleTrackList(${toggleId}) not found`);
    return;
  }
  
  // Move current album to top
  albumList.prepend(currentAlbumCard);
  
  // Close all track lists and remove highlights
  const allTrackLists = document.querySelectorAll('.track-list');
  allTrackLists.forEach(list => list.classList.remove('active'));
  document.querySelectorAll('.track-item, .album-track').forEach(track => {
    track.classList.remove('highlighted');
  });
  
  // Open the current album's track list and highlight the track
  toggleTrackList(toggleId, normalizedSongTitle);
}

function handleTrackLinkClick(e) {
  e.preventDefault();
  const link = e.target.closest('.track-link');
  if (link) {
    const album = link.dataset.album;
    const song = link.dataset.song;
    if (album && song) {
      loadLyricsByTrack(album, song, true, true, false); // No view switch for track links
    } else {
      console.error('Missing data-album or data-song on track link');
    }
  }
}

// Updated function to initialize all album track lists
function initAlbumTrackLists() {
  for (let id = 1; id <= 15; id++) {
    // Petite-Vue tracks (.album-track)
    const trackList = document.querySelector(`#album-${id} .album-track-list`);
    if (trackList) {
      const tracks = trackList.querySelectorAll('.album-track');
      tracks.forEach(track => {
        track.removeEventListener('click', handleTrackClick);
        track.addEventListener('click', () => handleTrackClick(track, id, true)); // isPetiteVue=true
      });
    }
  }
}

function handleTrackClick(trackElement, albumId, isPetiteVue) {
  const trackClass = isPetiteVue ? '.album-track' : '.track-item';
  const track = trackElement.closest(trackClass);
  if (!track) {
    console.error(`No element found with class ${trackClass}`);
    return;
  }
  
  if (albumId < 1 || albumId > albums.length) {
    console.error(`Invalid album ID: ${albumId}`);
    return;
  }
  
  const album = albums[albumId - 1].name; // Map id to albums index
  const song = track.dataset.song;
  if (!song) {
    console.error('No data-song attribute found on track element');
    return;
  }
  
  loadLyricsByTrack(album, song, true, true, isPetiteVue);
}

async function loadLyricsByTrack(albumName, songTitle, updateUrl = false, showLoaderFlag = true, isPetiteVue = false) {
  if (showLoaderFlag) {
    showLoader();
  }
  
  const data = await fetchLyrics(albumName, songTitle);
  if (data) {
    renderLyrics(data.lyrics);
    updatePageContent(albumName, songTitle, data);
    highlightAndOpenAlbum(albumName, songTitle); // Highlight the specific track
    if (updateUrl) {
      const query = `?album=${encodeURIComponent(albumName.replace(/\s/g, '_'))}&song=${encodeURIComponent(songTitle.replace(/\s/g, '_'))}`;
      window.history.pushState({}, '', query);
    }
    // Scroll to top of page for track clicks
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (isPetiteVue) {
      if (window.store && typeof window.store.switchView_ii === 'function') {
        window.store.switchView_ii('div4');
      } else {
        console.warn('Petite-Vue store or switchView_ii method not available');
      }
    }
  }
}

// Consolidated DOMContentLoaded handler
document.addEventListener('DOMContentLoaded', function() {
  // Wait for store to be available
  function waitForStore(callback) {
    if (window.store && typeof window.store.switchView_ii === 'function') {
      callback();
    } else {
      setTimeout(() => waitForStore(callback), 100);
    }
  }

  waitForStore(() => {
    // Initial load from URL query (no loader)
    const urlParams = new URLSearchParams(window.location.search);
    const albumName = urlParams.get('album');
    const songTitle = urlParams.get('song');
    if (albumName && songTitle) {
      loadLyricsByTrack(albumName, songTitle, false, false, false); // No view switch
    }
    
    // Initialize all album track lists
    initAlbumTrackLists();
    
    // Search Icon Position Adjustment
    const searchIconBtn = document.getElementById('open-search-popup');
    if (searchIconBtn) {
      const stickyHeaderHeight = 90;
      const initialTop = 20;
      const initialBackground = 'rgba(0, 0, 0, 0.2)';
      const transparentBackground = 'transparent';
      const searchIconInitialPosition = searchIconBtn.getBoundingClientRect().top + window.scrollY;
      
      function adjustSearchIconPosition() {
        const scrollY = window.scrollY;
        if (scrollY + stickyHeaderHeight >= searchIconInitialPosition) {
          searchIconBtn.style.position = 'fixed';
          searchIconBtn.style.top = `${stickyHeaderHeight + 10}px`;
          searchIconBtn.style.background = transparentBackground;
        } else {
          searchIconBtn.style.position = 'absolute';
          searchIconBtn.style.top = `${initialTop}px`;
          searchIconBtn.style.background = initialBackground;
        }
      }
      
      window.addEventListener('scroll', adjustSearchIconPosition);
      adjustSearchIconPosition();
    }
    
    // Search Popup Functionality
    const openSearchPopupBtn = document.getElementById('open-search-popup');
    const searchPopup = document.getElementById('search-popup');
    if (openSearchPopupBtn && searchPopup) {
      const closeSearchPopupBtn = document.getElementById('close-search-popup');
      const searchInput = document.getElementById('search-input');
      const searchResults = document.getElementById('search-results');
      
      searchPopup.style.display = 'none';
      
      openSearchPopupBtn.addEventListener('click', () => {
        searchPopup.style.display = 'flex';
        searchInput.focus();
      });
      
      closeSearchPopupBtn.addEventListener('click', () => {
        searchPopup.style.display = 'none';
        searchResults.innerHTML = '';
      });
      
      searchPopup.addEventListener('click', (e) => {
        if (e.target === searchPopup) {
          searchPopup.style.display = 'none';
          searchResults.innerHTML = '';
        }
      });
      
      searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        searchResults.innerHTML = '';
        
        if (query.trim() === '') {
          return;
        }
        
        // Search albums and tracks
        const results = [];
        albums.forEach(album => {
          if (album.name.toLowerCase().includes(query)) {
            results.push({
              type: 'Album',
              name: album.name,
              album: album.name
            });
          }
          album.tracks.forEach(track => {
            if (track.toLowerCase().includes(query)) {
              results.push({
                type: 'Track',
                name: track,
                album: album.name,
                song: track
              });
            }
          });
        });
        
        if (results.length > 0) {
          results.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `<strong>${item.type}:</strong> ${item.name}`;
            resultItem.addEventListener('click', () => {
              if (item.type === 'Track') {
                loadLyricsByTrack(item.album, item.song, true, true, false); // No view switch
                searchPopup.style.display = 'none';
                searchResults.innerHTML = '';
              } else {
                // Open album track list without reordering
                const albumIndex = albums.findIndex(a => a.name === item.name);
                if (albumIndex !== -1) {
                  toggleTrackList(albumIndex + 1);
                }
              }
            });
            searchResults.appendChild(resultItem);
          });
        } else {
          searchResults.innerHTML = "<p class='text-secondary'>No results found.</p>";
        }
      });
    }
    
    // Swiper Initialization
    if (typeof Swiper !== 'undefined') {
      new Swiper('.swiper-container', {
        slidesPerView: 3,
        spaceBetween: 20,
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 15
          },
          576: {
            slidesPerView: 1,
            spaceBetween: 10
          }
        }
      });
    }
  });
});

// Track List Toggle Function
function toggleTrackList(id, highlightSong = null) {
  const trackList = document.getElementById(`track-list-${id}`);
  if (!trackList) {
    console.warn(`Track list #track-list-${id} not found`);
    return;
  }
  
  const albumCard = trackList.closest('.album-card');
  if (!albumCard) {
    console.warn(`Album card for #track-list-${id} not found`);
    return;
  }
  
  // Toggle the track list
  const isOpening = !trackList.classList.contains('active');
  trackList.classList.toggle('active');
  
  // If opening, scroll to the top of the album card
  if (isOpening) {
    albumCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  // Add click events to tracks and highlight if specified
  const tracks = trackList.querySelectorAll('.track-item');
  tracks.forEach(track => {
    if (highlightSong && normalizeName(track.dataset.song) === highlightSong) {
      track.classList.add('highlighted');
    } else {
      track.classList.remove('highlighted');
    }
    track.removeEventListener('click', handleTrackClick);
    track.addEventListener('click', () => handleTrackClick(track, id, false)); // isPetiteVue=false
  });
  
  // Handle Petite-Vue tracks
  const petiteVueTrackList = document.querySelector(`#album-${id} .album-track-list`);
  if (petiteVueTrackList) {
    const petiteVueTracks = petiteVueTrackList.querySelectorAll('.album-track');
    petiteVueTracks.forEach(track => {
      if (highlightSong && normalizeName(track.dataset.song) === highlightSong) {
        track.classList.add('highlighted');
      } else {
        track.classList.remove('highlighted');
      }
      track.removeEventListener('click', handleTrackClick);
      track.addEventListener('click', () => handleTrackClick(track, id, true)); // isPetiteVue=true
    });
  }
}