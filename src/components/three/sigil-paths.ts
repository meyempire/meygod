import * as THREE from "three";

export type PointTransform = (x: number, y: number) => [number, number];

export interface SigilPathData {
  d: string;
  transform: PointTransform;
}

// Geometry sourced from logo.svg (repo root). All path commands are relative
// (m/c/l/h/z); the transforms bake the SVG group transforms into absolute coords.

const TRIANGLE_D =
  "m 426.49541,20.513477 c -2.53292,0.177108 -4.81223,1.601364 -6.0818,3.800284 " +
  "l -52.93268,91.681229 -39.703,68.76789 c -2.93967,5.09188 0.73505,11.45661 6.61458,11.45667 " +
  "h 105.86485 79.40601 c 5.87953,-6e-5 9.55425,-6.36479 6.61458,-11.45667 " +
  "l -52.93217,-91.681223 -39.703,-68.767896 c -1.46009,-2.528918 -4.23433,-4.003991 -7.14737,-3.800284 z";

const EYE_D =
  "m 443.77817,127.45559 c 10.89456,-0.0294 21.77374,0.33291 24.9048,1.10024 " +
  "18.16066,4.45082 35.71071,13.53969 47.98578,24.85243 8.87021,8.17481 15.22133,14.18661 " +
  "16.21657,15.34937 2.27217,2.65448 3.21392,6.04251 2.29266,8.24739 -0.48701,1.16559 " +
  "-8.37889,9.64325 -17.45503,18.75132 -6.49799,6.52082 -11.77836,9.84655 -23.09636,14.5445 " +
  "-2.43619,1.01128 -8.55867,3.59204 -13.60505,5.73526 -5.04636,2.14322 -10.71996,4.40195 " +
  "-12.60865,5.0198 l -13.80922,3.00538 c -3.83618,0.48165 -13.15748,0.64819 -17.24367,0.30803 " +
  "-7.65437,-0.63718 -17.39936,-2.6625 -24.94182,-5.1824 -14.40438,-4.81246 -26.96098,-11.29515 " +
  "-36.43673,-18.81095 -2.63565,-2.09048 -13.55541,-12.206 -19.18402,-17.77121 -2.76668,-2.73554 " +
  "-4.34874,-5.49272 -4.61149,-8.03873 -0.231,-2.2383 0.26498,-3.06562 3.73616,-6.23205 " +
  "1.59134,-1.45165 4.70534,-4.84775 6.91952,-7.54642 6.74191,-8.21714 9.10658,-10.11388 " +
  "20.73231,-16.62942 18.29568,-10.25362 23.48708,-12.53282 35.20639,-15.45595 3.19292,-0.79635 " +
  "14.10326,-1.21717 24.99785,-1.24659 z";

const PUPIL_D =
  "m 443.83289,135.23244 c -22.51598,-4e-5 -40.76826,18.25286 -40.76821,40.76884 " +
  "-1e-5,22.51597 18.25225,40.76887 40.76821,40.76883 22.51558,-5.3e-4 40.76824,-18.25326 " +
  "40.76824,-40.76883 2e-5,-22.51557 -18.25266,-40.76832 -40.76824,-40.76884 z";

const toLayer1: PointTransform = (x, y) => [x - 341.95552, y - 53.816747];
const topTriangleTransform: PointTransform = (x, y) => [x - 326.743331, y - 20.494796];
const bottomTriangleTransform: PointTransform = (x, y) => [x - 326.743325, 257.349743 - y];

export const SIGIL_PATHS: SigilPathData[] = [
  { d: TRIANGLE_D, transform: topTriangleTransform },
  { d: TRIANGLE_D, transform: bottomTriangleTransform },
  { d: EYE_D, transform: toLayer1 },
  { d: PUPIL_D, transform: toLayer1 },
];

const NUMBER_RE = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;

