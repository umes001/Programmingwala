// scripts/generateThumbnailsPuppeteer.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'coursesCatalog.json'), 'utf-8'));

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

const iconMap = {
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
};

function getGradient(themeColor) {
  return `radial-gradient(circle at 35% 25%, ${themeColor} 0%, #0f172a 75%, #020617 100%)`;
}

function buildHtml(course) {
  const icon = iconMap[course.iconType] || '🎓';
  const color = course.themeColor || '#2563eb';
  const bgGrad = getGradient(color);
  const title = (course.shortTitle || course.courseName).replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const badge = (course.badgeText || course.category || 'PROGRAMMING').toUpperCase();

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 800px;
      height: 800px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
    .card {
      width: 760px;
      height: 760px;
      border-radius: 54px;
      background: ${bgGrad};
      border: 4px solid ${color};
      box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.85);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 40px 32px;
      position: relative;
      overflow: hidden;
    }
    .card::before {
      content: '';
      position: absolute;
      top: -120px;
      right: -120px;
      width: 360px;
      height: 360px;
      background: radial-gradient(circle, ${color}55, transparent 70%);
      border-radius: 50%;
    }
    .card::after {
      content: '';
      position: absolute;
      bottom: -100px;
      left: -100px;
      width: 340px;
      height: 340px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.08), transparent 70%);
      border-radius: 50%;
    }
    .brand-banner {
      position: relative;
      z-index: 2;
      background: rgba(15, 23, 42, 0.9);
      border: 1.5px solid ${color};
      color: #38bdf8;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 2.2px;
      padding: 8px 24px;
      border-radius: 9999px;
      text-transform: uppercase;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .icon-container {
      position: relative;
      z-index: 2;
      width: 175px;
      height: 175px;
      border-radius: 46px;
      background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(15,23,42,0.85));
      border: 3.5px solid ${color};
      box-shadow: 0 0 35px ${color}66;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 88px;
    }
    .content-block {
      position: relative;
      z-index: 2;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      width: 100%;
    }
    .category-badge {
      background: ${color};
      color: #ffffff;
      font-size: 17px;
      font-weight: 900;
      padding: 6px 20px;
      border-radius: 12px;
      letter-spacing: 2px;
      text-transform: uppercase;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .course-title {
      color: #ffffff;
      font-size: 36px;
      font-weight: 900;
      line-height: 1.15;
      text-shadow: 0 3px 10px rgba(0,0,0,0.8);
      max-width: 680px;
    }
    .rating-row {
      color: #facc15;
      font-size: 22px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .footer-pill {
      position: relative;
      z-index: 2;
      background: rgba(15, 23, 42, 0.94);
      border: 1.5px solid rgba(255, 255, 255, 0.18);
      border-radius: 18px;
      padding: 12px 24px;
      color: #e2e8f0;
      font-size: 16px;
      font-weight: 700;
      width: 100%;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #22c55e;
      display: inline-block;
      box-shadow: 0 0 10px #22c55e;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand-banner">AppleTree Infotech • ProgrammingWala</div>
    <div class="icon-container">${icon}</div>
    <div class="content-block">
      <div class="category-badge">${badge}</div>
      <div class="course-title">${title}</div>
      <div class="rating-row">★★★★★ 4.9 (500+ Reviews)</div>
    </div>
    <div class="footer-pill">
      <span class="status-dot"></span>
      📍 RDC Raj Nagar, Ghaziabad • 100% Practical Labs • ISO Certified
    </div>
  </div>
</body>
</html>`;
}

async function run() {
  console.log(`Launching browser to render ${courses.length} high-res thumbnails...`);
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 800, deviceScaleFactor: 1 });

  let completed = 0;
  for (const course of courses) {
    const html = buildHtml(course);
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    const pngBuffer = await page.screenshot({ omitBackground: true, type: 'png' });

    for (const dir of targetDirs) {
      fs.writeFileSync(path.join(dir, `${course.slug}.png`), pngBuffer);
    }
    completed++;
    if (completed % 25 === 0 || completed === courses.length) {
      console.log(`Rendered ${completed}/${courses.length} course thumbnails...`);
    }
  }

  await browser.close();
  console.log(`All ${courses.length} course thumbnails successfully generated and saved!`);
}

run().catch(err => {
  console.error('Puppeteer generation failed:', err);
  process.exit(1);
});
