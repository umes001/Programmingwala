import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('ExamAttempt', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    exam_id: { type: DataTypes.INTEGER, allowNull: false },
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    access_id: { type: DataTypes.INTEGER, allowNull: false },
    attempt_number: { type: DataTypes.INTEGER, defaultValue: 1 },
    started_at: { type: DataTypes.DATE, allowNull: false },
    submitted_at: { type: DataTypes.DATE, allowNull: true },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    status: { 
      type: DataTypes.ENUM('IN_PROGRESS', 'SUBMITTED', 'AUTO_SUBMITTED', 'ABANDONED'),
      defaultValue: 'IN_PROGRESS'
    },
    score: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    total_marks_obtained: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      get() {
        const val = this.getDataValue('total_marks_obtained');
        return val !== null && val !== undefined ? val : (this.getDataValue('score') ?? 0.00);
      }
    },
    percentage: { type: DataTypes.DECIMAL(6, 2), defaultValue: 0.00 },
    total_marks: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    passing_marks: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    total_questions: { type: DataTypes.INTEGER, defaultValue: 0 },
    correct_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    wrong_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    unanswered_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    passed: { type: DataTypes.BOOLEAN, defaultValue: false },
    result_status: {
      type: DataTypes.STRING(32),
      defaultValue: 'PENDING',
      get() {
        const direct = this.getDataValue('result_status');
        if (direct && direct !== 'PENDING') return direct;
        return this.getDataValue('passed') ? 'PASSED' : 'FAILED';
      }
    },
    time_taken_seconds: { type: DataTypes.INTEGER, defaultValue: 0 },
    tab_switch_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    blur_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    fullscreen_exit_count: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    tableName: 'exam_attempts',
    timestamps: true,
    underscored: true
  });
};
