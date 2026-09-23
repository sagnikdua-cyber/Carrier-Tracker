const fs = require('fs');
const path = require('path');

const files = ['dashboard.html', 'journey.html', 'syllabus.html', 'checklist.html'];

files.forEach(file => {
    const filePath = path.join(__dirname, '../client', file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add the weightage link after the checklist link if it's not already there
    if (!content.includes('href="weightage.html"')) {
        content = content.replace(
            /<a href="checklist\.html"(.*?)>Checklists<\/a>/g,
            '<a href="checklist.html"$1>Checklists</a>\n            <a href="weightage.html">Weightage</a>'
        );
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`${file} already has weightage link`);
    }
});
