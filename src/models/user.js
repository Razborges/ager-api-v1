// const sequelize = require('../config/db');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    service: { type: DataTypes.STRING, allowNull: false },
    serviceId: { type: DataTypes.STRING, allowNull: false },
  });

  User.associate = (models) => {
    User.belongsTo(models.Robot);
  };

  return User;
};
