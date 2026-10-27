import express from 'express';
import Admission from '../models/Admission.js';
import Announcement from '../models/Announcement.js';
import Gallery from '../models/Gallery.js';
import Event from '../models/Event.js';
import Query from '../models/Query.js';
import FeeStructure from '../models/FeeStructure.js';
import LibraryNote from '../models/LibraryNote.js';
import Course from '../models/Course.js';
import Certificate from '../models/Certificate.js';
import mockStore from '../config/mockStore.js';
import { uploadAdmissions } from '../middleware/upload.js';
import QRCode from 'qrcode';
import { getMySQLPool } from '../config/mysql.js';

const router = express.Router();

const buildFallbackResume = (details) => {
  const roleLabel = details.role || 'Developer';
  const skillList = String(details.skills || 'Java, DSA, React, Node.js')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const toolList = String(details.tools || 'GitHub, VS Code, Figma')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const frameworkList = String(details.frameworks || 'React, Tailwind, Express')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const projectList = String(details.projects || 'Quiz platform, resume builder, compiler app')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const combinedSkills = [...new Set([ ...skillList, ...toolList, ...frameworkList ])];
  const summary = `Motivated ${roleLabel.toLowerCase()} with hands-on experience in ${combinedSkills.slice(0, 6).join(', ')}. Skilled at building polished, reliable solutions, turning ideas into real products, and presenting work with clarity, confidence, and a modern engineering mindset.`;

  return {
    headline: `${details.name || 'Developer'} • ${roleLabel}`,
    summary,
    skills: combinedSkills,
    projects: projectList,
    tools: toolList,
    frameworks: frameworkList,
    highlights: [
      'Built practical projects with modern tools, clear architecture, and clean execution',
      'Strong problem-solving, collaboration, and product-focused development mindset',
      'Ready for internships, interviews, and real-world engineering teams',
      'Comfortable with both coding fundamentals and modern frontend/backend workflows'
    ]
  };
};

const buildFallbackDsaFeedback = (question, code) => {
  const normalized = String(code || '').toLowerCase();
  const suggestions = [];

  if (!normalized.includes('return') && !normalized.includes('system.out.print') && !normalized.includes('console.log')) {
    suggestions.push('Return the computed value or print the final answer explicitly before submitting.');
  }
  if (/for\s*\((?:.*?;.*?;.*?<=.*?\))/.test(normalized) || /for\s*\((?:.*?;.*?;.*?<.*?\))/.test(normalized)) {
    suggestions.push('Double-check your loop bounds to avoid off-by-one mistakes.');
  }
  if (question.toLowerCase().includes('recursion') || question.toLowerCase().includes('factorial') || question.toLowerCase().includes('fibonacci')) {
    suggestions.push('Verify the base case before the recursive call to prevent infinite recursion.');
  }
  if (question.toLowerCase().includes('palindrome') || question.toLowerCase().includes('string')) {
    suggestions.push('Compare characters carefully and handle spaces or case sensitivity if the problem requires it.');
  }
  if (question.toLowerCase().includes('tree') || question.toLowerCase().includes('graph')) {
    suggestions.push('Confirm your traversal order and whether you are visiting each node exactly once.');
  }
  if (suggestions.length === 0) {
    suggestions.push('Review the edge cases, especially empty input, duplicates, and the expected return type.');
  }

  return {
    verdict: 'Needs review',
    confidence: 'Medium',
    suggestions,
    nextSteps: [
      'Test your code on a simple sample input first.',
      'Check for missing base cases, incorrect loop bounds, or incorrect return statements.',
      'Re-run the solution on edge cases before finalizing.'
    ]
  };
};

