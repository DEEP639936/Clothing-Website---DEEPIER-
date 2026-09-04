#!/usr/bin/env node
/* Build numbered contact sheets per image pool for visual curation. */
const sharp = require("/home/z/my-project/node_modules/sharp");
const fs = require("fs");
const path = require("path");

const IMG = "/home/z/my-project/public/img";
const OUT = "/home/z/my-project/tmp/sheets";
fs.mkdirSync(OUT, { recursive: true });

const manifest = JSON.parse(fs.readFileSync("/home/z/my-project/tmp/manifest.json", "utf8"));
const TILE = 260, PAD = 6, COLS = 5;

(async () => {
  for (const [pool, items] of Object.entries(manifest)) {
    const rows = Math.ceil(items.length / COLS);
    const W = COLS * (TILE + PAD) + PAD;
    const H = rows * (TILE + PAD + 22) + PAD;
    const composites = [];
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const col = i % COLS, row = Math.floor(i / COLS);
      const x = PAD + col * (TILE + PAD);
      const y = PAD + row * (TILE + PAD + 22);
      try {
        const buf = await sharp(path.join(IMG, it.file.replace("/img/", "")))
          .resize(TILE, TILE, { fit: "cover" })
          .toBuffer();
        composites.push({ input: buf, left: x, top: y });
        const label = Buffer.from(
          `<svg width="${TILE}" height="20"><text x="4" y="14" font-size="14" font-family="sans-serif" fill="black" font-weight="bold">${pool.toUpperCase()} #${it.idx}</text></svg>`
        );
        composites.push({ input: label, left: x, top: y + TILE + 2 });
      } catch (e) { /* ignore */ }
    }
    await sharp({ create: { width: W, height: H, channels: 3, background: "#ffffff" } })
      .composite(composites)
      .jpeg({ quality: 80 })
      .toFile(path.join(OUT, `${pool}.jpg`));
    console.log(`sheet: ${pool} (${items.length})`);
  }
})();
