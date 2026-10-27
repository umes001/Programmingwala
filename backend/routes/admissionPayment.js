import express from 'express';
import AdmissionPayment from '../models/AdmissionPayment.js';
import { protect } from '../middleware/auth.js';
import mockStore from '../config/mockStore.js';
import { createAdmissionFromPayment } from '../utils/admissionService.js';
import { uploadAdmissions } from '../middleware/upload.js';
import Course from '../models/Course.js';

const router = express.Router();

const PAYMENT_COLLECTION = 'admissionPayments';

function genPaymentRef() {
  return `ADM-PAY-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

// Local mock-store helpers operate on a fresh in-memory collection.
async function mockFindById(id) {
  const list = mockStore[PAYMENT_COLLECTION] || [];
  return list.find((p) => String(p._id) === String(id) || String(p.paymentRef) === String(id)) || null;
}
async function mockFindAll() {
  const list = mockStore[PAYMENT_COLLECTION] || [];
  return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
async function mockCreatePayment(payload) {
  if (!mockStore[PAYMENT_COLLECTION]) mockStore[PAYMENT_COLLECTION] = [];
  const record = await mockStore.create(PAYMENT_COLLECTION, payload);
  return record;
}
async function mockUpdatePayment(id, updates) {
  const item = await mockFindById(id);
  if (!item) return null;
  Object.assign(item, updates);
  return item;
}

// @desc    Create an admission payment attempt (cash or razorpay)
// @route   POST /api/admission-payment/create
// @access  Public (admin desk / public apply flow)
router.post('/create', uploadAdmissions.single('photo'), async (req, res) => {
  const parseObj = (v, fallback = {}) => {
    if (typeof v === 'string') { try { return JSON.parse(v); } catch { return fallback; } }
    return v || fallback;
  };
  const studentDetails = parseObj(req.body.studentDetails);
  const parentDetails = parseObj(req.body.parentDetails);
  const { amount, method, paymentPlan = 'installments' } = req.body;
  const photoFile = req.file || null;

  const photoForService = photoFile
    ? { buffer: photoFile.buffer, mimetype: photoFile.mimetype, originalname: photoFile.originalname }
    : null;

  if (!studentDetails.name || !parentDetails.email) {
    return res.status(400).json({ success: false, message: 'Student name and parent email are required.' });
  }
  if (!['cash', 'razorpay', 'upi'].includes(method)) {
    return res.status(400).json({ success: false, message: "Payment method must be 'cash', 'upi', or 'razorpay'." });
  }

  const paymentRef = genPaymentRef();
  let amountNum = Number(amount) || 0;

  // Cash is collected at the desk or desk UPI is confirmed → instantly verified.
  const isInstant = method === 'cash' || (method === 'upi' && req.body.isInstantDeskUpi === 'true');
  const baseStatus = isInstant ? 'verified' : 'pending';

  const payload = {
    paymentRef,
    studentDetails,
    parentDetails,
    amount: amountNum,
    method,
    status: baseStatus,
    verifiedAt: isInstant ? new Date() : null,
    paymentPlan
  };

  try {
    let record;
    if (mockStore.isMock) {
      record = await mockCreatePayment(payload);
    } else {
      record = await AdmissionPayment.create(payload);
    }

    if (isInstant) {
      try {
        const result = await createAdmissionFromPayment({
          studentDetails,
          parentDetails,
          paymentMethod: method === 'upi' ? 'UPI' : 'Cash',
          admissionFee: amountNum,
          tuitionFee: Number(req.body.tuitionFee || req.body.courseFee) || 0,
          photo: photoForService,
          paymentPlan: payload.paymentPlan
        });
        const update = {
          status: 'verified',
          applicationNumber: result.applicationNumber,
          studentDbId: result.studentDbId,
          verifiedAt: new Date()
        };
        if (mockStore.isMock) {
          await mockUpdatePayment(record._id, update);
          record = { ...record, ...update };
        } else {
          record = await AdmissionPayment.findByIdAndUpdate(record._id, update, { new: true });
        }
        return res.status(201).json({
          success: true,
          data: record,
          applicationNumber: result.applicationNumber,
          studentId: result.studentId,
          receipt: result.receipt,
          message: `${method === 'upi' ? 'UPI' : 'Cash'} payment collected. Student registered automatically.`
        });
      } catch (err) {
        console.error('Auto-admission failed:', err);
        return res.status(500).json({ success: false, message: 'Payment recorded but student registration failed: ' + err.message });
      }
    }

    res.status(201).json({
      success: true,
      data: record,
      message: 'Razorpay payment initiated. Proceed with checkout.'
    });
  } catch (error) {
    console.error('Create admission payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Poll payment status (used by the frontend to auto-detect completion)
// @route   GET /api/admission-payment/status/:id
// @access  Public
router.get('/status/:id', async (req, res) => {
  try {
    let payment;
    if (mockStore.isMock) {
      payment = await mockFindById(req.params.id);
    } else {
      payment = await AdmissionPayment.findById(req.params.id);
    }
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment attempt not found.' });
    }
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    List all admission payment attempts (admin overview)
// @route   GET /api/admission-payment
// @access  Private (admin)
router.get('/', protect, async (req, res) => {
  try {
    let list;
    if (mockStore.isMock) {
      list = await mockFindAll();
    } else {
      list = await AdmissionPayment.find().sort({ createdAt: -1 });
    }
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
