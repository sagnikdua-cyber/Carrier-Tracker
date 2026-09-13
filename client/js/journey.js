document.addEventListener('DOMContentLoaded', async () => {
    const username = localStorage.getItem('currentUsername');
    if (!username) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('username-display').textContent = username;

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('currentUsername');
        window.location.href = 'index.html';
    });

    const container = document.getElementById('journey-container');
    const loading = document.getElementById('journey-loading');
    const errorMsg = document.getElementById('journey-error');

    async function fetchJourney() {
        try {
            const response = await fetch('/api/tasks/journey', {
                headers: { 'x-username': username }
            });
            const data = await response.json();
            
            if (response.ok) {
                renderJourney(data);
            } else {
                showError(data.error || 'Failed to load journey');
            }
        } catch (error) {
            showError('Network error loading journey');
        }
    }

    function formatTime(mins) {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
    }

    function calculateBlockTime(tasks) {
        return tasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
    }

    function calculateDayTime(blocks) {
        let sum = 0;
        for (const block in blocks) {
            sum += calculateBlockTime(blocks[block]);
        }
        return sum;
    }

    function renderJourney(data) {
        loading.style.display = 'none';
        container.innerHTML = '';

        if (Object.keys(data).length === 0) {
            container.innerHTML = '<p>Your journey is empty. Seed some tasks to get started!</p>';
            return;
        }

        // Year Loop
        for (const year in data) {
            const yearNode = document.createElement('details');
            yearNode.className = 'year-node';
            // Default to open for the first year we encounter (2026)
            if (year === '2026') yearNode.open = true;
            yearNode.innerHTML = `<summary class="year-title">${year}</summary><div class="details-content">`;
            const yearContent = document.createElement('div');
            
            // Month Loop
            for (const month in data[year]) {
                const monthNode = document.createElement('details');
                monthNode.className = 'month-node';
                // Open first month
                if (month === 'October' && year === '2026') monthNode.open = true;
                monthNode.innerHTML = `<summary class="month-title">${month}</summary><div class="details-content">`;
                const monthContent = document.createElement('div');

                // Week Loop
                for (const week in data[year][month]) {
                    const weekNode = document.createElement('details');
                    weekNode.className = 'week-node';
                    // Open first week
                    if (week === '1' && month === 'October' && year === '2026') weekNode.open = true;
                    weekNode.innerHTML = `<summary class="week-title">Week ${week} — ${month} ${year}</summary><div class="details-content">`;
                    const weekContent = document.createElement('div');

                    // Day Loop
                    const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const daysData = data[year][month][week];
                    
                    daysOrder.forEach(dayName => {
                        if (daysData[dayName]) {
                            const dayTime = formatTime(calculateDayTime(daysData[dayName]));
                            
                            const dayNode = document.createElement('div');
                            dayNode.className = 'day-node';
                            
                            const dayHeader = document.createElement('div');
                            dayHeader.className = 'day-header';
                            dayHeader.innerHTML = `<h3>${dayName}</h3><div class="day-meta">${dayTime} planned</div>`;
                            dayNode.appendChild(dayHeader);

                            const blocksContainer = document.createElement('div');
                            blocksContainer.className = 'blocks-container';

                            // Block Loop
                            for (const blockName in daysData[dayName]) {
                                const tasks = daysData[dayName][blockName];
                                const blockTime = formatTime(calculateBlockTime(tasks));

                                const blockNode = document.createElement('div');
                                blockNode.className = 'study-block';
                                
                                blockNode.innerHTML = `
                                    <div class="block-header">
                                        <span class="block-name">${blockName}</span>
                                        <span class="block-time">${blockTime}</span>
                                    </div>
                                `;

                                // Task Loop
                                tasks.forEach(task => {
                                    const taskNode = document.createElement('div');
                                    taskNode.className = `task-item ${task.status === 'completed' ? 'completed' : ''}`;
                                    
                                    const badges = [];
                                    if (task.category) badges.push(`<span class="badge badge-category">${task.category}</span>`);
                                    if (task.trackers && task.trackers.length) {
                                        task.trackers.forEach(t => badges.push(`<span class="badge badge-tracker">${t}</span>`));
                                    }

                                    let resourcesHtml = '';
                                    if (task.resources && task.resources.length > 0) {
                                        resourcesHtml = '<div class="task-resources">';
                                        task.resources.forEach(res => {
                                            const icon = res.type === 'Video' ? '🎥' : (res.type === 'Practice' ? '📝' : '📖');
                                            resourcesHtml += `
                                                <div class="resource-item">
                                                    <span class="resource-icon">${icon}</span>
                                                    <span>${res.name} — <a href="${res.url}" target="_blank" class="resource-link">Open ${res.type}</a></span>
                                                </div>
                                            `;
                                        });
                                        resourcesHtml += '</div>';
                                    }

                                    taskNode.innerHTML = `
                                        <input type="checkbox" class="task-checkbox" data-id="${task._id}" ${task.status === 'completed' ? 'checked' : ''}>
                                        <div class="task-content">
                                            <div class="task-title">
                                                <span>${task.title}</span>
                                                <span class="task-est">${task.estimatedTime}m</span>
                                            </div>
                                            <div class="task-meta">${badges.join('')}</div>
                                            ${resourcesHtml}
                                        </div>
                                    `;

                                    // Handle checkbox toggle
                                    const checkbox = taskNode.querySelector('.task-checkbox');
                                    checkbox.addEventListener('change', async (e) => {
                                        const newStatus = e.target.checked ? 'completed' : 'pending';
                                        try {
                                            await fetch(`/api/tasks/${task._id}`, {
                                                method: 'PATCH',
                                                headers: { 'Content-Type': 'application/json', 'x-username': username },
                                                body: JSON.stringify({ status: newStatus })
                                            });
                                            taskNode.classList.toggle('completed', e.target.checked);
                                        } catch (err) {
                                            console.error('Failed to update status', err);
                                            e.target.checked = !e.target.checked; // revert UI
                                        }
                                    });

                                    blockNode.appendChild(taskNode);
                                });

                                blocksContainer.appendChild(blockNode);
                            }

                            dayNode.appendChild(blocksContainer);
                            weekContent.appendChild(dayNode);
                        }
                    });

                    weekNode.appendChild(weekContent);
                    monthContent.appendChild(weekNode);
                }
                monthNode.appendChild(monthContent);
                yearContent.appendChild(monthNode);
            }
            yearNode.appendChild(yearContent);
            container.appendChild(yearNode);
        }
    }

    function showError(msg) {
        loading.style.display = 'none';
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
    }

    fetchJourney();
});
