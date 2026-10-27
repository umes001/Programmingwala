// scripts/updateGhaziabadCourseData.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const courses = JSON.parse(fs.readFileSync(path.join(__dirname, 'coursesCatalog.json'), 'utf-8'));

const coursesObject = {};

const defaultLocations = [
  'RDC (Raj Nagar District Centre)', 'Raj Nagar Extension', 'Kavi Nagar', 'Shastri Nagar', 
  'Sanjay Nagar', 'Govindpuram', 'Crossing Republik', 'Vasundhara', 'Indirapuram', 
  'Vaishali', 'Mohan Nagar', 'Noida Sector 62', 'Ghaziabad Railway Station',
  'AKGEC College', 'ABES Engineering College', 'KIET Ghaziabad', 'IMS Ghaziabad'
];

courses.forEach(c => {
  coursesObject[c.slug] = {
    slug: c.slug,
    courseName: c.courseName,
    shortTitle: c.shortTitle,
    category: c.category,
    badgeText: c.badgeText,
    themeColor: c.themeColor,
    seoTitle: c.seoTitle,
    metaDesc: c.metaDesc,
    keywords: c.keywords,
    h1: c.h1,
    tagline: c.tagline,
    rating: c.rating,
    batchTypes: c.batchTypes,
    fees: c.fees,
    duration: c.duration,
    address: 'C-60, R.K. Tower, 3rd Floor, RDC (Raj Nagar District Centre), Ghaziabad, UP 201001',
    metroNearby: 'Nearest Metro: Shaheed Sthal (New Bus Adda) & Hindon River Metro (Red Line)',
    landmark: 'Opposite RDC Central Park / Near Raj Nagar RDC Plaza',
    overview: c.overview,
    highlights: c.highlights,
    curriculumTracks: c.curriculumTracks,
    nearbyLocations: defaultLocations,
    faqs: c.faqs,
    thumbnailImage: `https://programmingwala.com/assets/images/courses/${c.slug}.png`,
    svgThumbnail: `https://programmingwala.com/assets/images/courses/${c.slug}.svg`
  };
});

const content = `// Ghaziabad Comprehensive 100-Course Directory (Auto-generated & Verified for Google SEO 2026)
export const GHAZIABAD_COURSES = ${JSON.stringify(coursesObject, null, 2)};
`;

const targetFile = path.join(__dirname, '../frontend/src/data/ghaziabadCoursesData.js');
fs.writeFileSync(targetFile, content, 'utf-8');
console.log(`Successfully updated ${targetFile} with ${courses.length} courses!`);