const buildFallbackQuiz = (details) => {
  const course = details.course || 'Course';
  const module = details.module || 'Core concepts';
  const level = details.level || 'Beginner';
  const audience = details.audience || 'specific student';
  const studentName = details.studentName || 'Student';

  return {
    title: `${course} AI Quiz — ${module}`,
    summary: `A ${level.toLowerCase()} quiz for ${studentName} focused on ${module}. It is ready for ${audience} delivery in the admin panel or practice room.`,
    questions: [
      {
        prompt: `What is the main learning goal of ${module} in ${course}?`,
        options: ['Practice the theory', 'Apply concepts confidently', 'Memorize definitions only', 'Avoid hands-on tasks'],
        answer: 'Apply concepts confidently',
        explanation: 'The module should help learners turn theory into practical understanding.'
      },
      {
        prompt: `Which habit will help ${studentName} improve fastest in ${course}?`,
        options: ['Solve small examples daily', 'Skip feedback', 'Avoid revision', 'Only read notes'],
        answer: 'Solve small examples daily',
        explanation: 'Consistent practice is the strongest way to build confidence and retention.'
      },
      {
        prompt: `What makes this quiz useful for a ${audience} session?`,
        options: ['It tracks recall and reflection', 'It replaces live discussion', 'It avoids practical examples', 'It makes revision harder'],
        answer: 'It tracks recall and reflection',
        explanation: 'A good quiz should reinforce key ideas and reveal where more support is needed.'
      }
    ]
  };
};

const buildFallbackAssignment = (details) => {
  const course = details.course || 'Course';
  const module = details.module || 'Core concepts';
  const audience = details.audience || 'group chat';
  const studentName = details.studentName || 'Student';

  return {
    title: `${course} AI Assignment — ${module}`,
    summary: `This assignment is tailored for ${studentName} and designed for ${audience} delivery with clear practice outcomes.`,
    tasks: [
      `Review the key ideas from ${module} in ${course}.`,
      'Create a short solution or response using a real example from the lesson.',
      'Add one reflection note describing what was learned and what should be practiced next.'
    ],
    criteria: [
      'Clear understanding of the lesson objective',
      'Accurate examples and practical application',
      'Professional formatting and complete submission steps'
    ],
    dueHint: 'Submit within the next class or assigned practice window.'
  };
};

// 1. ANNOUNCEMENTS
// @desc    Get all announcements
// @route   GET /api/public/announcements
router.get('/announcements', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const list = await mockStore.find('announcements');
      return res.json({ success: true, count: list.length, data: list });
    }
    const list = await Announcement.find().sort({ createdAt: -1 });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. GALLERY
