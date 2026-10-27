import mongoose from 'mongoose';

const ReceiptSchema = new mongoose.Schema({
  feeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fee',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  receiptNumber: {
    type: String,
    required: true,
    unique: true
  },
  amountPaid: {
    type: Number,
    required: [true, 'Please add amount paid']
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  transactionId: {
    type: String,
    required: true
  }
});

export default mongoose.model('Receipt', ReceiptSchema);
