const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Register the font
registerFont('font/Architects_Daughter.ttf', { family: 'Architects Daughter' });

const imageSize = 1080;
const bgImagePath = 'https://raw.githubusercontent.com/DbRDYZmMRu/Ut67QIwioF/refs/heads/main/images/share/bg.jpg';
const outputDir = path.join(__dirname, 'images', 'share', 'FHC');
const titles = [
    "Popcorn Tub", "Style",
    "Rose Lens", "Clock Tock", "Far From The Early Y2K", "Plan Bs", "Dense Thrusting Shadows", "The Release",
    "Crock Forte", "A Rainy Day", "Cows", "Yuck", "XXX", "Le Nippy Deux", "Fruit", "Numero Uno", "I", "Cut",
    "Hue", "Pop", "Blacktop Garage", "Fait Accompli", "Cloud Aperture", "Pinky", "Screens", "Up To Eleven",
    "1251", "Half Blue Pod", "The Dark", "XV", "XVI", "Brood X", "A Tonnage", "Meeting a Girl Is Like Swinging a Set",
    "Hands", "It’s a New Day", "Earth Tweet", "Question Mark", "Im-Proach", "Hecatomb"
];

const drawText = (ctx, text, x, y, maxWidth) => {
    const words = text.split(' ');
    let line = '';
    const lineHeight = parseInt(ctx.font, 10); // Adjust lineHeight to the font size
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
        ctx.font = '72px "Architects Daughter"';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        drawText(ctx, titles[i], imageSize / 2, imageSize / 2, imageSize - 40);

        // Draw the top left text
        ctx.font = '50px "Architects Daughter"';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('FRITH HILTON COLLECTION I', 10, 10);

        // Save the image
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(path.join(outputDir, `image_${i + 23}.png`), buffer);
    }
};

generateImages().catch(console.error);