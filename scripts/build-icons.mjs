import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "app", "icon.svg");
const publicIconsDir = path.join(root, "public", "icons");

const source = await readFile(sourcePath);
const maskableSource = Buffer.from(
  source.toString().replace('rx="18"', 'rx="0"'),
);

await mkdir(publicIconsDir, { recursive: true });

async function renderIcon(svg, size, outputPath) {
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9, palette: true })
    .toFile(outputPath);
}

await Promise.all([
  // Apple applies its own corner mask, so the touch icon needs full-bleed color.
  renderIcon(maskableSource, 180, path.join(root, "app", "apple-icon.png")),
  renderIcon(source, 192, path.join(publicIconsDir, "icon-192.png")),
  renderIcon(source, 512, path.join(publicIconsDir, "icon-512.png")),
  renderIcon(maskableSource, 512, path.join(publicIconsDir, "icon-maskable-512.png")),
]);

const faviconSizes = [16, 32, 48];
const faviconPngs = await Promise.all(
  faviconSizes.map((size) =>
    sharp(source, { density: 384 })
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toBuffer(),
  ),
);

// ICO files can contain PNG-compressed images. Keeping all common browser-tab
// sizes in one file gives legacy clients a fallback without degrading the SVG.
const directorySize = 6 + faviconPngs.length * 16;
const header = Buffer.alloc(directorySize);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(faviconPngs.length, 4);

let imageOffset = directorySize;
faviconPngs.forEach((png, index) => {
  const entryOffset = 6 + index * 16;
  const size = faviconSizes[index];
  header.writeUInt8(size, entryOffset);
  header.writeUInt8(size, entryOffset + 1);
  header.writeUInt8(0, entryOffset + 2);
  header.writeUInt8(0, entryOffset + 3);
  header.writeUInt16LE(1, entryOffset + 4);
  header.writeUInt16LE(32, entryOffset + 6);
  header.writeUInt32LE(png.length, entryOffset + 8);
  header.writeUInt32LE(imageOffset, entryOffset + 12);
  imageOffset += png.length;
});

await writeFile(
  path.join(root, "app", "favicon.ico"),
  Buffer.concat([header, ...faviconPngs]),
);

console.log("Built favicon, Apple touch icon, and PWA icons from app/icon.svg");
