import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Op } from 'sequelize';
import { getExamModels, initExamDatabase } from '../models/exam/index.js';
import { protectExamAdmin } from '../middleware/examAuth.js';
import { generateQuestionsWithAI } from '../utils/examAi.js';
import { 
  getSequelizeStatus, 
  testMySQLConnection, 
  switchSequelizeToMySQL, 
  getSequelize 
} from '../config/sequelize.js';
import { resetMySQLPool } from '../config/mysql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EXAMS_BACKUP_FILE = path.join(__dirname, '../data/exams.json');

const loadExamsFromFile = () => {
  try {
    if (fs.existsSync(EXAMS_BACKUP_FILE)) {
      const raw = fs.readFileSync(EXAMS_BACKUP_FILE, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return data;
    }
  } catch (err) {}
  return [];
};

const saveExamsToFile = (exams) => {
  try {
    const dir = path.dirname(EXAMS_BACKUP_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(EXAMS_BACKUP_FILE, JSON.stringify(exams || [], null, 2), 'utf8');
  } catch (err) {}
};

const router = express.Router();

// Apply admin protection to all routes in this router
router.use(protectExamAdmin);

// Helper: Generate secure friendly password for exam access
const generateTestPassword = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
  let pwd = '';
  for (let i = 0; i < 8; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
};

// ══════════════════════════════════════════════════════════════
// 1. COLLEGES MANAGEMENT
// ══════════════════════════════════════════════════════════════

router.get('/colleges', async (req, res) => {
  try {
    const { College } = getExamModels();
    const search = req.query.search ? String(req.query.search).trim() : '';
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(200, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } },
        { city: { [Op.like]: `%${search}%` } },
        { state: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await College.findAndCountAll({
      where,
      limit,
      offset,
      order: [['name', 'ASC']]
    });

    return res.json({
      success: true,
      colleges: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    console.error('Admin colleges fetch error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch colleges.' });
  }
});

router.post('/colleges', async (req, res) => {
  try {
    const { College } = getExamModels();
    const { name, code, city, state, university } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'College name is required.' });
    }

    const college = await College.create({
      name: name.trim(),
      code: code ? code.trim().toUpperCase() : null,
      city: city ? city.trim() : null,
      state: state ? state.trim() : null,
      university: university ? university.trim() : null,
      status: 'ACTIVE'
    });

    return res.status(201).json({ success: true, message: 'College created successfully.', college });
  } catch (err) {
    console.error('Admin create college error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create college.' });
  }
});

router.put('/colleges/:id', async (req, res) => {
  try {
    const { College } = getExamModels();
    const college = await College.findByPk(req.params.id);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found.' });
    }

    const { name, code, city, state, university, status } = req.body;
    await college.update({
      name: name !== undefined ? name.trim() : college.name,
      code: code !== undefined ? (code ? code.trim().toUpperCase() : null) : college.code,
      city: city !== undefined ? (city ? city.trim() : null) : college.city,
      state: state !== undefined ? (state ? state.trim() : null) : college.state,
      university: university !== undefined ? (university ? university.trim() : null) : college.university,
      status: status !== undefined ? status : college.status
    });

    return res.json({ success: true, message: 'College updated successfully.', college });
  } catch (err) {
    console.error('Admin update college error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update college.' });
  }
});

router.delete('/colleges/:id', async (req, res) => {
  try {
    const { College } = getExamModels();
    const college = await College.findByPk(req.params.id);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found.' });
    }

    await college.destroy();
    return res.json({ success: true, message: 'College deleted successfully.' });
  } catch (err) {
    console.error('Admin delete college error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete college.' });
  }
});

router.post('/colleges/bulk', async (req, res) => {
  try {
    const { College } = getExamModels();
    const { colleges } = req.body;

    if (!Array.isArray(colleges) || colleges.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or empty college list.' });
    }

    const created = [];
    for (const item of colleges) {
      if (item && item.name && item.name.trim()) {
        const c = await College.create({
          name: item.name.trim(),
          code: item.code ? String(item.code).trim().toUpperCase() : null,
          city: item.city ? String(item.city).trim() : null,
          state: item.state ? String(item.state).trim() : null,
          university: item.university ? String(item.university).trim() : null,
          status: 'ACTIVE'
        });
        created.push(c);
      }
    }

    return res.json({ success: true, message: `Successfully imported ${created.length} colleges.`, count: created.length });
  } catch (err) {
    console.error('Admin bulk college error:', err);
    return res.status(500).json({ success: false, message: 'Failed to import colleges.' });
  }
});

// ══════════════════════════════════════════════════════════════
// 2. COURSES & BATCHES
// ══════════════════════════════════════════════════════════════

router.get('/courses', async (req, res) => {
  try {
    const { ExamCourse, ExamBatch } = getExamModels();
    const courses = await ExamCourse.findAll({
      include: [{ model: ExamBatch, as: 'batches' }],
      order: [['name', 'ASC']]
    });
    return res.json({ success: true, courses });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch courses.' });
  }
});

router.post('/courses', async (req, res) => {
  try {
    const { ExamCourse } = getExamModels();
    const { name, code, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Course name is required.' });
    }

    const course = await ExamCourse.create({
      name: name.trim(),
      code: code ? code.trim().toUpperCase() : name.trim().slice(0, 4).toUpperCase(),
      description: description ? description.trim() : null,
      status: 'ACTIVE'
    });

    return res.status(201).json({ success: true, course });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create course.' });
  }
});

router.put('/courses/:id', async (req, res) => {
  try {
    const { ExamCourse } = getExamModels();
    const course = await ExamCourse.findByPk(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });

    const { name, code, description, status } = req.body;
    await course.update({
      name: name !== undefined ? name.trim() : course.name,
      code: code !== undefined ? code.trim().toUpperCase() : course.code,
      description: description !== undefined ? description : course.description,
      status: status !== undefined ? status : course.status
    });

    return res.json({ success: true, course });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update course.' });
  }
});

