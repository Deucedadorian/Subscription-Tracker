const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOSTNAME,
    dialect: "mysql",
    port: process.env.DB_PORT,
    logging: console.log,
    maxConcurrentQueries: 100,
    dialectOptions: {
      ssl:'Amazon RDS',
    },
    pool: { maxConnections: 5, maxIdleTime: 30},
    language: 'en'
  }
);

module.exports = sequelize;
