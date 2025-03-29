const fs = require('fs');
const path = require('path');

// Array of poetry titles
const poetryTitles = [
  "Goodnight Irene",
  "The Day Club",
  "Favourite Cardigan",
  "The Week",
  "Morning Pale",
  "Whiskers",
  "Dog-Eared Love",
  "Cubicle",
  "Lover",
  "Paper Planes",
  "Vinyl Perfect",
  "Pinchbeck Desire",
  "Hallway",
  "Those Things",
  "Grungy Ball",
  "The Absence Of Self",
  "Blind Reflection",
  "Ever Land",
  "Haiku. Why Cool!",
  "With You",
  "What Could Have Been",
  "Zebra High",
  "Look What You Made Me Do",
  "Popcorn Tub",
  "Style",
  "Rose Lens",
  "Clock Tock",
  "Far From The Early Y2K",
  "Plan Bs",
  "Dense Thrusting Shadows",
  "The Release",
  "Crock Forte",
  "A Rainy Day",
  "Cows",
  "Yuck",
  "XXX",
  "Le Nippy Deux",
  "Fruit",
  "Numero Uno",
  "I",
  "Cut",
  "Hue",
  "Pop",
  "Blacktop Garage",
  "Fait Accompli",
  "Cloud Aperture",
  "Pinky",
  "Screens",
  "Up To Eleven",
  "1251",
  "Half Blue Pod",
  "The Dark",
  "XV",
  "XVI",
  "Brood X",
  "A Tonnage",
  "Meeting a Girl Is Like Swinging a Set",
  "Hands",
  "It’s a New Day",
  "Earth Tweet",
  "Question Mark",
  "Im-Proach",
  "Hecatomb",
  "Velcro",
  "Docusoap",
  "Over To",
  "Stool",
  "Cake",
  "Wonder Tincture",
  "Panache Of a Late Cheer",
  "August 19",
  "Errands",
  "We Met",
  "Are You?",
  "Butt And Ash",
  "Every",
  "La Mia Innamorata",
  "Charly Cox",
  "Pesky 1989",
  "Tease",
  "Amadavat",
  "Roast",
  "She’s The Trip",
  "What Choice",
  "Electric",
  "Metachrosis Buckle",
  "Taylor Swift",
  "Ready",
  "Sign Of The Cornicle",
  "In My Place",
  "Ellipsis",
  "This Is Me Trying (Home)",
  "LVH Healing",
  "Tunnel",
  "Mum",
  "Sock",
  "The Bubble Wrap",
  "Earworms",
  "I",
  "II",
  "Divan",
  "Bouchée à La Reine",
  "Again",
  "Two High",
  "Graphic Grey Stencil",
  "Body Heat",
  "Her Wit Spittle",
  "Issue: What Remains?",
  "Taylor Do",
  "Poem 108",
  "Late For The Revue",
  "Stodgy Pouffe",
  "Apostrophe",
  "The Re-Occurring Transition",
  "Roadwork Ahead",
  "The Anon",
  "The wait (Journal entry)",
];

// Create necessary directories
const shareDir = path.join(__dirname, 'share', 'FHC', 'I');
fs.mkdirSync(shareDir, { recursive: true });

// Template for the HTML content
const htmlTemplate = (title, description, keywords, ogImage, ogUrl, twitterImage, canonicalUrl, redirectUrl) => `<!DOCTYPE html>
<html lang="en">

<head>
  <!-- Basic Meta Tags -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  <meta name="author" content="Frith Hilton">
  <meta name="robots" content="index, follow">
  
  <!-- Open Graph Meta Tags -->
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1080">
  <meta property="og:image:height" content="1080">
  <meta property="og:url" content="${ogUrl}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Frith Hilton's Website">
  <meta property="og:locale" content="en_US">
  
  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${twitterImage}">
  <meta name="twitter:site" content="@frithhilton17">
  <meta name="twitter:creator" content="@frithhilton17">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="${canonicalUrl}">
  
  <link rel="icon" type="image/x-icon" href="https://frithhilton.com.ng/images/favicon/favicon.ico">
  
  <!-- Apple Touch Icon -->
  <link rel="apple-touch-icon" sizes="180x180" href="https://frithhilton.com.ng/images/favicon/android-chrome-180x180.png">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="32x32" href="https://frithhilton.com.ng/images/favicon/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="https://frithhilton.com.ng/images/favicon/android-chrome-16x16.png">
  
  <!-- Manifest -->
  <link rel="manifest" href="site.webmanifest">
  
  <!-- Redirection Meta Tag -->
  <meta http-equiv="refresh" content="5; url=${redirectUrl}">
	<style>
		body {
			margin: 0;
			background-color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100vh;
		}
		
		img {
			max-width: 100%;
			height: auto;
		}
	</style>
  
</head>

<body>
	<img src="https://frithhilton.com.ng/images/favicon/FrithHiltonLogo.png" alt="Redirection Image">
  <!-- Your content goes here -->
</body>

</html>
`;

// Generate HTML files
poetryTitles.forEach((title, index) => {
  const description = `${title} is a poem from Frith Hilton Collection I by Howard Frith Hilton`;
  const keywords = `${title}, Frith Hilton Collection I`;
  const ogImage = `https://frithhilton.com.ng/images/share/FHC/1/image_${index + 1}.png`;
  const ogUrl = `https://www.frithhilton.com.ng/published/poetry/collection-I.html?query=${index + 1}`;
  const twitterImage = ogImage;
  const canonicalUrl = ogUrl;
  const redirectUrl = ogUrl;
  
  const htmlContent = htmlTemplate(
    `${title} - Frith Hilton Collection I`,
    description,
    keywords,
    ogImage,
    ogUrl,
    twitterImage,
    canonicalUrl,
    redirectUrl
  );
  
  // Write HTML content to file
  fs.writeFileSync(path.join(shareDir, `${index + 1}.html`), htmlContent);
});