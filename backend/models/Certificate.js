import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    studentName: {
      type: String,
      required: true,
      trim: true
    },
    internshipName: {
      type: String,
      required: true,
      trim: true
    },
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: true
    },
    issueDate: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: 'This certification is awarded in recognition of the successful completion of the curriculum and mastery of the course content.'
    },
    companyName: {
      type: String,
      default: 'APPLE TREE INFOTECH'
    },
    companyAddress: {
      type: String,
      default: 'C-60 3rd Floor R.K. Tower RDC, Raj Nagar, Ghaziabad, 201001'
    },
    companyPhone: {
      type: String,
      default: '7503962162, 9355343070'
    },
    companyEmail: {
      type: String,
      default: 'info@appletreeinfotech.in'
    },
    companyWeb: {
      type: String,
      default: 'appletreeinfotech.in'
    },
    partnerUniversity: {
      type: String,
      default: 'KALINGA UNIVERSITY'
    },
    signatoryTitle: {
      type: String,
      default: 'Partner'
    },
    qrCodeData: {
      type: String
    },
    status: {
      type: String,
      enum: ['valid', 'revoked'],
      default: 'valid'
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    candidateEmail: {
      type: String,
      trim: true,
      lowercase: true
    },
    grade: {
      type: String,
      trim: true
    },
    percentage: {
      type: Number,
      default: 0
    },
    score: {
      type: Number,
      default: 0
    },
    totalMarks: {
      type: Number,
      default: 0
    },
    assessmentId: {
      type: String
    },
    attemptId: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model('Certificate', certificateSchema);