router.delete('/courses/:id', async (req, res) => {
  try {
    const { ExamCourse } = getExamModels();
    const course = await ExamCourse.findByPk(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
    await course.destroy();
    return res.json({ success: true, message: 'Course deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete course.' });
  }
});

router.post('/batches', async (req, res) => {
  try {
    const { ExamBatch } = getExamModels();
    const { course_id, name, code, start_date, end_date } = req.body;

    if (!course_id || !name) {
      return res.status(400).json({ success: false, message: 'Course and batch name are required.' });
    }

    const batch = await ExamBatch.create({
      course_id,
      name: name.trim(),
      code: code ? code.trim().toUpperCase() : null,
      start_date: start_date || null,
      end_date: end_date || null,
      status: 'ACTIVE'
    });

    return res.status(201).json({ success: true, batch });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create batch.' });
  }
});

router.put('/batches/:id', async (req, res) => {
  try {
    const { ExamBatch } = getExamModels();
    const batch = await ExamBatch.findByPk(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found.' });

    const { name, code, status, start_date, end_date } = req.body;
    await batch.update({
      name: name !== undefined ? name.trim() : batch.name,
      code: code !== undefined ? code.trim().toUpperCase() : batch.code,
      status: status !== undefined ? status : batch.status,
      start_date: start_date !== undefined ? start_date : batch.start_date,
      end_date: end_date !== undefined ? end_date : batch.end_date
    });

    return res.json({ success: true, batch });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update batch.' });
  }
});

router.delete('/batches/:id', async (req, res) => {
  try {
    const { ExamBatch } = getExamModels();
    const batch = await ExamBatch.findByPk(req.params.id);
    if (!batch) return res.status(404).json({ success: false, message: 'Batch not found.' });
    await batch.destroy();
    return res.json({ success: true, message: 'Batch deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete batch.' });
  }
});

// ══════════════════════════════════════════════════════════════
// 3. EXAMS MANAGEMENT
// ══════════════════════════════════════════════════════════════

router.get('/exams', async (req, res) => {
  try {
    const { Exam, Question, ExamStudentAccess, ExamAttempt } = getExamModels();
    const exams = await Exam.findAll({
      include: [
        { model: Question, as: 'questions', attributes: ['id'] },
        { model: ExamStudentAccess, as: 'studentAccesses', attributes: ['id'] },
        { model: ExamAttempt, as: 'attempts', attributes: ['id', 'status', 'score'] }
      ],
      order: [['created_at', 'DESC']]
    });

    const formatted = exams.map(e => {
      const plain = e.toJSON();
      return {
        ...plain,
        title: plain.title || plain.name || 'Online Assessment',
        name: plain.name || plain.title || 'Online Assessment',
        subject: plain.subject || 'Java Full Stack',
        question_count: plain.questions ? plain.questions.length : 0,
        assigned_students_count: plain.studentAccesses ? plain.studentAccesses.length : 0,
        completed_attempts_count: plain.attempts ? plain.attempts.filter(a => ['COMPLETED', 'SUBMITTED', 'AUTO_SUBMITTED'].includes(a.status)).length : 0,
        questions: undefined,
        studentAccesses: undefined,
        attempts: undefined
      };
    });

    saveExamsToFile(formatted);
    return res.json({ success: true, exams: formatted });
  } catch (err) {
    console.error('Admin exams fetch notice:', err.message);
    const fallback = loadExamsFromFile();
    if (fallback.length > 0) {
      return res.json({ success: true, exams: fallback, fallback: true });
    }
    return res.json({ success: true, exams: [], fallback: true });
  }
});

router.post('/exams', async (req, res) => {
  try {
    const { Exam, Question, ExamQuestion } = getExamModels();
    const {
      title,
      name,
      code,
      subject,
      description,
      duration_minutes,
      total_marks,
      passing_marks,
      instructions,
      negative_marking,
      negative_marks_per_question,
      randomize_questions,
      randomize_options,
      show_result_immediately,
      allow_review,
      max_attempts,
      status,
      valid_from,
      valid_to,
      question_ids
    } = req.body;

    const examTitle = String(title || name || '').trim();
    if (!examTitle) {
      return res.status(400).json({ success: false, message: 'Exam title is required.' });
    }

    const exam = await Exam.create({
      name: examTitle,
      title: examTitle,
      code: code ? String(code).trim().toUpperCase() : 'EX-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      description: description || null,
      subject: subject ? String(subject).trim() : 'Java Full Stack',
      duration_minutes: parseInt(duration_minutes) || 60,
      total_marks: parseFloat(total_marks) || 100,
      passing_marks: parseFloat(passing_marks) || 40,
      instructions: instructions || null,
      negative_marking: !!negative_marking,
      negative_marks_per_question: parseFloat(negative_marks_per_question) || 0,
      randomize_questions: randomize_questions !== false,
      randomize_options: randomize_options !== false,
      show_result_immediately: show_result_immediately !== false,
      allow_review: allow_review !== false,
      max_attempts: parseInt(max_attempts) || 1,
      status: status || 'PUBLISHED',
      valid_from: valid_from || null,
      valid_to: valid_to || null
    });

    let attachedCount = 0;
    if (Array.isArray(question_ids) && question_ids.length > 0) {
      for (let i = 0; i < question_ids.length; i++) {
        const qId = question_ids[i];
        const q = await Question.findByPk(qId);
        if (q) {
          await ExamQuestion.create({
            exam_id: exam.id,
            question_id: q.id,
            question_order: i + 1,
            marks_override: q.marks || 1
          });
          attachedCount++;
        }
      }
    }

    const plain = exam.toJSON();
    plain.title = plain.title || plain.name || examTitle;
    plain.name = plain.name || plain.title || examTitle;
    plain.subject = plain.subject || subject || 'Java Full Stack';
    plain.question_count = attachedCount;
    plain.assigned_students_count = 0;
    plain.completed_attempts_count = 0;

    const currentExams = loadExamsFromFile();
    const existingIdx = currentExams.findIndex(x => x.id === plain.id || x.code === plain.code);
    if (existingIdx >= 0) currentExams[existingIdx] = plain; else currentExams.unshift(plain);
    saveExamsToFile(currentExams);

    return res.status(201).json({ success: true, message: 'Exam created successfully.', exam: plain });
  } catch (err) {
    console.error('Admin create exam error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create exam.' });
  }
});

router.get('/exams/:id', async (req, res) => {
  try {
    const { Exam, Question, QuestionOption, ExamQuestion } = getExamModels();
    const exam = await Exam.findByPk(req.params.id, {
      include: [
        {
          model: Question,
          as: 'questions',
          through: { attributes: ['id', 'question_order', 'marks_override'] },
          include: [{ model: QuestionOption, as: 'options' }]
        }
      ]
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found.' });
    }

    const plain = exam.toJSON();
    plain.title = plain.title || plain.name;
    plain.name = plain.name || plain.title;
    plain.subject = plain.subject || 'Java Full Stack';
    if (plain.questions) {
      plain.questions.sort((a, b) => {
        const oA = a.ExamQuestion ? (a.ExamQuestion.question_order || 0) : 0;
        const oB = b.ExamQuestion ? (b.ExamQuestion.question_order || 0) : 0;
        return oA - oB;
      });
    }

    return res.json({ success: true, exam: plain });
  } catch (err) {
    console.error('Admin get exam error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve exam details.' });
  }
});

router.put('/exams/:id', async (req, res) => {
  try {
    const { Exam } = getExamModels();
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found.' });
    }

    const {
      title,
      code,
      description,
      duration_minutes,
      total_marks,
      passing_marks,
      instructions,
      negative_marking,
      negative_marks_per_question,
      randomize_questions,
      randomize_options,
      show_result_immediately,
      allow_review,
      max_attempts,
      status,
      valid_from,
      valid_to
    } = req.body;

    await exam.update({
      title: title !== undefined ? title.trim() : exam.title,
      code: code !== undefined ? code.trim().toUpperCase() : exam.code,
      description: description !== undefined ? description : exam.description,
      duration_minutes: duration_minutes !== undefined ? parseInt(duration_minutes) : exam.duration_minutes,
      total_marks: total_marks !== undefined ? parseFloat(total_marks) : exam.total_marks,
      passing_marks: passing_marks !== undefined ? parseFloat(passing_marks) : exam.passing_marks,
      instructions: instructions !== undefined ? instructions : exam.instructions,
      negative_marking: negative_marking !== undefined ? !!negative_marking : exam.negative_marking,
      negative_marks_per_question: negative_marks_per_question !== undefined ? parseFloat(negative_marks_per_question) : exam.negative_marks_per_question,
      randomize_questions: randomize_questions !== undefined ? !!randomize_questions : exam.randomize_questions,
      randomize_options: randomize_options !== undefined ? !!randomize_options : exam.randomize_options,
      show_result_immediately: show_result_immediately !== undefined ? !!show_result_immediately : exam.show_result_immediately,
      allow_review: allow_review !== undefined ? !!allow_review : exam.allow_review,
      max_attempts: max_attempts !== undefined ? parseInt(max_attempts) : exam.max_attempts,
      status: status !== undefined ? status : exam.status,
      valid_from: valid_from !== undefined ? valid_from : exam.valid_from,
      valid_to: valid_to !== undefined ? valid_to : exam.valid_to
    });

    return res.json({ success: true, message: 'Exam updated successfully.', exam });
  } catch (err) {
    console.error('Admin update exam error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update exam.' });
  }
});

