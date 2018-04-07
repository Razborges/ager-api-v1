// const sequelize = require('../config/db');

module.exports = (sequelize, DataTypes) => {
  const Work = sequelize.define('work', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
    },
    temperature: { type: DataTypes.DECIMAL, allowNull: false },
    humidity: { type: DataTypes.DECIMAL, allowNull: false },
    startWork: DataTypes.DATE,
    endWork: DataTypes.DATE,
  });

  Work.associate = (models) => {
    Work.belongsTo(models.Route);
  };

  return Work;
};
