const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Static Files (Serve Frontend)
const path = require('path');
app.use(express.static(path.join(__dirname, '../client')));

// Serverless MongoDB Connection Pattern
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI === 'YOUR_MONGODB_CONNECTION_STRING') {
    console.warn('WARNING: MONGODB_URI is not set properly in .env');
    return; // Allow it to pass so routes can fail normally or be tested
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, { 
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false // Disable buffering so it fails fast if not connected
    });
    isConnected = true;
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error;
  }
};

// Database connection middleware for all API routes
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed. Please check MONGODB_URI or Atlas IP Whitelist.' });
  }
});

// Routes
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const progressRoutes = require('./routes/progress');

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/progress', progressRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running', dbConnected: isConnected });
});

// Local development server listener
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    // Attempt initial connection for local dev
    try {
      await connectDB();
    } catch (e) {
      // Ignored here, middleware will catch it on request
    }
  });
}

// Export for Vercel Serverless
module.exports = app;
