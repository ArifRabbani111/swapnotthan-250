document.addEventListener('DOMContentLoaded', function() {
    // Get modal element
    const journeyModal = document.getElementById('journeyModal');
    
    // Get button element
    const journeyBtn = document.getElementById('ourJourneyBtn');
    
    // Get close button
    const closeButton = journeyModal.querySelector('.close');
    
    // Open modal
    journeyBtn.addEventListener('click', function() {
        journeyModal.style.display = 'block';
    });
    
    // Close modal
    closeButton.addEventListener('click', function() {
        journeyModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === journeyModal) {
            journeyModal.style.display = 'none';
        }
    });
    
    // Slideshow functionality
    let slideIndex = 1;
    showSlides(slideIndex);
    
    // Next/previous controls
    window.changeSlide = function(n) {
        showSlides(slideIndex += n);
    }
    
    // Thumbnail image controls
    window.currentSlide = function(n) {
        showSlides(slideIndex = n);
    }
    
    function showSlides(n) {
        let i;
        const slides = document.getElementsByClassName("slide");
        const dots = document.getElementsByClassName("dot");
        
        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }
        
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";
    }
    
    // Auto-advance slideshow
    setInterval(function() {
        slideIndex++;
        showSlides(slideIndex);
    }, 5000);
});