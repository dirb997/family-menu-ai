const { Sequelize } = require('sequelize');
require('dotenv').config();

// Determine which database dialect to use
const isProduction = process.env.NODE_ENV === 'production';
const dialect = isProduction ? 'postgres' : 'mysql';

let sequelize;

if (isProduction && process.env.DATABASE_URL) {
  // Use the DATABASE_URL provided by Render if available
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Database connection configuration for development or when individual params are provided
  sequelize = new Sequelize(
    process.env.DB_NAME || 'menus_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect,
      logging: false,
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
}

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