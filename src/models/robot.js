// const sequelize = require('../config/db');

module.exports = (sequelize, DataTypes) => {
  const Robot = sequelize.define('robot', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
    },
    numberSeries: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: DataTypes.STRING,
  });

  return Robot;
};
