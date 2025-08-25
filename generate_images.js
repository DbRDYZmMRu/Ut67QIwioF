const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Register the font
registerFont('font/Architects_Daughter.ttf', { family: 'Architects Daughter' });

const imageSize = 1080;
const bgImagePath = 'https://raw.githubusercontent.com/DbRDYZmMRu/Ut67QIwioF/refs/heads/main/images/share/bg.jpg';
const outputDir = path.join(__dirname, 'images', 'share', 'FHC', '3');
const titles = [
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

const drawText = (ctx, text, x, y, maxWidth) => {
  const words = text.split(' ');
  let line = '';
  const lineHeight = 160; // Set lineHeight to 160
  let yOffset = y;
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, yOffset);
      line = words[n] + ' ';
      yOffset += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, yOffset);
};

const generateImages = async () => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const bgImage = await loadImage(bgImagePath);
  
  for (let i = 0; i < titles.length; i++) {
    const canvas = createCanvas(imageSize, imageSize);
    const ctx = canvas.getContext('2d');
    
    // Draw the background image
    ctx.drawImage(bgImage, 0, 0, imageSize, imageSize);
    
    // Draw the main text
    ctx.font = '105px "Architects Daughter"';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawText(ctx, titles[i], imageSize / 2, imageSize / 2, imageSize - 40);
    
    // Draw the top center text
    ctx.font = '60px "Architects Daughter"';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('FRITH HILTON COLLECTION III', imageSize / 2, 10); // Corrected position
    
    // Save the image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(outputDir, `image_${i + 1}.png`), buffer);
  }
};

generateImages().catch(console.error);