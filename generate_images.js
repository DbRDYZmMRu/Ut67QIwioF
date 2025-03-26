const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Register the font
registerFont('font/Architects_Daughter.ttf', { family: 'Architects Daughter' });

const imageSize = 1080;
const bgImagePath = 'https://raw.githubusercontent.com/DbRDYZmMRu/Ut67QIwioF/refs/heads/main/images/share/bg.jpg';
const outputDir = path.join(__dirname, 'images', 'share', 'FHC', '7');
const titles = [
"Serendipity",
"Third Person Omniscient",
"Survive Belong and Become",
"No Collection",
"One Sweet Hick",
"Instagram Is Her Joujou",
"Dad's Gamp",
"Whelmed Men",
"The Geezer's Fowl",
"Collection VI",
"The Film Festival",
"Crimson as Red Stain",
"A Taste of the Unworthy",
"The Same Thing as in Catch",
"The Bad Does Good, Good Does Bad",
"Yowzah",
"Taylor's Thighs",
"All His Love",
"In Graduations",
"Antenna",
"Yobs, Some Poetry Don't Rhyme",
"August",
"If I Was Your Boyfriend",
"A Curio",
"Where New Chicks Hatch",
"Daddy, Daddy, Daddy Bandying",
"Dovetail",
"Eyrie",
"Shaking for an Idol"
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
        ctx.fillText('FRITH HILTON COLLECTION VII', imageSize / 2, 10); // Corrected position

        // Save the image
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(path.join(outputDir, `image_${i + 1}.png`), buffer);
    }
};

generateImages().catch(console.error);
