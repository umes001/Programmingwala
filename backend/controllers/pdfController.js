import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import Course from '../models/Course.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import Lesson from '../models/Lesson.js';
import Module from '../models/Module.js';
import { jsPDF } from 'jspdf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Generate course completion certificate
// @route   GET /api/lms/courses/:id/certificate
// @access  Private
export const generateCertificate = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  // Check if enrolled and completed
  const enrollment = await CourseEnrollment.findOne({
    user: req.user.id,
    course: id,
    status: 'completed'
  }).populate('course', 'title instructor');
  
  if (!enrollment) {
    return next(new ErrorResponse('Course not completed or not enrolled', 403));
  }
  
  const course = enrollment.course || {};
  const user = req.user || {};
  
  try {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    // Width: 297mm, Height: 210mm

    // Background & Borders
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 297, 210, 'F');

    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(3);
    doc.rect(10, 10, 277, 190);

    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(1);
    doc.rect(13, 13, 271, 184);

    // Watermark / Header
    doc.setTextColor(79, 70, 229);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATE OF COMPLETION', 148.5, 45, { align: 'center' });

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('This is proudly presented to', 148.5, 60, { align: 'center' });

    // Student Name
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(user.name || 'Student', 148.5, 80, { align: 'center' });

    // Line under name
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.line(60, 85, 237, 85);

    // Course completion text
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('for successfully completing the comprehensive course:', 148.5, 98, { align: 'center' });

    // Course Title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(course.title || 'Technical Program', 148.5, 115, { align: 'center' });

    // Metadata details
    const issueDate = new Date(enrollment.completedAt || Date.now()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const certId = enrollment._id ? enrollment._id.toString().slice(-8).toUpperCase() : 'PW-CERT';

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);

    doc.text(`Completion Date: ${issueDate}`, 30, 150);
    doc.text(`Certificate ID: ${certId}`, 148.5, 150, { align: 'center' });
    doc.text('Status: Verified & Valid', 267, 150, { align: 'right' });

    // Signatures
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.5);
    doc.line(30, 175, 90, 175);
    doc.line(207, 175, 267, 175);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'bold');
    doc.text('Pranidha & ProgrammingWala', 60, 182, { align: 'center' });
    doc.text('Director of Academic Learning', 237, 182, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('Verify online at programmingwala.com/verify-certificate', 148.5, 195, { align: 'center' });

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate-${(course.title || 'course').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${(user.name || 'student').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    return next(new ErrorResponse('Failed to generate PDF certificate', 500));
  }
});

// @desc    Generate course syllabus PDF
// @route   GET /api/lms/courses/:id/syllabus
// @access  Public
export const generateSyllabus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  const course = await Course.findById(id)
    .populate('instructor', 'name qualifications');
  
  if (!course) {
    return next(new ErrorResponse('Course not found', 404));
  }
  
  const modules = await Module.find({ course: id, isPublished: true })
    .sort('order')
    .populate({
      path: 'lessons',
      match: { isPublished: true },
      options: { sort: { order: 1 } }
    });

  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    // Width: 210mm, Height: 297mm

    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(course.title || 'Course Syllabus', 15, 18);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Course Syllabus & Curriculum Roadmap', 15, 27);

    let y = 48;
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Instructor: ${course.instructor?.name || 'ProgrammingWala Faculty'}`, 15, y);
    y += 7;
    doc.text(`Level: ${course.level || 'All Levels'} | Duration: ${course.totalDuration || 0} mins`, 15, y);
    y += 12;

    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text('Modules & Curriculum', 15, y);
    y += 8;

    (modules || []).forEach((mod, mIdx) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`Module ${mIdx + 1}: ${mod.title || 'Module'}`, 15, y);
      y += 6;

      (mod.lessons || []).forEach((les, lIdx) => {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(9.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(`  • Lesson ${lIdx + 1}: ${les.title || 'Lesson'}`, 20, y);
        y += 5;
      });
      y += 4;
    });

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="syllabus-${(course.title || 'course').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    return next(new ErrorResponse('Failed to generate PDF syllabus', 500));
  }
});

// @desc    Download course notes as PDF
// @route   GET /api/lms/courses/:id/notes-pdf
// @access  Private
export const downloadNotesPDF = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  const enrollment = await CourseEnrollment.findOne({
    user: req.user.id,
    course: id
  });
  
  if (!enrollment) {
    return next(new ErrorResponse('Not enrolled in this course', 403));
  }
  
  const course = await Course.findById(id);
  const notes = enrollment.notes || [];

  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Course Notes: ${course?.title || 'Learning Notes'}`, 15, 16);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Student: ${req.user.name || 'Student'} | Total Notes: ${notes.length}`, 15, 24);

    let y = 42;
    if (notes.length === 0) {
      doc.setTextColor(100, 116, 139);
      doc.text('No notes recorded yet for this course.', 15, y);
    } else {
      notes.forEach((note, idx) => {
        if (y > 265) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(79, 70, 229);
        doc.text(`Note #${idx + 1} - ${new Date(note.createdAt || Date.now()).toLocaleDateString()}`, 15, y);
        y += 6;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        const splitText = doc.splitTextToSize(note.content || '', 180);
        doc.text(splitText, 15, y);
        y += (splitText.length * 5) + 6;
      });
    }

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="course-notes-${id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    return next(new ErrorResponse('Failed to generate PDF notes', 500));
  }
});