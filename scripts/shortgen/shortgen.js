#!/usr/bin/env node
/* MeyGOD Short generator — mobile-exact matrix rain loop.
   Default: transparent background, matrix rain only (1080x1920, 60fps).
   Flags:
       --still          single PNG instead of video (default 1819x2551 — A5 + 3mm bleed @ 300dpi)
       --w=N --h=N      canvas size override (px)
       --with-sigil      overlay the sigil (black background implied)
       --with-text       overlay "Mey GOD" brand name
       --opaque          black background instead of transparent
       --zoom=N          zoom factor for the rain (default 4 — mobile scale)
       --seconds=N       clip length (default 12)
       --out=file        output path (default meygod-matrix-loop.mov / meygod-matrix-still.png)
*/

const { createCanvas, GlobalFonts, Path2D } = require("@napi-rs/canvas");
const { spawn } = require("child_process");
const fs = require("fs");

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name, dflt) => {
  const a = args.find((x) => x.startsWith(`--${name}=`));
  return a ? a.slice(name.length + 3) : dflt;
};

const STILL = flag("still");
const W = parseInt(value("w", STILL ? "1819" : "1080"), 10);
const H = parseInt(value("h", STILL ? "2551" : "1920"), 10);
const FPS = 60; // match the site's animation timing exactly

// These match MatrixBackground.tsx defaults (mobile: speed 0.4)
const ZOOM = parseFloat(value("zoom", "4"));
const FONT_SIZE = 16 * ZOOM;
const SPEED = 0.4;
const COLOR = "#ff0606";

const SECONDS = parseInt(value("seconds", "12"), 10);
const FRAMES = FPS * SECONDS;
const WITH_SIGIL = flag("with-sigil");
const WITH_TEXT = flag("with-text");
const OPAQUE = flag("opaque");
const TRAILS = parseInt(value("trails", "0"), 10); // still mode: fixed trail length (0 = default 15-30)
const CODEC = value("codec", "png"); // png | prores | ffv1 | vp9
const OUT = value("out", STILL ? "meygod-matrix-still.png" : "meygod-matrix-loop.mov");

const FONT_PATHS = {
  matrix: "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
  logo: "/home/annekin/.local/share/fonts/chakra-petch/ChakraPetch-Bold.ttf",
  god: "/home/annekin/workspace/meygod/public/fonts/RuthlessWreckinOne-7YlK.ttf",
};

for (const [name, p] of Object.entries(FONT_PATHS)) {
  if (fs.existsSync(p)) GlobalFonts.registerFromPath(p, name);
}

const CHARS =
  "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";

/* --- sigil (only used with --with-sigil) --- */
const SIGIL_W = 280;
const SIGIL_H = SIGIL_W * (155.72475 / 200.56923);
const SIGIL_X = (W - SIGIL_W) / 2;
const SIGIL_Y = (H - SIGIL_H) / 2 - 120;
const SIGIL_SCALE = SIGIL_W / 200.56923;

const P1 =
  "m426.49541,20.513477c-2.53292,0.177108-4.81223,1.601364-6.0818,3.800284l-52.93268,91.681229-39.703,68.76789c-2.93967,5.09188,0.73505,11.45661,6.61458,11.45667h105.86485,79.40601c5.87953,-0.00006,9.55425,-6.36479,6.61458,-11.45667l-52.93217-91.681223-39.703-68.767896c-1.46009-2.528918-4.23433-4.003991-7.14737-3.800284z";
const P2 =
  "m443.77817,127.45559c10.89456,-0.0294,21.77374,0.33291,24.9048,1.10024,18.16066,4.45082,35.71071,13.53969,47.98578,24.85243,8.87021,8.17481,15.22133,14.18661,16.21657,15.34937,2.27217,2.65448,3.21392,6.04251,2.29266,8.24739-0.48701,1.16559-8.37889,9.64325-17.45503,18.75132-6.49799,6.52082-11.77836,9.84655-23.09636,14.5445-2.43619,1.01128-8.55867,3.59204-13.60505,5.73526-5.04636,2.14322-10.71996,4.40195-12.60865,5.0198l-13.80922,3.00538c-3.83618,0.48165-13.15748,0.64819-17.24367,0.30803-7.65437,-0.63718-17.39936,-2.6625-24.94182,-5.1824-14.40438,-4.81246-26.96098,-11.29515-36.43673,-18.81095-2.63565,-2.09048-13.55541,-12.206-19.18402,-17.77121-2.76668,-2.73554-4.34874,-5.49272-4.61149,-8.03873-0.231,-2.2383,0.26498,-3.06562,3.73616,-6.23205,1.59134,-1.45165,4.70534,-4.84775,6.91952,-7.54642,6.74191,-8.21714,9.10658,-10.11388,20.73231,-16.62942,18.29568,-10.25362,23.48708,-12.53282,35.20639,-15.45595,3.19292,-0.79635,14.10326,-1.21717,24.99785,-1.24659z";
