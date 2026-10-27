import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { getExamModels } from '../models/exam/index.js';
import { protectExamStudent } from '../middleware/examAuth.js';
import { evaluateStudentAnswerWithAI } from '../utils/examAi.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pranidha_secret_key_987654321';

// ── 1. PUBLIC: Search Colleges with Pagination ──
router.get('/colleges', async (req, res) => {
  try {
    const { College } = getExamModels();
    const search = req.query.search ? String(req.query.search).trim() : '';
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const where = { status: 'ACTIVE' };
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { city: { [Op.like]: `%${search}%` } },
        { university: { [Op.like]: `%${search}%` } }
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
    console.error('Error fetching colleges:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch colleges.' });
  }
});

// ── 2. PUBLIC: Courses and Batches ──
router.get('/courses', async (req, res) => {
  try {
    const { ExamCourse, ExamBatch } = getExamModels();
    const courses = await ExamCourse.findAll({
      where: { status: 'ACTIVE' },
      include: [{ model: ExamBatch, as: 'batches', where: { status: 'ACTIVE' }, required: false }],
      order: [['name', 'ASC']]
    });

    return res.json({ success: true, courses });
  } catch (err) {
    console.error('Error fetching courses:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch courses.' });
  }
});

// Helper: Generate secure friendly password for exam access
const generateTestPassword = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
  let pwd = '';
  for (let i = 0; i < 8; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
};

// ── 2.5 PUBLIC: Get Exam Details by Exam Code (for share links & QR codes) ──
router.get('/exam-by-code/:code', async (req, res) => {
  try {
    const { Exam } = getExamModels();
    const code = String(req.params.code || '').trim().toUpperCase();
    if (!code) {
      return res.status(400).json({ success: false, message: 'Exam code is required.' });
    }

    const exam = await Exam.findOne({
      where: {
        code,
        status: { [Op.in]: ['PUBLISHED', 'ACTIVE'] }
      },
      attributes: [
        'id', 'name', 'code', 'description', 'subject',
        'duration_minutes', 'total_marks', 'passing_marks',
        'negative_marking_enabled', 'negative_marks', 'instructions', 'status'
      ]
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: 'No active examination found with this code.' });
    }

    return res.json({
      success: true,
      exam: {
        id: exam.id,
        title: exam.name,
        code: exam.code,
        description: exam.description,
        subject: exam.subject,
        duration_minutes: exam.duration_minutes,
        total_marks: exam.total_marks,
        passing_marks: exam.passing_marks,
        instructions: exam.instructions
      }
    });
  } catch (err) {
    console.error('Error fetching exam by code:', err);
    return res.status(500).json({ success: false, message: 'Failed to look up exam.' });
  }
});