// @desc    Get gallery items
// @route   GET /api/public/gallery
router.get('/gallery', async (req, res) => {
  const { category } = req.query;
  try {
    if (mockStore.isMock) {
      let list = await mockStore.find('gallery');
      if (category && category !== 'all') {
        list = list.filter(item => item.category === category);
      }
      return res.json({ success: true, count: list.length, data: list });
    }
    const query = category && category !== 'all' ? { category } : {};
    const list = await Gallery.find(query).sort({ date: -1 });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. EVENTS (Calendar)
// @desc    Get school calendar events
// @route   GET /api/public/events
router.get('/events', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const list = await mockStore.find('events');
      return res.json({ success: true, count: list.length, data: list });
    }
    const list = await Event.find().sort({ startDate: 1 });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. SUBMIT CONTACT QUERY
// @desc    Submit contact query form
// @route   POST /api/public/queries
router.post('/queries', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  try {
    if (mockStore.isMock) {
      const query = await mockStore.create('queries', { name, email, phone, subject, message, status: 'unread' });
      return res.status(201).json({ success: true, message: 'Your message has been sent successfully!', data: query });
    }
    const query = await Query.create({ name, email, phone, subject, message });
    res.status(201).json({ success: true, message: 'Your message has been sent successfully!', data: query });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. SUBMIT ADMISSION FORM
// @desc    Apply for admission
// @route   POST /api/public/admissions/apply
router.post('/admissions/apply', (req, res) => {
  res.status(403).json({ 
    success: false, 
    message: 'Online admissions are currently disabled. Please contact the administrator to record an admission.' 
  });
});

// 6. TRACK ADMISSION STATUS
// @desc    Track admission application status
// @route   GET /api/public/admissions/track/:appNo
router.get('/admissions/track/:appNo', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const admission = await mockStore.findOne('admissions', { applicationNumber: req.params.appNo });
      if (!admission) {
        return res.status(404).json({ success: false, message: 'Application number not found' });
      }
      return res.json({ success: true, data: admission });
    }

    const admission = await Admission.findOne({ applicationNumber: req.params.appNo });
    if (!admission) {
      return res.status(404).json({ success: false, message: 'Application number not found' });
    }
    res.json({ success: true, data: admission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 7. PUBLIC LIBRARY NOTES
// @desc    Get downloadable course notes for students
// @route   GET /api/public/library-notes
router.get('/library-notes', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const list = await mockStore.find('libraryNotes');
      return res.json({ success: true, count: list.length, data: list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
    }
    const list = await LibraryNote.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 8. PUBLIC FEE STRUCTURES
// @desc    Get all active fee structures
// @route   GET /api/public/fee-structures
router.get('/fee-structures', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const list = await mockStore.find('feeStructures', { isActive: true });
      return res.json({ success: true, count: list.length, data: list });
    }
    const list = await FeeStructure.find({ isActive: true });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 9. PUBLIC COURSES
// @desc    Get active courses published by the admin course manager
// @route   GET /api/public/courses
router.get('/courses', async (req, res) => {
  try {
    if (mockStore.isMock) {
      let list = await mockStore.find('courses');
      if (!list || list.length === 0) {
        list = mockStore.courses || [];
      }
      const activeCourses = list
        .filter((course) => course.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      return res.json({ success: true, count: activeCourses.length, data: activeCourses });
    }

    const list = await Course.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 9. AI RESUME POLISHING
// @desc    Generate polished, professional resume text using Gemini
// @route   POST /api/public/resume/ai-polish
router.post('/resume/ai-polish', async (req, res) => {
  try {
    const { name, role, focus, skills, projects, phone, address, tools, frameworks } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'Gemini API key is not configured on the server.' });
    }

    const prompt = `You are a senior resume writer. Rewrite the following candidate details into a polished, professional resume profile for a developer or trainee. Return ONLY valid JSON with fields: "headline", "summary", "skills", "projects", "tools", "frameworks", and "highlights". The "skills", "projects", "tools", and "frameworks" values must be arrays of concise strings. Make the summary richer, more interview-ready, and more modern. Emphasize practical delivery, team collaboration, and real-world engineering habits. Candidate details:\nName: ${name || 'Developer'}\nRole: ${role || 'Java + DSA Learner'}\nSummary: ${focus || 'Build clean solutions and ship real projects.'}\nSkills: ${skills || 'Java, DSA, React, Node.js'}\nTools: ${tools || 'GitHub, VS Code, Figma'}\nFrameworks: ${frameworks || 'React, Tailwind, Express'}\nProjects: ${projects || 'Online compiler, quiz platform, resume builder'}\nPhone: ${phone || 'Not provided'}\nAddress: ${address || 'Not provided'}`;

    let parsed = null;
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.45, maxOutputTokens: 700 }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error?.message || 'Gemini request failed.');
      }

      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanedText);
    } catch (aiError) {
      console.warn('Gemini AI polish unavailable, using professional fallback content.', aiError.message);
    }

    const fallbackData = buildFallbackResume({ name, role, focus, skills, projects, phone, address, tools, frameworks });
    const output = parsed || fallbackData;

    return res.json({
      success: true,
      data: {
        headline: output.headline || role || 'Java + DSA Learner',
        summary: output.summary || focus || 'Build clean solutions and ship real projects.',
        skills: Array.isArray(output.skills) ? output.skills : (skills || '').split(',').map(item => item.trim()).filter(Boolean),
        projects: Array.isArray(output.projects) ? output.projects : (projects || '').split(',').map(item => item.trim()).filter(Boolean),
        tools: Array.isArray(output.tools) ? output.tools : (tools || '').split(',').map(item => item.trim()).filter(Boolean),
        frameworks: Array.isArray(output.frameworks) ? output.frameworks : (frameworks || '').split(',').map(item => item.trim()).filter(Boolean),
        highlights: Array.isArray(output.highlights) ? output.highlights : [
          'Strong problem-solving mindset',
          'Modern frontend and backend development experience',
          'Ready for internships, interviews, and real-world engineering roles'
        ]
      }
    });
  } catch (error) {
    console.error('Resume AI polish error:', error);
    res.status(500).json({ success: false, message: error.message || 'Unable to generate AI-enhanced resume content.' });
  }
});

// 10. DSA FEEDBACK
// @desc    Generate AI-style suggestions for DSA code submissions
// @route   POST /api/public/dsa-feedback
router.post('/ai-quiz-generator', async (req, res) => {
  try {
    const { course, module, level, studentName, audience } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const prompt = `You are a senior curriculum designer. Create a polished quiz for a course module.
Return ONLY valid JSON with fields: title, summary, questions.
Each question must have: prompt, options (array of 4 strings), answer, explanation.
Focus on a ${level || 'Beginner'} level for ${course || 'the selected course'}.
Module focus: ${module || 'core learning objectives'}.
Audience: ${audience || 'specific student'}.
Student: ${studentName || 'Student'}.
Make the quiz useful for admin delivery, group chat, or a personalized practice session.`;

    let parsed = null;
    try {
      if (!apiKey) throw new Error('No Gemini API key');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.45, maxOutputTokens: 900 }
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || 'Gemini request failed.');
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanedText);
    } catch (aiError) {
      console.warn('Gemini AI quiz generation unavailable, using fallback quiz.', aiError.message);
    }

    const fallback = buildFallbackQuiz({ course, module, level, studentName, audience });
    const output = parsed || fallback;

    return res.json({
      success: true,
      data: {
        title: output.title || fallback.title,
        summary: output.summary || fallback.summary,
        questions: Array.isArray(output.questions) && output.questions.length ? output.questions : fallback.questions
      }
    });
  } catch (error) {
    console.error('AI quiz generation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Unable to generate AI quiz content.' });
  }
});

router.post('/ai-assignment-generator', async (req, res) => {
  try {
    const { course, module, studentName, audience, difficulty } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const prompt = `You are a senior education designer. Create a polished practice assignment for a course module.
Return ONLY valid JSON with fields: title, summary, tasks (array of strings), criteria (array of strings), dueHint.
Course: ${course || 'selected course'}.
Module: ${module || 'core learning objectives'}.
Student: ${studentName || 'Student'}.
Audience: ${audience || 'group chat'}.
Difficulty: ${difficulty || 'Intermediate'}.
Make it suitable for admin posting, specific student practice, or a group-chat assignment.`;

    let parsed = null;
    try {
      if (!apiKey) throw new Error('No Gemini API key');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.45, maxOutputTokens: 900 }
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || 'Gemini request failed.');
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanedText);
    } catch (aiError) {
      console.warn('Gemini AI assignment generation unavailable, using fallback assignment.', aiError.message);
    }

    const fallback = buildFallbackAssignment({ course, module, studentName, audience });
    const output = parsed || fallback;

    return res.json({
      success: true,
      data: {
        title: output.title || fallback.title,
        summary: output.summary || fallback.summary,
        tasks: Array.isArray(output.tasks) && output.tasks.length ? output.tasks : fallback.tasks,
        criteria: Array.isArray(output.criteria) && output.criteria.length ? output.criteria : fallback.criteria,
        dueHint: output.dueHint || fallback.dueHint
      }
    });
  } catch (error) {
    console.error('AI assignment generation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Unable to generate AI assignment content.' });
  }
});

