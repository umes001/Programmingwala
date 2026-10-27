import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseModules,
  getCourseLessons,
  enrollInCourse,
  getEnrolledCourses,
  getCourseProgress,
  updateLessonProgress,
  getContinueWatching,
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  searchCourses
} from '../controllers/lmsController.js';
import {
  getModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
  reorderModules
} from '../controllers/moduleController.js';
import {
  getLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
  getStudentLesson
} from '../controllers/lessonController.js';
import {
  generateCertificate,
  generateSyllabus,
  downloadNotesPDF
} from '../controllers/pdfController.js';
import {
  getVideoStream,
  streamVideo,
  getNextLesson,
  markLessonComplete
} from '../controllers/videoController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/courses', getCourses);
router.get('/courses/search', searchCourses);
router.get('/courses/:id', getCourseById);
router.get('/courses/:id/modules', getCourseModules);
router.get('/courses/:id/lessons', getCourseLessons);

// Protected routes (require authentication)
router.use(protect);

// Student routes
router.get('/student/lessons/:id', getStudentLesson);
router.post('/courses/:id/enroll', enrollInCourse);
router.get('/my-courses', getEnrolledCourses);
router.get('/courses/:id/progress', getCourseProgress);
router.get('/continue-watching', getContinueWatching);
router.post('/lessons/:id/progress', updateLessonProgress);

// Notes
router.get('/lessons/:id/notes', getNotes);
router.post('/lessons/:id/notes', createNote);
router.put('/notes/:id', updateNote);
router.delete('/notes/:id', deleteNote);

// PDF Downloads
router.get('/courses/:id/certificate', generateCertificate);
router.get('/courses/:id/syllabus', generateSyllabus);
router.get('/courses/:id/notes-pdf', downloadNotesPDF);

// Video Streaming
router.get('/lessons/:id/video-stream', getVideoStream);
router.get('/lessons/:id/next', getNextLesson);
router.post('/lessons/:id/complete', markLessonComplete);
router.get('/videos/:filename', streamVideo);

// Admin routes (require admin role)
router.use(authorize('admin'));

// Course management
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

// Module management
router.get('/courses/:courseId/modules/admin', getModules);
router.post('/courses/:courseId/modules', createModule);
router.get('/modules/:id', getModuleById);
router.put('/modules/:id', updateModule);
router.delete('/modules/:id', deleteModule);
router.put('/courses/:courseId/modules/reorder', reorderModules);

// Lesson management
router.get('/modules/:moduleId/lessons', getLessons);
router.post('/modules/:moduleId/lessons', createLesson);
router.get('/lessons/:id/admin', getLessonById);
router.put('/lessons/:id', updateLesson);
router.delete('/lessons/:id', deleteLesson);
router.put('/modules/:moduleId/lessons/reorder', reorderLessons);

export default router;