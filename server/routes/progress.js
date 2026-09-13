const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET /api/progress
router.get('/', async (req, res) => {
  try {
    const username = req.headers['x-username'] || req.query.username;
    
    if (!username) {
      return res.status(401).json({ error: 'Username is required to fetch progress' });
    }

    const normalizedUsername = username.toLowerCase().trim();

    // Find all tasks for this user
    const tasks = await Task.find({ username: normalizedUsername });

    // Initialize progress tracker structure
    const trackers = {
      'Government': { total: 0, completed: 0 },
      'GATE': { total: 0, completed: 0 },
      'TCS NQT': { total: 0, completed: 0 },
      'Placement': { total: 0, completed: 0 }
    };

    // Calculate totals and completions
    tasks.forEach(task => {
      if (task.trackers && Array.isArray(task.trackers)) {
        task.trackers.forEach(trackerName => {
          if (trackers[trackerName]) {
            trackers[trackerName].total += 1;
            if (task.status === 'completed') {
              trackers[trackerName].completed += 1;
            }
          }
        });
      }
    });

    // Calculate percentages
    const progress = {};
    for (const [key, value] of Object.entries(trackers)) {
      if (value.total === 0) {
        progress[key] = 0;
      } else {
        progress[key] = Math.round((value.completed / value.total) * 100);
      }
    }

    res.status(200).json(progress);

  } catch (error) {
    console.error('Error calculating progress:', error);
    res.status(500).json({ error: 'Server error calculating progress' });
  }
});

// GET /api/progress/time
router.get('/time', async (req, res) => {
  try {
    const username = req.headers['x-username'] || req.query.username;
    const { date } = req.query; // 'YYYY-MM-DD'

    if (!username) {
      return res.status(401).json({ error: 'Username is required' });
    }

    if (!date) {
      return res.status(400).json({ error: 'Date is required for time progress (YYYY-MM-DD)' });
    }

    const normalizedUsername = username.toLowerCase().trim();
    const queryDate = new Date(date);
    
    // Find week and year of the given date from any task on that date (or we could calculate it, but finding the task is easier)
    const sampleTask = await Task.findOne({ 
      username: normalizedUsername, 
      date: {
        $gte: new Date(queryDate.setHours(0,0,0,0)),
        $lt: new Date(queryDate.setHours(23,59,59,999))
      }
    });

    if (!sampleTask) {
      return res.status(200).json({ 
        daily: { planned: 0, completed: 0 }, 
        weekly: { planned: 0, completed: 0 } 
      });
    }

    const { week, year } = sampleTask;

    // Get all tasks for this week
    const weeklyTasks = await Task.find({ username: normalizedUsername, week, year });

    let dailyPlanned = 0;
    let dailyCompleted = 0;
    let weeklyPlanned = 0;
    let weeklyCompleted = 0;

    const queryDateString = queryDate.toISOString().split('T')[0];

    weeklyTasks.forEach(task => {
      if (!task.estimatedTime) return;

      // Add to weekly totals
      weeklyPlanned += task.estimatedTime;
      if (task.status === 'completed') {
        weeklyCompleted += task.estimatedTime;
      }

      // Check if task is for "today" (the query date)
      if (task.date && task.date.toISOString().split('T')[0] === queryDateString) {
        dailyPlanned += task.estimatedTime;
        if (task.status === 'completed') {
          dailyCompleted += task.estimatedTime;
        }
      }
    });

    res.status(200).json({
      daily: {
        planned: dailyPlanned,
        completed: dailyCompleted
      },
      weekly: {
        planned: weeklyPlanned,
        completed: weeklyCompleted,
        weekNumber: week
      }
    });

  } catch (error) {
    console.error('Error calculating time progress:', error);
    res.status(500).json({ error: 'Server error calculating time progress' });
  }
});

module.exports = router;
