const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDatabase } = require('./models');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Basic CORS configuration - simplified to avoid path-to-regexp errors
app.use(cors());

// Use express JSON middleware
app.use(express.json());

// Initialize database
initDatabase().then(({ success }) => {
  if (success) {
    console.log('Database initialized successfully');
  } else {
    console.error('Failed to initialize database');
  }
});

// Import routes
const menuRoutes = require('./routes/menu');
const aiRoutes = require('./routes/ai');

// Register routes
app.use('/api/menu', menuRoutes);
app.use('/api/ai', aiRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Menu Creator API is running');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;