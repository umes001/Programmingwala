import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('Exam', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { 
      type: DataTypes.STRING(255), 
      allowNull: false,
      set(val) {
        this.setDataValue('name', val);
      }
    },
    title: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue('name');
      },
      set(val) {
        this.setDataValue('name', val);
      }
    },
    code: { type: DataTypes.STRING(50), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    subject: { type: DataTypes.STRING(100), defaultValue: 'General' },
    course_id: { type: DataTypes.INTEGER, allowNull: true },
    batch_id: { type: DataTypes.INTEGER, allowNull: true },
    duration_minutes: { type: DataTypes.INTEGER, defaultValue: 60 },
    total_marks: { type: DataTypes.DECIMAL(10, 2), defaultValue: 100.00 },
    passing_marks: { type: DataTypes.DECIMAL(10, 2), defaultValue: 40.00 },
    start_date: { type: DataTypes.DATE, allowNull: true },
    end_date: { type: DataTypes.DATE, allowNull: true },
    valid_from: { 
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('start_date'); },
      set(val) { this.setDataValue('start_date', val); }
    },
    valid_to: { 
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('end_date'); },
      set(val) { this.setDataValue('end_date', val); }
    },
    max_attempts: { type: DataTypes.INTEGER, defaultValue: 1 },
    negative_marking_enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    negative_marking: {
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('negative_marking_enabled'); },
      set(val) { this.setDataValue('negative_marking_enabled', val); }
    },
    negative_marks: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.00 },
    negative_marks_per_question: {
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('negative_marks'); },
      set(val) { this.setDataValue('negative_marks', val); }
    },
    randomize_questions: { type: DataTypes.BOOLEAN, defaultValue: false },
    randomize_options: { type: DataTypes.BOOLEAN, defaultValue: false },
    allow_back_navigation: { type: DataTypes.BOOLEAN, defaultValue: true },
    auto_save: { type: DataTypes.BOOLEAN, defaultValue: true },
    auto_submit: { type: DataTypes.BOOLEAN, defaultValue: true },
    show_result_immediately: { type: DataTypes.BOOLEAN, defaultValue: true },
    show_correct_answers: { type: DataTypes.BOOLEAN, defaultValue: true },
    show_explanations: { type: DataTypes.BOOLEAN, defaultValue: true },
    allow_review: {
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('show_correct_answers'); },
      set(val) { this.setDataValue('show_correct_answers', val); }
    },
    status: { 
      type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'ACTIVE', 'COMPLETED', 'EXPIRED', 'ARCHIVED'),
      defaultValue: 'DRAFT'
    },
    instructions: { type: DataTypes.TEXT, allowNull: true },
    created_by: { type: DataTypes.STRING(100), allowNull: true }
  }, {
    tableName: 'exams',
    timestamps: true,
    underscored: true
  });
};
