// scripts/updateSitemapsAndRobots.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'coursesCatalog.json'), 'utf-8'));

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const today = new Date().toISOString().split('T')[0];

let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- ========================================================= -->
  <!-- PRIMARY PROFILE: MANISH KUMAR (CANONICAL PRIORITY 1.0)     -->
  <!-- ========================================================= -->
  <url>
    <loc>https://programmingwala.com/manish-kumar</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://programmingwala.com/manish/manish_3.jpg</image:loc>
      <image:title>Manish Kumar - Best Java Full Stack Developer &amp; AWS DevOps Engineer</image:title>
      <image:caption>Manish Kumar holding the Best Performer of the Institution Award Trophy</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://programmingwala.com/manish/manish_1.jpg</image:loc>
      <image:title>Manish Kumar - Senior Software Engineer &amp; System Architect</image:title>
      <image:caption>Manish Kumar - Java Spring Boot &amp; React Full Stack Architect</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://programmingwala.com/manish/manish_2.jpg</image:loc>
      <image:title>Manish Kumar - AWS DevOps &amp; Cloud Infrastructure Specialist</image:title>
      <image:caption>Manish Kumar - Docker, Kubernetes &amp; AWS Cloud Infrastructure Engineer</image:caption>
    </image:image>
  </url>

  <!-- ========================================================= -->
  <!-- MAIN SITE HUBS                                            -->
  <!-- ========================================================= -->
  <url>
    <loc>https://programmingwala.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>https://programmingwala.com/courses-in-ghaziabad</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.98</priority>
  </url>

  <!-- ========================================================= -->
  <!-- 150 GHAZIABAD TECH & SOFTWARE DEVELOPMENT COURSES         -->
  <!-- ========================================================= -->
`;

courses.forEach(c => {
  const courseUrl = `https://programmingwala.com/courses/${c.slug}`;
  const imgUrl = `https://programmingwala.com/assets/images/courses/${c.slug}.png`;
  const title = escapeXml(c.courseName);
  const caption = escapeXml(`${c.courseName} training with 100% practical lab and placement in RDC Raj Nagar Ghaziabad`);

  sitemapXml += `  <url>
    <loc>${courseUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title>${title}</image:title>
      <image:caption>${caption}</image:caption>
    </image:image>
  </url>
`;
});

sitemapXml += `  <!-- ========================================================= -->
  <!-- CAREERS, TUTORIALS & RESOURCES                            -->
  <!-- ========================================================= -->
  <url>
    <loc>https://programmingwala.com/careers</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/tutorials</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/practice</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/verify-certificate</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>

  <!-- ========================================================= -->
  <!-- INSTITUTION & ADMISSION PAGES                             -->
  <!-- ========================================================= -->
  <url>
    <loc>https://programmingwala.com/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/programs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/gallery</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/fees</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/admissions</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
</urlset>
`;

// Save sitemap files
const sitemapPaths = [
  path.join(__dirname, '../dist/sitemap.xml'),
  path.join(__dirname, '../frontend/public/sitemap.xml'),
  path.join(__dirname, '../frontend/dist/sitemap.xml')
];

sitemapPaths.forEach(p => {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(p, sitemapXml.trim(), 'utf-8');
});
console.log(`Saved updated sitemap.xml with ${courses.length} courses, hubs, and institutional pages to all paths!`);

// Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /
Allow: /courses/
Allow: /courses/*
Allow: /courses-in-ghaziabad
Allow: /manish-kumar
Allow: /assets/images/courses/
Allow: /assets/images/courses/*
Allow: /careers
Allow: /careers/*
Allow: /tutorials
Allow: /practice
Allow: /verify-certificate
Allow: /verify-certificate/*
Allow: /about
Allow: /contact
Allow: /programs
Allow: /gallery
Allow: /fees
Allow: /admissions

# Disallow private, administrative, and authenticated endpoints
Disallow: /api/
Disallow: /dashboard/
Disallow: /portal/
Disallow: /login
Disallow: /payment-demo
Disallow: /lms/learn/
Disallow: /lms/dashboard/
Disallow: /student

Sitemap: https://programmingwala.com/sitemap.xml
`;

const robotsPaths = [
  path.join(__dirname, '../dist/robots.txt'),
  path.join(__dirname, '../frontend/public/robots.txt'),
  path.join(__dirname, '../frontend/dist/robots.txt')
];

robotsPaths.forEach(p => {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(p, robotsTxt.trim(), 'utf-8');
});
console.log('Saved robots.txt to all paths successfully!');

// Generate robots.xml for Google Search Console / bots checking robots.xml
const robotsXml = `<?xml version="1.0" encoding="UTF-8"?>
<robots>
  <sitemap>https://programmingwala.com/sitemap.xml</sitemap>
</robots>
`;

const robotsXmlPaths = [
  path.join(__dirname, '../dist/robots.xml'),
  path.join(__dirname, '../frontend/public/robots.xml'),
  path.join(__dirname, '../frontend/dist/robots.xml')
];

robotsXmlPaths.forEach(p => {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(p, robotsXml.trim(), 'utf-8');
});
console.log('Saved robots.xml to all paths successfully!');
