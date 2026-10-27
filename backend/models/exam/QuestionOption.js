import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('QuestionOption', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    question_id: { type: DataTypes.INTEGER, allowNull: false },
    option_key: { 
      type: DataTypes.STRING(10), 
      allowNull: true,
      defaultValue: 'A'
    },
    order_index: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    option_text: { type: DataTypes.TEXT, allowNull: false },
    is_correct: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'question_options',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeValidate: (instance) => {
        if (!instance.option_key) {
          const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
          const idx = (instance.order_index && instance.order_index > 0) ? instance.order_index - 1 : 0;
          instance.option_key = keys[idx] || String(idx + 1);
        }
      }
    }
  });
};
