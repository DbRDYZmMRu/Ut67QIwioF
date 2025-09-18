// Album ranges (cloned from API Worker, capped at 452)
const albumRanges = {
  1: { start: 1, end: 13 },
  2: { start: 14, end: 43 },
  3: { start: 44, end: 68 },
  4: { start: 69, end: 91 },
  5: { start: 92, end: 125 },
  6: { start: 126, end: 147 },
  7: { start: 148, end: 183 },
  8: { start: 184, end: 206 },
  9: { start: 207, end: 215 },
  10: { start: 216, end: 238 },
  11: { start: 239, end: 261 },
  12: { start: 262, end: 283 },
  13: { start: 284, end: 297 },
  14: { start: 298, end: 330 },
  15: { start: 331, end: 351 },
  16: { start: 352, end: 370 },
  17: { start: 371, end: 452 }
};

// Album metadata
const albums = {
  1: { name: "H.I.V", date: "September 13, 2019" },
  2: { name: "Colourful Light", date: "January 18, 2023" },
  3: { name: "December 13", date: "January 30, 2022" },
  4: { name: "Frith", date: "June 19, 2022" },
  5: { name: "screen time", date: "September 19, 2022" },
  6: { name: "Jacaranda", date: "November 30, 2022" },
  7: { name: "Hilton", date: "February 15, 2022" },
  8: { name: "lantern", date: "June 4, 2023" },
  9: { name: "the Lover tap3", date: "July 16, 2023" },
  10: { name: "Nightswan", date: "January 15, 2024" },
  11: { name: "Troubadour", date: "March 7, 2024" },
  12: { name: "it's pop", date: "May 28, 2024" },
  13: { name: "the Sessions", date: "July 26, 2024" },
  14: { name: "Farther Memes", date: "December 12, 2024" },
  15: { name: "Valence Eve", date: "March 13, 2025" },
  16: { name: "whereIsTheMoodRobot", date: "August 27, 2025" },
  17: { name: "sev.en.ton (In Session)", date: "September 17, 2025" }
};

// Base URL for GitHub files
const baseUrl = 'https://raw.githubusercontent.com/DbRDYZmMRu/freshPlayerBucket/main';

// Function to get album for a given ID
function getAlbumForId(id) {
  for (const [album, range] of Object.entries(albumRanges)) {
    if (id >= range.start && id <= range.end) {
      return album;
    }
  }
  return null;
}

// Run immediately (IIFE to start fetching early)
(async () => {
  const params = new URLSearchParams(window.location.search);
  const trackId = parseInt(params.get('track'));
  if (isNaN(trackId) || trackId < 1 || trackId > 452) {
    console.log('Invalid track ID:', trackId);
    return;
  }

  const album = getAlbumForId(trackId);
  if (!album) {
    console.log('Track ID not found in any album:', trackId);
    return;
  }

  const albumData = albums[album] || { name: "Unknown Album", date: "" };
  const jsonUrl = `${baseUrl}/json/${album}/${trackId}.json`;
  const audioUrl = `${baseUrl}/audio/${album}/${trackId}.mp3`;
  const coverUrl = `${baseUrl}/cover/${album}/${trackId}.jpg`;
  const pageUrl = `https://www.frithhilton.com.ng/pages/freshPlayer.html?track=${trackId}`;

  try {
    const response = await fetch(jsonUrl);
    if (!response.ok) {
      console.log('Failed to fetch JSON:', response.status);
      return;
    }
    const song = await response.json();

    // Wait for document.head or document.body to be available (short poll for early injection)
    let attempts = 0;
    const maxAttempts = 50; // Timeout after ~5s (100ms interval)
    const interval = setInterval(() => {
      attempts++;
      if (document.head || document.body) {
        clearInterval(interval);
        injectContent(song, albumData, coverUrl, audioUrl, pageUrl);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.log('Timeout waiting for document.head or document.body');
      }
    }, 100);
  } catch (error) {
    console.log('Error fetching JSON:', error.message);
  }
})();

