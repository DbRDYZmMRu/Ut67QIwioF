const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Register the font
registerFont('font/Architects_Daughter.ttf', { family: 'Architects Daughter' });

const imageSize = 1080;
const bgImagePath = 'https://raw.githubusercontent.com/DbRDYZmMRu/Ut67QIwioF/refs/heads/main/images/share/bg.jpg';
const outputDir = path.join(__dirname, 'images', 'share', 'FHC', '5');
const titles = [
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
"A Map to Nap"
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
        ctx.fillText('FRITH HILTON COLLECTION V', imageSize / 2, 10); // Corrected position

        // Save the image
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(path.join(outputDir, `image_${i + 1}.png`), buffer);
    }
};

generateImages().catch(console.error);
