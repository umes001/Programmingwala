import express from 'express';
import { getMySQLPool } from '../config/mysql.js';
import { generateKbcQuestionWithGemini } from '../utils/kbcAi.js';

const router = express.Router();

// ── Default Curated MERN & SQL Questions (16 Levels, 3 Questions Each = 48 Questions) ──
// ── 1,000+ Pure SQL Question Bank (16 Levels, 63 Questions per level = 1,008 Questions) ──
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlBankPath = path.resolve(__dirname, '../data/sqlQuestionBank1000.json');
export let SQL_QUESTION_BANK = [];
try {
  if (fs.existsSync(sqlBankPath)) {
    SQL_QUESTION_BANK = JSON.parse(fs.readFileSync(sqlBankPath, 'utf8'));
  }
} catch (e) {
  console.warn('Failed to load sqlQuestionBank1000.json:', e.message);
}

// ── 1,000+ Pure HTML, CSS & JavaScript Question Bank ──
const webBankPath = path.resolve(__dirname, '../data/webQuestionBank1000.json');
export let WEB_QUESTION_BANK = [];
try {
  if (fs.existsSync(webBankPath)) {
    WEB_QUESTION_BANK = JSON.parse(fs.readFileSync(webBankPath, 'utf8'));
  }
} catch (e) {
  console.warn('Failed to load webQuestionBank1000.json:', e.message);
}

// ── Curated KBC Test Sets (HTML, Excel, MERN, SQL) ──
const testSetsPath = path.resolve(__dirname, '../data/kbcTestSets.json');
export let CURATED_TEST_SETS = { html: [], excel: [] };
try {
  if (fs.existsSync(testSetsPath)) {
    CURATED_TEST_SETS = JSON.parse(fs.readFileSync(testSetsPath, 'utf8'));
  }
} catch (e) {}

// Accurate Option Shuffler: Randomizes A, B, C, D while guaranteeing 100% correct answer integrity
export function shuffleOptionsAccurately(options, correct) {
  if (!Array.isArray(options) || options.length < 2) return { options, correct: correct || 0 };
  const origIdx = (correct >= 0 && correct < options.length) ? correct : 0;
  const correctText = options[origIdx];
  const items = options.map((text, idx) => ({ text, isCorrect: idx === origIdx }));
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  const newOptions = items.map(x => x.text);
  const newCorrect = items.findIndex(x => x.isCorrect);
  return {
    options: newOptions,
    correct: newCorrect >= 0 ? newCorrect : 0
  };
}

export const DEFAULT_SQL_QUESTIONS = {};
for (let lvl = 1; lvl <= 16; lvl++) {
  DEFAULT_SQL_QUESTIONS[lvl] = SQL_QUESTION_BANK.filter(q => q.level === lvl);
}

export const DEFAULT_WEB_QUESTIONS = {};
for (let lvl = 1; lvl <= 16; lvl++) {
  DEFAULT_WEB_QUESTIONS[lvl] = WEB_QUESTION_BANK.filter(q => q.level === lvl);
}

// Backward compatibility alias for any component expecting DEFAULT_MERN_SQL_QUESTIONS
export const DEFAULT_MERN_SQL_QUESTIONS = DEFAULT_SQL_QUESTIONS;

// Default KBC Test Sets / Quiz Boxes
let memoryTestSets = [
  {
    id: 'kbc-sql-mastery',
    title: 'SQL Database Mastery KBC',
    topic: 'SQL',
    access_code: 'KBC-SQL901',
    is_active: 1,
    question_count: 16,
    passing_score: 50,
    duration: 30,
    created_at: new Date().toISOString()
  },
  {
    id: 'kbc-html-quiz',
    title: 'HTML, CSS & JavaScript Master Challenge',
    topic: 'HTML / CSS / JS',
    access_code: 'KBC-HTML5',
    is_active: 0,
    question_count: 1008,
    passing_score: 50,
    duration: 30,
    created_at: new Date().toISOString()
  },
  {
    id: 'kbc-mern-fullstack',
    title: 'Full-Stack MERN Challenge',
    topic: 'MERN',
    access_code: 'KBC-MERN10',
    is_active: 0,
    question_count: 16,
    passing_score: 50,
    duration: 45,
    created_at: new Date().toISOString()
  },
  {
    id: 'kbc-excel-analytics',
    title: 'Excel & Data Analytics Quiz',
    topic: 'Excel',
    access_code: 'KBC-EXCEL',
    is_active: 0,
    question_count: 16,
    passing_score: 50,
    duration: 40,
    created_at: new Date().toISOString()
  }
];

// ── In-Memory Fallback State (Active only if Hostinger MySQL is momentarily unreachable) ──
let memoryStore = {
  activeSelections: (() => {
    const s = {};
    for (let l = 1; l <= 16; l++) {
      const list = DEFAULT_SQL_QUESTIONS[l] || [];
      s[l] = list[0]?.id || `sql_l${l}_001`;
    }
    return s;
  })(),
  customQuestions: {},
  updatedAt: new Date().toISOString()
};

// ── Ensure Hostinger MySQL Table & Seed 1,000+ SQL Questions ──
let tableEnsured = false;
export async function ensureKbcTable() {
  if (tableEnsured) return true;
  const pool = getMySQLPool();
  if (!pool) return false;

  try {
    // 1. Create table with Hostinger MySQL standard engine
    await pool.query(`
      CREATE TABLE IF NOT EXISTS kbc_questions (
        id VARCHAR(100) PRIMARY KEY,
        level INT NOT NULL,
        topic VARCHAR(100) NOT NULL,
        question TEXT NOT NULL,
        options_json LONGTEXT NOT NULL,
        correct INT NOT NULL,
        explanation TEXT,
        is_custom TINYINT(1) DEFAULT 0,
        is_active TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_kbc_level (level),
        INDEX idx_kbc_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Remove legacy MERN seeded questions (ids like 'q-%')
    try {
      await pool.query("DELETE FROM kbc_questions WHERE id LIKE 'q-%'");
    } catch (e) {}

    // 3. Ensure all 1,008 verified pure SQL questions are seeded and updated in Hostinger MySQL kbc_questions table
    if (SQL_QUESTION_BANK.length > 0) {
      console.log(`Syncing ${SQL_QUESTION_BANK.length} verified pure SQL questions into Hostinger MySQL kbc_questions table...`);
      const batchSize = 50;
      for (let i = 0; i < SQL_QUESTION_BANK.length; i += batchSize) {
        const batch = SQL_QUESTION_BANK.slice(i, i + batchSize);
        const values = [];
        const placeholders = batch.map(q => {
          const isActive = q.id.endsWith('_001') ? 1 : 0;
          values.push(
            q.id,
            q.level,
            q.topic,
            q.question,
            JSON.stringify(q.options),
            q.correct,
            q.explanation || '',
            0,
            isActive
          );
          return '(?, ?, ?, ?, ?, ?, ?, ?, ?)';
        }).join(', ');

        await pool.query(`
          INSERT INTO kbc_questions (id, level, topic, question, options_json, correct, explanation, is_custom, is_active)
          VALUES ${placeholders}
          ON DUPLICATE KEY UPDATE 
            question = VALUES(question),
            options_json = VALUES(options_json),
            correct = VALUES(correct),
            explanation = VALUES(explanation),
            topic = VALUES(topic);
        `, values);
      }

      // Ensure exactly one active question per level
      for (let lvl = 1; lvl <= 16; lvl++) {
        const [activeRows] = await pool.query('SELECT id FROM kbc_questions WHERE level = ? AND is_active = 1', [lvl]);
        if (activeRows.length === 0) {
          await pool.query('UPDATE kbc_questions SET is_active = 1 WHERE level = ? ORDER BY id ASC LIMIT 1', [lvl]);
        } else if (activeRows.length > 1) {
          const keepId = activeRows[0].id;
          await pool.query('UPDATE kbc_questions SET is_active = 0 WHERE level = ? AND id != ?', [lvl, keepId]);
        }
      }
      console.log(`✔ Successfully verified & synced ${SQL_QUESTION_BANK.length} SQL questions in Hostinger MySQL!`);
    }

    // 3b. Ensure all 1,008 verified pure HTML, CSS & JavaScript questions are seeded and updated in Hostinger MySQL kbc_questions table
    if (WEB_QUESTION_BANK.length > 0) {
      console.log(`Syncing ${WEB_QUESTION_BANK.length} verified pure HTML, CSS & JavaScript questions into Hostinger MySQL kbc_questions table...`);
      const batchSize = 50;
      for (let i = 0; i < WEB_QUESTION_BANK.length; i += batchSize) {
        const batch = WEB_QUESTION_BANK.slice(i, i + batchSize);
        const values = [];
        const placeholders = batch.map(q => {
          values.push(
            q.id,
            q.level,
            q.topic,
            q.question,
            JSON.stringify(q.options),
            q.correct,
            q.explanation || '',
            0,
            0,
            'kbc-html-quiz'
          );
          return '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        }).join(', ');

        await pool.query(`
          INSERT INTO kbc_questions (id, level, topic, question, options_json, correct, explanation, is_custom, is_active, test_set_id)
          VALUES ${placeholders}
          ON DUPLICATE KEY UPDATE 
            question = VALUES(question),
            options_json = VALUES(options_json),
            correct = VALUES(correct),
            explanation = VALUES(explanation),
            topic = VALUES(topic),
            test_set_id = VALUES(test_set_id);
        `, values);
      }
      console.log(`✔ Successfully verified & synced ${WEB_QUESTION_BANK.length} HTML, CSS & JavaScript questions in Hostinger MySQL!`);

      try {
        await pool.query(`
          UPDATE kbc_test_sets 
          SET title = 'HTML, CSS & JavaScript Master Challenge', topic = 'HTML / CSS / JS', question_count = 1008
          WHERE id = 'kbc-html-quiz'
        `);
      } catch (e) {}
    }

    // 4. Ensure kbc_test_sets table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS kbc_test_sets (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        topic VARCHAR(100) NOT NULL,
        access_code VARCHAR(50) NOT NULL UNIQUE,
        is_active TINYINT(1) DEFAULT 0,
        question_count INT DEFAULT 16,
        passing_score INT DEFAULT 50,
        duration INT DEFAULT 30,
        questions_json LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Ensure test_set_id column in kbc_questions
    try {
      await pool.query("ALTER TABLE kbc_questions ADD COLUMN test_set_id VARCHAR(100) DEFAULT 'kbc-sql-mastery'");
    } catch (e) {}

    // Ensure default test sets in kbc_test_sets
    const [setRows] = await pool.query('SELECT COUNT(*) as cnt FROM kbc_test_sets');
    if ((setRows[0]?.cnt || 0) === 0) {
      for (const s of memoryTestSets) {
        await pool.query(`
          INSERT INTO kbc_test_sets (id, title, topic, access_code, is_active, question_count, passing_score, duration)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [s.id, s.title, s.topic, s.access_code, s.is_active, s.question_count, s.passing_score, s.duration]);
      }
    }

    tableEnsured = true;
    return true;
  } catch (err) {
    console.warn('Hostinger MySQL kbc_questions table initialization notice:', err.message);
    return false;
  }
}

// Initial check on module load
ensureKbcTable().catch(() => {});


