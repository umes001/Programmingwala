import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title']
  },
  description: {
    type: String,
    required: [true, 'Please add a job description']
  },
  department: {
    type: String,
    required: [true, 'Please specify the department'],
    enum: ['administration', 'teaching', 'support', 'management', 'other']
  },
  position: {
    type: String,
    required: [true, 'Please specify the position level'],
    enum: ['junior', 'senior', 'lead', 'manager', 'director']
  },
  salary: {
    type: Number,
    required: [true, 'Please add salary information']
  },
  qualifications: {
    type: String,
    required: [true, 'Please add required qualifications']
  },
  experience: {
    type: String,
    required: [true, 'Please specify years of experience required']
  },
  responsibilities: {
    type: String,
    required: [true, 'Please add job responsibilities']
  },
  benefits: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: 'On-site'
  },
  applicationDeadline: {
    type: Date,
    required: [true, 'Please set an application deadline']
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'filled'],
    default: 'open'
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

export default mongoose.model('Job', JobSchema);
