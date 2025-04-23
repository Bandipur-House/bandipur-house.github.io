// JavaScript specific to the hero section
console.log("Hero JS loaded");

// Basic video error handling and load optimization
document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.querySelector('.hero-video-background');
    if (heroVideo) {
        // When video loads successfully
        heroVideo.addEventListener('loadeddata', function() {
            console.log("Hero video loaded successfully");
            heroVideo.classList.add('loaded');
        });
        
        // Handle video loading errors
        heroVideo.addEventListener('error', function(e) {
            console.error("Error loading hero video:", e);
            heroVideo.closest('.hero-video-container')?.classList.add('video-error');
        });
    }
});
