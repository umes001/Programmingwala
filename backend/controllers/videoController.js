import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import Course from '../models/Course.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import Lesson from '../models/Lesson.js';
import Module from '../models/Module.js';
import mockStore from '../config/mockStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get secure video stream URL
// @route   GET /api/lms/lessons/:id/video-stream
// @access  Private
export const getVideoStream = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (mockStore.isMock) {
    const lesson = await mockStore.findById('lessons', id);
    if (!lesson) return next(new ErrorResponse('Lesson not found', 404));
    const enrollments = await mockStore.find('enrollments', { user: req.user.id, course: lesson.course });
    if (!enrollments.length) return next(new ErrorResponse('Not enrolled in this course', 403));
    if (lesson.isPublished === false) return next(new ErrorResponse('Lesson is not available', 403));
    return res.json({ success: true, data: { videoUrl: lesson.videoUrl, title: lesson.title, duration: lesson.videoDuration, secure: true } });
  }

  // Get the lesson
  const lesson = await Lesson.findById(id);
  
  if (!lesson) {
    return next(new ErrorResponse('Lesson not found', 404));
  }
  
  // Check if user is enrolled in the course
  const module = await Module.findById(lesson.module);
  if (!module) {
    return next(new ErrorResponse('Module not found', 404));
  }
  
  const enrollment = await CourseEnrollment.findOne({
    user: req.user.id,
    course: module.course
  });
  
  if (!enrollment) {
    return next(new ErrorResponse('Not enrolled in this course', 403));
  }
  
  // Check if lesson is published
  if (!lesson.isPublished) {
    return next(new ErrorResponse('Lesson is not available', 403));
  }
  
  res.json({
    success: true,
    data: {
      videoUrl: lesson.videoUrl,
      title: lesson.title,
      duration: lesson.videoDuration,
      secure: true
    }
  });
});

// @desc    Stream video content (pseudo-streaming for now)
// @route   GET /api/lms/videos/:filename
// @access  Private
export const streamVideo = asyncHandler(async (req, res, next) => {
  const { filename } = req.params;
  
  // Extract lesson ID from filename (format: lesson-{id}-{timestamp}.mp4)
  const match = filename.match(/lesson-([a-f0-9]{24})/);
  if (!match) {
    return next(new ErrorResponse('Invalid video filename', 400));
  }
  
  const lessonId = match[1];
  
  // Get the lesson
  const lesson = await Lesson.findById(lessonId);
  
  if (!lesson) {
    return next(new ErrorResponse('Lesson not found', 404));
  }
  
  // Check if user is enrolled in the course
  const module = await Module.findById(lesson.module);
  if (!module) {
    return next(new ErrorResponse('Module not found', 404));
  }
  
  const enrollment = await CourseEnrollment.findOne({
    user: req.user.id,
    course: module.course
  });
  
  if (!enrollment) {
    return next(new ErrorResponse('Not enrolled in this course', 403));
  }
  
  // For now, we'll simulate streaming by redirecting to the actual video URL
  // In production, you would implement proper video streaming with range requests
  
  // Check if video file exists locally (for development)
  const videoPath = path.join(__dirname, '../uploads/videos', filename);
  
  if (fs.existsSync(videoPath)) {
    // Get file stats
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;
    
    if (range) {
      // Parse range
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } else {
    // If video is hosted externally, redirect to the secure URL
    // In production, you would use a CDN with signed URLs
    res.redirect(lesson.videoUrl);
  }
});

// @desc    Get next lesson for auto-play
// @route   GET /api/lms/lessons/:id/next
// @access  Private
export const getNextLesson = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (mockStore.isMock) {
    const currentLesson = await mockStore.findById('lessons', id);
    if (!currentLesson) return next(new ErrorResponse('Lesson not found', 404));
    const enrollments = await mockStore.find('enrollments', { user: req.user.id, course: currentLesson.course });
    if (!enrollments.length) return next(new ErrorResponse('Not enrolled in this course', 403));

    // Find next lesson in same module ordered by order field
    const moduleLessons = await mockStore.find('lessons', { module: currentLesson.module });
    const published = moduleLessons.filter(l => l.isPublished !== false);
    published.sort((a, b) => (a.order || 0) - (b.order || 0));
    const nextInModule = published.find(l => (l.order || 0) > (currentLesson.order || 0));
    if (nextInModule) {
      return res.json({ success: true, data: { id: nextInModule._id, title: nextInModule.title, videoUrl: nextInModule.videoUrl, duration: nextInModule.videoDuration, order: nextInModule.order } });
    }

    // Find next module
    const allModules = await mockStore.find('modules', { course: currentLesson.course });
    const pubModules = allModules.filter(m => m.isPublished !== false);
    pubModules.sort((a, b) => (a.order || 0) - (b.order || 0));
    const currentMod = await mockStore.findById('modules', currentLesson.module);
    const nextMod = pubModules.find(m => (m.order || 0) > ((currentMod && currentMod.order) || 0));
    if (nextMod) {
      const nextModLessons = await mockStore.find('lessons', { module: nextMod._id });
      const pubNext = nextModLessons.filter(l => l.isPublished !== false);
      pubNext.sort((a, b) => (a.order || 0) - (b.order || 0));
      if (pubNext.length > 0) {
        return res.json({ success: true, data: { id: pubNext[0]._id, title: pubNext[0].title, videoUrl: pubNext[0].videoUrl, duration: pubNext[0].videoDuration, order: pubNext[0].order, moduleTitle: nextMod.title } });
      }
    }
    return res.json({ success: true, data: null, message: 'This is the last lesson in the course' });
  }

  // Get current lesson
  const currentLesson = await Lesson.findById(id);
  
  if (!currentLesson) {
    return next(new ErrorResponse('Lesson not found', 404));
  }
  
  // Get the module
  const module = await Module.findById(currentLesson.module);
  if (!module) {
    return next(new ErrorResponse('Module not found', 404));
  }
  
  // Check enrollment
  const enrollment = await CourseEnrollment.findOne({
    user: req.user.id,
    course: module.course
  });
  
  if (!enrollment) {
    return next(new ErrorResponse('Not enrolled in this course', 403));
  }
  
  // Find next lesson in the same module
  const nextLesson = await Lesson.findOne({
    module: currentLesson.module,
    order: { $gt: currentLesson.order },
    isPublished: true
  }).sort('order');
  
  if (nextLesson) {
    return res.json({
      success: true,
      data: {
        id: nextLesson._id,
        title: nextLesson.title,
        videoUrl: nextLesson.videoUrl,
        duration: nextLesson.videoDuration,
        order: nextLesson.order
      }
    });
  }
  
  // If no next lesson in current module, find next module
  const nextModule = await Module.findOne({
    course: module.course,
    order: { $gt: module.order },
    isPublished: true
  }).sort('order');
  
  if (nextModule) {
    // Get first lesson in next module
    const firstLessonInNextModule = await Lesson.findOne({
      module: nextModule._id,
      isPublished: true
    }).sort('order');
    
    if (firstLessonInNextModule) {
      return res.json({
        success: true,
        data: {
          id: firstLessonInNextModule._id,
          title: firstLessonInNextModule.title,
          videoUrl: firstLessonInNextModule.videoUrl,
          duration: firstLessonInNextModule.videoDuration,
          order: firstLessonInNextModule.order,
          moduleTitle: nextModule.title
        }
      });
    }
  }
  
  // No next lesson found
  res.json({
    success: true,
    data: null,
    message: 'This is the last lesson in the course'
  });
});

