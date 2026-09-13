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

// Routes
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const progressRoutes = require('./routes/progress');

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/progress', progressRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Database Connection
if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'YOUR_MONGODB_CONNECTION_STRING') {
  mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      console.log('Connected to MongoDB Atlas');
      
      // Local development server listener
      if (process.env.NODE_ENV !== 'production') {
        app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
        });
      }
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error.message);
      console.error('Please ensure your IP address is whitelisted in MongoDB Atlas or check your internet connection.');
    });
} else {
  console.warn('WARNING: MONGODB_URI is not set properly in .env');
  console.warn('Server will start without DB connection for testing routes, but API will fail.');
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (NO DATABASE)`);
    });
  }
}

// Export for Vercel Serverless
module.exports = app;
