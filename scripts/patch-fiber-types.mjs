/**
 * R3F v9 maps every non-constructor export of THREE into JSX.IntrinsicElements
 * as a `never` member. Those `never` members break polymorphic JSX inference
 * (`<Component as="div">` → "children prop expects a single child of type
 * 'never'") under @types/react 19.2 / React 19.2, which is the known ecosystem
 * bug. This script strips the `never` members from ThreeElements so the
 * augmentation is clean. Idempotent — safe to run on every install.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const target = join(
  here,
  "..",
  "node_modules/@react-three/fiber/dist/declarations/src/three-types.d.ts"
);

const OLD =
  "export interface ThreeElements extends Omit<ThreeElementsImpl, 'audio' | 'source' | 'line' | 'path'> {";
const NEW = [
  "type NeverKeys<T> = { [K in keyof T]: T[K] extends never ? K : never }[keyof T];",
  "type CleanThree = Omit<ThreeElementsImpl, NeverKeys<ThreeElementsImpl>>;",
  "export interface ThreeElements extends CleanThree {",
].join("\n");

try {
  const src = readFileSync(target, "utf8");
  if (src.includes(OLD)) {
    writeFileSync(target, src.replace(OLD, NEW));
    console.log("patched @react-three/fiber ThreeElements (removed never members)");
  } else {
    console.log("@react-three/fiber ThreeElements already patched (or changed upstream)");
  }
} catch (err) {
  console.warn(`could not patch @react-three/fiber types: ${String(err?.message ?? err)}`);
}
