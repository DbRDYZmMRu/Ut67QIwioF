const fs = require('fs');
const path = require('path');

// Array of poetry titles
const poetryTitles = [
                        "Mirrors",
            "Steady",
            "Offering off a Lark",
            "The Masked Girl",
            "Dough",
            "The Brazen Spider, Unwanted Nut",
            "The Bug, the First Car",
            "Driver Licence",
            "A Pitch Run",
            "Caspian’s Autumn Foam",
            "Before it’s Time",
            "Upside Down Shower",
            "Sir William Alexander Craigie (August 13)",
            "Malefic Rookie",
            "Quiver Barnet",
            "The Last Artisan",
            "To be Left Alone",
            "Happy Birthday",
            "Hallelujah Gate",
            "Questions Making Trouble",
            "Crocs to Go",
            "Ditch the Sunset",
            "Lazy",
            "Caged Poems",
            "New House",
            "Snores, Doors and Jolts",
            "Accounting for My Trips (A — Z)",
            "Mariam",
            "Love Letters and Promenades",
            "My Rip Jean",
            "Six to Eight",
            "Catlick",
            "The Dot before the Hallo",
            "The Sleazy",
            "Lame in Dubai",
            "Our Love",
            "Twenty-Four",
            "Title",

];

// Create necessary directories
const shareDir = path.join(__dirname, 'share', 'FHC', 'III');
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
  <meta name="author" content="Howard Frith Hilton">
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
  const description = `${title} is a poem from Frith Hilton Collection III by Howard Frith Hilton`;
  const keywords = `${title}, Frith Hilton Collection VIII`;
  const ogImage = `https://frithhilton.com.ng/images/share/FHC/3/image_${index + 1}.png`;
  const ogUrl = `https://www.frithhilton.com.ng/published/poetry/frith-hilton-collection-III.html?query=${index + 1}`;
  const twitterImage = ogImage;
  const canonicalUrl = ogUrl;
  const redirectUrl = ogUrl;
  
  const htmlContent = htmlTemplate(
    `${title} - Frith Hilton Collection VIII`,
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