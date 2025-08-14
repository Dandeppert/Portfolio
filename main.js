// Use strict mode for better error catching and performance
'use strict';

/* ==========================================
   PARTICLE GENERATION
   Creates floating particles for visual effect
   ========================================== */
function generateParticles(count = 50) {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        fragment.appendChild(particle);
    }
    particlesContainer.appendChild(fragment);
}

/* ==========================================
   INTERSECTION OBSERVER
   Triggers animations when elements come into view
   ========================================== */
function createScrollObserver() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    return new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                if (target.classList.contains('metric-number')) {
                    animateCounter(target);
                    observer.unobserve(target);
                }
            }
        });
    }, observerOptions);
}

/* ==========================================
   COUNTER ANIMATION
   Animates numbers from 0 to target value
   ========================================== */
function animateCounter(element) {
    const targetText = element.textContent;
    const isPercentage = targetText.includes('%');
    const isDollar = targetText.includes('$');
    const isPlus = targetText.includes('+');
    const numericValue = parseInt(targetText.replace(/[^0-9]/g, ''));
    let current = 0;
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    const stepDuration = duration / steps;
    const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
        }
        let display = Math.floor(current);
        if (isDollar) {
            display = `${display}M`;
        } else if (isPercentage) {
            display = `${display}%`;
        } else if (isPlus) {
            display = display.toLocaleString() + '+';
        }
        element.textContent = display;
    }, stepDuration);
}

/* ==========================================
   PROJECT CARD INTERACTIONS
   Adds 3D hover effects to project cards
   ========================================== */
function initProjectCardEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            this.style.transform = `translateY(-10px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
        });
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            this.style.transform = `translateY(-10px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
}

/* ==========================================
   PERFORMANCE MONITORING
   Tracks page performance metrics
   ========================================== */
function logPerformanceMetrics() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Performance Metrics:');
                console.log(`DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
                console.log(`Page Load Time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
                console.log(`Time to Interactive: ${perfData.domInteractive - perfData.fetchStart}ms`);
            }
        });
    }
}

/* ==========================================
   LAZY LOADING
   Defers loading of non-critical resources
   ========================================== */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    }
}

/* ==========================================
   INITIALIZATION
   Runs all setup functions when DOM is ready
   ========================================== */
function init() {
    generateParticles(50);
    const scrollObserver = createScrollObserver();
    document.querySelectorAll('.metric-number').forEach(element => {
        scrollObserver.observe(element);
    });
    initSmoothScroll();
    initProjectCardEffects();
    initLazyLoading();
    logPerformanceMetrics();
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

window.addEventListener('error', (e) => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.error('Global error:', e.message, e.filename, e.lineno);
    }
});

// Google Analytics (uncomment and add your GA tracking ID when ready)
/*
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_TRACKING_ID');
*/
