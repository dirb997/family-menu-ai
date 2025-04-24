const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDatabase } = require('./models');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Configure CORS with specific options
app.use(cors({
  origin: ['https://family-menu-ai-frontend.onrender.com', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
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