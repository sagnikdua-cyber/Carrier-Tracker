document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUsername');
    if (storedUser) {
        window.location.href = 'dashboard.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const loginBtn = document.getElementById('login-btn');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();

        if (!username) {
            showError('Please enter a username');
            return;
        }

        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';
        loginError.style.display = 'none';

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Save to localStorage
            localStorage.setItem('currentUsername', data.user.username);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';

        } catch (error) {
            showError(error.message);
            loginBtn.disabled = false;
            loginBtn.textContent = 'LOGIN';
        }
    });

    function showError(message) {
        loginError.textContent = message;
        loginError.style.display = 'block';
    }
});
