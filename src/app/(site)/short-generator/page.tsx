"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const W = 1080;
const H = 1920;
const FONT_SIZE = 20;
const RECORD_SECONDS = 12;

const CHARS =
  "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";

const SIGIL_W = 280;
const SIGIL_H = SIGIL_W * (234 / 301);
const SIGIL_X = (W - SIGIL_W) / 2;
const SIGIL_Y = (H - SIGIL_H) / 2 - 120;

const SIGIL_URL =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="301" height="234" viewBox="0 20 200.56923 155.72475">' +
      '<g transform="translate(-341.95552,-53.816747)">' +
      '<g transform="translate(15.212189,33.321951)" fill="#ff0606">' +
      '<path d="m426.49541,20.513477c-2.53292,0.177108-4.81223,1.601364-6.0818,3.800284l-52.93268,91.681229-39.703,68.76789c-2.93967,5.09188,0.73505,11.45661,6.61458,11.45667h105.86485,79.40601c5.87953,-0.00006,9.55425,-6.36479,6.61458,-11.45667l-52.93217-91.681223-39.703-68.767896c-1.46009-2.528918-4.23433-4.003991-7.14737-3.800284z"/>' +
      "</g>" +
      '<g transform="matrix(1,0,0,-1,15.212195,311.16649)" fill="#ff0606">' +
      '<path d="m426.49541,20.513477c-2.53292,0.177108-4.81223,1.601364-6.0818,3.800284l-52.93268,91.681229-39.703,68.76789c-2.93967,5.09188,0.73505,11.45661,6.61458,11.45667h105.86485,79.40601c5.87953,-0.00006,9.55425,-6.36479,6.61458,-11.45667l-52.93217-91.681223-39.703-68.767896c-1.46009-2.528918-4.23433-4.003991-7.14737-3.800284z"/>' +
      "</g>" +
      '<path fill="#ffffff" d="m443.77817,127.45559c10.89456,-0.0294,21.77374,0.33291,24.9048,1.10024,18.16066,4.45082,35.71071,13.53969,47.98578,24.85243,8.87021,8.17481,15.22133,14.18661,16.21657,15.34937,2.27217,2.65448,3.21392,6.04251,2.29266,8.24739-0.48701,1.16559-8.37889,9.64325-17.45503,18.75132-6.49799,6.52082-11.77836,9.84655-23.09636,14.5445-2.43619,1.01128-8.55867,3.59204-13.60505,5.73526-5.04636,2.14322-10.71996,4.40195-12.60865,5.0198l-13.80922,3.00538c-3.83618,0.48165-13.15748,0.64819-17.24367,0.30803-7.65437-0.63718-17.39936-2.6625-24.94182-5.1824-14.40438-4.81246-26.96098-11.29515-36.43673-18.81095-2.63565-2.09048-13.55541-12.206-19.18402-17.77121-2.76668-2.73554-4.34874-5.49272-4.61149-8.03873-0.231-2.2383,0.26498-3.06562,3.73616-6.23205,1.59134-1.45165,4.70534-4.84775,6.91952-7.54642,6.74191-8.21714,9.10658-10.11388,20.73231-16.62942,18.29568-10.25362,23.48708-12.53282,35.20639-15.45595,3.19292-0.79635,14.10326-1.21717,24.99785-1.24659z"/>' +
      '<path fill="#0d0303" d="m443.83289,135.23244c-22.51598-0.00004-40.76826,18.25286-40.76821,40.76884-0.00001,22.51597,18.25225,40.76887,40.76821,40.76883,22.51558-0.00053,40.76824-18.25326,40.76824-40.76883,0.00002-22.51557-18.25266-40.76832-40.76824-40.76884z"/>' +
      "</g>" +
      "</svg>"
  );

interface Column {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  length: number;
}

function newColumn(x: number): Column {
  return {
    x,
    y: Math.random() * -H - 200,
    speed: 0.5 + Math.random() * 0.5,
    chars: Array.from(
      { length: 25 },
      () => CHARS[Math.floor(Math.random() * CHARS.length)]
    ),
    length: 15 + Math.floor(Math.random() * 15),
  };
}

