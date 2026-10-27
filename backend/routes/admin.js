import express from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Parent from '../models/Parent.js';
import Teacher from '../models/Teacher.js';
import Admission from '../models/Admission.js';
import Announcement from '../models/Announcement.js';
import Gallery from '../models/Gallery.js';
import Fee from '../models/Fee.js';
import Query from '../models/Query.js';
import Receipt from '../models/Receipt.js';
import FeeStructure from '../models/FeeStructure.js';
import FineRule from '../models/FineRule.js';
import Job from '../models/Job.js';
import LibraryNote from '../models/LibraryNote.js';
import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import Certificate from '../models/Certificate.js';
import QRCode from 'qrcode';
import { getCalculatedFees } from '../utils/feeCalculator.js';
import { generateLibraryNotePdf } from '../utils/notePdf.js';
import { protect, authorize } from '../middleware/auth.js';
import mockStore from '../config/mockStore.js';
import { uploadGallery, uploadCourse, handleCourseUpload, uploadAdmissions, uploadNotes, uploadMaterial, uploadVideo } from '../middleware/upload.js';

const router = express.Router();

import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

const CLOUDINARY_ENABLED = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (CLOUDINARY_ENABLED) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

function escapeRegExp(string) {
  return String(string || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function assignFeesForStudent(studentId, className, isMock) {
  let course = null;
  if (isMock) {
    const courses = await mockStore.find('courses', { title: className });
    if (courses && courses.length > 0) {
      course = courses[0];
    } else {
      const allCourses = await mockStore.find('courses');
      course = allCourses.find(c => String(c.title).toLowerCase() === String(className).toLowerCase());
    }
  } else {
    course = await Course.findOne({ title: { $regex: new RegExp(`^${escapeRegExp(className)}$`, 'i') } });
  }

  let totalAmount = 15000; // default fallback course price

  if (course) {
    totalAmount = Number(course.price) || 0;
  }

  const durationMonths = 3; // exactly 3 installments monthly
  const installmentAmount = Math.round(totalAmount / 3);
  const lastInstallmentAmount = totalAmount - (installmentAmount * 2);

  // Create monthly installment invoices (starting from next month, all pending)
  for (let i = 1; i <= 3; i++) {
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + i); // Charge starting from NEXT month
    const amt = i === durationMonths ? lastInstallmentAmount : installmentAmount;
    
    if (isMock) {
      await mockStore.create('fees', {
        studentId,
        amount: amt,
        term: `Month ${i} Installment`,
        dueDate,
        status: 'pending',
        paymentDate: null,
        transactionId: '',
        paymentMethod: ''
      });
    } else {
      await Fee.create({
        studentId,
        amount: amt,
        term: `Month ${i} Installment`,
        dueDate,
        status: 'pending',
        paymentDate: null,
        transactionId: '',
        paymentMethod: ''
      });
    }
  }
}

// @desc    Retrieve admission document in binary
// @route   GET /api/admin/admissions/document/:id/:fieldName
router.get('/admissions/document/:id/:fieldName', async (req, res) => {
  try {
    const { id, fieldName } = req.params;
    if (mockStore.isMock) {
      const admission = await mockStore.findById('admissions', id);
      if (!admission) return res.status(404).send('Admission record not found');
      
      const doc = admission.documentData?.[fieldName];
      if (doc && doc.data) {
        res.contentType(doc.contentType || 'application/octet-stream');
        return res.send(Buffer.from(doc.data, 'base64'));
      }
      const path = admission.documents?.[fieldName];
      if (path && typeof path === 'string') {
        return res.redirect(path);
      }
      return res.status(404).send('Document not found');
    }

    const admission = await Admission.findById(id);
    if (!admission) return res.status(404).send('Admission record not found');
    
    const doc = admission.documentData?.[fieldName];
    if (doc && doc.data) {
      res.contentType(doc.contentType || 'application/octet-stream');
      return res.send(doc.data);
    }
    const path = admission.documents?.[fieldName];
    if (path && typeof path === 'string') {
      return res.redirect(path);
    }
    return res.status(404).send('Document not found');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// @desc    Retrieve student photo in binary
// @route   GET /api/admin/students/photo/:id
router.get('/students/photo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (mockStore.isMock) {
      const student = await mockStore.findById('students', id);
      if (!student) return res.status(404).send('Student not found');
      
      const photo = student.photoData;
      if (photo && photo.data) {
        res.contentType(photo.contentType || 'image/png');
        return res.send(Buffer.from(photo.data, 'base64'));
      }
      const path = student.photo;
      if (path && typeof path === 'string') {
        return res.redirect(path);
      }
      return res.status(404).send('Photo not found');
    }

    const student = await Student.findById(id);
    if (!student) return res.status(404).send('Student not found');
    
    const photo = student.photoData;
    if (photo && photo.data) {
      res.contentType(photo.contentType || 'image/png');
      return res.send(photo.data);
    }
    const path = student.photo;
    if (path && typeof path === 'string') {
      return res.redirect(path);
    }
    return res.status(404).send('Photo not found');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Apply auth protection & role check to all admin routes
router.use(protect);
router.use(authorize('admin'));

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const studentCount = (await mockStore.find('students')).length;
      const parentCount = (await mockStore.find('parents')).length;
      const teacherCount = (await mockStore.find('teachers')).length;
      
      const admissions = await mockStore.find('admissions');
      const pendingAdmissions = admissions.filter(a => a.status === 'pending').length;

      const queries = await mockStore.find('queries');
      const unreadQueries = queries.filter(q => q.status === 'unread').length;

      const totalRevenue = (await mockStore.find('fees'))
        .filter(f => f.status === 'paid')
        .reduce((sum, f) => sum + f.amount, 0);

      return res.json({
        success: true,
        stats: {
          students: studentCount,
          parents: parentCount,
          teachers: teacherCount,
          pendingAdmissions,
          unreadQueries,
          totalRevenue
        }
      });
    }

    // MongoDB
    const studentCount = await Student.countDocuments();
    const parentCount = await Parent.countDocuments();
    const teacherCount = await Teacher.countDocuments();
    const pendingAdmissions = await Admission.countDocuments({ status: 'pending' });
    const unreadQueries = await Query.countDocuments({ status: 'unread' });
    
    const paidFees = await Fee.find({ status: 'paid' });
    const totalRevenue = paidFees.reduce((sum, f) => sum + f.amount, 0);

    res.json({
      success: true,
      stats: {
        students: studentCount,
        parents: parentCount,
        teachers: teacherCount,
        pendingAdmissions,
        unreadQueries,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// ADMISSIONS MANAGEMENT
// ==========================================

// @desc    Get all admission applications
// @route   GET /api/admin/admissions
router.get('/admissions', async (req, res) => {
  try {
    const mapAdmissionDocs = (adm) => {
      const obj = adm.toObject ? adm.toObject() : { ...adm };
      if (!obj.documents) return obj;
      const mappedDocs = { ...obj.documents };
      const documentFields = [
        'photo', 'reportCard', 'addressProof'
      ];
      documentFields.forEach(field => {
        const doc = obj.documentData?.[field];
        if (doc && doc.data) {
          mappedDocs[field] = `/api/admin/admissions/document/${obj._id}/${field}`;
        }
      });
      obj.documents = mappedDocs;
      return obj;
    };

    if (mockStore.isMock) {
      const list = await mockStore.find('admissions');
      const mappedList = list.map(mapAdmissionDocs);
      return res.json({ success: true, count: mappedList.length, data: mappedList });
    }
    const list = await Admission.find().sort({ submissionDate: -1 });
    const mappedList = list.map(mapAdmissionDocs);
    res.json({ success: true, count: mappedList.length, data: mappedList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update admission status (Approve/Reject)
// @route   PUT /api/admin/admissions/:id
router.put('/admissions/:id', async (req, res) => {
  const { status, remarks, password } = req.body;

  try {
    if (mockStore.isMock) {
      const admission = await mockStore.findById('admissions', req.params.id);
      if (!admission) return res.status(404).json({ success: false, message: 'Application not found' });

      admission.status = status;
      admission.remarks = remarks || '';
      await mockStore.findByIdAndUpdate('admissions', req.params.id, admission);

      // If approved, provision a Parent User account and Student record
      if (status === 'approved') {
        // Check if Parent User already exists
        let parentUser = await mockStore.findOne('users', { email: admission.parentDetails?.email });
        let parentProfile;

        if (!parentUser) {
          const salt = bcrypt.genSaltSync(10);
          const defaultPasswordHash = bcrypt.hashSync(password || 'parent123', salt);
          
          parentUser = await mockStore.create('users', {
            name: admission.parentDetails?.fatherName || admission.parentDetails?.motherName || 'Parent',
            email: admission.parentDetails?.email,
            password: defaultPasswordHash,
            role: 'parent',
            profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
          });

          parentProfile = await mockStore.create('parents', {
            userId: parentUser._id,
            name: parentUser.name,
            email: parentUser.email,
            phone: admission.parentDetails?.phone || '',
            address: admission.parentDetails?.address || '',
            children: []
          });
        } else {
          parentProfile = await mockStore.findOne('parents', { userId: parentUser._id });
          if (!parentProfile) {
            parentProfile = await mockStore.create('parents', {
              userId: parentUser._id,
              name: parentUser.name,
              email: parentUser.email,
              phone: admission.parentDetails?.phone || '',
              address: admission.parentDetails?.address || '',
              children: []
            });
          }
        }

        if (!Array.isArray(parentProfile.children)) {
          parentProfile.children = [];
        }

        // Get an available teacher
        const teachers = await mockStore.find('teachers') || [];
        const teacherId = teachers[0]?._id || null;

        // Create the Student
        const studentDbId = 'std_' + Math.random().toString(36).substr(2, 9);
        const generatedStudentId = `STD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const hasPhoto = admission.documentData?.photo?.data;
        const newStudent = await mockStore.create('students', {
          _id: studentDbId,
          name: admission.studentDetails?.name || 'Student',
          studentId: generatedStudentId,
          dateOfBirth: admission.studentDetails?.dateOfBirth,
          gender: admission.studentDetails?.gender || 'Male',
          class: admission.studentDetails?.class || 'Nursery',
          parentId: parentProfile._id,
          teacherId,
          photo: hasPhoto ? `/api/admin/students/photo/${studentDbId}` : (admission.documents?.photo || ''),
          photoData: admission.documentData?.photo,
          attendance: [],
          progressReports: [],
          activities: []
        });

        parentProfile.children.push(newStudent._id);
        await mockStore.findByIdAndUpdate('parents', parentProfile._id, { children: parentProfile.children });

        // Automatically assign fee structure according to class
        await assignFeesForStudent(newStudent._id, newStudent.class, true);

        // Auto-enroll in matching LMS course if applicable
        const mockCourses = await mockStore.find('courses') || [];
        const courseMatch = mockCourses.find(c => c.title && c.title.toLowerCase() === (newStudent.class || '').toLowerCase());
        if (courseMatch) {
          const existingEnr = await mockStore.find('enrollments', { user: String(parentUser._id), course: String(courseMatch._id) });
          if (!existingEnr || existingEnr.length === 0) {
            await mockStore.create('enrollments', {
              user: String(parentUser._id),
              course: String(courseMatch._id),
              paymentStatus: 'paid',
              status: 'active',
              enrolledAt: new Date()
            });
          }
        }
      }

      return res.json({ success: true, message: `Admission application status updated to ${status}!`, data: admission });
    }

    // MongoDB Mongoose
    const admission = await Admission.findById(req.params.id);
    if (!admission) return res.status(404).json({ success: false, message: 'Application not found' });

    admission.status = status;
    admission.remarks = remarks || '';
    await admission.save();

    if (status === 'approved') {
      // 1. Check if user already exists
      let user = await User.findOne({ email: admission.parentDetails?.email });
      let parent;

      if (!user) {
        // Create user credentials
        user = await User.create({
          name: admission.parentDetails?.fatherName || admission.parentDetails?.motherName || 'Parent',
          email: admission.parentDetails?.email,
          password: password || 'parent123', // Admin-provided password
          role: 'parent'
        });

        parent = await Parent.create({
          userId: user._id,
          name: user.name,
          email: user.email,
          phone: admission.parentDetails?.phone || '',
          address: admission.parentDetails?.address || '',
          children: []
        });
      } else {
        parent = await Parent.findOne({ userId: user._id });
        if (!parent) {
          parent = await Parent.create({
            userId: user._id,
            name: user.name,
            email: user.email,
            phone: admission.parentDetails?.phone || '',
            address: admission.parentDetails?.address || '',
            children: []
          });
        }
      }

      if (!Array.isArray(parent.children)) {
        parent.children = [];
      }

      // Assign first available teacher if any
      const firstTeacher = await Teacher.findOne();

      // 2. Create student
      const studentDbId = new mongoose.Types.ObjectId();
      const generatedStudentId = `STD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const hasPhoto = admission.documentData?.photo?.data;
      const student = await Student.create({
        _id: studentDbId,
        name: admission.studentDetails?.name || 'Student',
        studentId: generatedStudentId,
        dateOfBirth: admission.studentDetails?.dateOfBirth,
        gender: admission.studentDetails?.gender || 'Male',
        class: admission.studentDetails?.class || 'Nursery',
        parentId: parent._id,
        teacherId: firstTeacher ? firstTeacher._id : null,
        photo: hasPhoto ? `/api/admin/students/photo/${studentDbId}` : (admission.documents?.photo || ''),
        photoData: admission.documentData?.photo
      });

      // 3. Link child
      parent.children.push(student._id);
      await parent.save();

      // Automatically assign fee structure according to class
      await assignFeesForStudent(student._id, student.class, false);

      // Auto-enroll in matching LMS course if applicable
      const courseMatch = await Course.findOne({ title: { $regex: new RegExp(`^${escapeRegExp(student.class)}$`, 'i') } });
      if (courseMatch) {
        const CourseEnrollment = (await import('../models/CourseEnrollment.js')).default;
        await CourseEnrollment.findOneAndUpdate(
          { user: user._id, course: courseMatch._id },
          { paymentStatus: 'paid', status: 'active', enrolledAt: new Date() },
          { upsert: true, new: true }
        );
        courseMatch.totalEnrollments = (courseMatch.totalEnrollments || 0) + 1;
        await courseMatch.save();
      }
    }

    res.json({ success: true, message: `Admission application status updated to ${status}!`, data: admission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ==========================================
// USER REGISTRY MANAGEMENT (STUDENTS, TEACHERS)
// ==========================================

// Get all students
router.get('/students', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const list = await mockStore.find('students') || [];
      const parents = await mockStore.find('parents') || [];
      const admissions = await mockStore.find('admissions') || [];

      const mappedList = list.map(std => {
        const stdObj = { ...std };

        // 1. Resolve parentId object
        let parentObj = null;
        if (stdObj.parentId && typeof stdObj.parentId === 'object' && stdObj.parentId.name) {
          parentObj = stdObj.parentId;
        } else if (stdObj.parentId) {
          parentObj = parents.find(p => String(p._id) === String(stdObj.parentId) || String(p.userId) === String(stdObj.parentId));
        }

        // 2. Fallback to embedded parentDetails or matching admission record
        if (!parentObj && stdObj.parentDetails) {
          parentObj = {
            name: stdObj.parentDetails.fatherName || stdObj.parentDetails.motherName || 'Parent',
            phone: stdObj.parentDetails.phone || '',
            email: stdObj.parentDetails.email || '',
            address: stdObj.parentDetails.address || ''
          };
        } else if (!parentObj) {
          const admMatch = admissions.find(a => 
            (a.studentDetails?.name && String(a.studentDetails.name).toLowerCase() === String(stdObj.name).toLowerCase()) ||
            String(a._id) === String(stdObj.admissionId)
          );
          if (admMatch && admMatch.parentDetails) {
            parentObj = {
              name: admMatch.parentDetails.fatherName || admMatch.parentDetails.motherName || 'Parent',
              phone: admMatch.parentDetails.phone || '',
              email: admMatch.parentDetails.email || '',
              address: admMatch.parentDetails.address || ''
            };
          }
        }

        if (parentObj) {
          stdObj.parentId = parentObj;
          if (!stdObj.parentDetails) {
            stdObj.parentDetails = {
              fatherName: parentObj.name || parentObj.fatherName || '',
              motherName: parentObj.motherName || '',
              phone: parentObj.phone || '',
              email: parentObj.email || '',
              address: parentObj.address || ''
            };
          }
        }

        if (stdObj.photoData && stdObj.photoData.data) {
          stdObj.photo = `/api/admin/students/photo/${stdObj._id}`;
        }
        return stdObj;
      });
      return res.json({ success: true, count: mappedList.length, data: mappedList });
    }

    const list = await Student.find().populate('parentId teacherId');
    const mappedList = await Promise.all(list.map(async std => {
      const stdObj = std.toObject();

      // If parentId is not populated or missing contact details, look up from Admission record
      if (!stdObj.parentId || !stdObj.parentId.name) {
        try {
          const Admission = (await import('../models/Admission.js')).default;
          const admMatch = await Admission.findOne({ 'studentDetails.name': stdObj.name });
          if (admMatch && admMatch.parentDetails) {
            stdObj.parentId = {
              name: admMatch.parentDetails.fatherName || admMatch.parentDetails.motherName || 'Parent',
              phone: admMatch.parentDetails.phone || '',
              email: admMatch.parentDetails.email || '',
              address: admMatch.parentDetails.address || ''
            };
          }
        } catch (e) {
          // ignore lookup error
        }
      }

      if (stdObj.photoData && stdObj.photoData.data) {
        stdObj.photo = `/api/admin/students/photo/${stdObj._id}`;
      }
      return stdObj;
    }));
    res.json({ success: true, count: mappedList.length, data: mappedList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a student
router.delete('/students/:id', async (req, res) => {
  try {
    if (mockStore.isMock) {
      await mockStore.findByIdAndDelete('students', req.params.id);
      return res.json({ success: true, message: 'Student removed successfully' });
    }
    await Student.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Student removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create Admission & Student directly (Admin-only)
router.post('/admissions/create', uploadAdmissions.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'reportCard', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 }
]), async (req, res) => {
  let { studentDetails, parentDetails, password, admissionFee, tuitionFee, courseFee, addressProofType, paymentPlan = '4months' } = req.body;
  
  try {
    if (typeof studentDetails === 'string') {
      try { studentDetails = JSON.parse(studentDetails); } catch (e) { studentDetails = {}; }
    }
    if (typeof parentDetails === 'string') {
      try { parentDetails = JSON.parse(parentDetails); } catch (e) { parentDetails = {}; }
    }
    studentDetails = studentDetails || {};
    parentDetails = parentDetails || {};

    const studentName = String(studentDetails.name || '').trim() || 'Student';
    const studentClass = String(studentDetails.class || '').trim() || 'Nursery';
    const rawGender = String(studentDetails.gender || '').trim().toLowerCase();
    const studentGender = rawGender === 'female' ? 'Female' : rawGender === 'other' ? 'Other' : 'Male';
    let studentDob = studentDetails.dateOfBirth ? new Date(studentDetails.dateOfBirth) : new Date('2020-01-01');
    if (isNaN(studentDob.getTime())) studentDob = new Date('2020-01-01');

    const parentEmail = String(parentDetails.email || '').trim().toLowerCase();
    if (!parentEmail) {
      return res.status(400).json({ success: false, message: 'Parent email address is required.' });
    }

    const parentFatherName = String(parentDetails.fatherName || parentDetails.motherName || 'Parent').trim();
    const parentMotherName = String(parentDetails.motherName || parentDetails.fatherName || 'Parent').trim();
    const parentPhone = String(parentDetails.phone || '').trim();
    const parentAddress = String(parentDetails.address || '').trim();

    const normalizedStudent = {
      name: studentName,
      dateOfBirth: studentDob,
      gender: studentGender,
      class: studentClass
    };

    const normalizedParent = {
      fatherName: parentFatherName,
      motherName: parentMotherName,
      email: parentEmail,
      phone: parentPhone,
      address: parentAddress
    };

    const appNo = `PRN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedStudentId = `STD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const photoFile = req.files?.['photo']?.[0];
    const reportCardFile = req.files?.['reportCard']?.[0];
    const addressProofFile = req.files?.['addressProof']?.[0];

    const isMock = mockStore.isMock;
    const admissionId = isMock
      ? 'adm_' + Math.random().toString(36).substr(2, 9)
      : new mongoose.Types.ObjectId();
    const studentDbId = isMock
      ? 'std_' + Math.random().toString(36).substr(2, 9)
      : new mongoose.Types.ObjectId();

    const makeDocData = (file) => {
      if (!file) return undefined;
      return {
        data: isMock ? file.buffer.toString('base64') : file.buffer,
        contentType: file.mimetype,
        filename: file.originalname
      };
    };

    const documents = {
      photo: photoFile ? `/api/admin/admissions/document/${admissionId}/photo` : '',
      parentIdProof: 'id_proof_uploaded.pdf',
      reportCard: reportCardFile ? `/api/admin/admissions/document/${admissionId}/reportCard` : '',
      addressProofType: addressProofType || '',
      addressProof: addressProofFile ? `/api/admin/admissions/document/${admissionId}/addressProof` : ''
    };

    const documentData = {
      photo: makeDocData(photoFile),
      parentIdProof: undefined,
      reportCard: makeDocData(reportCardFile),
      addressProof: makeDocData(addressProofFile)
    };

    if (isMock) {
      let parentUser = await mockStore.findOne('users', { email: normalizedParent.email });
      let parentProfile;
      if (!parentUser) {
        const salt = bcrypt.genSaltSync(10);
        parentUser = await mockStore.create('users', {
          name: normalizedParent.fatherName || normalizedParent.motherName,
          email: normalizedParent.email,
          password: bcrypt.hashSync(password || 'parent123', salt),
          role: 'parent'
        });
        parentProfile = await mockStore.create('parents', {
          userId: parentUser._id,
          name: parentUser.name,
          email: parentUser.email,
          phone: normalizedParent.phone,
          address: normalizedParent.address,
          children: []
        });
      } else {
        parentProfile = await mockStore.findOne('parents', { userId: parentUser._id });
        if (!parentProfile) {
          parentProfile = await mockStore.create('parents', {
            userId: parentUser._id,
            name: parentUser.name,
            email: parentUser.email,
            phone: normalizedParent.phone,
            address: normalizedParent.address,
            children: []
          });
        }
      }

      if (!Array.isArray(parentProfile.children)) {
        parentProfile.children = [];
      }

      const teachers = await mockStore.find('teachers') || [];
      const teacherId = teachers[0]?._id || null;

      const newStudent = await mockStore.create('students', {
        _id: studentDbId,
        name: normalizedStudent.name,
        studentId: generatedStudentId,
        dateOfBirth: normalizedStudent.dateOfBirth,
        gender: normalizedStudent.gender,
        class: normalizedStudent.class,
        parentId: parentProfile._id,
        parentDetails: normalizedParent,
        teacherId,
        photo: photoFile ? `/api/admin/students/photo/${studentDbId}` : '',
        photoData: photoFile ? makeDocData(photoFile) : undefined,
        attendance: [],
        progressReports: [],
        activities: []
      });

      parentProfile.children.push(newStudent._id);
      await mockStore.findByIdAndUpdate('parents', parentProfile._id, { children: parentProfile.children });

      const admission = await mockStore.create('admissions', {
        _id: admissionId,
        applicationNumber: appNo,
        studentDetails: normalizedStudent,
        parentDetails: normalizedParent,
        documents,
        documentData,
        status: 'approved',
        remarks: 'Direct Admin Admission',
        submissionDate: new Date()
      });

      // Create Admission Fee invoice + receipt if provided
      let createdAdmissionFee = null;
      let createdReceipt = null;
      const admissionFeeVal = Number(admissionFee) || 0;
      if (admissionFeeVal > 0) {
        const txnId = `TXN-ADM-${Math.floor(100000 + Math.random() * 900000)}`;
        createdAdmissionFee = await mockStore.create('fees', {
          studentId: newStudent._id,
          amount: admissionFeeVal,
          term: 'Admission Fee',
          dueDate: new Date(),
          status: 'paid',
          paymentDate: new Date(),
          transactionId: txnId,
          paymentMethod: 'Admission Desk Cash'
        });
        createdReceipt = await mockStore.create('receipts', {
          feeId: createdAdmissionFee._id,
          studentId: newStudent._id,
          receiptNumber: `REC-ADM-${Date.now()}`,
          amountPaid: admissionFeeVal,
          paymentMethod: 'Admission Desk Cash',
          paymentDate: new Date(),
          transactionId: txnId
        });
      }

      let totalAmount = Number(tuitionFee || courseFee) || 0;
      if (!totalAmount) {
        const mockCourses = await mockStore.find('courses') || [];
        const courseMatch = mockCourses.find(c => c.title && c.title.toLowerCase() === (normalizedStudent.class || '').toLowerCase());
        if (courseMatch && courseMatch.price) {
          totalAmount = Number(courseMatch.price) || 15000;
        } else {
          totalAmount = 15000;
        }
      }

      const mockCourses = await mockStore.find('courses') || [];
      const courseMatch = mockCourses.find(c => c.title && c.title.toLowerCase() === (normalizedStudent.class || '').toLowerCase());
      if (courseMatch) {
        await mockStore.create('enrollments', {
          user: String(parentUser._id),
          course: String(courseMatch._id),
          paymentStatus: 'paid',
          status: 'active',
          enrolledAt: new Date()
        });
      }

      const remainingTuition = Math.max(0, totalAmount - admissionFeeVal);
      const count = (paymentPlan === '1month' || paymentPlan === '1months' || paymentPlan === '1' || paymentPlan === 'full')
        ? 1
        : (paymentPlan === '2months' || paymentPlan === '2')
        ? 2
        : (paymentPlan === '3months' || paymentPlan === '3')
        ? 3
        : (paymentPlan === '4months' || paymentPlan === '4')
        ? 4
        : (paymentPlan === '5months' || paymentPlan === '5')
        ? 5
        : (paymentPlan === '6months' || paymentPlan === '6')
        ? 6
        : (paymentPlan === '10months' || paymentPlan === '10')
        ? 10
        : 12;

      if (remainingTuition > 0) {
        if (paymentPlan === 'full' && admissionFeeVal === 0) {
          await mockStore.create('fees', {
            studentId: newStudent._id,
            amount: remainingTuition,
            term: 'Full Course Tuition Fee',
            dueDate: new Date(),
            status: 'paid',
            paymentDate: new Date(),
            transactionId: `TXN-INIT-${Math.floor(100000 + Math.random() * 900000)}`,
            paymentMethod: 'Admission Desk Cash'
          });
        } else {
          const installmentAmount = Math.round(remainingTuition / count);
          const lastInstallmentAmount = remainingTuition - (installmentAmount * (count - 1));

          for (let i = 1; i <= count; i++) {
            const dueDate = new Date();
            dueDate.setMonth(dueDate.getMonth() + i); // Starts charging from NEXT month
            const amt = i === count ? lastInstallmentAmount : installmentAmount;
            await mockStore.create('fees', {
              studentId: newStudent._id,
              amount: amt,
              term: `Month ${i} Tuition Fee`,
              dueDate,
              status: 'pending',
              paymentDate: null,
              transactionId: '',
              paymentMethod: ''
            });
          }
        }
      }

      return res.status(201).json({ 
        success: true, 
        message: 'Admission created and student registered successfully!', 
        data: admission,
        receipt: createdReceipt
      });
    }

    // MongoDB
    let parentUser = await User.findOne({ email: normalizedParent.email });
    let parent;
    if (!parentUser) {
      parentUser = await User.create({
        name: normalizedParent.fatherName || normalizedParent.motherName,
        email: normalizedParent.email,
        password: password || 'parent123',
        role: 'parent'
      });
      parent = await Parent.create({
        userId: parentUser._id,
        name: parentUser.name,
        email: parentUser.email,
        phone: normalizedParent.phone || '0000000000',
        address: normalizedParent.address || 'Address',
        children: []
      });
    } else {
      parent = await Parent.findOne({ userId: parentUser._id });
      if (!parent) {
        parent = await Parent.create({
          userId: parentUser._id,
          name: parentUser.name,
          email: parentUser.email,
          phone: normalizedParent.phone || '0000000000',
          address: normalizedParent.address || 'Address',
          children: []
        });
      }
    }

    if (!Array.isArray(parent.children)) {
      parent.children = [];
    }

    const firstTeacher = await Teacher.findOne();

    const student = await Student.create({
      _id: studentDbId,
      name: normalizedStudent.name,
      studentId: generatedStudentId,
      dateOfBirth: normalizedStudent.dateOfBirth,
      gender: normalizedStudent.gender,
      class: normalizedStudent.class,
      parentId: parent._id,
      teacherId: firstTeacher ? firstTeacher._id : null,
      photo: photoFile ? `/api/admin/students/photo/${studentDbId}` : '',
      photoData: photoFile ? makeDocData(photoFile) : undefined
    });

    parent.children.push(student._id);
    await parent.save();

    const admission = await Admission.create({
      _id: admissionId,
      applicationNumber: appNo,
      studentDetails: normalizedStudent,
      parentDetails: normalizedParent,
      documents,
      documentData,
      status: 'approved',
      remarks: 'Direct Admin Admission'
    });

    // Create Admission Fee invoice + receipt if provided
    let createdAdmissionFee = null;
    let createdReceipt = null;
    const admissionFeeVal = Number(admissionFee) || 0;
    if (admissionFeeVal > 0) {
      const txnId = `TXN-ADM-${Math.floor(100000 + Math.random() * 900000)}`;
      createdAdmissionFee = await Fee.create({
        studentId: student._id,
        amount: admissionFeeVal,
        term: 'Admission Fee',
        dueDate: new Date(),
        status: 'paid',
        paymentDate: new Date(),
        transactionId: txnId,
        paymentMethod: 'Admission Desk Cash'
      });
      createdReceipt = await Receipt.create({
        feeId: createdAdmissionFee._id,
        studentId: student._id,
        receiptNumber: `REC-ADM-${Date.now()}`,
        amountPaid: admissionFeeVal,
        paymentMethod: 'Admission Desk Cash',
        paymentDate: new Date(),
        transactionId: txnId
      });
    }

    let totalAmount = 15000;
    const courseMatch = await Course.findOne({ title: { $regex: new RegExp(`^${escapeRegExp(normalizedStudent.class)}$`, 'i') } });
    if (courseMatch) {
      if (courseMatch.price) totalAmount = Number(courseMatch.price) || 15000;
      const CourseEnrollment = (await import('../models/CourseEnrollment.js')).default;
      await CourseEnrollment.findOneAndUpdate(
        { user: parentUser._id, course: courseMatch._id },
        { paymentStatus: 'paid', status: 'active', enrolledAt: new Date() },
        { upsert: true, new: true }
      );
      courseMatch.totalEnrollments = (courseMatch.totalEnrollments || 0) + 1;
      await courseMatch.save();
    }

    const remainingTuition = Math.max(0, totalAmount - admissionFeeVal);
    if (paymentPlan === 'full' && admissionFeeVal === 0) {
      await Fee.create({
        studentId: student._id,
        amount: totalAmount,
        term: 'Full Course Tuition Fee',
        dueDate: new Date(),
        status: 'paid',
        paymentDate: new Date(),
        transactionId: `TXN-INIT-${Math.floor(100000 + Math.random() * 900000)}`,
        paymentMethod: 'Admission Desk Cash'
      });
    } else if (remainingTuition > 0) {
      const count = (paymentPlan === '1month' || paymentPlan === '1months' || paymentPlan === '1')
        ? 1
        : (paymentPlan === '2months' || paymentPlan === '2')
        ? 2
        : (paymentPlan === '3months' || paymentPlan === '3')
        ? 3
        : (paymentPlan === '4months' || paymentPlan === '4')
        ? 4
        : (paymentPlan === '5months' || paymentPlan === '5')
        ? 5
        : (paymentPlan === '6months' || paymentPlan === '6')
        ? 6
        : (paymentPlan === '10months' || paymentPlan === '10')
        ? 10
        : (paymentPlan === '12months' || paymentPlan === '12')
        ? 12
        : 1;
      const installmentAmount = Math.round(remainingTuition / count);
      const lastInstallmentAmount = remainingTuition - (installmentAmount * (count - 1));

      for (let i = 1; i <= count; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i); // Starts charging from NEXT month
        const amt = i === count ? lastInstallmentAmount : installmentAmount;
        await Fee.create({
          studentId: student._id,
          amount: amt,
          term: `Month ${i} Tuition Fee`,
          dueDate,
          status: 'pending',
          paymentDate: null,
          transactionId: '',
          paymentMethod: ''
        });
      }
    }

    res.status(201).json({ 
      success: true, 
      message: 'Admission created and student registered successfully!', 
      data: admission,
      receipt: createdReceipt
    });
  } catch (error) {
    console.error('Error creating admission:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Direct Student Registration (Admin-only)
router.post('/students/register', async (req, res) => {
  const { name, dateOfBirth, gender, studentClass, parentName, parentEmail, parentPhone, parentAddress, password } = req.body;
  
  try {
    const pEmail = String(parentEmail || '').trim().toLowerCase();
    if (!pEmail) {
      return res.status(400).json({ success: false, message: 'Parent email address is required.' });
    }

    const generatedStudentId = `STD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const rawGender = String(gender || '').trim().toLowerCase();
    const normalizedGender = rawGender === 'female' ? 'Female' : rawGender === 'other' ? 'Other' : 'Male';
    let stdDob = dateOfBirth ? new Date(dateOfBirth) : new Date('2020-01-01');
    if (isNaN(stdDob.getTime())) stdDob = new Date('2020-01-01');

    if (mockStore.isMock) {
      let parentUser = await mockStore.findOne('users', { email: pEmail });
      let parentProfile;
      if (!parentUser) {
        const salt = bcrypt.genSaltSync(10);
        parentUser = await mockStore.create('users', {
          name: parentName || 'Parent',
          email: pEmail,
          password: bcrypt.hashSync(password || 'parent123', salt),
          role: 'parent'
        });
        parentProfile = await mockStore.create('parents', {
          userId: parentUser._id,
          name: parentUser.name,
          email: parentUser.email,
          phone: parentPhone || '',
          address: parentAddress || '',
          children: []
        });
      } else {
        parentProfile = await mockStore.findOne('parents', { userId: parentUser._id });
        if (!parentProfile) {
          parentProfile = await mockStore.create('parents', {
            userId: parentUser._id,
            name: parentUser.name,
            email: parentUser.email,
            phone: parentPhone || '',
            address: parentAddress || '',
            children: []
          });
        }
      }

      if (!Array.isArray(parentProfile.children)) {
        parentProfile.children = [];
      }

      const teachers = await mockStore.find('teachers') || [];
      const teacherId = teachers[0]?._id || null;

      const student = await mockStore.create('students', {
        name: name || 'Student',
        studentId: generatedStudentId,
        dateOfBirth: stdDob,
        gender: normalizedGender,
        class: studentClass || 'Nursery',
        parentId: parentProfile._id,
        teacherId,
        attendance: [],
        progressReports: [],
        activities: []
      });

      parentProfile.children.push(student._id);
      await mockStore.findByIdAndUpdate('parents', parentProfile._id, { children: parentProfile.children });

      // Automatically assign fee structure according to class
      await assignFeesForStudent(student._id, student.class, true);

      return res.status(201).json({ success: true, message: 'Student registered directly successfully!', data: student });
    }

    // MongoDB
    let parentUser = await User.findOne({ email: pEmail });
    let parent;
    if (!parentUser) {
      parentUser = await User.create({
        name: parentName || 'Parent',
        email: pEmail,
        password: password || 'parent123',
        role: 'parent'
      });
      parent = await Parent.create({
        userId: parentUser._id,
        name: parentUser.name,
        email: parentUser.email,
        phone: parentPhone || '0000000000',
        address: parentAddress || 'Address',
        children: []
      });
    } else {
      parent = await Parent.findOne({ userId: parentUser._id });
      if (!parent) {
        parent = await Parent.create({
          userId: parentUser._id,
          name: parentUser.name,
          email: parentUser.email,
          phone: parentPhone || '0000000000',
          address: parentAddress || 'Address',
          children: []
        });
      }
    }

    if (!Array.isArray(parent.children)) {
      parent.children = [];
    }

    const firstTeacher = await Teacher.findOne();

    const student = await Student.create({
      name: name || 'Student',
      studentId: generatedStudentId,
      dateOfBirth: stdDob,
      gender: normalizedGender,
      class: studentClass || 'Nursery',
      parentId: parent._id,
      teacherId: firstTeacher ? firstTeacher._id : null
    });

    parent.children.push(student._id);
    await parent.save();

    // Automatically assign fee structure according to class
    await assignFeesForStudent(student._id, studentClass, false);

    res.status(201).json({ success: true, message: 'Student registered directly successfully!', data: student });
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Student Profile (Admin-only)
router.put('/students/:id', async (req, res) => {
  const { name, dateOfBirth, gender, studentClass, parentName, parentPhone, parentAddress } = req.body;
  
  try {
    if (mockStore.isMock) {
      const student = await mockStore.findById('students', req.params.id);
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
      
      const updatedStudent = await mockStore.findByIdAndUpdate('students', req.params.id, {
        name: name || student.name,
        dateOfBirth: dateOfBirth || student.dateOfBirth,
        gender: gender || student.gender,
        class: studentClass || student.class
      });

      if (student.parentId) {
        const parent = await mockStore.findById('parents', student.parentId);
        if (parent) {
          await mockStore.findByIdAndUpdate('parents', student.parentId, {
            name: parentName || parent.name,
            phone: parentPhone || parent.phone,
            address: parentAddress || parent.address
          });
        }
      }
      return res.json({ success: true, message: 'Student updated successfully', data: updatedStudent });
    }

    // MongoDB
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    
    student.name = name || student.name;
    student.dateOfBirth = dateOfBirth || student.dateOfBirth;
    student.gender = gender || student.gender;
    student.class = studentClass || student.class;
    await student.save();

    if (student.parentId) {
      const parent = await Parent.findById(student.parentId);
      if (parent) {
        parent.name = parentName || parent.name;
        parent.phone = parentPhone || parent.phone;
        parent.address = parentAddress || parent.address;
        await parent.save();
      }
    }

    res.json({ success: true, message: 'Student updated successfully', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all teachers
router.get('/teachers', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const list = await mockStore.find('teachers');
      return res.json({ success: true, count: list.length, data: list });
    }
    const list = await Teacher.find();
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a teacher
router.post('/teachers', async (req, res) => {
  const { name, email, password, phone, specialization, qualifications, classesAssigned } = req.body;
  try {
    if (mockStore.isMock) {
      const userExists = await mockStore.findOne('users', { email });
      if (userExists) return res.status(400).json({ success: false, message: 'Teacher email already registered' });

      const salt = bcrypt.genSaltSync(10);
      const passHash = bcrypt.hashSync(password || 'teacher123', salt);

      const newUser = await mockStore.create('users', {
        name,
        email,
        password: passHash,
        role: 'teacher',
        profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
      });

      const newTeacher = await mockStore.create('teachers', {
        userId: newUser._id,
        name,
        email,
        phone,
        specialization: specialization || 'Early Childhood Education',
        qualifications,
        classesAssigned: classesAssigned || ['Nursery']
      });

      return res.status(201).json({ success: true, message: 'Teacher registered successfully!', data: newTeacher });
    }

    // MongoDB
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'Teacher email already registered' });

    const newUser = await User.create({
      name,
      email,
      password: password || 'teacher123',
      role: 'teacher'
    });

    const newTeacher = await Teacher.create({
      userId: newUser._id,
      name,
      email,
      phone,
      specialization: specialization || 'Early Childhood Education',
      qualifications,
      classesAssigned: classesAssigned || ['Nursery']
    });

    res.status(201).json({ success: true, message: 'Teacher registered successfully!', data: newTeacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ==========================================
// OTHER PORTAL MANAGERS (FEES, ANNOUNCEMENTS, GALLERY, QUERIES, LIBRARY NOTES)
// ==========================================

// Library notes
router.get('/library-notes', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const notes = await mockStore.find('libraryNotes');
      return res.json({ success: true, data: notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
    }
    const notes = await LibraryNote.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/library-notes', uploadNotes.single('pdfFile'), async (req, res) => {
  const { title, course, content } = req.body;
  try {
    if (!title || !course) {
      return res.status(400).json({ success: false, message: 'Please provide title and course.' });
    }

    if (!req.file && !content?.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide note content or upload a PDF file.' });
    }

    const noteContent = (content || '').trim();

    if (req.file) {
      const pdfUrl = `/uploads/${req.file.filename}`;
      const savedNote = mockStore.isMock
        ? await mockStore.create('libraryNotes', {
            title,
            course,
            content: noteContent || 'Uploaded PDF note',
            pdfUrl,
            fileName: req.file.originalname,
            createdAt: new Date()
          })
        : await LibraryNote.create({
            title,
            course,
            content: noteContent || 'Uploaded PDF note',
            pdfUrl,
            fileName: req.file.originalname
          });

      return res.status(201).json({ success: true, message: 'PDF note uploaded successfully!', data: savedNote });
    }

    const generatedPdf = generateLibraryNotePdf({ title, course, content: noteContent });

    if (mockStore.isMock) {
      const note = await mockStore.create('libraryNotes', {
        title,
        course,
        content: noteContent,
        pdfUrl: generatedPdf.pdfUrl,
        fileName: generatedPdf.fileName,
        createdAt: new Date()
      });
      return res.status(201).json({ success: true, message: 'Course note saved as PDF!', data: note });
    }

    const note = await LibraryNote.create({
      title,
      course,
      content: noteContent,
      pdfUrl: generatedPdf.pdfUrl,
      fileName: generatedPdf.fileName
    });
    res.status(201).json({ success: true, message: 'Course note saved as PDF!', data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/library-notes/:id', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const deleted = await mockStore.findByIdAndDelete('libraryNotes', req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Note not found' });
      return res.json({ success: true, message: 'Course note removed!' });
    }

    const deleted = await LibraryNote.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, message: 'Course note removed!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload Course/Module/Lesson Study Material PDF or Resource
router.post('/upload-material', uploadMaterial.single('materialFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a study material file to upload.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const name = req.file.originalname;
    const ext = name.split('.').pop().toLowerCase();
    const size = req.file.size;

    res.status(200).json({
      success: true,
      message: 'Study material uploaded successfully!',
      data: {
        name,
        url: fileUrl,
        type: ext,
        size
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a fee invoice
router.post('/fees', async (req, res) => {
  const { studentId, amount, term, dueDate } = req.body;
  try {
    if (mockStore.isMock) {
      const fee = await mockStore.create('fees', { studentId, amount: Number(amount), term, dueDate: new Date(dueDate), status: 'pending' });
      return res.status(201).json({ success: true, message: 'Fee invoice created!', data: fee });
    }
    const fee = await Fee.create({ studentId, amount, term, dueDate });
    res.status(201).json({ success: true, message: 'Fee invoice created!', data: fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all fees
router.get('/fees', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const rawFees = await mockStore.find('fees');
      const calculated = await getCalculatedFees(rawFees);
      return res.json({ success: true, data: calculated });
    }
    const rawFees = await Fee.find().populate({ path: 'studentId', select: 'name class' }).sort({ dueDate: 1 });
    const calculated = await getCalculatedFees(rawFees);
    res.json({ success: true, data: calculated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create announcement
router.post('/announcements', async (req, res) => {
  const { title, content, category, targetAudience } = req.body;
  try {
    if (mockStore.isMock) {
      const ann = await mockStore.create('announcements', { title, content, category, targetAudience, date: new Date() });
      return res.status(201).json({ success: true, message: 'Announcement created!', data: ann });
    }
    const ann = await Announcement.create({ title, content, category, targetAudience });
    res.status(201).json({ success: true, message: 'Announcement created!', data: ann });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete announcement
router.delete('/announcements/:id', async (req, res) => {
  try {
    if (mockStore.isMock) {
      await mockStore.findByIdAndDelete('announcements', req.params.id);
      return res.json({ success: true, message: 'Announcement deleted' });
    }
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create gallery item
router.post('/gallery', uploadGallery.single('file'), async (req, res) => {
  const { title, description, category, type } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file (jpg/jpeg/png)' });
    }
    const url = `/uploads/${req.file.filename}`;

    if (mockStore.isMock) {
      const gal = await mockStore.create('gallery', { title, description, url, category, type: type || 'image', date: new Date() });
      return res.status(201).json({ success: true, message: 'Media added to gallery!', data: gal });
    }
    const gal = await Gallery.create({ title, description, url, category, type: type || 'image' });
    res.status(201).json({ success: true, message: 'Media added to gallery!', data: gal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete gallery item
router.delete('/gallery/:id', async (req, res) => {
  try {
    if (mockStore.isMock) {
      await mockStore.findByIdAndDelete('gallery', req.params.id);
      return res.json({ success: true, message: 'Gallery item removed' });
    }
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Gallery item removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get queries
router.get('/queries', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const list = await mockStore.find('queries');
      return res.json({ success: true, count: list.length, data: list });
    }
    const list = await Query.find().sort({ createdAt: -1 });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update query status (Resolve)
router.put('/queries/:id', async (req, res) => {
  const { status } = req.body;
  try {
    if (mockStore.isMock) {
      const q = await mockStore.findByIdAndUpdate('queries', req.params.id, { status });
      if (!q) return res.status(404).json({ success: false, message: 'Query not found' });
      return res.json({ success: true, message: 'Query status updated!', data: q });
    }
    const q = await Query.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!q) return res.status(404).json({ success: false, message: 'Query not found' });
    res.json({ success: true, message: 'Query status updated!', data: q });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get receipt details for an invoice (Admin)
// @route   GET /api/admin/receipt/:feeId
router.get('/receipt/:feeId', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const receipt = await mockStore.findOne('receipts', { feeId: req.params.feeId });
      if (!receipt) return res.status(404).json({ success: false, message: 'Receipt not found' });
      const student = await mockStore.findById('students', receipt.studentId);
      const parent = student ? await mockStore.findById('parents', student.parentId) : null;
      const fee = await mockStore.findById('fees', receipt.feeId);
      return res.json({ 
        success: true, 
        receipt, 
        student: student ? { 
          name: student.name, 
          studentId: student.studentId, 
          class: student.class,
          parentName: parent ? parent.name : 'N/A',
          parentPhone: parent ? parent.phone : '',
          parentAddress: parent ? parent.address : ''
        } : null,
        fee: fee ? { 
          term: fee.term,
          amount: fee.amount,
          fine: fee.fine || 0
        } : null
      });
    }

    const receipt = await Receipt.findOne({ feeId: req.params.feeId })
      .populate({
        path: 'studentId',
        populate: { path: 'parentId' }
      })
      .populate('feeId');
      
    if (!receipt) return res.status(404).json({ success: false, message: 'Receipt not found' });

    res.json({ 
      success: true, 
      receipt,
      student: receipt.studentId,
      fee: receipt.feeId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Admin marks a fee as paid (Desk cash collection)
// @route   POST /api/admin/fees/:feeId/pay
router.post('/fees/:feeId/pay', async (req, res) => {
  const { paymentMethod } = req.body;
  const txnId = `TXN-DESK-${Math.floor(100000000 + Math.random() * 900000000)}`;

  try {
    if (mockStore.isMock) {
      const rawFee = await mockStore.findById('fees', req.params.feeId);
      if (!rawFee) return res.status(404).json({ success: false, message: 'Fee invoice not found' });

      const calculatedArray = await getCalculatedFees([rawFee]);
      const calculatedFee = calculatedArray[0];

      const fee = await mockStore.findByIdAndUpdate('fees', req.params.feeId, {
        status: 'paid',
        fine: calculatedFee.fine,
        paymentDate: new Date(),
        transactionId: txnId,
        paymentMethod: paymentMethod || 'Admission Desk Cash'
      });
      
      const receipt = await mockStore.create('receipts', {
        feeId: req.params.feeId,
        studentId: fee.studentId,
        receiptNumber: `REC-${Date.now()}`,
        amountPaid: calculatedFee.totalAmount,
        paymentMethod: paymentMethod || 'Admission Desk Cash',
        paymentDate: new Date(),
        transactionId: txnId
      });

      return res.json({ success: true, message: 'Fee marked as paid successfully!', data: fee, receipt });
    }

    const fee = await Fee.findById(req.params.feeId);
    if (!fee) return res.status(404).json({ success: false, message: 'Fee invoice not found' });

    const calculatedArray = await getCalculatedFees([fee]);
    const calculatedFee = calculatedArray[0];

    fee.status = 'paid';
    fee.fine = calculatedFee.fine;
    fee.paymentDate = new Date();
    fee.transactionId = txnId;
    fee.paymentMethod = paymentMethod || 'Admission Desk Cash';
    await fee.save();

    const receipt = await Receipt.create({
      feeId: fee._id,
      studentId: fee.studentId,
      receiptNumber: `REC-${Date.now()}`,
      amountPaid: calculatedFee.totalAmount,
      paymentMethod: paymentMethod || 'Admission Desk Cash',
      paymentDate: new Date(),
      transactionId: txnId
    });

    res.json({ success: true, message: 'Fee marked as paid successfully!', data: fee, receipt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// ═══════════════════════════════════════════════════
// FEE STRUCTURE MANAGEMENT ROUTES
// ═══════════════════════════════════════════════════

// GET all fee structures (with optional filters)
router.get('/fee-structures', async (req, res) => {
  try {
    const { className, year, active } = req.query;
    const filter = {};
    if (className) filter.class = className;
    if (year) filter.academicYear = year;
    if (active !== undefined) filter.isActive = active === 'true';
    const structures = await FeeStructure.find(filter).sort({ class: 1 });
    res.json({ success: true, data: structures });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create a new fee structure
router.post('/fee-structures', async (req, res) => {
  try {
    const structure = await FeeStructure.create(req.body);
    res.status(201).json({ success: true, data: structure });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'A fee structure for this class and academic year already exists.' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update a fee structure
router.put('/fee-structures/:id', async (req, res) => {
  try {
    const structure = await FeeStructure.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!structure) return res.status(404).json({ success: false, message: 'Fee structure not found' });
    res.json({ success: true, data: structure });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'A fee structure for this class and academic year already exists.' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE a fee structure
router.delete('/fee-structures/:id', async (req, res) => {
  try {
    const structure = await FeeStructure.findByIdAndDelete(req.params.id);
    if (!structure) return res.status(404).json({ success: false, message: 'Fee structure not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT toggle active status
router.put('/fee-structures/:id/toggle', async (req, res) => {
  try {
    const structure = await FeeStructure.findById(req.params.id);
    if (!structure) return res.status(404).json({ success: false, message: 'Fee structure not found' });
    structure.isActive = !structure.isActive;
    await structure.save();
    res.json({ success: true, data: structure });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════
// FINE RULES MANAGEMENT ROUTES
// ═══════════════════════════════════════════════════

// GET all fine rules
router.get('/fine-rules', async (req, res) => {
  try {
    let rules = [];
    if (mockStore.isMock) {
      rules = await mockStore.find('fineRules');
    } else {
      rules = await FineRule.find().sort({ minDays: 1 });
    }
    res.json({ success: true, data: rules });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create a fine rule
router.post('/fine-rules', async (req, res) => {
  try {
    const { minDays, maxDays, fineAmount } = req.body;
    let rule;
    if (mockStore.isMock) {
      rule = await mockStore.create('fineRules', { minDays: Number(minDays), maxDays: Number(maxDays), fineAmount: Number(fineAmount) });
    } else {
      rule = await FineRule.create({ minDays, maxDays, fineAmount });
    }
    res.status(201).json({ success: true, data: rule });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update a fine rule
router.put('/fine-rules/:id', async (req, res) => {
  try {
    const { minDays, maxDays, fineAmount } = req.body;
    let rule;
    if (mockStore.isMock) {
      rule = await mockStore.findByIdAndUpdate('fineRules', req.params.id, { minDays: Number(minDays), maxDays: Number(maxDays), fineAmount: Number(fineAmount) });
    } else {
      rule = await FineRule.findByIdAndUpdate(req.params.id, { minDays, maxDays, fineAmount }, { new: true, runValidators: true });
    }
    if (!rule) return res.status(404).json({ success: false, message: 'Fine rule not found' });
    res.json({ success: true, data: rule });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE a fine rule
router.delete('/fine-rules/:id', async (req, res) => {
  try {
    let rule;
    if (mockStore.isMock) {
      rule = await mockStore.findByIdAndDelete('fineRules', req.params.id);
    } else {
      rule = await FineRule.findByIdAndDelete(req.params.id);
    }
    if (!rule) return res.status(404).json({ success: false, message: 'Fine rule not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ═══════════════════════════════════════════════════
// JOB POSTING ROUTES
// ═══════════════════════════════════════════════════

// POST - Create a new job posting
router.post('/jobs', async (req, res) => {
  const { title, description, department, position, salary, qualifications, experience, responsibilities, benefits, location, applicationDeadline } = req.body;
  try {
    // Validate required fields
    if (!title || !description || !department || !position || !salary || !qualifications || !experience || !responsibilities || !applicationDeadline) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    if (mockStore.isMock) {
      const job = await mockStore.create('jobs', {
        title,
        description,
        department,
        position,
        salary,
        qualifications,
        experience,
        responsibilities,
        benefits: benefits || '',
        location: location || 'On-site',
        applicationDeadline: new Date(applicationDeadline),
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return res.status(201).json({ success: true, message: 'Job posting created successfully!', data: job });
    }

    const job = await Job.create({
      title,
      description,
      department,
      position,
      salary,
      qualifications,
      experience,
      responsibilities,
      benefits: benefits || '',
      location: location || 'On-site',
      applicationDeadline,
      status: 'open'
    });

    res.status(201).json({ success: true, message: 'Job posting created successfully!', data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Retrieve all job postings
router.get('/jobs', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const jobs = await mockStore.find('jobs', {});
      return res.json({ success: true, data: jobs });
    }

    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Retrieve a specific job posting by ID
router.get('/jobs/:id', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const job = await mockStore.findById('jobs', req.params.id);
      if (!job) return res.status(404).json({ success: false, message: 'Job posting not found' });
      return res.json({ success: true, data: job });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job posting not found' });
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Update a job posting
router.put('/jobs/:id', async (req, res) => {
  const { title, description, department, position, salary, qualifications, experience, responsibilities, benefits, location, applicationDeadline, status } = req.body;
  try {
    const updateData = {
      title,
      description,
      department,
      position,
      salary,
      qualifications,
      experience,
      responsibilities,
      benefits,
      location,
      applicationDeadline,
      status,
      updatedAt: new Date()
    };

    if (mockStore.isMock) {
      const job = await mockStore.findByIdAndUpdate('jobs', req.params.id, updateData);
      if (!job) return res.status(404).json({ success: false, message: 'Job posting not found' });
      return res.json({ success: true, message: 'Job posting updated successfully!', data: job });
    }

    const job = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ success: false, message: 'Job posting not found' });
    res.json({ success: true, message: 'Job posting updated successfully!', data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE - Remove a job posting
router.delete('/jobs/:id', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const job = await mockStore.findByIdAndDelete('jobs', req.params.id);
      if (!job) return res.status(404).json({ success: false, message: 'Job posting not found' });
      return res.json({ success: true, message: 'Job posting deleted successfully!' });
    }

    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job posting not found' });
    res.json({ success: true, message: 'Job posting deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ═══════════════════════════════════════════════════
// COURSE ROUTES
// ═══════════════════════════════════════════════════

// Create a course (supports multipart form with optional image upload OR direct JSON)
router.post('/courses', handleCourseUpload, async (req, res) => {
  try {
    const { title, description, duration, price, milestones, schedule, category, color, order } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, message: 'Course title is required' });
    }

    const cleanTitle = String(title).trim();
    const cleanDesc = description && String(description).trim() 
      ? String(description).trim() 
      : `${cleanTitle} comprehensive technical training curriculum and project practice.`;

    let parsedMilestones = [];
    if (milestones) {
      try {
        parsedMilestones = Array.isArray(milestones) ? milestones : JSON.parse(milestones);
      } catch {
        parsedMilestones = String(milestones).split('\n').flatMap(m => m.split(',')).map(m => m.trim()).filter(Boolean);
      }
    }

    let parsedSchedule = [];
    if (schedule) {
      try {
        parsedSchedule = Array.isArray(schedule) ? schedule : JSON.parse(schedule);
      } catch {
        parsedSchedule = [];
      }
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : (req.body.imageUrl || '');

    const payload = {
      title: cleanTitle,
      description: cleanDesc,
      duration: duration || '1 month - 6 months',
      price: price !== undefined && price !== '' ? Number(price) : 0,
      milestones: parsedMilestones,
      schedule: parsedSchedule,
      category: category || 'development',
      color: color || 'brandMint',
      order: order !== undefined && order !== '' ? Number(order) : 0,
      imageUrl,
      isActive: true,
      isPublished: true,
      totalLessons: 0,
      totalModules: 0,
      totalEnrollments: 0
    };

    if (mockStore.isMock) {
      const course = await mockStore.create('courses', { ...payload, createdAt: new Date(), updatedAt: new Date() });
      return res.status(201).json({ success: true, message: 'Course created successfully!', data: course });
    }
    const course = await Course.create(payload);
    res.status(201).json({ success: true, message: 'Course created successfully!', data: course });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create course' });
  }
});

// Update an existing course
router.put('/courses/:id', handleCourseUpload, async (req, res) => {
  try {
    const { title, description, duration, price, milestones, schedule, category, color, order, isActive, isPublished } = req.body;
    const updates = {};

    if (title !== undefined) updates.title = String(title).trim();
    if (description !== undefined) updates.description = String(description).trim();
    if (duration !== undefined) updates.duration = duration;
    if (price !== undefined && price !== '') updates.price = Number(price);
    if (category !== undefined) updates.category = category;
    if (color !== undefined) updates.color = color;
    if (order !== undefined && order !== '') updates.order = Number(order);
    if (isActive !== undefined) updates.isActive = Boolean(isActive);
    if (isPublished !== undefined) updates.isPublished = Boolean(isPublished);
    if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;

    if (milestones !== undefined) {
      try {
        updates.milestones = Array.isArray(milestones) ? milestones : JSON.parse(milestones);
      } catch {
        updates.milestones = String(milestones).split('\n').map(m => m.trim()).filter(Boolean);
      }
    }

    if (schedule !== undefined) {
      try {
        updates.schedule = Array.isArray(schedule) ? schedule : JSON.parse(schedule);
      } catch {
        updates.schedule = [];
      }
    }

    if (mockStore.isMock) {
      const course = await mockStore.findByIdAndUpdate('courses', req.params.id, { ...updates, updatedAt: new Date() });
      if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
      return res.json({ success: true, message: 'Course updated successfully!', data: course });
    }

    const course = await Course.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, message: 'Course updated successfully!', data: course });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update course' });
  }
});

// Get all courses
router.get('/courses', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const list = await mockStore.find('courses');
      const safeList = (list || []).map(c => ({
        ...c,
        isActive: c.isActive !== false,
        isPublished: c.isPublished !== false
      })).sort((a, b) => (a.order || 0) - (b.order || 0));
      return res.json({ success: true, count: safeList.length, data: safeList });
    }
    const list = await Course.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a course
router.delete('/courses/:id', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const course = await mockStore.findByIdAndDelete('courses', req.params.id);
      if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
      return res.json({ success: true, message: 'Course deleted' });
    }
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==============================
// MODULE MANAGEMENT
// ==============================
// Get modules for a course
router.get('/courses/:courseId/modules', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const list = await mockStore.find('modules', { course: req.params.courseId });
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      return res.json({ success: true, count: list.length, data: list });
    }
    const list = await Module.find({ course: req.params.courseId }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a module
router.post('/courses/:courseId/modules', async (req, res) => {
  try {
    const { title, description, order, attachments } = req.body;
    const payload = {
      course: req.params.courseId,
      title,
      description: description || '',
      order: order ? Number(order) : 0,
      isPublished: true,
      attachments: attachments || []
    };
    if (mockStore.isMock) {
      const module = await mockStore.create('modules', { ...payload, createdAt: new Date() });
      return res.status(201).json({ success: true, message: 'Module created!', data: module });
    }
    const module = await Module.create(payload);
    res.status(201).json({ success: true, message: 'Module created!', data: module });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a module
router.put('/modules/:id', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const module = await mockStore.findByIdAndUpdate('modules', req.params.id, req.body);
      if (!module) return res.status(404).json({ success: false, message: 'Module not found' });
      return res.json({ success: true, message: 'Module updated!', data: module });
    }
    const module = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!module) return res.status(404).json({ success: false, message: 'Module not found' });
    res.json({ success: true, message: 'Module updated!', data: module });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a module
router.delete('/modules/:id', async (req, res) => {
  try {
    if (mockStore.isMock) {
      await mockStore.findByIdAndDelete('modules', req.params.id);
      return res.json({ success: true, message: 'Module deleted' });
    }
    await Module.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Module deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==============================
// LESSON MANAGEMENT
// ==============================
// Get lessons for a module
router.get('/modules/:moduleId/lessons', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const list = await mockStore.find('lessons', { module: req.params.moduleId });
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      return res.json({ success: true, count: list.length, data: list });
    }
    const list = await Lesson.find({ module: req.params.moduleId }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle lesson publish status
router.patch('/lessons/:id/publish', async (req, res) => {
  try {
    const { isPublished } = req.body;
    if (mockStore.isMock) {
      const lesson = await mockStore.findByIdAndUpdate('lessons', req.params.id, { isPublished });
      if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
      return res.json({ success: true, message: `Lesson ${isPublished ? 'published' : 'unpublished'}`, data: lesson });
    }
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, { isPublished }, { new: true });
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
    res.json({ success: true, message: `Lesson ${isPublished ? 'published' : 'unpublished'}`, data: lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle module publish status
router.patch('/modules/:id/publish', async (req, res) => {
  try {
    const { isPublished } = req.body;
    if (mockStore.isMock) {
      const mod = await mockStore.findByIdAndUpdate('modules', req.params.id, { isPublished });
      if (!mod) return res.status(404).json({ success: false, message: 'Module not found' });
      return res.json({ success: true, message: `Module ${isPublished ? 'published' : 'unpublished'}`, data: mod });
    }
    const mod = await Module.findByIdAndUpdate(req.params.id, { isPublished }, { new: true });
    if (!mod) return res.status(404).json({ success: false, message: 'Module not found' });
    res.json({ success: true, message: `Module ${isPublished ? 'published' : 'unpublished'}`, data: mod });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle course publish status
router.patch('/courses/:id/publish', async (req, res) => {
  try {
    const { isPublished } = req.body;
    if (mockStore.isMock) {
      const course = await mockStore.findByIdAndUpdate('courses', req.params.id, { isPublished });
      if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
      return res.json({ success: true, message: `Course ${isPublished ? 'published' : 'unpublished'}`, data: course });
    }
    const course = await Course.findByIdAndUpdate(req.params.id, { isPublished }, { new: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, message: `Course ${isPublished ? 'published' : 'unpublished'}`, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a lesson with video upload
router.post('/modules/:moduleId/lessons', uploadVideo.single('videoFile'), async (req, res) => {
  try {
    const { title, description, content, videoUrl, videoDuration, order, isPublished, attachments } = req.body;
    
    // Parse attachments if stringified
    let attachmentsData = [];
    if (attachments) {
      try {
        attachmentsData = typeof attachments === 'string' ? JSON.parse(attachments) : attachments;
      } catch (e) {
        console.error('Error parsing attachments in create lesson:', e);
      }
    }

    // Get module to get course id
    let module;
    if (mockStore.isMock) {
      module = await mockStore.findById('modules', req.params.moduleId);
    } else {
      module = await Module.findById(req.params.moduleId);
    }
    if (!module) return res.status(404).json({ success: false, message: 'Module not found' });
    let finalVideoUrl = videoUrl || '';
    if (req.file) {
      if (CLOUDINARY_ENABLED) {
        try {
          const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'video',
            folder: 'kindergarten_videos'
          });
          finalVideoUrl = uploadResult.secure_url;
          // Delete temporary file from local storage
          fs.unlinkSync(req.file.path);
        } catch (uploadError) {
          console.error('Cloudinary upload failed:', uploadError);
          // Fallback to local storage if Cloudinary upload fails
          finalVideoUrl = `/uploads/videos/${req.file.filename}`;
        }
      } else {
        finalVideoUrl = `/uploads/videos/${req.file.filename}`;
      }
    }
    const payload = {
      module: req.params.moduleId,
      course: module.course,
      title,
      description: description || '',
      content: content || '',
      videoUrl: finalVideoUrl,
      videoDuration: videoDuration ? Number(videoDuration) : 0,
      order: order ? Number(order) : 0,
      isPublished: isPublished !== undefined ? isPublished === 'true' : true,
      attachments: attachmentsData
    };

    if (mockStore.isMock) {
      const lesson = await mockStore.create('lessons', { ...payload, createdAt: new Date() });
      return res.status(201).json({ success: true, message: 'Lesson created!', data: lesson });
    }
    const lesson = await Lesson.create(payload);
    res.status(201).json({ success: true, message: 'Lesson created!', data: lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update a lesson
router.put('/lessons/:id', uploadVideo.single('videoFile'), async (req, res) => {
  try {
    const { title, description, content, videoUrl, videoDuration, order, isPublished, attachments } = req.body;
    
    let attachmentsData;
    if (attachments !== undefined) {
      try {
        attachmentsData = typeof attachments === 'string' ? JSON.parse(attachments) : attachments;
      } catch (e) {
        console.error('Error parsing attachments in update lesson:', e);
      }
    }

    let updateData = {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(content !== undefined && { content }),
      ...(videoDuration !== undefined && { videoDuration: Number(videoDuration) }),
      ...(order !== undefined && { order: Number(order) }),
      ...(isPublished !== undefined && { isPublished: isPublished === 'true' }),
      ...(attachmentsData !== undefined && { attachments: attachmentsData })
    };

    if (req.file) {
      if (CLOUDINARY_ENABLED) {
        try {
          const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'video',
            folder: 'kindergarten_videos'
          });
          updateData.videoUrl = uploadResult.secure_url;
          // Delete temporary file from local storage
          fs.unlinkSync(req.file.path);
        } catch (uploadError) {
          console.error('Cloudinary upload failed:', uploadError);
          // Fallback to local storage if Cloudinary upload fails
          updateData.videoUrl = `/uploads/videos/${req.file.filename}`;
        }
      } else {
        updateData.videoUrl = `/uploads/videos/${req.file.filename}`;
      }
    } else if (videoUrl) {
      updateData.videoUrl = videoUrl;
    }

    if (mockStore.isMock) {
      const lesson = await mockStore.findByIdAndUpdate('lessons', req.params.id, updateData);
      if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
      return res.json({ success: true, message: 'Lesson updated!', data: lesson });
    }
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
    res.json({ success: true, message: 'Lesson updated!', data: lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a lesson
// ==========================================
// CERTIFICATE MANAGEMENT ROUTES
// ==========================================

// Helper to generate unique certificate number
const generateCertificateNumber = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ATI-${month}-${day}-ST${rand}`;
};

// 1. Get all certificates
router.get('/certificates', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const certificates = await mockStore.find('certificates');
      return res.json({ success: true, data: certificates });
    }
    const certificates = await Certificate.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: certificates });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch certificates' });
  }
});

// 2. Get single certificate
router.get('/certificates/:id', async (req, res) => {
  try {
    if (mockStore.isMock) {
      const certificate = await mockStore.findById('certificates', req.params.id);
      if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });
      return res.json({ success: true, data: certificate });
    }
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) return res.status(404).json({ success: false, message: 'Certificate not found' });
    res.json({ success: true, data: certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Create certificate
router.post('/certificates', async (req, res) => {
  try {
    const {
      certificateNumber,
      studentName,
      internshipName,
      startDate,
      endDate,
      issueDate,
      description,
      companyName,
      companyAddress,
      companyPhone,
      companyEmail,
      companyWeb,
      partnerUniversity,
      signatoryTitle,
      status,
      studentId
    } = req.body;

    if (!studentName?.trim() || !internshipName?.trim() || !startDate?.trim() || !endDate?.trim() || !issueDate?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Student Name, Internship/Course Name, Start Date, End Date, and Issue Date are required.'
      });
    }

    const certNum = (certificateNumber?.trim() || generateCertificateNumber()).toUpperCase();

    // Check duplicate
    if (mockStore.isMock) {
      const existing = (await mockStore.find('certificates')).find(
        c => c.certificateNumber?.trim().toLowerCase() === certNum.toLowerCase()
      );
      if (existing) {
        return res.status(400).json({ success: false, message: `Certificate number "${certNum}" already exists.` });
      }
    } else {
      const existing = await Certificate.findOne({ certificateNumber: certNum });
      if (existing) {
        return res.status(400).json({ success: false, message: `Certificate number "${certNum}" already exists.` });
      }
    }

    // Generate QR Code data URL for the verification link
    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';
    const verifyUrl = `${protocol}://${host}/verify-certificate/${encodeURIComponent(certNum)}`;
    let qrCodeData = '';
    try {
      qrCodeData = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 140 });
    } catch (e) {
      console.warn('QR code generation warning:', e);
    }

    const certPayload = {
      certificateNumber: certNum,
      studentName: studentName.trim(),
      internshipName: internshipName.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      issueDate: issueDate.trim(),
      description: description?.trim() || 'This certification is awarded in recognition of the successful completion of the curriculum and mastery of the course content.',
      companyName: companyName?.trim() || 'APPLE TREE INFOTECH',
      companyAddress: companyAddress?.trim() || 'C-60 3rd Floor R.K. Tower RDC, Raj Nagar, Ghaziabad, 201001',
      companyPhone: companyPhone?.trim() || '7503962162, 9355343070',
      companyEmail: companyEmail?.trim() || 'info@appletreeinfotech.in',
      companyWeb: companyWeb?.trim() || 'appletreeinfotech.in',
      partnerUniversity: partnerUniversity?.trim() || 'KALINGA UNIVERSITY',
      signatoryTitle: signatoryTitle?.trim() || 'Partner',
      status: status || 'valid',
      qrCodeData,
      studentId: studentId || null
    };

    let newCertificate = null;
    if (mockStore.isMock) {
      newCertificate = await mockStore.create('certificates', certPayload);
    } else {
      newCertificate = await Certificate.create(certPayload);
    }

    res.status(201).json({
      success: true,
      message: 'Internship Certificate generated successfully!',
      data: newCertificate
    });
  } catch (error) {
    console.error('Error creating certificate:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create certificate' });
  }
});

// 4. Update certificate
router.put('/certificates/:id', async (req, res) => {
  try {
    const {
      certificateNumber,
      studentName,
      internshipName,
      startDate,
      endDate,
      issueDate,
      description,
      companyName,
      companyAddress,
      companyPhone,
      companyEmail,
      companyWeb,
      partnerUniversity,
      signatoryTitle,
      status
    } = req.body;

    const updateData = {};
    if (certificateNumber) updateData.certificateNumber = certificateNumber.trim().toUpperCase();
    if (studentName) updateData.studentName = studentName.trim();
    if (internshipName) updateData.internshipName = internshipName.trim();
    if (startDate) updateData.startDate = startDate.trim();
    if (endDate) updateData.endDate = endDate.trim();
    if (issueDate) updateData.issueDate = issueDate.trim();
    if (description !== undefined) updateData.description = description;
    if (companyName) updateData.companyName = companyName.trim();
    if (companyAddress) updateData.companyAddress = companyAddress.trim();
    if (companyPhone) updateData.companyPhone = companyPhone.trim();
    if (companyEmail) updateData.companyEmail = companyEmail.trim();
    if (companyWeb) updateData.companyWeb = companyWeb.trim();
    if (partnerUniversity) updateData.partnerUniversity = partnerUniversity.trim();
    if (signatoryTitle) updateData.signatoryTitle = signatoryTitle.trim();
    if (status) updateData.status = status;

    if (updateData.certificateNumber) {
      const host = req.get('host') || 'localhost:5000';
      const protocol = req.protocol || 'http';
      const verifyUrl = `${protocol}://${host}/verify-certificate/${encodeURIComponent(updateData.certificateNumber)}`;
      try {
        updateData.qrCodeData = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 140 });
      } catch (e) {
        console.warn('QR code update error:', e);
      }
    }

    if (mockStore.isMock) {
      const updated = await mockStore.findByIdAndUpdate('certificates', req.params.id, updateData);
      if (!updated) return res.status(404).json({ success: false, message: 'Certificate not found' });
      return res.json({ success: true, message: 'Certificate updated successfully', data: updated });
    }

    const updated = await Certificate.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Certificate not found' });
    res.json({ success: true, message: 'Certificate updated successfully', data: updated });
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update certificate' });
  }
});

// 5. Delete certificate
router.delete('/certificates/:id', async (req, res) => {
  try {
    if (mockStore.isMock) {
      await mockStore.findByIdAndDelete('certificates', req.params.id);
      return res.json({ success: true, message: 'Certificate deleted successfully' });
    }
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete certificate' });
  }
});

export default router;
