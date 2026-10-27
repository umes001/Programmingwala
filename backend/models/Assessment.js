import mongoose from 'mongoose';

// Question types:
// mcq     → Multiple choice (auto-graded, correct option)
// theory  → Long written answer (manually graded by admin)
// sql     → Candidate writes a SQL query; backend validates output vs expected

const QuestionSchema = new mongoose.Schema({
  text:        { type: String, required: true },
  type:        { type: String, enum: ['mcq', 'theory', 'sql'], default: 'mcq' },

  // MCQ
  options:     [{ type: String }],   // answer choices
  correct:     { type: String, default: '' }, // exact correct option text

  // Theory
  modelAnswer: { type: String, default: '' }, // admin reference (not shown to candidate)

  // SQL
  sqlSchema:   { type: String, default: '' }, // CREATE TABLE + INSERT statements shown to candidate
  sqlExpected: { type: String, default: '' }, // expected output rows (JSON string or text)
  sqlHint:     { type: String, default: '' }, // optional hint shown below the editor

  explanation: { type: String, default: '' }, // shown after submission if showResult=true
  marks:       { type: Number, default: 1 },
  difficulty:  { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  topic:       { type: String, default: 'General' },
  createdAt:   { type: Date, default: Date.now }
});

const AssessmentSchema = new mongoose.Schema({
  title:            { type: String, required: true, trim: true },
  description:      { type: String, default: '' },
  jobTitle:         { type: String, default: 'General' },
  questions:        [QuestionSchema],
  duration:         { type: Number, default: 30 },
  passingScore:     { type: Number, default: 50 },
  maxAttempts:      { type: Number, default: 1 },
  shuffleQuestions: { type: Boolean, default: true },
  shuffleOptions:   { type: Boolean, default: true },
  showResult:       { type: Boolean, default: true },
  isActive:         { type: Boolean, default: true },
  accessPassword:   { type: String, default: '' },
  invitedCandidates: [{
    registrationId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email:          { type: String, lowercase: true, trim: true },
    name:           { type: String, default: '' },
    phone:          { type: String, default: '' },
    college:        { type: String, default: '' },
    rollNo:         { type: String, default: '' },
    registeredAt:   { type: Date, default: Date.now },
    invitedAt:      { type: Date, default: Date.now },
    accessCode:     { type: String, default: '' }
  }],
  scheduledAt: { type: Date },
  expiresAt:   { type: Date },
  createdAt:   { type: Date, default: Date.now }
});

const AttemptSchema = new mongoose.Schema({
  assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  candidate: {
    registrationId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email:          { type: String, required: true, lowercase: true },
    name:           { type: String },
    accessCode:     { type: String }
  },
  answers: [{
    questionId:  mongoose.Schema.Types.ObjectId,
    answer:      String,   // MCQ: selected option | Theory: written text | SQL: query string
    isCorrect:   Boolean,  // null for theory (manual), true/false for mcq/sql
    marks:       Number,
    // SQL-specific
    sqlOutput:   { type: String, default: '' },  // actual query output
    sqlError:    { type: String, default: '' }   // parse/validation error message
  }],
  score:      { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  passed:     { type: Boolean, default: false },
  totalMarks: { type: Number, default: 0 },
  timeTaken:  { type: Number, default: 0 },
  status:     { type: String, enum: ['in-progress', 'submitted', 'terminated'], default: 'in-progress' },
  violations: [{
    type:      { type: String },
    timestamp: { type: Date, default: Date.now },
    count:     { type: Number, default: 1 }
  }],
  startedAt:   { type: Date, default: Date.now },
  submittedAt: { type: Date }
});

export const Assessment = mongoose.models.Assessment || mongoose.model('Assessment', AssessmentSchema);
export const Attempt = mongoose.models.Attempt || mongoose.model('Attempt', AttemptSchema);

export default { Assessment, Attempt };
