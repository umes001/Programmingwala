import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('ExamStudent', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name: { 
      type: DataTypes.STRING(255), 
      allowNull: false,
      set(val) { this.setDataValue('full_name', val); }
    },
    name: {
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('full_name'); },
      set(val) { this.setDataValue('full_name', val); }
    },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    mobile_number: { 
      type: DataTypes.STRING(50), 
      allowNull: false,
      set(val) { this.setDataValue('mobile_number', val); }
    },
    phone: {
      type: DataTypes.VIRTUAL,
      get() { return this.getDataValue('mobile_number'); },
      set(val) { this.setDataValue('mobile_number', val); }
    },
    college_id: { type: DataTypes.INTEGER, allowNull: true },
    college_name: { type: DataTypes.STRING(255), allowNull: true },
    course_id: { type: DataTypes.INTEGER, allowNull: true },
    batch_id: { type: DataTypes.INTEGER, allowNull: true },
    roll_number: { type: DataTypes.STRING(100), allowNull: true },
    date_of_birth: { type: DataTypes.DATEONLY, allowNull: true },
    profile_photo: { type: DataTypes.STRING(500), allowNull: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: true },
    plain_password: { type: DataTypes.STRING(255), allowNull: true },
    status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'BLOCKED'), defaultValue: 'ACTIVE' }
  }, {
    tableName: 'examstudent',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['email'] },
      { fields: ['mobile_number'] }
    ]
  });
};
