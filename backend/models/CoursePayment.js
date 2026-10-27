import mongoose from 'mongoose';

const CoursePaymentSchema = new mongoose.Schema({
  paymentRef: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    default: ''
  },
  courseId: {
    type: String,
    required: true
  },
  courseTitle: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  studentDetails: {
    name: { type: String, default: '' },
    dateOfBirth: { type: String, default: '' },
    gender: { type: String, default: '' }
  },
  parentDetails: {
    fatherName: { type: String, default: '' },
    motherName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' }
  },
  method: {
    type: String,
    default: 'razorpay'
  },
  status: {
    type: String,
    enum: ['created', 'pending', 'paid', 'failed'],
    default: 'created'
  },
  razorpayOrderId: {
    type: String,
    default: '',
    index: true
  },
  razorpayPaymentId: {
    type: String,
    default: ''
  },
  razorpaySignature: {
    type: String,
    default: ''
  },
  paidAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

CoursePaymentSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('CoursePayment', CoursePaymentSchema);
