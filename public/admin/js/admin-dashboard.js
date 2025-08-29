document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    
    console.log('Checking authentication...');
    console.log('Token exists:', !!adminToken);
    console.log('User:', adminUser);
    
    if (!adminToken || !adminUser.id || adminUser.userType !== 'admin') {
        console.log('Authentication failed, redirecting to login');
        // Clear any invalid data
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login.html';
        return;
    }
    
    console.log('Authentication successful, loading dashboard');
    
    // Set admin name
    document.getElementById('adminName').textContent = adminUser.name;
    
    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login.html';
    });
    
    // ... rest of the dashboard code ...

    
    // Load dashboard statistics
    loadDashboardStats();
    
    // Load recent donations
    loadRecentDonations();
    
    // Load recent messages
    loadRecentMessages();
    
    // Refresh stats button
    document.getElementById('refreshStats').addEventListener('click', function() {
        loadDashboardStats();
        loadRecentDonations();
        loadRecentMessages();
    });
    
    // Function to load dashboard statistics
    async function loadDashboardStats() {
        try {
            console.log('Loading dashboard stats...');
            const response = await fetch('/api/admin/dashboard', {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });
            
            const data = await response.json();
            console.log('Stats response:', data);
            
            if (data.success) {
                document.getElementById('totalUsers').textContent = data.stats.totalUsers;
                document.getElementById('totalVolunteers').textContent = data.stats.totalVolunteers;
                document.getElementById('totalDonations').textContent = data.stats.totalDonations;
                document.getElementById('totalEvents').textContent = data.stats.totalEvents;
            } else {
                console.error('Failed to load stats:', data.message);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }
    
    // Function to load recent donations
    async function loadRecentDonations() {
        try {
            console.log('Loading recent donations...');
            const response = await fetch('/api/admin/donations', {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });
            
            const data = await response.json();
            console.log('Donations response:', data);
            
            if (data.success) {
                const donationsTable = document.getElementById('recentDonations');
                donationsTable.innerHTML = '';
                
                if (data.donations.length === 0) {
                    donationsTable.innerHTML = '<tr><td colspan="4">No donations found</td></tr>';
                    return;
                }
                
                // Show only first 5 donations
                const recentDonations = data.donations.slice(0, 5);
                
                recentDonations.forEach(donation => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${donation.donor_name}</td>
                        <td>৳${donation.amount}</td>
                        <td>${formatDate(donation.donation_date)}</td>
                        <td><span class="status-badge ${donation.status}">${donation.status}</span></td>
                    `;
                    donationsTable.appendChild(row);
                });
            } else {
                console.error('Failed to load donations:', data.message);
            }
        } catch (error) {
            console.error('Error loading donations:', error);
        }
    }
    
    // Function to load recent messages
    async function loadRecentMessages() {
        try {
            console.log('Loading recent messages...');
            const response = await fetch('/api/admin/messages', {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });
            
            const data = await response.json();
            console.log('Messages response:', data);
            
            if (data.success) {
                const messagesTable = document.getElementById('recentMessages');
                messagesTable.innerHTML = '';
                
                if (data.messages.length === 0) {
                    messagesTable.innerHTML = '<tr><td colspan="4">No messages found</td></tr>';
                    return;
                }
                
                // Show only first 5 messages
                const recentMessages = data.messages.slice(0, 5);
                
                recentMessages.forEach(message => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${message.name}</td>
                        <td>${message.email}</td>
                        <td>${formatDate(message.created_at)}</td>
                        <td>
                            <button class="btn-view" data-id="${message.id}">View</button>
                        </td>
                    `;
                    messagesTable.appendChild(row);
                });
                
                // Add event listeners to view buttons
                document.querySelectorAll('.btn-view').forEach(button => {
                    button.addEventListener('click', function() {
                        const messageId = this.getAttribute('data-id');
                        viewMessage(messageId);
                    });
                });
            } else {
                console.error('Failed to load messages:', data.message);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }
    
    // Function to view message details
    async function viewMessage(messageId) {
        try {
            const response = await fetch(`/api/admin/messages/${messageId}`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                const message = data.message;
                alert(`From: ${message.name}\nEmail: ${message.email}\nPhone: ${message.phone}\n\nMessage:\n${message.message}`);
            } else {
                alert('Failed to load message details');
            }
        } catch (error) {
            console.error('Error loading message:', error);
            alert('An error occurred while loading the message');
        }
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString(undefined, options);
    }

});