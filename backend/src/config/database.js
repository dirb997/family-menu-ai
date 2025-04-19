const { Sequelize } = require('sequelize');
require('dotenv').config();

// Determine which database dialect to use
const isProduction = process.env.NODE_ENV === 'production';
const dialect = isProduction ? 'postgres' : 'mysql';

// Database connection configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'menus_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect,
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // SSL configuration for production PostgreSQL
    ...(isProduction && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  }
);

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`${dialect.toUpperCase()} connection established successfully.`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  testConnection
};