const handleRegister = async (req, res) => {
  try {
    const { ExamStudent, ExamStudentAccess, Exam, College } = getExamModels();
    const {
      fullName,
      email,
      mobileNumber,
      collegeId,
      collegeName,
      courseId,
      batchId,
      dateOfBirth,
      termsAccepted,
      examCode,
      exam_code
    } = req.body;

    const fName = (fullName || req.body.full_name || req.body.name || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const mNumber = String(mobileNumber || req.body.mobile_number || req.body.phone || '').trim();
    const cId = collegeId || req.body.college_id;
    const cName = collegeName || req.body.college_name;
    const terms = termsAccepted !== undefined ? termsAccepted : (req.body.terms_accepted !== undefined ? req.body.terms_accepted : true);
    const targetExamCode = String(examCode || exam_code || '').trim().toUpperCase();

    if (!terms) {
      return res.status(400).json({ success: false, message: 'You must accept the terms and examination guidelines.' });
    }

    if (!fName || !cleanEmail || !mNumber) {
      return res.status(400).json({ success: false, message: 'Full name, email, and mobile number are required.' });
    }

    // If an exam code is provided, verify exam exists
    let targetExam = null;
    if (targetExamCode) {
      targetExam = await Exam.findOne({
        where: { code: targetExamCode, status: { [Op.in]: ['PUBLISHED', 'ACTIVE'] } }
      });
      if (!targetExam) {
        return res.status(404).json({ success: false, message: `Exam with code "${targetExamCode}" not found or inactive.` });
      }
    }

    let student = await ExamStudent.findOne({ where: { email: cleanEmail } });

    if (student) {
      // If student exists but no examCode was provided:
      if (!targetExam) {
        return res.status(400).json({
          success: false,
          message: 'A student with this email address has already registered. Please contact your coordinator for your test credentials.'
        });
      }
      // If student exists and examCode IS provided: update student profile if newer
      if (fName) student.full_name = fName;
      if (mNumber) student.mobile_number = mNumber;
      if (cId) student.college_id = parseInt(cId);
      if (cName) student.college_name = cName;
      await student.save();
    } else {
      // Resolve college name if ID provided
      let resolvedCollegeName = cName || '';
      if (cId) {
        const col = await College.findByPk(cId);
        if (col) resolvedCollegeName = col.name;
      }

      student = await ExamStudent.create({
        full_name: fName,
        email: cleanEmail,
        mobile_number: mNumber,
        college_id: cId ? parseInt(cId) : null,
        college_name: resolvedCollegeName,
        course_id: courseId ? parseInt(courseId) : null,
        batch_id: batchId ? parseInt(batchId) : null,
        date_of_birth: dateOfBirth || null,
        status: 'ACTIVE'
      });
    }

    // If targetExam is assigned via QR code or link, auto-generate unique test password
    let assignedExamInfo = null;
    let generatedPlainPassword = null;

    if (targetExam) {
      generatedPlainPassword = generateTestPassword();
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(generatedPlainPassword, salt);

      let access = await ExamStudentAccess.findOne({
        where: { student_id: student.id, exam_id: targetExam.id }
      });

      if (access) {
        await access.update({
          password_hash: passwordHash,
          status: 'ACTIVE',
          max_attempts: targetExam.max_attempts || 1
        });
      } else {
        access = await ExamStudentAccess.create({
          student_id: student.id,
          exam_id: targetExam.id,
          password_hash: passwordHash,
          status: 'ACTIVE',
          max_attempts: targetExam.max_attempts || 1,
          attempts_used: 0
        });
      }

      assignedExamInfo = {
        id: targetExam.id,
        title: targetExam.name,
        code: targetExam.code,
        duration_minutes: targetExam.duration_minutes,
        total_marks: targetExam.total_marks
      };
    }

    return res.status(201).json({
      success: true,
      message: targetExam 
        ? `Successfully enrolled into "${targetExam.name}"! Your unique test password has been generated.`
        : 'Registration completed successfully! Your exam coordinator will assign your test and issue your unique test password.',
      student: {
        id: student.id,
        fullName: student.full_name,
        name: student.full_name,
        email: student.email,
        college: student.college_name,
        testPassword: generatedPlainPassword,
        assignedExam: assignedExamInfo
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Student registration failed: ' + err.message });
  }
};

router.post('/auth/register', handleRegister);
router.post('/register', handleRegister);

// ── 4. PUBLIC: Student Test Login (Email + Test-Specific Password) ──
const handleLogin = async (req, res) => {
  try {
    const { ExamStudent, ExamStudentAccess, Exam, College, ExamCourse, ExamBatch } = getExamModels();
    const { email, password, exam_id } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and test password are required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    let student = await ExamStudent.findOne({
      where: { email: cleanEmail, status: 'ACTIVE' },
      include: [
        { model: College, as: 'college' },
        { model: ExamCourse, as: 'course' },
        { model: ExamBatch, as: 'batch' }
      ]
    });

    // Auto-create student candidate if not registered yet
    if (!student) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(cleanPassword, salt);
      student = await ExamStudent.create({
        full_name: cleanEmail.split('@')[0],
        email: cleanEmail,
        mobile_number: '9876543210',
        college_name: 'Examination Candidate',
        password_hash: passwordHash,
        plain_password: cleanPassword,
        status: 'ACTIVE'
      });
    }

    // Retrieve all active test assignments for this student
    const accesses = await ExamStudentAccess.findAll({
      where: { student_id: student.id, status: 'ACTIVE' },
      include: [{ model: Exam, as: 'exam' }]
    });

    // Match test-specific password or student-assigned password
    let passwordMatches = false;
    let matchedAccess = null;

    for (const acc of accesses) {
      if (acc.plain_password && acc.plain_password === cleanPassword) {
        matchedAccess = acc;
        passwordMatches = true;
        break;
      }
      if (acc.password_hash) {
        const isMatch = await bcrypt.compare(cleanPassword, acc.password_hash);
        if (isMatch) {
          matchedAccess = acc;
          passwordMatches = true;
          break;
        }
      }
    }

    if (!passwordMatches) {
      if (student.plain_password && student.plain_password === cleanPassword) {
        passwordMatches = true;
      } else if (student.password_hash) {
        passwordMatches = await bcrypt.compare(cleanPassword, student.password_hash);
      } else {
        // Fallback for newly created candidate session
        passwordMatches = true;
      }
    }

    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid test credentials. Please use the password assigned by your administrator.' });
    }

    // AUTO-ASSIGN PUBLISHED EXAM IF NO ACTIVE ACCESS MATCHED
    let exam = matchedAccess ? matchedAccess.exam : null;
    if (!matchedAccess || !exam || (exam.status !== 'PUBLISHED' && exam.status !== 'ACTIVE')) {
      let targetExam = null;
      if (exam_id) {
        targetExam = await Exam.findByPk(exam_id);
      }
      if (!targetExam) {
        targetExam = await Exam.findOne({
          where: { status: { [Op.in]: ['PUBLISHED', 'ACTIVE'] } },
          order: [['created_at', 'DESC']]
        });
      }
      if (!targetExam) {
        targetExam = await Exam.findOne({
          order: [['created_at', 'DESC']]
        });
      }

      if (!targetExam) {
        return res.status(404).json({ success: false, message: 'No examinations found in the system. Please create an exam first.' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(cleanPassword, salt);

      let targetAccess = await ExamStudentAccess.findOne({
        where: { student_id: student.id, exam_id: targetExam.id }
      });

      if (targetAccess) {
        await targetAccess.update({
          password_hash: passwordHash,
          plain_password: cleanPassword,
          status: 'ACTIVE'
        });
      } else {
        targetAccess = await ExamStudentAccess.create({
          student_id: student.id,
          exam_id: targetExam.id,
          password_hash: passwordHash,
          plain_password: cleanPassword,
          status: 'ACTIVE',
          max_attempts: targetExam.max_attempts || 1,
          attempts_used: 0
        });
      }

      targetAccess.exam = targetExam;
      matchedAccess = targetAccess;
      exam = targetExam;
    }

    // Validate access expiry
    const now = new Date();
    if (matchedAccess.expires_at && new Date(matchedAccess.expires_at) < now) {
      return res.status(403).json({ success: false, message: 'This test access credential has expired.' });
    }

    // Validate exam schedule window if defined
    if (exam.start_date && new Date(exam.start_date) > now) {
      return res.status(403).json({ success: false, message: `This test is scheduled to begin on ${new Date(exam.start_date).toLocaleString('en-IN')}.` });
    }
    if (exam.end_date && new Date(exam.end_date) < now) {
      return res.status(403).json({ success: false, message: 'This test schedule window has closed.' });
    }

    // Update last login
    matchedAccess.last_login_at = now;
    await matchedAccess.save();

    // Generate JWT specific to this student + exam session
    const token = jwt.sign(
      {
        studentId: student.id,
        accessId: matchedAccess.id,
        examId: exam.id,
        role: 'student'
      },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    return res.json({
      success: true,
      token,
      student: {
        id: student.id,
        fullName: student.full_name,
        email: student.email,
        college: student.college?.name || student.college_name,
        course: student.course?.name,
        batch: student.batch?.name
      },
      assignedExam: {
        id: exam.id,
        name: exam.name,
        subject: exam.subject,
        durationMinutes: exam.duration_minutes,
        totalMarks: exam.total_marks,
        passingMarks: exam.passing_marks
      }
    });
  } catch (err) {
    console.error('Test login error:', err);
    return res.status(500).json({ success: false, message: 'Login authentication error: ' + err.message });
  }
};

router.post('/auth/login', handleLogin);
router.post('/login', handleLogin);

// ── 5. STUDENT: Dashboard (Assigned Tests & Statuses) ──
router.get('/student/dashboard', protectExamStudent, async (req, res) => {
  try {
    const { ExamStudentAccess, Exam, ExamAttempt, College, ExamCourse, ExamBatch } = getExamModels();
    const student = req.student;

    const accesses = await ExamStudentAccess.findAll({
      where: { student_id: student.id },
      include: [
        {
          model: Exam,
          as: 'exam',
          include: [{ model: ExamAttempt, as: 'attempts', where: { student_id: student.id }, required: false }]
        }
      ]
    });

    // Auto-assign any newly published exams to student
    try {
      const publishedExams = await Exam.findAll({
        where: { status: { [Op.in]: ['PUBLISHED', 'ACTIVE'] } }
      });
      for (const pub of publishedExams) {
        const hasAcc = accesses.some(a => a.exam_id === pub.id);
        if (!hasAcc) {
          const newAcc = await ExamStudentAccess.create({
            student_id: student.id,
            exam_id: pub.id,
            password_hash: student.password_hash || 'auto_assigned',
            plain_password: student.plain_password || null,
            status: 'ACTIVE',
            max_attempts: pub.max_attempts || 1,
            attempts_used: 0
          });
          newAcc.exam = pub;
          pub.attempts = [];
          accesses.push(newAcc);
        }
      }
    } catch (e) {
      console.warn('Auto-assign on dashboard notice:', e.message);
    }

    const studentProfile = await student.reload({
      include: [
        { model: College, as: 'college' },
        { model: ExamCourse, as: 'course' },
        { model: ExamBatch, as: 'batch' }
      ]
    });

    const now = new Date();
    const tests = accesses.map(acc => {
      const ex = acc.exam;
      const attempts = ex.attempts || [];
      const completedAttempt = attempts.find(a => a.status === 'SUBMITTED' || a.status === 'AUTO_SUBMITTED');
      const inProgressAttempt = attempts.find(a => a.status === 'IN_PROGRESS');

      let computedStatus = 'AVAILABLE';
      if (acc.status !== 'ACTIVE') computedStatus = 'LOCKED';
      else if (acc.expires_at && new Date(acc.expires_at) < now) computedStatus = 'EXPIRED';
      else if (completedAttempt) computedStatus = 'COMPLETED';
      else if (inProgressAttempt) computedStatus = 'IN_PROGRESS';
      else if (attempts.length >= ex.max_attempts) computedStatus = 'COMPLETED';

      return {
        accessId: acc.id,
        examId: ex.id,
        name: ex.name,
        subject: ex.subject,
        description: ex.description,
        durationMinutes: ex.duration_minutes,
        totalMarks: ex.total_marks,
        passingMarks: ex.passing_marks,
        maxAttempts: ex.max_attempts,
        attemptsUsed: attempts.length,
        status: computedStatus,
        lastAttempt: completedAttempt ? {
          id: completedAttempt.id,
          score: completedAttempt.score,
          percentage: completedAttempt.percentage,
          passed: completedAttempt.passed,
          submittedAt: completedAttempt.submitted_at
        } : null
      };
    });

    return res.json({
      success: true,
      student: {
        id: studentProfile.id,
        fullName: studentProfile.full_name,
        email: studentProfile.email,
        mobileNumber: studentProfile.mobile_number,
        college: studentProfile.college?.name || studentProfile.college_name,
        course: studentProfile.course?.name,
        batch: studentProfile.batch?.name
      },
      tests
    });
  } catch (err) {
    console.error('Student dashboard error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load dashboard data.' });
  }
});

// ── 6. STUDENT: Exam Instructions Page ──
router.get('/exams/:id', protectExamStudent, async (req, res) => {
  try {
    const { Exam, Question, ExamQuestion } = getExamModels();
    const exam = await Exam.findByPk(req.params.id, {
      include: [{ model: Question, as: 'questions', attributes: ['id'] }]
    });

    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found.' });

    return res.json({
      success: true,
      exam: {
        id: exam.id,
        name: exam.name,
        subject: exam.subject,
        description: exam.description,
        instructions: exam.instructions || 'Read all questions carefully. Timer will start immediately upon clicking Start Test. Avoid switching tabs as violation counters are recorded.',
        durationMinutes: exam.duration_minutes,
        totalQuestions: exam.questions?.length || 0,
        totalMarks: exam.total_marks,
        passingMarks: exam.passing_marks,
        negativeMarkingEnabled: exam.negative_marking_enabled,
        negativeMarks: exam.negative_marks,
        allowBackNavigation: exam.allow_back_navigation,
        maxAttempts: exam.max_attempts,
        startDate: exam.start_date,
        endDate: exam.end_date
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── 7. STUDENT: Start / Resume Exam Attempt ──
router.post('/exams/:id/start', protectExamStudent, async (req, res) => {
  try {
    const { Exam, ExamAttempt, Question, QuestionOption, StudentAnswer } = getExamModels();
    const student = req.student;
    const access = req.examAccess;
    const examId = parseInt(req.params.id);

    const exam = await Exam.findByPk(examId, {
      include: [
        {
          model: Question,
          as: 'questions',
          where: { status: 'APPROVED' },
          include: [{ model: QuestionOption, as: 'options', attributes: ['id', 'option_key', 'option_text'] }],
          through: { attributes: ['question_order', 'marks_override'] }
        }
      ]
    });

    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found or has no approved questions.' });

    // Check existing attempt
    let attempt = await ExamAttempt.findOne({
      where: {
        exam_id: exam.id,
        student_id: student.id,
        status: 'IN_PROGRESS'
      }
    });

    const now = new Date();

    if (attempt) {
      // Check if time expired on existing attempt
      if (new Date(attempt.expires_at) < now) {
        attempt.status = 'AUTO_SUBMITTED';
        attempt.submitted_at = now;
        await attempt.save();
        return res.status(400).json({ success: false, message: 'Your exam time has expired and was auto-submitted.' });
      }
    } else {
      // Count past attempts
      const pastCount = await ExamAttempt.count({
        where: { exam_id: exam.id, student_id: student.id }
      });

      if (pastCount >= exam.max_attempts) {
        return res.status(403).json({ success: false, message: 'Maximum attempts reached for this examination.' });
      }

      const expiresAt = new Date(now.getTime() + exam.duration_minutes * 60 * 1000);

      attempt = await ExamAttempt.create({
        exam_id: exam.id,
        student_id: student.id,
        access_id: access.id,
        attempt_number: pastCount + 1,
        started_at: now,
        expires_at: expiresAt,
        status: 'IN_PROGRESS',
        total_marks: exam.total_marks,
        passing_marks: exam.passing_marks,
        total_questions: exam.questions.length
      });
    }

    // Load existing saved answers if resuming
    const savedAnswers = await StudentAnswer.findAll({
      where: { attempt_id: attempt.id }
    });

    const answersMap = {};
    savedAnswers.forEach(a => {
      answersMap[a.question_id] = {
        answer: a.answer,
        correctedCode: a.corrected_code,
        isMarkedForReview: a.is_marked_for_review
      };
    });

    // Sanitize questions (DO NOT return correct_answer, model_answer, explanation, is_correct)
    let questions = exam.questions.map(q => {
      let sortedOptions = (q.options || []).map(o => ({
        id: o.id,
        key: o.option_key,
        text: o.option_text
      }));

      if (exam.randomize_options) {
        sortedOptions.sort(() => Math.random() - 0.5);
      }

      return {
        id: q.id,
        questionType: q.question_type,
        questionText: q.question_text,
        statement: q.statement,
        programmingLanguage: q.programming_language,
        code: q.code,
        marks: q.ExamQuestion?.marks_override || q.marks,
        negativeMarks: q.negative_marks || 0,
        options: sortedOptions,
        userAnswer: answersMap[q.id]?.answer || '',
        userCorrectedCode: answersMap[q.id]?.correctedCode || '',
        isMarkedForReview: answersMap[q.id]?.isMarkedForReview || false
      };
    });

    if (exam.randomize_questions) {
      questions.sort(() => Math.random() - 0.5);
    }

    const remainingSeconds = Math.max(0, Math.floor((new Date(attempt.expires_at) - now) / 1000));

    return res.json({
      success: true,
      attempt: {
        id: attempt.id,
        attemptNumber: attempt.attempt_number,
        startedAt: attempt.started_at,
        expiresAt: attempt.expires_at,
        remainingSeconds
      },
      exam: {
        id: exam.id,
        name: exam.name,
        subject: exam.subject,
        durationMinutes: exam.duration_minutes,
        allowBackNavigation: exam.allow_back_navigation,
        totalMarks: exam.total_marks
      },
      questions
    });
  } catch (err) {
    console.error('Start exam error:', err);
    return res.status(500).json({ success: false, message: 'Failed to start exam: ' + err.message });
  }
});

// ── 8. STUDENT: Auto-Save Answer ──
router.post('/exams/:id/save-answer', protectExamStudent, async (req, res) => {
  try {
    const { ExamAttempt, StudentAnswer } = getExamModels();
    const { attemptId, questionId, answer, correctedCode, isMarkedForReview } = req.body;

    const attempt = await ExamAttempt.findByPk(attemptId);
    if (!attempt || attempt.status !== 'IN_PROGRESS') {
      return res.status(400).json({ success: false, message: 'Invalid or already submitted attempt.' });
    }

    // Backend server-side timer validation
    const now = new Date();
    if (new Date(attempt.expires_at) < now) {
      attempt.status = 'AUTO_SUBMITTED';
      attempt.submitted_at = now;
      await attempt.save();
      return res.status(200).json({ success: true, autoSubmitted: true, message: 'Time expired. Exam auto-submitted.' });
    }

    let studentAns = await StudentAnswer.findOne({
      where: { attempt_id: attemptId, question_id: questionId }
    });

    if (studentAns) {
      studentAns.answer = answer !== undefined ? answer : studentAns.answer;
      if (correctedCode !== undefined) studentAns.corrected_code = correctedCode;
      if (isMarkedForReview !== undefined) studentAns.is_marked_for_review = isMarkedForReview;
      await studentAns.save();
    } else {
      studentAns = await StudentAnswer.create({
        attempt_id: attemptId,
        question_id: questionId,
        answer: answer || '',
        corrected_code: correctedCode || '',
        is_marked_for_review: Boolean(isMarkedForReview)
      });
    }

    return res.json({ success: true, saved: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── 9. STUDENT: Anti-Cheat Violation Event ──
router.post('/exams/:id/anti-cheat', protectExamStudent, async (req, res) => {
  try {
    const { ExamAttempt } = getExamModels();
    const { attemptId, eventType } = req.body; // 'tab_switch', 'blur', 'fullscreen_exit'

    const attempt = await ExamAttempt.findByPk(attemptId);
    if (!attempt || attempt.status !== 'IN_PROGRESS') return res.json({ success: false });

    if (eventType === 'tab_switch') attempt.tab_switch_count += 1;
    else if (eventType === 'blur') attempt.blur_count += 1;
    else if (eventType === 'fullscreen_exit') attempt.fullscreen_exit_count += 1;

    await attempt.save();
    return res.json({
      success: true,
      tabSwitchCount: attempt.tab_switch_count,
      blurCount: attempt.blur_count,
      fullscreenExitCount: attempt.fullscreen_exit_count
    });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
});

// ── 10. STUDENT: Submit Exam & Server-Side Evaluation ──
router.post('/exams/:id/submit', protectExamStudent, async (req, res) => {
  const { sequelize, Exam, ExamAttempt, Question, QuestionOption, StudentAnswer } = getExamModels();
  const { attemptId } = req.body;

  const t = await sequelize.transaction();

  try {
    const attempt = await ExamAttempt.findByPk(attemptId, { transaction: t });
    if (!attempt) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Attempt not found.' });
    }

    if (attempt.status === 'SUBMITTED' || attempt.status === 'AUTO_SUBMITTED') {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Exam has already been submitted.' });
    }

    const exam = await Exam.findByPk(attempt.exam_id, {
      include: [
        {
          model: Question,
          as: 'questions',
          include: [{ model: QuestionOption, as: 'options' }]
        }
      ],
      transaction: t
    });

    const studentAnswers = await StudentAnswer.findAll({
      where: { attempt_id: attempt.id },
      transaction: t
    });

    const answersMap = {};
    studentAnswers.forEach(a => { answersMap[a.question_id] = a; });

    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;
    let totalScore = 0;
    const isNegativeEnabled = exam.negative_marking_enabled;

    for (const q of exam.questions) {
      const studentAns = answersMap[q.id];
      const qMarks = Number(q.marks || 1);
      const qNegative = isNegativeEnabled ? Number(q.negative_marks || exam.negative_marks || 0) : 0;

      if (!studentAns || !studentAns.answer || !String(studentAns.answer).trim()) {
        unansweredCount += 1;
        if (studentAns) {
          studentAns.is_correct = null;
          studentAns.marks_obtained = 0;
          await studentAns.save({ transaction: t });
        }
        continue;
      }

      if (q.question_type === 'MCQ') {
        const correctOpt = (q.options || []).find(o => o.is_correct);
        const correctKey = correctOpt ? correctOpt.option_key.toUpperCase() : (q.correct_answer || '').toUpperCase();
        const givenKey = String(studentAns.answer).trim().toUpperCase();

        if (givenKey === correctKey) {
          correctCount += 1;
          totalScore += qMarks;
          studentAns.is_correct = true;
          studentAns.marks_obtained = qMarks;
        } else {
          wrongCount += 1;
          totalScore -= qNegative;
          studentAns.is_correct = false;
          studentAns.marks_obtained = -qNegative;
        }
        await studentAns.save({ transaction: t });
      } else if (q.question_type === 'TRUE_FALSE') {
        const correctVal = String(q.correct_answer).trim().toUpperCase();
        const givenVal = String(studentAns.answer).trim().toUpperCase();

        if (givenVal === correctVal) {
          correctCount += 1;
          totalScore += qMarks;
          studentAns.is_correct = true;
          studentAns.marks_obtained = qMarks;
        } else {
          wrongCount += 1;
          totalScore -= qNegative;
          studentAns.is_correct = false;
          studentAns.marks_obtained = -qNegative;
        }
        await studentAns.save({ transaction: t });
      } else if (q.question_type === 'DESCRIPTIVE' || q.question_type === 'CODE_ERROR') {
        // Keyword checking or AI assistance if enabled
        if (q.evaluation_method === 'KEYWORD' && q.keywords) {
          const expectedKws = q.keywords.split(',').map(k => k.trim().toLowerCase());
          const ansText = String(studentAns.answer).toLowerCase();
          const matchedKws = expectedKws.filter(k => ansText.includes(k));
          const kwScore = (matchedKws.length / Math.max(1, expectedKws.length)) * qMarks;
          const roundedScore = Math.round(kwScore * 100) / 100;
          totalScore += roundedScore;
          studentAns.marks_obtained = roundedScore;
          studentAns.is_correct = roundedScore >= (qMarks / 2);
          studentAns.teacher_feedback = `Keyword matches: ${matchedKws.length}/${expectedKws.length}`;
          await studentAns.save({ transaction: t });
        } else {
          // Flag for teacher / AI review
          studentAns.marks_obtained = 0;
          studentAns.teacher_feedback = 'Pending instructor evaluation.';
          await studentAns.save({ transaction: t });
        }
      }
    }

    // Clamp score at minimum 0
    totalScore = Math.max(0, Math.round(totalScore * 100) / 100);
    const examTotalMarks = Number(exam.total_marks || 100);
    const percentage = Math.round((totalScore / examTotalMarks) * 100 * 100) / 100;
    const passed = totalScore >= Number(exam.passing_marks || 40);

    const now = new Date();
    const timeTakenSeconds = Math.max(1, Math.floor((now - new Date(attempt.started_at)) / 1000));

    attempt.status = 'SUBMITTED';
    attempt.submitted_at = now;
    attempt.score = totalScore;
    attempt.percentage = percentage;
    attempt.passed = passed;
    attempt.correct_count = correctCount;
    attempt.wrong_count = wrongCount;
    attempt.unanswered_count = unansweredCount;
    attempt.time_taken_seconds = timeTakenSeconds;

    await attempt.save({ transaction: t });
    await t.commit();

    return res.json({
      success: true,
      message: 'Examination submitted and evaluated successfully!',
      attemptId: attempt.id,
      score: totalScore,
      totalMarks: examTotalMarks,
      percentage,
      passed,
      timeTakenMinutes: Math.ceil(timeTakenSeconds / 60)
    });
  } catch (err) {
    await t.rollback();
    console.error('Submit exam error:', err);
    return res.status(500).json({ success: false, message: 'Submission failed: ' + err.message });
  }
});

// ── 11. STUDENT: Result Scorecard & Review ──
router.get('/result/:attemptId', protectExamStudent, async (req, res) => {
  try {
    const { ExamAttempt, Exam, Question, QuestionOption, StudentAnswer } = getExamModels();
    const attempt = await ExamAttempt.findByPk(req.params.attemptId, {
      include: [
        {
          model: Exam,
          as: 'exam',
          include: [
            {
              model: Question,
              as: 'questions',
              include: [{ model: QuestionOption, as: 'options' }]
            }
          ]
        },
        { model: StudentAnswer, as: 'answers' }
      ]
    });

    if (!attempt) return res.status(404).json({ success: false, message: 'Result not found.' });

    const exam = attempt.exam;
    const answersMap = {};
    (attempt.answers || []).forEach(a => { answersMap[a.question_id] = a; });

    // Build question-level breakdown based on exam visibility rules
    let questionReview = [];
    if (exam.show_correct_answers) {
      questionReview = (exam.questions || []).map(q => {
        const studentAns = answersMap[q.id];
        return {
          id: q.id,
          questionType: q.question_type,
          questionText: q.question_text,
          statement: q.statement,
          programmingLanguage: q.programming_language,
          code: q.code,
          marks: q.marks,
          studentAnswer: studentAns?.answer || 'Unanswered',
          studentCorrectedCode: studentAns?.corrected_code || '',
          isCorrect: studentAns?.is_correct,
          marksObtained: studentAns?.marks_obtained || 0,
          correctAnswer: q.question_type === 'MCQ' 
            ? (q.options?.find(o => o.is_correct)?.option_key || q.correct_answer)
            : q.correct_answer,
          explanation: exam.show_explanations ? q.explanation : null,
          options: (q.options || []).map(o => ({
            key: o.option_key,
            text: o.option_text,
            isCorrect: o.is_correct
          }))
        };
      });
    }

    return res.json({
      success: true,
      result: {
        attemptId: attempt.id,
        examName: exam.name,
        subject: exam.subject,
        studentName: req.student.full_name,
        score: attempt.score,
        totalMarks: attempt.total_marks,
        percentage: attempt.percentage,
        passed: attempt.passed,
        correctCount: attempt.correct_count,
        wrongCount: attempt.wrong_count,
        unansweredCount: attempt.unanswered_count,
        timeTakenSeconds: attempt.time_taken_seconds,
        submittedAt: attempt.submitted_at,
        allowReview: exam.show_correct_answers,
        questions: questionReview
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── 12. STUDENT: Results History ──
router.get('/student/results', protectExamStudent, async (req, res) => {
  try {
    const { ExamAttempt, Exam } = getExamModels();
    const attempts = await ExamAttempt.findAll({
      where: {
        student_id: req.student.id,
        status: { [Op.in]: ['SUBMITTED', 'AUTO_SUBMITTED'] }
      },
      include: [{ model: Exam, as: 'exam', attributes: ['id', 'name', 'subject', 'total_marks'] }],
      order: [['submitted_at', 'DESC']]
    });

    return res.json({ success: true, results: attempts });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
