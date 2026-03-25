const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ASSETS_DIR = path.join(__dirname, '../src/assets');
const MAX_WIDTH = 1600;
const QUALITY = 80;

const files = fs.readdirSync(ASSETS_DIR).filter(f =>
  /\.(jpg|jpeg|JPG|JPEG|png|PNG)$/i.test(f) && !f.endsWith('.png') // keep logo PNG untouched
);

(async () => {
  for (const file of files) {
    const inputPath = path.join(ASSETS_DIR, file);
    const stat = fs.statSync(inputPath);
    const sizeMB = (stat.size / 1024 / 1024).toFixed(1);

    const meta = await sharp(inputPath).metadata();
    const needsResize = meta.width > MAX_WIDTH;

    const pipeline = sharp(inputPath);
    if (needsResize) pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
    pipeline.jpeg({ quality: QUALITY, progressive: true });

    const tmpPath = inputPath + '.tmp';
    await pipeline.toFile(tmpPath);

    const newStat = fs.statSync(tmpPath);
    const newSizeMB = (newStat.size / 1024 / 1024).toFixed(1);

    fs.renameSync(tmpPath, inputPath);
    console.log(`${file}: ${sizeMB}MB → ${newSizeMB}MB (${meta.width}px → ${needsResize ? MAX_WIDTH : meta.width}px)`);
  }
  console.log('\nDone.');
})();
