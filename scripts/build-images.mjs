import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceDir = path.join(root, "assets", "source");
const outputDir = path.join(root, "public", "images");
const photos = ["domestic-hero", "deep-cleaning", "end-of-tenancy", "holiday-let", "office-commercial", "after-builders"];
const widths = [480, 768, 1200, 1536];

await fs.mkdir(outputDir, { recursive: true });

for (const name of photos) {
  const source = path.join(sourceDir, `${name}.png`);
  for (const width of widths) {
    const pipeline = sharp(source).resize({ width, withoutEnlargement: true });
    await Promise.all([
      pipeline.clone().webp({ quality: 82, effort: 5 }).toFile(path.join(outputDir, `${name}-${width}.webp`)),
      pipeline.clone().avif({ quality: 58, effort: 5 }).toFile(path.join(outputDir, `${name}-${width}.avif`)),
    ]);
  }
}

await Promise.all([
  sharp(path.join(sourceDir, "social-card.png")).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(outputDir, "social-card.jpg")),
  sharp(path.join(sourceDir, "social-card.png")).resize(1200, 630, { fit: "cover" }).webp({ quality: 86 }).toFile(path.join(outputDir, "social-card.webp")),
]);

console.log(`Built ${photos.length * widths.length * 2 + 2} optimised image assets.`);
