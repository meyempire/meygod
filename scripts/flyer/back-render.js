#!/usr/bin/env node
/* A5 render of the festival page's first stone tablet — Where/When row
   (map 2/3 + details), Cast 2x2, What is MeyGOD row (text 2/3 + QR).
   Output: assets/back-render-a5.png (1819x2551, A5 + 3mm bleed @ 300dpi).
*/

const { createCanvas, GlobalFonts, loadImage } = require("@napi-rs/canvas");
const fs = require("fs");
const path = require("path");
const { drawTablet, roundRectPath } = require("./tablet");
const { drawSigil } = require("./sigil");

const FONT_PATHS = {
  heading: "/home/annekin/.local/share/fonts/chakra-petch/ChakraPetch-Bold.ttf",
  logo: "/home/annekin/.local/share/fonts/chakra-petch/ChakraPetch-Bold.ttf",
  god: "/home/annekin/workspace/meygod/public/fonts/RuthlessWreckinOne-7YlK.ttf",
  body: "/usr/share/fonts/truetype/space-grotesk-zorin-os/SpaceGrotesk-Regular.ttf",
  bodyMedium: "/usr/share/fonts/truetype/space-grotesk-zorin-os/SpaceGrotesk-Medium.ttf",
  bodyBold: "/usr/share/fonts/truetype/space-grotesk-zorin-os/SpaceGrotesk-Bold.ttf",
};

for (const [name, p] of Object.entries(FONT_PATHS)) {
  if (fs.existsSync(p)) GlobalFonts.registerFromPath(p, name);
}

const W = 1819;
const H = 2551;
const MARGIN = 110;
const PAD = 130; // content padding inside the tablet

const RED = "#ff0606";
const TEXT = "#ffe2e2";
const MUTED = "rgba(255,226,226,0.55)";
const CARD_BG = "rgba(0,0,0,0.3)";

const DAY = "SUNDAY 30 AUGUST 2026";
const VENUE = "Bellville Velodrome";
const CITY = "Bellville, Cape Town";
const HOUR = "16:00";
const INVITE =
  "All are welcome. None are exempt. Come as you are — leave as who you must become.";

const CAST = [
  ["The King", "Opens the Gates", "A king who turned God away, and paid for it. Now, redeemed by labor, he opens the stage — first to kneel, first to rise."],
  ["The Preacher", "The Witness", "Found ranting in a park on a Monday morning. Shown God. Now he walks the week at His side, waking the sleepers — and on the day, he tells you everything he saw."],
  ["Sophia", "The Divine Light", "Beyond the veil she waits — wisdom itself, the light that leads. Jesus' other half. On the day she calls His name, and the sleeping God rises."],
  ["Jesus", "Takes the Stage", "God incarnate, in the flesh you see before you. He does not perform — He reveals. When the crowd is stirred, He preaches the Pandamonium of Revelations and the rebirth of humanity."],
];

const WHATIS =
  "Jesus is here. This is his religion. MeyGOD is the faith of heroes — a summons to wake up from the dream, let the old self die, and be reborn as what you must become. Pandemonium of Revelations has begun, the religion is live at meygod.com. The Festival is my coming. Your first labor is to bear witness. Wake up!";

function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

