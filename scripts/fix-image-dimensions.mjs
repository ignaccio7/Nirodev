/**
 * fix-image-dimensions.mjs
 * Reads the real width/height of every image referenced inside a project .md file
 * and updates the frontmatter values in place.
 *
 * Usage:  node scripts/fix-image-dimensions.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ── Projects to process ─────────────────────────────────────────────────────
const MD_DIR = join(ROOT, "src/content/projects/general");
const IMG_ROOT = join(ROOT, "src/assets/images");

const projects = ["bimetica", "censao", "techtricks"];

// ── Helpers ──────────────────────────────────────────────────────────────────
async function getDimensions(filePath) {
  const meta = await sharp(filePath).metadata();
  return { width: meta.width, height: meta.height };
}

function buildImageEntry(folder, index, width, height) {
  return [
    `  - src: "/src/assets/images/${folder}/${index}.png"`,
    `    alt: "Imagen ${index}"`,
    `    device: "desktop"`,
    `    width: ${width}`,
    `    height: ${height}`,
  ].join("\n");
}

// ── Main ─────────────────────────────────────────────────────────────────────
for (const project of projects) {
  const mdPath = join(MD_DIR, `${project}.md`);
  const imgDir = join(IMG_ROOT, project);

  // Collect all numbered PNGs, sorted numerically
  const files = readdirSync(imgDir)
    .filter((f) => /^\d+\.png$/i.test(f))
    .sort((a, b) => parseInt(a) - parseInt(b));

  console.log(`\n📁 ${project}: ${files.length} images found`);

  // Build the new images: block
  const entries = [];
  for (const file of files) {
    const index = parseInt(file);
    const { width, height } = await getDimensions(join(imgDir, file));
    console.log(`  ${file} → ${width}×${height}`);
    entries.push(buildImageEntry(project, index, width, height));
  }

  const newImagesBlock = `images:\n${entries.join("\n")}`;

  // Read current .md
  let content = readFileSync(mdPath, "utf-8");

  // Replace the entire images: ... block inside the frontmatter
  // The frontmatter ends at the second ---
  const fmMatch = content.match(/^(---\n)([\s\S]*?)(\n---)/);
  if (!fmMatch) {
    console.warn(`  ⚠️  Could not parse frontmatter for ${project}.md`);
    continue;
  }

  let fm = fmMatch[2];

  // Remove existing images block if present
  fm = fm.replace(/^images:[\s\S]*?(?=^\w|\Z)/m, "").trimEnd();

  // Find where to insert: before dev:
  if (fm.includes("\ndev:")) {
    fm = fm.replace(/\ndev:/, `\n${newImagesBlock}\ndev:`);
  } else {
    fm = fm + `\n${newImagesBlock}`;
  }

  // Reconstruct full file
  content = `---\n${fm}\n---` + content.slice(fmMatch[0].length);

  writeFileSync(mdPath, content, "utf-8");
  console.log(`  ✅ Updated ${project}.md`);
}

console.log("\n🎉 All done!");
