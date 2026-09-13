const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Middleware to require username for task routes
const requireUsername = (req, res, next) => {
  const username = req.headers['x-username'] || req.query.username;
  if (!username) {
    return res.status(401).json({ error: 'Username is required to access tasks' });
  }
  req.username = username.toLowerCase().trim();
  next();
};

// GET /api/tasks
router.get('/', requireUsername, async (req, res) => {
  try {
    const { date } = req.query;
    const query = { username: req.username };
    
    if (date) {
      const qDate = new Date(date);
      query.date = {
        $gte: new Date(qDate.setHours(0,0,0,0)),
        $lt: new Date(qDate.setHours(23,59,59,999))
      };
    }

    const tasks = await Task.find(query).sort({ date: 1, createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Server error fetching tasks' });
  }
});

// GET /api/tasks/journey
router.get('/journey', requireUsername, async (req, res) => {
  try {
    // Fetch all tasks for the user sorted chronologically
    const tasks = await Task.find({ username: req.username }).sort({ date: 1, createdAt: 1 });
    
    // Group tasks hierarchically: Year -> Month -> Week -> Day -> StudyBlock
    const journey = {};

    tasks.forEach(task => {
      if (!task.year || !task.month || !task.week || !task.dayOfWeek || !task.studyBlock) return; // Skip invalid tasks
      
      if (!journey[task.year]) journey[task.year] = {};
      if (!journey[task.year][task.month]) journey[task.year][task.month] = {};
      if (!journey[task.year][task.month][task.week]) journey[task.year][task.month][task.week] = {};
      if (!journey[task.year][task.month][task.week][task.dayOfWeek]) journey[task.year][task.month][task.week][task.dayOfWeek] = {};
      if (!journey[task.year][task.month][task.week][task.dayOfWeek][task.studyBlock]) journey[task.year][task.month][task.week][task.dayOfWeek][task.studyBlock] = [];

      journey[task.year][task.month][task.week][task.dayOfWeek][task.studyBlock].push(task);
    });

    res.status(200).json(journey);
  } catch (error) {
    console.error('Error fetching journey:', error);
    res.status(500).json({ error: 'Server error fetching journey' });
  }
});

// POST /api/tasks
router.post('/', requireUsername, async (req, res) => {
  try {
    const taskData = { ...req.body, username: req.username };
    const task = new Task(taskData);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Server error creating task' });
  }
});

// PATCH /api/tasks/:id
router.patch('/:id', requireUsername, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Only allow updating status for now based on requirements, but could be expanded
    const allowedUpdates = {};
    if (status) allowedUpdates.status = status;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, username: req.username },
      { $set: allowedUpdates },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Server error updating task' });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', requireUsername, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, username: req.username });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Server error deleting task' });
  }
});

module.exports = router;