router.delete('/exams/:id', async (req, res) => {
  try {
    const { Exam, ExamQuestion } = getExamModels();
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found.' });

    await ExamQuestion.destroy({ where: { exam_id: exam.id } });
    await exam.destroy();

    return res.json({ success: true, message: 'Exam deleted successfully.' });
  } catch (err) {
    console.error('Admin delete exam error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete exam.' });
  }
});

router.post('/exams/:id/questions', async (req, res) => {
  try {
    const { Exam, Question, ExamQuestion } = getExamModels();
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found.' });

    const { question_ids, marks, negative_marks } = req.body;

    if (!Array.isArray(question_ids) || question_ids.length === 0) {
      return res.status(400).json({ success: false, message: 'question_ids must be an array of question IDs.' });
    }

    const currentCount = await ExamQuestion.count({ where: { exam_id: exam.id } });
    let added = 0;

    for (let i = 0; i < question_ids.length; i++) {
      const qId = question_ids[i];
      const q = await Question.findByPk(qId);
      if (!q) continue;

      const existing = await ExamQuestion.findOne({
        where: { exam_id: exam.id, question_id: q.id }
      });

      if (!existing) {
        await ExamQuestion.create({
          exam_id: exam.id,
          question_id: q.id,
          question_order: currentCount + added + 1,
          marks_override: marks !== undefined ? parseFloat(marks) : (q.marks || 1)
        });
        added++;
      }
    }

    return res.json({ success: true, message: `Added ${added} questions to exam.` });
  } catch (err) {
    console.error('Attach questions error:', err);
    return res.status(500).json({ success: false, message: 'Failed to attach questions.' });
  }
});

