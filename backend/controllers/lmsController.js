import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import VideoProgress from '../models/VideoProgress.js';
import Note from '../models/Note.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import mockStore from '../config/mockStore.js';

// @desc    Get all courses
// @route   GET /api/lms/courses
// @access  Public
export const getCourses = asyncHandler(async (req, res, next) => {
  const {
    category,
    level,
    isFeatured,
    isPublished = true,
    page = 1,
    limit = 10,
    sort = '-createdAt'
  } = req.query;

  if (mockStore.isMock) {
    let list = await mockStore.find('courses');
    if (isPublished) list = list.filter(c => c.isPublished === true);
    if (category) list = list.filter(c => c.category === category);
    if (level) list = list.filter(c => c.level === level);
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    const paginated = list.slice(skip, skip + limitNum);
    return res.status(200).json({ success: true, count: paginated.length, total: list.length, data: paginated });
  }

  // Build filter
  const filter = {};
  if (category) filter.category = category;
  if (level) filter.level = level;
  if (isFeatured) filter.isFeatured = isFeatured === 'true';
  if (isPublished) filter.isPublished = isPublished === 'true';

  // Pagination
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  // Get total count
  const total = await Course.countDocuments(filter);

  // Get courses with pagination
  const courses = await Course.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .populate('instructor', 'name email profileImage');

  res.status(200).json({
    success: true,
    count: courses.length,
    total,
    pagination: {
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum)
    },
    data: courses
  });
});

// @desc    Search courses
// @route   GET /api/lms/courses/search
// @access  Public
export const searchCourses = asyncHandler(async (req, res, next) => {
  const { q, category, level } = req.query;

  if (mockStore.isMock) {
    let list = await mockStore.find('courses');
    list = list.filter(c => c.isPublished === true);
    if (q) {
      const lq = q.toLowerCase();
      list = list.filter(c =>
        c.title?.toLowerCase().includes(lq) ||
        c.description?.toLowerCase().includes(lq)
      );
    }
    if (category) list = list.filter(c => c.category === category);
    if (level) list = list.filter(c => c.level === level);
    return res.status(200).json({ success: true, count: list.length, data: list });
  }

  const filter = { isPublished: true };
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } }
    ];
  }
  if (category) filter.category = category;
  if (level) filter.level = level;

  const courses = await Course.find(filter)
    .sort('-createdAt')
    .limit(20)
    .populate('instructor', 'name profileImage');

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});

// @desc    Get single course
// @route   GET /api/lms/courses/:id
// @access  Public
export const getCourseById = asyncHandler(async (req, res, next) => {
  if (mockStore.isMock) {
    const course = await mockStore.findById('courses', req.params.id);
    if (!course) return next(new ErrorResponse(`Course not found`, 404));
    let enrollment = null;
    if (req.user) {
      const enrollments = await mockStore.find('enrollments', { user: req.user.id, course: req.params.id });
      enrollment = enrollments[0] || null;
    }
    return res.status(200).json({ success: true, data: { ...course, enrollment } });
  }

  const course = await Course.findById(req.params.id)
    .populate('instructor', 'name email profileImage bio qualifications');

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }

  // Check if user is enrolled (if authenticated)
  let enrollment = null;
  if (req.user) {
    enrollment = await CourseEnrollment.findOne({
      user: req.user.id,
      course: req.params.id
    });
  }

  res.status(200).json({
    success: true,
    data: {
      ...course.toObject(),
      enrollment
    }
  });
});

// @desc    Get course modules
// @route   GET /api/lms/courses/:id/modules
// @access  Public
export const getCourseModules = asyncHandler(async (req, res, next) => {
  if (mockStore.isMock) {
    const allModules = await mockStore.find('modules', { course: req.params.id });
    const published = allModules.filter(m => m.isPublished !== false);
    published.sort((a, b) => (a.order || 0) - (b.order || 0));

    // Attach lessons to each module
    const result = await Promise.all(published.map(async (mod) => {
      const allLessons = await mockStore.find('lessons', { module: mod._id });
      const lessons = allLessons.filter(l => l.isPublished !== false);
      lessons.sort((a, b) => (a.order || 0) - (b.order || 0));
      return { ...mod, lessons };
    }));

    return res.status(200).json({ success: true, count: result.length, data: result });
  }

  const modules = await Module.find({ course: req.params.id, isPublished: true })
    .sort('order')
    .populate({
      path: 'lessons',
      match: { isPublished: true },
      options: { sort: { order: 1 } }
    });

  res.status(200).json({
    success: true,
    count: modules.length,
    data: modules
  });
});

