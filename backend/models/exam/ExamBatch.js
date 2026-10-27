import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('ExamBatch', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    course_id: { type: DataTypes.INTEGER, allowNull: true },
    start_date: { type: DataTypes.DATEONLY, allowNull: true },
    end_date: { type: DataTypes.DATEONLY, allowNull: true },
    status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE'), defaultValue: 'ACTIVE' }
  }, {
    tableName: 'exam_batches',
    timestamps: true,
    underscored: true
  });
};