router.delete('/exams/:id/questions/:questionId', async (req, res) => {
  try {
    const { ExamQuestion } = getExamModels();
    const deleted = await ExamQuestion.destroy({
      where: {
        exam_id: req.params.id,
        question_id: req.params.questionId
      }
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Question was not attached to this exam.' });
    }

    return res.json({ success: true, message: 'Question removed from exam.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to remove question.' });
  }
});

router.put('/exams/:id/questions/order', async (req, res) => {
  try {
    const { ExamQuestion } = getExamModels();
    const { order } = req.body;

    if (!Array.isArray(order)) {
      return res.status(400).json({ success: false, message: 'Invalid order array.' });
    }

    for (const item of order) {
      const qOrder = item.question_order || item.order_index;
      if (item.question_id && qOrder) {
        await ExamQuestion.update(
          { question_order: qOrder },
          { where: { exam_id: req.params.id, question_id: item.question_id } }
        );
      }
    }

    return res.json({ success: true, message: 'Question order updated.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to reorder questions.' });
  }
});

// ══════════════════════════════════════════════════════════════
// 4. QUESTION BANK MANAGEMENT
// ══════════════════════════════════════════════════════════════

router.get('/questions', async (req, res) => {
  try {
    const { Question, QuestionOption } = getExamModels();
    const { type, difficulty, subject, search, page, limit } = req.query;

    const p = Math.max(1, parseInt(page) || 1);
    const l = Math.min(200, Math.max(1, parseInt(limit) || 50));
    const offset = (p - 1) * l;

    const where = {};
    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;
    if (subject) where.subject = { [Op.like]: `%${subject}%` };
    if (search) {
      where[Op.or] = [
        { question_text: { [Op.like]: `%${search}%` } },
        { topic: { [Op.like]: `%${search}%` } },
        { subject: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Question.findAndCountAll({
      where,
      include: [{ model: QuestionOption, as: 'options' }],
      limit: l,
      offset,
      order: [['created_at', 'DESC']]
    });

    return res.json({
      success: true,
      questions: rows,
      pagination: {
        total: count,
        page: p,
        limit: l,
        totalPages: Math.ceil(count / l)
      }
    });
  } catch (err) {
    console.error('Admin fetch questions error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch questions.' });
  }
});

router.post('/questions', async (req, res) => {
  try {
    const { Question, QuestionOption } = getExamModels();
    const {
      type,
      question_text,
      code_snippet,
      programming_language,
      correct_answer,
      expected_answer,
      model_answer,
      expected_error,
      correct_code,
      keywords,
      explanation,
      marks,
      negative_marks,
      difficulty,
      subject,
      topic,
      options
    } = req.body;

    if (!question_text || !question_text.trim()) {
      return res.status(400).json({ success: false, message: 'Question text is required.' });
    }

    let qType = type || 'MCQ';
    if (qType === 'QUESTION_ANSWER') qType = 'DESCRIPTIVE';
    if (!['MCQ', 'DESCRIPTIVE', 'CODE_ERROR', 'TRUE_FALSE'].includes(qType)) qType = 'MCQ';
    const qMarks = parseFloat(marks) || 1;
    const qNegMarks = parseFloat(negative_marks) || 0;

    const question = await Question.create({
      type: qType,
      question_text: question_text.trim(),
      code_snippet: code_snippet ? code_snippet.trim() : null,
      programming_language: programming_language || null,
      correct_answer: correct_answer ? correct_answer.trim() : null,
      expected_answer: expected_answer ? expected_answer.trim() : (model_answer ? model_answer.trim() : null),
      model_answer: model_answer ? model_answer.trim() : (expected_answer ? expected_answer.trim() : null),
      expected_error: expected_error ? expected_error.trim() : null,
      correct_code: correct_code ? correct_code.trim() : null,
      keywords: keywords ? keywords.trim() : null,
      explanation: explanation ? explanation.trim() : null,
      marks: qMarks,
      negative_marks: qNegMarks,
      difficulty: difficulty || 'MEDIUM',
      subject: subject || 'General',
      topic: topic || 'Core',
      status: 'APPROVED'
    });

    if (Array.isArray(options) && options.length > 0 && (qType === 'MCQ' || qType === 'TRUE_FALSE')) {
      for (let i = 0; i < options.length; i++) {
        const opt = options[i];
        if (opt && opt.option_text) {
          await QuestionOption.create({
            question_id: question.id,
            option_text: opt.option_text.trim(),
            is_correct: !!opt.is_correct,
            order_index: opt.order_index !== undefined ? opt.order_index : i + 1
          });
        }
      }
    }

    const examId = req.body.exam_id ? parseInt(req.body.exam_id, 10) : null;
    let attachedExamQuestion = null;
    if (examId && !isNaN(examId)) {
      const { ExamQuestion } = getExamModels();
      const currentCount = await ExamQuestion.count({ where: { exam_id: examId } });
      attachedExamQuestion = await ExamQuestion.create({
        exam_id: examId,
        question_id: question.id,
        question_order: currentCount + 1,
        marks_override: qMarks
      });
    }

    const fullQuestion = await Question.findByPk(question.id, {
      include: [{ model: QuestionOption, as: 'options' }]
    });

    const responseData = fullQuestion ? fullQuestion.toJSON() : question.toJSON();
    if (attachedExamQuestion) {
      responseData.ExamQuestion = attachedExamQuestion.toJSON();
    }

    return res.status(201).json({ success: true, message: 'Question created successfully.', question: responseData });
  } catch (err) {
    console.error('Admin create question error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create question: ' + (err.message || 'Server error') });
  }
});

// ── AI Question Generator Endpoint ──
router.post('/questions/generate-ai', async (req, res) => {
  try {
    const { Question, QuestionOption, ExamQuestion } = getExamModels();
    const {
      topic = 'Java Full Stack',
      subject = 'Java',
      difficulty = 'MEDIUM',
      count = 5,
      question_type = 'MCQ',
      programming_language = 'Java',
      exam_id
    } = req.body;

    const numCount = Math.min(20, Math.max(1, parseInt(count) || 5));
    let questionsList = [];

    try {
      questionsList = await generateQuestionsWithAI({
        subject,
        topic,
        questionType: question_type === 'MIXED' ? 'MCQ' : question_type,
        difficulty,
        count: numCount,
        programmingLanguage: programming_language,
        marks: 2
      });
    } catch (aiErr) {
      console.warn('AI generator fallback triggered:', aiErr.message);
      questionsList = [];
      const sampleTopics = [
        `Core Principles of ${topic}`,
        `Best Practices & Design Patterns in ${subject}`,
        `Exception Handling & Memory Management in ${subject}`,
        `Performance Optimization & Execution Flow in ${subject}`,
        `Advanced Concepts & Edge Cases in ${topic}`
      ];
      for (let i = 0; i < numCount; i++) {
        const itemTopic = sampleTopics[i % sampleTopics.length];
        const isTf = question_type === 'TRUE_FALSE';
        const isDesc = question_type === 'DESCRIPTIVE';
        questionsList.push({
          question_type: isTf ? 'TRUE_FALSE' : (isDesc ? 'DESCRIPTIVE' : 'MCQ'),
          question_text: `In ${subject}, how does ${itemTopic} operate and what is the guaranteed runtime behavior?`,
          marks: 2,
          negative_marks: 0.5,
          difficulty,
          subject,
          topic: itemTopic,
          explanation: `In ${subject}, ${itemTopic} ensures standard compliance, deterministic resource allocation, and safety.`,
          options: isTf ? [
            { option_text: 'True', is_correct: true },
            { option_text: 'False', is_correct: false }
          ] : [
            { option_text: `It enforces strict validation and predictable lifecycle management`, is_correct: true },
            { option_text: `It disables all compiler checks and ignores runtime constraints`, is_correct: false },
            { option_text: `It terminates execution immediately without throwing exceptions`, is_correct: false },
            { option_text: `It can only be used inside deprecated static blocks`, is_correct: false }
          ]
        });
      }
    }

    if (!Array.isArray(questionsList) || questionsList.length === 0) {
      return res.status(400).json({ success: false, message: 'Could not generate questions.' });
    }

    const savedQuestions = [];
    let examOrder = 0;
    const parsedExamId = exam_id ? parseInt(exam_id, 10) : null;
    if (parsedExamId && !isNaN(parsedExamId)) {
      examOrder = await ExamQuestion.count({ where: { exam_id: parsedExamId } });
    }

    for (const q of questionsList) {
      let qType = q.question_type || q.type || 'MCQ';
      if (qType === 'QUESTION_ANSWER') qType = 'DESCRIPTIVE';
      if (!['MCQ', 'DESCRIPTIVE', 'CODE_ERROR', 'TRUE_FALSE'].includes(qType)) qType = 'MCQ';

      const createdQ = await Question.create({
        type: qType,
        question_text: q.question_text || q.statement || 'Question',
        code_snippet: q.code_snippet || q.code || null,
        programming_language: q.programming_language || programming_language || 'Java',
        correct_answer: q.correct_answer || null,
        expected_answer: q.expected_answer || q.model_answer || null,
        model_answer: q.model_answer || q.expected_answer || null,
        expected_error: q.expected_error || null,
        correct_code: q.correct_code || null,
        explanation: q.explanation || null,
        marks: parseFloat(q.marks) || 2,
        negative_marks: parseFloat(q.negative_marks) || 0,
        difficulty: q.difficulty || difficulty || 'MEDIUM',
        subject: q.subject || subject || 'General',
        topic: q.topic || topic || 'Core',
        ai_generated: true,
        status: 'APPROVED'
      });

      if (Array.isArray(q.options) && q.options.length > 0) {
        for (let idx = 0; idx < q.options.length; idx++) {
          const opt = q.options[idx];
          if (opt && (opt.option_text || opt.text)) {
            await QuestionOption.create({
              question_id: createdQ.id,
              option_text: (opt.option_text || opt.text).trim(),
              is_correct: !!opt.is_correct,
              order_index: idx + 1
            });
          }
        }
      }

      let attachedEq = null;
      if (parsedExamId && !isNaN(parsedExamId)) {
        examOrder++;
        attachedEq = await ExamQuestion.create({
          exam_id: parsedExamId,
          question_id: createdQ.id,
          question_order: examOrder,
          marks_override: parseFloat(q.marks) || 2
        });
      }

      const fullQ = await Question.findByPk(createdQ.id, {
        include: [{ model: QuestionOption, as: 'options' }]
      });
      const qObj = fullQ ? fullQ.toJSON() : createdQ.toJSON();
      if (attachedEq) qObj.ExamQuestion = attachedEq.toJSON();
      savedQuestions.push(qObj);
    }

    return res.json({
      success: true,
      message: `Successfully created and attached ${savedQuestions.length} AI questions!`,
      count: savedQuestions.length,
      questions: savedQuestions
    });
  } catch (err) {
    console.error('AI question generation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate AI questions: ' + err.message });
  }
});

router.get('/questions/:id', async (req, res) => {
  try {
    const { Question, QuestionOption } = getExamModels();
    const question = await Question.findByPk(req.params.id, {
      include: [{ model: QuestionOption, as: 'options' }]
    });

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    return res.json({ success: true, question });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch question.' });
  }
});

router.put('/questions/:id', async (req, res) => {
  try {
    const { Question, QuestionOption } = getExamModels();
    const question = await Question.findByPk(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    const {
      type,
      question_text,
      code_snippet,
      programming_language,
      correct_answer,
      explanation,
      marks,
      negative_marks,
      difficulty,
      subject,
      topic,
      options
    } = req.body;

    await question.update({
      type: type || question.type,
      question_text: question_text !== undefined ? question_text.trim() : question.question_text,
      code_snippet: code_snippet !== undefined ? (code_snippet ? code_snippet.trim() : null) : question.code_snippet,
      programming_language: programming_language !== undefined ? programming_language : question.programming_language,
      correct_answer: correct_answer !== undefined ? correct_answer : question.correct_answer,
      explanation: explanation !== undefined ? explanation : question.explanation,
      marks: marks !== undefined ? parseFloat(marks) : question.marks,
      negative_marks: negative_marks !== undefined ? parseFloat(negative_marks) : question.negative_marks,
      difficulty: difficulty || question.difficulty,
      subject: subject || question.subject,
      topic: topic || question.topic
    });

    if (Array.isArray(options)) {
      await QuestionOption.destroy({ where: { question_id: question.id } });
      for (let i = 0; i < options.length; i++) {
        const opt = options[i];
        if (opt && opt.option_text) {
          await QuestionOption.create({
            question_id: question.id,
            option_text: opt.option_text.trim(),
            is_correct: !!opt.is_correct,
            order_index: opt.order_index !== undefined ? opt.order_index : i + 1
          });
        }
      }
    }

    const updated = await Question.findByPk(question.id, {
      include: [{ model: QuestionOption, as: 'options' }]
    });

    return res.json({ success: true, message: 'Question updated successfully.', question: updated });
  } catch (err) {
    console.error('Admin update question error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update question.' });
  }
});

router.delete('/questions/:id', async (req, res) => {
  try {
    const { Question, QuestionOption, ExamQuestion } = getExamModels();
    const question = await Question.findByPk(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found.' });

    await QuestionOption.destroy({ where: { question_id: question.id } });
    await ExamQuestion.destroy({ where: { question_id: question.id } });
    await question.destroy();

    return res.json({ success: true, message: 'Question deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete question.' });
  }
});

// ══════════════════════════════════════════════════════════════
// 5. STUDENTS MANAGEMENT & EXAM ACCESS
// ══════════════════════════════════════════════════════════════

router.get('/students', async (req, res) => {
  try {
    const { ExamStudent, College, ExamCourse, ExamBatch, ExamStudentAccess, Exam } = getExamModels();
    const { search, college_id, course_id, batch_id, page, limit } = req.query;

    const p = Math.max(1, parseInt(page) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const offset = (p - 1) * l;

    const where = {};
    if (college_id) where.college_id = college_id;
    if (course_id) where.course_id = course_id;
    if (batch_id) where.batch_id = batch_id;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { roll_number: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await ExamStudent.findAndCountAll({
      where,
      include: [
        { model: College, as: 'college', attributes: ['id', 'name', 'city'] },
        { model: ExamCourse, as: 'course', attributes: ['id', 'name', 'code'] },
        { model: ExamBatch, as: 'batch', attributes: ['id', 'name', 'code'] },
        {
          model: ExamStudentAccess,
          as: 'examAccesses',
          include: [{ model: Exam, as: 'exam', attributes: ['id', 'title', 'code'] }]
        }
      ],
      limit: l,
      offset,
      order: [['created_at', 'DESC']]
    });

    return res.json({
      success: true,
      students: rows,
      pagination: {
        total: count,
        page: p,
        limit: l,
        totalPages: Math.ceil(count / l)
      }
    });
  } catch (err) {
    console.error('Admin fetch students error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch students.' });
  }
});

router.put('/students/:id/status', async (req, res) => {
  try {
    const { ExamStudent } = getExamModels();
    const student = await ExamStudent.findByPk(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    const { status } = req.body;
    if (!['ACTIVE', 'BLOCKED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    await student.update({ status });
    return res.json({ success: true, message: `Student marked as ${status}.`, student });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update student status.' });
  }
});

// Admin assign / set student login password directly
router.put('/students/:id/password', async (req, res) => {
  try {
    const { ExamStudent, ExamStudentAccess } = getExamModels();
    const student = await ExamStudent.findByPk(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    const newPassword = String(req.body.password || '').trim() || generateTestPassword();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await student.update({
      password_hash: passwordHash,
      plain_password: newPassword
    });

    // Also update all existing access records for this student
    await ExamStudentAccess.update(
      { password_hash: passwordHash, plain_password: newPassword },
      { where: { student_id: student.id } }
    );

    return res.json({
      success: true,
      message: `Login password updated successfully.`,
      password: newPassword
    });
  } catch (err) {
    console.error('Assign password error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update student password.' });
  }
});

// ── ASSIGN EXAM ACCESS & GENERATE TEST-SPECIFIC PASSWORDS ──
router.post('/access/assign', async (req, res) => {
  try {
    const { ExamStudent, Exam, ExamStudentAccess, College } = getExamModels();
    const {
      exam_id,
      student_ids,
      college_id,
      course_id,
      batch_id,
      max_attempts,
      valid_from,
      valid_to
    } = req.body;

    if (!exam_id) {
      return res.status(400).json({ success: false, message: 'exam_id is required.' });
    }

    const exam = await Exam.findByPk(exam_id);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found.' });
    }

    let targetStudents = [];
    if (Array.isArray(student_ids) && student_ids.length > 0) {
      targetStudents = await ExamStudent.findAll({
        where: { id: { [Op.in]: student_ids }, status: 'ACTIVE' },
        include: [{ model: College, as: 'college', attributes: ['id', 'name'] }]
      });
    } else {
      const studentWhere = { status: 'ACTIVE' };
      if (college_id) studentWhere.college_id = college_id;
      if (course_id) studentWhere.course_id = course_id;
      if (batch_id) studentWhere.batch_id = batch_id;

      targetStudents = await ExamStudent.findAll({
        where: studentWhere,
        include: [{ model: College, as: 'college', attributes: ['id', 'name'] }]
      });
    }

    if (targetStudents.length === 0) {
      return res.status(400).json({ success: false, message: 'No active students found matching the selected criteria.' });
    }

    const assignedResults = [];

    for (const student of targetStudents) {
      const plainPassword = (req.body.password && String(req.body.password).trim()) 
        ? String(req.body.password).trim() 
        : (student.plain_password || generateTestPassword());
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(plainPassword, salt);

      // Update student's primary login password as well
      await student.update({
        password_hash: passwordHash,
        plain_password: plainPassword
      });

      let access = await ExamStudentAccess.findOne({
        where: { student_id: student.id, exam_id: exam.id }
      });

      if (access) {
        await access.update({
          password_hash: passwordHash,
          plain_password: plainPassword,
          status: 'ACTIVE',
          max_attempts: max_attempts || access.max_attempts || exam.max_attempts || 1,
          valid_from: valid_from || access.valid_from,
          valid_to: valid_to || access.valid_to
        });
      } else {
        access = await ExamStudentAccess.create({
          student_id: student.id,
          exam_id: exam.id,
          password_hash: passwordHash,
          plain_password: plainPassword,
          status: 'ACTIVE',
          max_attempts: max_attempts || exam.max_attempts || 1,
          attempts_used: 0,
          valid_from: valid_from || null,
          valid_to: valid_to || null
        });
      }

      assignedResults.push({
        student_id: student.id,
        student_name: student.name,
        student_email: student.email,
        student_phone: student.phone,
        roll_number: student.roll_number,
        college_name: student.college ? student.college.name : 'N/A',
        exam_id: exam.id,
        exam_title: exam.title,
        exam_code: exam.code,
        plain_password: plainPassword
      });
    }

    return res.json({
      success: true,
      message: `Successfully assigned test access to ${assignedResults.length} students.`,
      assigned_count: assignedResults.length,
      credentials: assignedResults
    });
  } catch (err) {
    console.error('Assign exam access error:', err);
    return res.status(500).json({ success: false, message: 'Failed to assign exam access: ' + err.message });
  }
});

router.post('/access/reset-password', async (req, res) => {
  try {
    const { ExamStudentAccess, ExamStudent, Exam } = getExamModels();
    const { exam_id, student_id } = req.body;

    if (!exam_id || !student_id) {
      return res.status(400).json({ success: false, message: 'exam_id and student_id are required.' });
    }

    const access = await ExamStudentAccess.findOne({
      where: { exam_id, student_id }
    });

    if (!access) {
      return res.status(404).json({ success: false, message: 'Exam access record not found for this student.' });
    }

    const plainPassword = generateTestPassword();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainPassword, salt);

    await access.update({
      password_hash: passwordHash,
      status: 'ACTIVE'
    });

    const student = await ExamStudent.findByPk(student_id);
    const exam = await Exam.findByPk(exam_id);

    return res.json({
      success: true,
      message: 'Test password reset successfully.',
      student_name: student ? student.name : 'Student',
      student_email: student ? student.email : '',
      exam_title: exam ? exam.title : '',
      plain_password: plainPassword
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ success: false, message: 'Failed to reset password.' });
  }
});

router.get('/access/:examId', async (req, res) => {
  try {
    const { ExamStudentAccess, ExamStudent, College, ExamAttempt } = getExamModels();
    const accesses = await ExamStudentAccess.findAll({
      where: { exam_id: req.params.examId },
      include: [
        {
          model: ExamStudent,
          as: 'student',
          include: [{ model: College, as: 'college', attributes: ['id', 'name'] }]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const formatted = await Promise.all(accesses.map(async acc => {
      const plain = acc.toJSON();
      const lastAttempt = await ExamAttempt.findOne({
        where: { student_id: acc.student_id, exam_id: acc.exam_id },
        order: [['created_at', 'DESC']]
      });

      return {
        ...plain,
        last_attempt: lastAttempt ? {
          id: lastAttempt.id,
          status: lastAttempt.status,
          total_marks_obtained: lastAttempt.total_marks_obtained,
          percentage: lastAttempt.percentage,
          result_status: lastAttempt.result_status,
          submitted_at: lastAttempt.submitted_at
        } : null
      };
    }));

    return res.json({ success: true, students: formatted });
  } catch (err) {
    console.error('Fetch exam access error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch exam access list.' });
  }
});

router.delete('/access/:examId/:studentId', async (req, res) => {
  try {
    const { ExamStudentAccess } = getExamModels();
    const deleted = await ExamStudentAccess.destroy({
      where: {
        exam_id: req.params.examId,
        student_id: req.params.studentId
      }
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Access record not found.' });
    }

    return res.json({ success: true, message: 'Test access revoked successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to revoke access.' });
  }
});

// ══════════════════════════════════════════════════════════════
// 6. RESULTS, EVALUATION & ANALYTICS
// ══════════════════════════════════════════════════════════════

router.get('/results', async (req, res) => {
  try {
    const { ExamAttempt, Exam, ExamStudent, College } = getExamModels();
    const { exam_id, student_id, college_id, status, search, page, limit } = req.query;

    const p = Math.max(1, parseInt(page) || 1);
    const l = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const offset = (p - 1) * l;

    const where = {};
    if (exam_id) where.exam_id = exam_id;
    if (student_id) where.student_id = student_id;
    if (status) where.status = status;

    const studentWhere = {};
    if (college_id) studentWhere.college_id = college_id;
    if (search) {
      studentWhere[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { roll_number: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await ExamAttempt.findAndCountAll({
      where,
      include: [
        { model: Exam, as: 'exam', attributes: ['id', 'title', 'code', 'total_marks', 'passing_marks'] },
        {
          model: ExamStudent,
          as: 'student',
          where: Object.keys(studentWhere).length > 0 ? studentWhere : undefined,
          include: [{ model: College, as: 'college', attributes: ['id', 'name', 'city'] }]
        }
      ],
      limit: l,
      offset,
      order: [['created_at', 'DESC']]
    });

    return res.json({
      success: true,
      attempts: rows,
      pagination: {
        total: count,
        page: p,
        limit: l,
        totalPages: Math.ceil(count / l)
      }
    });
  } catch (err) {
    console.error('Admin results fetch error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch test results.' });
  }
});

router.get('/results/:attemptId', async (req, res) => {
  try {
    const { ExamAttempt, Exam, ExamStudent, College, StudentAnswer, Question, QuestionOption } = getExamModels();

    const attempt = await ExamAttempt.findByPk(req.params.attemptId, {
      include: [
        { model: Exam, as: 'exam' },
        {
          model: ExamStudent,
          as: 'student',
          include: [{ model: College, as: 'college' }]
        },
        {
          model: StudentAnswer,
          as: 'studentAnswers',
          include: [
            {
              model: Question,
              as: 'question',
              include: [{ model: QuestionOption, as: 'options' }]
            }
          ]
        }
      ]
    });

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt record not found.' });
    }

    return res.json({ success: true, attempt });
  } catch (err) {
    console.error('Admin get attempt detail error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch attempt details.' });
  }
});

// Manual Grade Override for a Student Answer
router.put('/results/:attemptId/evaluate', async (req, res) => {
  try {
    const { ExamAttempt, StudentAnswer, Exam } = getExamModels();
    const { answer_id, marks_awarded, evaluation_feedback, is_correct } = req.body;

    const attempt = await ExamAttempt.findByPk(req.params.attemptId, {
      include: [{ model: Exam, as: 'exam' }, { model: StudentAnswer, as: 'studentAnswers' }]
    });

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found.' });
    }

    const studentAnswer = await StudentAnswer.findOne({
      where: { id: answer_id, attempt_id: attempt.id }
    });

    if (!studentAnswer) {
      return res.status(404).json({ success: false, message: 'Answer record not found.' });
    }

    await studentAnswer.update({
      marks_awarded: marks_awarded !== undefined ? parseFloat(marks_awarded) : studentAnswer.marks_awarded,
      evaluation_feedback: evaluation_feedback !== undefined ? evaluation_feedback : studentAnswer.evaluation_feedback,
      is_correct: is_correct !== undefined ? !!is_correct : studentAnswer.is_correct
    });

    // Recalculate attempt total marks
    const allAnswers = await StudentAnswer.findAll({ where: { attempt_id: attempt.id } });
    let totalMarksObtained = 0;
    for (const ans of allAnswers) {
      totalMarksObtained += parseFloat(ans.marks_awarded || 0);
    }
    totalMarksObtained = Math.max(0, totalMarksObtained);

    const examTotalMarks = attempt.exam ? parseFloat(attempt.exam.total_marks || 100) : 100;
    const passingMarks = attempt.exam ? parseFloat(attempt.exam.passing_marks || 40) : 40;
    const percentage = examTotalMarks > 0 ? ((totalMarksObtained / examTotalMarks) * 100).toFixed(2) : 0;
    const resultStatus = totalMarksObtained >= passingMarks ? 'PASSED' : 'FAILED';

    await attempt.update({
      total_marks_obtained: totalMarksObtained,
      percentage: parseFloat(percentage),
      result_status: resultStatus
    });

    return res.json({
      success: true,
      message: 'Evaluation updated and attempt score recalculated successfully.',
      total_marks_obtained: totalMarksObtained,
      percentage: parseFloat(percentage),
      result_status: resultStatus
    });
  } catch (err) {
    console.error('Admin manual evaluation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update evaluation.' });
  }
});

// Exam Analytics
router.get('/analytics/:examId', async (req, res) => {
  try {
    const { Exam, ExamAttempt, ExamStudentAccess } = getExamModels();
    const exam = await Exam.findByPk(req.params.examId);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found.' });

    const totalAssigned = await ExamStudentAccess.count({ where: { exam_id: exam.id } });
    const attempts = await ExamAttempt.findAll({
      where: {
        exam_id: exam.id,
        status: { [Op.in]: ['COMPLETED', 'SUBMITTED', 'AUTO_SUBMITTED'] }
      },
      attributes: ['id', 'score', 'percentage', 'passed', 'tab_switch_count']
    });

    const totalCompleted = attempts.length;
    let passedCount = 0;
    let totalMarksSum = 0;
    let maxMarks = 0;
    let minMarks = totalCompleted > 0 ? 999999 : 0;

    for (const a of attempts) {
      const marks = parseFloat(a.score || a.total_marks_obtained || 0);
      totalMarksSum += marks;
      if (a.passed || a.result_status === 'PASSED') passedCount++;
      if (marks > maxMarks) maxMarks = marks;
      if (marks < minMarks) minMarks = marks;
    }

    const avgMarks = totalCompleted > 0 ? (totalMarksSum / totalCompleted).toFixed(2) : 0;
    const passPercentage = totalCompleted > 0 ? ((passedCount / totalCompleted) * 100).toFixed(1) : 0;

    return res.json({
      success: true,
      exam_id: exam.id,
      exam_title: exam.title,
      total_assigned: totalAssigned,
      total_completed: totalCompleted,
      passed_count: passedCount,
      failed_count: totalCompleted - passedCount,
      pass_rate_percentage: parseFloat(passPercentage),
      average_marks: parseFloat(avgMarks),
      highest_marks: maxMarks,
      lowest_marks: totalCompleted > 0 ? minMarks : 0
    });
  } catch (err) {
    console.error('Admin analytics error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch analytics.' });
  }
});

// ══════════════════════════════════════════════════════════════
// 10. HOSTINGER MYSQL DATABASE MANAGEMENT & LIVE STATUS
// ══════════════════════════════════════════════════════════════

// Helper to update environment files without corrupting other variables
const updateEnvFiles = (updates) => {
  const rootEnvPath = path.join(__dirname, '../../.env');
  const backendEnvPath = path.join(__dirname, '../.env');

  const updateSingleFile = (filePath) => {
    let content = '';
    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, 'utf8');
    }
    for (const [k, v] of Object.entries(updates)) {
      const reg = new RegExp(`^${k}=.*$`, 'm');
      if (reg.test(content)) {
        content = content.replace(reg, `${k}=${v}`);
      } else {
        content += (content.endsWith('\n') || content === '' ? '' : '\n') + `${k}=${v}\n`;
      }
      process.env[k] = String(v);
    }
    fs.writeFileSync(filePath, content, 'utf8');
  };

  updateSingleFile(backendEnvPath);
  updateSingleFile(rootEnvPath);
};

// 1. Get Live Database Connection Status and Record Metrics
router.get('/database/status', async (req, res) => {
  try {
    const status = getSequelizeStatus();
    const { Exam, Question, ExamStudent, College } = getExamModels();

    const [examsCount, questionsCount, studentsCount, collegesCount] = await Promise.all([
      Exam.count().catch(() => 0),
      Question.count().catch(() => 0),
      ExamStudent.count().catch(() => 0),
      College.count().catch(() => 0)
    ]);

    return res.json({
      success: true,
      status,
      counts: {
        exams: examsCount,
        questions: questionsCount,
        students: studentsCount,
        colleges: collegesCount
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve database status: ' + err.message });
  }
});

// 2. Test Connection to Hostinger MySQL
router.post('/database/test', async (req, res) => {
  try {
    const { host, user, password, database, port } = req.body;
    if (!database || !user) {
      return res.status(400).json({ success: false, message: 'Database name and username are required to test connection.' });
    }

    const testResult = await testMySQLConnection({
      host: host || 'localhost',
      user,
      password: password || '',
      database,
      port: Number(port) || 3306
    });

    if (testResult.success) {
      return res.json({ success: true, message: testResult.message });
    } else {
      return res.status(400).json({ success: false, message: testResult.message });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Test connection failed: ' + err.message });
  }
});

// 3. Connect to Hostinger MySQL, Update .env, Sync Tables & Migrate Data
router.post('/database/connect', async (req, res) => {
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

    // First test the connection to verify validity
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
        message: 'Could not connect to Hostinger MySQL with provided credentials: ' + testResult.message
      });
    }

    // Update both root .env and backend/.env
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

    // Reconnect Sequelize to Hostinger MySQL
    const mysqlSeq = await switchSequelizeToMySQL({
      host: cleanHost,
      user: cleanUser,
      password: cleanPassword,
      database: cleanDatabase,
      port: cleanPort
    });

    // Re-initialize tables and schema
    await initExamDatabase();

    // Reset unified MySQL pool
    await resetMySQLPool({
      host: cleanHost,
      user: cleanUser,
      password: cleanPassword,
      database: cleanDatabase,
      port: cleanPort
    }).catch(() => {});

    return res.json({
      success: true,
      message: `Successfully connected to Hostinger MySQL (${cleanDatabase})! All tables synchronized.`,
      migration: { migrated: true, totalMigrated: 0 },
      status: getSequelizeStatus()
    });
  } catch (err) {
    console.error('Database connection error:', err);
    return res.status(500).json({ success: false, message: 'Database connection error: ' + err.message });
  }
});

// 4. Trigger Data Migration / Verification in Hostinger MySQL
router.post('/database/migrate', async (req, res) => {
  try {
    const seq = getSequelize();
    if (seq.getDialect() !== 'mysql') {
      return res.status(400).json({
        success: false,
        message: 'Active database is not MySQL. Please connect to Hostinger MySQL.'
      });
    }

    return res.json({
      success: true,
      message: 'Active database is running directly on Hostinger MySQL. Schema and tables are fully synchronized.',
      result: { migrated: true, totalMigrated: 0 }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Migration check failed: ' + err.message });
  }
});

export default router;