// @desc    Get course lessons
// @route   GET /api/lms/courses/:id/lessons
// @access  Public
export const getCourseLessons = asyncHandler(async (req, res, next) => {
  if (mockStore.isMock) {
    const lessons = await mockStore.find('lessons', { course: req.params.id });
    const published = lessons.filter(l => l.isPublished !== false);
    published.sort((a, b) => (a.order || 0) - (b.order || 0));
    return res.status(200).json({ success: true, count: published.length, data: published });
  }

  const lessons = await Lesson.find({ course: req.params.id, isPublished: true })
    .sort('order')
    .populate('module', 'title');

  res.status(200).json({
    success: true,
    count: lessons.length,
    data: lessons
  });
});

// @desc    Enroll in course
// @route   POST /api/lms/courses/:id/enroll
// @access  Private
export const enrollInCourse = asyncHandler(async (req, res, next) => {
  // paymentId is passed from the frontend after a successful Razorpay verification
  const { paymentId } = req.body;
  const paymentStatus = paymentId ? 'paid' : 'pending';

  if (mockStore.isMock) {
    const course = await mockStore.findById('courses', req.params.id);
    if (!course) return next(new ErrorResponse('Course not found', 404));
    const existing = await mockStore.find('enrollments', { user: req.user.id, course: req.params.id });
    if (existing.length > 0) return next(new ErrorResponse('Already enrolled in this course', 400));
    const enrollment = await mockStore.create('enrollments', {
      user: req.user.id,
      course: req.params.id,
      enrolledAt: new Date(),
      progress: 0,
      completedLessons: [],
      status: 'active',
      paymentStatus: (course.price || 0) <= 0 ? 'free' : paymentStatus,
      paymentId: paymentId || ''
    });
    course.totalEnrollments = (course.totalEnrollments || 0) + 1;
    return res.status(201).json({ success: true, data: enrollment });
  }

  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }

  // Check if already enrolled
  const existingEnrollment = await CourseEnrollment.findOne({
    user: req.user.id,
    course: req.params.id
  });

  if (existingEnrollment) {
    return next(new ErrorResponse('Already enrolled in this course', 400));
  }

  // Create enrollment
  const enrollment = await CourseEnrollment.create({
    user: req.user.id,
    course: req.params.id,
    paymentStatus: course.price <= 0 ? 'free' : paymentStatus,
    paymentId: paymentId || ''
  });

  // Update course enrollment count
  course.totalEnrollments += 1;
  await course.save();

  res.status(201).json({
    success: true,
    data: enrollment
  });
});

// @desc    Get enrolled courses
// @route   GET /api/lms/my-courses
// @access  Private
export const getEnrolledCourses = asyncHandler(async (req, res, next) => {
  if (mockStore.isMock) {
    let enrollments = await mockStore.find('enrollments', { user: req.user.id });
    
    // Fallback: if no direct enrollments, check if user is a parent linked to admitted students with course classes
    if (!enrollments || enrollments.length === 0) {
      const parentProfile = await mockStore.findOne('parents', { userId: req.user.id });
      if (parentProfile && parentProfile.children && parentProfile.children.length > 0) {
        const allCourses = await mockStore.find('courses') || [];
        for (const childId of parentProfile.children) {
          const child = await mockStore.findById('students', childId);
          if (child && child.class) {
            const courseMatch = allCourses.find(c => String(c.title).toLowerCase() === String(child.class).toLowerCase());
            if (courseMatch) {
              await mockStore.create('enrollments', {
                user: req.user.id,
                course: courseMatch._id,
                paymentStatus: 'paid',
                status: 'active',
                enrolledAt: new Date()
              });
            }
          }
        }
        enrollments = await mockStore.find('enrollments', { user: req.user.id });
      }
    }

    const result = await Promise.all(enrollments.map(async (e) => {
      const course = await mockStore.findById('courses', e.course);
      return { ...e, course };
    }));
    return res.status(200).json({ success: true, count: result.length, data: result });
  }

  let enrollments = await CourseEnrollment.find({ user: req.user.id })
    .populate({
      path: 'course',
      populate: {
        path: 'instructor',
        select: 'name profileImage'
      }
    })
    .sort('-lastAccessedAt');

  // Fallback: if no direct enrollments in DB, resolve via admitted student child classes
  if (!enrollments || enrollments.length === 0) {
    const Parent = (await import('../models/Parent.js')).default;
    const Student = (await import('../models/Student.js')).default;
    const parentProfile = await Parent.findOne({ userId: req.user.id });
    if (parentProfile && parentProfile.children && parentProfile.children.length > 0) {
      for (const childId of parentProfile.children) {
        const child = await Student.findById(childId);
        if (child && child.class) {
          const courseMatch = await Course.findOne({ title: { $regex: new RegExp(`^${child.class}$`, 'i') } });
          if (courseMatch) {
            await CourseEnrollment.findOneAndUpdate(
              { user: req.user.id, course: courseMatch._id },
              { paymentStatus: 'paid', status: 'active', enrolledAt: new Date() },
              { upsert: true, new: true }
            );
          }
        }
      }
      enrollments = await CourseEnrollment.find({ user: req.user.id })
        .populate({
          path: 'course',
          populate: {
            path: 'instructor',
            select: 'name profileImage'
          }
        })
        .sort('-lastAccessedAt');
    }
  }

  res.status(200).json({
    success: true,
    count: enrollments.length,
    data: enrollments
  });
});

