// const sequelize = require('../config/db');

module.exports = (sequelize, DataTypes) => {
  const Battery = sequelize.define('battery', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
    },
    level: { type: DataTypes.INTEGER, allowNull: false },
  });

  Battery.associate = (models) => {
    Battery.belongsTo(models.Robot);
  };

  return Battery;
};
