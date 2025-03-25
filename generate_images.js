const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Register the font
registerFont('font/Architects_Daughter.ttf', { family: 'Architects Daughter' });

const imageSize = 1080;
const bgImagePath = 'https://raw.githubusercontent.com/DbRDYZmMRu/Ut67QIwioF/refs/heads/main/images/share/bg.jpg';
const outputDir = path.join(__dirname, 'images', 'share', 'FHC');
const titles = [
    "Goodnight Irene", "The Day Club", "Favourite Cardigan", "The Week", "Morning Pale", "Whiskers",
    "Dog-Eared Love", "Cubicle", "Lover", "Paper Planes", "Vinyl Perfect", "Pinchbeck Desire", "Hallway",
    "Those Things", "Grungy Ball", "The Absence Of Self", "Blind Reflection", "Ever Land", "Haiku. Why Cool!",
    "With You", "What Could Have Been", "Zebra High", "Look What You Made Me Do"
];

const drawText = (ctx, text, x, y, maxWidth) => {
    const words = text.split(' ');
    let line = '';
    const lineHeight = 40;
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
        ctx.font = '32px "Architects Daughter"';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        drawText(ctx, titles[i], imageSize / 2, imageSize / 2, imageSize - 40);

        // Draw the top left text
        ctx.font = '15px "Architects Daughter"';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('FRITH HILTON COLLECTION I', 10, 10);

        // Save the image
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(path.join(outputDir, `image_${i + 1}.png`), buffer);
    }
};

generateImages().catch(console.error);
