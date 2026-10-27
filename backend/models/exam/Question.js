import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Question', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    question_type: { 
      type: DataTypes.ENUM('MCQ', 'DESCRIPTIVE', 'CODE_ERROR', 'TRUE_FALSE'),
      defaultValue: 'MCQ',
      set(val) {
        this.setDataValue('question_type', val);
      }
    },
    type: {
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('question_type'); },
      set(val) { this.setDataValue('question_type', val); }
    },
    question_text: { type: DataTypes.TEXT, allowNull: false },
    statement: { type: DataTypes.TEXT, allowNull: true },
    programming_language: { type: DataTypes.STRING(50), allowNull: true },
    code: { 
      type: DataTypes.TEXT, 
      allowNull: true,
      set(val) { this.setDataValue('code', val); }
    },
    code_snippet: {
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('code'); },
      set(val) { this.setDataValue('code', val); }
    },
    expected_error: { type: DataTypes.TEXT, allowNull: true },
    correct_code: { type: DataTypes.TEXT, allowNull: true },
    model_answer: { type: DataTypes.TEXT, allowNull: true },
    expected_answer: { type: DataTypes.TEXT, allowNull: true },
    keywords: { type: DataTypes.TEXT, allowNull: true },
    correct_answer: { type: DataTypes.TEXT, allowNull: true },
    explanation: { type: DataTypes.TEXT, allowNull: true },
    marks: { type: DataTypes.DECIMAL(6, 2), defaultValue: 1.00 },
    negative_marks: { type: DataTypes.DECIMAL(6, 2), defaultValue: 0.00 },
    difficulty: { type: DataTypes.ENUM('EASY', 'MEDIUM', 'HARD'), defaultValue: 'MEDIUM' },
    subject: { type: DataTypes.STRING(100), defaultValue: 'General' },
    topic: { type: DataTypes.STRING(100), defaultValue: 'General' },
    tags: { type: DataTypes.STRING(255), allowNull: true },
    ai_generated: { type: DataTypes.BOOLEAN, defaultValue: false },
    evaluation_method: { 
      type: DataTypes.ENUM('AUTO', 'MANUAL', 'KEYWORD', 'AI_ASSISTED'),
      defaultValue: 'AUTO'
    },
    status: { type: DataTypes.ENUM('DRAFT', 'APPROVED', 'ARCHIVED'), defaultValue: 'APPROVED' },
    created_by: { type: DataTypes.STRING(100), allowNull: true }
  }, {
    tableName: 'questions',
    timestamps: true,
    underscored: true
  });
};
