import { getSequelize, initSequelize, switchSequelizeToMySQL } from '../../config/sequelize.js';
import defineCollege from './College.js';
import defineExamCourse from './ExamCourse.js';
import defineExamBatch from './ExamBatch.js';
import defineExamStudent from './ExamStudent.js';
import defineExam from './Exam.js';
import defineQuestion from './Question.js';
import defineQuestionOption from './QuestionOption.js';
import defineExamQuestion from './ExamQuestion.js';
import defineExamStudentAccess from './ExamStudentAccess.js';
import defineExamAttempt from './ExamAttempt.js';
import defineStudentAnswer from './StudentAnswer.js';

let db = null;

export const resetExamModels = () => {
  db = null;
};

export const getExamModels = (force = false) => {
  const sequelize = getSequelize();
  if (db && !force && db.sequelize === sequelize) return db;

  const College = defineCollege(sequelize);
  const ExamCourse = defineExamCourse(sequelize);
  const ExamBatch = defineExamBatch(sequelize);
  const ExamStudent = defineExamStudent(sequelize);
  const Exam = defineExam(sequelize);
  const Question = defineQuestion(sequelize);
  const QuestionOption = defineQuestionOption(sequelize);
  const ExamQuestion = defineExamQuestion(sequelize);
  const ExamStudentAccess = defineExamStudentAccess(sequelize);
  const ExamAttempt = defineExamAttempt(sequelize);
  const StudentAnswer = defineStudentAnswer(sequelize);

  // Associations
  // College -> Student
  College.hasMany(ExamStudent, { foreignKey: 'college_id', as: 'students' });
  ExamStudent.belongsTo(College, { foreignKey: 'college_id', as: 'college' });

  // Course -> Batches
  ExamCourse.hasMany(ExamBatch, { foreignKey: 'course_id', as: 'batches' });
  ExamBatch.belongsTo(ExamCourse, { foreignKey: 'course_id', as: 'course' });

  // Course -> Students
  ExamCourse.hasMany(ExamStudent, { foreignKey: 'course_id', as: 'students' });
  ExamStudent.belongsTo(ExamCourse, { foreignKey: 'course_id', as: 'course' });

  // Batch -> Students
  ExamBatch.hasMany(ExamStudent, { foreignKey: 'batch_id', as: 'students' });
  ExamStudent.belongsTo(ExamBatch, { foreignKey: 'batch_id', as: 'batch' });

  // Course -> Exams
  ExamCourse.hasMany(Exam, { foreignKey: 'course_id', as: 'exams' });
  Exam.belongsTo(ExamCourse, { foreignKey: 'course_id', as: 'course' });

  // Batch -> Exams
  ExamBatch.hasMany(Exam, { foreignKey: 'batch_id', as: 'exams' });
  Exam.belongsTo(ExamBatch, { foreignKey: 'batch_id', as: 'batch' });

  // Question -> QuestionOptions
  Question.hasMany(QuestionOption, { foreignKey: 'question_id', as: 'options', onDelete: 'CASCADE' });
  QuestionOption.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

  // Exam <-> Question (Many-to-Many through ExamQuestion)
  Exam.belongsToMany(Question, { through: ExamQuestion, foreignKey: 'exam_id', otherKey: 'question_id', as: 'questions' });
  Question.belongsToMany(Exam, { through: ExamQuestion, foreignKey: 'question_id', otherKey: 'exam_id', as: 'exams' });

  Exam.hasMany(ExamQuestion, { foreignKey: 'exam_id', as: 'examQuestions' });
  ExamQuestion.belongsTo(Exam, { foreignKey: 'exam_id', as: 'exam' });
  ExamQuestion.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

  // Student <-> Exam Access
  ExamStudent.hasMany(ExamStudentAccess, { foreignKey: 'student_id', as: 'examAccesses', onDelete: 'CASCADE' });
  ExamStudentAccess.belongsTo(ExamStudent, { foreignKey: 'student_id', as: 'student' });

  Exam.hasMany(ExamStudentAccess, { foreignKey: 'exam_id', as: 'studentAccesses', onDelete: 'CASCADE' });
  ExamStudentAccess.belongsTo(Exam, { foreignKey: 'exam_id', as: 'exam' });

  // Exam Attempts
  Exam.hasMany(ExamAttempt, { foreignKey: 'exam_id', as: 'attempts', onDelete: 'CASCADE' });
  ExamAttempt.belongsTo(Exam, { foreignKey: 'exam_id', as: 'exam' });

  ExamStudent.hasMany(ExamAttempt, { foreignKey: 'student_id', as: 'attempts', onDelete: 'CASCADE' });
  ExamAttempt.belongsTo(ExamStudent, { foreignKey: 'student_id', as: 'student' });

  ExamStudentAccess.hasMany(ExamAttempt, { foreignKey: 'access_id', as: 'attempts', onDelete: 'CASCADE' });
  ExamAttempt.belongsTo(ExamStudentAccess, { foreignKey: 'access_id', as: 'access' });

  // Student Answers
  ExamAttempt.hasMany(StudentAnswer, { foreignKey: 'attempt_id', as: 'answers', onDelete: 'CASCADE' });
  StudentAnswer.belongsTo(ExamAttempt, { foreignKey: 'attempt_id', as: 'attempt' });

  Question.hasMany(StudentAnswer, { foreignKey: 'question_id', as: 'studentAnswers', onDelete: 'CASCADE' });
  StudentAnswer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

  db = {
    sequelize,
    College,
    ExamCourse,
    ExamBatch,
    ExamStudent,
    Exam,
    Question,
    QuestionOption,
    ExamQuestion,
    ExamStudentAccess,
    ExamAttempt,
    StudentAnswer
  };

  return db;
};

