document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const eventDetailsModal = document.getElementById('eventDetailsModal');
    const eventRegistrationModal = document.getElementById('eventRegistrationModal');
    
    // Get close buttons
    const closeButtons = document.querySelectorAll('.close');
    
    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            eventDetailsModal.style.display = 'none';
            eventRegistrationModal.style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === eventDetailsModal) {
            eventDetailsModal.style.display = 'none';
        }
        if (event.target === eventRegistrationModal) {
            eventRegistrationModal.style.display = 'none';
        }
    });
    
    // Fetch events from server
    fetch('/api/events')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayEvents(data.events);
            } else {
                document.getElementById('eventsContainer').innerHTML = '<p>Error loading events. Please try again later.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('eventsContainer').innerHTML = '<p>Error loading events. Please try again later.</p>';
        });
    
    // Function to display events
    function displayEvents(events) {
        const eventsContainer = document.getElementById('eventsContainer');
        eventsContainer.innerHTML = '';
        
        if (events.length === 0) {
            eventsContainer.innerHTML = '<p>No upcoming events at the moment.</p>';
            return;
        }
        
        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <div class="event-image">
                    <img src="${event.image_url || 'images/default-event.jpg'}" alt="${event.title}">
                </div>
                <div class="event-content">
                    <h3>${event.title}</h3>
                    <p class="event-date">${formatDate(event.date)} at ${formatTime(event.time)}</p>
                    <p class="event-venue">${event.venue}</p>
                    <p class="event-description">${truncateText(event.description, 100)}</p>
                    <div class="event-buttons">
                        <button class="btn-event-details" data-event-id="${event.id}">See Details</button>
                        <button class="btn-event-register" data-event-id="${event.id}">Register Now</button>
                    </div>
                </div>
            `;
            eventsContainer.appendChild(eventCard);
        });
        
        // Add event listeners to buttons
        document.querySelectorAll('.btn-event-details').forEach(button => {
            button.addEventListener('click', function() {
                const eventId = this.getAttribute('data-event-id');
                showEventDetails(eventId);
            });
        });
        
        document.querySelectorAll('.btn-event-register').forEach(button => {
            button.addEventListener('click', function() {
                const eventId = this.getAttribute('data-event-id');
                document.getElementById('eventId').value = eventId;
                eventRegistrationModal.style.display = 'block';
            });
        });
    }
    
    // Function to show event details
    function showEventDetails(eventId) {
        fetch(`/api/events/${eventId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const event = data.event;
                    const detailsContainer = document.getElementById('eventDetailsContainer');
                    detailsContainer.innerHTML = `
                        <h2>${event.title}</h2>
                        <div class="event-details-image">
                            <img src="${event.image_url || 'images/default-event.jpg'}" alt="${event.title}">
                        </div>
                        <div class="event-details-info">
                            <p><strong>Date:</strong> ${formatDate(event.date)}</p>
                            <p><strong>Time:</strong> ${formatTime(event.time)}</p>
                            <p><strong>Venue:</strong> ${event.venue}</p>
                        </div>
                        <div class="event-details-description">
                            <h3>Description</h3>
                            <p>${event.description}</p>
                        </div>
                        <div class="event-details-actions">
                            <button class="btn-event-register" data-event-id="${event.id}">Register Now</button>
                        </div>
                    `;
                    
                    // Add event listener to register button
                    detailsContainer.querySelector('.btn-event-register').addEventListener('click', function() {
                        document.getElementById('eventId').value = eventId;
                        eventDetailsModal.style.display = 'none';
                        eventRegistrationModal.style.display = 'block';
                    });
                    
                    eventDetailsModal.style.display = 'block';
                } else {
                    alert('Error loading event details. Please try again later.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error loading event details. Please try again later.');
            });
    }
    
    // Handle event registration form submission
    const eventRegistrationForm = document.getElementById('eventRegistrationForm');
    eventRegistrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            eventId: document.getElementById('eventId').value,
            name: document.getElementById('regName').value,
            email: document.getElementById('regEmail').value,
            phone: document.getElementById('regPhone').value,
            message: document.getElementById('regMessage').value
        };
        
        // Send data to server
        fetch(`/api/events/${formData.eventId}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Thank you for registering for the event! We will contact you soon with further details.');
                eventRegistrationForm.reset();
                eventRegistrationModal.style.display = 'none';
            } else {
                alert('Registration failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    });
    
    // Helper functions
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }
    
    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }
});