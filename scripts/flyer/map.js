#!/usr/bin/env node
/* MeyGOD venue map — keyless OSM raster tiles, inverted + graded to the theme:
   white street labels, red roads, dark red-black ground. Sigil marker with glow.
   Landscape 5:4 canvas. Attribution lives on the website (OSM license).
   Dual use: public/maps/velodrome.png (website) + assets/map-bellville.png (flyer).
   Usage: node map.js [--lon=18.6335] [--lat=-33.8798] [--zoom=16] [--zoom-in=1.15]
*/

const { createCanvas, loadImage } = require("@napi-rs/canvas");
const fs = require("fs");
const path = require("path");
const { drawSigil } = require("./sigil");

const args = process.argv.slice(2);
const value = (name, dflt) => {
  const a = args.find((x) => x.startsWith(`--${name}=`));
  return a ? a.slice(name.length + 3) : dflt;
};

const LON = parseFloat(value("lon", "18.6334957"));
const LAT = parseFloat(value("lat", "-33.8798444"));
const ZOOM = parseInt(value("zoom", "16"), 10);
const ZOOM_IN = parseFloat(value("zoom-in", "1.15"), 10); // tile upscale → fractional zoom-in
const W = 1400; // canvas size (2:1 landscape)
const H = 700;
const TILE_PX = 256 * ZOOM_IN;

const lonToTileX = (lon, z) => ((lon + 180) / 360) * 2 ** z;
const latToTileY = (lat, z) => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z;
};

const fetchTile = async (z, x, y) => {
  const url = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
  const res = await fetch(url, {
    headers: { "User-Agent": "meygod-flyer/1.0 (contact: meygod.com)" },
  });
  if (!res.ok) throw new Error(`tile ${z}/${x}/${y} failed: ${res.status}`);
  return loadImage(Buffer.from(await res.arrayBuffer()));
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const main = async () => {
  const cx = lonToTileX(LON, ZOOM);
  const cy = latToTileY(LAT, ZOOM);
  const x0 = Math.floor(cx) - 3;
  const y0 = Math.floor(cy) - 3;
  const N = 7; // tiles per side

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  for (let ty = 0; ty < N; ty++) {
    for (let tx = 0; tx < N; tx++) {
      const img = await fetchTile(ZOOM, x0 + tx, y0 + ty);
      // venue (tile-space cx,cy) lands exactly on canvas center (W/2, H/2)
      const px = (x0 + tx - cx) * TILE_PX + W / 2;
      const py = (y0 + ty - cy) * TILE_PX + H / 2;
      ctx.drawImage(img, px, py, TILE_PX, TILE_PX);
      await sleep(80);
    }
  }

  // --- per-pixel MeyGOD grade ---
  // OSM tiles are light: invert (labels were black → white, bg → dark),
  // mid-tones turn red (roads), and everything bright snaps to white.
  const imageData = ctx.getImageData(0, 0, W, H);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i] / 255;
    const g = d[i + 1] / 255;
    const b = d[i + 2] / 255;
    const l = 0.299 * r + 0.587 * g + 0.114 * b;
    const inv = 1 - l;
    let whiteness = (inv - 0.55) / 0.3;
    if (whiteness < 0) whiteness = 0;
    if (whiteness > 1) whiteness = 1;
    let rr = Math.min(1, inv * 1.4) * (1 - whiteness) + whiteness;
    let gg = inv * 0.5 * (1 - whiteness) + whiteness;
    let bb = inv * 0.46 * (1 - whiteness) + whiteness;
    d[i] = Math.round(rr * 255);
    d[i + 1] = Math.round(gg * 255);
    d[i + 2] = Math.round(bb * 255);
  }
  ctx.putImageData(imageData, 0, 0);

  // --- marker: glowing dot at the venue, sigil hovering above it ---
  const mx = W / 2;
  const my = H / 2;

  ctx.save();
  ctx.shadowColor = "rgba(255,6,6,0.95)";
  ctx.shadowBlur = 22;
  ctx.fillStyle = "#ff0606";
  ctx.beginPath();
  ctx.arc(mx, my, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.shadowColor = "rgba(255,6,6,0.85)";
  ctx.shadowBlur = 26;
  drawSigil(ctx, mx, my - 78, 150);
  ctx.restore();

  const WEB_OUT = path.resolve(__dirname, "../../public/maps/velodrome.png");
  const PRINT_OUT = path.resolve(__dirname, "assets/map-bellville.png");
  fs.mkdirSync(path.dirname(WEB_OUT), { recursive: true });
  fs.mkdirSync(path.dirname(PRINT_OUT), { recursive: true });
  const png = canvas.toBuffer("image/png");
  fs.writeFileSync(WEB_OUT, png);
  fs.writeFileSync(PRINT_OUT, png);
  console.log(`Wrote ${WEB_OUT} and ${PRINT_OUT} (${W}x${H}, z${ZOOM}+${ZOOM_IN}, ${N}x${N} tiles)`);
};

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
