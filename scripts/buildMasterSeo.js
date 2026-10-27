// scripts/buildMasterSeo.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('=== Starting Master SEO Build for 150 Course Pages ===');

// 1. Build catalog
console.log('1. Compiling 150 Courses Catalog...');
execSync('node scripts/buildCatalog.js', { cwd: rootDir, stdio: 'inherit' });

// 2. Update React data file
console.log('2. Updating ghaziabadCoursesData.js...');
execSync('node scripts/updateGhaziabadCourseData.js', { cwd: rootDir, stdio: 'inherit' });

// 3. Generate HTML pages
console.log('3. Generating 150 Prerendered Static HTML Pages...');
execSync('node scripts/generateHtmlPages.js', { cwd: rootDir, stdio: 'inherit' });

// 4. Generate Core Hub HTML Pages (manish-kumar, courses-in-ghaziabad, careers, tutorials, etc.)
console.log('4. Generating Core Hub Prerendered HTML Pages...');
execSync('node scripts/generateHubPages.js', { cwd: rootDir, stdio: 'inherit' });

// 5. Update Sitemaps & Robots
console.log('5. Updating XML Sitemaps, Robots.txt & Robots.xml...');
execSync('node scripts/updateSitemapsAndRobots.js', { cwd: rootDir, stdio: 'inherit' });

// 5. Sync static assets from frontend/public to dist if dist exists
const distCourses = path.join(rootDir, 'dist/courses');
const distThumbnails = path.join(rootDir, 'dist/assets/images/courses');
if (!fs.existsSync(distCourses)) fs.mkdirSync(distCourses, { recursive: true });
if (!fs.existsSync(distThumbnails)) fs.mkdirSync(distThumbnails, { recursive: true });

console.log('=== Master SEO Build Complete! ===');
