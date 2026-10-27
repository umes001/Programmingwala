import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('ExamCourse', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE'), defaultValue: 'ACTIVE' }
  }, {
    tableName: 'exam_courses',
    timestamps: true,
    underscored: true
  });
};
