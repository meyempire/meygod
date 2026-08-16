#!/usr/bin/env node
/* MeyGOD flyer assets — sigil PNG + brand wordmark PNG (transparent, print-res).
   Usage: node assets.js --out=/path/to/dir
*/

const { createCanvas, GlobalFonts } = require("@napi-rs/canvas");
const { drawSigil } = require("./sigil");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const value = (name, dflt) => {
  const a = args.find((x) => x.startsWith(`--${name}=`));
  return a ? a.slice(name.length + 3) : dflt;
};
const OUT_DIR = path.resolve(value("out", "."));

fs.mkdirSync(OUT_DIR, { recursive: true });

const FONT_PATHS = {
  logo: "/home/annekin/.local/share/fonts/chakra-petch/ChakraPetch-Bold.ttf",
  god: "/home/annekin/workspace/meygod/public/fonts/RuthlessWreckinOne-7YlK.ttf",
};

for (const [name, p] of Object.entries(FONT_PATHS)) {
  if (fs.existsSync(p)) GlobalFonts.registerFromPath(p, name);
}

/* ---------- sigil ---------- */

const SIGIL_W = 3000;

const sigilCanvas = createCanvas(SIGIL_W, Math.round(SIGIL_W * (155.72475 / 200.56923)));
const sctx = sigilCanvas.getContext("2d");
drawSigil(sctx, SIGIL_W / 2, (SIGIL_W * (155.72475 / 200.56923)) / 2, SIGIL_W);

fs.writeFileSync(path.join(OUT_DIR, "sigil.png"), sigilCanvas.toBuffer("image/png"));
console.log(`sigil.png (${SIGIL_W}x${Math.round(SIGIL_W * (155.72475 / 200.56923))})`);

/* ---------- wordmark ---------- */

const FONT = 500;
const GAP = 60;

const measure = () => {
  const c = createCanvas(10, 10);
  const t = c.getContext("2d");
  t.font = `700 ${FONT}px logo`;
  const meyW = t.measureText("Mey").width;
  t.font = `${FONT}px god`;
  const godW = t.measureText("GOD").width;
  return { meyW, godW };
};

const { meyW, godW } = measure();
const PAD = 120;
const W = Math.ceil(meyW + GAP + godW + PAD * 2);
const H = Math.ceil(FONT * 1.6);

const wCanvas = createCanvas(W, H);
const wctx = wCanvas.getContext("2d");

const baseline = FONT * 0.95 + 60;

wctx.font = `700 ${FONT}px logo`;
wctx.fillStyle = "#ffe2e2";
wctx.shadowColor = "rgba(255,255,255,0.4)";
wctx.shadowBlur = 40;
wctx.fillText("Mey", PAD, baseline);

wctx.font = `${FONT}px god`;
wctx.fillStyle = "#ff0606";
wctx.shadowColor = "rgba(255,6,6,0.6)";
wctx.shadowBlur = 60;
wctx.fillText("GOD", PAD + meyW + GAP, baseline);

fs.writeFileSync(
  path.join(OUT_DIR, "brand-meygod.png"),
  wCanvas.toBuffer("image/png")
);
console.log(`brand-meygod.png (${W}x${H})`);