router.post('/dsa-feedback', async (req, res) => {
  try {
    const { question, code } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({ success: true, data: buildFallbackDsaFeedback(question, code) });
    }

    const prompt = `You are a senior DSA mentor. Given this coding question and solution attempt, provide concise feedback in valid JSON with fields: verdict, confidence, suggestions, and nextSteps. If the solution is likely incorrect, explain why and give specific improvement tips. Keep the tone practical and beginner-friendly.\nQuestion: ${question || 'Solve the DSA problem.'}\nCode:\n${code || 'No code provided.'}`;

    let parsed = null;
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.35, maxOutputTokens: 600 }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error?.message || 'Gemini request failed.');
      }

      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanedText);
    } catch (aiError) {
      console.warn('Gemini DSA feedback unavailable, using fallback suggestions.', aiError.message);
    }

    const fallback = buildFallbackDsaFeedback(question, code);

    return res.json({
      success: true,
      data: {
        verdict: parsed?.verdict || fallback.verdict,
        confidence: parsed?.confidence || fallback.confidence,
        suggestions: Array.isArray(parsed?.suggestions) && parsed.suggestions.length ? parsed.suggestions : fallback.suggestions,
        nextSteps: Array.isArray(parsed?.nextSteps) && parsed.nextSteps.length ? parsed.nextSteps : fallback.nextSteps
      }
    });
  } catch (error) {
    console.error('DSA feedback error:', error);
    res.status(500).json({ success: false, message: error.message || 'Unable to generate DSA feedback.' });
  }
});

