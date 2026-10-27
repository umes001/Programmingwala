import mongoose from 'mongoose';

const ParentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add parent name']
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: [true, 'Please add contact number']
  },
  address: {
    type: String,
    required: [true, 'Please add home address']
  },
  occupation: {
    type: String
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Parent', ParentSchema);
