const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const username = process.argv[2] || 'sagnik';

async function generateJourney() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas for EXHAUSTIVE Journey Generation');

    const user = await User.findOne({ username });
    if (!user) {
      console.log(`User ${username} not found!`);
      process.exit(1);
    }

    // 1. Exam Mode Dates
    const examDates = [
      { start: new Date('2026-10-30'), end: new Date('2026-12-16') },
      { start: new Date('2027-02-23'), end: new Date('2027-02-26') },
      { start: new Date('2027-04-05'), end: new Date('2027-05-18') },
      { start: new Date('2027-10-30'), end: new Date('2027-12-16') },
      { start: new Date('2028-02-23'), end: new Date('2028-02-26') },
      { start: new Date('2028-04-05'), end: new Date('2028-05-18') },
      { start: new Date('2028-10-30'), end: new Date('2028-12-16') },
      { start: new Date('2029-02-23'), end: new Date('2029-02-26') },
      { start: new Date('2029-04-05'), end: new Date('2029-05-18') }
    ];

    function isExamMode(date) {
      return examDates.some(range => date >= range.start && date <= range.end);
    }

    // 2. EXHAUSTIVE SYLLABUS DEFINITIONS
    const gateSyllabus = {
      'Programming': ['variables', 'data types', 'operators', 'conditionals', 'loops', 'functions', 'recursion', 'pointers/references', 'complexity'],
      'Data Structures': ['arrays', 'strings', 'linked lists', 'stacks', 'queues', 'hashing', 'trees', 'BST', 'heaps', 'priority queues', 'graphs'],
      'Algorithms': ['searching', 'sorting', 'recursion', 'divide and conquer', 'greedy', 'dynamic programming', 'backtracking', 'binary search', 'two pointers', 'sliding window', 'prefix sum', 'shortest path', 'MST'],
      'DBMS': ['ER model', 'relational model', 'SQL', 'relational algebra', 'relational calculus', 'functional dependencies', 'normalization', 'transactions', 'concurrency', 'recovery', 'indexing', 'B+ trees'],
      'OS': ['processes', 'threads', 'CPU scheduling', 'synchronization', 'semaphores', 'deadlocks', 'memory management', 'virtual memory', 'file systems', 'I/O'],
      'CN': ['network models', 'data link layer', 'MAC', 'Ethernet', 'IP', 'IPv4', 'IPv6', 'routing', 'TCP', 'UDP', 'congestion control', 'flow control', 'DNS', 'HTTP', 'HTTPS', 'application layer'],
      'COA': ['number representation', 'data representation', 'ISA', 'CPU', 'pipelining', 'memory hierarchy', 'cache', 'I/O', 'interrupts', 'DMA'],
      'TOC': ['regular languages', 'DFA', 'NFA', 'regular expressions', 'CFG', 'PDA', 'CFL', 'Turing machines', 'decidability'],
      'Compiler': ['lexical analysis', 'syntax analysis', 'parsing', 'semantic analysis', 'intermediate code', 'optimization', 'code generation'],
      'Math': ['linear algebra', 'calculus', 'probability', 'statistics'],
      'DA': ['data preprocessing', 'supervised learning', 'regression', 'classification', 'decision trees', 'ensemble methods', 'clustering', 'dimensionality reduction', 'evaluation metrics', 'basic AI', 'optimization']
    };

    const tcsSyllabus = {
      'Numerical': ['number system', 'HCF/LCM', 'percentages', 'ratio', 'average', 'profit/loss', 'SI/CI', 'time/work', 'time-speed-distance'],
      'Reasoning': ['series', 'analogy', 'classification', 'coding', 'blood relations', 'directions', 'ranking', 'syllogism', 'inequality', 'seating', 'puzzles'],
      'Verbal': ['grammar', 'vocabulary', 'error detection', 'sentence correction', 'fillers', 'reading comprehension', 'cloze test', 'para jumbles', 'synonyms', 'antonyms', 'inference', 'connectors', 'phrase replacement'],
      'Advanced': ['advanced quantitative aptitude', 'advanced reasoning', 'data interpretation', 'advanced problem solving', 'coding', 'timed coding', 'coding patterns', 'debugging', 'interview coding']
    };

    const govSyllabus = {
      'Quant': ['number system', 'decimals/fractions', 'HCF/LCM', 'ratio/proportion', 'percentage', 'mensuration', 'time/work', 'time-speed-distance', 'SI/CI', 'profit/loss', 'algebra', 'geometry', 'trigonometry', 'statistics', 'approximation', 'simplification', 'quadratic equations', 'number series', 'data interpretation', 'advanced DI', 'probability', 'permutations/combinations'],
      'Reasoning': ['analogy', 'classification', 'series', 'coding-decoding', 'blood relations', 'directions', 'ranking', 'syllogism', 'inequality', 'Venn diagrams', 'statement/conclusion', 'statement/assumption', 'arguments', 'course of action', 'seating arrangement', 'puzzles', 'data sufficiency', 'input-output', 'non-verbal reasoning', 'critical reasoning'],
      'English': ['grammar', 'vocabulary', 'error detection', 'sentence correction', 'fillers', 'reading comprehension', 'cloze test', 'para jumbles', 'synonyms', 'antonyms', 'idioms', 'long RC', 'inference', 'connectors', 'phrase replacement'],
      'GA/GS': ['history', 'geography', 'polity', 'economy', 'general science', 'static GK', 'current affairs'],
      'Computer': ['computer fundamentals', 'hardware', 'software', 'operating systems', 'memory', 'input/output', 'internet', 'networking', 'IP', 'DNS', 'HTTP', 'HTTPS', 'cybersecurity basics', 'cloud', 'databases', 'MS Office', 'digital payments', 'e-governance'],
      'Banking': ['RBI', 'SBI', 'NABARD', 'SEBI', 'IRDAI', 'PFRDA', 'financial markets', 'banking products', 'loans', 'deposits', 'NPA', 'SARFAESI', 'digital payments', 'NPCI', 'financial inclusion', 'Basel norms', 'monetary policy', 'banking current affairs'],
      'Railway': ['Indian Railways', 'railway zones', 'terminology', 'projects', 'transport systems', 'railway current developments', 'post-specific preparation']
    };

    const placementSyllabus = {
      'DSA': ['arrays', 'strings', 'linked lists', 'stacks', 'queues', 'hashing', 'trees', 'BST', 'heaps', 'graphs', 'sorting', 'searching', 'recursion', 'greedy', 'divide and conquer', 'dynamic programming', 'backtracking', 'shortest path', 'MST', 'common interview patterns'],
      'OOP': ['classes', 'objects', 'inheritance', 'polymorphism', 'abstraction', 'encapsulation', 'interfaces', 'constructors', 'SOLID basics'],
      'DBMS': ['ER model', 'relational model', 'SQL', 'joins', 'subqueries', 'normalization', 'transactions', 'indexing', 'ACID', 'concurrency'],
      'SQL': ['SELECT', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'joins', 'aggregate functions', 'subqueries', 'window functions', 'practical SQL problems'],
      'OS': ['processes', 'threads', 'scheduling', 'synchronization', 'deadlocks', 'memory', 'virtual memory', 'file systems'],
      'CN': ['OSI/TCP-IP', 'IP', 'DNS', 'HTTP/HTTPS', 'TCP/UDP', 'routing', 'networking fundamentals'],
      'GIT/GITHUB': ['repositories', 'branches', 'commits', 'merge', 'pull requests', 'conflicts', '.gitignore', 'README', 'collaboration'],
      'WEB DEV': ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'authentication concepts', 'deployment'],
      'AI/ML': ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'ML fundamentals', 'preprocessing', 'regression', 'classification', 'evaluation metrics', 'model implementation', 'basic deployment'],
      'PROJECTS': ['full-stack project', 'AI/ML project', 'deployed project', 'portfolio', 'documentation'],
      'OPEN SOURCE': ['GitHub workflow', 'issue selection', 'fork', 'branch', 'pull request', 'code review', 'meaningful contributions'],
      'HACKATHONS': ['participation', 'project building', 'pitching', 'teamwork', 'technical presentation'],
      'CAREER': ['resume', 'LinkedIn', 'internship applications', 'technical explanation', 'communication', 'aptitude', 'HR interview', 'technical interview', 'mock interview'],
      'ADVANCED PLACEMENT': ['cloud fundamentals', 'Docker', 'CI/CD', 'system design', 'scalable applications', 'technical writing', 'research paper understanding', 'leadership', 'advanced projects']
    };

    // 3. FLATTEN SYLLABUS INTO QUEUES (Theory & Practice -> Chapter Mocks -> Full Mocks)
    
    function flattenSyllabus(syllabusObj, queueOut, category, trackers) {
      let subtopicCount = 0;
      const subjects = Object.keys(syllabusObj);
      
      for (const subject of subjects) {
        const subtopics = syllabusObj[subject];
        for (const sub of subtopics) {
          subtopicCount++;
          // For smaller subjects, we combine Theory & Practice to save days
          // We can just create one robust task to ensure it finishes before deadlines
          queueOut.push({
            title: `Theory & Practice: ${sub}`,
            subject, topic: sub, category, trackers,
            estimatedTime: 60
          });
        }
        // End of Chapter PYQ / Mini Mock
        queueOut.push({
          title: `PYQ & Mini Mock: ${subject}`,
          subject, topic: 'Chapter Revision', category, trackers,
          estimatedTime: 60
        });
      }

      // After entire syllabus, push 10 Full Mocks/Revisions
      for(let i=1; i<=10; i++) {
        queueOut.push({
          title: `Full Syllabus Mock Test ${i}`,
          subject: 'Full Syllabus', topic: 'Mocks', category, trackers,
          estimatedTime: 120
        });
      }
      return subtopicCount;
    }

    const gateQueue = [];
    const tcsQueue = [];
    const govQueue = [];
    const placementQueue = []; // Serves as DSA/Placement

    const gateTopicsTotal = flattenSyllabus(gateSyllabus, gateQueue, 'GATE', ['GATE']);
    const tcsTopicsTotal = flattenSyllabus(tcsSyllabus, tcsQueue, 'TCS NQT', ['TCS NQT']);
    const govTopicsTotal = flattenSyllabus(govSyllabus, govQueue, 'Government', ['Government']);
    const placementTopicsTotal = flattenSyllabus(placementSyllabus, placementQueue, 'Placement', ['Placement']);

    console.log(`Flattened GATE: ${gateTopicsTotal} topics -> ${gateQueue.length} tasks`);
    console.log(`Flattened TCS: ${tcsTopicsTotal} topics -> ${tcsQueue.length} tasks`);
    console.log(`Flattened Gov: ${govTopicsTotal} topics -> ${govQueue.length} tasks`);
    console.log(`Flattened Placement: ${placementTopicsTotal} topics -> ${placementQueue.length} tasks`);

    // 4. Time Loop Generator
    let currentDate = new Date('2026-10-04'); // Sunday
    const endDate = new Date('2029-07-31');

    let totalTasksGenerated = 0;

    let currentMonthTracker = -1;
    let weekNumber = 1;
    let hasTasksInCurrentWeek = false;

    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const monthStr = currentDate.toLocaleString('default', { month: 'long' });
      const dayOfWeekStr = currentDate.toLocaleString('default', { weekday: 'long' });
      const dayOfWeekNum = currentDate.getDay(); 
      
      // Update month tracker and reset week number if month changes
      if (currentDate.getMonth() !== currentMonthTracker) {
        currentMonthTracker = currentDate.getMonth();
        weekNumber = 1;
        hasTasksInCurrentWeek = false;
      }

      // Increment week number on Sunday, ONLY if we had tasks in the previous week of this month
      if (dayOfWeekNum === 0 && hasTasksInCurrentWeek) {
        weekNumber++;
        hasTasksInCurrentWeek = false;
      }

      const examMode = isExamMode(currentDate);
      
      if (dayOfWeekNum >= 0 && dayOfWeekNum <= 4) {
        hasTasksInCurrentWeek = true;
        let dailyTasks = [];

        if (examMode) {
          dailyTasks.push({
            title: `Exam Preparation - College Sem`, studyBlock: 'College', category: 'College', subject: 'College Exams', estimatedTime: 180, trackers: []
          });
          dailyTasks.push({
            title: `DSA Maintenance - Practice`, studyBlock: 'DSA', category: 'DSA', subject: 'Data Structures', estimatedTime: 30, trackers: ['Placement', 'GATE']
          });
        } else {
          // NORMAL MODE (25h/week structure)

          // 1. Placement / DSA Queue (Always pops)
          const plTask = placementQueue.shift() || { title: `Placement Revision`, subject: 'Revision', category: 'Placement', trackers: ['Placement'], estimatedTime: 120 };
          dailyTasks.push({
            title: plTask.title, studyBlock: 'DSA', category: plTask.category, subject: plTask.subject, estimatedTime: 120, trackers: plTask.trackers, topic: plTask.topic
          });

          // 2. Govt / GATE / TCS logic
          // To ensure GATE and TCS finish by Jan 2028, we give them massive priority
          // GATE needs ~140 tasks. Oct 2026 -> Jan 2028 is ~65 weeks. 
          // At 2 days a week, that's 130 days. Minus exams, maybe 110 days.
          // So we must assign GATE 3-4 times a week, or TCS multiple times.
          
          if (currentDate < new Date('2028-02-01')) {
            // Pre-Jan 2028: Intense GATE + TCS Focus
            
            // GATE pops on Sun, Mon, Tue
            if ([0, 1, 2].includes(dayOfWeekNum)) {
              const gtTask = gateQueue.shift() || { title: 'GATE Final Revision', subject: 'Revision', category: 'GATE', trackers: ['GATE'], estimatedTime: 60 };
              dailyTasks.push({ title: gtTask.title, studyBlock: 'Government/GATE', category: gtTask.category, subject: gtTask.subject, estimatedTime: 60, trackers: gtTask.trackers, topic: gtTask.topic });
            } 
            // TCS pops on Wed, Thu
            else {
              const tcTask = tcsQueue.shift() || { title: 'TCS Final Revision', subject: 'Revision', category: 'TCS NQT', trackers: ['TCS NQT'], estimatedTime: 60 };
              dailyTasks.push({ title: tcTask.title, studyBlock: 'TCS NQT', category: tcTask.category, subject: tcTask.subject, estimatedTime: 60, trackers: tcTask.trackers, topic: tcTask.topic });
            }
          } else {
            // Post-Jan 2028: Intense Govt Focus
            // Pops every day
            const gvTask = govQueue.shift() || { title: 'Govt Final Revision', subject: 'Revision', category: 'Government', trackers: ['Government'], estimatedTime: 60 };
            dailyTasks.push({ title: gvTask.title, studyBlock: 'Government', category: gvTask.category, subject: gvTask.subject, estimatedTime: 60, trackers: gvTask.trackers, topic: gvTask.topic });
          }

          // 3. Extra Technology
          dailyTasks.push({
            title: `Study ${user.extraTechnology || 'AI/ML'}`,
            studyBlock: user.extraTechnology || 'AI/ML', category: 'Extra Technology', subject: 'Tech', estimatedTime: 60, trackers: ['Placement']
          });

          // 4. College 
          dailyTasks.push({
            title: `Complete your College tasks`, studyBlock: 'College', category: 'College', subject: 'College', estimatedTime: 60, trackers: []
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
                description: `Procedurally generated task covering ${t.topic || 'General'}`,
                date: new Date(currentDate),
                year,
                month: monthStr,
                week: weekNumber.toString(),
                dayOfWeek: dayOfWeekStr,
                studyBlock: t.studyBlock,
                category: t.category,
                subject: t.subject,
                topic: t.topic || '',
                estimatedTime: t.estimatedTime,
                status: 'pending',
                trackers: t.trackers || [],
                resources: []
              }
            },
            { upsert: true }
          );
          totalTasksGenerated++;
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`\nSuccessfully generated/upserted ${totalTasksGenerated} tasks across 34 months!`);
    
    // VERIFICATION CHECK
    console.log('\n--- VERIFICATION ---');
    if (gateQueue.length > 0) console.error(`WARNING: GATE queue did not empty! ${gateQueue.length} tasks left.`);
    else console.log(`SUCCESS: GATE syllabus 100% completed by deadline!`);
    
    if (tcsQueue.length > 0) console.error(`WARNING: TCS queue did not empty! ${tcsQueue.length} tasks left.`);
    else console.log(`SUCCESS: TCS syllabus 100% completed by deadline!`);

    if (govQueue.length > 0) console.error(`WARNING: Govt queue did not empty! ${govQueue.length} tasks left.`);
    else console.log(`SUCCESS: Government syllabus 100% completed by deadline!`);

    if (placementQueue.length > 0) console.error(`WARNING: Placement queue did not empty! ${placementQueue.length} tasks left.`);
    else console.log(`SUCCESS: Placement syllabus 100% completed by deadline!`);

    process.exit(0);

  } catch (error) {
    console.error('Error in exhaustive procedural generation:', error);
    process.exit(1);
  }
}

// Wipe existing tasks to guarantee clean exhaustive slate
async function resetAndRun() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Task.deleteMany({ username });
  console.log('Cleared old tasks for clean slate.');
  generateJourney();
}

resetAndRun();