// Public Certificate Verification
router.get('/verify-certificate/:certificateNumber', async (req, res) => {
  try {
    const rawNumber = req.params.certificateNumber?.trim();
    if (!rawNumber) {
      return res.status(400).json({ success: false, message: 'Certificate number is required.' });
    }

    let certificate = null;
    // 1. Direct array in mockStore
    if (Array.isArray(mockStore.certificates)) {
      certificate = mockStore.certificates.find(
        (c) =>
          c.certificateNumber?.trim().toLowerCase() === rawNumber.toLowerCase() ||
          c._id?.toLowerCase() === rawNumber.toLowerCase()
      );
    }

    // 2. mockStore find helper
    if (!certificate && mockStore.isMock) {
      const list = await mockStore.find('certificates');
      certificate = list.find(
        (c) =>
          c.certificateNumber?.trim().toLowerCase() === rawNumber.toLowerCase() ||
          c._id?.toLowerCase() === rawNumber.toLowerCase()
      );
    }

    // 3. Mongoose Certificate model
    if (!certificate && mongoose.connection?.readyState === 1) {
      try {
        certificate = await Certificate.findOne({
          certificateNumber: { $regex: new RegExp(`^${rawNumber}$`, 'i') }
        }).lean();
      } catch (e) {}
    }

    // 4. Hostinger MySQL `certificates` table
    if (!certificate) {
      try {
        const pool = getMySQLPool();
        const [rows] = await pool.query(
          'SELECT * FROM certificates WHERE LOWER(certificate_number) = LOWER(?) LIMIT 1',
          [rawNumber]
        );
        if (rows && rows.length > 0) {
          const row = rows[0];
          certificate = {
            certificateNumber: row.certificate_number,
            studentName: row.student_name,
            candidateEmail: row.candidate_email,
            internshipName: row.internship_name,
            grade: row.grade,
            percentage: row.percentage,
            score: row.score,
            totalMarks: row.total_marks,
            issueDate: row.issue_date,
            startDate: row.start_date,
            endDate: row.end_date,
            description: row.description,
            qrCodeData: row.qr_code_data,
            status: row.status
          };
        }
      } catch (sqlErr) {}
    }

    // 5. Hostinger MySQL `assessment_attempts` table fallback
    if (!certificate) {
      try {
        const pool = getMySQLPool();
        const [rows] = await pool.query(
          `SELECT a.*, asm.title as asm_title, asm.created_at as asm_created 
           FROM assessment_attempts a 
           LEFT JOIN assessments asm ON a.assessment_id = asm.id 
           WHERE LOWER(a.certificate_number) = LOWER(?) LIMIT 1`,
          [rawNumber]
        );
        if (rows && rows.length > 0) {
          const r = rows[0];
          const pct = Number(r.percentage) || 0;
          const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : 'D';
          const issueDate = r.submitted_at ? new Date(r.submitted_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'September 18, 2026';
          const startDate = r.asm_created ? new Date(r.asm_created).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'August 1, 2026';
          const endDate = r.submitted_at ? new Date(r.submitted_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : issueDate;
          certificate = {
            certificateNumber: r.certificate_number,
            studentName: r.candidate_name || 'Student',
            candidateEmail: r.candidate_email || '',
            internshipName: r.asm_title || 'Certification Assessment',
            grade,
            percentage: pct,
            score: r.score || 0,
            totalMarks: r.total_marks || 0,
            issueDate,
            startDate,
            endDate,
            description: 'This certification is awarded in recognition of the successful completion of the curriculum and mastery of the course content.',
            companyName: 'APPLE TREE INFOTECH',
            status: 'valid'
          };
        }
      } catch (sqlErr2) {}
    }

    if (!certificate) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: 'No certificate found with this Certificate Number. Please verify the number and try again.'
      });
    }

    // Normalize all fields to guarantee no empty values
    const studentName = certificate.studentName || certificate.student_name || certificate.candidateName || 'Student';
    const internshipName = certificate.internshipName || certificate.internship_name || certificate.courseTitle || 'Certification Course';
    const certificateNumber = certificate.certificateNumber || certificate.certificate_number || rawNumber;
    const grade = certificate.grade || (certificate.percentage !== undefined ? (certificate.percentage >= 90 ? 'A+' : certificate.percentage >= 80 ? 'A' : certificate.percentage >= 70 ? 'B+' : certificate.percentage >= 60 ? 'B' : certificate.percentage >= 50 ? 'C' : 'D') : 'A');
    const percentage = certificate.percentage !== undefined ? Number(certificate.percentage) : 0;
    const issueDate = certificate.issueDate || certificate.issue_date || 'September 18, 2026';
    const startDate = certificate.startDate || certificate.start_date || 'August 1, 2026';
    const endDate = certificate.endDate || certificate.end_date || issueDate;

    // Generate or ensure QR code
    let qrCode = certificate.qrCodeData;
    if (!qrCode) {
      try {
        const verifyUrl = `${req.protocol}://${req.get('host')}/verify-certificate/${encodeURIComponent(certificateNumber)}`;
        qrCode = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 140 });
      } catch (qrErr) {
        console.error('QR code generation error:', qrErr);
      }
    }

    const normalizedData = {
      ...certificate,
      certificateNumber,
      studentName,
      internshipName,
      grade,
      percentage,
      issueDate,
      startDate,
      endDate,
      companyName: certificate.companyName || 'APPLE TREE INFOTECH',
      companyAddress: certificate.companyAddress || 'C-60 3rd Floor R.K. Tower RDC, Raj Nagar, Ghaziabad, 201001',
      companyPhone: certificate.companyPhone || '7503962162, 9355343070',
      companyEmail: certificate.companyEmail || 'info@appletreeinfotech.in',
      companyWeb: certificate.companyWeb || 'appletreeinfotech.in',
      description: certificate.description || 'This certification is awarded in recognition of the successful completion of the curriculum and mastery of the course content.',
      partnerUniversity: certificate.partnerUniversity || 'KALINGA UNIVERSITY',
      status: certificate.status || 'valid',
      qrCodeData: qrCode
    };

    return res.json({
      success: true,
      verified: normalizedData.status === 'valid',
      data: normalizedData
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error verifying certificate.' });
  }
});

export default router;