const P3 =
  "m443.83289,135.23244c-22.51598-0.00004-40.76826,18.25286-40.76821,40.76884-0.00001,22.51597,18.25225,40.76887,40.76821,40.76883,22.51558-0.00053,40.76824-18.25326,40.76824-40.76883,0.00002-22.51557-18.25266-40.76832-40.76824-40.76884z";

const path1Top = new Path2D(P1);
const path1Bottom = new Path2D(P1);
const path2 = new Path2D(P2);
const path3 = new Path2D(P3);

/* --- matrix state, copied from MatrixBackground.tsx (made periodic for a seamless loop) --- */
const chars = CHARS.split("");
const rand = (n) => Math.floor(Math.random() * n);

const createColumn = (x) => {
  const length = STILL && TRAILS > 0 ? TRAILS : 15 + rand(15);
  // per-frame speed in px, matching the site's formula: (0.5+rand*0.5)*SPEED*FONT_SIZE*0.5
  const v = (0.5 + Math.random() * 0.5) * SPEED * FONT_SIZE * 0.5;
  if (STILL) {
    // no loop needed: random start position, trails reach steady state in warmup
    return {
      x,
      y: Math.random() * H,
      v,
      seed: rand(1 << 30),
      length,
    };
  }
  // periodic wrap: after FRAMES frames the column must return to its start,
  // so v*FRAMES = m*P for integer m, with P >= H + trail length (wrap off-screen)
  const minP = H + length * FONT_SIZE;
  const m = Math.max(1, Math.floor((v * FRAMES) / minP));
  const P = (v * FRAMES) / m;
  return {
    x,
    y: Math.random() * P,
    v,
    P,
    seed: rand(1 << 30),
    length,
  };
};

const columnWidth = FONT_SIZE;
const columnCount = Math.ceil(W / columnWidth);
const MULTI = parseInt(value("multi", "1"), 10); // still mode: streams per column
const columns = STILL
  ? Array.from({ length: columnCount * MULTI }, (_, i) => {
      const base = Math.floor(i / MULTI) * columnWidth;
      const jitter = Math.floor((Math.random() - 0.5) * columnWidth);
      return createColumn(base + jitter);
    })
  : Array.from({ length: columnCount }, (_, i) =>
      createColumn(i * columnWidth)
    );

const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

// previous-frame canvas for the trail fade (drawImage keeps RGB clean,
// unlike destination-out which corrupts low-alpha pixels)
const prevCanvas = createCanvas(W, H);
const prevCtx = prevCanvas.getContext("2d");

const hexToRgb = (hex) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? {
        r: parseInt(m[1], 16),
        g: parseInt(m[2], 16),
        b: parseInt(m[3], 16),
      }
    : { r: 255, g: 6, b: 6 };
};
const rgb = hexToRgb(COLOR);