export default function ShortGeneratorPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sigilImgRef = useRef<HTMLImageElement | null>(null);
  const columnsRef = useRef<Column[]>([]);
  const frameRef = useRef(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const showBrandRef = useRef(true);
  const recordingRef = useRef(false);
  const startTimeRef = useRef(0);

  const [showBrandName, setShowBrandName] = useState(true);
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState("Click the sigil to record a loop");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      sigilImgRef.current = img;
    };
    img.src = SIGIL_URL;

    columnsRef.current = Array.from(
      { length: Math.ceil(W / FONT_SIZE) },
      (_, i) => newColumn(i * FONT_SIZE)
    );

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);

    let t = 0;
    const animate = () => {
      t++;

      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, W, H);
      ctx.font = `${FONT_SIZE}px monospace`;

      for (const col of columnsRef.current) {
        col.y += col.speed * FONT_SIZE * 0.48;

        for (let i = 0; i < col.length; i++) {
          const cy = col.y - i * FONT_SIZE;
          if (cy < -FONT_SIZE || cy > H + FONT_SIZE) continue;
          const alpha = i === 0 ? 1 : Math.max(0, 1 - i / col.length);

          if (i === 0) {
            ctx.fillStyle = `rgba(255,${160 + Math.floor(Math.random() * 40)},${20 + Math.floor(Math.random() * 25)},${alpha})`;
            ctx.shadowColor = "#ff0606";
            ctx.shadowBlur = 12;
          } else {
            ctx.fillStyle = `rgba(255,6,6,${alpha * 0.35})`;
            ctx.shadowBlur = 0;
          }

          if (Math.random() < 0.018) {
            col.chars[i % col.chars.length] =
              CHARS[Math.floor(Math.random() * CHARS.length)];
          }

          ctx.fillText(col.chars[i % col.chars.length], col.x, cy);
        }
        ctx.shadowBlur = 0;

        if (col.y - col.length * FONT_SIZE > H + 200) {
          col.y = Math.random() * -H * 0.3 - 200;
          col.speed = 0.5 + Math.random() * 0.5;
          col.length = 15 + Math.floor(Math.random() * 15);
        }
      }

      const sigil = sigilImgRef.current;
      if (sigil) {
        const glow = 30 + Math.sin(t * 0.03) * 15;
        ctx.save();
        ctx.shadowColor = "#ff0606";
        ctx.shadowBlur = glow;
        ctx.drawImage(sigil, SIGIL_X, SIGIL_Y, SIGIL_W, SIGIL_H);
        ctx.restore();
      }

      if (showBrandRef.current) {
        const y = H - 220;
        ctx.save();
        ctx.textAlign = "center";

        ctx.font = "bold 110px 'Chakra Petch', sans-serif";
        ctx.fillStyle = "#ffe2e2";
        ctx.shadowColor = "rgba(255,255,255,0.4)";
        ctx.shadowBlur = 30;
        ctx.fillText("Mey", W / 2 - 90, y);

        ctx.font = "110px 'Ruthless Wreckin', sans-serif";
        ctx.fillStyle = "#ff0606";
        ctx.shadowColor = "rgba(255,6,6,0.6)";
        ctx.shadowBlur = 40;
        ctx.fillText("GOD", W / 2 + 90, y);

        ctx.restore();
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const handleToggle = (checked: boolean) => {
    showBrandRef.current = checked;
    setShowBrandName(checked);
  };

  const stop = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    recordingRef.current = false;
    setRecording(false);
    setStatus("Processing...");
  }, []);

  const start = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const stream = canvas.captureStream(30);
    const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";

    chunksRef.current = [];
    const recorder = new MediaRecorder(stream, { mimeType: mime });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = showBrandRef.current
        ? "meygod-loop.webm"
        : "meygod-loop-notext.webm";
      a.click();
      URL.revokeObjectURL(url);
      setStatus("Done. Click sigil to record again.");
    };

    recorder.start();
    recorderRef.current = recorder;
    recordingRef.current = true;
    setRecording(true);
    startTimeRef.current = Date.now();
    setStatus(`Recording ${RECORD_SECONDS}s...`);

    setTimeout(() => {
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
        recordingRef.current = false;
        setRecording(false);
      }
    }, RECORD_SECONDS * 1000);
  }, []);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const sx = W / rect.width;
      const sy = H / rect.height;
      const x = (e.clientX - rect.left) * sx;
      const y = (e.clientY - rect.top) * sy;

      if (
        x >= SIGIL_X &&
        x <= SIGIL_X + SIGIL_W &&
        y >= SIGIL_Y &&
        y <= SIGIL_Y + SIGIL_H
      ) {
        if (recordingRef.current) {
          stop();
        } else {
          start();
        }
      }
    },
    [start, stop]
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="max-h-full max-w-full object-contain cursor-pointer select-none"
        style={{ aspectRatio: "1080/1920" }}
      />

      <div className="absolute top-4 right-4 z-10">
        <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showBrandName}
            onChange={(e) => handleToggle(e.target.checked)}
            className="accent-[#ff0606] w-4 h-4"
          />
          Show &ldquo;Mey GOD&rdquo;
        </label>
      </div>

      {recording && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff0606] animate-pulse" />
          <span className="text-sm text-white/80 font-mono tabular-nums">
            REC
          </span>
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/40 select-none">
        {status}
      </div>
    </div>
  );
}
