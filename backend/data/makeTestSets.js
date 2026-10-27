import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function shuffle(opts, correctIdx) {
  const correctText = opts[correctIdx];
  const items = opts.map((text, idx) => ({ text, isCorrect: idx === correctIdx }));
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return {
    options: items.map(x => x.text),
    correct: items.findIndex(x => x.isCorrect)
  };
}

const htmlRaw = [
  { level: 1, question: 'What does HTML stand for?', opts: ['Hyperlink and Text Markup Language', 'Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language'], c: 1, exp: 'HTML stands for Hyper Text Markup Language.' },
  { level: 2, question: 'Which HTML element is used for the largest heading?', opts: ['<heading>', '<h6>', '<h1>', '<head>'], c: 2, exp: '<h1> defines the most important and largest heading.' },
  { level: 3, question: 'Which HTML attribute specifies an alternate text for an image?', opts: ['title', 'alt', 'src', 'description'], c: 1, exp: 'The alt attribute provides alternative information for an image if a user cannot view it.' },
  { level: 4, question: 'Which HTML tag is used to define an internal stylesheet?', opts: ['<css>', '<script>', '<style>', '<link>'], c: 2, exp: 'The <style> element contains style information for a document.' },
  { level: 5, question: 'Which HTML5 element is used to specify a footer for a document or section?', opts: ['<bottom>', '<section-footer>', '<foot>', '<footer>'], c: 3, exp: 'The <footer> element specifies a footer for a document or section.' },
  { level: 6, question: 'In HTML, which input type defines a slider control?', opts: ['slider', 'controls', 'range', 'scroll'], c: 2, exp: '<input type="range"> defines a range slider control.' },
  { level: 7, question: 'What is the correct HTML element for playing audio files?', opts: ['<sound>', '<audio>', '<mp3>', '<music>'], c: 1, exp: 'The HTML5 <audio> element is used to play audio files on a web page.' },
  { level: 8, question: 'Which attribute is used to open a hyperlink in a new browser tab?', opts: ['target="_blank"', 'target="_new"', 'newtab="true"', 'window="open"'], c: 0, exp: 'target="_blank" opens the linked document in a new window or tab.' },
  { level: 9, question: 'Which HTML5 semantic tag represents self-contained, independently distributable content?', opts: ['<section>', '<article>', '<aside>', '<main>'], c: 1, exp: 'The <article> tag specifies independent, self-contained content.' },
  { level: 10, question: 'What is the purpose of the HTML5 <canvas> element?', opts: ['To render 3D plugins directly', 'To draw graphics on the fly via scripting (usually JavaScript)', 'To store tabular database records', 'To create native container layouts'], c: 1, exp: '<canvas> is used to draw graphics dynamically using JavaScript.' },
  { level: 11, question: 'In HTML forms, what does the "novalidate" attribute do on a <form>?', opts: ['Prevents CSRF attacks', 'Submits the form asynchronously via AJAX', 'Bypasses browser native HTML5 form constraint validation', 'Disables all form inputs'], c: 2, exp: 'The novalidate attribute tells the browser not to validate form inputs upon submission.' },
  { level: 12, question: 'Which HTML attribute controls browser autofill behavior according to WCAG 2.1 accessibility?', opts: ['autofill', 'autocomplete', 'type', 'suggest'], c: 1, exp: 'The autocomplete attribute specifies whether a form or an input field should have autocomplete on or off, aiding a11y.' },
  { level: 13, question: 'What does the "rel=\'noopener noreferrer\'" attribute combination protect against?', opts: ['XSS script execution', 'Tabnabbing / reverse tabnabbing security vulnerability', 'SQL injection in forms', 'CORS preflight errors'], c: 1, exp: 'noopener prevents the new page from accessing window.opener, preventing malicious tabnabbing.' },
  { level: 14, question: 'What does the "loading=\'lazy\'" attribute on <img> and <iframe> tags achieve?', opts: ['Compresses images to WebP format', 'Defers loading offscreen assets until near viewport to improve LCP/performance', 'Loads low-res blurhash placeholders', 'Caches images in ServiceWorker storage'], c: 1, exp: 'loading="lazy" instructs the browser to defer loading the asset until it reaches near the viewport.' },
  { level: 15, question: 'In the HTML Living Standard, what is the exact function of the <template> element?', opts: ['Renders template strings on server', 'Holds client-side content that is not rendered immediately, but instantiated at runtime via JavaScript', 'Injects JSX fragments into DOM', 'Compiles web assembly modules'], c: 1, exp: '<template> contains client-side template markup that remains inert until cloned via JS.' },
  { level: 16, question: 'Which HTML5 API allows web applications to register themselves as handlers for custom URL schemes?', opts: ['navigator.registerProtocolHandler()', 'manifest.json protocols', '<link rel="protocol">', 'window.bindScheme()'], c: 0, exp: 'navigator.registerProtocolHandler() allows web apps to register as protocol handlers for custom schemes.' }
];

