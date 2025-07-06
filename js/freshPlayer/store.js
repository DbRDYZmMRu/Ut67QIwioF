// store.js
import { createApp, reactive } from './petite-vue.js';
import { normalizeName } from './utils.js';
import { fetchLyrics, renderLyrics, updatePageContent, highlightAndOpenAlbum } from './lyrics.js';
import { playTrack } from './player.js';
import { playerState } from './state.js';

const albums = [
  {
    name: 'H.I.V',
    releaseDate: 'April 17, 2019',
    tracks: [
      'What is Love', 'Real Friends', 'Spotlight', 'Bleeding Heart', 'Rollie Dreams',
      'Bad Vibez', 'My Heart', 'Interlude', 'What is Real', 'Sunday Special',
      'Hurt You', 'Two Bad Bitches', "What's the Price?"
    ]
  },
  {
    name: 'colourful light',
    releaseDate: 'January 18, 2023',
    tracks: [
      'Conterminous', 'Forever', 'Not on my mobile', 'No prolix', 'Clones', 'Needle',
      'Gold pack', 'Endorphin', 'Never what it means', 'How you had me', "I won't say it",
      'On you', 'Little girl', 'Ogre', 'Living video record', 'So long', 'No telling',
      'Pepperoni freestyle', 'May 1st', 'Plunge (Interlude)', 'Next to you', 'Above',
      'Warden', 'Automatic', 'Colourful light', 'Gravity', 'Malady', 'Favourite girl',
      'Baby sways', 'What she does'
    ]
  },
  {
    name: 'December 13',
    releaseDate: 'January 10, 2022',
    tracks: [
      'Anarchy', 'December 13', "Can't have you", 'Got a bitch a valve', 'Tom',
      "Still can't swim", 'Well with her eff fame', 'Lili Fallon', 'Missing you',
      'My girl', 'Forest', 'Flutter', 'No. 13 a bore', 'Partner', 'Something simple',
      'Aperient flow', 'Six', 'Beethovenian', 'Outside', 'I think I am',
      'Sound of tears', 'What’s next?', 'Scribbling with a gun', "I'm Okay",
      'Milou Christmas'
    ]
  },
  {
    name: 'Frith',
    releaseDate: 'May 5, 2022',
    tracks: [
      'Take no buck', 'Triple to the X', 'Facts', 'Consumed', 'Anon', 'Curveball',
      'Sovereign', 'Playing', 'LILI', 'Hope', 'Popsicle', 'Ape', 'Close friends',
      'Dad (Interlude)', 'Paris', 'Warn me you’re ready', 'Unfurled',
      'Every door Taylor', 'Milk', 'Admissible emotions', 'Euphoria', 'Beat me down',
      'Ready to begin'
    ]
  },
  {
    name: 'screen time',
    releaseDate: 'July 2, 2022',
    tracks: [
      'From the start', 'Reverse', 'Get on with Jack', 'Too deep', 'Andalucía',
      'Friends', 'Text', 'Sunny', 'Humming', 'Waves', 'Addison Rae', 'Pauline',
      'Skyline grey', 'Bittersweet', 'Over you', 'Dreaming', 'Relapse holding',
      'Not lost', 'Hideaway', 'Superficial', 'Warning sign', 'Tears to my heart',
      "I'm sorry", 'Yearning', 'Silver all gone', 'Your eyes', 'Hold over me',
      'A minute', 'Mariam', 'Mine', 'Back home', 'Heaven knows', 'Assets',
      'Just us two'
    ]
  },
  {
    name: 'Jacaranda',
    releaseDate: 'September 24, 2022',
    tracks: [
      'Home', 'QWERTY', 'Blue heeler', 'Gargoyle', 'Silly hen', 'June', 'Thoth',
      'Real sad', 'Tangerine clouds', 'What if cell like', "Can't hide your theme",
      'Paying only you', 'The pain you need', 'Mona Lisa', 'Reusable bag',
      'Street lights', 'Beautiful', 'Pro hac vice', 'Cobber momma',
      'Get that education', 'Telescopic', 'Christmas sleepover'
    ]
  },
  {
    name: 'Hilton',
    releaseDate: 'December 15, 2022',
    tracks: [
      'Easy son', 'Ex, your relay', 'Easy, hard', 'Apogee', 'Caret', 'Moment',
      'Trauma', 'Yodel in a vial', 'Tate jersey love', 'Favourite', 'Rose', 'Swan',
      'Demola (Zenosyne)', 'Heavy keys', 'Crash', 'Oh din!', 'Soured love',
      'The one', 'Post soul', 'Our fall', 'Send me to sleep', 'Purpose',
      'Waste the time', 'Mound gold', 'Jail', 'Stuck', 'Doobry', 'Cull sigh',
      "I'm on air", 'Bread', 'I pray', 'My fantasy', 'A nearer echo',
      'Happy married life', 'Polygamy', 'Sofia'
    ]
  },
  {
    name: 'lantern',
    releaseDate: 'February 24, 2023',
    tracks: [
      'Do I ever do?', 'Number busy', 'Emma I feel', 'Raunch child', 'Jekyll',
      'God of clean', 'Hungry man', 'Lantern', '3:30', 'Be my lover', 'Purple zone',
      'Shire', 'Pussy power', 'Scent', 'Yeehaw', 'Mind talk', 'Cautious', 'Sarah',
      'Call for more', 'Higher calling', 'Say it', 'Avalon', 'How I lose it'
    ]
  },
  {
    name: 'the Lover tap3',
    releaseDate: 'June 19, 2023',
    tracks: [
      'Fair this time', 'Envy', 'Hump', 'Show me a girl', 'Disclose', 'On one',
      'Boink', 'Seventeen', "All girls aren't the same"
    ]
  },
  {
    name: 'Nightswan',
    releaseDate: 'August 4, 2023',
    tracks: [
      'Curandera', 'Marilyn', 'Being friends', 'Darbies', 'Amor fati', 'Pale',
      'Nominal now', 'Best stan', 'Different man', 'Fresh', 'Bad descriptions',
      'Backstage Friday', 'Amusing', 'Party ho', 'Love god', 'Hungry ladies',
      'Dreadnought', 'Get it out', 'Liar', 'Skin', 'Line', 'Boss woman',
      'Solid ground'
    ]
  },
  {
    name: 'troubadour',
    releaseDate: 'January 21, 2024',
    tracks: [
      'Eviction', 'Waste away', 'West to west', "I'll never", 'Cave',
      'Just let me go', 'Cheetah', 'Find me', 'Baby girl', 'My Hope',
      'Someone asked', 'Let it go', 'Testa', 'Respiring', 'Pretty girl',
      'Vacation', 'Heathrow', 'Benny', 'Beginning', 'Bedroom', 'Goodness',
      'Sure we lit', 'Old door'
    ]
  },
  {
    name: "it's pop",
    releaseDate: 'March 8, 2024',
    tracks: [
      'Low life dirty rat', 'A seal', 'Summit', 'New hemp plant', 'Melly',
      'Stuck in life', 'Heart census', 'Kevin Hart', 'Head', 'Imagination',
      'Lonely note', 'Hubble', 'Take me out', 'Reward Money', 'Big fat lie',
      'The calm', "I don't know", 'I get the ghetto', 'Sliving',
      'Bagging this home', 'Bag grips', 'Outro'
    ]
  },
  {
    name: 'the Sessions',
    releaseDate: 'June 14, 2024',
    tracks: [
      'Savour', 'Dizzy morning', 'Dirty laundry', 'Canticle', 'SZA', 'Undecided',
      'Different', 'Session 8', "I'll be there", 'Back to the store',
      "Sorry I'm alive", 'Long way home', 'Field of faeries', 'Magical'
    ]
  },
  {
    name: 'Farther Memes',
    releaseDate: 'February 15, 2025',
    tracks: [
      'Oliver Sacks', 'Oliver Sacks II', 'Palacio de la Zarzuela', 'The preacher',
      'Rick reflection', 'End of summer', 'Sex is everything', 'Fool for you',
      'Hathaway', 'Crush', 'Jealousy', 'Obligations', 'Rust', 'Best cardigan',
      'Unwilling', 'Applish', 'Home alone', 'Aureole sigh', 'First lines',
      'Spaghetti code', 'Fire', 'Fish', 'Greener', 'Lens', 'Keyhole',
      'Bright-eyed', 'Cut in fame', 'Feel good', 'Adios', 'Woah', 'Locked in',
      'Heartbeat', 'Barefoot'
    ]
  },
  {
    name: 'Valence Eve',
    releaseDate: 'December 31, 2024',
    tracks: [
      'I try', 'Kill time', 'Alarms', 'Smile on me', "Queen's daughter",
      'The game we play', 'Yahoo', 'Beautiful Taylor', 'Farce emotions', 'To you',
      'Honest', 'Recruits', 'Butcher feel', 'Porn star', 'Taking you home',
      'Kai Trump', 'Dime piece', 'Fisherman', 'Bedtime', 'Madness', 'Clubing sad'
    ]
  },
  {
    name: 'whereIsTheMoodRobot',
    releaseDate: 'in session',
    tracks: [
      'So alive Overture', 'Isn’t it yours', 'Old passions', 'Bread II', 'Faraway',
      'Cheer on me', 'For it', 'Via', 'Dakota', 'The Man', 'Headphones', 'Age 22', 'Buddy', 
    ]
  },
  
];

