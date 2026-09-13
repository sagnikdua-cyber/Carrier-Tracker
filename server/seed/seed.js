const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
require('dotenv').config();
const Task = require('../models/Task');
const User = require('../models/User');

const generateTasks = () => {
  const tasks = [];
  const startDate = new Date('2026-10-04T00:00:00.000Z'); // A Sunday in October 2026
  const year = 2026;
  const month = 'October';
  const week = 1;
  const semester = 3;

  const routine = [
    { day: 'Sunday', dateOffset: 0, blocks: [
      { name: 'DSA', hours: 2, tasks: [
        { title: 'Study Array Traversal & Indexing', time: 45, category: 'DSA', trackers: ['GATE', 'Placement'], subject: 'Arrays', topic: 'Traversal', stage: 'Theory', resources: [{ name: 'GATE Wallah', type: 'Video', url: 'https://youtube.com' }, { name: 'GeeksforGeeks', type: 'Article', url: 'https://geeksforgeeks.org' }] },
        { title: 'Implement Array Insertion & Deletion', time: 45, category: 'DSA', trackers: ['GATE', 'Placement'], subject: 'Arrays', topic: 'Implementation', stage: 'Implement', resources: [{ name: 'LeetCode', type: 'Practice', url: 'https://leetcode.com' }] },
        { title: 'Solve 5 Array Problems', time: 30, category: 'DSA', trackers: ['Placement'], subject: 'Arrays', topic: 'Practice', stage: 'Practice', resources: [{ name: 'LeetCode arrays tag', type: 'Practice', url: 'https://leetcode.com/tag/array' }] }
      ]},
      { name: 'AI/ML', hours: 1, tasks: [
        { title: 'Study AI/ML', time: 60, category: 'Extra Technology', trackers: [], subject: 'AI/ML', topic: '', stage: '', resources: [] }
      ]},
      { name: 'Government / GATE', hours: 1, tasks: [
        { title: 'HCF & LCM Theory', time: 20, category: 'Government', trackers: ['Government'], subject: 'Quant', topic: 'HCF & LCM', stage: 'Concept', resources: [{ name: 'Adda247', type: 'Video', url: 'https://adda247.com' }] },
        { title: 'HCF & LCM Practice', time: 40, category: 'Government', trackers: ['Government'], subject: 'Quant', topic: 'HCF & LCM', stage: 'Basic Practice', resources: [{ name: 'Testbook', type: 'Practice', url: 'https://testbook.com' }] }
      ]},
      { name: 'College', hours: 1, tasks: [
        { title: 'Complete your College tasks', time: 60, category: 'College', trackers: [], subject: 'College', topic: '', stage: '', resources: [] }
      ]}
    ]},
    { day: 'Monday', dateOffset: 1, blocks: [
      { name: 'DSA', hours: 2, tasks: [
        { title: 'Binary Search Concept', time: 60, category: 'DSA', trackers: ['GATE', 'Placement'], subject: 'Searching', topic: 'Binary Search', stage: 'Theory', resources: [{ name: 'Abdul Bari', type: 'Video', url: 'https://youtube.com' }] },
        { title: 'Binary Search Implementation', time: 60, category: 'DSA', trackers: ['Placement'], subject: 'Searching', topic: 'Binary Search', stage: 'Implement', resources: [{ name: 'LeetCode', type: 'Practice', url: 'https://leetcode.com' }] }
      ]},
      { name: 'AI/ML', hours: 1, tasks: [
        { title: 'Study AI/ML', time: 60, category: 'Extra Technology', trackers: [], subject: 'AI/ML', topic: '', stage: '', resources: [] }
      ]},
      { name: 'DSA Revision', hours: 1, tasks: [
        { title: 'Revise Array Concepts', time: 60, category: 'DSA', trackers: ['GATE', 'Placement'], subject: 'Arrays', topic: 'Revision', stage: 'Revision', resources: [{ name: 'Personal Notes', type: 'Notes', url: '#' }] }
      ]},
      { name: 'College', hours: 1, tasks: [
        { title: 'Complete your College tasks', time: 60, category: 'College', trackers: [], subject: 'College', topic: '', stage: '', resources: [] }
      ]}
    ]},
    { day: 'Tuesday', dateOffset: 2, blocks: [
      { name: 'DSA', hours: 2, tasks: [
        { title: 'Linked List Node Creation', time: 45, category: 'DSA', trackers: ['GATE', 'Placement'], subject: 'Linked List', topic: 'Basics', stage: 'Theory', resources: [{ name: 'GATE Wallah', type: 'Video', url: 'https://youtube.com' }] },
        { title: 'Singly Linked List Implementation', time: 75, category: 'DSA', trackers: ['Placement'], subject: 'Linked List', topic: 'Implementation', stage: 'Implement', resources: [{ name: 'GeeksforGeeks', type: 'Article', url: 'https://geeksforgeeks.org' }] }
      ]},
      { name: 'Extra Technology', hours: 1, tasks: [
        { title: 'Study Extra Technology', time: 60, category: 'Extra Technology', trackers: [], subject: 'Extra Technology', topic: '', stage: '', resources: [] }
      ]},
      { name: 'Government / GATE', hours: 1, tasks: [
        { title: 'Discrete Math - Graph Theory', time: 60, category: 'GATE', trackers: ['GATE'], subject: 'Discrete Math', topic: 'Graphs', stage: 'Theory', resources: [{ name: 'GATE Wallah', type: 'Video', url: 'https://youtube.com' }] }
      ]},
      { name: 'College', hours: 1, tasks: [
        { title: 'Complete your College tasks', time: 60, category: 'College', trackers: [], subject: 'College', topic: '', stage: '', resources: [] }
      ]}
    ]},
    { day: 'Wednesday', dateOffset: 3, blocks: [
      { name: 'DSA', hours: 2, tasks: [
        { title: 'Doubly Linked List', time: 60, category: 'DSA', trackers: ['GATE', 'Placement'], subject: 'Linked List', topic: 'DLL', stage: 'Theory', resources: [] },
        { title: 'DLL Implementation', time: 60, category: 'DSA', trackers: ['Placement'], subject: 'Linked List', topic: 'DLL', stage: 'Implement', resources: [{ name: 'LeetCode', type: 'Practice', url: 'https://leetcode.com' }] }
      ]},
      { name: 'AI/ML', hours: 1, tasks: [
        { title: 'Study AI/ML', time: 60, category: 'Extra Technology', trackers: [], subject: 'AI/ML', topic: '', stage: '', resources: [] }
      ]},
      { name: 'DSA Revision', hours: 1, tasks: [
        { title: 'Revise Searching Algorithms', time: 60, category: 'DSA', trackers: ['GATE', 'Placement'], subject: 'Searching', topic: 'Revision', stage: 'Revision', resources: [{ name: 'Personal Notes', type: 'Notes', url: '#' }] }
      ]},
      { name: 'College', hours: 1, tasks: [
        { title: 'Complete your College tasks', time: 60, category: 'College', trackers: [], subject: 'College', topic: '', stage: '', resources: [] }
      ]}
    ]},
    { day: 'Thursday', dateOffset: 4, blocks: [
      { name: 'DSA', hours: 2, tasks: [
        { title: 'Solve 10 Linked List Problems', time: 120, category: 'DSA', trackers: ['Placement'], subject: 'Linked List', topic: 'Practice', stage: 'Practice', resources: [{ name: 'LeetCode', type: 'Practice', url: 'https://leetcode.com/tag/linked-list' }] }
      ]},
      { name: 'Project/AI-ML', hours: 1, tasks: [
        { title: 'Study AI/ML', time: 60, category: 'Extra Technology', trackers: [], subject: 'AI/ML', topic: '', stage: '', resources: [] }
      ]},
      { name: 'Government / GATE', hours: 1, tasks: [
        { title: 'Number System Practice', time: 60, category: 'TCS NQT', trackers: ['TCS NQT'], subject: 'Numerical Ability', topic: 'Number System', stage: 'Practice', resources: [{ name: 'IndiaBIX', type: 'Practice', url: 'https://indiabix.com' }] }
      ]},
      { name: 'College', hours: 1, tasks: [
        { title: 'Complete your College tasks', time: 60, category: 'College', trackers: [], subject: 'College', topic: '', stage: '', resources: [] }
      ]}
    ]}
  ];

  routine.forEach(dayRoutine => {
    const taskDate = new Date(startDate);
    taskDate.setDate(taskDate.getDate() + dayRoutine.dateOffset);

    dayRoutine.blocks.forEach(block => {
      block.tasks.forEach(t => {
        tasks.push({
          title: t.title,
          description: '',
          date: taskDate,
          week,
          month,
          year,
          semester,
          category: t.category,
          trackers: t.trackers,
          subject: t.subject,
          topic: t.topic,
          stage: t.stage,
          estimatedTime: t.time,
          resources: t.resources,
          studyBlock: block.name,
          dayOfWeek: dayRoutine.day,
          status: 'pending'
        });
      });
    });
  });

  return tasks;
};

const seedDB = async () => {
  const args = process.argv.slice(2);
  const targetUsername = args[0] ? args[0].toLowerCase().trim() : 'sagnik';

  if (!process.env.MONGODB_URI) {
    console.error('Error: Please configure MONGODB_URI in the .env file.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas for seeding');

    let user = await User.findOne({ username: targetUsername });
    if (!user) {
      user = new User({ username: targetUsername });
      await user.save();
      console.log(`Created user: ${targetUsername}`);
    } else {
      console.log(`User ${targetUsername} exists.`);
    }

    await Task.deleteMany({ username: targetUsername });
    console.log(`Cleared existing tasks for ${targetUsername}`);

    const newTasks = generateTasks().map(t => ({ ...t, username: targetUsername }));
    await Task.insertMany(newTasks);
    console.log(`Successfully seeded ${newTasks.length} highly structured tasks for ${targetUsername}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