const excelRaw = [
  { level: 1, question: 'Which symbol MUST all Excel formulas begin with?', opts: ['+', '=', '@', '#'], c: 1, exp: 'All Excel formulas must begin with an equal sign (=).' },
  { level: 2, question: 'Which function adds all the numbers in a range of cells?', opts: ['ADD()', 'SUM()', 'TOTAL()', 'PLUS()'], c: 1, exp: 'SUM() calculates the total of a selected range of numbers.' },
  { level: 3, question: 'Which keyboard shortcut selects an entire worksheet in Excel?', opts: ['Ctrl + S', 'Ctrl + A', 'Ctrl + W', 'Ctrl + E'], c: 1, exp: 'Ctrl + A selects the entire worksheet.' },
  { level: 4, question: 'Which function returns the number of cells that contain numbers in a range?', opts: ['COUNT()', 'COUNTA()', 'COUNTIF()', 'COUNTBLANK()'], c: 0, exp: 'COUNT() counts the number of cells that contain numbers.' },
  { level: 5, question: 'What does the "$" sign represent in a cell reference like $A$1?', opts: ['Currency formatting', 'Absolute (locked) cell reference', 'String text format', 'Division operator'], c: 1, exp: '$ locks the row and column reference so it does not change when copied.' },
  { level: 6, question: 'Which Excel feature summarizes and rearranges large datasets dynamically without writing formulas?', opts: ['Goal Seek', 'Pivot Table', 'Data Validation', 'Conditional Formatting'], c: 1, exp: 'Pivot Tables allow dynamic interactive summarization and aggregation of datasets.' },
  { level: 7, question: 'Which function searches for a value in the leftmost column of a table and returns a value in the same row from a specified column?', opts: ['INDEX()', 'HLOOKUP()', 'VLOOKUP()', 'MATCH()'], c: 2, exp: 'VLOOKUP searches vertically in the first column and returns values from specified column indices.' },
  { level: 8, question: 'Which modern Excel function replaces both VLOOKUP and HLOOKUP with two-way lookups and exact match default?', opts: ['LOOKUP()', 'XLOOKUP()', 'SEARCHX()', 'SUPERLOOKUP()'], c: 1, exp: 'XLOOKUP is the modern, robust replacement for VLOOKUP and HLOOKUP.' },
  { level: 9, question: 'What will the formula =IF(A1>50, "Pass", "Fail") return if A1 is 50?', opts: ['Pass', 'Fail', '#VALUE!', 'TRUE'], c: 1, exp: 'Since 50 is not strictly greater than 50 (50 > 50 is false), it returns "Fail".' },
  { level: 10, question: 'In Excel formulas, which combination provides dynamic, non-volatile left-side lookups superior to classic VLOOKUP?', opts: ['OFFSET + MATCH', 'INDEX + MATCH', 'INDIRECT + VLOOKUP', 'CHOOSE + SUM'], c: 1, exp: 'INDEX + MATCH allows lookups in any direction and does not break when columns are inserted.' },
  { level: 11, question: 'Which Excel error occurs when a formula attempts to divide a number by zero or an empty cell?', opts: ['#N/A', '#DIV/0!', '#NULL!', '#REF!'], c: 1, exp: '#DIV/0! occurs when a division by zero or empty cell is attempted.' },
  { level: 12, question: 'What does the dynamic array function =UNIQUE(A2:A100) do in modern Excel (Office 365 / 2021)?', opts: ['Counts unique values', 'Returns an array of distinct values from the range, spilling automatically', 'Removes duplicate rows permanently from sheet', 'Sorts values in descending order'], c: 1, exp: 'UNIQUE() extracts unique distinct items from a range and spills results automatically.' },
  { level: 13, question: 'What is the purpose of Power Query in Excel?', opts: ['Creating 3D chart animations', 'Extracting, transforming, and loading (ETL) data from multiple disparate sources', 'Writing VBA macro scripts', 'Password protecting workbooks'], c: 1, exp: 'Power Query is the dedicated data connectivity and transformation engine in Excel.' },
  { level: 14, question: 'In DAX / Power Pivot, what is the fundamental difference between a Calculated Column and a Measure?', opts: ['Measures are computed row-by-row during refresh; Calculated Columns compute at query time', 'Calculated Columns compute at row context and consume RAM; Measures compute on the fly within filter context', 'Calculated columns only support text', 'Measures cannot be used in Pivot Tables'], c: 1, exp: 'Calculated Columns consume storage evaluated at row context; Measures evaluate dynamically in filter context.' },
  { level: 15, question: 'Which dynamic array formula filters a dataset based on boolean criteria without requiring VBA or manual filtering?', opts: ['=FILTER(array, include, [if_empty])', '=EXTRACT(array, criteria)', '=SELECT(array, condition)', '=QUERY(range, sql)'], c: 0, exp: '=FILTER() filters an array based on conditions and spills results.' },
  { level: 16, question: 'What is the computational complexity difference between volatile functions (like OFFSET, INDIRECT) and non-volatile functions (like INDEX)?', opts: ['Volatile functions are compiled to C++', 'Volatile functions recalculate on EVERY single recalculation event anywhere in the workbook, causing performance lag', 'Non-volatile functions do not save to disk', 'There is no computational difference'], c: 1, exp: 'Volatile functions recalculate on every sheet change, whereas non-volatile functions only recalculate when their dependencies change.' }
];

const htmlList = htmlRaw.map(q => {
  const s = shuffle(q.opts, q.c);
  return {
    id: `kbc_html_l${q.level}_001`,
    level: q.level,
    topic: 'HTML & Web',
    question: q.question,
    options: s.options,
    correct: s.correct,
    explanation: q.exp
  };
});

const excelList = excelRaw.map(q => {
  const s = shuffle(q.opts, q.c);
  return {
    id: `kbc_excel_l${q.level}_001`,
    level: q.level,
    topic: 'Excel & Analytics',
    question: q.question,
    options: s.options,
    correct: s.correct,
    explanation: q.exp
  };
});

const setsData = {
  html: htmlList,
  excel: excelList
};

const backendPath = path.resolve(__dirname, 'kbcTestSets.json');
const frontendPath = path.resolve(__dirname, '../../frontend/src/data/kbcTestSets.json');

fs.writeFileSync(backendPath, JSON.stringify(setsData, null, 2));
fs.writeFileSync(frontendPath, JSON.stringify(setsData, null, 2));
console.log('✔ kbcTestSets.json created successfully at backend and frontend!');
