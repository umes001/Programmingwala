import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('ExamStudentAccess', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    student_id: { type: DataTypes.INTEGER, allowNull: false },
    exam_id: { type: DataTypes.INTEGER, allowNull: false },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    plain_password: { type: DataTypes.STRING(255), allowNull: true },
    status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'REVOKED', 'EXPIRED'), defaultValue: 'ACTIVE' },
    assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    expires_at: { type: DataTypes.DATE, allowNull: true },
    last_login_at: { type: DataTypes.DATE, allowNull: true }
  }, {
    tableName: 'exam_student_access',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['student_id', 'exam_id'] }
    ]
  });
};
