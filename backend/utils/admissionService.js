// Shared admission-creation logic.
// Used by both the admin "New Admission Entry" route and the admission-payment
// verify flow, so a verified payment automatically registers the student.
//
// Mirrors the behavior of the existing /api/admin/admissions/create handler:
// creates (or reuses) a parent User + Parent profile, the Student record, an
// approved Admission record, the admission-fee Fee + Receipt, and monthly
// tuition invoices (month 1 marked paid).

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Parent from '../models/Parent.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import Admission from '../models/Admission.js';
import Fee from '../models/Fee.js';
import Receipt from '../models/Receipt.js';
import Course from '../models/Course.js';
import mockStore from '../config/mockStore.js';

const VALID_CLASSES = [
  'Pre-Nursery', 'Nursery', 'Junior KG', 'Senior KG', 'Preschool',
  '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th',
  'Java Development', 'MERN Developer', 'Python Developer', 'Frontend Developer'
];

function genAppNo() {
  return `PRN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}
function genStudentId() {
  return `STD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}
function genTxn(prefix) {
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
}
function escapeRegExp(string) {
  return String(string || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Resolve the selected course/class into a valid Student.class enum value.
function normalizeClass(value) {
  const v = String(value || '').trim();
  if (!v) return 'Nursery';
  if (VALID_CLASSES.includes(v)) return v;
  if (/^\d+$/.test(v) && VALID_CLASSES.includes(`${v}th`)) return `${v}th`;
  return v;
}

function normalizeGender(value) {
  const g = String(value || '').trim().toLowerCase();
  if (g === 'female') return 'Female';
  if (g === 'other') return 'Other';
  return 'Male';
}

function normalizeDob(value) {
  if (!value) return new Date('2020-01-01');
  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date('2020-01-01') : d;
}

function getInstallmentCount(paymentPlan) {
  if (paymentPlan === '1month' || paymentPlan === '1months' || paymentPlan === '1' || paymentPlan === 'full') return 1;
  if (paymentPlan === '2months' || paymentPlan === '2') return 2;
  if (paymentPlan === '3months' || paymentPlan === '3') return 3;
  if (paymentPlan === '4months' || paymentPlan === '4') return 4;
  if (paymentPlan === '5months' || paymentPlan === '5') return 5;
  if (paymentPlan === '6months' || paymentPlan === '6') return 6;
  if (paymentPlan === '10months' || paymentPlan === '10') return 10;
  if (paymentPlan === 'monthly' || paymentPlan === '12months' || paymentPlan === '12' || paymentPlan === 'installments') return 12;
  const parsed = parseInt(paymentPlan, 10);
  if (!isNaN(parsed) && parsed > 0) return parsed;
  return 1;
}

/**
 * Create a full admission (parent + student + admission record + fees) from a
 * verified payment. Works in both mock and MongoDB modes.
 */
export async function createAdmissionFromPayment({
  studentDetails = {},
  parentDetails = {},
  paymentMethod = 'Cash',
  admissionFee = 0,
  tuitionFee,
  courseFee,
  password,
  photo,
  paymentPlan = '1month'
}) {
  const isMock = mockStore.isMock;
  const appNo = genAppNo();
  const studentPublicId = genStudentId();

  const buildPhotoData = (studentId, file) => {
    if (!file) return { photoData: undefined, photoPath: `/api/admin/students/photo/${studentId}` };
    return {
      photoData: {
        data: isMock ? file.buffer.toString('base64') : file.buffer,
        contentType: file.mimetype,
        filename: file.originalname
      },
      photoPath: `/api/admin/students/photo/${studentId}`
    };
  };

  const fatherName = parentDetails.fatherName || parentDetails.motherName || 'Parent';
  const motherName = parentDetails.motherName || parentDetails.fatherName || 'Parent';
  const parentEmail = String(parentDetails.email || '').trim().toLowerCase();
  const parentPhone = parentDetails.phone || '';
  const parentAddress = parentDetails.address || '';

  const normalizedStudent = {
    name: studentDetails.name || 'Student',
    dateOfBirth: normalizeDob(studentDetails.dateOfBirth),
    gender: normalizeGender(studentDetails.gender),
    class: normalizeClass(studentDetails.class)
  };
  const normalizedParent = {
    fatherName,
    motherName,
    email: parentEmail,
    phone: parentPhone,
    address: parentAddress
  };

  let receipt = null;

  if (isMock) {
    // ---- Parent user + profile ----
    let parentUser = await mockStore.findOne('users', { email: normalizedParent.email });
    let parentProfile;
    if (!parentUser) {
      const salt = bcrypt.genSaltSync(10);
      const allCourses = await mockStore.find('courses') || [];
      const isCourseStudent = allCourses.some(c => String(c.title).toLowerCase() === String(normalizedStudent.class).toLowerCase());
      const resolvedRole = isCourseStudent ? 'user' : 'parent';

      parentUser = await mockStore.create('users', {
        name: normalizedParent.fatherName || normalizedParent.motherName,
        email: normalizedParent.email,
        password: bcrypt.hashSync(password || 'parent123', salt),
        role: resolvedRole
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
    const studentDbId = 'std_' + Math.random().toString(36).substr(2, 9);
    const studentPhoto = buildPhotoData(studentDbId, photo);

    const newStudent = await mockStore.create('students', {
      _id: studentDbId,
      name: normalizedStudent.name,
      studentId: studentPublicId,
      dateOfBirth: normalizedStudent.dateOfBirth,
      gender: normalizedStudent.gender,
      class: normalizedStudent.class,
      parentId: parentProfile._id,
      parentDetails: normalizedParent,
      teacherId,
      photo: studentPhoto.photoPath,
      photoData: studentPhoto.photoData,
      attendance: [],
      progressReports: [],
      activities: []
    });

    parentProfile.children.push(newStudent._id);
    await mockStore.findByIdAndUpdate('parents', parentProfile._id, { children: parentProfile.children });

    await mockStore.create('admissions', {
      applicationNumber: appNo,
      studentDetails: normalizedStudent,
      parentDetails: normalizedParent,
      documents: {},
      documentData: {},
      status: 'approved',
      remarks: `Admission via ${paymentMethod} payment`,
      submissionDate: new Date()
    });

    const admissionFeeVal = Number(admissionFee) || 0;
    if (admissionFeeVal > 0) {
      const txnId = genTxn('TXN-ADM');
      const fee = await mockStore.create('fees', {
        studentId: newStudent._id,
        amount: admissionFeeVal,
        term: 'Admission Fee',
        dueDate: new Date(),
        status: 'paid',
        paymentDate: new Date(),
        transactionId: txnId,
        paymentMethod
      });
      receipt = await mockStore.create('receipts', {
        feeId: fee._id,
        studentId: newStudent._id,
        receiptNumber: `REC-ADM-${Date.now()}`,
        amountPaid: admissionFeeVal,
        paymentMethod,
        paymentDate: new Date(),
        transactionId: txnId
      });
    }

    const courseTitles = String(normalizedStudent.class || '')
      .split(/\s*\+\s*|\s*,\s*/)
      .map(s => s.trim())
      .filter(Boolean);

    const allCourses = await mockStore.find('courses') || [];
    let calculatedTotal = 0;

    for (const cTitle of courseTitles) {
      const match = allCourses.find(c => String(c.title).toLowerCase() === cTitle.toLowerCase());
      if (match) {
        calculatedTotal += Number(match.price) || 15000;
        await mockStore.create('enrollments', {
          user: String(parentUser._id),
          course: String(match._id),
          paymentStatus: 'paid',
          status: 'active',
          enrolledAt: new Date()
        });
      }
    }

    let totalAmount = Number(tuitionFee || courseFee) || 0;
    if (!totalAmount) {
      totalAmount = calculatedTotal || 15000;
    }

    const remainingTuition = Math.max(0, totalAmount - admissionFeeVal);
    const count = getInstallmentCount(paymentPlan);

    if (remainingTuition > 0) {
      if (paymentPlan === 'full' && admissionFeeVal === 0) {
        await mockStore.create('fees', {
          studentId: newStudent._id,
          amount: remainingTuition,
          term: 'Full Course Tuition Fee',
          dueDate: new Date(),
          status: 'paid',
          paymentDate: new Date(),
          transactionId: genTxn('TXN-INIT'),
          paymentMethod
        });
      } else {
        const installmentAmount = Math.round(remainingTuition / count);
        const lastInstallmentAmount = remainingTuition - (installmentAmount * (count - 1));

        for (let i = 1; i <= count; i++) {
          const dueDate = new Date();
          dueDate.setMonth(dueDate.getMonth() + i); // Charge starting from NEXT month
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

    return { applicationNumber: appNo, studentId: studentPublicId, studentDbId, receipt };
  }

  // ---- MongoDB ----
  let parentUser = await User.findOne({ email: normalizedParent.email });
  let parent;
  if (!parentUser) {
    const isCourseStudent = await Course.findOne({ title: { $regex: new RegExp(`^${escapeRegExp(normalizedStudent.class)}$`, 'i') } });
    const resolvedRole = isCourseStudent ? 'user' : 'parent';

    parentUser = await User.create({
      name: normalizedParent.fatherName || normalizedParent.motherName,
      email: normalizedParent.email,
      password: password || 'parent123',
      role: resolvedRole
    });
    parent = await Parent.create({
      userId: parentUser._id,
      name: parentUser.name,
      email: parentUser.email,
      phone: normalizedParent.phone,
      address: normalizedParent.address,
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
    name: normalizedStudent.name,
    studentId: studentPublicId,
    dateOfBirth: normalizedStudent.dateOfBirth,
    gender: normalizedStudent.gender,
    class: normalizedStudent.class,
    parentId: parent._id,
    teacherId: firstTeacher ? firstTeacher._id : null
  });

  const mongoPhoto = buildPhotoData(student._id, photo);
  if (mongoPhoto.photoData) {
    student.photoData = mongoPhoto.photoData;
    student.photo = mongoPhoto.photoPath;
    await student.save();
  } else {
    student.photo = mongoPhoto.photoPath;
    await student.save();
  }

  parent.children.push(student._id);
  await parent.save();

  await Admission.create({
    applicationNumber: appNo,
    studentDetails: normalizedStudent,
    parentDetails: normalizedParent,
    documents: {},
    documentData: {},
    status: 'approved',
    remarks: `Admission via ${paymentMethod} payment`
  });

  const admissionFeeVal = Number(admissionFee) || 0;
  if (admissionFeeVal > 0) {
    const txnId = genTxn('TXN-ADM');
    const fee = await Fee.create({
      studentId: student._id,
      amount: admissionFeeVal,
      term: 'Admission Fee',
      dueDate: new Date(),
      status: 'paid',
      paymentDate: new Date(),
      transactionId: txnId,
      paymentMethod
    });
    receipt = await Receipt.create({
      feeId: fee._id,
      studentId: student._id,
      receiptNumber: `REC-ADM-${Date.now()}`,
      amountPaid: admissionFeeVal,
      paymentMethod,
      paymentDate: new Date(),
      transactionId: txnId
    });
  }

  const courseTitles = String(normalizedStudent.class || '')
    .split(/\s*\+\s*|\s*,\s*/)
    .map(s => s.trim())
    .filter(Boolean);

  let calculatedTotal = 0;
  const CourseEnrollment = (await import('../models/CourseEnrollment.js')).default;

  for (const cTitle of courseTitles) {
    const match = await Course.findOne({ title: { $regex: new RegExp(`^${escapeRegExp(cTitle)}$`, 'i') } });
    if (match) {
      calculatedTotal += Number(match.price) || 15000;
      await CourseEnrollment.findOneAndUpdate(
        { user: parentUser._id, course: match._id },
        { paymentStatus: 'paid', status: 'active', enrolledAt: new Date() },
        { upsert: true, new: true }
      );
      match.totalEnrollments = (match.totalEnrollments || 0) + 1;
      await match.save();
    }
  }

  let totalAmount = Number(tuitionFee || courseFee) || 0;
  if (!totalAmount) {
    totalAmount = calculatedTotal || 15000;
  }

  const remainingTuition = Math.max(0, totalAmount - admissionFeeVal);
  const count = getInstallmentCount(paymentPlan);

  if (remainingTuition > 0) {
    if (paymentPlan === 'full' && admissionFeeVal === 0) {
      await Fee.create({
        studentId: student._id,
        amount: remainingTuition,
        term: 'Full Course Tuition Fee',
        dueDate: new Date(),
        status: 'paid',
        paymentDate: new Date(),
        transactionId: genTxn('TXN-INIT'),
        paymentMethod
      });
    } else {
      const installmentAmount = Math.round(remainingTuition / count);
      const lastInstallmentAmount = remainingTuition - (installmentAmount * (count - 1));

      for (let i = 1; i <= count; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i); // Charge starting from NEXT month
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
  }

  return { applicationNumber: appNo, studentId: studentPublicId, studentDbId: String(student._id), receipt };
}
