import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getLevels1to4 } from './levels_1_to_4.mjs';
import { getLevels5to8 } from './levels_5_to_8.mjs';
import { getLevels9to12 } from './levels_9_to_12.mjs';
import { getLevels13to16 } from './levels_13_to_16.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allQuestions = [
  ...getLevels1to4(),
  ...getLevels5to8(),
  ...getLevels9to12(),
  ...getLevels13to16()
];

console.log(`Loaded ${allQuestions.length} total SQL questions across 16 levels.`);

// Validation
const idSet = new Set();
const levelCounts = {};

for (const q of allQuestions) {
  if (idSet.has(q.id)) {
    throw new Error(`Duplicate ID detected: ${q.id}`);
  }
  idSet.add(q.id);

  if (!q.question || typeof q.question !== 'string' || q.question.trim().length === 0) {
    throw new Error(`Empty question text in ${q.id}`);
  }

  if (!Array.isArray(q.options) || q.options.length !== 4) {
    throw new Error(`Question ${q.id} must have exactly 4 options, got ${q.options?.length}`);
  }

  if (typeof q.correct !== 'number' || q.correct < 0 || q.correct > 3) {
    throw new Error(`Question ${q.id} invalid correct index: ${q.correct}`);
  }

  const uniqueOpts = new Set(q.options.map(o => String(o).trim().toLowerCase()));
  if (uniqueOpts.size !== 4) {
    console.warn(`Warning: Duplicate options in question ${q.id}:`, q.options);
  }

  levelCounts[q.level] = (levelCounts[q.level] || 0) + 1;
}

console.log('Breakdown by Level:');
for (let lvl = 1; lvl <= 16; lvl++) {
  console.log(`  Level ${lvl}: ${levelCounts[lvl] || 0} questions`);
}

// Ensure target directories exist
const backendDataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(backendDataDir)) {
  fs.mkdirSync(backendDataDir, { recursive: true });
}

const frontendDataDir = path.resolve(__dirname, '../../frontend/src/data');
if (!fs.existsSync(frontendDataDir)) {
  fs.mkdirSync(frontendDataDir, { recursive: true });
}

const backendPath = path.join(backendDataDir, 'sqlQuestionBank1000.json');
const frontendPath = path.join(frontendDataDir, 'sqlQuestionBank1000.json');

fs.writeFileSync(backendPath, JSON.stringify(allQuestions, null, 2), 'utf-8');
console.log(`Wrote ${allQuestions.length} questions to ${backendPath}`);

fs.writeFileSync(frontendPath, JSON.stringify(allQuestions, null, 2), 'utf-8');
console.log(`Wrote ${allQuestions.length} questions to ${frontendPath}`);
