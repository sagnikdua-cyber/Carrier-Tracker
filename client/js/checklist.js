document.addEventListener('DOMContentLoaded', () => {
    // 1. Auth check
    const username = localStorage.getItem('currentUsername');
    if (!username) {
        window.location.href = 'index.html';
        return;
    }
    
    const displayEl = document.getElementById('username-display');
    if (displayEl) {
        displayEl.textContent = username;
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUsername');
            window.location.href = 'index.html';
        });
    }

    // 2. Tab switching logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.style.display = 'none');
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active to clicked
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            if(targetContent) {
                targetContent.style.display = 'block';
                targetContent.classList.add('active');
            }
        });
    });

    // 3. Checkbox persistence logic
    const storageKey = `checklist_${username}`;
    
    // Load existing state
    let checklistState = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        // Set initial state
        if (checklistState[checkbox.id]) {
            checkbox.checked = true;
        }

        // Listen for changes
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                checklistState[e.target.id] = true;
            } else {
                delete checklistState[e.target.id]; // Remove if unchecked to save space
            }
            
            // Save to local storage
            localStorage.setItem(storageKey, JSON.stringify(checklistState));
        });
    });
});
