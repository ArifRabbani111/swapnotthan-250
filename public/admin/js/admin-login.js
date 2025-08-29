document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');
    
    adminLoginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        
        console.log('Submitting login form with:', { email, password: '***' });
        
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            console.log('Response status:', response.status);
            
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Non-JSON response:', text);
                loginError.textContent = 'Server returned non-JSON response. Please check server logs.';
                return;
            }
            
            const data = await response.json();
            console.log('Response data:', data);
            
            if (data.success) {
                // Check if user is admin
                if (data.user.userType === 'admin') {
                    // Store token in localStorage
                    localStorage.setItem('adminToken', data.token);
                    localStorage.setItem('adminUser', JSON.stringify(data.user));
                    
                    console.log('Login successful, redirecting to dashboard');
                    
                    // Redirect to dashboard
                    window.location.href = '/admin/dashboard.html';
                } else {
                    console.log('User is not admin:', data.user.userType);
                    loginError.textContent = 'Access denied. Admin privileges required.';
                }
            } else {
                console.log('Login failed:', data.message);
                loginError.textContent = data.message;
            }
        } catch (error) {
            console.error('Error during login:', error);
            loginError.textContent = 'An error occurred. Please try again later.';
        }
    });
});