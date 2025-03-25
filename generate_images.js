const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Register the font
registerFont('/fonts/Architects_Daughter.ttf', { family: 'Architects Daughter' });

const imageSize = 1080;
const bgImagePath = 'https://raw.githubusercontent.com/DbRDYZmMRu/Ut67QIwioF/refs/heads/main/images/share/bg.jpg';
const outputDir = path.join(__dirname, 'images', 'share', 'FHC');
const titles = [
    "Goodnight Irene", "The Day Club", "Favourite Cardigan", "The Week", "Morning Pale", "Whiskers",
    "Dog-Eared Love", "Cubicle", "Lover", "Paper Planes", "Vinyl Perfect", "Pinchbeck Desire", "Hallway",
    "Those Things", "Grungy Ball", "The Absence Of Self", "Blind Reflection", "Ever Land", "Haiku. Why Cool!",
    "With You", "What Could Have Been", "Zebra High", "Look What You Made Me Do", "Popcorn Tub", "Style",
    "Rose Lens", "Clock Tock", "Far From The Early Y2K", "Plan Bs", "Dense Thrusting Shadows", "The Release",
    "Crock Forte", "A Rainy Day", "Cows", "Yuck", "XXX", "Le Nippy Deux", "Fruit", "Numero Uno", "I", "Cut",
    "Hue", "Pop", "Blacktop Garage", "Fait Accompli", "Cloud Aperture", "Pinky", "Screens", "Up To Eleven",
    "1251", "Half Blue Pod", "The Dark", "XV", "XVI", "Brood X", "A Tonnage", "Meeting a Girl Is Like Swinging a Set",
    "Hands", "It’s a New Day", "Earth Tweet", "Question Mark", "Im-Proach", "Hecatomb", "Velcro", "Docusoap",
    "Over To", "Stool", "Cake", "Wonder Tincture", "Panache Of a Late Cheer", "August 19", "Errands", "We Met",
    "Are You?", "Butt And Ash", "Every", "La Mia Innamorata", "Charly Cox", "Pesky 1989", "Tease", "Amadavat",
    "Roast", "She’s The Trip", "What Choice", "Electric", "Metachrosis Buckle", "Taylor Swift", "Ready",
    "Sign Of The Cornicle", "In My Place", "Ellipsis", "This Is Me Trying (Home)", "LVH Healing", "Tunnel",
    "Mum", "Sock", "The Bubble Wrap", "Earworms", "I", "II", "Divan", "Bouchée à La Reine", "Again", "Two High",
    "Graphic Grey Stencil", "Body Heat", "Her Wit Spittle", "Issue: What Remains?", "Taylor Do", "Poem 108",
    "Late For The Revue", "Stodgy Pouffe", "Apostrophe", "The Re-Occurring Transition", "Roadwork Ahead",
    "The Anon", "The wait (Journal entry)"
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