// ── 1. PUBLIC: Get Active 16 KBC Exam Questions for Game ──
router.get('/questions', async (req, res) => {
  const pool = getMySQLPool();
  try {
    await ensureKbcTable();

    if (pool) {
      // Fetch 16 active questions
      const [activeRows] = await pool.query(`
        SELECT id, level, topic, question, options_json, correct, explanation 
        FROM kbc_questions 
        WHERE is_active = 1 
        ORDER BY level ASC
      `);

      // Fetch alternates for Flip-the-Question lifeline
      const [altRows] = await pool.query(`
        SELECT id, level, topic, question, options_json, correct, explanation 
        FROM kbc_questions 
        WHERE is_active = 0 
        ORDER BY level ASC, created_at ASC
      `);

      if (activeRows.length >= 16) {
        const activeQuestions = activeRows.map(row => ({
          level: row.level,
          id: row.id,
          topic: row.topic,
          question: row.question,
          options: typeof row.options_json === 'string' ? JSON.parse(row.options_json) : row.options_json,
          correct: row.correct,
          explanation: row.explanation
        }));

        const flipPool = {};
        altRows.forEach(row => {
          if (!flipPool[row.level]) {
            flipPool[row.level] = {
              level: row.level,
              id: row.id,
              topic: row.topic,
              question: row.question,
              options: typeof row.options_json === 'string' ? JSON.parse(row.options_json) : row.options_json,
              correct: row.correct,
              explanation: row.explanation
            };
          }
        });

        return res.json({
          success: true,
          questions: activeQuestions,
          flipPool,
          source: 'Hostinger MySQL Database'
        });
      }
    }
  } catch (err) {
    console.warn('MySQL /questions error, using fallback:', err.message);
  }

  // Fallback to in-memory MERN & SQL dataset
  const activeQuestions = [];
  const flipPool = {};
  for (let lvl = 1; lvl <= 16; lvl++) {
    const list = DEFAULT_MERN_SQL_QUESTIONS[lvl];
    const activeId = memoryStore.activeSelections[lvl];
    const customList = memoryStore.customQuestions[lvl] || [];
    const all = [...list, ...customList];
    const selected = all.find(q => q.id === activeId) || all[0];
    const alternate = all.find(q => q.id !== selected.id) || null;

    activeQuestions.push({
      level: lvl,
      id: selected.id,
      topic: selected.topic,
      question: selected.question,
      options: selected.options,
      correct: selected.correct,
      explanation: selected.explanation
    });
    flipPool[lvl] = alternate;
  }

  return res.json({
    success: true,
    questions: activeQuestions,
    flipPool,
    source: 'Memory Fallback'
  });
});

// ── 1B. TEST SETS / QUIZ BOXES: List All Stored KBC Test Sets ──
router.get('/test-sets', async (req, res) => {
  const pool = getMySQLPool();
  try {
    await ensureKbcTable();
    if (pool) {
      const [rows] = await pool.query(`
        SELECT id, title, topic, access_code, is_active, question_count, passing_score, duration, created_at, updated_at 
        FROM kbc_test_sets 
        ORDER BY is_active DESC, created_at ASC
      `);
      if (rows && rows.length > 0) {
        return res.json({ success: true, testSets: rows, database: 'Hostinger MySQL' });
      }
    }
  } catch (err) {
    console.warn('MySQL /test-sets error:', err.message);
  }

  return res.json({ success: true, testSets: memoryTestSets, database: 'Memory Fallback' });
});

