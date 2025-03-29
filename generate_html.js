const fs = require('fs');
const path = require('path');

// Array of poetry titles
const poetryTitles = [
  "The Lakes",
  "Cantus Firmus",
  "Hip-Hip Whip",
  "At Eden",
  "A Happy Place",
  "Mother's Day",
  "Co-Cain",
  "Busk Her Fees",
  "Disaster",
  "Much This",
  "Menacing Numbers",
  "Byte",
  "Feathers",
  "To Say Goodbyes",
  "What is Love?",
  "My Scouring Garb",
  "Far Away from Here",
  "Schlep on It",
  "Headphone Ratatats",
  "Read it Late",
  "Busy Must Bee",
  "Father’s Day Reverie",
  "Butterfly",
  "Barbie Rebus",
  "It’s no Home",
  "Spread-eagle",
  "Skin Care",
  "Here She Comes Flapping",
  "Detour",
  "Encephalon",
  "See You Soon",
  "Drawstring",
  "Bodged Bugging",
  "Come Over",
  "Boob Breeze In",
  "Flame Blame",
  "Is It So?",
  "Rant Attack",
  "Sides of Swipe",
  "Can this Bard Relate?",
  "Code-Conduct",
  "Blah, Black, Man Peep",
  "What’s Love Got to Do with it?",
  "I’ll Know you for More",
  "Aliens over Flowers",
  "Outlive",
  "Hair Cream",
  "What makes up for Bosh",
  "Beast and Wifey",
  "A Map to Nap",
  
];

// Create necessary directories
const shareDir = path.join(__dirname, 'share', 'FHC', 'V');
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
  const description = `${title} is a poem from Frith Hilton Collection V by Howard Frith Hilton`;
  const keywords = `${title}, Frith Hilton Collection V`;
  const ogImage = `https://frithhilton.com.ng/images/share/FHC/5/image_${index + 1}.png`;
  const ogUrl = `https://www.frithhilton.com.ng/published/poetry/collection-V.html?query=${index + 1}`;
  const twitterImage = ogImage;
  const canonicalUrl = ogUrl;
  const redirectUrl = ogUrl;
  
  const htmlContent = htmlTemplate(
    `${title} - Frith Hilton Collection V`,
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