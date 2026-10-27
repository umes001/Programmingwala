import mongoose from 'mongoose';

const FineRuleSchema = new mongoose.Schema({
  minDays: {
    type: Number,
    required: [true, 'Please specify minimum days late']
  },
  maxDays: {
    type: Number,
    required: [true, 'Please specify maximum days late']
  },
  fineAmount: {
    type: Number,
    required: [true, 'Please specify the fine amount']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('FineRule', FineRuleSchema);
