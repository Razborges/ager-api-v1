// const sequelize = require('../config/db');

module.exports = (sequelize, DataTypes) => {
  const Route = sequelize.define('route', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    start: DataTypes.DATE,
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  });

  Route.associate = (models) => {
    Route.belongsTo(models.Robot);
  };

  return Route;
};