/** Parse a relative-command SVG path into a THREE.Shape, baking an affine transform. */
export function pathToShape(d: string, transform: PointTransform): THREE.Shape {
  const shape = new THREE.Shape();
  let cmd = "";
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  let i = 0;

  const readNumbers = (): number[] => {
    const out: number[] = [];
    while (i < d.length) {
      const c = d[i];
      if (/[a-zA-Z]/.test(c)) break;
      if (c === "," || c === " " || c === "\n" || c === "\t" || c === "\r") {
        i++;
        continue;
      }
      NUMBER_RE.lastIndex = i;
      const m = NUMBER_RE.exec(d);
      if (!m) break;
      out.push(parseFloat(m[0]));
      i = NUMBER_RE.lastIndex;
    }
    return out;
  };

  const nextCommand = (): string => {
    while (i < d.length && /[\s,]/.test(d[i])) i++;
    if (i >= d.length) return "z";
    const c = d[i];
    if (/[a-zA-Z]/.test(c)) {
      i++;
      return c;
    }
    return cmd; // implicit repetition of the last command
  };

  const abs = (tx: number, ty: number): [number, number] => transform(tx, ty);

  while (i < d.length) {
    cmd = nextCommand();
    if (cmd === "z" || cmd === "Z") {
      shape.closePath();
      x = startX;
      y = startY;
      continue;
    }
    const nums = readNumbers();
    const n = nums.length;
    let k = 0;
    switch (cmd) {
      case "m": {
        x += nums[k];
        y += nums[k + 1];
        k += 2;
        startX = x;
        startY = y;
        const [px, py] = abs(x, y);
        shape.moveTo(px, py);
        for (; k + 1 < n; k += 2) {
          x += nums[k];
          y += nums[k + 1];
          const [lx, ly] = abs(x, y);
          shape.lineTo(lx, ly);
        }
        cmd = "l";
        break;
      }
      case "l": {
        for (; k + 1 < n; k += 2) {
          x += nums[k];
          y += nums[k + 1];
          const [lx, ly] = abs(x, y);
          shape.lineTo(lx, ly);
        }
        break;
      }
      case "L": {
        for (; k + 1 < n; k += 2) {
          const [lx, ly] = abs(nums[k], nums[k + 1]);
          shape.lineTo(lx, ly);
          x = nums[k];
          y = nums[k + 1];
        }
        break;
      }
      case "h": {
        for (; k < n; k++) {
          x += nums[k];
          const [lx, ly] = abs(x, y);
          shape.lineTo(lx, ly);
        }
        break;
      }
      case "v": {
        for (; k < n; k++) {
          y += nums[k];
          const [lx, ly] = abs(x, y);
          shape.lineTo(lx, ly);
        }
        break;
      }
      case "c": {
        for (; k + 5 < n; k += 6) {
          const c1x = x + nums[k];
          const c1y = y + nums[k + 1];
          const c2x = x + nums[k + 2];
          const c2y = y + nums[k + 3];
          const ex = x + nums[k + 4];
          const ey = y + nums[k + 5];
          const [a1x, a1y] = abs(c1x, c1y);
          const [a2x, a2y] = abs(c2x, c2y);
          const [aex, aey] = abs(ex, ey);
          shape.bezierCurveTo(a1x, a1y, a2x, a2y, aex, aey);
          x = ex;
          y = ey;
        }
        break;
      }
      case "C": {
        for (; k + 5 < n; k += 6) {
          const [a1x, a1y] = abs(nums[k], nums[k + 1]);
          const [a2x, a2y] = abs(nums[k + 2], nums[k + 3]);
          const [aex, aey] = abs(nums[k + 4], nums[k + 5]);
          shape.bezierCurveTo(a1x, a1y, a2x, a2y, aex, aey);
          x = nums[k + 4];
          y = nums[k + 5];
        }
        break;
      }
      default:
        // unsupported command: skip its parameters
        break;
    }
  }

  return shape;
}
