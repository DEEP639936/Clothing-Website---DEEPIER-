#!/usr/bin/env node
/* Download all pooled images and produce optimized local webp assets in public/img. */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const RAW = "/home/z/my-project/tmp/raw";
const OUTDIR = "/home/z/my-project/public/img";
fs.mkdirSync(RAW, { recursive: true });
fs.mkdirSync(OUTDIR, { recursive: true });

const poolSrc = fs.readFileSync("/home/z/my-project/src/lib/images.ts", "utf8");
const poolRe = /export const ([A-Z_]+)_IMAGES = \[([\s\S]*?)\];/g;
let m;
const pools = {};
while ((m = poolRe.exec(poolSrc))) {
  const name = m[1];
  const urls = [...m[2].matchAll(/"(https:[^"]+)"/g)].map((x) => x[1]);
  pools[name] = urls;
}

// 1) download
const jobs = [];
for (const [pool, urls] of Object.entries(pools)) {
  urls.forEach((u, i) => {
    const ext = u.match(/\.(jpg|jpeg|png|webp)/i)?.[1] || "jpg";
    const dest = path.join(RAW, `${pool.toLowerCase()}-${i + 1}.${ext}`);
    jobs.push([u, dest]);
  });
}
console.log(`Downloading ${jobs.length} images...`);
for (const [u, dest] of jobs) {
  if (fs.existsSync(dest)) continue;
  const r = spawnSync("curl", ["-sL", "--max-time", "30", "-o", dest, u], { timeout: 35000 });
  if (r.status !== 0) console.log(`  curl fail: ${u}`);
}
const files = fs.readdirSync(RAW).filter((f) => fs.statSync(path.join(RAW, f)).size > 5000);
console.log(`Downloaded OK: ${files.length}/${jobs.length}`);

// 2) optimize with sharp
const sharp = require("/home/z/my-project/node_modules/sharp");
(async () => {
  const manifest = {};
  for (const f of files) {
    const base = f.replace(/\.(jpg|jpeg|png|webp)$/i, "");
    const [pool, idx] = base.split("-");
    try {
      const src = path.join(RAW, f);
      const meta = await sharp(src).metadata();
      if (!meta.width || !meta.height) throw new Error("no metadata");
      const isHero = pool.startsWith("hero");
      const isWide = meta.width > meta.height;
      const targetW = isHero ? 1800 : isWide ? 1400 : 1100;
      const outName = `${base}.webp`;
      await sharp(src)
        .rotate()
        .resize({ width: Math.min(targetW, meta.width), withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(OUTDIR, outName));
      (manifest[pool] ||= []).push({ idx: parseInt(idx, 10), file: `/img/${outName}`, w: meta.width, h: meta.height });
    } catch (e) {
      console.log(`  skip ${f}: ${e.message}`);
    }
  }
  for (const pool of Object.keys(manifest)) manifest[pool].sort((a, b) => a.idx - b.idx);
  fs.writeFileSync("/home/z/my-project/tmp/manifest.json", JSON.stringify(manifest, null, 2));
  console.log("Optimized:", Object.entries(manifest).map(([k, v]) => `${k}:${v.length}`).join("  "));
})();
