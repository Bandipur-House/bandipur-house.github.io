// JavaScript specific to the new header component

let headerInitialized = false; // Flag to prevent multiple initializations

// Function to initialize header logic
function initHeader() {
    // Prevent re-initialization
    if (headerInitialized) {
        console.log("Header already initialized.");
        return;
    }
    console.log("Attempting to initialize header...");

    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');
    const overlay = document.querySelector('.nav-overlay'); // Select existing overlay
    const header = document.querySelector('.header'); // Select the header element

    // Check if all required elements are present in the DOM
    if (!navToggle) {
        console.error("Header Init Error: #nav-toggle not found.");
        return; // Stop initialization if toggle is missing
    }
    if (!mainNav) {
        console.error("Header Init Error: #main-nav not found.");
        return; // Stop initialization if nav is missing
    }
    if (!overlay) {
        console.error("Header Init Error: .nav-overlay not found in the HTML.");
        return; // Stop initialization if overlay is missing
    }
    if (!header) {
        console.error("Header Init Error: .header not found.");
        return; // Stop initialization if header is missing
    }

    console.log("Header elements found successfully (#nav-toggle, #main-nav, .nav-overlay, .header). Attaching listeners.");
    headerInitialized = true; // Set flag

    // --- Event Listeners ---

    // Toggle mobile navigation
    navToggle.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent potential conflicts
        console.log("Nav toggle clicked.");
        if (mainNav.classList.contains('active')) {
            closeNav();
        } else {
            openNav();
        }
    });

    // Close nav when clicking overlay
    overlay.addEventListener('click', function() {
        console.log("Overlay clicked.");
        if (mainNav.classList.contains('active')) {
            closeNav();
        }
    });

    // Close nav with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            closeNav();
        }
    });

    // Close menu when clicking nav links (especially useful for single-page apps or hash links)
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
             if (window.innerWidth <= 992) { // Only close on mobile viewports
                 closeNav();
             }
        });
    });

    // Add scroll effect to header
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScrollY = window.scrollY; // Update last scroll position
    }, { passive: true }); // Use passive listener for performance

    // --- Helper Functions ---

    function openNav() {
        console.log("Opening navigation");
        if (!mainNav.classList.contains('active')) {
            navToggle.classList.add('active');
            // --- Force reflow before adding .active for smooth transform transition ---
            mainNav.classList.remove('active'); // Ensure not active
            // Force reflow
            void mainNav.offsetWidth;
            mainNav.classList.add('active');
            // -----------------------------------------------------------
            overlay.classList.add('active');
            document.body.classList.add('nav-open');
            const scrollY = window.scrollY || window.pageYOffset;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        }
    }

    function closeNav() {
        console.log("Closing navigation");
        if (mainNav.classList.contains('active')) {
            navToggle.classList.remove('active');
            mainNav.classList.remove('active');
            overlay.classList.remove('active');
            
            // Re-enable body scroll and restore position
            const scrollY = parseInt(document.body.style.top || '0') * -1;
            document.body.classList.remove('nav-open');
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            
            // Restore scroll position
            window.scrollTo(0, scrollY);
        }
    }

    // --- Active Link Highlighting ---
    function highlightActiveLink() {
        const currentPage = window.location.pathname;
        const homeLink = mainNav.querySelector('.nav-link[href="/index.html"]'); // Specific home link

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPath = link.getAttribute('href');

            if (linkPath === currentPage || (currentPage === '/' && link === homeLink)) {
                 link.classList.add('active');
            } else if (linkPath !== '/' && currentPage.startsWith(linkPath) && linkPath.length > 1) {
                 if (currentPage === linkPath) {
                    link.classList.add('active');
                 }
            }
        });

         const isActiveLinkFound = Array.from(navLinks).some(link => link.classList.contains('active'));
         if (!isActiveLinkFound && (currentPage === '/' || currentPage === '/index.html') && homeLink) {
             homeLink.classList.add('active');
         }
    }

    highlightActiveLink(); // Run on load

    console.log("Header script initialized successfully.");
}

// --- Initialization ---

// Primary initialization trigger: Custom event for dynamically loaded components
document.addEventListener('headerLoaded', function() {
    console.log("Custom 'headerLoaded' event received.");
    initHeader(); // Initialize header when the event is fired
});
