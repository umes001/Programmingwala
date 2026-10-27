import Lesson from '../models/Lesson.js';
import Module from '../models/Module.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get all lessons for a module
// @route   GET /api/lms/modules/:moduleId/lessons
// @access  Private/Admin
export const getLessons = asyncHandler(async (req, res, next) => {
  const lessons = await Lesson.find({ module: req.params.moduleId })
    .sort('order');

  res.status(200).json({
    success: true,
    count: lessons.length,
    data: lessons
  });
});

// @desc    Get single lesson
// @route   GET /api/lms/lessons/:id
// @access  Private/Admin
export const getLessonById = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id)
    .populate('module', 'title');

  if (!lesson) {
    return next(new ErrorResponse(`Lesson not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: lesson
  });
});

// @desc    Create lesson
// @route   POST /api/lms/modules/:moduleId/lessons
// @access  Private/Admin
export const createLesson = asyncHandler(async (req, res, next) => {
  // Get module to get course ID
  const module = await Module.findById(req.params.moduleId);
  
  if (!module) {
    return next(new ErrorResponse(`Module not found with id of ${req.params.moduleId}`, 404));
  }

  req.body.module = req.params.moduleId;
  req.body.course = module.course;
  
  const lesson = await Lesson.create(req.body);

  // Update course lesson count
  const Course = (await import('../models/Course.js')).default;
  await Course.findByIdAndUpdate(module.course, {
    $inc: { totalLessons: 1 }
  });

  res.status(201).json({
    success: true,
    data: lesson
  });
});

// @desc    Update lesson
// @route   PUT /api/lms/lessons/:id
// @access  Private/Admin
export const updateLesson = asyncHandler(async (req, res, next) => {
  let lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    return next(new ErrorResponse(`Lesson not found with id of ${req.params.id}`, 404));
  }

  lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: lesson
  });
});

// @desc    Delete lesson
// @route   DELETE /api/lms/lessons/:id
// @access  Private/Admin
export const deleteLesson = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    return next(new ErrorResponse(`Lesson not found with id of ${req.params.id}`, 404));
  }

  await lesson.deleteOne();

  // Update course lesson count
  const Course = (await import('../models/Course.js')).default;
  await Course.findByIdAndUpdate(lesson.course, {
    $inc: { totalLessons: -1 }
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Reorder lessons
// @route   PUT /api/lms/modules/:moduleId/lessons/reorder
// @access  Private/Admin
export const reorderLessons = asyncHandler(async (req, res, next) => {
  const { lessonOrder } = req.body;

  if (!lessonOrder || !Array.isArray(lessonOrder)) {
    return next(new ErrorResponse('Please provide lesson order array', 400));
  }

  // Update order for each lesson
  const bulkOps = lessonOrder.map((lessonId, index) => ({
    updateOne: {
      filter: { _id: lessonId, module: req.params.moduleId },
      update: { order: index }
    }
  }));

  await Lesson.bulkWrite(bulkOps);

  res.status(200).json({
    success: true,
    message: 'Lessons reordered successfully'
  });
});

// @desc    Get lesson content for student
// @route   GET /api/lms/student/lessons/:id
// @access  Private
export const getStudentLesson = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id)
    .populate('module', 'title')
    .populate('course', 'title');

  if (!lesson) {
    return next(new ErrorResponse(`Lesson not found with id of ${req.params.id}`, 404));
  }

  // Check if user is enrolled in the course
  const CourseEnrollment = (await import('../models/CourseEnrollment.js')).default;
  const enrollment = await CourseEnrollment.findOne({
    user: req.user.id,
    course: lesson.course
  });

  if (!enrollment) {
    return next(new ErrorResponse('Not enrolled in this course', 403));
  }

  // Check if lesson is published or user has access
  if (!lesson.isPublished && req.user.role !== 'admin') {
    return next(new ErrorResponse('Lesson not available', 403));
  }

  // Get user's progress for this lesson
  const VideoProgress = (await import('../models/VideoProgress.js')).default;
  const progress = await VideoProgress.findOne({
    user: req.user.id,
    lesson: req.params.id
  });

  // Get user's notes for this lesson
  const Note = (await import('../models/Note.js')).default;
  const notes = await Note.find({
    user: req.user.id,
    lesson: req.params.id
  }).sort('-createdAt');

  res.status(200).json({
    success: true,
    data: {
      lesson,
      progress,
      notes
    }
  });
});