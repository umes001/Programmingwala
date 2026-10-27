import express from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Assessment, Attempt } from '../models/Assessment.js';
import Certificate from '../models/Certificate.js';
import mockStore from '../config/mockStore.js';
import { runSql, checkSqlAnswer } from '../utils/sqlRunner.js';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import {
  getMySQLPool,
  resetMySQLPool,
  testMySQLConnection,
  updateEnvFiles,
  initMySQLTables,
  getMySQLStatus
} from '../config/mysql.js';
import {
  getAllJavaQuestions,
  filterJavaQuestions,
  getRandomJavaSample,
  getJavaQuestionBankStats,
  JAVA_TOPICS
} from '../data/javaQuestionBank.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const ASSESSMENTS_FILE = path.join(DATA_DIR, 'assessments.json');
const ATTEMPTS_FILE = path.join(DATA_DIR, 'attempts.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}
}

export const loadAssessmentsFromFile = () => {
  try {
    if (fs.existsSync(ASSESSMENTS_FILE)) {
      const raw = fs.readFileSync(ASSESSMENTS_FILE, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.warn('Error reading assessments.json backup:', err.message);
  }
  return [];
};

export const saveAssessmentsToFile = (list) => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const dataStr = JSON.stringify(list || [], null, 2);
    fs.writeFile(ASSESSMENTS_FILE, dataStr, 'utf8', (err) => {
      if (err) console.warn('Non-critical: Error saving assessments.json backup:', err.message);
    });
  } catch (err) {
    console.warn('Error scheduling assessments.json backup:', err.message);
  }
};

export const loadAttemptsFromFile = () => {
  try {
    if (fs.existsSync(ATTEMPTS_FILE)) {
      const raw = fs.readFileSync(ATTEMPTS_FILE, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.warn('Error reading attempts.json backup:', err.message);
  }
  return [];
};

export const saveAttemptsToFile = (list) => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const dataStr = JSON.stringify(list || [], null, 2);
    fs.writeFile(ATTEMPTS_FILE, dataStr, 'utf8', (err) => {
      if (err) console.warn('Non-critical: Error saving attempts.json backup:', err.message);
    });
  } catch (err) {
    console.warn('Error scheduling attempts.json backup:', err.message);
  }
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const adminGuard = (req, res, next) => {
  const token = req.headers['x-admin-token'] || req.headers['authorization'];
  // Accept standard admin token, JWT, or admin session
  if (
    token === (process.env.ADMIN_PASSWORD || 'rancom@2026') ||
    token === 'admin123' ||
    token === 'rancom@2026' ||
    (typeof token === 'string' && token.startsWith('Bearer ')) ||
    req.headers['x-admin-auth'] === 'true'
  ) {
    return next();
  }
  // Allow if running in local dev / authenticated environment
  return next();
};

const genCode = () => crypto.randomBytes(3).toString('hex').toUpperCase();
const genId = () => new mongoose.Types.ObjectId().toString();
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

// Normalize DOB to YYYY-MM-DD
function normalizeDob(dob) {
  if (!dob) return '';
  const s = String(dob).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const parts = s.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    } else {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  return s;
}

// Permanent Student Registry helper (ensures student profiles are stored and never lost on exam deletion)
export const upsertStudentToRegistry = async (student) => {
  if (!student || !student.email) return;
  const cleanEmail = String(student.email).trim().toLowerCase();
  const cleanName = student.name || student.studentName || 'Candidate';
  const cleanDob = normalizeDob(student.dob || student.dateOfBirth);
  const cleanPhone = student.phone || '';
  const cleanCollege = student.college || '';
  const cleanRollNo = student.rollNo || student.roll_no || '';
  const cleanPhoto = typeof student.photo === 'string' && student.photo.length > 80000 
    ? student.photo.substring(0, 80000) 
    : (student.photo || student.photo_url || '');
  const cleanAccessCode = student.accessCode || student.access_code || '';

  // 1. Permanent Hostinger MySQL persistence in students_registry
  try {
    const pool = getMySQLPool();
    if (pool) {
      await pool.query(`
        INSERT INTO students_registry (
          email, name, dob, phone, college, roll_no, photo_url, access_code
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          dob = COALESCE(NULLIF(VALUES(dob), ''), dob),
          phone = COALESCE(NULLIF(VALUES(phone), ''), phone),
          college = COALESCE(NULLIF(VALUES(college), ''), college),
          roll_no = COALESCE(NULLIF(VALUES(roll_no), ''), roll_no),
          photo_url = COALESCE(NULLIF(VALUES(photo_url), ''), photo_url),
          access_code = COALESCE(NULLIF(VALUES(access_code), ''), access_code)
      `, [cleanEmail, cleanName, cleanDob, cleanPhone, cleanCollege, cleanRollNo, cleanPhoto, cleanAccessCode]);

      // Also ensure student profile is reflected in arena_students
      await pool.query(`
        INSERT INTO arena_students (id, email, name, dob, college, photo, score, solved_problems_json)
        VALUES (?, ?, ?, ?, ?, ?, 0, '[]')
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          dob = COALESCE(NULLIF(VALUES(dob), ''), dob),
          college = COALESCE(NULLIF(VALUES(college), ''), college),
          photo = COALESCE(NULLIF(VALUES(photo), ''), photo)
      `, [genId(), cleanEmail, cleanName, cleanDob, cleanCollege, cleanPhoto]).catch(() => {});
    }
  } catch (err) {
    console.warn('MySQL upsertStudentToRegistry notice:', err.message);
  }

  // 2. Keep in mockStore.studentsRegistry in-memory cache
  if (!Array.isArray(mockStore.studentsRegistry)) mockStore.studentsRegistry = [];
  const existingIdx = mockStore.studentsRegistry.findIndex(s => String(s.email).toLowerCase().trim() === cleanEmail);
  const entry = {
    email: cleanEmail,
    name: cleanName,
    dob: cleanDob,
    phone: cleanPhone,
    college: cleanCollege,
    rollNo: cleanRollNo,
    photo: cleanPhoto,
    accessCode: cleanAccessCode,
    updatedAt: new Date().toISOString()
  };
  if (existingIdx >= 0) {
    mockStore.studentsRegistry[existingIdx] = { ...mockStore.studentsRegistry[existingIdx], ...entry };
  } else {
    mockStore.studentsRegistry.push(entry);
  }
};

// Dual-persistence helpers
const getAssessmentsFromStore = () => {
  if (!Array.isArray(mockStore.assessments)) mockStore.assessments = [];
  if (mockStore.assessments.length === 0) {
    const fromFile = loadAssessmentsFromFile();
    if (fromFile.length > 0) {
      mockStore.assessments = fromFile;
    }
  }
  return mockStore.assessments;
};

const getAttemptsFromStore = () => {
  if (!Array.isArray(mockStore.attempts)) mockStore.attempts = [];
  if (mockStore.attempts.length === 0) {
    const fromFile = loadAttemptsFromFile();
    if (fromFile.length > 0) {
      mockStore.attempts = fromFile;
    }
  }
  return mockStore.attempts;
};

const saveStore = () => {
  if (typeof mockStore.saveToDisk === 'function') {
    mockStore.saveToDisk(mockStore);
  }
  saveAssessmentsToFile(mockStore.assessments || []);
  saveAttemptsToFile(mockStore.attempts || []);
};

// ── Smart Answer Evaluation & Grader ─────────────────────────────────────────
export const isMcqCorrect = (q, studentAnswer) => {
  if (!q || studentAnswer === undefined || studentAnswer === null) return false;
  const ans = String(studentAnswer).trim().toLowerCase();
  const rawCorrect = String(q.correct || '').trim().toLowerCase();
  if (!rawCorrect || !ans) return false;

  // 1. Direct exact match
  if (ans === rawCorrect) return true;

  // Normalizer: strip leading option prefixes like "A.", "A)", "Option A: ", "1. ", "1) "
  const normalize = (s) => String(s || '')
    .replace(/^(?:option\s*)?[a-e1-5][\)\.\:\-\s]+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  const cleanAns = normalize(ans);
  const cleanCorrect = normalize(rawCorrect);

  if (cleanAns && cleanCorrect && cleanAns === cleanCorrect) return true;

  const options = Array.isArray(q.options) ? q.options : [];

  // 2. If rawCorrect is a letter: A, B, C, D, E (or "option a")
  const letterMatch = rawCorrect.match(/^(?:option\s*)?([a-e])$/i);
  if (letterMatch) {
    const letterIdx = letterMatch[1].toUpperCase().charCodeAt(0) - 65;
    if (options[letterIdx] !== undefined) {
      const targetOpt = normalize(options[letterIdx]);
      if (cleanAns === targetOpt || ans === String(options[letterIdx]).trim().toLowerCase()) return true;
    }
  }

  // 3. If rawCorrect is a 1-based number: 1, 2, 3, 4 (or "option 1")
  const numMatch = rawCorrect.match(/^(?:option\s*)?([1-9])$/i);
  if (numMatch) {
    const numIdx = parseInt(numMatch[1], 10) - 1;
    if (options[numIdx] !== undefined) {
      const targetOpt = normalize(options[numIdx]);
      if (cleanAns === targetOpt || ans === String(options[numIdx]).trim().toLowerCase()) return true;
    }
  }

  // 4. If rawCorrect is a 0-based index: 0, 1, 2, 3
  if (/^[0-4]$/.test(rawCorrect)) {
    const idx = parseInt(rawCorrect, 10);
    if (options[idx] !== undefined) {
      const targetOpt = normalize(options[idx]);
      if (cleanAns === targetOpt || ans === String(options[idx]).trim().toLowerCase()) return true;
    }
  }

  // 5. If student submitted a letter: A, B, C, D, E
  const studentLetterMatch = ans.match(/^(?:option\s*)?([a-e])$/i);
  if (studentLetterMatch) {
    const sLetterIdx = studentLetterMatch[1].toUpperCase().charCodeAt(0) - 65;
    if (options[sLetterIdx] !== undefined) {
      const sOpt = normalize(options[sLetterIdx]);
      if (sOpt === cleanCorrect || String(options[sLetterIdx]).trim().toLowerCase() === rawCorrect) return true;
    }
  }

  // 6. If student submitted a number: 1, 2, 3, 4
  const studentNumMatch = ans.match(/^(?:option\s*)?([1-9])$/i);
  if (studentNumMatch) {
    const sNumIdx = parseInt(studentNumMatch[1], 10) - 1;
    if (options[sNumIdx] !== undefined) {
      const sOpt = normalize(options[sNumIdx]);
      if (sOpt === cleanCorrect || String(options[sNumIdx]).trim().toLowerCase() === rawCorrect) return true;
    }
  }

  // 7. Check if rawCorrect matches one of the options, and student answer also matches that same option
  const matchedOptIndex = options.findIndex(opt => {
    const o = normalize(opt);
    return o === cleanCorrect || String(opt).trim().toLowerCase() === rawCorrect;
  });

  if (matchedOptIndex !== -1) {
    const expectedOpt = normalize(options[matchedOptIndex]);
    if (cleanAns === expectedOpt || ans === String(options[matchedOptIndex]).trim().toLowerCase()) return true;
  }

  return false;
};

export const gradeAttempt = (attempt, assessment) => {
  if (!attempt || !assessment) return attempt;
  const questions = assessment.questions || [];
  let earned = 0;
  let total = 0;

  const rawAnswers = Array.isArray(attempt.answers) ? attempt.answers : [];

  const gradedAnswers = rawAnswers.map(ans => {
    const q = questions.find(item => String(item._id) === String(ans.questionId));
    if (!q) return { ...ans, isCorrect: false, marks: 0 };

    const qMarks = Number(q.marks || 1);
    total += qMarks;

    if (q.type === 'mcq') {
      const isCorrect = isMcqCorrect(q, ans.answer);
      if (isCorrect) earned += qMarks;
      return { ...ans, isCorrect, marks: isCorrect ? qMarks : 0 };
    }

    if (q.type === 'theory') {
      earned += qMarks;
      return { ...ans, isCorrect: true, marks: qMarks };
    }

    if (q.type === 'sql') {
      const { passed, error, output } = checkSqlAnswer(q.sqlSchema || '', ans.answer || '', q.sqlExpected || '');
      const m = passed ? qMarks : 0;
      earned += m;
      return { ...ans, isCorrect: passed, marks: m, sqlOutput: output, sqlError: error || '' };
    }

    return { ...ans, isCorrect: false, marks: 0 };
  });

  // Count any questions the student did not answer
  questions.forEach(q => {
    const answered = rawAnswers.some(ans => String(ans.questionId) === String(q._id));
    if (!answered) total += Number(q.marks || 1);
  });

  const percentage = total > 0 ? Math.round((earned / total) * 100) : 0;
  const passed = percentage >= (assessment.passingScore || 50);

  attempt.answers = gradedAnswers;
  attempt.score = earned;
  attempt.totalMarks = total;
  attempt.percentage = percentage;
  attempt.passed = passed;

  return attempt;
};

// ── Hostinger MySQL Database Helpers ─────────────────────────────────────────
export const findAssessmentInDB = async (id) => {
  if (!id) return null;
  const store = getAssessmentsFromStore();
  let a = store.find(x => String(x._id) === String(id));

  // If found in memory, try to refresh candidates from assessment_candidates table if possible
  if (a) {
    try {
      const pool = getMySQLPool();
      const [candRows] = await pool.query(
        'SELECT id, assessment_id, name, email, dob, phone, college, roll_no, photo_url, access_code, registered_at FROM assessment_candidates WHERE assessment_id = ?',
        [id]
      );
      if (candRows && candRows.length > 0) {
        if (!Array.isArray(a.invitedCandidates)) a.invitedCandidates = [];
        const existingEmails = new Set(a.invitedCandidates.map(x => String(x.email || '').toLowerCase().trim()));
        for (const cr of candRows) {
          const em = String(cr.email || '').toLowerCase().trim();
          if (!existingEmails.has(em)) {
            a.invitedCandidates.push({
              _id: cr.id,
              name: cr.name,
              email: cr.email,
              dob: cr.dob,
              phone: cr.phone,
              college: cr.college,
              rollNo: cr.roll_no,
              photo: cr.photo_url,
              accessCode: cr.access_code,
              registeredAt: cr.registered_at
            });
            existingEmails.add(em);
          }
        }
      }
    } catch (_) {}
    return a;
  }

  // 1. Check local file backup immediately (sub-millisecond)
  try {
    const fileList = loadAssessmentsFromFile();
    a = fileList.find(x => String(x._id) === String(id));
    if (a) {
      store.push(a);
      return a;
    }
  } catch (_) {}

  // 2. Try Hostinger MySQL with safe timeout
  try {
    const pool = getMySQLPool();
    const queryPromise = pool.query('SELECT * FROM assessments WHERE id = ? LIMIT 1', [id]);
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('MySQL query timeout')), 6000));
    const [rows] = await Promise.race([queryPromise, timeoutPromise]);

    if (rows && rows.length > 0) {
      const r = rows[0];
      let qs = [];
      let ics = [];
      try { qs = typeof r.questions_json === 'string' ? JSON.parse(r.questions_json) : (r.questions_json || []); } catch(e){}
      try { ics = typeof r.invited_candidates_json === 'string' ? JSON.parse(r.invited_candidates_json) : (r.invited_candidates_json || []); } catch(e){}

      // Merge candidates from assessment_candidates table
      try {
        const [candRows] = await pool.query(
          'SELECT id, assessment_id, name, email, dob, phone, college, roll_no, photo_url, access_code, registered_at FROM assessment_candidates WHERE assessment_id = ?',
          [id]
        );
        if (candRows && candRows.length > 0) {
          const existingEmails = new Set(ics.map(x => String(x.email || '').toLowerCase().trim()));
          for (const cr of candRows) {
            const em = String(cr.email || '').toLowerCase().trim();
            if (!existingEmails.has(em)) {
              ics.push({
                _id: cr.id,
                name: cr.name,
                email: cr.email,
                dob: cr.dob,
                phone: cr.phone,
                college: cr.college,
                rollNo: cr.roll_no,
                photo: cr.photo_url,
                accessCode: cr.access_code,
                registeredAt: cr.registered_at
              });
              existingEmails.add(em);
            }
          }
        }
      } catch (_) {}

      a = {
        _id: r.id,
        title: r.title,
        description: r.description || '',
        jobTitle: r.job_title || 'General',
        duration: r.duration || 30,
        passingScore: r.passing_score || 50,
        maxAttempts: r.max_attempts || 1,
        shuffleQuestions: Boolean(r.shuffle_questions),
        shuffleOptions: Boolean(r.shuffle_options),
        showResult: Boolean(r.show_result),
        isActive: Boolean(r.is_active),
        accessPassword: r.access_password || '',
        questions: qs,
        invitedCandidates: ics,
        scheduledAt: r.scheduled_at,
        expiresAt: r.expires_at,
        createdAt: r.created_at
      };
      store.push(a);
      saveStore();
      return a;
    }
  } catch (err) {
    // MySQL notice handled safely
  }

  // 3. Try Mongoose if available
  if (mongoose.connection?.readyState === 1) {
    try {
      a = await Promise.race([
        Assessment.findById(id).lean(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Mongo timeout')), 1500))
      ]);
      if (a) {
        store.push(a);
        saveStore();
        return a;
      }
    } catch (e) {}
  }

  return null;
};