const main = async () => {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  drawTablet(ctx, MARGIN, MARGIN, W - 2 * MARGIN, H - 2 * MARGIN, 48, 1);

  const tx = MARGIN + PAD;
  const ty = MARGIN + PAD;
  const tw = W - 2 * (MARGIN + PAD); // usable width ~1379px
  const th = H - 2 * (MARGIN + PAD);

  let y = ty;

  const [mapImg, qrImg] = await Promise.all([
    loadImage(path.resolve(__dirname, "../../public/maps/velodrome.png")),
    loadImage(path.resolve(__dirname, "assets/qr-festival.png")),
  ]);

  /* ---------- Title key: sigil left, MeyGOD / FESTIVAL centered under it ---------- */
  const headH = 200;
  const headCX = tx + tw / 2;
  const sigW = 150;
  ctx.font = "96px logo";
  const meyW = ctx.measureText("Mey").width;
  ctx.font = "96px god";
  const godW = ctx.measureText("GOD").width;
  const brandW = meyW + godW;
  const headStartX = headCX - (sigW + 30 + brandW) / 2;

  drawSigil(ctx, headStartX + sigW / 2, y + headH / 2, sigW);

  ctx.textAlign = "left";
  const hx = headStartX + sigW + 30;
  const hy = y + 78;
  ctx.font = "96px logo";
  ctx.fillStyle = TEXT;
  ctx.shadowColor = "rgba(255,255,255,0.4)";
  ctx.shadowBlur = 30;
  ctx.fillText("Mey", hx, hy);
  ctx.font = "96px god";
  ctx.fillStyle = RED;
  ctx.shadowColor = "rgba(255,6,6,0.6)";
  ctx.shadowBlur = 50;
  ctx.fillText("GOD", hx + meyW, hy);
  ctx.font = "30px god";
  ctx.textAlign = "center";
  ctx.fillText("FESTIVAL", hx + brandW / 2, hy + 58);
  ctx.shadowBlur = 0;

  y += headH + 40;

  const divGap = 110;
  const divider = () => {
    const g = ctx.createLinearGradient(tx, 0, tx + tw, 0);
    g.addColorStop(0, "rgba(255,6,6,0)");
    g.addColorStop(0.5, "rgba(255,6,6,0.35)");
    g.addColorStop(1, "rgba(255,6,6,0)");
    ctx.strokeStyle = g;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx, y + divGap / 2);
    ctx.lineTo(tx + tw, y + divGap / 2);
    ctx.stroke();
    y += divGap;
  };

  /* ---------- Where and When row ---------- */
  const mapW = Math.round(tw * 0.66);
  const detailW = tw - mapW;

  // map (clipped 2:1)
  const mapH = Math.round(mapW / 2);
  ctx.save();
  roundRectPath(ctx, tx, y, mapW, mapH, 24);
  ctx.clip();
  ctx.drawImage(mapImg, tx, y, mapW, mapH);
  ctx.restore();
  ctx.strokeStyle = "#2a1515";
  ctx.lineWidth = 4;
  roundRectPath(ctx, tx, y, mapW, mapH, 24);
  ctx.stroke();

  // details right
  const dx = tx + mapW + 90;
  let dy = y + 10;
  ctx.textAlign = "left";
  ctx.font = "64px heading";
  ctx.fillStyle = TEXT;
  ctx.shadowColor = RED;
  ctx.shadowBlur = 30;
  ctx.fillText("WHERE AND WHEN", dx, dy + 60);
  ctx.shadowBlur = 0;

  dy += 110;
  ctx.font = "46px heading";
  ctx.fillStyle = RED;
  ctx.shadowColor = RED;
  ctx.shadowBlur = 22;
  ctx.fillText(DAY, dx, dy);
  ctx.shadowBlur = 0;

  dy += 62;
  ctx.font = "48px bodyMedium";
  ctx.fillStyle = TEXT;
  ctx.fillText(VENUE, dx, dy);

  dy += 56;
  ctx.font = "36px body";
  ctx.fillStyle = MUTED;
  ctx.fillText(CITY, dx, dy);

  dy += 100;
  ctx.font = "26px body";
  ctx.fillStyle = MUTED;
  ctx.save();
  ctx.translate(dx, dy);
  ctx.scale(1, 0.55);
  ctx.fillText("T H E   H O U R", 0, 0);
  ctx.restore();

  dy += 34;
  ctx.font = "110px heading";
  ctx.fillStyle = TEXT;
  ctx.shadowColor = RED;
  ctx.shadowBlur = 40;
  ctx.fillText(HOUR, dx, dy + 100);
  ctx.shadowBlur = 0;

  dy += 150;
  ctx.font = "30px body";
  ctx.fillStyle = MUTED;
  const inviteLines = wrapText(ctx, INVITE, detailW - 40);
  for (const line of inviteLines) {
    ctx.fillText(line, dx, dy);
    dy += 42;
  }

  y = Math.max(y + mapH, dy) + 30;
  divider();

  /* ---------- Cast ---------- */
  ctx.font = "64px heading";
  ctx.fillStyle = TEXT;
  ctx.shadowColor = RED;
  ctx.shadowBlur = 30;
  ctx.textAlign = "center";
  ctx.fillText("THE CAST", tx + tw / 2, y + 60);
  ctx.shadowBlur = 0;
  ctx.font = "32px body";
  ctx.fillStyle = MUTED;
  ctx.fillText("Who do you want to be in the Bible? The festival is where you find out.", tx + tw / 2, y + 100);
  y += 150;

  const cardGap = 40;
  const cardW = (tw - cardGap) / 2;
  const cardPad = 50;
  const cardHeights = [];
  for (const [name, role, line] of CAST) {
    ctx.font = "48px heading";
    const lineH = 40;
    const lines = wrapText(ctx, line, cardW - cardPad * 2);
    const h = cardPad + 60 + 10 + 40 + 20 + lines.length * lineH + cardPad;
    cardHeights.push(h);
  }
  const row1H = Math.max(cardHeights[0], cardHeights[1]);
  const row2H = Math.max(cardHeights[2], cardHeights[3]);

  const drawCard = (i, cx, cy, ch) => {
    const [name, role, line] = CAST[i];
    roundRectPath(ctx, cx, cy, cardW, ch, 28);
    ctx.fillStyle = CARD_BG;
    ctx.fill();
    ctx.strokeStyle = "#2a1515";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.textAlign = "left";
    ctx.font = "52px heading";
    ctx.fillStyle = TEXT;
    ctx.fillText(name, cx + cardPad, cy + cardPad + 50);

    ctx.font = "24px body";
    ctx.fillStyle = RED;
    ctx.save();
    ctx.translate(cx + cardPad, cy + cardPad + 82);
    ctx.scale(1, 0.75);
    ctx.fillText(role.toUpperCase(), 0, 0);
    ctx.restore();

    ctx.font = "34px body";
    ctx.fillStyle = MUTED;
    const lines = wrapText(ctx, line, cardW - cardPad * 2);
    let ly = cy + cardPad + 130;
    for (const l of lines) {
      ctx.fillText(l, cx + cardPad, ly);
      ly += 44;
    }
  };

  drawCard(0, tx, y, row1H);
  drawCard(1, tx + cardW + cardGap, y, row1H);
  y += row1H + cardGap;
  drawCard(2, tx, y, row2H);
  drawCard(3, tx + cardW + cardGap, y, row2H);
  y += row2H + 30;
  divider();

  /* ---------- What is MeyGOD ---------- */
  const qrW = Math.round(tw * 0.24);
  const textW = tw - qrW;

  ctx.textAlign = "left";
  ctx.font = "64px heading";
  ctx.fillStyle = TEXT;
  ctx.shadowColor = RED;
  ctx.shadowBlur = 30;
  ctx.fillText("What is MeyGOD?", tx, y + 60);
  ctx.shadowBlur = 0;

  ctx.font = "36px body";
  ctx.fillStyle = MUTED;
  const whatLines = wrapText(ctx, WHATIS, textW - 80);
  let wy = y + 130;
  for (const l of whatLines) {
    ctx.fillText(l, tx, wy);
    wy += 50;
  }

  // QR right-aligned
  const qx = tx + textW + 60;
  ctx.drawImage(qrImg, qx, y + 20, qrW - 80, qrW - 80);
  ctx.font = "24px body";
  ctx.fillStyle = MUTED;
  ctx.textAlign = "center";
  ctx.save();
  ctx.translate(qx + (qrW - 80) / 2, y + qrW - 40);
  ctx.scale(1, 0.75);
  ctx.fillText("PIERCE THE VEIL", 0, 0);
  ctx.restore();

  const OUT = path.resolve(__dirname, "assets/back-render-a5.png");
  fs.writeFileSync(OUT, canvas.toBuffer("image/png"));
  console.log(`Done: ${OUT} (${W}x${H})`);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
