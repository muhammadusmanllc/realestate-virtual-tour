/* ===== REAL ESTATE WEBSITE MAIN JAVASCRIPT ===== */

// ===== GLOBAL VARIABLES =====
let currentFilter = 'all';
let searchQuery = '';
let isLoading = false;

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== MAIN INITIALIZATION =====
function initializeApp() {
    // Initialize all components
    initHeader();
    initMobileMenu();
    initSearch();
    initScrollAnimations();
    initContactForm();
    initPropertyFilters();
    initScrollToTop();
    
    // Load initial data
    loadProperties();
    
    console.log('RealEstate Pro website initialized successfully!');
}

// ===== HEADER FUNCTIONALITY =====
function initHeader() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class for styling
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking on links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }
}

// ===== SEARCH FUNCTIONALITY =====
function initSearch() {
    const navSearchInput = document.querySelector('.nav-search-input');
    const navSearchBtn = document.querySelector('.nav-search-btn');
    const heroSearchInput = document.querySelector('.hero-search-input');
    const heroSearchBtn = document.querySelector('.hero-search-btn');
    
    // Navigation search
    if (navSearchInput && navSearchBtn) {
        navSearchBtn.addEventListener('click', () => performSearch(navSearchInput.value));
        navSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch(navSearchInput.value);
        });
    }
    
    // Hero search
    if (heroSearchInput && heroSearchBtn) {
        heroSearchBtn.addEventListener('click', () => performSearch(heroSearchInput.value));
        heroSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch(heroSearchInput.value);
        });
    }
}

function performSearch(query) {
    if (!query.trim()) return;
    
    searchQuery = query.toLowerCase();
    showLoading(true);
    
    // Simulate search delay for better UX
    setTimeout(() => {
        loadProperties();
        
        // Scroll to properties section
        const propertiesSection = document.getElementById('properties');
        if (propertiesSection) {
            propertiesSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        showLoading(false);
        
        // Show search results message
        showNotification(`Showing results for: "${query}"`);
    }, 800);
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Add stagger animation for property cards
                if (entry.target.classList.contains('property-grid')) {
                    const cards = entry.target.querySelectorAll('.property-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('fade-in-up');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe all scroll reveal elements
    const scrollElements = document.querySelectorAll('.scroll-reveal, .property-grid, .services-grid, .tours-grid');
    scrollElements.forEach(el => observer.observe(el));
}

// ===== PROPERTY FILTERS =====
function initPropertyFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update current filter
            currentFilter = btn.dataset.filter;
            
            // Reload properties with new filter
            showLoading(true);
            setTimeout(() => {
                loadProperties();
                showLoading(false);
            }, 500);
        });
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {};
            
            // Get form data
            const inputs = contactForm.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.value.trim()) {
                    data[input.name || input.placeholder] = input.value;
                }
            });
            
            showLoading(true);
            
            // Simulate form submission
            setTimeout(() => {
                showLoading(false);
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
            }, 1500);
        });
    }
}

// ===== SCROLL TO TOP =====
function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class=\"fas fa-chevron-up\"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(20, 184, 166, 0.3);
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== CTA BUTTON HANDLERS =====
document.addEventListener('click', (e) => {
    // Browse Properties button
    if (e.target.textContent === 'Browse Properties' || e.target.closest('.cta-btn.primary')) {
        const propertiesSection = document.getElementById('properties');
        if (propertiesSection) {
            propertiesSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // List Your Property button
    if (e.target.textContent === 'List Your Property' || e.target.closest('.cta-btn.secondary')) {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            showNotification('Contact us to list your property!');
        }
    }
    
    // Virtual Tour buttons
    if (e.target.closest('.tour-preview')) {
        showNotification('Virtual tour feature coming soon!', 'info');
    }
    
    // Property action buttons
    if (e.target.classList.contains('btn-outline')) {
        const action = e.target.textContent.toLowerCase();
        if (action.includes('view')) {
            showNotification('Property details page coming soon!', 'info');
        } else if (action.includes('contact')) {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
});

// ===== UTILITY FUNCTIONS =====
function showLoading(show) {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = show ? 'flex' : 'none';
    }
    isLoading = show;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#14b8a6'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide notification after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce function for scroll events
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is loaded
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu && navMenu.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Focus management for modal-like elements
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input[type=\"text\"], input[type=\"radio\"], input[type=\"checkbox\"], select'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// ===== BROWSER COMPATIBILITY =====
// Polyfill for IntersectionObserver
if (!window.IntersectionObserver) {
    // Fallback for older browsers
    const scrollElements = document.querySelectorAll('.scroll-reveal');
    scrollElements.forEach(el => el.classList.add('revealed'));
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error occurred:', e.error);
    // Don't show error notifications to users in production
});

// ===== ANALYTICS AND TRACKING =====
function trackEvent(category, action, label = '') {
    // Placeholder for analytics tracking
    console.log(`Track Event: ${category} - ${action} - ${label}`);
    
    // Example: Google Analytics 4
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', action, {
    //         event_category: category,
    //         event_label: label
    //     });
    // }
}

// Track important interactions
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cta-btn')) {
        trackEvent('CTA', 'click', e.target.textContent);
    }
    
    if (e.target.classList.contains('filter-btn')) {
        trackEvent('Filter', 'click', e.target.dataset.filter);
    }
});

// ===== EXPORT FUNCTIONS FOR OTHER MODULES =====
window.RealEstatePro = {
    showLoading,
    showNotification,
    performSearch,
    trackEvent
};