// Injection function
function injectContent(song, albumData, coverUrl, audioUrl, pageUrl) {
  // Inject meta tags
  const metaTags = [
    { name: 'charset', value: 'utf-8' },
    { name: 'http-equiv', value: 'X-UA-Compatible', content: 'IE=edge' },
    { name: 'author', content: 'Frith Hilton' },
    { name: 'description', content: `Listen to ${song.song_title} by Frith Hilton from ${albumData.name}, released ${song.release_date}.` },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'og:url', content: pageUrl },
    { name: 'og:type', content: 'music.song' },
    { name: 'og:title', content: `${song.song_title} by Frith Hilton - ${albumData.name}` },
    { name: 'og:description', content: `Listen to ${song.song_title} by Frith Hilton from ${albumData.name}, released ${song.release_date}.` },
    { name: 'og:image', content: coverUrl },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${song.song_title} by Frith Hilton - ${albumData.name}` },
    { name: 'twitter:description', content: `Listen to ${song.song_title} by Frith Hilton from ${albumData.name}, released ${song.release_date}.` },
    { name: 'twitter:image', content: coverUrl }
  ];

  metaTags.forEach(tag => {
    if (tag.name === 'charset') {
      const meta = document.createElement('meta');
      meta.setAttribute('charset', tag.value);
      document.head.appendChild(meta);
    } else if (tag.name === 'http-equiv') {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', tag.value);
      meta.setAttribute('content', tag.content);
      document.head.appendChild(meta);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute(tag.name.startsWith('og:') || tag.name.startsWith('twitter:') ? 'property' : 'name', tag.name);
      meta.setAttribute('content', tag.content);
      document.head.appendChild(meta);
    }
  });

  // Inject canonical link
  const canonicalLink = document.createElement('link');
  canonicalLink.rel = 'canonical';
  canonicalLink.href = pageUrl;
  document.head.appendChild(canonicalLink);

  // Inject title
  document.title = `${song.song_title} by Frith Hilton - ${albumData.name}`;

  // Create container for injected content (hidden for humans via CSS)
  const container = document.createElement('div');
  container.id = 'seo-content';
  container.style.display = 'none'; // Hide for users, visible for bots

  // Inject title
  const titleElem = document.createElement('h1');
  titleElem.textContent = `${song.song_title} by Frith Hilton`;
  container.appendChild(titleElem);

  // Inject album and release info
  const infoElem = document.createElement('p');
  infoElem.textContent = `From album: ${albumData.name} (${albumData.date}) | Released: ${song.release_date} | Duration: ${song.duration} seconds`;
  container.appendChild(infoElem);

  // Inject lyrics
  let lyricsHtml = '<pre>';
  song.lyrics.forEach(lineObj => {
    if (lineObj.line) {
      lyricsHtml += `${lineObj.timestamp ? `[${lineObj.timestamp}] ` : ''}${lineObj.line}\n`;
      if (Object.keys(lineObj.annotations).length > 0) {
        lyricsHtml += 'Annotations: ' + JSON.stringify(lineObj.annotations) + '\n';
      }
    }
  });
  lyricsHtml += '</pre>';
  const lyricsElem = document.createElement('div');
  lyricsElem.innerHTML = `<h2>Lyrics</h2>${lyricsHtml}`;
  container.appendChild(lyricsElem);

  // Inject cover image
  const imgElem = document.createElement('img');
  imgElem.src = coverUrl;
  imgElem.alt = `Cover for ${song.song_title} by Frith Hilton`;
  imgElem.width = 300;
  container.appendChild(imgElem);

  // Inject audio embed (for crawlability)
  const audioElem = document.createElement('audio');
  audioElem.controls = true;
  audioElem.innerHTML = `<source src="${audioUrl}" type="audio/mpeg">`;
  container.appendChild(audioElem);

  // Inject schema.org JSON-LD
  const schemaScript = document.createElement('script');
  schemaScript.type = 'application/ld+json';
  schemaScript.text = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    "name": song.song_title,
    "duration": `PT${Math.floor(song.duration / 60)}M${song.duration % 60}S`,
    "datePublished": song.release_date,
    "image": coverUrl,
    "url": pageUrl,
    "inAlbum": {
      "@type": "MusicAlbum",
      "name": albumData.name,
      "datePublished": albumData.date
    },
    "byArtist": {
      "@type": "Person",
      "name": "Frith Hilton",
      "alternateName": "Howard Frith Hilton",
      "birthPlace": "Ogun State, Nigeria",
      "url": "https://www.frithhilton.com.ng/pages/bio.html",
      "description": "Frith Hilton is a Nigerian author, poet, songwriter, and musician with over 330 songs and 1,000 poems across 25 books. Discover his work at frithhilton.com.ng.",
      "image": [
        {
          "@type": "ImageObject",
          "url": "https://www.frithhilton.com.ng/images/Frith-Hilton/frith-hilton-author.jpg",
          "contentUrl": "https://www.frithhilton.com.ng/images/Frith-Hilton/frith-hilton-author.jpg",
          "caption": "Frith Hilton, poet and musician, as an author",
          "creator": { "@type": "Person", "name": "Frith Hilton" },
          "width": 1920,
          "height": 1920,
          "license": "https://creativecommons.org/licenses/by/4.0/",
          "creditText": "Frith Hilton",
          "copyrightNotice": "Copyright © Frith Hilton, licensed under CC BY 4.0",
          "acquireLicensePage": "https://creativecommons.org/licenses/by/4.0/"
        },
        {
          "@type": "ImageObject",
          "url": "https://www.frithhilton.com.ng/images/Frith-Hilton/frith-hilton-musician.jpg",
          "contentUrl": "https://www.frithhilton.com.ng/images/Frith-Hilton/frith-hilton-musician.jpg",
          "caption": "Frith Hilton, poet and musician, performing as a musician",
          "creator": { "@type": "Person", "name": "Frith Hilton" },
          "width": 612,
          "height": 773,
          "license": "https://creativecommons.org/licenses/by/4.0/",
          "creditText": "Frith Hilton",
          "copyrightNotice": "Copyright © Frith Hilton, licensed under CC BY 4.0",
          "acquireLicensePage": "https://creativecommons.org/licenses/by/4.0/"
        },
        {
          "@type": "ImageObject",
          "url": "https://www.frithhilton.com.ng/images/Frith-Hilton/frith-hilton-poet-author-musician-songwriter.jpg",
          "contentUrl": "https://www.frithhilton.com.ng/images/Frith-Hilton/frith-hilton-poet-author-musician-songwriter.jpg",
          "caption": "Frith Hilton, poet, author, musician, and songwriter",
          "creator": { "@type": "Person", "name": "Frith Hilton" },
          "width": 720,
          "height": 720,
          "license": "https://creativecommons.org/licenses/by/4.0/",
          "creditText": "Frith Hilton",
          "copyrightNotice": "Copyright © Frith Hilton, licensed under CC BY 4.0",
          "acquireLicensePage": "https://creativecommons.org/licenses/by/4.0/"
        },
        {
          "@type": "ImageObject",
          "url": "https://www.frithhilton.com.ng/images/Frith-Hilton/frith-hilton-poet.jpg",
          "contentUrl": "https://www.frithhilton.com.ng/images/Frith-Hilton/frith-hilton-poet.jpg",
          "caption": "Frith Hilton, poet and musician, as a poet",
          "creator": { "@type": "Person", "name": "Frith Hilton" },
          "width": 4080,
          "height": 4080,
          "license": "https://creativecommons.org/licenses/by/4.0/",
          "creditText": "Frith Hilton",
          "copyrightNotice": "Copyright © Frith Hilton, licensed under CC BY 4.0",
          "acquireLicensePage": "https://creativecommons.org/licenses/by/4.0/"
        },
        {
          "@type": "ImageObject",
          "url": "https://www.frithhilton.com.ng/images/Frith-Hilton/frith-hilton-songwriter.jpg",
          "contentUrl": "https://www.frithhilton.com.ng/images/Frith-Hilton/frith-hilton-songwriter.jpg",
          "caption": "Frith Hilton, poet and musician, as a songwriter",
          "creator": { "@type": "Person", "name": "Frith Hilton" },
          "width": 720,
          "height": 720,
          "license": "https://creativecommons.org/licenses/by/4.0/",
          "creditText": "Frith Hilton",
          "copyrightNotice": "Copyright © Frith Hilton, licensed under CC BY 4.0",
          "acquireLicensePage": "https://creativecommons.org/licenses/by/4.0/"
        },
        {
          "@type": "ImageObject",
          "url": "https://www.frithhilton.com.ng/images/Frith-Hilton/frith-hilton.jpg",
          "contentUrl": "https://www.frithhilton.com.ng/images/Frith-Hilton/frith-hilton.jpg",
          "caption": "Frith Hilton, poet and musician",
          "creator": { "@type": "Person", "name": "Frith Hilton" },
          "width": 1920,
          "height": 1920,
          "license": "https://creativecommons.org/licenses/by/4.0/",
          "creditText": "Frith Hilton",
          "copyrightNotice": "Copyright © Frith Hilton, licensed under CC BY 4.0",
          "acquireLicensePage": "https://creativecommons.org/licenses/by/4.0/"
        },
        {
          "@type": "ImageObject",
          "url": "https://www.frithhilton.com.ng/images/Frith-Hilton/howard-frith-hilton.jpg",
          "contentUrl": "https://www.frithhilton.com.ng/images/Frith-Hilton/howard-frith-hilton.jpg",
          "caption": "Frith Hilton, poet and musician",
          "creator": { "@type": "Person", "name": "Frith Hilton" },
          "width": 720,
          "height": 900,
          "license": "https://creativecommons.org/licenses/by/4.0/",
          "creditText": "Frith Hilton",
          "copyrightNotice": "Copyright © Frith Hilton, licensed under CC BY 4.0",
          "acquireLicensePage": "https://creativecommons.org/licenses/by/4.0/"
        },
        {
          "@type": "ImageObject",
          "url": "https://www.frithhilton.com.ng/images/Frith-Hilton/younger-frith-hilton.jpg",
          "contentUrl": "https://www.frithhilton.com.ng/images/Frith-Hilton/younger-frith-hilton.jpg",
          "caption": "Younger Frith Hilton, poet and musician",
          "creator": { "@type": "Person", "name": "Frith Hilton" },
          "width": 612,
          "height": 772,
          "license": "https://creativecommons.org/licenses/by/4.0/",
          "creditText": "Frith Hilton",
          "copyrightNotice": "Copyright © Frith Hilton, licensed under CC BY 4.0",
          "acquireLicensePage": "https://creativecommons.org/licenses/by/4.0/"
        }
      ],
      "jobTitle": "Poet, Musical artist",
      "nationality": { "@type": "Country", "name": "Nigeria" },
      "sameAs": [
        "https://x.com/frithhilton17",
        "https://www.youtube.com/@frithhilton17",
        "https://soundcloud.com/frithhilton17",
        "https://genius.com/artists/Frith-hilton",
        "https://instagram.com/frithhilton17"
      ],
      "contactPoint": { "@type": "ContactPoint", "email": "hello@frithhilton.com.ng", "contactType": "Professional Contact" },
      "worksFor": { "@type": "Organization", "name": "Frith Nightswan Enterprises", "url": "https://www.frithnightswanenterprises.com.ng" }
    },
    "recordingOf": {
      "@type": "MusicComposition",
      "lyrics": { "@type": "CreativeWork", "text": song.lyrics.map(l => l.line).join('\n').replace(/"/g, '\\"') },
      "lyricist": { "@type": "Person", "name": song.writer }
    }
  }, null, 2);
  document.head.appendChild(schemaScript);

  // Append container to body
  if (document.body) {
    document.body.appendChild(container);
  }
}