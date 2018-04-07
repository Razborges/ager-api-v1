require('dotenv').config();
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER_DB,
  process.env.PASSWORD_DB,
  {
    host: process.env.HOST_DB,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    operatorsAliases: Sequelize.Op,
    ssl: process.env.SSL_DB,
  },
);

const db = {
  Robot: sequelize.import('../models/robot'),
  User: sequelize.import('../models/user'),
  Route: sequelize.import('../models/route'),
  Work: sequelize.import('../models/work'),
  Battery: sequelize.import('../models/battery'),
};

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;
