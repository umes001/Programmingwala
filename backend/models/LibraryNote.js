import mongoose from 'mongoose';

const LibraryNoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a note title']
  },
  course: {
    type: String,
    required: [true, 'Please select a course']
  },
  content: {
    type: String,
    default: ''
  },
  pdfUrl: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('LibraryNote', LibraryNoteSchema);
