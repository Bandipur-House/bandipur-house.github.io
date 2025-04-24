// JavaScript specific to the header component

// --- Navigation Initialization ---
function initNavigation(navToggle, mobileNav, overlay) {
    console.log("Initializing navigation listeners...");
    if (!navToggle || !mobileNav || !overlay) {
        console.error("initNavigation called with missing elements:", { navToggle, mobileNav, overlay });
        return; // Stop if essential elements are missing
    }

    // --- Navigation Helper Functions ---
    function openNav() {
        // Double check elements exist before modifying
        if (!mobileNav || !navToggle || !overlay) {
             console.error("openNav: One or more navigation elements missing!");
             return;
        }
        if (!mobileNav.classList.contains('active')) {
            navToggle.classList.add('active');
            mobileNav.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('nav-open'); // Prevent background scroll
        }
    }

    function closeNav() {
         // Double check elements exist before modifying
        if (!mobileNav || !navToggle || !overlay) {
             console.error("closeNav: One or more navigation elements missing!");
             return;
        }
        if (mobileNav.classList.contains('active')) {
            navToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('nav-open'); // Allow background scroll
        }
    }

    // Function to highlight the active navigation link in both navs
    function highlightActiveLink() {
        const currentPage = window.location.pathname;
        const desktopNav = document.querySelector('.main-nav');
        
        let homeLink = null;
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === 'index.html') {
                homeLink = link;
            }
        });
        
        // Update links in mobile nav
        if (mobileNav) {
            const mobileNavLinks = mobileNav.querySelectorAll('.nav-link');
            mobileNavLinks.forEach(link => {
                link.classList.remove('active');
                const linkPath = link.getAttribute('href');
    
                // Logic to determine active link based on current page path
                if (linkPath === currentPage || (currentPage === '/' && link === homeLink)) {
                    link.classList.add('active');
                } else if (linkPath !== '/' && currentPage.startsWith(linkPath) && linkPath.length > 1) {
                    if (currentPage === linkPath) {
                        link.classList.add('active');
                    }
                }
            });
        }
        
        // Also update links in desktop nav if it exists
        if (desktopNav) {
            const desktopLinks = desktopNav.querySelectorAll('.nav-link');
            desktopLinks.forEach(link => {
                link.classList.remove('active');
                const linkPath = link.getAttribute('href');

                // Logic to determine active link based on current page path
                if (linkPath === currentPage || (currentPage === '/' && link === homeLink)) {
                     link.classList.add('active');
                } else if (linkPath !== '/' && currentPage.startsWith(linkPath) && linkPath.length > 1) {
                     if (currentPage === linkPath) {
                        link.classList.add('active');
                     }
                }
            });
        }
    }

    // --- Attach Event Listeners ---
    // Toggle navigation menu
    if (navToggle) {
        // Remove any existing listener first to prevent duplicates if script runs multiple times
        navToggle.removeEventListener('click', handleNavToggle); 
        navToggle.addEventListener('click', handleNavToggle);
        console.log("Nav toggle click listener attached.");
    } else {
        console.error("Cannot attach listener: navToggle element not found.");
    }

    // Handler function to keep listener logic clean
    function handleNavToggle(event) {
        event.stopPropagation(); // Prevent event bubbling
        // Check mobileNav existence again inside the handler
        if (!mobileNav) {
            console.error("Mobile nav element not found inside click handler!");
            return;
        }
        // Toggle navigation state
        if (mobileNav.classList.contains('active')) {
            closeNav();
        } else {
            openNav();
        }
    }

    // Close menu when clicking the overlay
    if (overlay) {
         // Remove any existing listener first
        overlay.removeEventListener('click', handleOverlayClick);
        overlay.addEventListener('click', handleOverlayClick);
        console.log("Overlay click listener attached.");
    } else {
         console.error("Cannot attach listener: overlay element not found.");
    }
    
    function handleOverlayClick() {
        closeNav();
    }


    // Initial setup
    highlightActiveLink(); // Highlight on load
    console.log("Navigation functionality initialized successfully.");
}


// --- Initialization Trigger ---

// Primary initialization trigger: Custom event for dynamically loaded components
document.addEventListener('headerLoaded', () => {
    console.log("headerLoaded event received, initializing header script...");

    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const mobileNavContainer = document.querySelector('.mobile-nav-container');
    const mobileNav = mobileNavContainer ? mobileNavContainer.querySelector('.mobile-main-nav') : null; 
    const overlay = document.querySelector('.nav-overlay'); 

    // Debug logging for element finding
    console.log("DOM Elements found for init:");
    console.log("- header:", !!header);
    console.log("- navToggle:", !!navToggle);
    console.log("- mobileNavContainer:", !!mobileNavContainer);
    console.log("- mobileNav:", !!mobileNav); 
    console.log("- overlay:", !!overlay);
    
    // Check computed styles if toggle exists
    if (navToggle) {
        const navToggleStyle = window.getComputedStyle(navToggle);
        console.log("Nav toggle computed visibility:", navToggleStyle.visibility);
        console.log("Nav toggle computed display:", navToggleStyle.display);
        console.log("Nav toggle computed opacity:", navToggleStyle.opacity);
    }

    // --- Add Scroll Effect ---
    const scrollThreshold = 50; // Pixels to scroll before adding class
    let lastScrollY = window.scrollY; 

    const handleHeaderScroll = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScrollY = window.scrollY; 
    };

    // Attach scroll listener
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    // Apply initial state in case the page loads already scrolled
    handleHeaderScroll();
    console.log("Header scroll listener attached.");


    // --- Initialize Navigation ---
    // Ensure all elements are correctly found before initializing
    if (navToggle && mobileNav && overlay && header) {
        console.log("All required navigation elements found, calling initNavigation.");
        initNavigation(navToggle, mobileNav, overlay);
    } else {
        // Log which specific element is missing
        console.error("Header initialization failed: One or more critical elements missing.");
        if (!navToggle) console.error("- navToggle missing");
        if (!mobileNav) console.error("- mobileNav missing (check inside .mobile-nav-container)");
        if (!overlay) console.error("- overlay missing (should be in main HTML)");
        if (!header) console.error("- header missing");
        
        // Fallback creation logic (if needed, though ideally elements should exist)
        if (!navToggle) {
            console.log("Creating fallback nav toggle (hamburger) element");
            const fallbackToggle = document.createElement('button');
            fallbackToggle.className = 'nav-toggle';
            fallbackToggle.id = 'nav-toggle';
            fallbackToggle.setAttribute('aria-label', 'Toggle navigation menu');
            
            // Create hamburger lines
            for (let i = 0; i < 3; i++) {
                const span = document.createElement('span');
                fallbackToggle.appendChild(span);
            }
            
            // Add to header
            if (header) {
                header.querySelector('.header-wrapper').appendChild(fallbackToggle);
                // navToggle = fallbackToggle; // Re-assign if needed elsewhere
                console.log("Fallback hamburger menu created and added to header");
            }
        }
        
        // Attempt to create overlay element if missing
        if (!overlay) {
            console.log("Creating fallback overlay element");
            const fallbackOverlay = document.createElement('div');
            fallbackOverlay.className = 'nav-overlay';
            fallbackOverlay.id = 'nav-overlay';
            document.body.appendChild(fallbackOverlay);
        }
    }

}, { once: true }); // Ensure this listener runs only once
