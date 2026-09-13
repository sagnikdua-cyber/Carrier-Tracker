const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const username = process.argv[2] || 'sagnik';

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function generateJourney() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas for Journey Generation');

    const user = await User.findOne({ username });
    if (!user) {
      console.log(`User ${username} not found! Run the main seed first.`);
      process.exit(1);
    }

    // 1. Exam Mode Dates (Planning Assumptions)
    const examDates = [
      { start: new Date('2026-10-30'), end: new Date('2026-12-16') }, // Sem 3
      { start: new Date('2027-02-23'), end: new Date('2027-02-26') }, // Sem 4 Term 1
      { start: new Date('2027-04-05'), end: new Date('2027-05-18') }, // Sem 4 Term 2 & Finals
      { start: new Date('2027-10-30'), end: new Date('2027-12-16') }, // Sem 5
      { start: new Date('2028-02-23'), end: new Date('2028-02-26') }, // Sem 6 Term 1
      { start: new Date('2028-04-05'), end: new Date('2028-05-18') }, // Sem 6 Term 2 & Finals
      { start: new Date('2028-10-30'), end: new Date('2028-12-16') }, // Sem 7
      { start: new Date('2029-02-23'), end: new Date('2029-02-26') }, // Sem 8 Term 1
      { start: new Date('2029-04-05'), end: new Date('2029-05-18') }  // Sem 8 Term 2 & Finals
    ];

    function isExamMode(date) {
      return examDates.some(range => date >= range.start && date <= range.end);
    }

    // 2. Syllabus Queues (Progression)
    
    // 2a. DSA Progression (Oct 2026 -> Jul 2029)
    const dsaTopics = [
      'Arrays - Traversal, insertion, deletion', 'Arrays - Prefix sums, two pointers', 'Strings - Frequency counting, manipulation',
      'Searching - Linear/binary search', 'Sorting - Bubble, selection, insertion', 'Sorting - Merge, quick sort',
      'Linked Lists - Singly LL implementation', 'Linked Lists - DLL and circular LL', 'Linked Lists - Fast/slow pointers',
      'Stacks - Array & LL implementation', 'Stacks - Parentheses, NGE problems', 'Queues - Implementation, circular queues',
      'Hashing - HashMaps, HashSets, collisions', 'Trees - Binary tree traversals', 'Trees - BST insertion/deletion',
      'Trees - LCA, diameter, depth problems', 'Heaps - Min/max heap implementation', 'Heaps - Priority queue applications',
      'Graphs - BFS/DFS traversal', 'Graphs - Cycle detection, topological sort', 'Graphs - Dijkstra shortest path',
      'Graphs - Minimum Spanning Tree (Prim/Kruskal)', 'Recursion - Backtracking basics (N-Queens)', 'Dynamic Programming - Memoization vs Tabulation',
      'Dynamic Programming - Knapsack, LCS', 'Dynamic Programming - LIS, Matrix Chain', 'Greedy - Interval scheduling, Huffman coding',
      'Trie - Implementation and prefix search', 'Segment Trees - Range queries', 'Bit Manipulation - XOR, shifting tricks'
    ];
    let dsaIndex = 0;
    const getDsaTask = () => { const t = dsaTopics[dsaIndex % dsaTopics.length]; dsaIndex++; return t; };

    // 2b. GATE Progression (Oct 2026 -> Jan 2028)
    const gateTopics = [
      'Digital Logic - Boolean Algebra', 'Digital Logic - Combinational Circuits', 'Digital Logic - Sequential Circuits',
      'COA - Machine Instructions', 'COA - Pipelining', 'COA - Memory Hierarchy & Cache',
      'Programming - C Basics & Pointers', 'Data Structures - Arrays, Stacks, Queues', 'Algorithms - Asymptotic Analysis',
      'TOC - Regular Languages & DFA', 'TOC - Context Free Languages & PDA', 'TOC - Turing Machines & Undecidability',
      'Compiler Design - Lexical & Syntax Analysis', 'Compiler Design - Parsing & Code Gen', 'OS - Process & Threads',
      'OS - CPU Scheduling & Synchronization', 'OS - Deadlocks & Memory Management', 'DBMS - ER Model & Relational Algebra',
      'DBMS - SQL & Normalization', 'DBMS - Transactions & Concurrency', 'CN - OSI Model & Data Link Layer',
      'CN - Network Layer & IP Routing', 'CN - Transport & Application Layers', 'Math - Linear Algebra & Calculus',
      'Math - Probability & Statistics', 'Discrete Math - Set Theory & Logic', 'Discrete Math - Graph Theory',
      'DA - Supervised Learning & Regression', 'DA - Classification & Clustering', 'DA - AI & Optimization Basics'
    ];
    let gateIndex = 0;
    const getGateTask = () => { const t = gateTopics[gateIndex % gateTopics.length]; gateIndex++; return t; };

    // 2c. TCS NQT Progression (Oct 2026 -> Jan 2028)
    const tcsTopics = [
      'Numerical - Number System & HCF/LCM', 'Numerical - Percentages & Ratios', 'Numerical - Profit/Loss & SI/CI',
      'Numerical - Time/Work & Speed/Distance', 'Reasoning - Series & Analogy', 'Reasoning - Blood Relations & Directions',
      'Reasoning - Syllogism & Inequality', 'Reasoning - Seating & Puzzles', 'Verbal - Grammar & Error Detection',
      'Verbal - Reading Comprehension', 'Verbal - Cloze Test & Para Jumbles', 'Advanced - Data Interpretation',
      'Advanced - Quantitative Problems', 'Advanced - Reasoning Scenarios', 'Coding - Basic Patterns & String Manipulation',
      'Coding - Array & Math Algorithms', 'Coding - Matrix & Sorting Problems', 'Coding - Advanced Competitive Logic'
    ];
    let tcsIndex = 0;
    const getTcsTask = () => { const t = tcsTopics[tcsIndex % tcsTopics.length]; tcsIndex++; return t; };

    // 2d. Government Exam Progression (Oct 2026 -> May 2029)
    const govTopics = [
      'Quant - Number System basics', 'Quant - Ratio & Proportion advanced', 'Quant - Mensuration & Geometry',
      'Reasoning - Syllogism Mastery', 'Reasoning - Complex Puzzles', 'Reasoning - Input-Output & Data Sufficiency',
      'English - Vocabulary & Idioms', 'English - Long RC Passages', 'English - Phrase Replacement',
      'GA - Indian History & Culture', 'GA - Geography & Polity', 'GA - Economy & General Science',
      'Computer - Fundamentals & Memory', 'Computer - Networking & Internet', 'Computer - MS Office & Security',
      'Banking - RBI & Financial Markets', 'Banking - Loans, NPA & SARFAESI', 'Banking - Monetary Policy & Current Affairs',
      'Railway - Zones & Terminology', 'Railway - Transport Systems & Projects'
    ];
    let govIndex = 0;
    const getGovTask = () => { const t = govTopics[govIndex % govTopics.length]; govIndex++; return t; };

    // 2e. Placement Progression (Jul 2028 -> Jul 2029)
    const placementTopics = [
      'OOP - Classes, Objects, Inheritance', 'OOP - Polymorphism & Abstraction', 'DBMS - SQL Joins & Subqueries',
      'DBMS - ACID & Indexing', 'OS - Deadlocks & Virtual Memory', 'CN - TCP/IP & HTTP/HTTPS',
      'Web Dev - HTML/CSS/JS Basics', 'Web Dev - React & Component State', 'Web Dev - Node.js & Express APIs',
      'Git - Branching, PRs, Merge Conflicts', 'System Design - Scalability Basics', 'Resume & LinkedIn Optimization',
      'Mock HR Interviews', 'Mock Technical Interviews', 'Aptitude & Communication Skills'
    ];
    let placementIndex = 0;
    const getPlacementTask = () => { const t = placementTopics[placementIndex % placementTopics.length]; placementIndex++; return t; };

    // 3. Time Loop Generator
    let currentDate = new Date('2026-10-04'); // Sunday
    const endDate = new Date('2029-07-31');

    console.log('Starting massive procedural generation from Oct 2026 to Jul 2029...');
    
    let totalTasksGenerated = 0;

    // We'll iterate day by day
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const monthStr = currentDate.toLocaleString('default', { month: 'long' });
      const dayOfWeekStr = currentDate.toLocaleString('default', { weekday: 'long' });
      const dayOfWeekNum = currentDate.getDay(); // 0 = Sunday, 1 = Monday...
      
      // Calculate week number (1-5 relative to month)
      const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1);
      const daysOffset = firstDayOfMonth.getDay(); 
      const weekNumber = Math.ceil((currentDate.getDate() + daysOffset) / 7);

      const examMode = isExamMode(currentDate);
      
      // Only generate tasks for Sunday (0) to Thursday (4)
      if (dayOfWeekNum >= 0 && dayOfWeekNum <= 4) {
        
        let dailyTasks = [];

        // Dynamic Priority Logic based on Date
        const isPreJan2028 = currentDate < new Date('2028-01-01');
        const isJan2028 = currentDate.getFullYear() === 2028 && currentDate.getMonth() === 0;
        const isPostJan2028 = currentDate > new Date('2028-01-31');
        
        const isPreJul2028 = currentDate < new Date('2028-07-01');
        const isGovtFinalPhase = currentDate >= new Date('2029-01-01') && currentDate <= new Date('2029-05-31');
        const isPlacementFinalPhase = currentDate >= new Date('2029-06-01');

        if (examMode) {
          // EXAM MODE
          // College heavily prioritized, others reduced/paused
          dailyTasks.push({
            title: `Exam Preparation - College Sem`,
            studyBlock: 'College', category: 'College', subject: 'College Exams',
            estimatedTime: 180, trackers: []
          });
          dailyTasks.push({
            title: `DSA Maintenance - ${getDsaTask()}`,
            studyBlock: 'DSA', category: 'DSA', subject: 'Data Structures',
            estimatedTime: 30, trackers: ['Placement', 'GATE']
          });

        } else {
          // NORMAL MODE (25h/week structure roughly distributed over 5 days -> 5h/day)

          // 1. DSA (Always present)
          dailyTasks.push({
            title: `DSA - ${getDsaTask()}`,
            studyBlock: 'DSA', category: 'DSA', subject: 'Data Structures',
            estimatedTime: 120, trackers: ['Placement', 'GATE']
          });

          // 2. Extra Technology / AI-ML / Project (1h/day)
          // Pause if Jan 2028 GATE rush or May 2029 Govt rush
          if (isJan2028 || isGovtFinalPhase) {
            // Repurpose time to priority
            if (isJan2028) {
              dailyTasks.push({ title: `GATE FULL MOCK & Revision`, studyBlock: 'GATE', category: 'GATE', subject: 'GATE Revision', estimatedTime: 60, trackers: ['GATE'] });
            } else {
              dailyTasks.push({ title: `Govt Full Mock & Current Affairs`, studyBlock: 'Government', category: 'Government', subject: 'Govt Revision', estimatedTime: 60, trackers: ['Government'] });
            }
          } else {
            // Normal Extra Tech
            dailyTasks.push({
              title: `Study ${user.extraTechnology || 'AI/ML'}`,
              studyBlock: user.extraTechnology || 'AI/ML', category: 'Extra Technology', subject: 'Tech',
              estimatedTime: 60, trackers: ['Placement']
            });
          }

          // 3. Government / GATE / TCS (1h/day alternating)
          if (isPreJan2028) {
            // GATE & TCS NQT are priority
            if (dayOfWeekNum === 0 || dayOfWeekNum === 2) {
              dailyTasks.push({ title: `GATE - ${getGateTask()}`, studyBlock: 'Government/GATE', category: 'GATE', subject: 'GATE', estimatedTime: 60, trackers: ['GATE'] });
            } else {
              dailyTasks.push({ title: `TCS NQT - ${getTcsTask()}`, studyBlock: 'TCS NQT', category: 'TCS NQT', subject: 'TCS', estimatedTime: 60, trackers: ['TCS NQT'] });
            }
          } else if (isJan2028) {
            // GATE & TCS Final Mocks
            dailyTasks.push({ title: `Final Mocks (GATE/TCS)`, studyBlock: 'Mocks', category: 'GATE', subject: 'Mocks', estimatedTime: 60, trackers: ['GATE', 'TCS NQT'] });
          } else if (isPostJan2028 && !isPlacementFinalPhase) {
            // Govt Exam Phase
            dailyTasks.push({ title: `Govt - ${getGovTask()}`, studyBlock: 'Government', category: 'Government', subject: 'Govt', estimatedTime: 60, trackers: ['Government'] });
          } else if (isPlacementFinalPhase) {
            // Placement Final Rush
            dailyTasks.push({ title: `Placement - ${getPlacementTask()}`, studyBlock: 'Placement', category: 'Placement', subject: 'Placement', estimatedTime: 60, trackers: ['Placement'] });
          }

          // 4. College (1h/day)
          dailyTasks.push({
            title: `Complete your College tasks`,
            studyBlock: 'College', category: 'College', subject: 'College',
            estimatedTime: 60, trackers: []
          });

        }

        // Save Tasks to DB
        for (const t of dailyTasks) {
          await Task.updateOne(
            { 
              username, 
              date: new Date(currentDate), 
              studyBlock: t.studyBlock,
              title: t.title 
            },
            {
              $set: {
                username,
                title: t.title,
                description: `Procedurally generated task for ${t.category}`,
                date: new Date(currentDate),
                year,
                month: monthStr,
                week: weekNumber.toString(),
                dayOfWeek: dayOfWeekStr,
                studyBlock: t.studyBlock,
                category: t.category,
                subject: t.subject,
                topic: '',
                estimatedTime: t.estimatedTime,
                status: 'pending',
                trackers: t.trackers,
                resources: []
              }
            },
            { upsert: true }
          );
          totalTasksGenerated++;
        }
      }

      // Increment date
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`\nSuccessfully generated/upserted ${totalTasksGenerated} tasks across 34 months!`);
    console.log('Journey is completely populated from Oct 2026 to Jul 2029.');
    process.exit(0);

  } catch (error) {
    console.error('Error in procedural generation:', error);
    process.exit(1);
  }
}

generateJourney();
