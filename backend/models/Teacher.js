import mongoose from 'mongoose';

const TeacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add teacher name']
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: [true, 'Please add teacher phone number']
  },
  specialization: {
    type: String,
    default: 'Early Childhood Education'
  },
  qualifications: {
    type: String,
    required: [true, 'Please add teacher qualifications']
  },
  classesAssigned: [
    {
      type: String,
      enum: ['Pre-Nursery', 'Nursery', 'Junior KG', 'Senior KG', 'Preschool', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Teacher', TeacherSchema);