// @desc    Get course progress
// @route   GET /api/lms/courses/:id/progress
// @access  Private
export const getCourseProgress = asyncHandler(async (req, res, next) => {
  // Check if enrolled
  const enrollment = await CourseEnrollment.findOne({
    user: req.user.id,
    course: req.params.id
  });

  if (!enrollment) {
    return next(new ErrorResponse('Not enrolled in this course', 403));
  }

  // Get all lessons in course
  const totalLessons = await Lesson.countDocuments({
    course: req.params.id,
    isPublished: true
  });

  // Get completed lessons
  const completedLessons = enrollment.completedLessons.length;

  // Calculate progress percentage
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Get recent progress
  const recentProgress = await VideoProgress.find({
    user: req.user.id,
    course: req.params.id
  })
    .sort('-lastWatchedAt')
    .limit(5)
    .populate('lesson', 'title module');

  res.status(200).json({
    success: true,
    data: {
      enrollment,
      progress,
      totalLessons,
      completedLessons,
      recentProgress
    }
  });
});

// @desc    Update lesson progress
// @route   POST /api/lms/lessons/:id/progress
// @access  Private
export const updateLessonProgress = asyncHandler(async (req, res, next) => {
  const { currentTime, duration, markCompleted } = req.body;
  const lessonId = req.params.id;

  if (mockStore.isMock) {
    const lesson = await mockStore.findById('lessons', lessonId);
    if (!lesson) return next(new ErrorResponse('Lesson not found', 404));
    const enrollments = await mockStore.find('enrollments', { user: req.user.id, course: lesson.course });
    if (!enrollments.length) return next(new ErrorResponse('Not enrolled in this course', 403));
    const enrollment = enrollments[0];

    const existing = await mockStore.find('videoProgress', { user: req.user.id, lesson: lessonId });
    let pct = duration > 0 ? Math.min(100, Math.round((currentTime / duration) * 100)) : 0;
    let prog;
    if (existing.length > 0) {
      prog = await mockStore.findByIdAndUpdate('videoProgress', existing[0]._id, {
        currentTime, duration, course: lesson.course, isCompleted: markCompleted || pct >= 90,
        percentage: pct, lastWatchedAt: new Date()
      });
    } else {
      prog = await mockStore.create('videoProgress', {
        user: req.user.id, lesson: lessonId, course: lesson.course,
        currentTime, duration, percentage: pct, isCompleted: markCompleted || pct >= 90,
        lastWatchedAt: new Date()
      });
    }
    if (markCompleted && !enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }
    return res.status(200).json({ success: true, data: prog });
  }

  // Get lesson
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    return next(new ErrorResponse(`Lesson not found with id of ${lessonId}`, 404));
  }

  // Check if enrolled in course
  const enrollment = await CourseEnrollment.findOne({
    user: req.user.id,
    course: lesson.course
  });

  if (!enrollment) {
    return next(new ErrorResponse('Not enrolled in this course', 403));
  }

  // Update or create progress
  const progress = await VideoProgress.findOneAndUpdate(
    { user: req.user.id, lesson: lessonId },
    {
      currentTime,
      duration,
      course: lesson.course,
      lastWatchedAt: Date.now(),
      isCompleted: markCompleted || false
    },
    { new: true, upsert: true }
  );

  // If marked as completed, add to completed lessons
  if (markCompleted && !enrollment.completedLessons.includes(lessonId)) {
    enrollment.completedLessons.push(lessonId);
    
    // Update progress percentage
    const totalLessons = await Lesson.countDocuments({
      course: lesson.course,
      isPublished: true
    });
    
    if (totalLessons > 0) {
      enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
    }
    
    await enrollment.save();
  }

  res.status(200).json({
    success: true,
    data: progress
  });
});

// @desc    Get continue watching
// @route   GET /api/lms/continue-watching
// @access  Private
export const getContinueWatching = asyncHandler(async (req, res, next) => {
  if (mockStore.isMock) {
    const allProgress = await mockStore.find('videoProgress', { user: req.user.id });
    const inProgress = allProgress.filter(p => !p.isCompleted);
    inProgress.sort((a, b) => new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt));
    const limited = inProgress.slice(0, 10);
    const result = await Promise.all(limited.map(async (p) => {
      const lesson = await mockStore.findById('lessons', p.lesson);
      const course = await mockStore.findById('courses', p.course);
      return { ...p, lesson, course };
    }));
    return res.status(200).json({ success: true, count: result.length, data: result });
  }

  const progress = await VideoProgress.find({
    user: req.user.id,
    isCompleted: false
  })
    .sort('-lastWatchedAt')
    .limit(10)
    .populate({
      path: 'lesson',
      select: 'title videoUrl videoThumbnail module',
      populate: { path: 'module', select: 'title' }
    })
    .populate({ path: 'course', select: 'title imageUrl' });

  res.status(200).json({
    success: true,
    count: progress.length,
    data: progress
  });
});

