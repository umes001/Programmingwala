import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('College', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    university: { type: DataTypes.STRING(255), allowNull: true },
    city: { type: DataTypes.STRING(100), allowNull: true },
    state: { type: DataTypes.STRING(100), allowNull: true },
    country: { type: DataTypes.STRING(100), defaultValue: 'India' },
    college_type: { type: DataTypes.STRING(100), defaultValue: 'Engineering & Technology' },
    status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE'), defaultValue: 'ACTIVE' }
  }, {
    tableName: 'colleges',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['name'] },
      { fields: ['city'] }
    ]
  });
};
