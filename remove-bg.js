const sharp = require('sharp');
const path  = require('path');

const INPUT  = path.join(__dirname, 'src/assets/pochette back.png');
const OUTPUT = path.join(__dirname, 'src/assets/pochette-back-transparent.png');

// Gris cible et tolérance
const TARGET = { r: 60, g: 60, b: 65 };
const TOL    = 30;

(async () => {
  const { data, info } = await sharp(INPUT)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info; // channels = 4 (RGBA)
  const buf = Buffer.from(data);

  for (let i = 0; i < buf.length; i += channels) {
    const r = buf[i];
    const g = buf[i + 1];
    const b = buf[i + 2];

    if (
      Math.abs(r - TARGET.r) <= TOL &&
      Math.abs(g - TARGET.g) <= TOL &&
      Math.abs(b - TARGET.b) <= TOL
    ) {
      buf[i + 3] = 0; // transparent
    }
  }

  await sharp(buf, { raw: { width, height, channels } })
    .png()
    .toFile(OUTPUT);

  console.log(`✓ Fond supprimé → ${OUTPUT}`);
})();