// @desc    Mark lesson as completed
// @route   POST /api/lms/lessons/:id/complete
// @access  Private
export const markLessonComplete = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (mockStore.isMock) {
    const lesson = await mockStore.findById('lessons', id);
    if (!lesson) return next(new ErrorResponse('Lesson not found', 404));
    const enrollments = await mockStore.find('enrollments', { user: req.user.id, course: lesson.course });
    if (!enrollments.length) return next(new ErrorResponse('Not enrolled in this course', 403));
    const enrollment = enrollments[0];

    // Update or create video progress
    const existing = await mockStore.find('videoProgress', { user: req.user.id, lesson: id });
    let progress;
    if (existing.length > 0) {
      progress = await mockStore.findByIdAndUpdate('videoProgress', existing[0]._id, {
        isCompleted: true, percentage: 100,
        currentTime: lesson.videoDuration || 0,
        duration: lesson.videoDuration || 0,
        lastWatchedAt: new Date()
      });
    } else {
      progress = await mockStore.create('videoProgress', {
        user: req.user.id, lesson: id, course: lesson.course,
        isCompleted: true, percentage: 100,
        currentTime: lesson.videoDuration || 0,
        duration: lesson.videoDuration || 0,
        lastWatchedAt: new Date()
      });
    }
    if (!enrollment.completedLessons.includes(id)) {
      enrollment.completedLessons.push(id);
    }
    return res.json({ success: true, data: progress, message: 'Lesson marked as completed' });
  }

  // Get the lesson
  const lesson = await Lesson.findById(id);
  
  if (!lesson) {
    return next(new ErrorResponse('Lesson not found', 404));
  }
  
  // Get the module
  const module = await Module.findById(lesson.module);
  if (!module) {
    return next(new ErrorResponse('Module not found', 404));
  }
  
  // Check enrollment
  const enrollment = await CourseEnrollment.findOne({
    user: req.user.id,
    course: module.course
  });
  
  if (!enrollment) {
    return next(new ErrorResponse('Not enrolled in this course', 403));
  }
  
  // Update progress
  const VideoProgress = (await import('../models/VideoProgress.js')).default;
  
  const progress = await VideoProgress.findOneAndUpdate(
    { user: req.user.id, lesson: id },
    {
      user: req.user.id, lesson: id, course: module.course,
      isCompleted: true, percentage: 100,
      currentTime: lesson.videoDuration || 0,
      duration: lesson.videoDuration || 0,
      updatedAt: Date.now()
    },
    { new: true, upsert: true }
  );
  
  res.json({ success: true, data: progress, message: 'Lesson marked as completed' });
});