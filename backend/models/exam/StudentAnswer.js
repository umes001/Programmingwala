import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('StudentAnswer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    attempt_id: { type: DataTypes.INTEGER, allowNull: false },
    question_id: { type: DataTypes.INTEGER, allowNull: false },
    answer: { type: DataTypes.TEXT, allowNull: true },
    corrected_code: { type: DataTypes.TEXT, allowNull: true },
    is_correct: { type: DataTypes.BOOLEAN, allowNull: true },
    marks_obtained: { type: DataTypes.DECIMAL(6, 2), defaultValue: 0.00 },
    evaluation_type: { 
      type: DataTypes.ENUM('AUTO', 'MANUAL', 'KEYWORD', 'AI_ASSISTED'),
      defaultValue: 'AUTO'
    },
    ai_evaluation: { type: DataTypes.JSON, allowNull: true },
    teacher_feedback: { type: DataTypes.TEXT, allowNull: true },
    is_marked_for_review: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'student_answers',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['attempt_id', 'question_id'] }
    ]
  });
};
