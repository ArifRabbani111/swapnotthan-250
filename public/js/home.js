document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const joinUsModal = document.getElementById('joinUsModal');
    const donateModal = document.getElementById('donateModal');
    
    // Get button elements
    const joinUsBtn = document.getElementById('joinUsBtn');
    const donateNowBtn = document.getElementById('donateNowBtn');
    
    // Get close buttons
    const closeButtons = document.querySelectorAll('.close');
    
    // Open modals
    joinUsBtn.addEventListener('click', function() {
        joinUsModal.style.display = 'block';
    });
    
    donateNowBtn.addEventListener('click', function() {
        donateModal.style.display = 'block';
    });
    
    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            joinUsModal.style.display = 'none';
            donateModal.style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === joinUsModal) {
            joinUsModal.style.display = 'none';
        }
        if (event.target === donateModal) {
            donateModal.style.display = 'none';
        }
    });
    
    // Handle volunteer form submission
    const volunteerForm = document.getElementById('volunteerForm');
    volunteerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('volName').value,
            email: document.getElementById('volEmail').value,
            phone: document.getElementById('volPhone').value,
            password: document.getElementById('volPassword').value,
            interest: document.getElementById('volInterest').value,
            userType: 'volunteer'
        };
        
        // Send data to server
        fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Thank you for registering as a volunteer! We will contact you soon.');
                volunteerForm.reset();
                joinUsModal.style.display = 'none';
            } else {
                alert('Registration failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    });
    
    // Handle donation form submission
    const donationForm = document.getElementById('donationForm');
    donationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('donorName').value,
            email: document.getElementById('donorEmail').value,
            phone: document.getElementById('donorPhone').value,
            amount: document.getElementById('donationAmount').value,
            bkashNumber: document.getElementById('bkashNumber').value,
            transactionId: document.getElementById('transactionId').value,
            purpose: document.getElementById('donationPurpose').value
        };
        
        // Send data to server
        fetch('/api/donations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Thank you for your donation! We will verify your payment and contact you soon.');
                donationForm.reset();
                donateModal.style.display = 'none';
            } else {
                alert('Donation submission failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    });
});