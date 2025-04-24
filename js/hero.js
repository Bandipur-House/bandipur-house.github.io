// JavaScript specific to the hero section

// Custom event for hero component loaded
document.addEventListener('heroLoaded', function() {
    console.log("heroLoaded event received, initializing hero functionality...");

    const heroVideo = document.querySelector('.hero-video-background');
    if (heroVideo) {
        console.log("Hero video element found, setting up event listeners");

        heroVideo.addEventListener('loadeddata', function() {
            console.log("Hero video loaded successfully");
            heroVideo.classList.add('loaded');
        });

        heroVideo.addEventListener('error', function(e) {
            console.error("Error loading hero video:", e);
            // Add class to container for fallback styling
            const container = heroVideo.closest('.hero-video-container');
            if (container) {
                container.classList.add('video-error');
            } else {
                console.error("Could not find hero-video-container");
            }
        });

        // Smooth scroll for the Discover More button
        const discoverButton = document.querySelector('.discover-btn');
        if (discoverButton) {
            discoverButton.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();

                        // Calculate scroll position taking into account the header height
                        const header = document.querySelector('.header');
                        const headerHeight = header ? header.offsetHeight : 0;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        }
    } else {
        console.log("Hero video element not found");
    }
}, { once: true });

// Basic DOMContentLoaded fallback if the custom event isn't triggered
document.addEventListener('DOMContentLoaded', function() {
    // Check if heroLoaded event hasn't been triggered yet
    if (!window.heroInitialized) {
        document.dispatchEvent(new CustomEvent('heroLoaded'));
        window.heroInitialized = true;
    }
});