const render = (t) => {
  // fade previous frame: black overlay for opaque, alpha fade for transparent
  if (OPAQUE) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.85;
    ctx.drawImage(prevCanvas, 0, 0);
    ctx.globalAlpha = 1;
  } else {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 0.85;
    ctx.drawImage(prevCanvas, 0, 0);
    ctx.globalAlpha = 1;
  }

  ctx.font = `${FONT_SIZE}px matrix`;

  for (const column of columns) {
    column.y += column.v;
    if (STILL) {
      if (column.y - column.length * FONT_SIZE > H) column.y = -FONT_SIZE;
    } else if (column.y >= column.P) column.y -= column.P;

    for (let i = 0; i < column.length; i++) {
      const charY = column.y - i * FONT_SIZE;

      if (charY < -FONT_SIZE || charY > H + FONT_SIZE) continue;

      const opacity = i === 0 ? 1 : Math.max(0, 1 - i / column.length);

      if (i === 0) {
        ctx.fillStyle = `rgba(${Math.min(255, rgb.r + 150)}, ${Math.min(255, rgb.g + 150)}, ${Math.min(255, rgb.b + 150)}, ${opacity})`;
        ctx.shadowColor = COLOR;
        ctx.shadowBlur = STILL ? 0 : 10 * ZOOM;
      } else {
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.5})`;
        ctx.shadowBlur = 0;
      }

      // deterministic glyph per trail position: flickers as it falls (like the
      // site's mutation) but is a pure function of position → seamless loop
      const cyc = Math.floor(charY / (FONT_SIZE * 4));
      const gi =
        Math.abs(Math.imul(column.seed + i * 31 + cyc * 17, 2654435761)) %
        chars.length;

      ctx.fillText(chars[gi], column.x, charY);
    }

    ctx.shadowBlur = 0;
  }

  if (WITH_SIGIL) {
    const glow = 30 + Math.sin((t * 2 * Math.PI) / FRAMES) * 15;
    ctx.save();
    ctx.translate(SIGIL_X, SIGIL_Y);
    ctx.scale(SIGIL_SCALE, SIGIL_SCALE);
    ctx.translate(0, -20);
    ctx.shadowColor = "#ff0606";
    ctx.shadowBlur = glow;
    ctx.fillStyle = "#ff0606";

    ctx.save();
    ctx.translate(-341.95552, -53.816747);
    ctx.save();
    ctx.translate(15.212189, 33.321951);
    ctx.fill(path1Top);
    ctx.restore();
    ctx.save();
    ctx.transform(1, 0, 0, -1, 15.212195, 311.16649);
    ctx.fill(path1Bottom);
    ctx.restore();
    ctx.fillStyle = "#ffffff";
    ctx.fill(path2);
    ctx.fillStyle = "#0d0303";
    ctx.fill(path3);
    ctx.restore();

    ctx.restore();
  }

  if (WITH_TEXT) {
    const y = H - 220;
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "bold 110px logo";
    ctx.fillStyle = "#ffe2e2";
    ctx.shadowColor = "rgba(255,255,255,0.4)";
    ctx.shadowBlur = 30;
    ctx.fillText("Mey", W / 2 - 90, y);
    ctx.font = "110px god";
    ctx.fillStyle = "#ff0606";
    ctx.shadowColor = "rgba(255,6,6,0.6)";
    ctx.shadowBlur = 40;
    ctx.fillText("GOD", W / 2 + 90, y);
    ctx.restore();
  }

  // snapshot for next frame's fade
  prevCtx.clearRect(0, 0, W, H);
  prevCtx.drawImage(canvas, 0, 0);
};

if (OPAQUE) {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, W, H);
}

if (STILL) {
  // warmup: render silently so ghost trails reach steady state
  for (let i = 0; i < 60; i++) render(0);
  render(0);
  const png = canvas.toBuffer("image/png");
  fs.writeFileSync(OUT, png);
  const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
  console.log(`Done: ${OUT} (${W}x${H}, ${kb} KB, still frame)`);
  process.exit(0);
}

// warmup: render a full loop silently so ghost trails reach steady state,
// making frame 0 visually identical to frame N (seamless loop)
for (let i = 0; i < FRAMES; i++) render(0);

const ffmpegArgs = [
  "-y",
  "-loglevel", "error",
  "-f", "rawvideo",
  "-pix_fmt", "rgba",
  "-s", `${W}x${H}`,
  "-r", String(FPS),
  "-i", "-",
  ...(CODEC === "prores"
    ? ["-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le"]
    : CODEC === "png"
      ? ["-c:v", "png", "-pix_fmt", "rgba"]
      : CODEC === "ffv1"
        ? ["-c:v", "ffv1", "-level", "3", "-pix_fmt", "rgba"]
        : [
          "-c:v", "libvpx-vp9",
          "-crf", "32",
          "-b:v", "0",
          "-pix_fmt", OPAQUE ? "yuv420p" : "yuva420p",
          "-row-mt", "1",
          "-cpu-used", "4",
        ]),
  OUT,
];

const ffmpeg = spawn("ffmpeg", ffmpegArgs, {
  stdio: ["pipe", "inherit", "inherit"],
});

let frame = 0;

const push = () => {
  if (frame >= FRAMES) {
    ffmpeg.stdin.end();
    return;
  }
  render(frame);
  frame++;
  const img = ctx.getImageData(0, 0, W, H);
  if (!ffmpeg.stdin.write(Buffer.from(img.data))) {
    ffmpeg.stdin.once("drain", push);
  } else {
    setImmediate(push);
  }
};

ffmpeg.on("exit", (code) => {
  if (code === 0) {
    const mb = (fs.statSync(OUT).size / 1048576).toFixed(1);
    console.log(`Done: ${OUT} (${FRAMES} frames, ${SECONDS}s, ${mb} MB)`);
  } else {
    console.error(`ffmpeg exited with code ${code}`);
  }
  process.exit(code ?? 1);
});

const mode = OPAQUE ? "opaque" : "transparent";
console.log(
  `Rendering ${FRAMES} frames (${SECONDS}s @ ${FPS}fps, ${ZOOM}x zoom) — ${mode}${WITH_SIGIL ? " + sigil" : ""}${WITH_TEXT ? " + text" : ""} → ${OUT}`
);
push();