// ── 1C. ADMIN: Create a New KBC Test Set (Stored Quiz Box) ──
router.post('/admin/test-sets/create', async (req, res) => {
  const { title, topic, access_code, duration = 30, passing_score = 50 } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Test Title is required.' });
  }

  const generatedCode = (access_code && access_code.trim())
    ? access_code.trim().toUpperCase()
    : `KBC-${Math.floor(100 + Math.random() * 900)}`;

  const setId = `set-${Date.now()}`;
  const cleanTitle = title.trim();
  const cleanTopic = (topic || 'General').trim();
  const pool = getMySQLPool();

  try {
    await ensureKbcTable();
    if (pool) {
      await pool.query(`
        INSERT INTO kbc_test_sets (id, title, topic, access_code, is_active, question_count, passing_score, duration)
        VALUES (?, ?, ?, ?, 0, 16, ?, ?)
      `, [setId, cleanTitle, cleanTopic, generatedCode, passing_score, duration]);

      // Populate 16 initial questions for this test set so they can be selected, deselected, and customized!
      for (let l = 1; l <= 16; l++) {
        const q = (DEFAULT_SQL_QUESTIONS[l] || [])[0];
        if (q) {
          const qId = `${setId}_q_l${l}`;
          await pool.query(`
            INSERT INTO kbc_questions (id, level, topic, question, options_json, correct, explanation, is_custom, is_active, test_set_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, ?)
            ON DUPLICATE KEY UPDATE 
              question = VALUES(question),
              options_json = VALUES(options_json),
              correct = VALUES(correct),
              explanation = VALUES(explanation),
              is_active = 1
          `, [qId, l, q.topic || cleanTopic, q.question, JSON.stringify(q.options), q.correct, q.explanation, setId]);
        }
      }

      return res.json({
        success: true,
        message: `KBC Test Set "${cleanTitle}" created!`,
        testSet: {
          id: setId,
          title: cleanTitle,
          topic: cleanTopic,
          access_code: generatedCode,
          is_active: 0,
          question_count: 16,
          passing_score,
          duration
        },
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('MySQL /admin/test-sets/create error:', err.message);
  }

  const newSet = {
    id: setId,
    title: cleanTitle,
    topic: cleanTopic,
    access_code: generatedCode,
    is_active: 0,
    question_count: 16,
    passing_score,
    duration,
    created_at: new Date().toISOString()
  };
  memoryTestSets.push(newSet);

  return res.json({
    success: true,
    message: `KBC Test Set "${cleanTitle}" created in fallback!`,
    testSet: newSet,
    database: 'Memory Fallback'
  });
});

// ── 1D. ADMIN: Select / Activate Test Set (Starts Whole KBC with This Set) ──
router.post('/admin/test-sets/activate', async (req, res) => {
  const { setId } = req.body;
  if (!setId) {
    return res.status(400).json({ success: false, message: 'setId is required.' });
  }

  const pool = getMySQLPool();
  try {
    await ensureKbcTable();
    await ensureKbcSessionsAndTeams();

    if (pool) {
      // 1. Mark target test set active, others inactive
      await pool.query('UPDATE kbc_test_sets SET is_active = (id = ?)', [setId]);

      // 2. Fetch the activated test set details
      const [setRows] = await pool.query('SELECT * FROM kbc_test_sets WHERE id = ?', [setId]);
      const activeSet = setRows[0];

      // 3. Reset live KBC session to Level 1
      await pool.query(`
        UPDATE kbc_sessions 
        SET status = 'LIVE', show_in_navbar = 1, current_level = 1, current_question_id = NULL,
            is_locked = 0, locked_option = NULL, revealed_correct = NULL, show_winner = 0
        WHERE id = 'main_session'
      `);

      // 4. Reset teams to Level 1, 0 points
      await pool.query(`
        UPDATE kbc_teams 
        SET current_level = 1, score_amount = 0, points = 0, correct_count = 0, wrong_count = 0,
            submitted_option = NULL, status = 'CONNECTED'
      `);

      // 5. If this set is HTML or Excel or MERN, activate its curated questions into kbc_questions
      if (setId === 'kbc-html-quiz') {
        await pool.query("UPDATE kbc_questions SET is_active = 0");
        for (let lvl = 1; lvl <= 16; lvl++) {
          await pool.query(`
            UPDATE kbc_questions 
            SET is_active = 1 
            WHERE level = ? AND test_set_id = 'kbc-html-quiz' AND id = CONCAT('web_l', ?, '_001')
          `, [lvl, lvl]);
        }
      } else if (setId === 'kbc-excel-analytics' && CURATED_TEST_SETS.excel?.length > 0) {
        for (const q of CURATED_TEST_SETS.excel) {
          const shuffled = shuffleOptionsAccurately(q.options, q.correct);
          await pool.query(`
            INSERT INTO kbc_questions (id, level, topic, question, options_json, correct, explanation, is_custom, is_active, test_set_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, 'kbc-excel-analytics')
            ON DUPLICATE KEY UPDATE 
              options_json = VALUES(options_json), correct = VALUES(correct), is_active = 1
          `, [q.id, q.level, q.topic, q.question, JSON.stringify(shuffled.options), shuffled.correct, q.explanation]);
        }
      } else if (setId === 'kbc-sql-mastery') {
        // Activate standard SQL questions
        for (let lvl = 1; lvl <= 16; lvl++) {
          await pool.query(`
            UPDATE kbc_questions SET is_active = (id LIKE 'sql_l${lvl}_001%') WHERE level = ?
          `, [lvl]);
        }
      } else {
        // Custom test set (e.g. 'kal ka test'): activate its selected questions
        const [customQRows] = await pool.query('SELECT id FROM kbc_questions WHERE test_set_id = ? AND is_active = 1', [setId]);
        if (customQRows.length > 0) {
          await pool.query('UPDATE kbc_questions SET is_active = 0 WHERE test_set_id != ?', [setId]);
          await pool.query('UPDATE kbc_questions SET is_active = 1 WHERE test_set_id = ?', [setId]);
        }
      }

      return res.json({
        success: true,
        message: `KBC started with test "${activeSet?.title || setId}"! Live session reset to Level 1.`,
        activeSet,
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('MySQL /admin/test-sets/activate error:', err.message);
  }

  // Fallback
  memoryTestSets.forEach(s => {
    s.is_active = (s.id === setId ? 1 : 0);
  });
  memorySession.status = 'LIVE';
  memorySession.current_level = 1;
  memorySession.is_locked = false;
  memorySession.locked_option = null;
  memorySession.revealed_correct = null;
  memorySession.show_winner = false;
  memoryTeams.forEach(t => {
    t.current_level = 1;
    t.score_amount = 0;
    t.points = 0;
    t.submitted_option = null;
  });

  const activeSet = memoryTestSets.find(s => s.id === setId) || memoryTestSets[0];
  return res.json({
    success: true,
    message: `KBC started with "${activeSet.title}" in fallback!`,
    activeSet,
    database: 'Memory Fallback'
  });
});

// ── 1E. ADMIN: Delete a Test Set ──
router.post('/admin/test-sets/delete', async (req, res) => {
  const { setId } = req.body;
  if (!setId) return res.status(400).json({ success: false, message: 'setId required' });

  const pool = getMySQLPool();
  try {
    if (pool) {
      await pool.query('DELETE FROM kbc_test_sets WHERE id = ?', [setId]);
      return res.json({ success: true, message: 'Test set deleted.' });
    }
  } catch (err) {}

  memoryTestSets = memoryTestSets.filter(s => s.id !== setId);
  return res.json({ success: true, message: 'Test set deleted in fallback.' });
});

// ── 1F. PUBLIC & ADMIN: Get Stored Questions for a Specific Test Set ──
router.get('/test-sets/:id/questions', async (req, res) => {
  const setId = req.params.id;
  const pool = getMySQLPool();

  try {
    await ensureKbcTable();
    if (pool) {
      let [rows] = await pool.query(`
        SELECT id, level, topic, question, options_json, correct, explanation, is_active 
        FROM kbc_questions 
        WHERE test_set_id = ? OR ( ? = 'kbc-sql-mastery' AND id LIKE 'sql_%' )
        ORDER BY level ASC, is_active DESC, created_at ASC
      `, [setId, setId]);

      // If custom test set has no questions yet in MySQL (e.g. created earlier), auto-populate 16 questions for it!
      if (rows.length === 0 && setId !== 'kbc-sql-mastery') {
        for (let l = 1; l <= 16; l++) {
          let sourceQ = null;
          if (setId === 'kbc-html-quiz') {
            sourceQ = CURATED_TEST_SETS.html?.find(x => x.level === l);
          } else if (setId === 'kbc-excel-analytics') {
            sourceQ = CURATED_TEST_SETS.excel?.find(x => x.level === l);
          }
          if (!sourceQ) {
            sourceQ = (DEFAULT_SQL_QUESTIONS[l] || [])[0];
          }
          if (sourceQ) {
            const qId = `${setId}_q_l${l}`;
            await pool.query(`
              INSERT INTO kbc_questions (id, level, topic, question, options_json, correct, explanation, is_custom, is_active, test_set_id)
              VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, ?)
              ON DUPLICATE KEY UPDATE 
                question = VALUES(question),
                options_json = VALUES(options_json),
                correct = VALUES(correct),
                explanation = VALUES(explanation),
                is_active = VALUES(is_active)
            `, [qId, l, sourceQ.topic || 'SQL', sourceQ.question, JSON.stringify(sourceQ.options), sourceQ.correct, sourceQ.explanation, setId]);
          }
        }

        const [reRows] = await pool.query(`
          SELECT id, level, topic, question, options_json, correct, explanation, is_active 
          FROM kbc_questions 
          WHERE test_set_id = ?
          ORDER BY level ASC, is_active DESC, created_at ASC
        `, [setId]);
        rows = reRows;
      }

      if (rows.length > 0) {
        const questions = rows.map(r => {
          const opts = typeof r.options_json === 'string' ? JSON.parse(r.options_json) : r.options_json;
          return {
            id: r.id,
            level: r.level,
            topic: r.topic,
            question: r.question,
            options: opts,
            correct: r.correct,
            explanation: r.explanation,
            isActive: Boolean(r.is_active)
          };
        });
        return res.json({ success: true, questions, database: 'Hostinger MySQL' });
      }
    }
  } catch (err) {
    console.warn('/test-sets/:id/questions error:', err.message);
  }

  // Fallback
  let fallbackQuestions = [];
  if (setId === 'kbc-html-quiz') {
    fallbackQuestions = CURATED_TEST_SETS.html || [];
  } else if (setId === 'kbc-excel-analytics') {
    fallbackQuestions = CURATED_TEST_SETS.excel || [];
  } else {
    for (let l = 1; l <= 16; l++) {
      const q = (DEFAULT_SQL_QUESTIONS[l] || [])[0];
      if (q) fallbackQuestions.push(q);
    }
  }

  const clean = fallbackQuestions.map(q => {
    return { ...q, isActive: true };
  });

  return res.json({ success: true, questions: clean, database: 'Memory Fallback' });
});

// ── 1G. ADMIN: Toggle (Select / Deselect) Single Question in Test Set ──
router.post('/admin/test-sets/:id/questions/toggle', async (req, res) => {
  const setId = req.params.id;
  const { questionId, isActive } = req.body;
  const pool = getMySQLPool();

  try {
    if (pool) {
      await pool.query(
        'UPDATE kbc_questions SET is_active = ? WHERE id = ?',
        [isActive ? 1 : 0, questionId]
      );

      // Update question_count in kbc_test_sets
      const [countRows] = await pool.query(
        'SELECT COUNT(*) as cnt FROM kbc_questions WHERE test_set_id = ? AND is_active = 1',
        [setId]
      );
      const activeCount = countRows[0]?.cnt || 0;
      await pool.query('UPDATE kbc_test_sets SET question_count = ? WHERE id = ?', [activeCount, setId]);

      return res.json({ success: true, isActive: Boolean(isActive), activeCount });
    }
  } catch (err) {
    console.warn('test-set toggle question error:', err.message);
  }
  return res.json({ success: true, isActive: Boolean(isActive) });
});

// ── 1H. ADMIN: Bulk Toggle (Select All / Deselect All) Questions in Test Set ──
router.post('/admin/test-sets/:id/questions/toggle-all', async (req, res) => {
  const setId = req.params.id;
  const { isActive } = req.body;
  const pool = getMySQLPool();

  try {
    if (pool) {
      await pool.query(
        'UPDATE kbc_questions SET is_active = ? WHERE test_set_id = ?',
        [isActive ? 1 : 0, setId]
      );

      const [countRows] = await pool.query(
        'SELECT COUNT(*) as cnt FROM kbc_questions WHERE test_set_id = ? AND is_active = 1',
        [setId]
      );
      const activeCount = countRows[0]?.cnt || 0;
      await pool.query('UPDATE kbc_test_sets SET question_count = ? WHERE id = ?', [activeCount, setId]);

      return res.json({ success: true, isActive: Boolean(isActive), activeCount });
    }
  } catch (err) {
    console.warn('test-set toggle-all error:', err.message);
  }
  return res.json({ success: true, isActive: Boolean(isActive) });
});

// ── 1I. ADMIN: Delete / Remove a Question from Test Set ──
router.post('/admin/test-sets/:id/questions/delete', async (req, res) => {
  const setId = req.params.id;
  const { questionId } = req.body;
  const pool = getMySQLPool();

  try {
    if (pool) {
      await pool.query('DELETE FROM kbc_questions WHERE id = ? AND test_set_id = ?', [questionId, setId]);

      const [countRows] = await pool.query(
        'SELECT COUNT(*) as cnt FROM kbc_questions WHERE test_set_id = ? AND is_active = 1',
        [setId]
      );
      const activeCount = countRows[0]?.cnt || 0;
      await pool.query('UPDATE kbc_test_sets SET question_count = ? WHERE id = ?', [activeCount, setId]);

      return res.json({ success: true, message: 'Question removed from test set.', activeCount });
    }
  } catch (err) {
    console.warn('test-set delete question error:', err.message);
  }
  return res.json({ success: true, message: 'Question removed.' });
});

// ── 1J. ADMIN: Add a Question into Test Set ──
router.post('/admin/test-sets/:id/questions/add', async (req, res) => {
  const setId = req.params.id;
  const { question, level = 1, topic = 'SQL', options, correct = 0, explanation = '' } = req.body;
  const pool = getMySQLPool();

  if (!question || !options || options.length !== 4) {
    return res.status(400).json({ success: false, message: 'Question and 4 options are required.' });
  }

  try {
    if (pool) {
      const qId = `${setId}_q_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const shuffled = shuffleOptionsAccurately(options, correct);

      await pool.query(`
        INSERT INTO kbc_questions (id, level, topic, question, options_json, correct, explanation, is_custom, is_active, test_set_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, ?)
      `, [qId, level, topic, question, JSON.stringify(shuffled.options), shuffled.correct, explanation, setId]);

      const [countRows] = await pool.query(
        'SELECT COUNT(*) as cnt FROM kbc_questions WHERE test_set_id = ? AND is_active = 1',
        [setId]
      );
      const activeCount = countRows[0]?.cnt || 0;
      await pool.query('UPDATE kbc_test_sets SET question_count = ? WHERE id = ?', [activeCount, setId]);

      return res.json({
        success: true,
        message: 'Question added to test set!',
        question: {
          id: qId,
          level,
          topic,
          question,
          options: shuffled.options,
          correct: shuffled.correct,
          explanation,
          isActive: true
        },
        activeCount
      });
    }
  } catch (err) {
    console.warn('test-set add question error:', err.message);
  }
  return res.json({ success: true, message: 'Question added.' });
});

// ── 2. ADMIN: Get All Available Questions Pool & Active Selections from Hostinger MySQL ──
router.get('/admin/all', async (req, res) => {
  const pool = getMySQLPool();
  try {
    await ensureKbcTable();

    if (pool) {
      const [allRows] = await pool.query(`
        SELECT id, level, topic, question, options_json, correct, explanation, is_custom, is_active, created_at 
        FROM kbc_questions 
        ORDER BY level ASC, is_active DESC, created_at ASC
      `);

      if (allRows && allRows.length > 0) {
        const levels = {};
        for (let lvl = 1; lvl <= 16; lvl++) {
          const poolForLevel = allRows
            .filter(r => r.level === lvl)
            .map(r => ({
              id: r.id,
              level: r.level,
              topic: r.topic,
              question: r.question,
              options: typeof r.options_json === 'string' ? JSON.parse(r.options_json) : r.options_json,
              correct: r.correct,
              explanation: r.explanation,
              isCustom: Boolean(r.is_custom),
              isActive: Boolean(r.is_active)
            }));

          const activeQ = poolForLevel.find(q => q.isActive) || poolForLevel[0];
          levels[lvl] = {
            level: lvl,
            activeQuestionId: activeQ ? activeQ.id : null,
            activeQuestion: activeQ,
            pool: poolForLevel
          };
        }

        return res.json({
          success: true,
          levels,
          source: 'Hostinger MySQL Database'
        });
      }
    }
  } catch (err) {
    console.warn('MySQL /admin/all error, using fallback:', err.message);
  }

  // Fallback
  const levels = {};
  for (let lvl = 1; lvl <= 16; lvl++) {
    const defaultPool = DEFAULT_MERN_SQL_QUESTIONS[lvl] || [];
    const customPool = memoryStore.customQuestions[lvl] || [];
    const allPool = [...defaultPool, ...customPool];
    const activeId = memoryStore.activeSelections[lvl] || (allPool[0] ? allPool[0].id : null);

    levels[lvl] = {
      level: lvl,
      activeQuestionId: activeId,
      activeQuestion: allPool.find(q => q.id === activeId) || allPool[0],
      pool: allPool
    };
  }

  res.json({
    success: true,
    levels,
    source: 'Memory Fallback'
  });
});

// ── 2B. ADMIN: Paginated / Filterable Question Bank (1,000+ SQL Questions) ──
router.get('/admin/bank', async (req, res) => {
  const { level, search, topic, page = 1, limit = 30 } = req.query;
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.max(1, Math.min(100, parseInt(limit, 10) || 30));
  const offset = (p - 1) * l;
  const lvl = level ? parseInt(level, 10) : null;
  const searchTerm = (search || '').trim();
  const topicFilter = (topic || '').trim();

  const pool = getMySQLPool();
  try {
    await ensureKbcTable();

    if (pool) {
      let whereClauses = [];
      let queryParams = [];

      if (lvl && lvl >= 1 && lvl <= 16) {
        whereClauses.push('level = ?');
        queryParams.push(lvl);
      }
      if (topicFilter) {
        whereClauses.push('topic = ?');
        queryParams.push(topicFilter);
      }
      if (searchTerm) {
        whereClauses.push('(question LIKE ? OR topic LIKE ? OR id LIKE ?)');
        const s = `%${searchTerm}%`;
        queryParams.push(s, s, s);
      }

      const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

      // Total count
      const [countRows] = await pool.query(
        `SELECT COUNT(*) AS total FROM kbc_questions ${whereSql}`,
        queryParams
      );
      const total = countRows[0]?.total || 0;

      // Fetch paginated rows
      const [rows] = await pool.query(
        `SELECT id, level, topic, question, options_json, correct, explanation, is_custom, is_active, created_at 
         FROM kbc_questions 
         ${whereSql} 
         ORDER BY level ASC, is_active DESC, id ASC 
         LIMIT ? OFFSET ?`,
        [...queryParams, l, offset]
      );

      // Distinct topics
      const [topicRows] = await pool.query(
        'SELECT DISTINCT topic FROM kbc_questions ORDER BY topic ASC'
      );
      const topics = topicRows.map(r => r.topic);

      const questions = rows.map(r => ({
        id: r.id,
        level: r.level,
        topic: r.topic,
        question: r.question,
        options: typeof r.options_json === 'string' ? JSON.parse(r.options_json) : r.options_json,
        correct: r.correct,
        explanation: r.explanation,
        isCustom: Boolean(r.is_custom),
        isActive: Boolean(r.is_active),
        createdAt: r.created_at
      }));

      return res.json({
        success: true,
        questions,
        total,
        page: p,
        limit: l,
        totalPages: Math.ceil(total / l),
        topics,
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('MySQL /admin/bank query error, using in-memory bank:', err.message);
  }

  // In-Memory Fallback
  let filtered = [...SQL_QUESTION_BANK, ...WEB_QUESTION_BANK];
  if (lvl && lvl >= 1 && lvl <= 16) {
    filtered = filtered.filter(q => q.level === lvl);
  }
  if (topicFilter) {
    filtered = filtered.filter(q => q.topic.toLowerCase() === topicFilter.toLowerCase());
  }
  if (searchTerm) {
    const s = searchTerm.toLowerCase();
    filtered = filtered.filter(q => 
      q.question.toLowerCase().includes(s) || 
      q.topic.toLowerCase().includes(s) ||
      q.id.toLowerCase().includes(s)
    );
  }

  const total = filtered.length;
  const paged = filtered.slice(offset, offset + l).map(q => {
    const isActive = memoryStore.activeSelections[q.level] === q.id;
    return {
      ...q,
      isCustom: false,
      isActive
    };
  });

  const topics = [...new Set(SQL_QUESTION_BANK.map(q => q.topic))].sort();

  return res.json({
    success: true,
    questions: paged,
    total,
    page: p,
    limit: l,
    totalPages: Math.ceil(total / l),
    topics,
    database: 'Memory Fallback'
  });
});

// ── 3. ADMIN: Select which question is active for a level in Hostinger MySQL ──
router.post('/admin/select', async (req, res) => {
  const { level, questionId } = req.body;
  const lvl = parseInt(level, 10);

  if (!lvl || lvl < 1 || lvl > 16 || !questionId) {
    return res.status(400).json({ success: false, message: 'Valid level (1-16) and questionId are required.' });
  }

  const pool = getMySQLPool();
  try {
    await ensureKbcTable();

    if (pool) {
      // Deactivate current active question for this level
      await pool.query('UPDATE kbc_questions SET is_active = 0 WHERE level = ?', [lvl]);

      // Activate the selected question
      const [updateResult] = await pool.query(
        'UPDATE kbc_questions SET is_active = 1 WHERE level = ? AND id = ?',
        [lvl, String(questionId)]
      );

      if (updateResult.affectedRows > 0) {
        return res.json({
          success: true,
          message: `Level ${lvl} question updated in Hostinger MySQL.`,
          activeQuestionId: String(questionId),
          database: 'Hostinger MySQL'
        });
      }
    }
  } catch (err) {
    console.warn('MySQL /admin/select query error:', err.message);
  }

  // Fallback update
  memoryStore.activeSelections[lvl] = String(questionId);
  return res.json({
    success: true,
    message: `Level ${lvl} question updated.`,
    activeQuestionId: String(questionId),
    database: 'Memory Fallback'
  });
});

// ── 4. ADMIN: Add a New Custom MERN or SQL Question into Hostinger MySQL ──
router.post('/admin/add-custom', async (req, res) => {
  const { level, topic, question, options, correct, explanation, setAsActive } = req.body;
  const lvl = parseInt(level, 10);

  if (!lvl || lvl < 1 || lvl > 16) {
    return res.status(400).json({ success: false, message: 'Level must be between 1 and 16.' });
  }
  if (!question || !question.trim()) {
    return res.status(400).json({ success: false, message: 'Question text is required.' });
  }
  if (!Array.isArray(options) || options.length !== 4 || options.some(o => !o || !o.trim())) {
    return res.status(400).json({ success: false, message: 'Exactly 4 non-empty options are required.' });
  }
  const correctIdx = parseInt(correct, 10);
  if (isNaN(correctIdx) || correctIdx < 0 || correctIdx > 3) {
    return res.status(400).json({ success: false, message: 'Correct option index must be 0, 1, 2, or 3.' });
  }

  const newId = `custom-${lvl}-${Date.now()}`;
  const shouldActivate = Boolean(setAsActive);
  const shuffled = shuffleOptionsAccurately(options.map(o => o.trim()), correctIdx);

  const pool = getMySQLPool();
  try {
    await ensureKbcTable();

    if (pool) {
      if (shouldActivate) {
        await pool.query('UPDATE kbc_questions SET is_active = 0 WHERE level = ?', [lvl]);
      }

      await pool.query(`
        INSERT INTO kbc_questions (id, level, topic, question, options_json, correct, explanation, is_custom, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
      `, [
        newId,
        lvl,
        topic || 'MERN & SQL',
        question.trim(),
        JSON.stringify(shuffled.options),
        shuffled.correct,
        (explanation || '').trim(),
        shouldActivate ? 1 : 0
      ]);

      return res.json({
        success: true,
        message: `Custom question added to Level ${lvl} in Hostinger MySQL!`,
        question: {
          id: newId,
          level: lvl,
          topic: topic || 'MERN & SQL',
          question: question.trim(),
          options,
          correct: correctIdx,
          explanation: (explanation || '').trim(),
          isCustom: true
        },
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('MySQL /admin/add-custom query error:', err.message);
  }

  // Fallback
  const fallbackQ = {
    id: newId,
    level: lvl,
    topic: topic || 'MERN & SQL',
    question: question.trim(),
    options: options.map(o => o.trim()),
    correct: correctIdx,
    explanation: (explanation || '').trim(),
    isCustom: true
  };
  if (!memoryStore.customQuestions[lvl]) memoryStore.customQuestions[lvl] = [];
  memoryStore.customQuestions[lvl].push(fallbackQ);
  if (shouldActivate) memoryStore.activeSelections[lvl] = newId;

  return res.json({
    success: true,
    message: `Custom question added to Level ${lvl}.`,
    question: fallbackQ,
    database: 'Memory Fallback'
  });
});

// ── 4B. ADMIN: Fast AI Question Generation with Gemini (Hostinger MySQL) ──
router.post('/admin/ai-generate', async (req, res) => {
  const { level, topicOrPhrase, setAsActive, count } = req.body;
  const lvl = parseInt(level, 10);

  if (!lvl || lvl < 1 || lvl > 16) {
    return res.status(400).json({ success: false, message: 'Level must be between 1 and 16.' });
  }

  const promptText = (topicOrPhrase || '').trim();
  if (!promptText) {
    return res.status(400).json({ success: false, message: 'Please provide a topic or phrase (e.g. "sql inner join questions").' });
  }

  const shouldActivate = setAsActive !== undefined ? Boolean(setAsActive) : true;
  const numQuestions = Math.min(30, Math.max(1, parseInt(count, 10) || 1));

  try {
    const aiResult = await generateKbcQuestionWithGemini({
      level: lvl,
      topicOrPhrase: promptText,
      count: numQuestions
    });

    const questionsList = Array.isArray(aiResult) ? aiResult : [aiResult];
    const pool = getMySQLPool();
    const insertedQuestions = [];

    try {
      await ensureKbcTable();

      if (pool) {
        if (shouldActivate && questionsList.length > 0) {
          await pool.query('UPDATE kbc_questions SET is_active = 0 WHERE level = ?', [lvl]);
        }

        for (let i = 0; i < questionsList.length; i++) {
          const aiQ = questionsList[i];
          const newId = `ai-${lvl}-${Date.now()}-${i + 1}`;
          const isThisActive = shouldActivate && i === 0;

          await pool.query(`
            INSERT INTO kbc_questions (id, level, topic, question, options_json, correct, explanation, is_custom, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
          `, [
            newId,
            lvl,
            aiQ.topic || 'MERN & SQL',
            aiQ.question,
            JSON.stringify(aiQ.options),
            aiQ.correct,
            aiQ.explanation,
            isThisActive ? 1 : 0
          ]);

          insertedQuestions.push({
            id: newId,
            level: lvl,
            topic: aiQ.topic,
            question: aiQ.question,
            options: aiQ.options,
            correct: aiQ.correct,
            explanation: aiQ.explanation,
            isCustom: true,
            isActive: isThisActive
          });
        }

        // If this level is active in current session and shouldActivate is true, update the live session to the first question
        if (shouldActivate && insertedQuestions.length > 0) {
          const firstId = insertedQuestions[0].id;
          const [sessRows] = await pool.query('SELECT current_level, status FROM kbc_sessions WHERE id = "main_session"');
          if (sessRows.length > 0 && sessRows[0].current_level === lvl) {
            await pool.query(`
              UPDATE kbc_sessions
              SET current_question_id = ?, is_locked = 0, locked_option = NULL, revealed_correct = NULL
              WHERE id = 'main_session'
            `, [firstId]);
            await pool.query('UPDATE kbc_teams SET submitted_option = NULL');
          }
        }

        return res.json({
          success: true,
          count: insertedQuestions.length,
          message: `✨ ${insertedQuestions.length} AI question${insertedQuestions.length > 1 ? 's' : ''} generated by Gemini and saved to Level ${lvl} in Hostinger MySQL!`,
          questions: insertedQuestions,
          question: insertedQuestions[0],
          database: 'Hostinger MySQL'
        });
      }
    } catch (dbErr) {
      console.warn('MySQL save error for AI questions:', dbErr.message);
    }

    // In-memory fallback
    if (!memoryStore.customQuestions[lvl]) memoryStore.customQuestions[lvl] = [];
    const fallbackList = [];
    for (let i = 0; i < questionsList.length; i++) {
      const aiQ = questionsList[i];
      const newId = `ai-${lvl}-${Date.now()}-${i + 1}`;
      const isThisActive = shouldActivate && i === 0;
      const fbQ = {
        id: newId,
        level: lvl,
        topic: aiQ.topic,
        question: aiQ.question,
        options: aiQ.options,
        correct: aiQ.correct,
        explanation: aiQ.explanation,
        isCustom: true,
        isActive: isThisActive
      };
      memoryStore.customQuestions[lvl].push(fbQ);
      fallbackList.push(fbQ);
      if (isThisActive) {
        memoryStore.activeSelections[lvl] = newId;
        if (memorySession.current_level === lvl) {
          memorySession.current_question_id = newId;
          memorySession.is_locked = false;
          memorySession.locked_option = null;
          memorySession.revealed_correct = null;
        }
      }
    }

    return res.json({
      success: true,
      count: fallbackList.length,
      message: `✨ ${fallbackList.length} AI question${fallbackList.length > 1 ? 's' : ''} generated by Gemini for Level ${lvl}!`,
      questions: fallbackList,
      question: fallbackList[0],
      database: 'Memory Fallback'
    });
  } catch (aiErr) {
    console.error('Error generating AI question:', aiErr.message);
    return res.status(500).json({
      success: false,
      message: `AI Generation failed: ${aiErr.message}`
    });
  }
});

// ── 4C. ADMIN: Delete Question from Hostinger MySQL ──
router.post('/admin/question/delete', async (req, res) => {
  const { questionId, level } = req.body;
  const lvl = parseInt(level, 10);

  if (!questionId) {
    return res.status(400).json({ success: false, message: 'Question ID is required.' });
  }

  const pool = getMySQLPool();
  try {
    await ensureKbcTable();

    if (pool) {
      // Check if the question exists and if it was currently active
      const [rows] = await pool.query('SELECT * FROM kbc_questions WHERE id = ?', [questionId]);
      const wasActive = rows.length > 0 && Boolean(rows[0].is_active);
      const questionLevel = rows.length > 0 ? rows[0].level : (lvl || 1);

      // Delete the question from MySQL
      await pool.query('DELETE FROM kbc_questions WHERE id = ?', [questionId]);

      // If it was the active question, activate another question for that level
      if (wasActive) {
        const [remaining] = await pool.query(
          'SELECT id FROM kbc_questions WHERE level = ? ORDER BY is_custom ASC, id ASC LIMIT 1',
          [questionLevel]
        );
        if (remaining.length > 0) {
          const nextActiveId = remaining[0].id;
          await pool.query('UPDATE kbc_questions SET is_active = 1 WHERE id = ?', [nextActiveId]);

          // Update live session if this level is currently on-screen
          const [sessRows] = await pool.query('SELECT current_level, current_question_id FROM kbc_sessions WHERE id = "main_session"');
          if (sessRows.length > 0 && (sessRows[0].current_level === questionLevel || sessRows[0].current_question_id === questionId)) {
            await pool.query('UPDATE kbc_sessions SET current_question_id = ? WHERE id = "main_session"', [nextActiveId]);
          }
        }
      }

      return res.json({
        success: true,
        message: 'Question deleted successfully from Hostinger MySQL.',
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('MySQL /admin/question/delete query error:', err.message);
  }

  // Memory fallback
  if (lvl && memoryStore.customQuestions[lvl]) {
    memoryStore.customQuestions[lvl] = memoryStore.customQuestions[lvl].filter(q => q.id !== questionId);
  }
  if (lvl && memoryStore.activeSelections[lvl] === questionId) {
    const defaultPool = DEFAULT_MERN_SQL_QUESTIONS[lvl] || [];
    memoryStore.activeSelections[lvl] = defaultPool[0]?.id || null;
  }

  return res.json({
    success: true,
    message: 'Question deleted successfully.',
    database: 'Memory Fallback'
  });
});

// ── 5. ADMIN: Reset to Factory Default 1,000 SQL Question Bank in Hostinger MySQL ──
router.post('/admin/reset', async (req, res) => {
  const pool = getMySQLPool();
  try {
    await ensureKbcTable();

    if (pool) {
      // Remove any custom questions
      await pool.query('DELETE FROM kbc_questions WHERE is_custom = 1');
      // Set all to inactive
      await pool.query('UPDATE kbc_questions SET is_active = 0');

      // Re-sync all 1,008 questions from verified SQL_QUESTION_BANK
      if (SQL_QUESTION_BANK.length > 0) {
        const batchSize = 50;
        for (let i = 0; i < SQL_QUESTION_BANK.length; i += batchSize) {
          const batch = SQL_QUESTION_BANK.slice(i, i + batchSize);
          const values = [];
          const placeholders = batch.map(q => {
            const isActive = q.id.endsWith('_001') ? 1 : 0;
            values.push(
              q.id,
              q.level,
              q.topic,
              q.question,
              JSON.stringify(q.options),
              q.correct,
              q.explanation || '',
              0,
              isActive
            );
            return '(?, ?, ?, ?, ?, ?, ?, ?, ?)';
          }).join(', ');

          await pool.query(`
            INSERT INTO kbc_questions (id, level, topic, question, options_json, correct, explanation, is_custom, is_active)
            VALUES ${placeholders}
            ON DUPLICATE KEY UPDATE 
              question = VALUES(question),
              options_json = VALUES(options_json),
              correct = VALUES(correct),
              explanation = VALUES(explanation),
              topic = VALUES(topic);
          `, values);
        }
      }

      // Re-sync all 1,008 questions from verified WEB_QUESTION_BANK
      if (WEB_QUESTION_BANK.length > 0) {
        const batchSize = 50;
        for (let i = 0; i < WEB_QUESTION_BANK.length; i += batchSize) {
          const batch = WEB_QUESTION_BANK.slice(i, i + batchSize);
          const values = [];
          const placeholders = batch.map(q => {
            values.push(
              q.id,
              q.level,
              q.topic,
              q.question,
              JSON.stringify(q.options),
              q.correct,
              q.explanation || '',
              0,
              0,
              'kbc-html-quiz'
            );
            return '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
          }).join(', ');

          await pool.query(`
            INSERT INTO kbc_questions (id, level, topic, question, options_json, correct, explanation, is_custom, is_active, test_set_id)
            VALUES ${placeholders}
            ON DUPLICATE KEY UPDATE 
              question = VALUES(question),
              options_json = VALUES(options_json),
              correct = VALUES(correct),
              explanation = VALUES(explanation),
              topic = VALUES(topic),
              test_set_id = VALUES(test_set_id);
          `, values);
        }
      }

      // Set the first question of each level to active
      for (let lvl = 1; lvl <= 16; lvl++) {
        const firstDef = DEFAULT_SQL_QUESTIONS[lvl]?.[0] || { id: `sql_l${lvl}_001` };
        await pool.query('UPDATE kbc_questions SET is_active = 1 WHERE level = ? AND id = ?', [lvl, firstDef.id]);
      }

      return res.json({
        success: true,
        message: 'KBC questions reset to 1,000 SQL + 1,000 HTML/CSS/JS master banks in Hostinger MySQL!',
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('MySQL /admin/reset query error:', err.message);
  }

  // Fallback reset
  memoryStore.customQuestions = {};
  for (let l = 1; l <= 16; l++) {
    memoryStore.activeSelections[l] = DEFAULT_SQL_QUESTIONS[l]?.[0]?.id || `sql_l${l}_001`;
  }
  return res.json({
    success: true,
    message: 'KBC questions reset to default 1,000 pure SQL master bank.',
    database: 'Memory Fallback'
  });
});

// Explicit Sync Endpoint for 1,008 HTML, CSS & JavaScript Questions
router.post('/admin/sync-web-bank', async (req, res) => {
  const pool = getMySQLPool();
  if (!pool) {
    return res.status(500).json({ success: false, error: 'Database unavailable' });
  }

  try {
    await ensureKbcTable();

    if (WEB_QUESTION_BANK.length > 0) {
      console.log(`Explicitly syncing ${WEB_QUESTION_BANK.length} HTML, CSS & JavaScript questions into Hostinger MySQL...`);
      const batchSize = 50;
      for (let i = 0; i < WEB_QUESTION_BANK.length; i += batchSize) {
        const batch = WEB_QUESTION_BANK.slice(i, i + batchSize);
        const values = [];
        const placeholders = batch.map(q => {
          values.push(
            q.id,
            q.level,
            q.topic,
            q.question,
            JSON.stringify(q.options),
            q.correct,
            q.explanation || '',
            0,
            0,
            'kbc-html-quiz'
          );
          return '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        }).join(', ');

        await pool.query(`
          INSERT INTO kbc_questions (id, level, topic, question, options_json, correct, explanation, is_custom, is_active, test_set_id)
          VALUES ${placeholders}
          ON DUPLICATE KEY UPDATE 
            question = VALUES(question),
            options_json = VALUES(options_json),
            correct = VALUES(correct),
            explanation = VALUES(explanation),
            topic = VALUES(topic),
            test_set_id = VALUES(test_set_id);
        `, values);
      }

      await pool.query(`
        UPDATE kbc_test_sets 
        SET title = 'HTML, CSS & JavaScript Master Challenge', topic = 'HTML / CSS / JS', question_count = 1008
        WHERE id = 'kbc-html-quiz'
      `);

      const [countRows] = await pool.query('SELECT COUNT(*) AS total FROM kbc_questions');
      const [webRows] = await pool.query('SELECT COUNT(*) AS webTotal FROM kbc_questions WHERE id LIKE "web_%"');

      return res.json({
        success: true,
        message: `Successfully synced ${WEB_QUESTION_BANK.length} HTML, CSS & JavaScript questions into Hostinger MySQL!`,
        synced: WEB_QUESTION_BANK.length,
        webTotalInDb: webRows[0]?.webTotal || 0,
        totalQuestionsInDb: countRows[0]?.total || 0,
        database: 'Hostinger MySQL'
      });
    }

    return res.json({ success: false, message: 'No web questions found in memory bank to sync.' });
  } catch (err) {
    console.error('MySQL sync-web-bank error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════════
// ── LIVE SESSION CONTROLLER & MULTI-TEAM MANAGEMENT (Hostinger MySQL) ──
// ════════════════════════════════════════════════════════════════════════════════

export const KBC_PRIZE_LADDER_BACKEND = [
  { level: 1,  prize: '₹1,000',       amount: 1000 },
  { level: 2,  prize: '₹2,000',       amount: 2000 },
  { level: 3,  prize: '₹3,000',       amount: 3000 },
  { level: 4,  prize: '₹5,000',       amount: 5000 },
  { level: 5,  prize: '₹10,000',      amount: 10000 },
  { level: 6,  prize: '₹20,000',      amount: 20000 },
  { level: 7,  prize: '₹40,000',      amount: 40000 },
  { level: 8,  prize: '₹80,000',      amount: 80000 },
  { level: 9,  prize: '₹1,60,000',    amount: 160000 },
  { level: 10, prize: '₹3,20,000',    amount: 320000 },
  { level: 11, prize: '₹6,40,000',    amount: 640000 },
  { level: 12, prize: '₹12,50,000',   amount: 1250000 },
  { level: 13, prize: '₹25,00,000',   amount: 2500000 },
  { level: 14, prize: '₹50,00,000',   amount: 5000000 },
  { level: 15, prize: '₹1 Crore',     amount: 10000000 },
  { level: 16, prize: '₹7 Crore',     amount: 70000000 },
  { level: 17, prize: '₹7.5 Crore',   amount: 75000000 },
  { level: 18, prize: '₹8 Crore',     amount: 80000000 },
  { level: 19, prize: '₹8.5 Crore',   amount: 85000000 },
  { level: 20, prize: '₹10 Crore',    amount: 100000000 },
  { level: 21, prize: '₹11 Crore',    amount: 110000000 },
  { level: 22, prize: '₹12 Crore',    amount: 120000000 },
  { level: 23, prize: '₹13 Crore',    amount: 130000000 },
  { level: 24, prize: '₹14 Crore',    amount: 140000000 },
  { level: 25, prize: '₹15 Crore',    amount: 150000000 },
  { level: 26, prize: '₹16 Crore',    amount: 160000000 },
  { level: 27, prize: '₹17 Crore',    amount: 170000000 },
  { level: 28, prize: '₹18 Crore',    amount: 180000000 },
  { level: 29, prize: '₹20 Crore',    amount: 200000000 },
  { level: 30, prize: '₹25 Crore',    amount: 250000000 }
];

// Safe Padav Milestone & Points Cutoff Calculation for 16 or 30 questions
export function getSafePointsAndAmount(level, totalQuestions = 16) {
  const lvl = parseInt(level, 10) || 1;
  let safeLevel = 0;
  if (totalQuestions > 16) {
    safeLevel = Math.floor((lvl - 1) / 5) * 5;
  } else {
    if (lvl > 15) safeLevel = 15;
    else if (lvl > 10) safeLevel = 10;
    else if (lvl > 5) safeLevel = 5;
    else safeLevel = 0;
  }
  // Cumulative safe points up to the safe padav milestone
  const safePoints = (safeLevel * (safeLevel + 1) / 2) * 100;
  const safePrize = safeLevel > 0 ? (KBC_PRIZE_LADDER_BACKEND[safeLevel - 1]?.amount || safeLevel * 10000) : 0;
  return { safeLevel, safePoints, safePrize };
}

// In-Memory fallback for session & teams when MySQL is unavailable
let memorySession = {
  id: 'main_session',
  status: 'INACTIVE', // 'INACTIVE' | 'WAITING' | 'LIVE' | 'COMPLETED'
  show_in_navbar: false,
  current_level: 1,
  total_questions: 16,
  current_question_id: null,
  is_locked: false,
  locked_option: null,
  revealed_correct: null,
  active_team_id: null,
  winner_team_id: null,
  winner_name: null,
  winner_points: 0,
  winner_prize: null,
  show_winner: false,
  show_leaderboard: false,
  updated_at: new Date().toISOString()
};

let memoryTeams = [
  {
    id: 'team-1',
    team_name: 'Team ByteMasters',
    leader_name: 'Rahul Sharma',
    access_code: 'KBC-101',
    current_level: 1,
    score_amount: 0,
    points: 0,
    correct_count: 0,
    wrong_count: 0,
    status: 'REGISTERED',
    submitted_option: null,
    laptop_info: 'Chrome on Windows'
  },
  {
    id: 'team-2',
    team_name: 'SQL Titans',
    leader_name: 'Priya Patel',
    access_code: 'KBC-102',
    current_level: 1,
    score_amount: 0,
    points: 0,
    correct_count: 0,
    wrong_count: 0,
    status: 'REGISTERED',
    submitted_option: null,
    laptop_info: 'Safari on macOS'
  }
];

// Helper to ensure tables and initialize main session in Hostinger MySQL
async function ensureKbcSessionsAndTeams() {
  const pool = getMySQLPool();
  if (!pool) return false;

  try {
    // 1. Ensure kbc_sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS kbc_sessions (
        id VARCHAR(50) PRIMARY KEY,
        status ENUM('INACTIVE', 'WAITING', 'LIVE', 'COMPLETED') DEFAULT 'INACTIVE',
        show_in_navbar TINYINT(1) DEFAULT 0,
        current_level INT DEFAULT 1,
        current_question_id VARCHAR(100) DEFAULT NULL,
        is_locked TINYINT(1) DEFAULT 0,
        locked_option INT DEFAULT NULL,
        revealed_correct INT DEFAULT NULL,
        active_team_id VARCHAR(100) DEFAULT NULL,
        winner_team_id VARCHAR(100) DEFAULT NULL,
        winner_name VARCHAR(255) DEFAULT NULL,
        winner_points INT DEFAULT 0,
        winner_prize VARCHAR(100) DEFAULT NULL,
        show_winner TINYINT(1) DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Ensure session record exists
    const [sessRows] = await pool.query('SELECT * FROM kbc_sessions WHERE id = ?', ['main_session']);
    if (sessRows.length === 0) {
      await pool.query(`
        INSERT INTO kbc_sessions (id, status, show_in_navbar, current_level)
        VALUES ('main_session', 'INACTIVE', 0, 1)
      `);
    }

    // Dynamic schema migrations for kbc_sessions
    try { await pool.query('ALTER TABLE kbc_sessions ADD COLUMN total_questions INT DEFAULT 16'); } catch(e) {}
    try { await pool.query('ALTER TABLE kbc_sessions ADD COLUMN winner_team_id VARCHAR(100) DEFAULT NULL'); } catch(e) {}
    try { await pool.query('ALTER TABLE kbc_sessions ADD COLUMN winner_name VARCHAR(255) DEFAULT NULL'); } catch(e) {}
    try { await pool.query('ALTER TABLE kbc_sessions ADD COLUMN winner_points INT DEFAULT 0'); } catch(e) {}
    try { await pool.query('ALTER TABLE kbc_sessions ADD COLUMN winner_prize VARCHAR(100) DEFAULT NULL'); } catch(e) {}
    try { await pool.query('ALTER TABLE kbc_sessions ADD COLUMN show_winner TINYINT(1) DEFAULT 0'); } catch(e) {}
    try { await pool.query('ALTER TABLE kbc_sessions ADD COLUMN show_leaderboard TINYINT(1) DEFAULT 0'); } catch(e) {}

    // 2. Ensure kbc_teams table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS kbc_teams (
        id VARCHAR(100) PRIMARY KEY,
        team_name VARCHAR(255) NOT NULL,
        leader_name VARCHAR(255) NOT NULL,
        access_code VARCHAR(50) NOT NULL UNIQUE,
        current_level INT DEFAULT 1,
        score_amount INT DEFAULT 0,
        points INT DEFAULT 0,
        correct_count INT DEFAULT 0,
        wrong_count INT DEFAULT 0,
        safe_amount INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'REGISTERED',
        submitted_option INT DEFAULT NULL,
        lifelines_used_json TEXT DEFAULT NULL,
        laptop_info VARCHAR(255) DEFAULT '',
        last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_team_code (access_code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Dynamic schema migrations for kbc_teams
    try { await pool.query("ALTER TABLE kbc_teams MODIFY COLUMN status VARCHAR(50) DEFAULT 'REGISTERED'"); } catch(e) {}
    try { await pool.query('ALTER TABLE kbc_teams ADD COLUMN points INT DEFAULT 0'); } catch(e) {}
    try { await pool.query('ALTER TABLE kbc_teams ADD COLUMN correct_count INT DEFAULT 0'); } catch(e) {}
    try { await pool.query('ALTER TABLE kbc_teams ADD COLUMN wrong_count INT DEFAULT 0'); } catch(e) {}

    // Ensure starter teams if none exist
    const [teamRows] = await pool.query('SELECT COUNT(*) as cnt FROM kbc_teams');
    if ((teamRows[0]?.cnt || 0) === 0) {
      for (const t of memoryTeams) {
        await pool.query(`
          INSERT INTO kbc_teams (id, team_name, leader_name, access_code, current_level, score_amount, points, status, laptop_info)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [t.id, t.team_name, t.leader_name, t.access_code, t.current_level, t.score_amount, t.points || 0, t.status, t.laptop_info]);
      }
    }

    return true;
  } catch (err) {
    console.warn('MySQL session/teams setup warning:', err.message);
    return false;
  }
}

// ── 6. PUBLIC: Get Live Session Status (used by Navbar & Contestant Laptops) ──
router.get('/session/status', async (req, res) => {
  const pool = getMySQLPool();
  try {
    await ensureKbcSessionsAndTeams();

    if (pool) {
      const [rows] = await pool.query('SELECT * FROM kbc_sessions WHERE id = ?', ['main_session']);
      if (rows.length > 0) {
        const s = rows[0];
        
        // Fetch current active question details
        let currentQuestion = null;
        let query = 'SELECT * FROM kbc_questions WHERE level = ? AND is_active = 1 LIMIT 1';
        let params = [s.current_level || 1];

        if (s.current_question_id) {
          query = 'SELECT * FROM kbc_questions WHERE id = ? LIMIT 1';
          params = [s.current_question_id];
        }

        let [qRows] = await pool.query(query, params);
        if (qRows.length === 0) {
          const [fallbackRows] = await pool.query('SELECT * FROM kbc_questions WHERE level = ? LIMIT 1', [s.current_level || 1]);
          qRows = fallbackRows;
        }

        if (qRows.length > 0) {
          const q = qRows[0];
          currentQuestion = {
            id: q.id,
            level: q.level,
            topic: q.topic,
            question: q.question,
            options: typeof q.options_json === 'string' ? JSON.parse(q.options_json) : q.options_json,
            correct: q.correct,
            explanation: q.explanation
          };
        }

        // Fetch top scorer / winner if show_winner is true
        let winner = null;
        if (s.show_winner && s.winner_team_id) {
          const [wRows] = await pool.query('SELECT * FROM kbc_teams WHERE id = ?', [s.winner_team_id]);
          if (wRows.length > 0) winner = wRows[0];
        }
        if (!winner && s.show_winner) {
          const [topRows] = await pool.query('SELECT * FROM kbc_teams ORDER BY points DESC, score_amount DESC, correct_count DESC LIMIT 1');
          if (topRows.length > 0) winner = topRows[0];
        }

        // Leaderboard top teams (Only teams playing in this session, including OUT players with cut-off points)
        const [topTeams] = await pool.query(`
          SELECT id, team_name, leader_name, access_code, current_level, points, score_amount, correct_count, wrong_count, submitted_option, status
          FROM kbc_teams 
          WHERE status IN ('CONNECTED', 'HOTSEAT', 'OUT', 'ELIMINATED', 'REGISTERED')
          ORDER BY CASE WHEN status IN ('CONNECTED', 'HOTSEAT') THEN 0 ELSE 1 END, points DESC, score_amount DESC, correct_count DESC, created_at ASC 
          LIMIT 25
        `);

        return res.json({
          success: true,
          session: {
            id: s.id,
            status: s.status,
            show_in_navbar: Boolean(s.show_in_navbar),
            current_level: s.current_level || 1,
            total_questions: s.total_questions || 16,
            current_question_id: s.current_question_id,
            is_locked: Boolean(s.is_locked),
            locked_option: s.locked_option,
            revealed_correct: s.revealed_correct,
            active_team_id: s.active_team_id,
            winner_team_id: s.winner_team_id,
            winner_name: s.winner_name,
            winner_points: s.winner_points || 0,
            winner_prize: s.winner_prize,
            show_winner: Boolean(s.show_winner),
            show_leaderboard: Boolean(s.show_leaderboard),
            winner: winner,
            top_teams: topTeams,
            current_question: currentQuestion
          },
          database: 'Hostinger MySQL'
        });
      }
    }
  } catch (err) {
    console.warn('MySQL /session/status error:', err.message);
  }

  // Fallback in-memory
  const sortedMemory = [...memoryTeams].sort((a, b) => {
    const aActive = (a.status === 'CONNECTED' || a.status === 'HOTSEAT') ? 0 : 1;
    const bActive = (b.status === 'CONNECTED' || b.status === 'HOTSEAT') ? 0 : 1;
    if (aActive !== bActive) return aActive - bActive;
    if ((b.points || 0) !== (a.points || 0)) return (b.points || 0) - (a.points || 0);
    return (b.correct_count || 0) - (a.correct_count || 0);
  });
  const fallbackWinner = memorySession.show_winner 
    ? (sortedMemory.find(t => t.id === memorySession.winner_team_id) || sortedMemory[0]) 
    : null;
  const qList = DEFAULT_MERN_SQL_QUESTIONS[memorySession.current_level] || DEFAULT_MERN_SQL_QUESTIONS[1];
  return res.json({
    success: true,
    session: {
      ...memorySession,
      winner: fallbackWinner,
      top_teams: sortedMemory.slice(0, 10),
      current_question: qList[0]
    },
    database: 'Memory Fallback'
  });
});

// ── 7. ADMIN: Confirm & Toggle KBC Session Live / Navbar Status (With Reset from Starting) ──
router.post('/admin/session/toggle', async (req, res) => {
  const { status, show_in_navbar, level, restart_from_start } = req.body;
  const pool = getMySQLPool();

  try {
    await ensureKbcSessionsAndTeams();

    const newStatus = status || 'LIVE';
    const showNav = show_in_navbar !== undefined ? (show_in_navbar ? 1 : 0) : 1;
    const shouldRestart = Boolean(restart_from_start) || newStatus === 'LIVE';
    const currentLvl = shouldRestart ? 1 : (level ? parseInt(level, 10) : 1);

    if (pool) {
      if (shouldRestart) {
        // Reset whole KBC from starting (Level 1, all rounds, locks, and revealed states cleared)
        await pool.query(`
          UPDATE kbc_sessions 
          SET status = ?, show_in_navbar = ?, current_level = 1, current_question_id = NULL,
              is_locked = 0, locked_option = NULL, revealed_correct = NULL,
              winner_team_id = NULL, winner_name = NULL, winner_points = 0, winner_prize = NULL, show_winner = 0, show_leaderboard = 0
          WHERE id = 'main_session'
        `, [newStatus, showNav]);

        // Reset all teams back to Level 1, 0 prize won, 0 points, ready for round 1
        await pool.query(`
          UPDATE kbc_teams 
          SET current_level = 1, score_amount = 0, points = 0, correct_count = 0, wrong_count = 0, safe_amount = 0, submitted_option = NULL,
              status = 'CONNECTED', lifelines_used_json = NULL
        `);
      } else {
        await pool.query(`
          UPDATE kbc_sessions 
          SET status = ?, show_in_navbar = ?, current_level = ?
          WHERE id = 'main_session'
        `, [newStatus, showNav, currentLvl]);
      }

      return res.json({
        success: true,
        message: shouldRestart
          ? `KBC started from beginning (Level 1)! Session: ${newStatus}. Navbar visibility: ${showNav ? 'VISIBLE' : 'HIDDEN'}`
          : `KBC session updated to ${newStatus}. Navbar visibility: ${showNav ? 'VISIBLE' : 'HIDDEN'}`,
        session: {
          status: newStatus,
          show_in_navbar: Boolean(showNav),
          current_level: currentLvl,
          is_locked: false,
          locked_option: null,
          revealed_correct: null
        },
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('MySQL /admin/session/toggle query error:', err.message);
  }

  // Fallback
  memorySession.status = status || 'LIVE';
  memorySession.show_in_navbar = show_in_navbar !== undefined ? Boolean(show_in_navbar) : true;
  if (restart_from_start || status === 'LIVE') {
    memorySession.current_level = 1;
    memorySession.current_question_id = null;
    memorySession.is_locked = false;
    memorySession.locked_option = null;
    memorySession.revealed_correct = null;
    memorySession.winner_team_id = null;
    memorySession.winner_name = null;
    memorySession.winner_points = 0;
    memorySession.winner_prize = null;
    memorySession.show_winner = false;
    memorySession.show_leaderboard = false;
    memoryTeams.forEach(t => {
      t.current_level = 1;
      t.score_amount = 0;
      t.points = 0;
      t.correct_count = 0;
      t.wrong_count = 0;
      t.submitted_option = null;
    });
  } else if (level) {
    memorySession.current_level = parseInt(level, 10);
  }

  return res.json({
    success: true,
    message: `Session state toggled.`,
    session: memorySession,
    database: 'Memory Fallback'
  });
});

// ── 8. ADMIN: Live Host Control Actions (Advance Level, Lock, Reveal, Change Question) ──
router.post('/admin/session/update', async (req, res) => {
  const { 
    current_level, 
    current_question_id, 
    is_locked, 
    locked_option, 
    revealed_correct, 
    active_team_id,
    reset_round
  } = req.body;

  const pool = getMySQLPool();
  try {
    await ensureKbcSessionsAndTeams();

    if (pool) {
      if (reset_round) {
        // Reset locked and revealed state for new question
        await pool.query(`
          UPDATE kbc_sessions 
          SET is_locked = 0, locked_option = NULL, revealed_correct = NULL, current_level = ?, current_question_id = ?, show_leaderboard = 0
          WHERE id = 'main_session'
        `, [current_level || 1, current_question_id || null]);

        // Also clear teams submitted options for the new round
        await pool.query('UPDATE kbc_teams SET submitted_option = NULL');
      } else {
        const updates = [];
        const params = [];

        if (current_level !== undefined) {
          updates.push('current_level = ?');
          params.push(parseInt(current_level, 10));
        }
        if (req.body.total_questions !== undefined) {
          updates.push('total_questions = ?');
          params.push(parseInt(req.body.total_questions, 10));
        }
        if (current_question_id !== undefined) {
          updates.push('current_question_id = ?');
          params.push(current_question_id);
        }
        if (is_locked !== undefined) {
          updates.push('is_locked = ?');
          params.push(is_locked ? 1 : 0);
        }
        if (locked_option !== undefined) {
          updates.push('locked_option = ?');
          params.push(locked_option);
        }
        if (revealed_correct !== undefined) {
          updates.push('revealed_correct = ?');
          params.push(revealed_correct);
        }
        if (active_team_id !== undefined) {
          updates.push('active_team_id = ?');
          params.push(active_team_id);
        }

        if (updates.length > 0) {
          params.push('main_session');
          await pool.query(`UPDATE kbc_sessions SET ${updates.join(', ')} WHERE id = ?`, params);
        }

        // ── REAL-TIME POINTS CALCULATION & CUTOFF ON REVEAL ──
        if (revealed_correct !== undefined && revealed_correct !== null) {
          const correctOpt = parseInt(revealed_correct, 10);
          const [curSess] = await pool.query('SELECT current_level, total_questions, revealed_correct, active_team_id FROM kbc_sessions WHERE id = "main_session"');
          
          // Only evaluate points once per question round (avoid duplicate points on multiple clicks / polls)
          const alreadyRevealed = curSess[0]?.revealed_correct !== null && curSess[0]?.revealed_correct !== undefined;

          if (!alreadyRevealed) {
            const lvl = curSess[0]?.current_level || current_level || 1;
            const totalQ = curSess[0]?.total_questions || 16;
            const prizeInfo = KBC_PRIZE_LADDER_BACKEND[lvl - 1] || { amount: lvl * 1000, prize: `₹${lvl * 1000}` };
            const pointsEarned = lvl * 100; // Escalating points: L1=100, L2=200, ..., L10=1000, L16=1600 pts
            const { safeLevel, safePoints, safePrize } = getSafePointsAndAmount(lvl, totalQ);

            if (correctOpt !== 99) {
              // 1. Award points, prize score amount, and correct count to all teams with correct answer (who are not OUT)
              await pool.query(`
                UPDATE kbc_teams 
                SET points = COALESCE(points, 0) + ?,
                    score_amount = ?,
                    current_level = ?,
                    correct_count = COALESCE(correct_count, 0) + 1,
                    status = 'HOTSEAT'
                WHERE submitted_option = ? AND status != 'OUT'
              `, [pointsEarned, prizeInfo.amount, Math.min(lvl + 1, totalQ), correctOpt]);

            // 2. Cut off points for teams that submitted an incorrect answer & mark OUT!
            await pool.query(`
              UPDATE kbc_teams 
              SET points = ?,
                  score_amount = ?,
                  wrong_count = COALESCE(wrong_count, 0) + 1,
                  status = 'OUT'
              WHERE submitted_option IS NOT NULL AND submitted_option != ? AND status != 'OUT'
            `, [safePoints, safePrize, correctOpt]);

            } else {
              // 99 = Explicit Wrong Answer triggered by Admin for the round
              await pool.query(`
                UPDATE kbc_teams 
                SET points = ?,
                    score_amount = ?,
                    wrong_count = COALESCE(wrong_count, 0) + 1,
                    status = 'OUT'
                WHERE (submitted_option IS NOT NULL OR id = ?) AND status != 'OUT'
              `, [safePoints, safePrize, curSess[0]?.active_team_id || '']);
            }
          }
        }
      }

      return res.json({ success: true, message: 'Live game session updated.', database: 'Hostinger MySQL' });
    }
  } catch (err) {
    console.warn('MySQL /admin/session/update query error:', err.message);
  }

  // Fallback
  if (reset_round) {
    memorySession.is_locked = false;
    memorySession.locked_option = null;
    memorySession.revealed_correct = null;
    memorySession.show_leaderboard = false;
    memorySession.current_level = current_level || 1;
    memoryTeams.forEach(t => { t.submitted_option = null; });
  } else {
    if (current_level !== undefined) memorySession.current_level = current_level;
    if (req.body.total_questions !== undefined) memorySession.total_questions = req.body.total_questions;
    if (is_locked !== undefined) memorySession.is_locked = is_locked;
    if (locked_option !== undefined) memorySession.locked_option = locked_option;
    if (revealed_correct !== undefined) {
      const alreadyRevealed = memorySession.revealed_correct !== null && memorySession.revealed_correct !== undefined;
      memorySession.revealed_correct = revealed_correct;
      if (revealed_correct !== null && !alreadyRevealed) {
        const correctOpt = parseInt(revealed_correct, 10);
        const lvl = memorySession.current_level || 1;
        const totalQ = memorySession.total_questions || 16;
        const prizeInfo = KBC_PRIZE_LADDER_BACKEND[lvl - 1] || { amount: lvl * 1000 };
        const pointsEarned = lvl * 100;
        const { safePoints, safePrize } = getSafePointsAndAmount(lvl, totalQ);

        memoryTeams.forEach(t => {
          if (correctOpt !== 99 && t.submitted_option === correctOpt && t.status !== 'OUT') {
            t.points = (t.points || 0) + pointsEarned;
            t.score_amount = prizeInfo.amount;
            t.current_level = Math.min(lvl + 1, totalQ);
            t.correct_count = (t.correct_count || 0) + 1;
            t.status = 'HOTSEAT';
          } else if (correctOpt === 99) {
            if ((t.submitted_option !== null || t.id === memorySession.active_team_id) && t.status !== 'OUT') {
              t.points = safePoints;
              t.score_amount = safePrize;
              t.wrong_count = (t.wrong_count || 0) + 1;
              t.status = 'OUT';
            }
          } else if (t.submitted_option !== null && t.submitted_option !== undefined && t.status !== 'OUT') {
            t.points = safePoints;
            t.score_amount = safePrize;
            t.wrong_count = (t.wrong_count || 0) + 1;
            t.status = 'OUT';
          }
        });
      }
    }
    if (active_team_id !== undefined) memorySession.active_team_id = active_team_id;
  }

  return res.json({ success: true, message: 'Session updated in fallback.', database: 'Memory Fallback' });
});

// ── 8B. ADMIN: Announce / Broadcast Top Scorer with "Saat Crore" Celebration ──
router.post('/admin/session/announce-winner', async (req, res) => {
  const pool = getMySQLPool();
  try {
    await ensureKbcSessionsAndTeams();
    if (pool) {
      const [rows] = await pool.query(`
        SELECT * FROM kbc_teams 
        ORDER BY points DESC, score_amount DESC, correct_count DESC, created_at ASC 
        LIMIT 1
      `);

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'No registered teams found to announce winner.' });
      }

      const winner = rows[0];
      const winLvl = winner.current_level || 1;
      const prizeInfo = KBC_PRIZE_LADDER_BACKEND[winLvl - 1] || { prize: `₹${winner.score_amount || 0}` };

      await pool.query(`
        UPDATE kbc_sessions 
        SET winner_team_id = ?, winner_name = ?, winner_points = ?, winner_prize = ?, show_winner = 1 
        WHERE id = 'main_session'
      `, [winner.id, winner.leader_name || winner.team_name, winner.points || 0, prizeInfo.prize]);

      return res.json({
        success: true,
        message: `Winner announced! Top Scorer: ${winner.leader_name} (${winner.points || 0} pts)`,
        winner: {
          ...winner,
          prizeLabel: prizeInfo.prize
        },
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('/admin/session/announce-winner error:', err.message);
  }

  // Fallback
  const sorted = [...memoryTeams].sort((a, b) => (b.points || 0) - (a.points || 0));
  const winner = sorted[0];
  if (winner) {
    memorySession.winner_team_id = winner.id;
    memorySession.winner_name = winner.leader_name || winner.team_name;
    memorySession.winner_points = winner.points || 0;
    memorySession.winner_prize = '₹7 Crore';
    memorySession.show_winner = true;
    return res.json({
      success: true,
      message: `Winner announced in fallback!`,
      winner,
      database: 'Memory Fallback'
    });
  }

  return res.status(404).json({ success: false, message: 'No teams available.' });
});

// ── 8C. ADMIN: Dismiss Winner Modal across screens ──
router.post('/admin/session/dismiss-winner', async (req, res) => {
  const pool = getMySQLPool();
  try {
    if (pool) {
      await pool.query(`UPDATE kbc_sessions SET show_winner = 0 WHERE id = 'main_session'`);
      return res.json({ success: true, message: 'Winner announcement dismissed.' });
    }
  } catch (err) {}

  memorySession.show_winner = false;
  return res.json({ success: true, message: 'Winner announcement dismissed in fallback.' });
});

// ── 8D. ADMIN: Toggle Animated Moving Leaderboard Broadcast across all screens ──
router.post('/admin/session/toggle-leaderboard', async (req, res) => {
  const pool = getMySQLPool();
  const { show_leaderboard } = req.body || {};

  try {
    await ensureKbcSessionsAndTeams();
    if (pool) {
      let shouldShow = show_leaderboard !== undefined ? Boolean(show_leaderboard) : null;
      if (shouldShow === null) {
        const [rows] = await pool.query('SELECT show_leaderboard FROM kbc_sessions WHERE id = "main_session"');
        shouldShow = !(rows[0]?.show_leaderboard);
      }

      await pool.query('UPDATE kbc_sessions SET show_leaderboard = ? WHERE id = "main_session"', [shouldShow ? 1 : 0]);
      memorySession.show_leaderboard = shouldShow;

      return res.json({
        success: true,
        show_leaderboard: shouldShow,
        message: shouldShow ? 'Leaderboard broadcast turned ON for all screens.' : 'Leaderboard broadcast turned OFF.',
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('MySQL toggle-leaderboard error:', err.message);
  }

  const shouldShow = show_leaderboard !== undefined ? Boolean(show_leaderboard) : !memorySession.show_leaderboard;
  memorySession.show_leaderboard = shouldShow;
  return res.json({
    success: true,
    show_leaderboard: shouldShow,
    message: shouldShow ? 'Leaderboard broadcast ON in fallback.' : 'Leaderboard broadcast OFF in fallback.',
    database: 'Memory Fallback'
  });
});

// ── 8E. ADMIN: Choose 30 Questions at a time for KBC ──
router.post('/admin/session/choose-30-questions', async (req, res) => {
  const pool = getMySQLPool();
  try {
    await ensureKbcTable();
    await ensureKbcSessionsAndTeams();

    if (pool) {
      // 1. Deactivate current questions
      await pool.query('UPDATE kbc_questions SET is_active = 0');

      // 2. Activate 1 question per level from 1 to 16
      for (let lvl = 1; lvl <= 16; lvl++) {
        await pool.query(`
          UPDATE kbc_questions 
          SET is_active = 1 
          WHERE level = ? 
          ORDER BY is_custom DESC, id ASC 
          LIMIT 1
        `, [lvl]);
      }

      // 3. For levels 17 to 30, ensure active questions exist
      for (let lvl = 17; lvl <= 30; lvl++) {
        const [existing] = await pool.query('SELECT id FROM kbc_questions WHERE level = ? LIMIT 1', [lvl]);
        if (existing.length === 0) {
          const sourceLvl = 10 + ((lvl - 17) % 7);
          const [sourceQ] = await pool.query('SELECT topic, question, options_json, correct, explanation FROM kbc_questions WHERE level = ? LIMIT 1', [sourceLvl]);
          if (sourceQ.length > 0) {
            const sq = sourceQ[0];
            const newId = `sql_l${lvl}_001_auto`;
            await pool.query(`
              INSERT INTO kbc_questions (id, level, topic, question, options_json, correct, explanation, is_custom, is_active)
              VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)
              ON DUPLICATE KEY UPDATE is_active = 1
            `, [newId, lvl, `Master ${sq.topic}`, sq.question, typeof sq.options_json === 'string' ? sq.options_json : JSON.stringify(sq.options_json), sq.correct, sq.explanation]);
          }
        } else {
          await pool.query('UPDATE kbc_questions SET is_active = 1 WHERE id = ?', [existing[0].id]);
        }
      }

      // 4. Reset live session to Level 1 with 30 total questions
      const [firstQ] = await pool.query('SELECT id FROM kbc_questions WHERE level = 1 AND is_active = 1 LIMIT 1');
      await pool.query(`
        UPDATE kbc_sessions 
        SET total_questions = 30, current_level = 1, current_question_id = ?, is_locked = 0, locked_option = NULL, revealed_correct = NULL, show_leaderboard = 0, show_winner = 0
        WHERE id = 'main_session'
      `, [firstQ[0]?.id || null]);

      // 5. Reset all teams for new 30 questions session
      await pool.query(`
        UPDATE kbc_teams 
        SET current_level = 1, score_amount = 0, points = 0, correct_count = 0, wrong_count = 0, safe_amount = 0, submitted_option = NULL, status = 'CONNECTED'
      `);

      return res.json({
        success: true,
        message: '30 Questions successfully selected and activated for KBC! Leaderboard organized to 30 questions.',
        questionCount: 30,
        totalQuestions: 30,
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('choose-30-questions error:', err.message);
  }

  memorySession.total_questions = 30;
  memorySession.current_level = 1;
  memorySession.is_locked = false;
  memorySession.locked_option = null;
  memorySession.revealed_correct = null;
  memorySession.show_leaderboard = false;
  memoryTeams.forEach(t => {
    t.status = 'CONNECTED';
    t.current_level = 1;
    t.points = 0;
    t.score_amount = 0;
    t.correct_count = 0;
    t.wrong_count = 0;
    t.submitted_option = null;
  });

  return res.json({
    success: true,
    message: '30 Questions activated in fallback.',
    questionCount: 30,
    totalQuestions: 30,
    database: 'Memory Fallback'
  });
});

// ── 9. ADMIN & TEAMS: Get All Registered Teams & Live Laptop Status (Ranked by Points) ──
router.get('/teams', async (req, res) => {
  const pool = getMySQLPool();
  try {
    await ensureKbcSessionsAndTeams();

    if (pool) {
      const [rows] = await pool.query(`
        SELECT id, team_name, leader_name, access_code, current_level, score_amount, points, correct_count, wrong_count, safe_amount, status, submitted_option, laptop_info, last_active_at, created_at 
        FROM kbc_teams 
        ORDER BY points DESC, score_amount DESC, correct_count DESC, created_at ASC
      `);

      return res.json({
        success: true,
        teams: rows,
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('MySQL /teams query error:', err.message);
  }

  const sortedMemory = [...memoryTeams].sort((a, b) => (b.points || 0) - (a.points || 0));
  return res.json({
    success: true,
    teams: sortedMemory,
    database: 'Memory Fallback'
  });
});

// ── 10. ADMIN: Register / Add New Participating Team ──
router.post('/admin/teams/add', async (req, res) => {
  const { team_name, leader_name, access_code } = req.body;
  if (!team_name || !team_name.trim() || !leader_name || !leader_name.trim()) {
    return res.status(400).json({ success: false, message: 'Team Name and Leader Name are required.' });
  }

  const generatedCode = (access_code && access_code.trim()) 
    ? access_code.trim().toUpperCase() 
    : `KBC-${Math.floor(100 + Math.random() * 900)}`;

  const teamId = `team-${Date.now()}`;
  const pool = getMySQLPool();

  try {
    await ensureKbcSessionsAndTeams();

    if (pool) {
      await pool.query(`
        INSERT INTO kbc_teams (id, team_name, leader_name, access_code, current_level, score_amount, status)
        VALUES (?, ?, ?, ?, 1, 0, 'REGISTERED')
      `, [teamId, team_name.trim(), leader_name.trim(), generatedCode]);

      return res.json({
        success: true,
        message: `Team "${team_name}" registered successfully with access code: ${generatedCode}`,
        team: {
          id: teamId,
          team_name: team_name.trim(),
          leader_name: leader_name.trim(),
          access_code: generatedCode,
          status: 'REGISTERED'
        },
        database: 'Hostinger MySQL'
      });
    }
  } catch (err) {
    console.warn('MySQL /admin/teams/add query error:', err.message);
  }

  // Fallback
  const newTeam = {
    id: teamId,
    team_name: team_name.trim(),
    leader_name: leader_name.trim(),
    access_code: generatedCode,
    current_level: 1,
    score_amount: 0,
    status: 'REGISTERED',
    submitted_option: null,
    laptop_info: ''
  };
  memoryTeams.push(newTeam);

  return res.json({
    success: true,
    message: `Team "${team_name}" registered!`,
    team: newTeam,
    database: 'Memory Fallback'
  });
});

// ── 11. ADMIN: Delete Team ──
router.post('/admin/teams/delete', async (req, res) => {
  const { teamId } = req.body;
  if (!teamId) return res.status(400).json({ success: false, message: 'teamId is required.' });

  const pool = getMySQLPool();
  try {
    if (pool) {
      await pool.query('DELETE FROM kbc_teams WHERE id = ?', [teamId]);
      return res.json({ success: true, message: 'Team deleted.' });
    }
  } catch (err) {}

  memoryTeams = memoryTeams.filter(t => t.id !== teamId);
  return res.json({ success: true, message: 'Team deleted from fallback.' });
});

// ── 12. TEAMS: Laptop Join Gate with Access Code ──
router.post('/team/join', async (req, res) => {
  const code = String(req.body.access_code || '').trim().toUpperCase();
  const laptopInfo = String(req.body.laptop_info || '').trim() || 'Contestant Laptop';

  if (!code) {
    return res.status(400).json({ success: false, message: 'Please enter your Team Access Code.' });
  }

  const pool = getMySQLPool();
  try {
    await ensureKbcSessionsAndTeams();

    if (pool) {
      const [rows] = await pool.query('SELECT * FROM kbc_teams WHERE access_code = ?', [code]);
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Invalid Access Code. Please ask the Admin for your team code.' });
      }

      const team = rows[0];
      await pool.query(`
        UPDATE kbc_teams 
        SET status = 'CONNECTED', laptop_info = ?, last_active_at = NOW() 
        WHERE id = ?
      `, [laptopInfo, team.id]);

      // Also get session
      const [sessRows] = await pool.query('SELECT * FROM kbc_sessions WHERE id = ?', ['main_session']);

      return res.json({
        success: true,
        message: `Welcome, ${team.team_name}!`,
        team: {
          id: team.id,
          team_name: team.team_name,
          leader_name: team.leader_name,
          access_code: team.access_code,
          score_amount: team.score_amount || 0,
          points: team.points || 0,
          correct_count: team.correct_count || 0,
          wrong_count: team.wrong_count || 0,
          current_level: team.current_level
        },
        session: sessRows[0] || memorySession
      });
    }
  } catch (err) {
    console.warn('MySQL /team/join error:', err.message);
  }

  // Fallback
  const team = memoryTeams.find(t => t.access_code === code);
  if (team) {
    team.status = 'CONNECTED';
    team.laptop_info = laptopInfo;
    return res.json({
      success: true,
      message: `Welcome, ${team.team_name}!`,
      team,
      session: memorySession
    });
  }

  return res.status(404).json({ success: false, message: 'Invalid Access Code.' });
});

// ── 13. TEAMS: Submit Laptop Answer for the Active Live Question ──
router.post('/team/submit-answer', async (req, res) => {
  const { team_id, option_index } = req.body;
  if (!team_id || option_index === undefined) {
    return res.status(400).json({ success: false, message: 'team_id and option_index required.' });
  }

  const opt = parseInt(option_index, 10);
  const pool = getMySQLPool();

  try {
    if (pool) {
      await pool.query(`
        UPDATE kbc_teams 
        SET submitted_option = ?, last_active_at = NOW() 
        WHERE id = ?
      `, [opt, team_id]);

      return res.json({ success: true, message: `Option ${String.fromCharCode(65 + opt)} locked from your laptop!` });
    }
  } catch (err) {}

  // Fallback
  const team = memoryTeams.find(t => t.id === team_id);
  if (team) {
    team.submitted_option = opt;
    return res.json({ success: true, message: `Option ${String.fromCharCode(65 + opt)} locked!` });
  }

  return res.status(404).json({ success: false, message: 'Team not found.' });
});

export default router;
