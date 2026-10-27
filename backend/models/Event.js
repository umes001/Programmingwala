import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an event title']
  },
  description: {
    type: String,
    default: ''
  },
  startDate: {
    type: Date,
    required: [true, 'Please add start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add end date']
  },
  type: {
    type: String,
    enum: ['holiday', 'ptm', 'exam', 'celebration'],
    default: 'celebration'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Event', EventSchema);
