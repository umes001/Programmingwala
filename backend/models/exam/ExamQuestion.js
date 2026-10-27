import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('ExamQuestion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    exam_id: { type: DataTypes.INTEGER, allowNull: false },
    question_id: { type: DataTypes.INTEGER, allowNull: false },
    question_order: { type: DataTypes.INTEGER, defaultValue: 1 },
    marks_override: { type: DataTypes.DECIMAL(6, 2), allowNull: true },
    order_index: {
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('question_order'); },
      set(v) { this.setDataValue('question_order', v); }
    },
    marks: {
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('marks_override'); },
      set(v) { this.setDataValue('marks_override', v); }
    }
  }, {
    tableName: 'exam_questions',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['exam_id', 'question_id'] }
    ]
  });
};
