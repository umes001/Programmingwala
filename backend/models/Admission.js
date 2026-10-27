import mongoose from 'mongoose';

const AdmissionSchema = new mongoose.Schema({
  applicationNumber: {
    type: String,
    required: true,
    unique: true
  },
  studentDetails: {
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    class: {
      type: String,
      required: true
    }
  },
  parentDetails: {
    fatherName: { type: String, default: '' },
    motherName: { type: String, default: '' },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' }
  },
  documents: {
    photo: { type: String },
    parentIdProof: { type: String },
    reportCard: { type: String },
    addressProofType: { type: String },
    addressProof: { type: String }
  },
  documentData: {
    photo: { data: Buffer, contentType: String, filename: String },
    parentIdProof: { data: Buffer, contentType: String, filename: String },
    reportCard: { data: Buffer, contentType: String, filename: String },
    addressProof: { data: Buffer, contentType: String, filename: String }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under_review'],
    default: 'pending'
  },
  remarks: {
    type: String,
    default: ''
  },
  submissionDate: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Admission', AdmissionSchema);
