/**
 * Generate PWA icons with proper sizes
 * Run with: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Ensure directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// CRC32 table for PNG
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createPNG(width, height, bgColor, fgColor) {
  // Create raw pixel data (RGBA)
  const raw = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;

  for (let y = 0; y < height; y++) {
    raw.push(0); // Filter byte for each row
    for (let x = 0; x < width; x++) {
      // Calculate distance from center for a circular icon
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        // Inner circle (green for football theme)
        raw.push(fgColor.r, fgColor.g, fgColor.b, 255);
      } else if (dist < radius + 4) {
        // Border
        raw.push(100, 100, 100, 255);
      } else {
        // Background
        raw.push(bgColor.r, bgColor.g, bgColor.b, 255);
      }
    }
  }

  // Add a simple "G" letter in the center
  const fontSize = Math.floor(radius * 1.2);
  const letterCenterX = Math.floor(centerX - fontSize * 0.3);
  const letterCenterY = Math.floor(centerY - fontSize * 0.4);

  // Compress the raw data
  const deflated = zlib.deflateSync(Buffer.from(raw), { level: 9 });

  // Build PNG chunks
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8);   // bit depth
  ihdrData.writeUInt8(6, 9);   // color type (RGBA)
  ihdrData.writeUInt8(0, 10);  // compression
  ihdrData.writeUInt8(0, 11);  // filter
  ihdrData.writeUInt8(0, 12);  // interlace

  const ihdrType = Buffer.from('IHDR');
  const ihdrCrc = crc32(Buffer.concat([ihdrType, ihdrData]));

  const ihdr = Buffer.alloc(12 + 13);
  ihdr.writeUInt32BE(13, 0);
  ihdrType.copy(ihdr, 4);
  ihdrData.copy(ihdr, 8);
  ihdr.writeUInt32BE(ihdrCrc, 21);

  // IDAT chunk
  const idatType = Buffer.from('IDAT');
  const idatCrc = crc32(Buffer.concat([idatType, deflated]));

  const idat = Buffer.alloc(12 + deflated.length);
  idat.writeUInt32BE(deflated.length, 0);
  idatType.copy(idat, 4);
  deflated.copy(idat, 8);
  idat.writeUInt32BE(idatCrc, 8 + deflated.length);

  // IEND chunk
  const iendType = Buffer.from('IEND');
  const iendCrc = crc32(iendType);

  const iend = Buffer.alloc(12);
  iend.writeUInt32BE(0, 0);
  iendType.copy(iend, 4);
  iend.writeUInt32BE(iendCrc, 8);

  return Buffer.concat([signature, ihdr, idat, iend]);
}

// Colors
const bgColor = { r: 10, g: 10, b: 10 };      // Dark background (#0a0a0a)
const fgColor = { r: 34, g: 197, b: 94 };     // Green (#22c55e)

// Generate icons
const icons = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
];

icons.forEach(({ size, name }) => {
  const png = createPNG(size, size, bgColor, fgColor);
  fs.writeFileSync(path.join(iconsDir, name), png);
  console.log(`Created ${name} (${size}x${size}) - ${png.length} bytes`);
});

console.log('\nIcons created successfully!');
console.log('You can replace these with custom designs later.');