export const store = reactive({
  albumCount: 16,
  currentAlbumId: null,
  baseStylesheet: '../css/style.css',
  albumsStyleSheet: '../css/freshPlayer.css',
  stylesheetId: 'dynamic-stylesheet',
  view: 'div1',
  innerView: 'div3',
  mp3: './musicpool-db/mp3/ValenceEve/1.mp3',
  albums,
  currentTrack: null,
  currentAlbum: null,
  currentTrackIndex: -1,
  lyricsData: null,
  
  acceptCookieUse() {
    try {
      localStorage.setItem('cookieUse', true);
    } catch (err) {
      console.error('Error in acceptCookieUse:', err.message);
    }
  },
  
  showAlbumTracks(id) {
    try {
      for (let i = 1; i <= this.albumCount; i++) {
        const div = document.getElementById(`album-${i}`);
        if (div && i !== id) div.style.display = 'none';
      }
      const newDiv = document.getElementById(`album-${id}`);
      if (newDiv) {
        newDiv.style.display = newDiv.style.display === 'none' ? 'block' : 'none';
        if (newDiv.style.display === 'block') {
          const stickyHeaderHeight = 80;
          const top = newDiv.getBoundingClientRect().top + window.scrollY - stickyHeaderHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      } else {
        console.error('Error in showAlbumTracks: Album div not found', { id });
      }
    } catch (err) {
      console.error('Error in showAlbumTracks:', err.message, { id });
    }
  },
  
  buyAlbum(index) {
    try {
      const links = [
        'https://paystack.com/pay/hivalbum',
        'https://paystack.com/pay/colourfulllight',
        'https://paystack.com/pay/december13',
        'https://paystack.com/pay/frith',
        'https://paystack.com/pay/screentime',
        'https://paystack.com/pay/jacarandaalbum',
        'https://paystack.com/pay/theoalbum',
        'https://paystack.com/pay/lanternalbum',
        'https://paystack.com/pay/thelovertap3',
        'https://paystack.com/pay/nightswan',
        'https://paystack.com/pay/troubadour',
        'https://paystack.com/pay/itspop',
        'https://paystack.com/pay/thesessions',
        'https://paystack.com/pay/farthermemes',
        'https://paystack.com/pay/valenceeve',
      ];
      if (index >= 1 && index <= links.length) {
        window.open(links[index - 1], '_blank');
      } else {
        console.error('Error in buyAlbum: Invalid index', { index });
      }
    } catch (err) {
      console.error('Error in buyAlbum:', err.message, { index });
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
        this.loadStylesheet(innerView === 'div3' ? '../css/freshPlayer.css' : '');
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
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.id = this.stylesheetId;
      document.head.appendChild(link);
    } catch (err) {
      console.error('Error in loadStylesheet:', err.message, { href });
    }
  },
  
  async playTrack(albumName, trackName) {
    try {
      console.log('playTrack called with:', { albumName, trackName });
      const normalizedAlbum = normalizeName(albumName);
      const album = this.albums.find(a => normalizeName(a.name) === normalizedAlbum);
      if (!album) {
        console.error('Error in playTrack: Album not found', { albumName });
        return;
      }
      const normalizedTrack = normalizeName(trackName);
      const trackIndex = album.tracks.findIndex(t => normalizeName(t) === normalizedTrack);
      if (trackIndex === -1) {
        console.error('Error in playTrack: Track not found', { trackName, albumName });
        return;
      }
      this.currentAlbum = album;
      this.currentTrackIndex = trackIndex;
      this.currentTrack = {
        name: trackName,
        artist: 'Frith Hilton',
        cover: '../images/default.jpg',
        mp3_url: null
      };
      const data = await fetchLyrics(albumName, trackName);
      if (data) {
        this.currentTrack.mp3_url = data.mp3_url;
        this.currentTrack.cover = data.cover || '../images/default.jpg';
        playerState.totalTime = data.duration || 0;
        this.lyricsData = data.lyrics;
        playTrack(this.currentTrack.mp3_url);
        renderLyrics(data.lyrics);
        updatePageContent(albumName, trackName, data);
        highlightAndOpenAlbum(albumName, trackName);
        const query = `?album=${encodeURIComponent(albumName.replace(/\s/g, '_'))}&song=${encodeURIComponent(trackName.replace(/\s/g, '_'))}`;
        window.history.pushState({}, '', query);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        console.error('Error in playTrack: No lyrics data', { albumName, trackName });
      }
    } catch (err) {
      console.error('Error in playTrack:', err.message, { albumName, trackName });
    }
  },
  
  nextTrack() {
    try {
      if (!this.currentAlbum || this.currentTrackIndex === -1) {
        console.error('Error in nextTrack: No current album or track');
        return;
      }
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.currentAlbum.tracks.length;
      this.playTrack(this.currentAlbum.name, this.currentAlbum.tracks[this.currentTrackIndex]);
    } catch (err) {
      console.error('Error in nextTrack:', err.message);
    }
  },
  
  prevTrack() {
    try {
      if (!this.currentAlbum || this.currentTrackIndex === -1) {
        console.error('Error in prevTrack: No current album or track');
        return;
      }
      this.currentTrackIndex =
        (this.currentTrackIndex - 1 + this.currentAlbum.tracks.length) % this.currentAlbum.tracks.length;
      this.playTrack(this.currentAlbum.name, this.currentAlbum.tracks[this.currentTrackIndex]);
    } catch (err) {
      console.error('Error in prevTrack:', err.message);
    }
  },
  
  getAlbumCover(albumName) {
    try {
      return this.currentTrack && this.currentAlbum && normalizeName(this.currentAlbum.name) === normalizeName(albumName) ?
        this.currentTrack.cover :
        '../images/default.jpg';
    } catch (err) {
      console.error('Error in getAlbumCover:', err.message, { albumName });
      return '../images/default.jpg';
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
  } catch (err) {
    console.error('Error in mountApp:', err.message);
  }
}