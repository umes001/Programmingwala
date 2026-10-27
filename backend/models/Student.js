import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a student name']
  },
  studentId: {
    type: String,
    unique: true,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please add student date of birth']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  class: {
    type: String,
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: true
  },
  photo: {
    type: String,
    default: ''
  },
  photoData: {
    data: Buffer,
    contentType: String,
    filename: String
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  attendance: [
    {
      date: { type: Date, required: true },
      status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' }
    }
  ],
  progressReports: [
    {
      term: { type: String, required: true },
      cognitive: { type: Number, default: 0 },
      social: { type: Number, default: 0 },
      creative: { type: Number, default: 0 },
      motorSkills: { type: Number, default: 0 },
      notes: { type: String }
    }
  ],
  activities: [
    {
      date: { type: Date, default: Date.now },
      time: { type: String },
      title: { type: String },
      description: { type: String },
      category: { type: String, enum: ['art', 'food', 'nap', 'play', 'academic'], default: 'play' }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Student', StudentSchema);
