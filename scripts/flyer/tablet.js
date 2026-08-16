#!/usr/bin/env node
/* MeyGOD stone tablet — transparent A5+bleed canvas (1819x2551) with a carved
   stone-slab look: dark red-tinted gradient, mottling, grain at two scales,
   beveled inner edge, soft red outer glow. No text — the word is added in GIMP.
   Usage: node tablet.js --out=/path/tablet-a5.png --margin=110 --radius=48 --seed=1
   Also exported: drawTablet(ctx, x, y, w, h, radius, seed) for other scripts.
*/

const { createCanvas } = require("@napi-rs/canvas");
const fs = require("fs");
const path = require("path");

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function roundRectPath(ctx, x, y, w, h, r) {
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
}

function makeNoise(createCanvas, size, alpha, rand) {
  const c = createCanvas(size, size);
  const t = c.getContext("2d");
  const img = t.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.floor(rand() * 255);
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = Math.floor(rand() * alpha);
  }
  t.putImageData(img, 0, 0);
  return c;
}

function drawTablet(ctx, x, y, w, h, radius = 48, seed = 1) {
  const rand = mulberry32(seed);

  // body fill with soft red outer glow
  ctx.save();
  ctx.shadowColor = "rgba(255,6,6,0.12)";
  ctx.shadowBlur = 150;
  const body = ctx.createLinearGradient(0, y, 0, y + h);
  body.addColorStop(0, "#1a0e0e");
  body.addColorStop(0.5, "#160a0a");
  body.addColorStop(1, "#110707");
  ctx.fillStyle = body;
  roundRectPath(ctx, x, y, w, h, radius);
  ctx.fill();
  ctx.restore();

  // texture inside the slab
  ctx.save();
  roundRectPath(ctx, x, y, w, h, radius);
  ctx.clip();

  // mottling
  for (let i = 0; i < 90; i++) {
    const bx = x + rand() * w;
    const by = y + rand() * h;
    const br = 90 + rand() * 480;
    const light = rand() < 0.45;
    const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    g.addColorStop(
      0,
      light
        ? `rgba(255,120,120,${(0.04 + rand() * 0.06).toFixed(3)})`
        : `rgba(0,0,0,${(0.05 + rand() * 0.07).toFixed(3)})`
    );
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(bx - br, by - br, br * 2, br * 2);
  }

  // coarse grain
  const coarse = makeNoise(createCanvas, 256, 85, rand);
  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  ctx.globalAlpha = 0.65;
  for (let ty = y; ty < y + h; ty += 256) {
    for (let tx = x; tx < x + w; tx += 256) {
      ctx.drawImage(coarse, tx, ty);
    }
  }
  ctx.restore();

  // fine grain
  const fine = makeNoise(createCanvas, 512, 70, rand);
  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  ctx.globalAlpha = 0.8;
  for (let ty = y; ty < y + h; ty += 512) {
    for (let tx = x; tx < x + w; tx += 512) {
      ctx.drawImage(fine, tx, ty);
    }
  }
  ctx.restore();

  // carved edge
  ctx.strokeStyle = "rgba(255,226,226,0.07)";
  ctx.lineWidth = 3;
  roundRectPath(ctx, x + 4, y + 4, w - 8, h - 8, radius - 4);
  ctx.stroke();
  ctx.strokeStyle = "rgba(0,0,0,0.4)";
  ctx.lineWidth = 6;
  roundRectPath(ctx, x + 3, y + 3, w - 6, h - 6, radius - 3);
  ctx.stroke();

  // vignette
  const cx = x + w / 2;
  const cy = y + h / 2;
  const vig = ctx.createRadialGradient(cx, cy, Math.min(w, h) * 0.32, cx, cy, Math.max(w, h) * 0.72);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = vig;
  ctx.fillRect(x, y, w, h);

  // top inner shadow
  const inner = ctx.createLinearGradient(0, y, 0, y + 150);
  inner.addColorStop(0, "rgba(0,0,0,0.45)");
  inner.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = inner;
  ctx.fillRect(x, y, w, 150);

  ctx.restore();

  // border
  ctx.strokeStyle = "#2a1515";
  ctx.lineWidth = 6;
  roundRectPath(ctx, x, y, w, h, radius);
  ctx.stroke();
}

module.exports = { drawTablet, roundRectPath };

if (require.main === module) {
  const args = process.argv.slice(2);
  const value = (name, dflt) => {
    const a = args.find((x) => x.startsWith(`--${name}=`));
    return a ? a.slice(name.length + 3) : dflt;
  };

  const OUT = path.resolve(value("out", "tablet-a5.png"));
  const W = 1819;
  const H = 2551;
  const MARGIN = parseInt(value("margin", "110"), 10);
  const RADIUS = parseFloat(value("radius", "48"));
  const SEED = parseInt(value("seed", "1"), 10);

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  drawTablet(ctx, MARGIN, MARGIN, W - 2 * MARGIN, H - 2 * MARGIN, RADIUS, SEED);

  fs.writeFileSync(OUT, canvas.toBuffer("image/png"));
  console.log(
    `Done: ${OUT} (${W}x${H}, tablet ${W - 2 * MARGIN}x${H - 2 * MARGIN} at ${MARGIN}px margin, radius ${RADIUS}, seed ${SEED})`
  );
}
