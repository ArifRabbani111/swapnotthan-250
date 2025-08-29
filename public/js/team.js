document.addEventListener('DOMContentLoaded', function() {
    // Fetch team members from server
    fetch('/api/team')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayTeamMembers(data.teamMembers);
            } else {
                document.getElementById('teamContainer').innerHTML = '<p>Error loading team members. Please try again later.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('teamContainer').innerHTML = '<p>Error loading team members. Please try again later.</p>';
        });
    
    // Function to display team members
    function displayTeamMembers(teamMembers) {
        const teamContainer = document.getElementById('teamContainer');
        teamContainer.innerHTML = '';
        
        if (teamMembers.length === 0) {
            teamContainer.innerHTML = '<p>No team members to display at the moment.</p>';
            return;
        }
        
        teamMembers.forEach(member => {
            const memberCard = document.createElement('div');
            memberCard.className = 'team-card';
            memberCard.innerHTML = `
                <div class="member-image">
                    <img src="${member.image_url || 'images/default-avatar.jpg'}" alt="${member.name}">
                </div>
                <div class="member-info">
                    <h3>${member.name}</h3>
                    <p class="member-position">${member.position}</p>
                    <div class="member-social">
                        ${member.facebook_url ? `<a href="${member.facebook_url}" target="_blank"><i class="fab fa-facebook"></i></a>` : ''}
                        ${member.linkedin_url ? `<a href="${member.linkedin_url}" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                    </div>
                </div>
            `;
            teamContainer.appendChild(memberCard);
        });
    }
});