// scripts/generateThumbnails.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'coursesCatalog.json'), 'utf-8'));

// Target directories
const targetDirs = [
  path.join(__dirname, '../frontend/public/assets/images/courses'),
  path.join(__dirname, '../dist/assets/images/courses'),
  path.join(__dirname, '../frontend/dist/assets/images/courses')
];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper: Hex color to RGB
function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

// Generate PNG Image using PNGJS
function generateCoursePng(course) {
  const width = 600;
  const height = 600;
  const png = new PNG({ width, height });

  const primaryColor = hexToRgb(course.themeColor || '#2563EB');
  const baseDark = { r: 15, g: 23, b: 42 }; // slate-900

  // Pixel manipulation
  for (let y = 0; y < height; y++) {
    const yRatio = y / height;
    for (let x = 0; x < width; x++) {
      const xRatio = x / width;
      const idx = (width * y + x) << 2;

      // Radial + Linear Gradient
      const distFromCenter = Math.sqrt((x - width / 2) ** 2 + (y - height / 2) ** 2) / (width * 0.7);
      const gradientFactor = Math.max(0, 1 - distFromCenter);

      let r = Math.round(baseDark.r * (1 - gradientFactor) + primaryColor.r * gradientFactor * 0.85);
      let g = Math.round(baseDark.g * (1 - gradientFactor) + primaryColor.g * gradientFactor * 0.85);
      let b = Math.round(baseDark.b * (1 - gradientFactor) + primaryColor.b * gradientFactor * 0.85);

      // Card border with rounded effect
      const cornerRadius = 36;
      const isCorner = 
        (x < cornerRadius && y < cornerRadius && Math.hypot(x - cornerRadius, y - cornerRadius) > cornerRadius) ||
        (x > width - cornerRadius && y < cornerRadius && Math.hypot(x - (width - cornerRadius), y - cornerRadius) > cornerRadius) ||
        (x < cornerRadius && y > height - cornerRadius && Math.hypot(x - cornerRadius, y - (height - cornerRadius)) > cornerRadius) ||
        (x > width - cornerRadius && y > height - cornerRadius && Math.hypot(x - (width - cornerRadius), y - (height - cornerRadius)) > cornerRadius);

      let a = isCorner ? 0 : 255;

      // Outer border highlight
      if (!isCorner && (x <= 6 || x >= width - 7 || y <= 6 || y >= height - 7)) {
        r = Math.min(255, r + 70);
        g = Math.min(255, g + 70);
        b = Math.min(255, b + 70);
      }

      // Center decorative badge rectangle (x from 100 to 500, y from 140 to 420)
      if (x >= 120 && x <= 480 && y >= 140 && y <= 420 && !isCorner) {
        const badgeBorder = x <= 124 || x >= 476 || y <= 144 || y >= 416;
        if (badgeBorder) {
          r = Math.min(255, primaryColor.r + 50);
          g = Math.min(255, primaryColor.g + 50);
          b = Math.min(255, primaryColor.b + 50);
        } else {
          r = Math.round(r * 0.6 + primaryColor.r * 0.4);
          g = Math.round(g * 0.6 + primaryColor.g * 0.4);
          b = Math.round(b * 0.6 + primaryColor.b * 0.4);
        }
      }

      // Top banner pill (y from 40 to 90, x from 140 to 460)
      if (x >= 140 && x <= 460 && y >= 40 && y <= 90 && !isCorner) {
        r = 255; g = 255; b = 255; // White banner
      }

      // Bottom banner pill (y from 470 to 540, x from 80 to 520)
      if (x >= 80 && x <= 520 && y >= 470 && y <= 540 && !isCorner) {
        r = Math.min(255, primaryColor.r + 30);
        g = Math.min(255, primaryColor.g + 30);
        b = Math.min(255, primaryColor.b + 30);
      }

      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = a;
    }
  }

  return PNG.sync.write(png);
}

// Generate SVG Image
function generateCourseSvg(course) {
  const iconEmoji = {
    java: '☕',
    python: '🐍',
    datascience: '📊',
    cpp: '⚙️',
    c: '💻',
    web: '⚛️',
    cloud: '☁️',
    devops: '🚀',
    security: '🛡️',
    ai: '✨',
    database: '🗄️',
    mobile: '📱',
    testing: '✅',
    design: '🎨',
    tech: '💡',
    institute: '🏛️'
  }[course.iconType] || '🎓';

  const titleEscaped = (course.shortTitle || course.courseName)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="45%" stop-color="${course.themeColor || '#2563eb'}" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.03" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.6" />
    </filter>
  </defs>

  <!-- Background Base with Rounded Corners -->
  <rect width="800" height="800" rx="48" fill="url(#bgGrad)" />
  <rect x="8" y="8" width="784" height="784" rx="42" fill="none" stroke="${course.themeColor || '#38bdf8'}" stroke-width="6" stroke-opacity="0.6" />

  <!-- Inner Frosted Glass Container -->
  <rect x="50" y="50" width="700" height="700" rx="36" fill="url(#cardGrad)" stroke="#ffffff" stroke-width="2" stroke-opacity="0.2" filter="url(#shadow)" />

  <!-- Top Brand Banner -->
  <rect x="140" y="80" width="520" height="52" rx="26" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
  <text x="400" y="114" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#38bdf8" text-anchor="middle" letter-spacing="3">
    APPLETREE INFOTECH • PROGRAMMINGWALA
  </text>

  <!-- Central Emblem Box -->
  <circle cx="400" cy="300" r="110" fill="#0f172a" stroke="${course.themeColor || '#38bdf8'}" stroke-width="6" />
  <circle cx="400" cy="300" r="95" fill="${course.themeColor || '#2563eb'}" fill-opacity="0.3" />
  <text x="400" y="340" font-size="95" text-anchor="middle">${iconEmoji}</text>

  <!-- Category / Tech Tag -->
  <rect x="220" y="440" width="360" height="42" rx="21" fill="${course.themeColor || '#2563eb'}" />
  <text x="400" y="468" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">
    ${(course.badgeText || course.category).toUpperCase()}
  </text>

  <!-- Course Title -->
  <text x="400" y="540" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle">
    ${titleEscaped}
  </text>

  <!-- Star Rating & Location -->
  <text x="400" y="590" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700" fill="#facc15" text-anchor="middle">
    ★★★★★ 4.9 (500+ Verified Reviews)
  </text>

  <!-- Bottom Badges -->
  <rect x="90" y="635" width="620" height="60" rx="16" fill="#0f172a" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.3" />
  <text x="400" y="672" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" fill="#e2e8f0" text-anchor="middle">
    📍 RDC Raj Nagar, Ghaziabad • 100% Practical Labs • ISO Certified
  </text>
</svg>`;
}

// Generate for all courses
console.log('Generating high-definition PNG and SVG thumbnails for 100 courses...');
let count = 0;

courses.forEach(course => {
  const pngBuffer = generateCoursePng(course);
  const svgContent = generateCourseSvg(course);

  targetDirs.forEach(dir => {
    fs.writeFileSync(path.join(dir, `${course.slug}.png`), pngBuffer);
    fs.writeFileSync(path.join(dir, `${course.slug}.svg`), svgContent, 'utf-8');
  });

  count++;
});

console.log(`Successfully generated ${count} course PNG and SVG thumbnails across all target directories!`);
