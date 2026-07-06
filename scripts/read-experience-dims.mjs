/**
 * read-experience-dims.mjs
 * Reads the real width/height of every experience image and prints JSON.
 */
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import sharp from "sharp";

const base = "public/experience";
const folders = readdirSync(base);
const result = {};

for (const folder of folders) {
  const dir = join(base, folder);
  const files = readdirSync(dir).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));
  result[folder] = {};
  for (const file of files) {
    const meta = await sharp(join(dir, file)).metadata();
    result[folder][file] = { width: meta.width, height: meta.height };
    console.log(`${folder}/${file} → ${meta.width}×${meta.height}`);
  }
}
