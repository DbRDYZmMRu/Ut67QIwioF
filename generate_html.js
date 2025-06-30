const fs = require('fs');
const path = require('path');

// Array of poetry titles
const poetryTitles = [
  "Shallots Picking",
  "Idols",
  "Same Old Rafters",
  "Brunch",
];

// Create necessary directories
const shareDir = path.join(__dirname, 'share', 'W2W', 'V');
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
  const description = `${title} is a poem from West to West Collection V by Howard Frith Hilton`;
  const keywords = `${title}, West to West Collection V`;
  const ogImage = `https://frithhilton.com.ng/images/share/W2W/5/image_${index + 1}.png`;
  const ogUrl = `https://www.frithhilton.com.ng/published/poetry/west-to-west-collection-V.html?query=${index + 1}`;
  const twitterImage = ogImage;
  const canonicalUrl = ogUrl;
  const redirectUrl = ogUrl;
  
  const htmlContent = htmlTemplate(
    `${title} - West to West Collection V`,
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