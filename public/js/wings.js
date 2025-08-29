document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const wingDetailsModal = document.getElementById('wingDetailsModal');
    const wingJoinModal = document.getElementById('wingJoinModal');
    
    // Get close buttons
    const closeButtons = document.querySelectorAll('.close');
    
    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            wingDetailsModal.style.display = 'none';
            wingJoinModal.style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === wingDetailsModal) {
            wingDetailsModal.style.display = 'none';
        }
        if (event.target === wingJoinModal) {
            wingJoinModal.style.display = 'none';
        }
    });
    
    // Fetch wings from server
    fetch('/api/wings')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayWings(data.wings);
            } else {
                document.querySelector('.wings-grid').innerHTML = '<p>Error loading wings. Please try again later.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.querySelector('.wings-grid').innerHTML = '<p>Error loading wings. Please try again later.</p>';
        });
    
    // Function to display wings
    function displayWings(wings) {
        const wingsGrid = document.querySelector('.wings-grid');
        wingsGrid.innerHTML = '';
        
        wings.forEach(wing => {
            const wingCard = document.createElement('div');
            wingCard.className = 'wing-card';
            wingCard.setAttribute('data-wing-id', wing.id);
            
            // Map wing name to type for styling
            let wingType = '';
            if (wing.name === 'Blood Wing') wingType = 'blood';
            else if (wing.name === 'Education Wing') wingType = 'education';
            else if (wing.name === 'Charity Wing') wingType = 'charity';
            
            wingCard.innerHTML = `
                <div class="wing-image">
                    <img src="images/${wingType}-wing.jpg" alt="${wing.name}">
                </div>
                <div class="wing-content">
                    <h2>${wing.name}</h2>
                    <p>${wing.description}</p>
                    <div class="wing-buttons">
                        <button class="btn-wing-details" data-wing-id="${wing.id}">See Details</button>
                        <button class="btn-wing-join" data-wing-id="${wing.id}" data-wing-name="${wing.name}">Join Now</button>
                    </div>
                </div>
            `;
            wingsGrid.appendChild(wingCard);
        });
        
        // Add event listeners to buttons
        document.querySelectorAll('.btn-wing-details').forEach(button => {
            button.addEventListener('click', function() {
                const wingId = this.getAttribute('data-wing-id');
                showWingDetails(wingId);
            });
        });
        
        document.querySelectorAll('.btn-wing-join').forEach(button => {
            button.addEventListener('click', function() {
                const wingId = this.getAttribute('data-wing-id');
                const wingName = this.getAttribute('data-wing-name');
                
                document.getElementById('wingId').value = wingId;
                document.getElementById('wingName').textContent = wingName;
                wingJoinModal.style.display = 'block';
            });
        });
    }
    
    // Function to show wing details
    function showWingDetails(wingId) {
        fetch(`/api/wings/${wingId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const wing = data.wing;
                    const members = data.members;
                    const detailsContainer = document.getElementById('wingDetailsContainer');
                    
                    let membersHtml = '';
                    if (members.length > 0) {
                        membersHtml = '<div class="wing-members"><h3>Wing Members</h3><div class="members-grid">';
                        members.forEach(member => {
                            membersHtml += `
                                <div class="member-card">
                                    <div class="member-image">
                                        <img src="${member.image_url || 'images/default-avatar.jpg'}" alt="${member.name}">
                                    </div>
                                    <div class="member-info">
                                        <h4>${member.name}</h4>
                                        <p>${member.role}</p>
                                    </div>
                                </div>
                            `;
                        });
                        membersHtml += '</div></div>';
                    }
                    
                    detailsContainer.innerHTML = `
                        <h2>${wing.name}</h2>
                        <div class="wing-details-image">
                            <img src="images/${wing.name.toLowerCase().replace(' ', '-')}-wing.jpg" alt="${wing.name}">
                        </div>
                        <div class="wing-details-description">
                            <h3>About ${wing.name}</h3>
                            <p>${wing.description}</p>
                        </div>
                        <div class="wing-details-activities">
                            <h3>Key Activities</h3>
                            <ul>
                                ${wing.activities.map(activity => `<li>${activity}</li>`).join('')}
                            </ul>
                        </div>
                        ${membersHtml}
                        <div class="wing-details-actions">
                            <button class="btn-wing-join" data-wing-id="${wing.id}" data-wing-name="${wing.name}">Join ${wing.name}</button>
                        </div>
                    `;
                    
                    // Add event listener to join button
                    detailsContainer.querySelector('.btn-wing-join').addEventListener('click', function() {
                        document.getElementById('wingId').value = wing.id;
                        document.getElementById('wingName').textContent = wing.name;
                        wingDetailsModal.style.display = 'none';
                        wingJoinModal.style.display = 'block';
                    });
                    
                    wingDetailsModal.style.display = 'block';
                } else {
                    alert('Error loading wing details. Please try again later.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error loading wing details. Please try again later.');
            });
    }
    
    // Handle wing join form submission
    const wingJoinForm = document.getElementById('wingJoinForm');
    wingJoinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            wingId: document.getElementById('wingId').value,
            name: document.getElementById('wingJoinName').value,
            email: document.getElementById('wingJoinEmail').value,
            phone: document.getElementById('wingJoinPhone').value,
            password: document.getElementById('wingJoinPassword').value,
            skills: document.getElementById('wingJoinSkills').value,
            motivation: document.getElementById('wingJoinMotivation').value
        };
        
        // Send data to server
        fetch('/api/wings/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Thank you for applying to join the wing! We will review your application and contact you soon.');
                wingJoinForm.reset();
                wingJoinModal.style.display = 'none';
            } else {
                alert('Application submission failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    });
});