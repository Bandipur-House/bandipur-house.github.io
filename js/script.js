// This file contains JavaScript code for interactivity on the website, such as event handling and dynamic content updates.

// Use Event Delegation for Smooth Scrolling on dynamically loaded content
document.addEventListener('click', function(e) {
    // Find the closest ancestor anchor tag with href starting with #
    const link = e.target.closest('a[href^="#"]');

    if (link) {
        const href = link.getAttribute('href');
        // Check if it's just a hash and not just '#'
        if (href && href.length > 1 && href.startsWith('#')) {
            const targetId = href;
            try {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault(); // Prevent default jump only if target exists

                    // Calculate scroll offset based on header height
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 0; // Get header height or 0 if not found
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                    console.log(`Scrolling to: ${targetId}, Offset: ${offsetPosition}, Header Height: ${headerHeight}`);

                    // Use window.scrollTo for smooth scroll with offset
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                } else {
                    console.warn(`Smooth scroll target not found: ${targetId}`);
                    // Allow default behavior if target isn't found (e.g., link to another page)
                }
            } catch (error) {
                console.error(`Error finding or scrolling to target ${targetId}:`, error);
                // Allow default behavior in case of querySelector error
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Example: Event listener for a button click (if any buttons are present)
    // Make sure this button is NOT dynamically loaded, or use delegation too.
    const exampleButton = document.getElementById('exampleButton');
    if (exampleButton) {
        exampleButton.addEventListener('click', function() {
            alert('Button clicked!');
        });
    }

    // Optimize video loading on pages
    const bgVideos = document.querySelectorAll('.hero-video-background');
    
    bgVideos.forEach(video => {
        // When video loads
        video.addEventListener('loadeddata', function() {
            video.classList.add('loaded');
            console.log('Background video loaded successfully');
        });
        
        // If video fails to load
        video.addEventListener('error', function(e) {
            console.error('Error loading background video:', e);
            // Add a class to the container to show a fallback background
            video.closest('.hero-video-container')?.classList.add('video-error');
        });
    });
    
    // Optimize navigation between pages
    function updatePageLoadingProgress() {
        const barElem = document.querySelector('.page-load-progress');
        if (barElem) return;
        
        let progress = 0;
        const bar = document.createElement('div');
        bar.className = 'page-load-progress';
        document.body.appendChild(bar);
        
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 90) {
                clearInterval(interval);
            }
            bar.style.width = Math.min(progress, 90) + '%';
        }, 200);
        
        window.addEventListener('load', () => {
            bar.style.width = '100%';
            setTimeout(() => {
                bar.classList.add('finished');
                setTimeout(() => bar.remove(), 300);
            }, 300);
            clearInterval(interval);
        });
    }
    
    // Initialize page loading indicator for navigation
    const pageLinks = document.querySelectorAll('a:not([href^="#"]):not([target="_blank"])');
    pageLinks.forEach(link => {
        link.addEventListener('click', updatePageLoadingProgress);
    });
});