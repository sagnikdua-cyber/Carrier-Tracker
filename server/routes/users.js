const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Username is required' });
    }

    const normalizedUsername = username.trim().toLowerCase();

    // Check if user exists
    let user = await User.findOne({ username: normalizedUsername });

    if (user) {
      // Update last login
      user.lastLoginAt = Date.now();
      await user.save();
    } else {
      // Create new user
      user = new User({ username: normalizedUsername });
      await user.save();
      // Note: We don't seed here based on requirements. 
      // Seed script will handle populating tasks for the user.
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        username: user.username,
        extraTechnology: user.extraTechnology,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// GET /api/users/:username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase().trim() });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.status(200).json({
      username: user.username,
      extraTechnology: user.extraTechnology
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/users/:username/technology
router.patch('/:username/technology', async (req, res) => {
  try {
    const username = req.params.username.toLowerCase().trim();
    const { technology } = req.body;
    
    if (!technology) {
      return res.status(400).json({ error: 'Technology is required' });
    }

    const user = await User.findOneAndUpdate(
      { username },
      { $set: { extraTechnology: technology } },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Update all pending "Extra Technology" tasks to the new subject/topic
    // We only update future/pending tasks, preserving historical completed tasks
    const Task = require('../models/Task');
    await Task.updateMany(
      { 
        username, 
        category: 'Extra Technology', 
        status: { $in: ['pending', 'paused', 'deferred'] }
      },
      { 
        $set: { 
          subject: technology,
          studyBlock: technology,
          title: `Study ${technology}`,
          topic: '' // Clear subtopic
        }
      }
    );

    res.status(200).json({
      message: 'Technology updated successfully',
      extraTechnology: user.extraTechnology
    });
  } catch (error) {
    console.error('Error updating technology:', error);
    res.status(500).json({ error: 'Server error updating technology' });
  }
});

module.exports = router;