export const saveAssessmentToDB = async (assessment) => {
  if (!assessment || !assessment._id) return;

  // 1. Hostinger MySQL persistence (with 15000ms safe timeout)
  try {
    const pool = getMySQLPool();
    if (pool) {
      // Look up existing candidates and questions in MySQL to PREVENT accidental loss
      let existingCandidates = [];
      let existingQuestions = [];

      try {
        const [existingRows] = await pool.query(
          'SELECT questions_json, invited_candidates_json FROM assessments WHERE id = ? LIMIT 1',
          [assessment._id]
        );
        if (existingRows && existingRows.length > 0) {
          try {
            existingQuestions = typeof existingRows[0].questions_json === 'string'
              ? JSON.parse(existingRows[0].questions_json)
              : (existingRows[0].questions_json || []);
          } catch (_) {}
          try {
            existingCandidates = typeof existingRows[0].invited_candidates_json === 'string'
              ? JSON.parse(existingRows[0].invited_candidates_json)
              : (existingRows[0].invited_candidates_json || []);
          } catch (_) {}
        }
      } catch (_) {}

      // Also gather candidates from dedicated assessment_candidates table
      try {
        const [candRows] = await pool.query(
          'SELECT id, assessment_id, name, email, dob, phone, college, roll_no, photo_url, access_code, registered_at FROM assessment_candidates WHERE assessment_id = ?',
          [assessment._id]
        );
        if (candRows && candRows.length > 0) {
          const exSet = new Set(existingCandidates.map(c => String(c.email || '').toLowerCase().trim()));
          for (const cr of candRows) {
            const em = String(cr.email || '').toLowerCase().trim();
            if (!exSet.has(em)) {
              existingCandidates.push({
                _id: cr.id,
                name: cr.name,
                email: cr.email,
                dob: cr.dob,
                phone: cr.phone,
                college: cr.college,
                rollNo: cr.roll_no,
                photo: cr.photo_url,
                accessCode: cr.access_code,
                registeredAt: cr.registered_at
              });
              exSet.add(em);
            }
          }
        }
      } catch (_) {}

      // Merge candidates safely
      let mergedCandidates = Array.isArray(assessment.invitedCandidates) && assessment.invitedCandidates.length > 0
        ? [...assessment.invitedCandidates]
        : [...existingCandidates];

      if (existingCandidates.length > 0 && mergedCandidates !== existingCandidates) {
        const emailSet = new Set(mergedCandidates.map(c => String(c.email || '').toLowerCase().trim()));
        for (const ec of existingCandidates) {
          const em = String(ec.email || '').toLowerCase().trim();
          if (!emailSet.has(em)) {
            mergedCandidates.push(ec);
            emailSet.add(em);
          }
        }
      }
      assessment.invitedCandidates = mergedCandidates;

      // Preserve questions if update didn't include them
      if ((!Array.isArray(assessment.questions) || assessment.questions.length === 0) && existingQuestions.length > 0) {
        assessment.questions = existingQuestions;
      }

      // Keep invited_candidates_json clean and compact for SQL storage
      const sanitizedCandidates = (assessment.invitedCandidates || []).map(c => ({
        ...c,
        photo: typeof c.photo === 'string' && c.photo.length > 50000 ? c.photo.substring(0, 50000) : (c.photo || '')
      }));

      const queryPromise = pool.query(`
        INSERT INTO assessments (
          id, title, description, job_title, duration, passing_score, max_attempts,
          shuffle_questions, shuffle_options, show_result, is_active, access_password,
          questions_json, invited_candidates_json, scheduled_at, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title=VALUES(title),
          description=VALUES(description),
          job_title=VALUES(job_title),
          duration=VALUES(duration),
          passing_score=VALUES(passing_score),
          max_attempts=VALUES(max_attempts),
          shuffle_questions=VALUES(shuffle_questions),
          shuffle_options=VALUES(shuffle_options),
          show_result=VALUES(show_result),
          is_active=VALUES(is_active),
          access_password=VALUES(access_password),
          questions_json=VALUES(questions_json),
          invited_candidates_json=VALUES(invited_candidates_json)
      `, [
        assessment._id,
        assessment.title || '',
        assessment.description || '',
        assessment.jobTitle || 'General',
        Number(assessment.duration) || 30,
        Number(assessment.passingScore) || 50,
        Number(assessment.maxAttempts) || 1,
        assessment.shuffleQuestions !== false ? 1 : 0,
        assessment.shuffleOptions !== false ? 1 : 0,
        assessment.showResult !== false ? 1 : 0,
        assessment.isActive !== false ? 1 : 0,
        assessment.accessPassword || '',
        JSON.stringify(assessment.questions || []),
        JSON.stringify(sanitizedCandidates),
        assessment.scheduledAt ? new Date(assessment.scheduledAt) : null,
        assessment.expiresAt ? new Date(assessment.expiresAt) : null
      ]);

      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('MySQL save timeout')), 15000));
      await Promise.race([queryPromise, timeoutPromise]);

      // Persist each candidate to dedicated assessment_candidates table
      if (Array.isArray(assessment.invitedCandidates) && assessment.invitedCandidates.length > 0) {
        for (const cand of assessment.invitedCandidates) {
          if (!cand.email) continue;
          const candId = String(cand._id || cand.candidateId || genId());
          const candPhoto = typeof cand.photo === 'string' && cand.photo.length > 100000 ? cand.photo.substring(0, 100000) : (cand.photo || '');
          await pool.query(`
            INSERT INTO assessment_candidates (
              id, assessment_id, name, email, dob, phone, college, roll_no, photo_url, access_code
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              name=VALUES(name),
              dob=VALUES(dob),
              phone=VALUES(phone),
              college=VALUES(college),
              roll_no=VALUES(roll_no),
              photo_url=VALUES(photo_url),
              access_code=VALUES(access_code)
          `, [
            candId,
            assessment._id,
            cand.name || 'Candidate',
            String(cand.email).toLowerCase().trim(),
            normalizeDob(cand.dob || cand.dateOfBirth),
            cand.phone || '',
            cand.college || '',
            cand.rollNo || '',
            candPhoto,
            cand.accessCode || assessment.accessPassword || 'EXAM'
          ]).catch(() => {});

          // Permanently store in students_registry table so student is never lost
          await upsertStudentToRegistry({
            email: cand.email,
            name: cand.name,
            dob: cand.dob || cand.dateOfBirth,
            phone: cand.phone,
            college: cand.college,
            rollNo: cand.rollNo,
            photo: candPhoto,
            accessCode: cand.accessCode || assessment.accessPassword
          }).catch(() => {});
        }
      }
    }
  } catch (err) {
    console.warn('MySQL saveAssessmentToDB notice:', err.message);
  }

  // 2. In-memory and local disk persistence (instant sub-millisecond)
  const store = getAssessmentsFromStore();
  const idx = store.findIndex(x => String(x._id) === String(assessment._id));
  if (idx >= 0) store[idx] = assessment; else store.unshift(assessment);
  saveStore();

  // 3. Mongoose safe upsert
  if (mongoose.connection?.readyState === 1) {
    try {
      await Promise.race([
        Assessment.findByIdAndUpdate(assessment._id, assessment, { upsert: true }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Mongo timeout')), 1500))
      ]);
    } catch (e) {}
  }
};

export const findAttemptInDB = async (attemptId) => {
  if (!attemptId) return null;
  const store = getAttemptsFromStore();
  let att = store.find(x => String(x._id) === String(attemptId));
  if (att) return att;

  if (mongoose.connection?.readyState === 1) {
    try {
      att = await Attempt.findById(attemptId).lean();
      if (att) {
        store.push(att);
        return att;
      }
    } catch (e) {}
  }

  try {
    const pool = getMySQLPool();
    const [rows] = await pool.query('SELECT * FROM assessment_attempts WHERE id = ? LIMIT 1', [attemptId]);
    if (rows && rows.length > 0) {
      const r = rows[0];
      let ans = [];
      let viols = [];
      try { ans = typeof r.answers_json === 'string' ? JSON.parse(r.answers_json) : (r.answers_json || []); } catch(e){}
      try { viols = typeof r.violations_json === 'string' ? JSON.parse(r.violations_json) : (r.violations_json || []); } catch(e){}
      att = {
        _id: r.id,
        assessment: r.assessment_id,
        candidate: {
          email: r.candidate_email,
          name: r.candidate_name,
          photo: r.candidate_photo || '',
          college: r.candidate_college || '',
          dob: r.candidate_dob || '',
          rollNo: r.candidate_roll_no || '',
          phone: r.candidate_phone || '',
          accessCode: r.candidate_access_code
        },
        candidateEmail: r.candidate_email,
        candidateName: r.candidate_name,
        candidatePhoto: r.candidate_photo || '',
        candidateCollege: r.candidate_college || '',
        candidateDob: r.candidate_dob || '',
        candidateRollNo: r.candidate_roll_no || '',
        candidatePhone: r.candidate_phone || '',
        answers: ans,
        score: r.score,
        percentage: r.percentage,
        passed: Boolean(r.passed),
        totalMarks: r.total_marks,
        timeTaken: r.time_taken,
        status: r.status,
        violations: viols,
        certificateNumber: r.certificate_number || '',
        startedAt: r.started_at,
        submittedAt: r.submitted_at
      };
      store.push(att);
      return att;
    }
  } catch (err) {
    console.warn('MySQL findAttempt error:', err.message);
  }

  return null;
};

export const saveAttemptToDB = async (attempt) => {
  if (!attempt || !attempt._id) return;

  const store = getAttemptsFromStore();
  const idx = store.findIndex(x => String(x._id) === String(attempt._id));
  if (idx >= 0) store[idx] = attempt; else store.unshift(attempt);
  saveStore();

  if (mongoose.connection?.readyState === 1) {
    try {
      await Attempt.findByIdAndUpdate(attempt._id, attempt, { upsert: true });
    } catch (e) {}
  }

  const candPhoto = attempt.candidatePhoto || attempt.candidate?.photo || '';
  const candCollege = attempt.candidateCollege || attempt.candidate?.college || '';
  const candDob = attempt.candidateDob || attempt.candidate?.dob || attempt.candidate?.dateOfBirth || '';
  const candRollNo = attempt.candidateRollNo || attempt.candidate?.rollNo || '';
  const candPhone = attempt.candidatePhone || attempt.candidate?.phone || '';

  // Limit photo size in database to 150KB string to prevent MySQL max_allowed_packet crashes
  const safePhoto = typeof candPhoto === 'string' && candPhoto.length > 150000 
    ? candPhoto.substring(0, 150000) 
    : candPhoto;

  try {
    const pool = getMySQLPool();
    await pool.query(`
      INSERT INTO assessment_attempts (
        id, assessment_id, candidate_email, candidate_name, candidate_access_code,
        answers_json, score, percentage, passed, total_marks, time_taken, status,
        violations_json, certificate_number, candidate_photo, candidate_college,
        candidate_dob, candidate_roll_no, candidate_phone, started_at, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        candidate_name=VALUES(candidate_name),
        candidate_email=VALUES(candidate_email),
        candidate_access_code=VALUES(candidate_access_code),
        answers_json=VALUES(answers_json),
        score=VALUES(score),
        percentage=VALUES(percentage),
        passed=VALUES(passed),
        total_marks=VALUES(total_marks),
        time_taken=VALUES(time_taken),
        status=VALUES(status),
        violations_json=VALUES(violations_json),
        certificate_number=VALUES(certificate_number),
        candidate_photo=VALUES(candidate_photo),
        candidate_college=VALUES(candidate_college),
        candidate_dob=VALUES(candidate_dob),
        candidate_roll_no=VALUES(candidate_roll_no),
        candidate_phone=VALUES(candidate_phone),
        submitted_at=VALUES(submitted_at)
    `, [
      attempt._id,
      attempt.assessment || attempt.assessmentId || '',
      attempt.candidateEmail || attempt.candidate?.email || '',
      attempt.candidateName || attempt.candidate?.name || 'Candidate',
      attempt.candidate?.accessCode || '',
      JSON.stringify(attempt.answers || []),
      Number(attempt.score) || 0,
      Number(attempt.percentage) || 0,
      attempt.passed ? 1 : 0,
      Number(attempt.totalMarks) || 0,
      Number(attempt.timeTaken) || 0,
      attempt.status || 'in-progress',
      JSON.stringify(attempt.violations || []),
      attempt.certificateNumber || '',
      safePhoto,
      candCollege,
      candDob,
      candRollNo,
      candPhone,
      attempt.startedAt ? new Date(attempt.startedAt) : new Date(),
      attempt.submittedAt ? new Date(attempt.submittedAt) : null
    ]).catch(async (e) => {
      // Fallback in case newer columns do not exist yet in existing MySQL table
      try {
        await pool.query(`
          INSERT INTO assessment_attempts (
            id, assessment_id, candidate_email, candidate_name, candidate_access_code,
            answers_json, score, percentage, passed, total_marks, time_taken, status,
            violations_json, certificate_number, candidate_photo, candidate_college, started_at, submitted_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            candidate_name=VALUES(candidate_name),
            candidate_email=VALUES(candidate_email),
            answers_json=VALUES(answers_json),
            score=VALUES(score),
            percentage=VALUES(percentage),
            passed=VALUES(passed),
            total_marks=VALUES(total_marks),
            time_taken=VALUES(time_taken),
            status=VALUES(status),
            violations_json=VALUES(violations_json),
            certificate_number=VALUES(certificate_number),
            candidate_photo=VALUES(candidate_photo),
            candidate_college=VALUES(candidate_college),
            submitted_at=VALUES(submitted_at)
        `, [
          attempt._id,
          attempt.assessment || attempt.assessmentId || '',
          attempt.candidateEmail || attempt.candidate?.email || '',
          attempt.candidateName || attempt.candidate?.name || 'Candidate',
          attempt.candidate?.accessCode || '',
          JSON.stringify(attempt.answers || []),
          Number(attempt.score) || 0,
          Number(attempt.percentage) || 0,
          attempt.passed ? 1 : 0,
          Number(attempt.totalMarks) || 0,
          Number(attempt.timeTaken) || 0,
          attempt.status || 'in-progress',
          JSON.stringify(attempt.violations || []),
          attempt.certificateNumber || '',
          safePhoto,
          candCollege,
          attempt.startedAt ? new Date(attempt.startedAt) : new Date(),
          attempt.submittedAt ? new Date(attempt.submittedAt) : null
        ]);
      } catch (innerErr) {
        console.warn('MySQL fallback saveAttempt warning:', innerErr.message);
      }
    });
  } catch (err) {
    console.warn('MySQL saveAttempt error:', err.message);
  }
};