// Auto Seed Initial Standard Colleges and Exam Courses
export const seedInitialExamData = async () => {
  try {
    const { College, ExamCourse, ExamBatch } = getExamModels();
    
    const collegeCount = await College.count();
    if (collegeCount === 0) {
      const defaultColleges = [
        { name: 'Ajay Kumar Garg Engineering College (AKGEC)', university: 'AKTU', city: 'Ghaziabad', state: 'Uttar Pradesh', college_type: 'Engineering' },
        { name: 'ABES Engineering College', university: 'AKTU', city: 'Ghaziabad', state: 'Uttar Pradesh', college_type: 'Engineering' },
        { name: 'KIET Group of Institutions', university: 'AKTU', city: 'Ghaziabad', state: 'Uttar Pradesh', college_type: 'Engineering' },
        { name: 'IMS Engineering College', university: 'AKTU', city: 'Ghaziabad', state: 'Uttar Pradesh', college_type: 'Engineering' },
        { name: 'RKGIT (Raj Kumar Goel Institute of Technology)', university: 'AKTU', city: 'Ghaziabad', state: 'Uttar Pradesh', college_type: 'Engineering' },
        { name: 'Galgotias University', university: 'Galgotias', city: 'Greater Noida', state: 'Uttar Pradesh', college_type: 'University' },
        { name: 'JSS Academy of Technical Education', university: 'AKTU', city: 'Noida', state: 'Uttar Pradesh', college_type: 'Engineering' },
        { name: 'Amity University Noida', university: 'Amity', city: 'Noida', state: 'Uttar Pradesh', college_type: 'University' },
        { name: 'Delhi Technological University (DTU)', university: 'DTU', city: 'Delhi', state: 'Delhi', college_type: 'University' },
        { name: 'Netaji Subhas University of Technology (NSUT)', university: 'NSUT', city: 'Delhi', state: 'Delhi', college_type: 'University' },
        { name: 'Indraprastha Institute of Information Technology (IIIT Delhi)', university: 'IIIT-D', city: 'Delhi', state: 'Delhi', college_type: 'Institute' },
        { name: 'Maharaja Agrasen Institute of Technology (MAIT)', university: 'GGSIPU', city: 'Delhi', state: 'Delhi', college_type: 'Engineering' },
        { name: 'Bharati Vidyapeeth College of Engineering', university: 'GGSIPU', city: 'Delhi', state: 'Delhi', college_type: 'Engineering' }
      ];
      await College.bulkCreate(defaultColleges);
      console.log('✔ Seeded 13 default colleges in examination database.');
    }

    const courseCount = await ExamCourse.count();
    if (courseCount === 0) {
      const c1 = await ExamCourse.create({ name: 'Java Full Stack & DSA Mastery', description: 'Core Java, Spring Boot, Microservices, React & DSA' });
      const c2 = await ExamCourse.create({ name: 'Python & Data Science Bootcamp', description: 'Python, NumPy, Pandas, Scikit-learn, Machine Learning' });
      const c3 = await ExamCourse.create({ name: 'MERN Full Stack Development', description: 'MongoDB, Express.js, React.js, Node.js & REST APIs' });
      const c4 = await ExamCourse.create({ name: 'AWS Cloud & DevOps Engineering', description: 'AWS Services, Docker, Kubernetes, CI/CD pipelines' });

      await ExamBatch.bulkCreate([
        { name: 'Java Full Stack - Batch 01 (Morning)', course_id: c1.id },
        { name: 'Java Full Stack - Batch 02 (Evening)', course_id: c1.id },
        { name: 'Python & Data Science - Batch 01', course_id: c2.id },
        { name: 'MERN Stack - Batch 01', course_id: c3.id },
        { name: 'AWS DevOps - Weekend Batch', course_id: c4.id }
      ]);
      console.log('✔ Seeded standard courses and batches for examinations.');
    }
  } catch (err) {
    console.warn('Initial exam data seeding note:', err.message);
  }
};

export const initExamDatabase = async () => {
  try {
    const sequelize = await initSequelize();
    resetExamModels();
    const models = getExamModels(true);
    try {
      await sequelize.sync({ alter: false });
      
      // Ensure all backward & forward compatible columns exist
      const compatibilityPatches = [
        'ALTER TABLE examstudent ADD COLUMN password_hash VARCHAR(255);',
        'ALTER TABLE examstudent ADD COLUMN plain_password VARCHAR(255);',
        'ALTER TABLE exam_student_access ADD COLUMN plain_password VARCHAR(255);',
        'ALTER TABLE exam_attempts ADD COLUMN total_marks_obtained DECIMAL(10,2);',
        'ALTER TABLE exam_attempts ADD COLUMN result_status VARCHAR(32);'
      ];
      for (const patchSql of compatibilityPatches) {
        try {
          await sequelize.query(patchSql);
        } catch (ignored) {}
      }

      await seedInitialExamData();

      console.log('\x1b[32m✔ Online Examination Database Tables & Schema Initialized Successfully in Hostinger MySQL!\x1b[0m');
    } catch (syncErr) {
      console.warn('\x1b[33mℹ Exam database schema sync note: ' + syncErr.message + '\x1b[0m');
    }
    return models;
  } catch (err) {
    console.warn('initExamDatabase notice:', err.message);
  }
};

export default getExamModels;