// @desc    Get notes for a lesson
// @route   GET /api/lms/lessons/:id/notes
// @access  Private
export const getNotes = asyncHandler(async (req, res, next) => {
  if (mockStore.isMock) {
    const notes = await mockStore.find('notes', { user: req.user.id, lesson: req.params.id });
    notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.status(200).json({ success: true, count: notes.length, data: notes });
  }

  const notes = await Note.find({
    user: req.user.id,
    lesson: req.params.id
  }).sort('-createdAt');

  res.status(200).json({
    success: true,
    count: notes.length,
    data: notes
  });
});

// @desc    Create note
// @route   POST /api/lms/lessons/:id/notes
// @access  Private
export const createNote = asyncHandler(async (req, res, next) => {
  const { content, timestamp, isPublic } = req.body;
  const lessonId = req.params.id;

  if (mockStore.isMock) {
    const lesson = await mockStore.findById('lessons', lessonId);
    if (!lesson) return next(new ErrorResponse('Lesson not found', 404));
    const enrollments = await mockStore.find('enrollments', { user: req.user.id, course: lesson.course });
    if (!enrollments.length) return next(new ErrorResponse('Not enrolled in this course', 403));
    const note = await mockStore.create('notes', {
      user: req.user.id, lesson: lessonId, course: lesson.course,
      content, timestamp: timestamp || 0, isPublic: isPublic || false
    });
    return res.status(201).json({ success: true, data: note });
  }

  // Get lesson
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    return next(new ErrorResponse(`Lesson not found with id of ${lessonId}`, 404));
  }

  // Check if enrolled in course
  const enrollment = await CourseEnrollment.findOne({
    user: req.user.id,
    course: lesson.course
  });

  if (!enrollment) {
    return next(new ErrorResponse('Not enrolled in this course', 403));
  }

  const note = await Note.create({
    user: req.user.id,
    lesson: lessonId,
    course: lesson.course,
    content,
    timestamp: timestamp || 0,
    isPublic: isPublic || false
  });

  res.status(201).json({
    success: true,
    data: note
  });
});

// @desc    Update note
// @route   PUT /api/lms/notes/:id
// @access  Private
export const updateNote = asyncHandler(async (req, res, next) => {
  if (mockStore.isMock) {
    const note = await mockStore.findById('notes', req.params.id);
    if (!note) return next(new ErrorResponse('Note not found', 404));
    if (note.user !== req.user.id) return next(new ErrorResponse('Not authorized', 401));
    const updated = await mockStore.findByIdAndUpdate('notes', req.params.id, req.body);
    return res.status(200).json({ success: true, data: updated });
  }

  let note = await Note.findById(req.params.id);

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  // Make sure user owns note
  if (note.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this note', 401));
  }

  note = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: note
  });
});

// @desc    Delete note
// @route   DELETE /api/lms/notes/:id
// @access  Private
export const deleteNote = asyncHandler(async (req, res, next) => {
  if (mockStore.isMock) {
    const note = await mockStore.findById('notes', req.params.id);
    if (!note) return next(new ErrorResponse('Note not found', 404));
    if (note.user !== req.user.id) return next(new ErrorResponse('Not authorized', 401));
    await mockStore.findByIdAndDelete('notes', req.params.id);
    return res.status(200).json({ success: true, data: {} });
  }

  const note = await Note.findById(req.params.id);

  if (!note) {
    return next(new ErrorResponse(`Note not found with id of ${req.params.id}`, 404));
  }

  // Make sure user owns note
  if (note.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this note', 401));
  }

  await note.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Create course
// @route   POST /api/lms/courses
// @access  Private/Admin
export const createCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    data: course
  });
});

// @desc    Update course
// @route   PUT /api/lms/courses/:id
// @access  Private/Admin
export const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc    Delete course
// @route   DELETE /api/lms/courses/:id
// @access  Private/Admin
export const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
  }

  // Delete related data
  await Module.deleteMany({ course: req.params.id });
  await Lesson.deleteMany({ course: req.params.id });
  await VideoProgress.deleteMany({ course: req.params.id });
  await Note.deleteMany({ course: req.params.id });
  await CourseEnrollment.deleteMany({ course: req.params.id });

  await course.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});