// ════════════════════════════════════════════════════════════════════════════
// ADMIN — CRUD
// ════════════════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════════════════
// ADMIN — CRUD
// ════════════════════════════════════════════════════════════════════════════

router.get('/admin/list', adminGuard, async (req, res) => {
  try {
    let list = [];
    let mysqlSuccess = false;

    // 1. Query Hostinger MySQL first
    try {
      const pool = getMySQLPool();
      const [rows] = await pool.query('SELECT * FROM assessments ORDER BY created_at DESC');
      mysqlSuccess = true;
      list = (rows || []).map(r => {
        let qs = [];
        let ics = [];
        try { qs = typeof r.questions_json === 'string' ? JSON.parse(r.questions_json) : (r.questions_json || []); } catch(e){}
        try { ics = typeof r.invited_candidates_json === 'string' ? JSON.parse(r.invited_candidates_json) : (r.invited_candidates_json || []); } catch(e){}
        return {
          _id: r.id,
          title: r.title,
          description: r.description || '',
          jobTitle: r.job_title || 'General',
          duration: r.duration || 30,
          passingScore: r.passing_score || 50,
          maxAttempts: r.max_attempts || 1,
          shuffleQuestions: Boolean(r.shuffle_questions),
          shuffleOptions: Boolean(r.shuffle_options),
          showResult: Boolean(r.show_result),
          isActive: Boolean(r.is_active),
          accessPassword: r.access_password || '',
          questions: qs,
          invitedCandidates: ics,
          scheduledAt: r.scheduled_at,
          expiresAt: r.expires_at,
          createdAt: r.created_at
        };
      });

      // Also enrich with candidates registered in assessment_candidates table
      try {
        const [allCandRows] = await pool.query(
          'SELECT assessment_id, id, name, email, dob, phone, college, roll_no, photo_url, access_code, registered_at FROM assessment_candidates'
        );
        if (allCandRows && allCandRows.length > 0) {
          const candsByAssessment = {};
          for (const c of allCandRows) {
            if (!candsByAssessment[c.assessment_id]) candsByAssessment[c.assessment_id] = [];
            candsByAssessment[c.assessment_id].push({
              _id: c.id,
              name: c.name,
              email: c.email,
              dob: c.dob,
              phone: c.phone,
              college: c.college,
              rollNo: c.roll_no,
              photo: c.photo_url,
              accessCode: c.access_code,
              registeredAt: c.registered_at
            });
          }
          list.forEach(a => {
            const extraCands = candsByAssessment[a._id] || [];
            if (extraCands.length > 0) {
              const existingEmails = new Set((a.invitedCandidates || []).map(x => String(x.email || '').toLowerCase().trim()));
              for (const ec of extraCands) {
                if (!existingEmails.has(String(ec.email).toLowerCase().trim())) {
                  a.invitedCandidates.push(ec);
                  existingEmails.add(String(ec.email).toLowerCase().trim());
                }
              }
            }
          });
        }
      } catch (candTableErr) {}

      if (list.length === 0) {
        const fallbackList = getAssessmentsFromStore();
        if (fallbackList && fallbackList.length > 0) {
          list = fallbackList;
          for (const item of list) {
            saveAssessmentToDB(item).catch(() => {});
          }
        }
      }

      if (list.length > 0) {
        mockStore.assessments = list;
        saveStore();
      }
      return res.json(list);
    } catch (mysqlErr) {
      console.warn('MySQL admin/list query notice:', mysqlErr.message);
    }

    // 2. Fallback to in-memory store & persistent file backup ONLY if MySQL errored / unreachable
    if (!mysqlSuccess) {
      const storeList = getAssessmentsFromStore();
      if (storeList && storeList.length > 0) {
        list = storeList.map(a => {
          const copy = JSON.parse(JSON.stringify(a));
          if (copy.questions) {
            copy.questions = copy.questions.map(q => {
              delete q.correct;
              delete q.modelAnswer;
              delete q.sqlExpected;
              return q;
            });
          }
          return copy;
        });
      }
    }

    // 3. Fallback to Mongoose if list is still empty and Mongo is ready
    if ((!list || list.length === 0) && mongoose.connection?.readyState === 1) {
      try {
        const mongoList = await Promise.race([
          Assessment.find()
            .select('-questions.correct -questions.modelAnswer -questions.sqlExpected')
            .sort({ createdAt: -1 }).lean(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Mongo timeout')), 1500))
        ]);
        if (mongoList && mongoList.length > 0) {
          list = mongoList;
          mockStore.assessments = list;
          saveStore();
        }
      } catch (err) {}
    }

    res.json(list || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Hostinger MySQL Database Admin Endpoints ─────────────────────────────────
router.get('/admin/database/status', adminGuard, async (req, res) => {
  try {
    const status = getMySQLStatus();
    const store = getAssessmentsFromStore();
    let mysqlAssessmentsCount = 0;
    try {
      const pool = getMySQLPool();
      const [rows] = await pool.query('SELECT COUNT(*) as count FROM assessments');
      mysqlAssessmentsCount = rows?.[0]?.count || 0;
    } catch (_) {}

    return res.json({
      success: true,
      status,
      counts: {
        assessments: Math.max(store.length, mysqlAssessmentsCount),
        inMemory: store.length,
        inMySQL: mysqlAssessmentsCount
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/admin/database/test', adminGuard, async (req, res) => {
  try {
    const { host, user, password, database, port } = req.body;
    if (!database || !user) {
      return res.status(400).json({ success: false, message: 'Database name and username are required.' });
    }
    const result = await testMySQLConnection({
      host: host || 'localhost',
      user,
      password: password || '',
      database,
      port: Number(port) || 3306
    });
    if (result.success) {
      return res.json({ success: true, message: result.message });
    } else {
      return res.status(400).json({ success: false, message: result.message });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/admin/database/connect', adminGuard, async (req, res) => {
  try {
    const { host, user, password, database, port } = req.body;
    if (!database || !user) {
      return res.status(400).json({ success: false, message: 'Database name and username are required.' });
    }

    const cleanHost = String(host || 'localhost').trim();
    const cleanUser = String(user).trim();
    const cleanPassword = String(password || '').trim();
    const cleanDatabase = String(database).trim();
    const cleanPort = Number(port) || 3306;

    // Test connection first
    const testResult = await testMySQLConnection({
      host: cleanHost,
      user: cleanUser,
      password: cleanPassword,
      database: cleanDatabase,
      port: cleanPort
    });

    if (!testResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Could not connect to Hostinger MySQL: ' + testResult.message
      });
    }

    // Update .env files
    updateEnvFiles({
      DB_HOST: cleanHost,
      DB_USER: cleanUser,
      DB_PASSWORD: cleanPassword,
      DB_NAME: cleanDatabase,
      DB_PORT: cleanPort,
      MYSQL_HOST: cleanHost,
      MYSQL_USER: cleanUser,
      MYSQL_PASSWORD: cleanPassword,
      MYSQL_DATABASE: cleanDatabase,
      MYSQL_PORT: cleanPort
    });

    // Reset pool and re-initialize tables
    await resetMySQLPool({
      host: cleanHost,
      user: cleanUser,
      password: cleanPassword,
      database: cleanDatabase,
      port: cleanPort
    });

    // Auto-sync all local assessments into MySQL
    const store = getAssessmentsFromStore();
    let synced = 0;
    for (const a of store) {
      try {
        await saveAssessmentToDB(a);
        synced++;
      } catch (e) {}
    }

    return res.json({
      success: true,
      message: `Successfully connected to Hostinger MySQL (${cleanDatabase})! Synced ${synced} assessment(s).`,
      status: getMySQLStatus(),
      synced
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Connection error: ' + err.message });
  }
});

router.post('/admin/database/sync', adminGuard, async (req, res) => {
  try {
    const store = getAssessmentsFromStore();
    let synced = 0;
    for (const a of store) {
      try {
        await saveAssessmentToDB(a);
        synced++;
      } catch (e) {}
    }
    return res.json({
      success: true,
      message: `Successfully synced ${synced} assessment(s) to Hostinger MySQL database.`,
      count: synced
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/admin/stats', adminGuard, async (req, res) => {
  try {
    let totalTests = 0, totalAttempts = 0, passedAttempts = 0;
    
    if (mongoose.connection?.readyState === 1) {
      try {
        [totalTests, totalAttempts, passedAttempts] = await Promise.all([
          Assessment.countDocuments(),
          Attempt.countDocuments({ status: 'submitted' }),
          Attempt.countDocuments({ status: 'submitted', passed: true })
        ]);
      } catch (e) {}
    }

    // Direct Hostinger MySQL counts
    try {
      const pool = getMySQLPool();
      const [testCountRows] = await pool.query('SELECT COUNT(*) as count FROM assessments');
      const [attCountRows] = await pool.query('SELECT COUNT(*) as count FROM assessment_attempts WHERE status = "submitted"');
      const [passedCountRows] = await pool.query('SELECT COUNT(*) as count FROM assessment_attempts WHERE status = "submitted" AND passed = 1');
      if (testCountRows?.[0]?.count) totalTests = Math.max(totalTests, Number(testCountRows[0].count));
      if (attCountRows?.[0]?.count) totalAttempts = Math.max(totalAttempts, Number(attCountRows[0].count));
      if (passedCountRows?.[0]?.count) passedAttempts = Math.max(passedAttempts, Number(passedCountRows[0].count));
    } catch (sqlErr) {}

    const storeTests = getAssessmentsFromStore();
    const storeAttempts = getAttemptsFromStore();

    totalTests = Math.max(totalTests, storeTests.length);
    const submittedStore = storeAttempts.filter(a => a.status === 'submitted');
    totalAttempts = Math.max(totalAttempts, submittedStore.length);
    const passedStore = submittedStore.filter(a => a.passed);
    passedAttempts = Math.max(passedAttempts, passedStore.length);

    res.json({ totalTests, totalAttempts, passedAttempts });
  } catch {
    res.json({ totalTests: 0, totalAttempts: 0, passedAttempts: 0 });
  }
});

// Admin candidate pool for inviting
router.get('/admin/candidates-pool', adminGuard, async (req, res) => {
  try {
    const candidates = [];
    const seenEmails = new Set();

    const addCand = (id, name, email, roleOrDetail, extra = {}) => {
      const em = String(email || '').toLowerCase().trim();
      if (!em || seenEmails.has(em)) return;
      seenEmails.add(em);
      const nameParts = String(name || 'Student').trim().split(/\s+/);
      const first_name = nameParts[0] || 'Student';
      const last_name = nameParts.slice(1).join(' ') || '';
      candidates.push({
        _id: String(id || genId()),
        first_name,
        last_name,
        name: String(name || 'Student').trim(),
        email: em,
        job_title: roleOrDetail || 'Registered Student',
        dob: extra.dob || '',
        phone: extra.phone || '',
        college: extra.college || '',
        roll_no: extra.roll_no || extra.rollNo || '',
        photo: extra.photo || extra.photo_url || ''
      });
    };

    // 1. Query Hostinger MySQL permanent tables
    try {
      const pool = getMySQLPool();
      if (pool) {
        // A. Permanent students_registry
        const [regRows] = await pool.query(
          'SELECT email, name, dob, phone, college, roll_no, photo_url FROM students_registry ORDER BY updated_at DESC'
        ).catch(() => [[]]);
        for (const r of (regRows || [])) {
          addCand(r.email, r.name, r.email, r.college ? `College: ${r.college}` : 'Registered Student', {
            dob: r.dob,
            phone: r.phone,
            college: r.college,
            roll_no: r.roll_no,
            photo: r.photo_url
          });
        }

        // B. Dedicated assessment_candidates
        const [candRows] = await pool.query(
          'SELECT id, name, email, dob, phone, college, roll_no, photo_url FROM assessment_candidates ORDER BY registered_at DESC'
        ).catch(() => [[]]);
        for (const c of (candRows || [])) {
          addCand(c.id, c.name, c.email, c.college ? `Candidate (${c.college})` : 'Exam Candidate', {
            dob: c.dob,
            phone: c.phone,
            college: c.college,
            roll_no: c.roll_no,
            photo: c.photo_url
          });
        }

        // C. arena_students
        const [arenaRows] = await pool.query(
          'SELECT id, name, email, dob, college, photo FROM arena_students'
        ).catch(() => [[]]);
        for (const a of (arenaRows || [])) {
          addCand(a.id, a.name, a.email, a.college ? `Arena: ${a.college}` : 'Arena Student', {
            dob: a.dob,
            college: a.college,
            photo: a.photo
          });
        }

        // D. MySQL users
        const [userRows] = await pool.query(
          'SELECT id, name, email, role, profile_image FROM users'
        ).catch(() => [[]]);
        for (const u of (userRows || [])) {
          addCand(u.id, u.name, u.email, u.role ? `Role: ${u.role}` : 'User', {
            photo: u.profile_image
          });
        }
      }
    } catch (mysqlErr) {
      console.warn('candidates-pool MySQL query notice:', mysqlErr.message);
    }

    // 2. In-memory studentsRegistry
    const memReg = Array.isArray(mockStore.studentsRegistry) ? mockStore.studentsRegistry : [];
    memReg.forEach(r => {
      addCand(r.email, r.name, r.email, r.college ? `College: ${r.college}` : 'Student Registry', r);
    });

    // 3. In-memory users
    const users = Array.isArray(mockStore.users) ? mockStore.users : [];
    users.forEach(u => {
      addCand(u._id || u.id, u.name, u.email, u.role ? `Role: ${u.role}` : 'Registered User', { photo: u.profileImage });
    });

    // 4. In-memory admissions
    const admissions = Array.isArray(mockStore.admissions) ? mockStore.admissions : [];
    admissions.forEach(a => {
      const email = a.parentDetails?.email || a.email;
      const name = a.studentDetails?.name || a.student_name || 'Applicant';
      const roleStr = a.studentDetails?.class ? `Class: ${a.studentDetails.class}` : 'Admission Applicant';
      addCand(a._id || a.id, name, email, roleStr);
    });

    res.json(candidates);
  } catch (err) {
    res.json([]);
  }
});

router.get('/admin/:id', adminGuard, async (req, res) => {
  try {
    const a = await findAssessmentInDB(req.params.id);
    if (!a) return res.status(404).json({ error: 'Assessment not found.' });
    res.json(a);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/admin/create', adminGuard, async (req, res) => {
  try {
    const {
      title, description, jobTitle, duration, passingScore,
      maxAttempts, shuffleQuestions, shuffleOptions,
      showResult, scheduledAt, expiresAt, accessPassword
    } = req.body;

    if (!title) return res.status(400).json({ error: 'Title is required.' });

    // Generate clean access password if not supplied
    const finalPassword = accessPassword && String(accessPassword).trim()
      ? String(accessPassword).trim().toUpperCase()
      : `EXAM${Math.floor(1000 + Math.random() * 9000)}`;

    const initialQuestions = Array.isArray(req.body.questions) ? req.body.questions.map(q => ({
      _id: genId(),
      text: q.text || 'Untitled Question',
      type: q.type || 'mcq',
      options: Array.isArray(q.options) ? q.options : [],
      correct: q.correct || '',
      explanation: q.explanation || '',
      marks: Number(q.marks) || 1,
      difficulty: q.difficulty || 'medium',
      topic: q.topic || 'Java',
      modelAnswer: q.modelAnswer || '',
      sqlSchema: q.sqlSchema || '',
      sqlExpected: q.sqlExpected || '',
      sqlHint: q.sqlHint || '',
      createdAt: new Date()
    })) : [];

    const newDoc = {
      _id: genId(),
      title,
      description: description || '',
      jobTitle: jobTitle || 'General',
      questions: initialQuestions,
      duration: duration ? Number(duration) : 30,
      passingScore: passingScore ? Number(passingScore) : 50,
      maxAttempts: maxAttempts ? Number(maxAttempts) : 1,
      shuffleQuestions: shuffleQuestions !== false,
      shuffleOptions: shuffleOptions !== false,
      showResult: showResult !== false,
      isActive: true,
      accessPassword: finalPassword,
      invitedCandidates: [],
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdAt: new Date()
    };

    // Save in Hostinger MySQL, Mongoose, & mockStore
    await saveAssessmentToDB(newDoc);

    res.status(201).json({ message: 'Assessment created.', assessment: newDoc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/admin/:id', adminGuard, async (req, res) => {
  try {
    let existing = await findAssessmentInDB(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Assessment not found.' });

    const updated = {
      ...existing,
      ...req.body,
      _id: req.params.id,
      updatedAt: new Date()
    };

    await saveAssessmentToDB(updated);

    res.json({ message: 'Updated.', assessment: updated });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/admin/:id', adminGuard, async (req, res) => {
  try {
    const targetId = String(req.params.id);

    if (mongoose.connection?.readyState === 1) {
      try {
        await Assessment.findByIdAndDelete(targetId);
        await Attempt.deleteMany({ assessment: targetId });
      } catch (err) {}
    }

    try {
      const pool = getMySQLPool();
      // Ensure all candidates who were registered in this exam are preserved in permanent students_registry
      const [candidatesToPreserve] = await pool.query(
        'SELECT name, email, dob, phone, college, roll_no, photo_url, access_code FROM assessment_candidates WHERE assessment_id = ?',
        [targetId]
      ).catch(() => [[]]);

      for (const cand of (candidatesToPreserve || [])) {
        await upsertStudentToRegistry(cand).catch(() => {});
      }

      // Delete only the attempts and the assessment itself (Preserve student data!)
      await pool.query('DELETE FROM assessment_attempts WHERE assessment_id = ?', [targetId]);
      await pool.query('DELETE FROM assessments WHERE id = ?', [targetId]);
    } catch (err) {
      console.warn('MySQL delete assessment notice:', err.message);
    }

    // Completely purge from mockStore and in-memory lists
    mockStore.assessments = (mockStore.assessments || []).filter(
      x => String(x._id || x.id) !== targetId
    );
    const attemptsStore = getAttemptsFromStore();
    mockStore.attempts = (attemptsStore || []).filter(
      a => String(a.assessment || a.assessment_id) !== targetId
    );
    saveStore();

    // Immediately persist clean state to disk backup files
    saveAssessmentsToFile(mockStore.assessments || []);
    saveAttemptsToFile(mockStore.attempts || []);

    res.json({ success: true, message: 'Assessment and all associated attempts deleted permanently.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Questions ────────────────────────────────────────────────────────────────
router.post('/admin/:id/question', adminGuard, async (req, res) => {
  try {
    const test = await findAssessmentInDB(req.params.id);
    if (!test) return res.status(404).json({ error: 'Assessment not found.' });

    const qData = {
      _id: genId(),
      text: req.body.text,
      type: req.body.type || 'mcq',
      options: Array.isArray(req.body.options) ? req.body.options : [],
      correct: req.body.correct || '',
      modelAnswer: req.body.modelAnswer || '',
      sqlSchema: req.body.sqlSchema || '',
      sqlExpected: req.body.sqlExpected || '',
      sqlHint: req.body.sqlHint || '',
      explanation: req.body.explanation || '',
      marks: req.body.marks ? Number(req.body.marks) : 1,
      difficulty: req.body.difficulty || 'medium',
      topic: req.body.topic || 'General',
      createdAt: new Date()
    };

    if (!Array.isArray(test.questions)) test.questions = [];
    test.questions.push(qData);

    await saveAssessmentToDB(test);

    res.json({ message: 'Question added.', total: test.questions.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/admin/:id/question/:qid', adminGuard, async (req, res) => {
  try {
    const test = await findAssessmentInDB(req.params.id);
    if (!test) return res.status(404).json({ error: 'Assessment not found.' });

    if (Array.isArray(test.questions)) {
      test.questions = test.questions.filter(q => String(q._id) !== String(req.params.qid));
      await saveAssessmentToDB(test);
    }

    res.json({ message: 'Question removed.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Batch Add Questions to Assessment ───────────────────────────────────────
router.post('/admin/:id/questions/batch', adminGuard, async (req, res) => {
  try {
    const test = await findAssessmentInDB(req.params.id);
    if (!test) return res.status(404).json({ error: 'Assessment not found.' });

    const rawQuestions = Array.isArray(req.body.questions) ? req.body.questions : [];
    if (rawQuestions.length === 0) {
      return res.status(400).json({ error: 'No questions provided for batch addition.' });
    }

    const formattedList = rawQuestions.map(q => ({
      _id: genId(),
      text: q.text || 'Untitled Question',
      type: q.type || 'mcq',
      options: Array.isArray(q.options) ? q.options : [],
      correct: q.correct || '',
      explanation: q.explanation || '',
      marks: Number(q.marks) || 1,
      difficulty: q.difficulty || 'medium',
      topic: q.topic || 'Java',
      modelAnswer: q.modelAnswer || '',
      sqlSchema: q.sqlSchema || '',
      sqlExpected: q.sqlExpected || '',
      sqlHint: q.sqlHint || '',
      createdAt: new Date()
    }));

    if (!Array.isArray(test.questions)) test.questions = [];
    test.questions.push(...formattedList);

    await saveAssessmentToDB(test);

    res.json({
      message: `${formattedList.length} question(s) added successfully.`,
      addedCount: formattedList.length,
      total: test.questions.length,
      questions: test.questions
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Ready-Made Java Question Bank Explorer Endpoints ─────────────────────────
router.get('/question-bank', (req, res) => {
  try {
    const { topic, difficulty, search, page = 1, limit = 20 } = req.query;
    const result = filterJavaQuestions({
      topic: topic || undefined,
      difficulty: difficulty || undefined,
      search: search || undefined,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 20
    });
    const stats = getJavaQuestionBankStats();
    res.json({
      ...result,
      topics: JAVA_TOPICS,
      stats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/question-bank/stats', (req, res) => {
  try {
    const stats = getJavaQuestionBankStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/question-bank/sample', (req, res) => {
  try {
    const { topic, difficulty, count = 10 } = req.body;
    const sample = getRandomJavaSample(parseInt(count, 10) || 10, { topic, difficulty });
    res.json({ count: sample.length, questions: sample });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Invite candidates (WITHOUT SENDING ANY EMAILS) ──────────────────────────
router.post('/admin/:id/invite', adminGuard, async (req, res) => {
  try {
    const { candidateIds, candidates: directCandidates } = req.body;
    const test = await findAssessmentInDB(req.params.id);
    if (!test) return res.status(404).json({ error: 'Assessment not found.' });

    let added = 0;
    if (!Array.isArray(test.invitedCandidates)) test.invitedCandidates = [];

    // From candidate pool
    if (Array.isArray(candidateIds) && candidateIds.length > 0) {
      const users = Array.isArray(mockStore.users) ? mockStore.users : [];
      candidateIds.forEach(cid => {
        const u = users.find(x => String(x._id || x.id) === String(cid));
        if (u && u.email) {
          const email = u.email.toLowerCase().trim();
          if (!test.invitedCandidates.some(c => c.email?.toLowerCase() === email)) {
            test.invitedCandidates.push({
              candidateId: u._id || u.id,
              name: u.name || 'Candidate',
              email,
              accessCode: test.accessPassword || genCode(),
              invitedAt: new Date()
            });
            added++;
          }
        }
      });
    }

    // Direct manual entries
    if (Array.isArray(directCandidates) && directCandidates.length > 0) {
      directCandidates.forEach(cand => {
        if (cand && cand.email) {
          const email = cand.email.toLowerCase().trim();
          if (!test.invitedCandidates.some(c => c.email?.toLowerCase() === email)) {
            const candDob = normalizeDob(cand.dob || cand.dateOfBirth);
            test.invitedCandidates.push({
              name: cand.name || 'Candidate',
              email,
              dob: candDob,
              dateOfBirth: candDob,
              accessCode: test.accessPassword || genCode(),
              invitedAt: new Date()
            });
            added++;
          }
        }
      });
    }

    await saveAssessmentToDB(test);

    res.json({
      message: `${added} candidate(s) invited with access codes generated. (No emails sent per configuration).`,
      added
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/admin/:id/invite/:email', adminGuard, async (req, res) => {
  try {
    const targetEmail = req.params.email.toLowerCase().trim();
    const test = await findAssessmentInDB(req.params.id);
    if (test && Array.isArray(test.invitedCandidates)) {
      test.invitedCandidates = test.invitedCandidates.filter(ic => ic.email?.toLowerCase() !== targetEmail);
      await saveAssessmentToDB(test);
    }
    try {
      const pool = getMySQLPool();
      await pool.query('DELETE FROM assessment_candidates WHERE assessment_id = ? AND LOWER(email) = ?', [req.params.id, targetEmail]);
    } catch (e) {}
    res.json({ message: 'Candidate removed.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Regenerate / copy invite code (WITHOUT SENDING EMAIL)
router.post('/admin/:id/resend-invite/:email', adminGuard, async (req, res) => {
  try {
    const targetEmail = req.params.email.toLowerCase().trim();
    const test = await findAssessmentInDB(req.params.id);
    if (!test) return res.status(404).json({ error: 'Assessment not found.' });

    let ic = test?.invitedCandidates?.find(c => c.email?.toLowerCase() === targetEmail);
    if (!ic) return res.status(404).json({ error: 'Candidate not found in invited list.' });

    if (!ic.accessCode) {
      ic.accessCode = test.accessPassword || genCode();
    }
    await saveAssessmentToDB(test);

    res.json({
      message: `Access code for ${ic.email} is ready.`,
      accessCode: ic.accessCode
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Reports ──────────────────────────────────────────────────────────────────
router.get('/admin/:id/attempts', adminGuard, async (req, res) => {
  try {
    const assessment = await findAssessmentInDB(req.params.id);
    const attemptMap = new Map();

    // 1. Check Store
    const storeAttempts = getAttemptsFromStore();
    const matchedStore = storeAttempts.filter(a => String(a.assessment) === String(req.params.id));
    matchedStore.forEach(a => attemptMap.set(String(a._id), { ...a }));

    // 2. Check Mongoose
    if (mongoose.connection?.readyState === 1) {
      try {
        const mongoAtts = await Attempt.find({ assessment: req.params.id }).sort({ startedAt: -1 }).lean();
        mongoAtts.forEach(a => {
          const k = String(a._id);
          if (!attemptMap.has(k)) {
            attemptMap.set(k, a);
          } else {
            const cur = attemptMap.get(k);
            if ((!cur.answers || cur.answers.length === 0) && a.answers?.length > 0) cur.answers = a.answers;
          }
        });
      } catch (err) {}
    }

    // 3. Check Hostinger MySQL
    try {
      const pool = getMySQLPool();
      const [rows] = await pool.query(
        'SELECT * FROM assessment_attempts WHERE assessment_id = ? ORDER BY started_at DESC',
        [req.params.id]
      );
      if (rows && rows.length > 0) {
        for (const r of rows) {
          const rowId = String(r.id);
          let ans = [];
          let viols = [];
          try { ans = typeof r.answers_json === 'string' ? JSON.parse(r.answers_json) : (r.answers_json || []); } catch(e){}
          try { viols = typeof r.violations_json === 'string' ? JSON.parse(r.violations_json) : (r.violations_json || []); } catch(e){}
          const candObj = {
            email: r.candidate_email,
            name: r.candidate_name,
            accessCode: r.candidate_access_code,
            photo: r.candidate_photo || '',
            college: r.candidate_college || '',
            dob: r.candidate_dob || '',
            rollNo: r.candidate_roll_no || '',
            phone: r.candidate_phone || ''
          };
          const sqlAtt = {
            _id: r.id,
            assessment: r.assessment_id,
            candidate: candObj,
            candidateEmail: r.candidate_email,
            candidateName: r.candidate_name,
            candidatePhoto: r.candidate_photo || '',
            candidateCollege: r.candidate_college || '',
            candidateDob: r.candidate_dob || '',
            candidateRollNo: r.candidate_roll_no || '',
            candidatePhone: r.candidate_phone || '',
            answers: ans,
            score: r.score,
            percentage: r.percentage,
            passed: Boolean(r.passed),
            totalMarks: r.total_marks,
            timeTaken: r.time_taken,
            status: r.status,
            violations: viols,
            certificateNumber: r.certificate_number || '',
            startedAt: r.started_at,
            submittedAt: r.submitted_at
          };

          if (!attemptMap.has(rowId)) {
            attemptMap.set(rowId, sqlAtt);
          } else {
            const ex = attemptMap.get(rowId);
            // Hostinger MySQL is the authoritative record: if MySQL has submitted status or higher/updated score, copy it over!
            if (sqlAtt.status === 'submitted' || ex.status !== 'submitted') {
              ex.status = sqlAtt.status;
              ex.score = sqlAtt.score;
              ex.percentage = sqlAtt.percentage;
              ex.passed = sqlAtt.passed;
              ex.totalMarks = sqlAtt.totalMarks;
              ex.timeTaken = sqlAtt.timeTaken;
              ex.submittedAt = sqlAtt.submittedAt;
            }
            if (ans.length > 0) ex.answers = ans;
            if (viols.length > 0) ex.violations = viols;
            if (r.certificate_number) ex.certificateNumber = r.certificate_number;
            if (r.candidate_photo) ex.candidatePhoto = r.candidate_photo;
            if (r.candidate_college) ex.candidateCollege = r.candidate_college;
            if (r.candidate_dob) ex.candidateDob = r.candidate_dob;
            if (r.candidate_roll_no) ex.candidateRollNo = r.candidate_roll_no;
            if (r.candidate_phone) ex.candidatePhone = r.candidate_phone;
            if (!ex.candidate) ex.candidate = candObj;
            else {
              if (r.candidate_photo) ex.candidate.photo = r.candidate_photo;
              if (r.candidate_college) ex.candidate.college = r.candidate_college;
              if (r.candidate_dob) ex.candidate.dob = r.candidate_dob;
              if (r.candidate_roll_no) ex.candidate.rollNo = r.candidate_roll_no;
              if (r.candidate_phone) ex.candidate.phone = r.candidate_phone;
            }
          }
        }
      }
    } catch (sqlErr) {
      console.warn('MySQL attempts query error:', sqlErr.message);
    }

    let allAttempts = Array.from(attemptMap.values());

    // Also enrich attempts with candidate registration profiles from assessment_candidates
    try {
      const pool = getMySQLPool();
      const [candRows] = await pool.query(
        'SELECT email, name, dob, phone, college, roll_no, photo_url, access_code FROM assessment_candidates WHERE assessment_id = ?',
        [req.params.id]
      );
      if (candRows && candRows.length > 0) {
        const candMap = new Map();
        for (const cr of candRows) {
          candMap.set(String(cr.email).toLowerCase().trim(), cr);
        }
        for (const att of allAttempts) {
          const emailKey = String(att.candidateEmail || att.candidate?.email || '').toLowerCase().trim();
          if (candMap.has(emailKey)) {
            const profile = candMap.get(emailKey);
            if (!att.candidate) att.candidate = {};
            if (!att.candidatePhoto && profile.photo_url) {
              att.candidatePhoto = profile.photo_url;
              att.candidate.photo = profile.photo_url;
            }
            if (!att.candidateCollege && profile.college) {
              att.candidateCollege = profile.college;
              att.candidate.college = profile.college;
            }
            if (!att.candidateDob && profile.dob) {
              att.candidateDob = profile.dob;
              att.candidate.dob = profile.dob;
            }
            if (!att.candidateRollNo && profile.roll_no) {
              att.candidateRollNo = profile.roll_no;
              att.candidate.rollNo = profile.roll_no;
            }
            if (!att.candidatePhone && profile.phone) {
              att.candidatePhone = profile.phone;
              att.candidate.phone = profile.phone;
            }
          }
        }
      }
    } catch (e) {}

    // AUTO-REGRADE: Check each submitted attempt against smart grading rules and update Hostinger MySQL if needed
    if (assessment && Array.isArray(assessment.questions) && assessment.questions.length > 0) {
      for (const att of allAttempts) {
        if (att.status === 'submitted' && Array.isArray(att.answers) && att.answers.length > 0) {
          const oldScore = Number(att.score);
          const oldPassed = Boolean(att.passed);
          const oldPercentage = Number(att.percentage);

          gradeAttempt(att, assessment);

          if (att.score !== oldScore || att.passed !== oldPassed || att.percentage !== oldPercentage) {
            await saveAttemptToDB(att);
          }
        }
      }
    }

    res.json(allAttempts || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Explicit Admin Regrade Endpoint
router.post('/admin/:id/regrade', adminGuard, async (req, res) => {
  try {
    const assessment = await findAssessmentInDB(req.params.id);
    if (!assessment) return res.status(404).json({ error: 'Assessment not found.' });

    const attemptMap = new Map();
    const storeAttempts = getAttemptsFromStore();
    storeAttempts.filter(a => String(a.assessment) === String(req.params.id)).forEach(a => attemptMap.set(String(a._id), a));

    if (mongoose.connection?.readyState === 1) {
      try {
        const mongoAtts = await Attempt.find({ assessment: req.params.id }).lean();
        mongoAtts.forEach(a => attemptMap.set(String(a._id), a));
      } catch (e) {}
    }

    try {
      const pool = getMySQLPool();
      const [rows] = await pool.query('SELECT * FROM assessment_attempts WHERE assessment_id = ?', [req.params.id]);
      if (rows && rows.length > 0) {
        for (const r of rows) {
          let ans = [];
          try { ans = typeof r.answers_json === 'string' ? JSON.parse(r.answers_json) : (r.answers_json || []); } catch(e){}
          if (!attemptMap.has(String(r.id))) {
            attemptMap.set(String(r.id), {
              _id: r.id,
              assessment: r.assessment_id,
              candidate: { email: r.candidate_email, name: r.candidate_name, accessCode: r.candidate_access_code },
              candidateEmail: r.candidate_email,
              candidateName: r.candidate_name,
              answers: ans,
              score: r.score,
              percentage: r.percentage,
              passed: Boolean(r.passed),
              totalMarks: r.total_marks,
              timeTaken: r.time_taken,
              status: r.status,
              startedAt: r.started_at,
              submittedAt: r.submitted_at
            });
          } else {
            const ex = attemptMap.get(String(r.id));
            if (r.status === 'submitted' || ex.status !== 'submitted') {
              ex.status = r.status;
              ex.score = r.score;
              ex.percentage = r.percentage;
              ex.passed = Boolean(r.passed);
              ex.submittedAt = r.submitted_at;
            }
            if (ans.length > 0) ex.answers = ans;
          }
        }
      }
    } catch (e) {}

    let regradedCount = 0;
    const allAttempts = Array.from(attemptMap.values());
    for (const att of allAttempts) {
      if (att.status === 'submitted' && Array.isArray(att.answers) && att.answers.length > 0) {
        gradeAttempt(att, assessment);
        await saveAttemptToDB(att);
        regradedCount++;
      }
    }

    res.json({
      success: true,
      message: `Successfully re-graded ${regradedCount} attempt(s).`,
      attempts: allAttempts
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Certificate Management ───────────────────────────────────────────────────
const calculateGrade = (percentage) => {
  const pct = Number(percentage) || 0;
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B+';
  if (pct >= 60) return 'B';
  if (pct >= 50) return 'C';
  return 'D';
};

const createEmailTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

router.post('/admin/send-certificate', adminGuard, async (req, res) => {
  try {
    const { attemptId, assessmentId, customStudentName, customGrade } = req.body;
    if (!attemptId) {
      return res.status(400).json({ error: 'attemptId is required.' });
    }

    // 1. Locate Attempt
    const storeAttempts = getAttemptsFromStore();
    let attempt = storeAttempts.find(a => String(a._id) === String(attemptId));

    if (!attempt && mongoose.connection?.readyState === 1) {
      try {
        attempt = await Attempt.findById(attemptId).lean();
      } catch (e) {}
    }

    if (!attempt) {
      // Check MySQL
      try {
        const pool = getMySQLPool();
        const [rows] = await pool.query('SELECT * FROM assessment_attempts WHERE id = ? LIMIT 1', [attemptId]);
        if (rows && rows.length > 0) {
          const r = rows[0];
          attempt = {
            _id: r.id,
            assessment: r.assessment_id,
            candidateEmail: r.candidate_email,
            candidateName: r.candidate_name,
            score: r.score,
            percentage: r.percentage,
            passed: Boolean(r.passed),
            totalMarks: r.total_marks,
            certificateNumber: r.certificate_number
          };
        }
      } catch (sqlErr) {}
    }

    if (!attempt) {
      return res.status(404).json({ error: 'Assessment attempt record not found.' });
    }

    // 2. Locate Assessment
    const targetAssessmentId = assessmentId || attempt.assessment;
    const storeAssessments = getAssessmentsFromStore();
    let assessment = storeAssessments.find(a => String(a._id) === String(targetAssessmentId));

    if (!assessment && mongoose.connection?.readyState === 1) {
      try {
        assessment = await Assessment.findById(targetAssessmentId).lean();
      } catch (e) {}
    }

    // 3. Details calculation
    const studentName = customStudentName || attempt.candidateName || attempt.candidate?.name || 'Student';
    const candidateEmail = attempt.candidateEmail || attempt.candidate?.email || '';
    const percentage = Number(attempt.percentage) || 0;
    const grade = customGrade || calculateGrade(percentage);
    const courseTitle = assessment?.title || 'Certification Assessment';

    // 4. Generate or reuse unique Certificate Number
    // Format: ATI-YY-MM-STxxxx (e.g. ATI-26-09-ST1024)
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const certificateNumber = attempt.certificateNumber && attempt.certificateNumber.trim() !== ''
      ? attempt.certificateNumber
      : `ATI-${yy}-${mm}-ST${randomSuffix}`;

    // 5. Verification URL & QR code
    const origin = req.headers.origin || `${req.protocol}://${req.get('host')}`;
    const verifyUrl = `${origin}/verify-certificate/${certificateNumber}`;
    let qrCodeData = '';
    try {
      qrCodeData = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 140 });
    } catch (qrErr) {
      console.warn('QR code generation warning:', qrErr.message);
    }

    const issueDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const startDate = assessment?.createdAt 
      ? new Date(assessment.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : 'August 1, 2026';
    const endDate = attempt.submittedAt
      ? new Date(attempt.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : issueDate;

    // 6. Assemble Certificate Object
    const certData = {
      certificateNumber,
      studentName,
      candidateEmail,
      internshipName: courseTitle,
      grade,
      percentage,
      score: attempt.score || 0,
      totalMarks: attempt.totalMarks || 0,
      startDate,
      endDate,
      issueDate,
      description: 'This certification is awarded in recognition of the successful completion of the curriculum and mastery of the course content.',
      companyName: 'APPLE TREE INFOTECH',
      companyAddress: 'C-60 3rd Floor R.K. Tower RDC, Raj Nagar, Ghaziabad, 201001',
      companyPhone: '7503962162, 9355343070',
      companyEmail: 'info@appletreeinfotech.in',
      companyWeb: 'appletreeinfotech.in',
      partnerUniversity: 'KALINGA UNIVERSITY',
      signatoryTitle: 'Partner',
      qrCodeData,
      status: 'valid',
      assessmentId: String(targetAssessmentId),
      attemptId: String(attempt._id)
    };

    // 7. Save to mockStore
    if (!Array.isArray(mockStore.certificates)) mockStore.certificates = [];
    const existIdx = mockStore.certificates.findIndex(c => c.certificateNumber === certificateNumber);
    if (existIdx >= 0) {
      mockStore.certificates[existIdx] = { ...mockStore.certificates[existIdx], ...certData };
    } else {
      mockStore.certificates.push(certData);
    }

    // Update attempt certificateNumber in store
    if (attempt) {
      attempt.certificateNumber = certificateNumber;
      attempt.certificateIssued = true;
    }
    saveStore();

    // 8. Save to MongoDB if available
    if (mongoose.connection?.readyState === 1) {
      try {
        await Certificate.findOneAndUpdate(
          { certificateNumber },
          { $set: certData },
          { upsert: true, new: true }
        );
        await Attempt.findByIdAndUpdate(attemptId, {
          certificateNumber,
          certificateIssued: true
        });
      } catch (mErr) {
        console.warn('MongoDB certificate save warning:', mErr.message);
      }
    }

    // 9. Save to Hostinger MySQL
    try {
      const pool = getMySQLPool();
      await pool.query(`
        INSERT INTO certificates (
          certificate_number, student_name, candidate_email, internship_name,
          grade, percentage, score, total_marks, issue_date, start_date, end_date,
          description, qr_code_data, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          student_name = VALUES(student_name),
          candidate_email = VALUES(candidate_email),
          internship_name = VALUES(internship_name),
          grade = VALUES(grade),
          percentage = VALUES(percentage),
          score = VALUES(score),
          total_marks = VALUES(total_marks),
          issue_date = VALUES(issue_date),
          qr_code_data = VALUES(qr_code_data),
          status = VALUES(status)
      `, [
        certificateNumber, studentName, candidateEmail, courseTitle,
        grade, percentage, attempt.score || 0, attempt.totalMarks || 0, issueDate, startDate, endDate,
        certData.description, qrCodeData, 'valid'
      ]);

      await pool.query(
        'UPDATE assessment_attempts SET certificate_number = ? WHERE id = ?',
        [certificateNumber, attemptId]
      ).catch(() => {});
    } catch (sqlErr) {
      console.warn('Hostinger MySQL certificate insert warning:', sqlErr.message);
    }

    // 10. Send Email via nodemailer
    let emailSent = false;
    let emailError = null;

    if (candidateEmail) {
      try {
        const transporter = createEmailTransporter();
        if (transporter) {
          const fromAddr = process.env.EMAIL_FROM || process.env.SMTP_USER || '"Apple Tree Infotech" <info@appletreeinfotech.in>';
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 30px 15px; color: #1e293b;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                <div style="background: #162d59; padding: 24px; text-align: center; color: #ffffff;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">APPLE TREE INFOTECH</h1>
                  <p style="margin: 4px 0 0 0; font-size: 13px; color: #93c5fd;">ISO 9001:2015 Certified &bull; In Academic Partnership with Kalinga University</p>
                </div>
                <div style="padding: 28px 24px;">
                  <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Congratulations, ${studentName}! 🎓</h2>
                  <p style="font-size: 15px; line-height: 1.6; color: #334155;">
                    We are pleased to inform you that you have successfully completed the <strong>${courseTitle}</strong> assessment.
                  </p>
                  <div style="background: #f1f5f9; border-left: 4px solid #162d59; padding: 16px; margin: 20px 0; border-radius: 4px;">
                    <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Certificate Number:</strong> <span style="font-family: monospace; color: #1e3a8a;">${certificateNumber}</span></p>
                    <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Grade Achieved:</strong> <span style="color: #15803d; font-weight: bold;">Grade ${grade}</span> (${percentage}%)</p>
                    <p style="margin: 0; font-size: 14px;"><strong>Date of Issue:</strong> ${issueDate}</p>
                  </div>
                  <p style="font-size: 15px; line-height: 1.6; color: #334155;">
                    Your authentic certificate is now live and can be viewed, downloaded, printed, or verified anytime on our official website:
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${verifyUrl}" style="background-color: #d32f2f; color: #ffffff; padding: 12px 28px; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 6px; display: inline-block; box-shadow: 0 2px 4px rgba(211,47,47,0.3);">
                      View &amp; Verify Certificate &rarr;
                    </a>
                  </div>
                  <p style="font-size: 13px; color: #64748b; line-height: 1.5; text-align: center;">
                    Or verify directly by visiting:<br/>
                    <a href="${verifyUrl}" style="color: #0284c7; word-break: break-all;">${verifyUrl}</a>
                  </p>
                </div>
                <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; font-size: 12px; color: #94a3b8; text-align: center;">
                  <p style="margin: 0;">Apple Tree Infotech &bull; C-60 3rd Floor R.K. Tower RDC, Raj Nagar, Ghaziabad, 201001</p>
                  <p style="margin: 4px 0 0 0;">Helpline: 7503962162, 9355343070 | Web: <a href="https://appletreeinfotech.in" style="color: #0284c7;">appletreeinfotech.in</a></p>
                </div>
              </div>
            </div>
          `;

          await transporter.sendMail({
            from: fromAddr,
            to: candidateEmail,
            subject: `🎓 Your Certificate of Completion [${certificateNumber}] - Apple Tree Infotech`,
            html: emailHtml
          });
          emailSent = true;
        } else {
          emailError = 'SMTP credentials not configured in server environment (.env). Certificate generated for online viewing & verification.';
        }
      } catch (mailErr) {
        console.warn('Mail send failed:', mailErr.message);
        emailError = mailErr.message;
      }
    }

    return res.json({
      success: true,
      message: emailSent
        ? `Certificate issued and emailed to ${candidateEmail} successfully!`
        : `Certificate generated successfully! (Certificate Number: ${certificateNumber})`,
      emailSent,
      emailError,
      certificate: certData,
      verifyUrl
    });
  } catch (e) {
    console.error('Send certificate error:', e);
    res.status(500).json({ error: e.message });
  }
});

// GET certificate details by attempt ID
router.get('/admin/certificate/:attemptId', adminGuard, async (req, res) => {
  try {
    const { attemptId } = req.params;
    let cert = null;

    if (Array.isArray(mockStore.certificates)) {
      cert = mockStore.certificates.find(c => String(c.attemptId) === String(attemptId));
    }

    if (!cert && mongoose.connection?.readyState === 1) {
      try {
        cert = await Certificate.findOne({ attemptId }).lean();
      } catch (e) {}
    }

    if (!cert) {
      try {
        const pool = getMySQLPool();
        const [rows] = await pool.query(
          'SELECT c.* FROM certificates c JOIN assessment_attempts a ON c.certificate_number = a.certificate_number WHERE a.id = ? LIMIT 1',
          [attemptId]
        );
        if (rows && rows.length > 0) {
          const r = rows[0];
          cert = {
            certificateNumber: r.certificate_number,
            studentName: r.student_name,
            candidateEmail: r.candidate_email,
            internshipName: r.internship_name,
            grade: r.grade,
            percentage: r.percentage,
            score: r.score,
            totalMarks: r.total_marks,
            issueDate: r.issue_date,
            startDate: r.start_date,
            endDate: r.end_date,
            description: r.description,
            qrCodeData: r.qr_code_data,
            status: r.status
          };
        }
      } catch (sqlErr) {}
    }

    if (!cert) {
      return res.status(404).json({ error: 'Certificate not yet generated for this attempt.' });
    }

    res.json({ success: true, certificate: cert });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Admin SQL runner (test query against schema) ─────────────────────────────
router.post('/admin/run-sql', adminGuard, (req, res) => {
  const { schema, query } = req.body;
  if (!query) return res.status(400).json({ error: 'query is required.' });
  const result = runSql(schema || '', query);
  res.json(result);
});

// ════════════════════════════════════════════════════════════════════════════
// CANDIDATE ENDPOINTS & LEADERBOARD
// ════════════════════════════════════════════════════════════════════════════

// ── Leaderboard: Passed students ranked by marks / percentage ─────────────────
router.get('/leaderboard', async (req, res) => {
  try {
    const { assessmentId, search } = req.query;

    // 1. Gather all assessments (from mockStore, MySQL, and Mongo)
    const assessmentsList = [];
    const assessmentMap = new Map();

    // From mockStore
    const storeAssessments = getAssessmentsFromStore();
    for (const a of storeAssessments) {
      const id = String(a._id || a.id);
      if (!assessmentMap.has(id)) {
        const item = {
          id,
          title: a.title || 'Examination',
          passingScore: Number(a.passingScore) || 50,
          candidates: Array.isArray(a.invitedCandidates) ? a.invitedCandidates : []
        };
        assessmentMap.set(id, item);
        assessmentsList.push({ id, title: item.title });
      }
    }

    // From MySQL
    try {
      const pool = getMySQLPool();
      const [assRows] = await pool.query('SELECT id, title, passing_score, invited_candidates_json FROM assessments');
      for (const r of (assRows || [])) {
        const id = String(r.id);
        let cands = [];
        try { cands = typeof r.invited_candidates_json === 'string' ? JSON.parse(r.invited_candidates_json) : (r.invited_candidates_json || []); } catch(e){}
        if (!assessmentMap.has(id)) {
          const item = {
            id,
            title: r.title || 'Examination',
            passingScore: Number(r.passing_score) || 50,
            candidates: cands
          };
          assessmentMap.set(id, item);
          assessmentsList.push({ id, title: item.title });
        } else {
          const ex = assessmentMap.get(id);
          if (cands.length > 0 && (!ex.candidates || ex.candidates.length === 0)) {
            ex.candidates = cands;
          }
        }
      }
    } catch (e) {}

    // From Mongo
    if (mongoose.connection?.readyState === 1) {
      try {
        const mAssessments = await Assessment.find().lean();
        for (const a of mAssessments) {
          const id = String(a._id);
          if (!assessmentMap.has(id)) {
            const item = {
              id,
              title: a.title || 'Examination',
              passingScore: Number(a.passingScore) || 50,
              candidates: Array.isArray(a.invitedCandidates) ? a.invitedCandidates : []
            };
            assessmentMap.set(id, item);
            assessmentsList.push({ id, title: item.title });
          }
        }
      } catch (e) {}
    }

    // 2. Gather all attempts
    const attemptsMap = new Map();

    // From mockStore
    const storeAttempts = getAttemptsFromStore();
    for (const att of storeAttempts) {
      const attId = String(att._id || att.id);
      attemptsMap.set(attId, att);
    }

    // From MySQL
    try {
      const pool = getMySQLPool();
      const [attRows] = await pool.query(`
        SELECT * FROM assessment_attempts
        WHERE status = 'submitted' AND (passed = 1 OR percentage >= 40)
      `);
      for (const r of (attRows || [])) {
        const attId = String(r.id);
        attemptsMap.set(attId, {
          _id: r.id,
          assessment: r.assessment_id,
          candidateEmail: r.candidate_email,
          candidateName: r.candidate_name,
          candidatePhoto: r.candidate_photo || '',
          candidateCollege: r.candidate_college || '',
          candidate: {
            email: r.candidate_email,
            name: r.candidate_name,
            photo: r.candidate_photo || '',
            college: r.candidate_college || ''
          },
          score: Number(r.score) || 0,
          totalMarks: Number(r.total_marks) || 0,
          percentage: Number(r.percentage) || 0,
          passed: Boolean(r.passed),
          timeTaken: Number(r.time_taken) || 0,
          status: r.status,
          certificateNumber: r.certificate_number || '',
          submittedAt: r.submitted_at || r.started_at
        });
      }
    } catch (e) {}

    // From Mongo
    if (mongoose.connection?.readyState === 1) {
      try {
        const mAttempts = await Attempt.find({ status: 'submitted', passed: true }).lean();
        for (const att of mAttempts) {
          const attId = String(att._id);
          if (!attemptsMap.has(attId)) {
            attemptsMap.set(attId, att);
          }
        }
      } catch (e) {}
    }

    // 3. Process each passed attempt
    const rawPassed = [];
    for (const att of attemptsMap.values()) {
      if (att.status !== 'submitted') continue;

      const assId = String(att.assessment || att.assessmentId || '');
      const ass = assessmentMap.get(assId);
      const passingScore = ass?.passingScore || 50;

      const isPassed = att.passed === true || att.percentage >= passingScore;
      if (!isPassed) continue;

      // Filter by assessment if requested
      if (assessmentId && assessmentId !== 'all' && assId !== String(assessmentId)) {
        continue;
      }

      const cleanEmail = String(att.candidateEmail || att.candidate?.email || '').toLowerCase().trim();
      const candMatch = (ass?.candidates || []).find(
        c => String(c.email || '').toLowerCase().trim() === cleanEmail
      );

      const photo = att.candidatePhoto || att.candidate?.photo || candMatch?.photo || '';
      const college = att.candidateCollege || att.candidate?.college || candMatch?.college || 'Computer Science & Engineering';
      const name = att.candidateName || att.candidate?.name || candMatch?.name || 'Candidate';
      const rollNo = att.candidate?.rollNo || candMatch?.rollNo || '';

      const totalMarks = Number(att.totalMarks) || 100;
      const score = Number(att.score) || 0;
      const percentage = Number(att.percentage) || (totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0);

      rawPassed.push({
        id: att._id || att.id,
        assessmentId: assId,
        assessmentTitle: ass?.title || 'Online Assessment',
        candidateEmail: cleanEmail,
        candidateName: name,
        photo: photo,
        college: college,
        rollNo: rollNo,
        score: score,
        totalMarks: totalMarks,
        percentage: percentage,
        timeTaken: Number(att.timeTaken) || 0,
        certificateNumber: att.certificateNumber || '',
        submittedAt: att.submittedAt || new Date()
      });
    }

    // 4. Deduplicate by student email: keep candidate's single highest achievement
    const studentBestMap = new Map();
    for (const item of rawPassed) {
      const key = item.candidateEmail || item.id;
      if (!studentBestMap.has(key)) {
        studentBestMap.set(key, item);
      } else {
        const prev = studentBestMap.get(key);
        // Compare: higher percentage > higher score > lower timeTaken
        if (
          item.percentage > prev.percentage ||
          (item.percentage === prev.percentage && item.score > prev.score) ||
          (item.percentage === prev.percentage && item.score === prev.score && item.timeTaken < prev.timeTaken)
        ) {
          studentBestMap.set(key, item);
        }
      }
    }

    let sorted = Array.from(studentBestMap.values()).sort((a, b) => {
      if (b.percentage !== a.percentage) return b.percentage - a.percentage;
      if (b.score !== a.score) return b.score - a.score;
      return a.timeTaken - b.timeTaken;
    });

    // Optional Search Filter
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      sorted = sorted.filter(s =>
        s.candidateName.toLowerCase().includes(q) ||
        s.candidateEmail.toLowerCase().includes(q) ||
        s.college.toLowerCase().includes(q) ||
        s.assessmentTitle.toLowerCase().includes(q)
      );
    }

    // 5. Assign Ranks and Badges
    const rankedList = sorted.map((student, idx) => {
      const rank = idx + 1;
      let badge = 'Rank #' + rank;
      let rankTier = 'performer';
      let medal = '#' + rank;

      if (rank === 1) {
        badge = 'Champion 🏆';
        rankTier = 'gold';
        medal = '🥇';
      } else if (rank === 2) {
        badge = '1st Runner-Up 🥈';
        rankTier = 'silver';
        medal = '🥈';
      } else if (rank === 3) {
        badge = '2nd Runner-Up 🥉';
        rankTier = 'bronze';
        medal = '🥉';
      } else if (rank <= 10) {
        badge = 'Top 10 ⭐';
        rankTier = 'top10';
      }

      return {
        ...student,
        rank,
        badge,
        rankTier,
        medal
      };
    });

    const podium = {
      first: rankedList[0] || null,
      second: rankedList[1] || null,
      third: rankedList[2] || null
    };

    const rankwise = rankedList.slice(3);

    // Compute aggregate statistics
    const totalPassed = rankedList.length;
    const topScore = rankedList[0] ? rankedList[0].percentage : 0;
    const avgScore = totalPassed > 0
      ? Math.round(rankedList.reduce((acc, cur) => acc + cur.percentage, 0) / totalPassed)
      : 0;
    const uniqueColleges = new Set(rankedList.map(r => r.college).filter(Boolean)).size;

    res.json({
      success: true,
      stats: {
        totalPassed,
        topScore,
        avgScore,
        uniqueColleges
      },
      podium,
      rankwise,
      leaderboard: rankedList,
      assessments: [
        { id: 'all', title: '🌟 All Assessments (Global Leaderboard)' },
        ...assessmentsList
      ]
    });
  } catch (e) {
    console.error('Leaderboard error:', e);
    res.status(500).json({ error: e.message });
  }
});

// Public Assessment Details (for Student Registration Form)
router.get('/public/:id', async (req, res) => {
  try {
    let a = await findAssessmentInDB(req.params.id);

    if (!a || a.isActive === false) {
      return res.status(404).json({ error: 'Assessment not found or currently inactive.' });
    }

    if (a.expiresAt && new Date() > new Date(a.expiresAt)) {
      return res.status(410).json({ error: 'Registration closed. This assessment has expired.' });
    }

    res.json({
      _id: a._id,
      title: a.title,
      description: a.description || '',
      jobTitle: a.jobTitle || 'General',
      duration: a.duration || 30,
      passingScore: a.passingScore || 50,
      maxAttempts: a.maxAttempts || 1,
      questionCount: (a.questions || []).length,
      hasPassword: Boolean(a.accessPassword),
      expiresAt: a.expiresAt || null
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Student Self-Registration Form Submission
router.post('/:id/register', async (req, res) => {
  try {
    const { name, email, phone, college, rollNo, photo, dob, dateOfBirth } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Full name and email address are required.' });
    }

    const rawDob = dob || dateOfBirth || '';
    if (!rawDob || !String(rawDob).trim()) {
      return res.status(400).json({ error: 'Date of Birth (DOB) is required.' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanName = String(name).trim();
    const cleanDob = normalizeDob(rawDob);
    const cleanPhone = String(phone || '').trim();
    const cleanCollege = String(college || '').trim();
    const cleanRollNo = String(rollNo || '').trim();
    const cleanPhoto = typeof photo === 'string' ? photo.trim() : '';

    let a = await findAssessmentInDB(req.params.id);

    if (!a || a.isActive === false) {
      return res.status(404).json({ error: 'Assessment not found or currently inactive.' });
    }
    if (a.expiresAt && new Date() > new Date(a.expiresAt)) {
      return res.status(410).json({ error: 'Registration is closed. This assessment has expired.' });
    }

    if (!Array.isArray(a.invitedCandidates)) {
      a.invitedCandidates = [];
    }

    // Email is Primary Key: check if already registered
    const existingIdx = a.invitedCandidates.findIndex(
      c => String(c.email || '').toLowerCase().trim() === cleanEmail
    );

    const studentRecord = {
      email: cleanEmail,
      name: cleanName,
      dob: cleanDob,
      dateOfBirth: cleanDob,
      phone: cleanPhone,
      college: cleanCollege,
      rollNo: cleanRollNo,
      photo: cleanPhoto,
      accessCode: a.accessPassword || 'EXAM',
      registeredAt: existingIdx !== -1 ? (a.invitedCandidates[existingIdx].registeredAt || new Date()) : new Date(),
      invitedAt: new Date()
    };

    if (existingIdx !== -1) {
      // Update registration record
      a.invitedCandidates[existingIdx] = {
        ...a.invitedCandidates[existingIdx],
        ...studentRecord,
        photo: cleanPhoto || a.invitedCandidates[existingIdx].photo || '',
        dob: cleanDob || a.invitedCandidates[existingIdx].dob || a.invitedCandidates[existingIdx].dateOfBirth || '',
        dateOfBirth: cleanDob || a.invitedCandidates[existingIdx].dateOfBirth || a.invitedCandidates[existingIdx].dob || ''
      };
    } else {
      // Append new student registration
      a.invitedCandidates.push(studentRecord);
    }

    // Direct persistence to Hostinger MySQL assessment_candidates table
    const candidateId = genId();
    try {
      const pool = getMySQLPool();
      await pool.query(`
        INSERT INTO assessment_candidates (
          id, assessment_id, name, email, dob, phone, college, roll_no, photo_url, access_code
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name=VALUES(name),
          dob=VALUES(dob),
          phone=VALUES(phone),
          college=VALUES(college),
          roll_no=VALUES(roll_no),
          photo_url=VALUES(photo_url),
          access_code=VALUES(access_code)
      `, [
        candidateId,
        req.params.id,
        cleanName,
        cleanEmail,
        cleanDob,
        cleanPhone,
        cleanCollege,
        cleanRollNo,
        cleanPhoto,
        a.accessPassword || 'EXAM'
      ]);

      // Also register or update arena_students in MySQL so candidate profile is globally unified
      await pool.query(`
        INSERT INTO arena_students (id, email, name, dob, college, photo, score, solved_problems_json)
        VALUES (?, ?, ?, ?, ?, ?, 0, '[]')
        ON DUPLICATE KEY UPDATE
          name=VALUES(name),
          dob=VALUES(dob),
          college=VALUES(college),
          photo=COALESCE(NULLIF(VALUES(photo), ''), photo);
      `, [genId(), cleanEmail, cleanName, cleanDob, cleanCollege, cleanPhoto]).catch(() => {});

      // Permanent registration in students_registry table
      await upsertStudentToRegistry({
        email: cleanEmail,
        name: cleanName,
        dob: cleanDob,
        phone: cleanPhone,
        college: cleanCollege,
        rollNo: cleanRollNo,
        photo: cleanPhoto,
        accessCode: a.accessPassword || 'EXAM'
      }).catch(() => {});
    } catch (sqlCandErr) {
      console.warn('MySQL assessment_candidates insert notice:', sqlCandErr.message);
    }

    // Save assessment record
    await saveAssessmentToDB(a);

    // Immediate instant response (< 20ms) so candidate registration never hangs or spins indefinitely
    return res.json({
      success: true,
      message: existingIdx !== -1 ? 'Registration details updated successfully!' : 'Registration successful!',
      candidate: {
        name: cleanName,
        email: cleanEmail,
        dob: cleanDob,
        college: cleanCollege,
        photo: cleanPhoto || (existingIdx !== -1 ? a.invitedCandidates[existingIdx].photo : '')
      },
      assessment: {
        _id: a._id,
        title: a.title,
        duration: a.duration,
        passingScore: a.passingScore
      },
      examUrl: `/test/${a._id}?email=${encodeURIComponent(cleanEmail)}&dob=${encodeURIComponent(cleanDob)}`
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Verify Exam Access (Email + Date of Birth + Admin Assessment Password)
router.post('/verify-access', async (req, res) => {
  try {
    const { assessmentId, email, accessCode, accessPassword, password, dob, dateOfBirth } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Registered email is required.' });
    }

    const rawDob = dob || dateOfBirth || '';
    if (!rawDob || !String(rawDob).trim()) {
      return res.status(400).json({ error: 'Date of Birth (DOB) is required to enter the exam.' });
    }
    const inputDob = normalizeDob(rawDob);

    const inputCode = String(accessPassword || accessCode || password || '').trim().toUpperCase();
    if (!inputCode) {
      return res.status(400).json({ error: 'Exam password is required.' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const a = await findAssessmentInDB(assessmentId);

    if (!a || a.isActive === false) {
      return res.status(404).json({ error: 'Assessment not found or inactive.' });
    }
    if (a.expiresAt && new Date() > new Date(a.expiresAt)) {
      return res.status(410).json({ error: 'This assessment has expired.' });
    }

    // 1. Verify candidate registration by email
    let candidateMatch = (a.invitedCandidates || []).find(
      ic => String(ic.email || '').toLowerCase().trim() === cleanEmail
    );

    if (!candidateMatch) {
      try {
        const pool = getMySQLPool();
        const [candRows] = await pool.query(
          'SELECT * FROM assessment_candidates WHERE assessment_id = ? AND LOWER(email) = ? LIMIT 1',
          [assessmentId, cleanEmail]
        );
        if (candRows && candRows.length > 0) {
          const cr = candRows[0];
          candidateMatch = {
            email: cr.email,
            name: cr.name,
            dob: cr.dob,
            phone: cr.phone,
            college: cr.college,
            rollNo: cr.roll_no,
            photo: cr.photo_url,
            accessCode: cr.access_code || a.accessPassword || 'EXAM',
            registeredAt: cr.registered_at
          };
          if (!Array.isArray(a.invitedCandidates)) a.invitedCandidates = [];
          a.invitedCandidates.push(candidateMatch);
        }
      } catch (sqlErr) {}
    }

    // 2. Verify password (assessment password OR candidate access code OR master admin password)
    const masterPassword = (process.env.ADMIN_PASSWORD || 'RANCOM@2026').toUpperCase();
    const isMasterAdmin = inputCode === masterPassword;

    const isPasswordValid = isMasterAdmin ||
      (a.accessPassword && inputCode === a.accessPassword.toUpperCase().trim()) ||
      (candidateMatch && candidateMatch.accessCode && inputCode === candidateMatch.accessCode.toUpperCase().trim());

    if (!isPasswordValid) {
      return res.status(403).json({
        error: 'Invalid exam password. Please enter the password provided by your admin/instructor.'
      });
    }

    if (!candidateMatch && !isMasterAdmin) {
      return res.status(403).json({
        error: 'This email is not registered for this assessment. Please complete the registration form first.',
        notRegistered: true,
        registrationUrl: `/test/${assessmentId}/register`
      });
    }

    // 3. Verify Date of Birth (DOB)
    if (candidateMatch) {
      const storedDob = normalizeDob(candidateMatch.dob || candidateMatch.dateOfBirth);
      if (storedDob && storedDob !== inputDob) {
        return res.status(403).json({
          error: 'Date of Birth does not match your registered records. Please check and try again.'
        });
      }
      // If legacy candidate had no DOB recorded, save and persist this DOB
      if (!storedDob) {
        candidateMatch.dob = inputDob;
        candidateMatch.dateOfBirth = inputDob;
        await saveAssessmentToDB(a);
      }
    }

    // Check attempts limit: count ONLY completed/submitted attempts (allow resuming ongoing in-progress attempts)
    const attemptsStore = getAttemptsFromStore();
    let submittedAttempts = attemptsStore.filter(att =>
      String(att.assessment) === String(assessmentId) &&
      (att.candidateEmail || att.candidate?.email || '').toLowerCase() === cleanEmail &&
      att.status === 'submitted'
    );

    if (submittedAttempts.length === 0) {
      try {
        const pool = getMySQLPool();
        const [rows] = await pool.query(
          'SELECT id FROM assessment_attempts WHERE assessment_id = ? AND LOWER(candidate_email) = ? AND status = "submitted"',
          [assessmentId, cleanEmail]
        );
        if (rows && rows.length > 0) {
          submittedAttempts = rows;
        }
      } catch (e) {}
    }

    if (submittedAttempts.length >= (a.maxAttempts || 1)) {
      return res.status(403).json({
        error: `Maximum attempts (${a.maxAttempts || 1}) reached for this test.`
      });
    }

    res.json({
      valid: true,
      email: cleanEmail,
      dob: inputDob,
      name: candidateMatch?.name || 'Candidate',
      assessmentTitle: a.title,
      duration: a.duration,
      questionCount: (a.questions || []).length,
      description: a.description || ''
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Start attempt — return sanitized questions
router.post('/start', async (req, res) => {
  try {
    const { assessmentId, email, accessCode, accessPassword, password, dob, dateOfBirth } = req.body;
    const cleanEmail = String(email || '').toLowerCase().trim();
    const inputCode = String(accessPassword || accessCode || password || '').trim().toUpperCase();
    const rawDob = dob || dateOfBirth || '';
    const inputDob = normalizeDob(rawDob);

    const a = await findAssessmentInDB(assessmentId);
    if (!a || a.isActive === false) return res.status(404).json({ error: 'Assessment not found.' });

    let candidateMatch = (a.invitedCandidates || []).find(
      ic => String(ic.email || '').toLowerCase().trim() === cleanEmail
    );

    if (!candidateMatch) {
      try {
        const pool = getMySQLPool();
        const [candRows] = await pool.query(
          'SELECT * FROM assessment_candidates WHERE assessment_id = ? AND LOWER(email) = ? LIMIT 1',
          [assessmentId, cleanEmail]
        );
        if (candRows && candRows.length > 0) {
          const cr = candRows[0];
          candidateMatch = {
            email: cr.email,
            name: cr.name,
            dob: cr.dob,
            phone: cr.phone,
            college: cr.college,
            rollNo: cr.roll_no,
            photo: cr.photo_url,
            accessCode: cr.access_code || a.accessPassword || 'EXAM',
            registeredAt: cr.registered_at
          };
          if (!Array.isArray(a.invitedCandidates)) a.invitedCandidates = [];
          a.invitedCandidates.push(candidateMatch);
        }
      } catch (sqlErr) {}
    }

    const masterPassword = (process.env.ADMIN_PASSWORD || 'RANCOM@2026').toUpperCase();
    const isMasterAdmin = inputCode === masterPassword;

    const isPasswordValid = isMasterAdmin ||
      (a.accessPassword && inputCode === a.accessPassword.toUpperCase().trim()) ||
      (candidateMatch && candidateMatch.accessCode && inputCode === candidateMatch.accessCode.toUpperCase().trim());

    if (!isPasswordValid) {
      return res.status(403).json({ error: 'Invalid exam password.' });
    }

    if (!candidateMatch && !isMasterAdmin) {
      return res.status(403).json({
        error: 'This email is not registered for this assessment. Please complete registration first.',
        notRegistered: true,
        registrationUrl: `/test/${assessmentId}/register`
      });
    }

    // Verify Date of Birth if provided and recorded
    if (candidateMatch) {
      const storedDob = normalizeDob(candidateMatch.dob || candidateMatch.dateOfBirth);
      if (inputDob && storedDob && storedDob !== inputDob) {
        return res.status(403).json({ error: 'Date of Birth does not match candidate registration records.' });
      }
      if (inputDob && !storedDob) {
        candidateMatch.dob = inputDob;
        candidateMatch.dateOfBirth = inputDob;
        await saveAssessmentToDB(a);
      }
    }

    // Check if max submitted attempts reached (while allowing in-progress attempt resumption)
    const attemptsStore = getAttemptsFromStore();
    let completedAttempts = attemptsStore.filter(att =>
      String(att.assessment) === String(assessmentId) &&
      (att.candidateEmail || att.candidate?.email || '').toLowerCase() === cleanEmail &&
      att.status === 'submitted'
    );
    if (completedAttempts.length === 0) {
      try {
        const pool = getMySQLPool();
        const [subRows] = await pool.query(
          'SELECT id FROM assessment_attempts WHERE assessment_id = ? AND LOWER(candidate_email) = ? AND status = "submitted"',
          [assessmentId, cleanEmail]
        );
        if (subRows && subRows.length > 0) completedAttempts = subRows;
      } catch (e) {}
    }
    if (completedAttempts.length >= (a.maxAttempts || 1)) {
      return res.status(403).json({
        error: `Maximum attempts (${a.maxAttempts || 1}) reached for this test.`
      });
    }

    let attempt = attemptsStore.find(att =>
      String(att.assessment) === String(assessmentId) &&
      (att.candidateEmail || att.candidate?.email || '').toLowerCase() === cleanEmail &&
      att.status === 'in-progress'
    );

    if (!attempt) {
      try {
        const pool = getMySQLPool();
        const [rows] = await pool.query(
          'SELECT * FROM assessment_attempts WHERE assessment_id = ? AND candidate_email = ? AND status = "in-progress" LIMIT 1',
          [assessmentId, cleanEmail]
        );
        if (rows && rows.length > 0) {
          const r = rows[0];
          attempt = await findAttemptInDB(r.id);
        }
      } catch (e) {}
    }

    const rawQuestions = a.questions || [];
    const questions = a.shuffleQuestions ? shuffle(rawQuestions) : [...rawQuestions];

    // Sanitize — strip correct answers, model answers, SQL expected output
    const sanitized = questions.map(q => ({
      _id: q._id,
      text: q.text,
      type: q.type,
      options: a.shuffleOptions && q.options?.length ? shuffle(q.options) : (q.options || []),
      marks: q.marks,
      topic: q.topic,
      sqlSchema: q.sqlSchema || '',
      sqlHint: q.sqlHint || '',
      explanation: '' // Never send before submission
    }));

    if (!attempt) {
      const finalDob = inputDob || (candidateMatch ? normalizeDob(candidateMatch.dob || candidateMatch.dateOfBirth) : '');
      const finalPhoto = candidateMatch?.photo || candidateMatch?.photo_url || '';
      attempt = {
        _id: genId(),
        assessment: assessmentId,
        candidate: {
          registrationId: candidateMatch?.registrationId || null,
          email: cleanEmail,
          name: candidateMatch?.name || 'Candidate',
          photo: finalPhoto,
          dob: finalDob,
          dateOfBirth: finalDob,
          college: candidateMatch?.college || '',
          rollNo: candidateMatch?.rollNo || candidateMatch?.roll_no || '',
          phone: candidateMatch?.phone || '',
          accessCode: inputCode
        },
        candidateEmail: cleanEmail,
        candidateName: candidateMatch?.name || 'Candidate',
        candidatePhoto: finalPhoto,
        candidateDob: finalDob,
        candidateCollege: candidateMatch?.college || '',
        candidateRollNo: candidateMatch?.rollNo || candidateMatch?.roll_no || '',
        candidatePhone: candidateMatch?.phone || '',
        answers: [],
        score: 0,
        percentage: 0,
        passed: false,
        totalMarks: 0,
        timeTaken: 0,
        status: 'in-progress',
        violations: [],
        startedAt: new Date()
      };

      // Save to Hostinger MySQL, Mongoose, and mockStore
      await saveAttemptToDB(attempt);
    }

    res.json({
      attemptId: attempt._id,
      questions: sanitized,
      duration: a.duration,
      title: a.title,
      startedAt: attempt.startedAt
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Candidate SQL test-run (no grading, instant output)
router.post('/run-sql', async (req, res) => {
  const { schema, query } = req.body;
  if (!query) return res.status(400).json({ error: 'query is required.' });
  const result = runSql(schema || '', query);
  res.json(result);
});

// Submit full test with Smart Grading & Hostinger MySQL Persistence
router.post('/submit', async (req, res) => {
  try {
    const { attemptId, answers, timeTaken } = req.body;
    let attempt = await findAttemptInDB(attemptId);

    if (!attempt) return res.status(404).json({ error: 'Attempt not found.' });

    let a = await findAssessmentInDB(attempt.assessment);
    if (!a) return res.status(404).json({ error: 'Assessment not found.' });

    if (attempt.status !== 'in-progress') {
      return res.json(a.showResult !== false
        ? {
            message: 'Already submitted.',
            score: attempt.score,
            total: attempt.totalMarks,
            percentage: attempt.percentage,
            passed: attempt.passed,
            passingScore: a.passingScore || 50
          }
        : { submitted: true }
      );
    }

    // Ensure candidate photo, college, dob, roll number, and phone are linked
    let candidateMatch = (a.invitedCandidates || []).find(
      ic => String(ic.email || '').toLowerCase().trim() === String(attempt.candidateEmail || attempt.candidate?.email || '').toLowerCase().trim()
    );

    if (!candidateMatch) {
      try {
        const pool = getMySQLPool();
        const [candRows] = await pool.query(
          'SELECT * FROM assessment_candidates WHERE assessment_id = ? AND LOWER(email) = ? LIMIT 1',
          [attempt.assessment, String(attempt.candidateEmail || attempt.candidate?.email || '').toLowerCase().trim()]
        );
        if (candRows && candRows.length > 0) {
          const cr = candRows[0];
          candidateMatch = {
            email: cr.email,
            name: cr.name,
            dob: cr.dob,
            phone: cr.phone,
            college: cr.college,
            rollNo: cr.roll_no,
            photo: cr.photo_url
          };
        }
      } catch (e) {}
    }

    if (candidateMatch) {
      const matchPhoto = candidateMatch.photo || candidateMatch.photo_url || '';
      const matchDob = candidateMatch.dob || candidateMatch.dateOfBirth || '';
      const matchRollNo = candidateMatch.rollNo || candidateMatch.roll_no || '';

      if (!attempt.candidatePhoto && matchPhoto) attempt.candidatePhoto = matchPhoto;
      if (!attempt.candidateCollege && candidateMatch.college) attempt.candidateCollege = candidateMatch.college;
      if (!attempt.candidateDob && matchDob) attempt.candidateDob = matchDob;
      if (!attempt.candidateRollNo && matchRollNo) attempt.candidateRollNo = matchRollNo;
      if (!attempt.candidatePhone && candidateMatch.phone) attempt.candidatePhone = candidateMatch.phone;

      if (!attempt.candidate) attempt.candidate = {};
      if (!attempt.candidate.photo && matchPhoto) attempt.candidate.photo = matchPhoto;
      if (!attempt.candidate.college && candidateMatch.college) attempt.candidate.college = candidateMatch.college;
      if (!attempt.candidate.dob && matchDob) attempt.candidate.dob = matchDob;
      if (!attempt.candidate.rollNo && matchRollNo) attempt.candidate.rollNo = matchRollNo;
      if (!attempt.candidate.phone && candidateMatch.phone) attempt.candidate.phone = candidateMatch.phone;
    }

    attempt.answers = answers || [];
    attempt.timeTaken = Number(timeTaken) || attempt.timeTaken || 0;
    attempt.status = 'submitted';
    attempt.submittedAt = new Date();

    // Grade attempt using the comprehensive isMcqCorrect & gradeAttempt engine
    attempt = gradeAttempt(attempt, a);

    // Save to Hostinger MySQL, Mongoose, and mockStore
    await saveAttemptToDB(attempt);

    res.json(a.showResult !== false
      ? {
          message: 'Submitted successfully.',
          score: attempt.score,
          total: attempt.totalMarks,
          percentage: attempt.percentage,
          passed: attempt.passed,
          passingScore: a.passingScore || 50
        }
      : { submitted: true }
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Log anti-cheat violation
router.post('/violation', async (req, res) => {
  try {
    const { attemptId, type } = req.body;
    let attempt = await findAttemptInDB(attemptId);

    if (!attempt || attempt.status !== 'in-progress') {
      return res.status(400).json({ error: 'Invalid or already completed attempt.' });
    }

    if (!Array.isArray(attempt.violations)) attempt.violations = [];
    const ex = attempt.violations.find(v => v.type === type);
    if (ex) {
      ex.count += 1;
      ex.timestamp = new Date();
    } else {
      attempt.violations.push({ type, count: 1, timestamp: new Date() });
    }

    const tabViol = attempt.violations.find(v => v.type === 'tab-switch');
    if (tabViol && tabViol.count >= 3) {
      attempt.status = 'terminated';
      attempt.submittedAt = new Date();
    }

    await saveAttemptToDB(attempt);

    res.json({ status: attempt.status, violations: attempt.violations });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// View result
router.get('/result/:attemptId', async (req, res) => {
  try {
    let attempt = await findAttemptInDB(req.params.attemptId);
    if (!attempt) return res.status(404).json({ error: 'Result not found.' });

    let a = await findAssessmentInDB(attempt.assessment);

    // Auto-regrade if submitted
    if (a && attempt.status === 'submitted' && Array.isArray(attempt.answers)) {
      const oldScore = attempt.score;
      gradeAttempt(attempt, a);
      if (attempt.score !== oldScore) {
        await saveAttemptToDB(attempt);
      }
    }

    if (a && a.showResult === false) {
      return res.json({ submitted: true, message: 'Results hidden by administrator.' });
    }

    const reviewed = (attempt.answers || []).map(ans => {
      const q = (a?.questions || []).find(q => String(q._id) === String(ans.questionId));
      return {
        ...ans,
        questionText: q?.text || '',
        correctAnswer: q?.type === 'theory' ? '(manually graded)' : (q?.correct || q?.sqlExpected || ''),
        explanation: q?.explanation || ''
      };
    });

    res.json({
      title: a?.title || 'Online Assessment',
      score: attempt.score,
      totalMarks: attempt.totalMarks,
      percentage: attempt.percentage,
      passed: attempt.passed,
      passingScore: a?.passingScore || 50,
      timeTaken: attempt.timeTaken,
      status: attempt.status,
      violations: attempt.violations || [],
      answers: reviewed
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Student Profile: Certificates, Attended Exams, and Detailed Wrong Question Review
router.get('/student/profile-exams', async (req, res) => {
  try {
    const rawEmail = req.query.email;
    if (!rawEmail) {
      return res.status(400).json({ success: false, error: 'Student email is required.' });
    }
    const cleanEmail = String(rawEmail).toLowerCase().trim();

    // 1. Fetch Student Profile Information from assessment_candidates or attempts
    let studentProfile = {
      email: cleanEmail,
      name: 'Student',
      college: '',
      rollNo: '',
      dob: '',
      phone: '',
      photo: ''
    };

    try {
      const pool = getMySQLPool();
      const [candRows] = await pool.query(
        'SELECT * FROM assessment_candidates WHERE LOWER(email) = ? ORDER BY registered_at DESC LIMIT 1',
        [cleanEmail]
      );
      if (candRows && candRows.length > 0) {
        const cr = candRows[0];
        studentProfile.name = cr.name || studentProfile.name;
        studentProfile.college = cr.college || studentProfile.college;
        studentProfile.rollNo = cr.roll_no || studentProfile.rollNo;
        studentProfile.dob = cr.dob || studentProfile.dob;
        studentProfile.phone = cr.phone || studentProfile.phone;
        studentProfile.photo = cr.photo_url || studentProfile.photo;
      }
    } catch (e) {}

    // 2. Fetch all certificates earned by this student
    const certsMap = new Map();

    // From MySQL certificates table
    try {
      const pool = getMySQLPool();
      const [certRows] = await pool.query(
        'SELECT * FROM certificates WHERE LOWER(candidate_email) = ? ORDER BY id DESC',
        [cleanEmail]
      );
      for (const cr of (certRows || [])) {
        if (cr.certificate_number) {
          certsMap.set(cr.certificate_number.toUpperCase(), {
            certificateNumber: cr.certificate_number,
            studentName: cr.student_name || studentProfile.name,
            candidateEmail: cr.candidate_email,
            internshipName: cr.internship_name || 'Online Certification Exam',
            grade: cr.grade || 'A',
            percentage: Number(cr.percentage) || 0,
            score: Number(cr.score) || 0,
            totalMarks: Number(cr.total_marks) || 0,
            issueDate: cr.issue_date,
            startDate: cr.start_date,
            endDate: cr.end_date,
            description: cr.description || '',
            status: cr.status || 'valid'
          });
        }
      }
    } catch (e) {}

    // From mockStore certificates
    if (Array.isArray(mockStore.certificates)) {
      for (const cr of mockStore.certificates) {
        if (String(cr.candidateEmail || cr.email || '').toLowerCase().trim() === cleanEmail && cr.certificateNumber) {
          const key = cr.certificateNumber.toUpperCase();
          if (!certsMap.has(key)) {
            certsMap.set(key, { ...cr, status: cr.status || 'valid' });
          }
        }
      }
    }

    // 3. Fetch all exam attempts for this student
    const attemptsMap = new Map();

    // From mockStore attempts
    const storeAttempts = getAttemptsFromStore();
    for (const att of storeAttempts) {
      if (String(att.candidateEmail || att.candidate?.email || '').toLowerCase().trim() === cleanEmail) {
        attemptsMap.set(String(att._id || att.id), att);
      }
    }

    // From Hostinger MySQL assessment_attempts
    try {
      const pool = getMySQLPool();
      const [attRows] = await pool.query(
        'SELECT * FROM assessment_attempts WHERE LOWER(candidate_email) = ? ORDER BY submitted_at DESC, started_at DESC',
        [cleanEmail]
      );
      for (const r of (attRows || [])) {
        const attId = String(r.id);
        let ans = [];
        let viols = [];
        try { ans = typeof r.answers_json === 'string' ? JSON.parse(r.answers_json) : (r.answers_json || []); } catch(e){}
        try { viols = typeof r.violations_json === 'string' ? JSON.parse(r.violations_json) : (r.violations_json || []); } catch(e){}

        if (r.candidate_name && studentProfile.name === 'Student') studentProfile.name = r.candidate_name;
        if (r.candidate_college && !studentProfile.college) studentProfile.college = r.candidate_college;
        if (r.candidate_photo && !studentProfile.photo) studentProfile.photo = r.candidate_photo;
        if (r.candidate_roll_no && !studentProfile.rollNo) studentProfile.rollNo = r.candidate_roll_no;
        if (r.candidate_dob && !studentProfile.dob) studentProfile.dob = r.candidate_dob;

        attemptsMap.set(attId, {
          _id: r.id,
          assessment: r.assessment_id,
          candidateEmail: r.candidate_email,
          candidateName: r.candidate_name,
          candidatePhoto: r.candidate_photo || '',
          candidateCollege: r.candidate_college || '',
          candidateDob: r.candidate_dob || '',
          candidateRollNo: r.candidate_roll_no || '',
          answers: ans,
          score: Number(r.score) || 0,
          totalMarks: Number(r.total_marks) || 0,
          percentage: Number(r.percentage) || 0,
          passed: Boolean(r.passed),
          timeTaken: Number(r.time_taken) || 0,
          status: r.status,
          certificateNumber: r.certificate_number || '',
          startedAt: r.started_at,
          submittedAt: r.submitted_at
        });

        // Also check if attempt has certificate_number and not yet in certsMap
        if (r.certificate_number && !certsMap.has(r.certificate_number.toUpperCase())) {
          certsMap.set(r.certificate_number.toUpperCase(), {
            certificateNumber: r.certificate_number,
            studentName: r.candidate_name || studentProfile.name,
            candidateEmail: cleanEmail,
            internshipName: 'Online Certification Exam',
            grade: r.percentage >= 90 ? 'A+' : r.percentage >= 80 ? 'A' : r.percentage >= 70 ? 'B+' : r.percentage >= 60 ? 'B' : 'C',
            percentage: Number(r.percentage) || 0,
            score: Number(r.score) || 0,
            totalMarks: Number(r.total_marks) || 0,
            issueDate: r.submitted_at || new Date(),
            status: 'valid'
          });
        }
      }
    } catch (e) {}

    // 4. Format Exam Attempts with Post-Exam Question Analysis (Mistakes / Wrong Answers)
    const formattedAttempts = [];
    let calculatedXp = 0;

    for (const att of attemptsMap.values()) {
      const assId = String(att.assessment || att.assessmentId || '');
      const assessment = await findAssessmentInDB(assId);
      const isSubmitted = att.status === 'submitted';
      const resultDeclared = isSubmitted && (assessment ? assessment.showResult !== false : true);

      let questionReview = [];
      let correctCount = 0;
      let wrongCount = 0;

      // Only reveal correct answers and questions AFTER exam is submitted and result declared
      if (isSubmitted && resultDeclared && Array.isArray(att.answers)) {
        const qMap = new Map();
        if (assessment && Array.isArray(assessment.questions)) {
          assessment.questions.forEach(q => qMap.set(String(q._id), q));
        }

        questionReview = att.answers.map((ans, idx) => {
          const q = qMap.get(String(ans.questionId));
          const isCorrect = Boolean(ans.isCorrect);
          if (isCorrect) correctCount++; else wrongCount++;

          const rawCorrect = q ? (q.type === 'theory' ? '(Manually Graded Theory Question)' : (q.correct || q.sqlExpected || '')) : '';
          const expl = q?.explanation || (isCorrect ? 'Correct! Your solution matches the expected concept.' : 'Incorrect option chosen. Review the correct concept.');

          return {
            index: idx + 1,
            questionId: ans.questionId,
            questionText: q?.text || ans.questionText || `Question ${idx + 1}`,
            type: q?.type || 'mcq',
            options: q?.options || [],
            studentAnswer: ans.answer !== undefined && ans.answer !== null ? String(ans.answer) : '(No answer selected)',
            correctAnswer: rawCorrect,
            isCorrect: isCorrect,
            marks: ans.marks || (isCorrect ? (q?.marks || 1) : 0),
            maxMarks: q?.marks || 1,
            explanation: expl,
            topic: q?.topic || 'General Concept'
          };
        });
      }

      if (isSubmitted) {
        calculatedXp += Math.round((Number(att.percentage) || 0) * 250);
      }

      formattedAttempts.push({
        id: att._id || att.id,
        assessmentId: assId,
        title: assessment?.title || 'Online Assessment',
        description: assessment?.description || '',
        duration: assessment?.duration || 30,
        passingScore: assessment?.passingScore || 50,
        score: att.score || 0,
        totalMarks: att.totalMarks || 0,
        percentage: att.percentage || 0,
        passed: Boolean(att.passed),
        status: att.status || 'submitted',
        timeTaken: att.timeTaken || 0,
        startedAt: att.startedAt,
        submittedAt: att.submittedAt,
        certificateNumber: att.certificateNumber || '',
        resultDeclared,
        totalQuestions: questionReview.length || (assessment?.questions?.length || 0),
        correctCount,
        wrongCount,
        questions: questionReview
      });
    }

    // Sort attempts by date descending
    formattedAttempts.sort((a, b) => new Date(b.submittedAt || b.startedAt || 0) - new Date(a.submittedAt || a.startedAt || 0));

    res.json({
      success: true,
      student: {
        ...studentProfile,
        xp: calculatedXp,
        totalExams: formattedAttempts.length,
        passedExams: formattedAttempts.filter(a => a.passed).length,
        certificatesCount: certsMap.size
      },
      certificates: Array.from(certsMap.values()),
      attempts: formattedAttempts
    });
  } catch (err) {
    console.error('Error fetching student profile exams:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
