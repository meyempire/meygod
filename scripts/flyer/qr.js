#!/usr/bin/env node
/* MeyGOD stylized QR — white rounded modules, red glow, sigil centered.
   Transparent PNG, error correction H, quiet zone 4.
   Finder patterns drawn as solid rings so scanners read them reliably.
   Usage: node qr.js --url=https://meygod.com/festival --out=/path/qr-festival.png
*/

const { createCanvas } = require("@napi-rs/canvas");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const { drawSigil } = require("./sigil");

const args = process.argv.slice(2);
const value = (name, dflt) => {
  const a = args.find((x) => x.startsWith(`--${name}=`));
  return a ? a.slice(name.length + 3) : dflt;
};

const URL = value("url", "https://meygod.com/festival");
const OUT = path.resolve(value("out", "qr-festival.png"));
const TARGET_PX = parseInt(value("px", "2000"), 10);
const SIGIL_MODULES = parseFloat(value("sigil", "12")); // 0 = no sigil

const qr = QRCode.create(URL, { errorCorrectionLevel: "H" });
const size = qr.modules.size;
const QUIET = 4;
const total = size + QUIET * 2;
const m = Math.floor(TARGET_PX / total);
const px = total * m;

const canvas = createCanvas(px, px);
const ctx = canvas.getContext("2d");

const isDark = (r, c) => qr.modules.get(r, c);

const roundRect = (x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

// finder: solid 7x7 outer ring + 3x3 center dot, light ring cut between
// (tr/tc = top-left module)
const drawFinder = (tr, tc) => {
  const x = (tc + QUIET) * m;
  const y = (tr + QUIET) * m;
  ctx.save();
  ctx.fillStyle = "#ffffff";
  roundRect(x, y, 7 * m, 7 * m, m * 1.4);
  ctx.fill();
  ctx.globalCompositeOperation = "destination-out";
  roundRect(x + m, y + m, 5 * m, 5 * m, m * 0.5);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
  roundRect(x + 2 * m, y + 2 * m, 3 * m, 3 * m, m * 0.3);
  ctx.fill();
  ctx.restore();
};

// alignment: solid 5x5 outer ring + 1x1 center dot (tr/tc = top-left module)
const drawAlignment = (tr, tc) => {
  const x = (tc + QUIET) * m;
  const y = (tr + QUIET) * m;
  ctx.save();
  ctx.fillStyle = "#ffffff";
  roundRect(x, y, 5 * m, 5 * m, m * 0.6);
  ctx.fill();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillRect(x + m, y + m, 3 * m, 3 * m);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillRect(x + 2 * m, y + 2 * m, m, m);
  ctx.restore();
};

const finderCenters = [
  [0, 0],
  [0, size - 7],
  [size - 7, 0],
];

// alignment pattern top-left (only one for version 4)
const alignmentCenters = [];
if (qr.version >= 2) {
  alignmentCenters.push([size - 9, size - 9]);
}

// finder rings first (no glow — keeps pattern signature crisp)
for (const [r, c] of finderCenters) drawFinder(r, c);
for (const [r, c] of alignmentCenters) drawAlignment(r, c);

// data modules: full size, gentle rounding, red glow
ctx.fillStyle = "#ffffff";
ctx.shadowColor = "rgba(255,6,6,0.6)";
ctx.shadowBlur = m * 0.2;

const inFinder = (r, c) =>
  (r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8);
const inAlignment = (r, c) =>
  alignmentCenters.some(([ar, ac]) => Math.abs(r - ar) <= 2 && Math.abs(c - ac) <= 2);

const inSigil = () => false; // draw over modules; EC H absorbs the sigil

for (let r = 0; r < size; r++) {
  for (let c = 0; c < size; c++) {
    if (!isDark(r, c)) continue;
    if (inFinder(r, c) || inAlignment(r, c) || inSigil(r, c)) continue;
    const x = (c + QUIET) * m;
    const y = (r + QUIET) * m;
    roundRect(x, y, m, m, m * 0.24);
    ctx.fill();
  }
}

// sigil centered — punched into the data region
if (SIGIL_MODULES > 0) {
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  drawSigil(ctx, px / 2, px / 2, m * SIGIL_MODULES);
}

fs.writeFileSync(OUT, canvas.toBuffer("image/png"));
console.log(
  `Done: ${OUT} (${px}x${px}, version ${qr.version}, EC H, ${size}x${size} modules + ${QUIET} quiet)`
);
