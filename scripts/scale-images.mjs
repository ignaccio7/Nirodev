import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const filesToUpdate = [
  'src/content/projects/general/bimetica.md',
  'src/content/projects/general/censao.md',
  'src/content/projects/general/techtricks.md',
  'src/pages/[slug].astro'
];

const SCALE = 1.5;

for (const relPath of filesToUpdate) {
  const filePath = path.join(root, relPath);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // For markdown files:
  // width: 1365
  // height: 676
  content = content.replace(/width:\s*(\d+)\s*\n\s*height:\s*(\d+)/g, (match, w, h) => {
    const newW = Math.round(parseInt(w) * SCALE);
    const newH = Math.round(parseInt(h) * SCALE);
    return `width: ${newW}\n    height: ${newH}`;
  });

  // For astro files (which might have commas):
  // width: 1899,
  // height: 980,
  content = content.replace(/width:\s*(\d+),\s*\n\s*height:\s*(\d+),/g, (match, w, h) => {
    const newW = Math.round(parseInt(w) * SCALE);
    const newH = Math.round(parseInt(h) * SCALE);
    return `width: ${newW},\n        height: ${newH},`;
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Scaled images in ${relPath} by ${SCALE}x`);
}
