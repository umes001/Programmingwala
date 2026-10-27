import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get all modules for a course
// @route   GET /api/lms/courses/:courseId/modules
// @access  Private/Admin
export const getModules = asyncHandler(async (req, res, next) => {
  const modules = await Module.find({ course: req.params.courseId })
    .sort('order');

  res.status(200).json({
    success: true,
    count: modules.length,
    data: modules
  });
});

// @desc    Get single module
// @route   GET /api/lms/modules/:id
// @access  Private/Admin
export const getModuleById = asyncHandler(async (req, res, next) => {
  const module = await Module.findById(req.params.id);

  if (!module) {
    return next(new ErrorResponse(`Module not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: module
  });
});

// @desc    Create module
// @route   POST /api/lms/courses/:courseId/modules
// @access  Private/Admin
export const createModule = asyncHandler(async (req, res, next) => {
  req.body.course = req.params.courseId;
  
  const module = await Module.create(req.body);

  // Update course module count
  const Course = (await import('../models/Course.js')).default;
  await Course.findByIdAndUpdate(req.params.courseId, {
    $inc: { totalModules: 1 }
  });

  res.status(201).json({
    success: true,
    data: module
  });
});

// @desc    Update module
// @route   PUT /api/lms/modules/:id
// @access  Private/Admin
export const updateModule = asyncHandler(async (req, res, next) => {
  let module = await Module.findById(req.params.id);

  if (!module) {
    return next(new ErrorResponse(`Module not found with id of ${req.params.id}`, 404));
  }

  module = await Module.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: module
  });
});

// @desc    Delete module
// @route   DELETE /api/lms/modules/:id
// @access  Private/Admin
export const deleteModule = asyncHandler(async (req, res, next) => {
  const module = await Module.findById(req.params.id);

  if (!module) {
    return next(new ErrorResponse(`Module not found with id of ${req.params.id}`, 404));
  }

  // Delete all lessons in this module
  await Lesson.deleteMany({ module: req.params.id });

  await module.deleteOne();

  // Update course module count
  const Course = (await import('../models/Course.js')).default;
  await Course.findByIdAndUpdate(module.course, {
    $inc: { totalModules: -1 }
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Reorder modules
// @route   PUT /api/lms/courses/:courseId/modules/reorder
// @access  Private/Admin
export const reorderModules = asyncHandler(async (req, res, next) => {
  const { moduleOrder } = req.body;

  if (!moduleOrder || !Array.isArray(moduleOrder)) {
    return next(new ErrorResponse('Please provide module order array', 400));
  }

  // Update order for each module
  const bulkOps = moduleOrder.map((moduleId, index) => ({
    updateOne: {
      filter: { _id: moduleId, course: req.params.courseId },
      update: { order: index }
    }
  }));

  await Module.bulkWrite(bulkOps);

  res.status(200).json({
    success: true,
    message: 'Modules reordered successfully'
  });
});