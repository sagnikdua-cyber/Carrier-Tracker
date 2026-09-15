document.addEventListener('DOMContentLoaded', async () => {
    const username = localStorage.getItem('currentUsername');
    if (!username) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('username-display').textContent = username;
    document.getElementById('welcome-message').textContent = `Welcome, ${username.charAt(0).toUpperCase() + username.slice(1)}`;

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('currentUsername');
        window.location.href = 'index.html';
    });

    // Simulate "Today" as Oct 4, 2026 for the seed data
    const simulatedToday = '2026-10-04';
    
    // Fetch User Settings
    async function fetchUserSettings() {
        try {
            const response = await fetch(`/api/users/${username}`);
            const data = await response.json();
            if (response.ok) {
                document.getElementById('extra-tech').value = data.extraTechnology || 'AI/ML';
            }
        } catch (error) {
            console.error('Error fetching user settings:', error);
        }
    }

    // Fetch Time Progress
    async function fetchTimeProgress() {
        try {
            const response = await fetch(`/api/progress/time?date=${simulatedToday}`, {
                headers: { 'x-username': username }
            });
            const data = await response.json();
            if (response.ok) {
                document.getElementById('today-date-text').textContent = '(Sunday, Oct 4, 2026)';
                document.getElementById('week-number-text').textContent = `(Week ${data.weekly.weekNumber || 1})`;
                
                // Format functions
                const formatTime = (mins) => {
                    const h = Math.floor(mins / 60);
                    const m = mins % 60;
                    return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
                };

                const dailyRem = Math.max(0, data.daily.planned - data.daily.completed);
                const weeklyRem = Math.max(0, data.weekly.planned - data.weekly.completed);

                document.getElementById('daily-planned').textContent = formatTime(data.daily.planned);
                document.getElementById('daily-completed').textContent = formatTime(data.daily.completed);
                document.getElementById('daily-remaining').textContent = formatTime(dailyRem);
                
                const dailyPct = data.daily.planned > 0 ? Math.round((data.daily.completed / data.daily.planned) * 100) : 0;
                document.getElementById('daily-progress-bar').style.width = `${dailyPct}%`;
                document.getElementById('daily-progress-text').textContent = `${dailyPct}%`;

                document.getElementById('weekly-planned').textContent = formatTime(data.weekly.planned);
                document.getElementById('weekly-completed').textContent = formatTime(data.weekly.completed);
                document.getElementById('weekly-remaining').textContent = formatTime(weeklyRem);
                
                const weeklyPct = data.weekly.planned > 0 ? Math.round((data.weekly.completed / data.weekly.planned) * 100) : 0;
                document.getElementById('weekly-progress-bar').style.width = `${weeklyPct}%`;
                document.getElementById('weekly-progress-text').textContent = `${weeklyPct}%`;
            }
        } catch (error) {
            console.error('Error fetching time progress:', error);
        }
    }

    // Fetch Tracker Progress
    async function fetchTrackerProgress() {
        try {
            const response = await fetch('/api/progress', {
                headers: { 'x-username': username }
            });
            const data = await response.json();
            if (response.ok) {
                const gov = data['Government'] || 0;
                const gate = data['GATE'] || 0;
                const tcs = data['TCS NQT'] || 0;
                const placement = data['Placement'] || 0;

                updateCircularTracker('gov', gov);
                updateCircularTracker('gate', gate);
                updateCircularTracker('tcs', tcs);
                updateCircularTracker('placement', placement);

                // Calculate Overall
                const totalPct = (gov + gate + tcs + placement) / 4;
                
                updateCircularTracker('overall', totalPct, true);
            }
        } catch (error) {
            console.error('Error fetching tracker progress:', error);
        }
    }

    function updateCircularTracker(prefix, percentage, isLarge = false) {
        const textEl = document.getElementById(`${prefix}-text`);
        const circle = document.querySelector(`.${prefix}-progress, .${prefix}-progress-stroke`);
        
        if (textEl) textEl.textContent = `${Math.round(percentage)}%`;
        if (circle) {
            const radius = isLarge ? 45 : 35;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (percentage / 100) * circumference;
            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = offset;
        }
    }

    // Handle Settings Update
    document.getElementById('tech-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const techInput = document.getElementById('extra-tech').value;
        const msg = document.getElementById('settings-msg');
        
        try {
            const response = await fetch(`/api/users/${username}/technology`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ technology: techInput })
            });
            const data = await response.json();
            if (response.ok) {
                msg.textContent = `Successfully updated to ${data.extraTechnology}. Pending blocks have been updated.`;
                msg.style.color = '#10b981';
            } else {
                msg.textContent = data.error || 'Failed to update technology';
                msg.style.color = '#ef4444';
            }
        } catch (error) {
            msg.textContent = 'Network error updating technology';
            msg.style.color = '#ef4444';
        }
    });

    // Init
    fetchUserSettings();
    fetchTimeProgress();
    fetchTrackerProgress();
});
