import * as THREE from "three";
import polygonClipping from "polygon-clipping";
import { pathToShape, SIGIL_PATHS } from "./sigil-paths";

export type Ring = [number, number][];

export interface SigilShapeSet {
  /** Hexagram body with the eye (almond) cut through it. The almond spans the
   * whole star middle, so the body splits into disconnected pieces — one shape
   * per piece (typically top and bottom). */
  star: THREE.Shape[];
  /** Almond ring with the pupil cut out. */
  eye: THREE.Shape;
  /** Pupil circle. */
  pupil: THREE.Shape;
  width: number;
  height: number;
}

function ringFromShape(shape: THREE.Shape, divisions: number): Ring {
  return shape.getPoints(divisions).map((p) => [p.x, p.y]);
}

function ringArea(ring: Ring): number {
  let a = 0;
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length;
    a += ring[i][0] * ring[j][1] - ring[j][0] * ring[i][1];
  }
  return a / 2;
}

const isClockwise = (ring: Ring) => ringArea(ring) < 0;

/** Force a ring winding (ExtrudeGeometry: outer CCW, holes CW). */
function orient(ring: Ring, clockwise: boolean): Ring {
  return isClockwise(ring) === clockwise ? ring : [...ring].reverse();
}

function shapeFromPoly(poly: Ring[]): THREE.Shape {
  const outer = orient(poly[0], false);
  const shape = new THREE.Shape();
  shape.moveTo(outer[0][0], outer[0][1]);
  for (let i = 1; i < outer.length; i++) shape.lineTo(outer[i][0], outer[i][1]);
  shape.closePath();
  for (let h = 1; h < poly.length; h++) {
    const hole = orient(poly[h], true);
    const path = new THREE.Path();
    path.moveTo(hole[0][0], hole[0][1]);
    for (let i = 1; i < hole.length; i++) path.lineTo(hole[i][0], hole[i][1]);
    path.closePath();
    shape.holes.push(path);
  }
  return shape;
}

/**
 * Build the sigil as a single-layer coin from logo.svg path data.
 * The star body has the eye cut through it, the eye ring has the pupil cut
 * out, and the pupil fills the eye's hole — three flush regions that tile the
 * sigil silhouette exactly, so both coin faces show the eye. No overlaps, no
 * z-fighting.
 */
export function buildSigilShapes(width = 4): SigilShapeSet {
  const [topTriD, botTriD, eyeD, pupilD] = SIGIL_PATHS;
  const topTri = pathToShape(topTriD.d, topTriD.transform);
  const botTri = pathToShape(botTriD.d, botTriD.transform);
  const eyeAlmond = pathToShape(eyeD.d, eyeD.transform);
  const pupilCircle = pathToShape(pupilD.d, pupilD.transform);

  const DIV = 48;
  const topRing = ringFromShape(topTri, DIV);
  const botRing = ringFromShape(botTri, DIV);
  const almondRing = ringFromShape(eyeAlmond, DIV);
  const pupilRing = ringFromShape(pupilCircle, DIV);

  const hexagram = polygonClipping.union([topRing], [botRing]) as unknown as Ring[][];
  const hexOuter = hexagram[0][0];

  const starPolys = polygonClipping.difference([hexOuter], [almondRing]) as unknown as Ring[][];
  const eyePoly = (polygonClipping.difference([almondRing], [pupilRing]) as unknown as Ring[][])[0];
  const pupilPoly = [pupilRing];

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const ring of [hexOuter, almondRing, pupilRing]) {
    for (const [x, y] of ring) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  const span = Math.max(maxX - minX, maxY - minY) || 1;
  const scale = width / span;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const translate = (poly: Ring[]): Ring[] =>
    poly.map((ring) => ring.map(([x, y]) => [(x - cx) * scale, (y - cy) * scale]));

  const starShapes = starPolys.map((poly) => shapeFromPoly(translate(poly)));

  return {
    star: starShapes,
    eye: shapeFromPoly(translate(eyePoly)),
    pupil: shapeFromPoly(translate(pupilPoly)),
    width: (maxX - minX) * scale,
    height: (maxY - minY) * scale,
  };
}
