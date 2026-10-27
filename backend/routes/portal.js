import express from 'express';
import Student from '../models/Student.js';
import Parent from '../models/Parent.js';
import Teacher from '../models/Teacher.js';
import Fee from '../models/Fee.js';
import Receipt from '../models/Receipt.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
import mockStore from '../config/mockStore.js';
import { getCalculatedFees } from '../utils/feeCalculator.js';

const router = express.Router();

// ==========================================
// PARENT PORTAL ENDPOINTS
// ==========================================

// @desc    Get parent's children details
// @route   GET /api/portal/parent/children
// @access  Private (Parent)
router.get('/parent/children', protect, authorize('parent'), async (req, res) => {
  try {
    if (mockStore.isMock) {
      const parent = await mockStore.findOne('parents', { userId: req.user._id });
      if (!parent) return res.status(404).json({ success: false, message: 'Parent profile not found' });
      const children = await mockStore.find('students', { parentId: parent._id });
      return res.json({ success: true, children });
    }

    const parent = await Parent.findOne({ userId: req.user._id });
    if (!parent) return res.status(404).json({ success: false, message: 'Parent profile not found' });
    const children = await Student.find({ parentId: parent._id }).populate('teacherId');
    res.json({ success: true, children });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get fees for a student
// @route   GET /api/portal/parent/child/:childId/fees
// @access  Private (Parent)
router.get('/parent/child/:childId/fees', protect, authorize('parent'), async (req, res) => {
  try {
    if (mockStore.isMock) {
      const fees = await mockStore.find('fees', { studentId: req.params.childId });
      const calculated = await getCalculatedFees(fees);
      return res.json({ success: true, fees: calculated });
    }
    const fees = await Fee.find({ studentId: req.params.childId }).sort({ dueDate: 1 });
    const calculated = await getCalculatedFees(fees);
    res.json({ success: true, fees: calculated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Simulate paying a fee invoice
// @route   POST /api/portal/parent/child/:childId/pay-fee/:feeId
// @access  Private (Parent)
router.post('/parent/child/:childId/pay-fee/:feeId', protect, authorize('parent'), async (req, res) => {
  const { paymentMethod } = req.body;
  const txnId = `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;

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
        paymentMethod: paymentMethod || 'Online Wallet'
      });
      
      // Generate and save receipt in mock database
      const receipt = await mockStore.create('receipts', {
        feeId: req.params.feeId,
        studentId: req.params.childId,
        receiptNumber: `REC-${Date.now()}`,
        amountPaid: calculatedFee.totalAmount,
        paymentMethod: paymentMethod || 'Online Wallet',
        paymentDate: new Date(),
        transactionId: txnId
      });

      return res.json({ success: true, message: 'Fee paid successfully (Simulated)!', data: fee, receipt });
    }

    const fee = await Fee.findById(req.params.feeId);
    if (!fee) return res.status(404).json({ success: false, message: 'Fee invoice not found' });

    const calculatedArray = await getCalculatedFees([fee]);
    const calculatedFee = calculatedArray[0];

    fee.status = 'paid';
    fee.fine = calculatedFee.fine;
    fee.paymentDate = new Date();
    fee.transactionId = txnId;
    fee.paymentMethod = paymentMethod || 'Credit Card';
    await fee.save();

    // Generate and save Receipt document
    const receipt = await Receipt.create({
      feeId: fee._id,
      studentId: fee.studentId,
      receiptNumber: `REC-${Date.now()}`,
      amountPaid: calculatedFee.totalAmount,
      paymentMethod: paymentMethod || 'Credit Card',
      paymentDate: new Date(),
      transactionId: txnId
    });

    res.json({ success: true, message: 'Fee paid successfully (Simulated)!', data: fee, receipt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Pay a fee invoice in 3 installments (Simulated)
// @route   POST /api/portal/parent/child/:childId/pay-fee-installments/:feeId
// @access  Private (Parent)
router.post('/parent/child/:childId/pay-fee-installments/:feeId', protect, authorize('parent'), async (req, res) => {
  const { paymentMethod } = req.body;
  const txnId = `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;

  try {
    if (mockStore.isMock) {
      const rawFee = await mockStore.findById('fees', req.params.feeId);
      if (!rawFee) return res.status(404).json({ success: false, message: 'Fee invoice not found' });

      const originalAmount = rawFee.amount;
      const originalTerm = rawFee.term;
      const originalDueDate = new Date(rawFee.dueDate);

      // 1. Delete original fee record
      await mockStore.findByIdAndDelete('fees', req.params.feeId);

      // 2. Calculate installment amounts
      const installmentAmount = Math.round(originalAmount / 3);
      const lastInstallmentAmount = originalAmount - (installmentAmount * 2);

      // 3. Create 3 installments:
      // Installment 1 (Paid)
      const fee1 = await mockStore.create('fees', {
        studentId: req.params.childId,
        amount: installmentAmount,
        term: `${originalTerm} - Installment 1/3`,
        dueDate: originalDueDate,
        status: 'paid',
        paymentDate: new Date(),
        transactionId: txnId,
        paymentMethod: paymentMethod || 'Parent Portal Wallet'
      });

      // Generate Receipt for Installment 1
      await mockStore.create('receipts', {
        feeId: fee1._id,
        studentId: req.params.childId,
        receiptNumber: `REC-INST1-${Date.now()}`,
        amountPaid: installmentAmount,
        paymentMethod: paymentMethod || 'Parent Portal Wallet',
        paymentDate: new Date(),
        transactionId: txnId
      });

      // Installment 2 (Pending - due in 30 days)
      const dueDate2 = new Date(originalDueDate);
      dueDate2.setDate(dueDate2.getDate() + 30);
      await mockStore.create('fees', {
        studentId: req.params.childId,
        amount: installmentAmount,
        term: `${originalTerm} - Installment 2/3`,
        dueDate: dueDate2,
        status: 'pending',
        transactionId: '',
        paymentMethod: ''
      });

      // Installment 3 (Pending - due in 60 days)
      const dueDate3 = new Date(originalDueDate);
      dueDate3.setDate(dueDate3.getDate() + 60);
      await mockStore.create('fees', {
        studentId: req.params.childId,
        amount: lastInstallmentAmount,
        term: `${originalTerm} - Installment 3/3`,
        dueDate: dueDate3,
        status: 'pending',
        transactionId: '',
        paymentMethod: ''
      });

      return res.json({ success: true, message: 'Fee split into 3 installments. First installment paid successfully!' });
    }

    // MongoDB Mode
    const fee = await Fee.findById(req.params.feeId);
    if (!fee) return res.status(404).json({ success: false, message: 'Fee invoice not found' });

    const originalAmount = fee.amount;
    const originalTerm = fee.term;
    const originalDueDate = new Date(fee.dueDate);

    // 1. Delete original fee record
    await Fee.findByIdAndDelete(req.params.feeId);

    // 2. Calculate installment amounts
    const installmentAmount = Math.round(originalAmount / 3);
    const lastInstallmentAmount = originalAmount - (installmentAmount * 2);

    // 3. Create 3 installments:
    // Installment 1 (Paid)
    const fee1 = await Fee.create({
      studentId: req.params.childId,
      amount: installmentAmount,
      term: `${originalTerm} - Installment 1/3`,
      dueDate: originalDueDate,
      status: 'paid',
      paymentDate: new Date(),
      transactionId: txnId,
      paymentMethod: paymentMethod || 'Online Wallet'
    });

    // Generate Receipt for Installment 1
    await Receipt.create({
      feeId: fee1._id,
      studentId: req.params.childId,
      receiptNumber: `REC-INST1-${Date.now()}`,
      amountPaid: installmentAmount,
      paymentMethod: paymentMethod || 'Online Wallet',
      paymentDate: new Date(),
      transactionId: txnId
    });

    // Installment 2 (Pending - due in 30 days)
    const dueDate2 = new Date(originalDueDate);
    dueDate2.setDate(dueDate2.getDate() + 30);
    await Fee.create({
      studentId: req.params.childId,
      amount: installmentAmount,
      term: `${originalTerm} - Installment 2/3`,
      dueDate: dueDate2,
      status: 'pending'
    });

    // Installment 3 (Pending - due in 60 days)
    const dueDate3 = new Date(originalDueDate);
    dueDate3.setDate(dueDate3.getDate() + 60);
    await Fee.create({
      studentId: req.params.childId,
      amount: lastInstallmentAmount,
      term: `${originalTerm} - Installment 3/3`,
      dueDate: dueDate3,
      status: 'pending'
    });

    res.json({ success: true, message: 'Fee split into 3 installments. First installment paid successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get receipt for a paid fee
// @route   GET /api/portal/parent/receipt/:feeId
// @access  Private (Parent)
router.get('/parent/receipt/:feeId', protect, authorize('parent'), async (req, res) => {
  try {
    if (mockStore.isMock) {
      const receipt = await mockStore.findOne('receipts', { feeId: req.params.feeId });
      if (!receipt) return res.status(404).json({ success: false, message: 'Receipt not found' });
      const student = await mockStore.findById('students', receipt.studentId);
      const fee = await mockStore.findById('fees', receipt.feeId);
      return res.json({ 
        success: true, 
        receipt, 
        student: student ? { name: student.name, class: student.class } : null,
        fee: fee ? { term: fee.term } : null
      });
    }

    const receipt = await Receipt.findOne({ feeId: req.params.feeId })
      .populate('studentId', 'name class')
      .populate('feeId', 'term');
      
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


// ==========================================
// TEACHER PORTAL ENDPOINTS
// ==========================================

// @desc    Get teacher's assigned students
// @route   GET /api/portal/teacher/students
// @access  Private (Teacher)
router.get('/teacher/students', protect, authorize('teacher'), async (req, res) => {
  try {
    if (mockStore.isMock) {
      const teacher = await mockStore.findOne('teachers', { userId: req.user._id });
      if (!teacher) return res.status(404).json({ success: false, message: 'Teacher profile not found' });
      // In mock, get students taught by this teacher or matched by class
      const students = await mockStore.find('students', { teacherId: teacher._id });
      return res.json({ success: true, students });
    }

    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    
    // Find students whose class matches teacher's assigned classes or is assigned directly
    const students = await Student.find({
      $or: [
        { teacherId: teacher._id },
        { class: { $in: teacher.classesAssigned } }
      ]
    }).populate('parentId');
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Log student attendance
// @route   POST /api/portal/teacher/student/:studentId/attendance
// @access  Private (Teacher)
router.post('/teacher/student/:studentId/attendance', protect, authorize('teacher'), async (req, res) => {
  const { date, status } = req.body; // status: present, absent, late
  const targetDate = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  try {
    if (mockStore.isMock) {
      const student = await mockStore.findById('students', req.params.studentId);
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
      
      // Check if already logged
      const existingIdx = student.attendance.findIndex(att => att.date === targetDate);
      if (existingIdx !== -1) {
        student.attendance[existingIdx].status = status;
      } else {
        student.attendance.push({ date: targetDate, status });
      }
      await mockStore.findByIdAndUpdate('students', req.params.studentId, { attendance: student.attendance });
      return res.json({ success: true, message: 'Attendance updated successfully!', data: student });
    }

    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    // Check if attendance for this date is already logged
    const existingIndex = student.attendance.findIndex(
      (att) => att.date.toISOString().split('T')[0] === targetDate
    );

    if (existingIndex !== -1) {
      student.attendance[existingIndex].status = status;
    } else {
      student.attendance.push({ date: new Date(targetDate), status });
    }

    await student.save();
    res.json({ success: true, message: 'Attendance updated successfully!', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Submit student progress report
// @route   POST /api/portal/teacher/student/:studentId/progress
// @access  Private (Teacher)
router.post('/teacher/student/:studentId/progress', protect, authorize('teacher'), async (req, res) => {
  const { term, cognitive, social, creative, motorSkills, notes } = req.body;

  try {
    if (mockStore.isMock) {
      const student = await mockStore.findById('students', req.params.studentId);
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

      // Add or update progress report
      const existingIdx = student.progressReports.findIndex(rep => rep.term === term);
      const reportData = { term, cognitive, social, creative, motorSkills, notes };

      if (existingIdx !== -1) {
        student.progressReports[existingIdx] = reportData;
      } else {
        student.progressReports.push(reportData);
      }

      await mockStore.findByIdAndUpdate('students', req.params.studentId, { progressReports: student.progressReports });
      return res.json({ success: true, message: 'Progress report updated!', data: student });
    }

    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const existingIdx = student.progressReports.findIndex((rep) => rep.term === term);
    const reportData = { term, cognitive, social, creative, motorSkills, notes };

    if (existingIdx !== -1) {
      student.progressReports[existingIdx] = reportData;
    } else {
      student.progressReports.push(reportData);
    }

    await student.save();
    res.json({ success: true, message: 'Progress report updated!', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Log child daily activity update
// @route   POST /api/portal/teacher/student/:studentId/activity
// @access  Private (Teacher)
router.post('/teacher/student/:studentId/activity', protect, authorize('teacher'), async (req, res) => {
  const { title, description, category } = req.body; // category: art, food, nap, play, academic
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  try {
    if (mockStore.isMock) {
      const student = await mockStore.findById('students', req.params.studentId);
      if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

      const activity = {
        date: new Date().toISOString().split('T')[0],
        time,
        title,
        description,
        category
      };
      student.activities.unshift(activity); // Add to beginning
      await mockStore.findByIdAndUpdate('students', req.params.studentId, { activities: student.activities });
      return res.json({ success: true, message: 'Activity logged successfully!', data: student });
    }

    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const activity = {
      date: new Date(),
      time,
      title,
      description,
      category
    };

    student.activities.unshift(activity);
    await student.save();
    res.json({ success: true, message: 'Activity logged successfully!', data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ==========================================
// SHARED MESSAGING SYSTEM ENDPOINTS
// ==========================================

// @desc    Get chat contacts (teachers for parents, parents for teachers)
// @route   GET /api/portal/messages/contacts
// @access  Private
router.get('/messages/contacts', protect, async (req, res) => {
  try {
    if (mockStore.isMock) {
      if (req.user.role === 'parent') {
        const teachers = await mockStore.find('users', { role: 'teacher' });
        return res.json({ success: true, contacts: teachers });
      } else if (req.user.role === 'teacher') {
        const parents = await mockStore.find('users', { role: 'parent' });
        return res.json({ success: true, contacts: parents });
      } else {
        const users = await mockStore.find('users');
        return res.json({ success: true, contacts: users.filter(u => u._id !== req.user._id) });
      }
    }

    if (req.user.role === 'parent') {
      const teachers = await User.find({ role: 'teacher' }).select('name email profileImage');
      res.json({ success: true, contacts: teachers });
    } else if (req.user.role === 'teacher') {
      const parents = await User.find({ role: 'parent' }).select('name email profileImage');
      res.json({ success: true, contacts: parents });
    } else {
      const all = await User.find({ _id: { $ne: req.user._id } }).select('name email role profileImage');
      res.json({ success: true, contacts: all });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get chat history between current user and partner
// @route   GET /api/portal/messages/:partnerId
// @access  Private
router.get('/messages/:partnerId', protect, async (req, res) => {
  const myId = req.user._id.toString();
  const partnerId = req.params.partnerId;

  try {
    if (mockStore.isMock) {
      const allMsgs = await mockStore.find('messages');
      const filtered = allMsgs.filter(
        msg =>
          (msg.senderId.toString() === myId && msg.receiverId.toString() === partnerId) ||
          (msg.senderId.toString() === partnerId && msg.receiverId.toString() === myId)
      ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      // Mark partner's messages as read
      allMsgs.forEach(msg => {
        if (msg.senderId.toString() === partnerId && msg.receiverId.toString() === myId) {
          msg.isRead = true;
        }
      });

      return res.json({ success: true, data: filtered });
    }

    const chatHistory = await Message.find({
      $or: [
        { senderId: myId, receiverId: partnerId },
        { senderId: partnerId, receiverId: myId }
      ]
    }).sort({ timestamp: 1 });

    // Mark as read
    await Message.updateMany(
      { senderId: partnerId, receiverId: myId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ success: true, data: chatHistory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Send a message
// @route   POST /api/portal/messages
// @access  Private
router.post('/messages', protect, async (req, res) => {
  const { receiverId, content } = req.body;

  try {
    if (mockStore.isMock) {
      const msg = await mockStore.create('messages', {
        senderId: req.user._id.toString(),
        receiverId,
        content,
        timestamp: new Date(),
        isRead: false
      });
      return res.status(201).json({ success: true, data: msg });
    }

    const msg = await Message.create({
      senderId: req.user._id,
      receiverId,
      content
    });

    res.status(201).json({ success: true, data: msg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
