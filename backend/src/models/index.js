const { sequelize, testConnection } = require('../config/database');
const { Menu, NormalMenu, KidsMenu, AllergyMenu } = require('./menu');

// Initialize database and sync models
const initDatabase = async () => {
  try {
    await testConnection(); // Test the connection
    
    // Sync all models with the database
    await sequelize.sync({ alter: true });
    console.log('Database & tables synced successfully');
    
    return { success: true };
  } catch (error) {
    console.error('Error initializing database:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sequelize,
  Menu,
  NormalMenu,
  KidsMenu,
  AllergyMenu,
  initDatabase
};