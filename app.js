// Healthcare Presentation App
class HealthcarePresentation {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 14;
        this.slides = document.querySelectorAll('.slide');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.progressFill = document.querySelector('.progress-fill');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.updateSlide();
                this.setupTouchNavigation();
            });
        } else {
            this.setupEventListeners();
            this.updateSlide();
            this.setupTouchNavigation();
        }
    }

    setupEventListeners() {
        // Navigation buttons - ensure they exist before adding listeners
        if (this.prevBtn && this.nextBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Previous button clicked');
                this.previousSlide();
            });
            
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Next button clicked');
                this.nextSlide();
            });
        }

        // Navigation dots
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Nav dot clicked:', index);
                this.goToSlide(index);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
        });

        // Setup CTA buttons - use event delegation for dynamically loaded content
        this.setupCTAButtons();
    }

    setupCTAButtons() {
        // Method kept for compatibility, but CTA buttons have been removed
    }

    setupTouchNavigation() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, startY, endX, endY);
        }, { passive: true });
    }

    handleSwipe(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;

        // Horizontal swipe is more significant than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.previousSlide();
            } else {
                this.nextSlide();
            }
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            console.log('Moving to next slide:', this.currentSlide + 1);
            this.currentSlide++;
            this.updateSlide();
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            console.log('Moving to previous slide:', this.currentSlide - 1);
            this.currentSlide--;
            this.updateSlide();
        }
    }

    goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < this.totalSlides && slideIndex !== this.currentSlide) {
            console.log('Going to slide:', slideIndex);
            this.currentSlide = slideIndex;
            this.updateSlide();
        }
    }

    updateSlide() {
        console.log('Updating to slide:', this.currentSlide);
        
        // Update slide visibility with proper transitions
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === this.currentSlide) {
                // Use setTimeout to ensure proper transition
                setTimeout(() => {
                    slide.classList.add('active');
                }, 10);
            }
        });

        // Update navigation dots
        this.navDots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === this.currentSlide) {
                dot.classList.add('active');
            }
        });

        // Update progress bar
        if (this.progressFill) {
            const progressPercentage = ((this.currentSlide + 1) / this.totalSlides) * 100;
            this.progressFill.style.width = `${progressPercentage}%`;
        }

        // Update navigation button states
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 0;
            this.prevBtn.style.opacity = this.currentSlide === 0 ? '0.5' : '1';
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
            this.nextBtn.style.opacity = this.currentSlide === this.totalSlides - 1 ? '0.5' : '1';
        }

        // Add entrance animation to current slide
        setTimeout(() => {
            this.animateCurrentSlide();
        }, 100);
    }

    animateCurrentSlide() {
        const currentSlideElement = this.slides[this.currentSlide];
        if (!currentSlideElement) return;
        
        const animatableElements = currentSlideElement.querySelectorAll(
            '.crisis-card, .pillar-card, .vision-feature, .timeline-item, .impact-metric, .feasibility-item'
        );

        // Reset animations
        animatableElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'none';
        });

        // Animate elements with stagger
        animatableElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    showAlert(message) {
        console.log('Showing alert:', message);
        
        // Remove any existing alerts
        const existingAlerts = document.querySelectorAll('.alert-modal');
        existingAlerts.forEach(alert => alert.remove());
        
        // Create and show new alert
        const alertModal = this.createAlertModal(message);
        document.body.appendChild(alertModal);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (alertModal && alertModal.parentNode) {
                alertModal.remove();
            }
        }, 4000);
    }

    createAlertModal(message) {
        const modal = document.createElement('div');
        modal.className = 'alert-modal';
        modal.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-surface);
            padding: 20px;
            border-radius: 12px;
            border: 2px solid var(--color-primary);
            box-shadow: var(--shadow-lg);
            z-index: 2000;
            max-width: 350px;
            color: var(--color-text);
            font-size: 14px;
            line-height: 1.4;
            animation: slideInRight 0.4s ease-out;
            cursor: pointer;
        `;

        // Add close button
        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 8px;
            right: 12px;
            font-size: 20px;
            color: var(--color-text-secondary);
            cursor: pointer;
            line-height: 1;
        `;
        
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        // Add animation keyframes
        if (!document.querySelector('#alertAnimation')) {
            const style = document.createElement('style');
            style.id = 'alertAnimation';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.paddingRight = '20px';
        
        modal.appendChild(messageDiv);
        modal.appendChild(closeBtn);
        
        // Click to dismiss
        modal.addEventListener('click', () => {
            modal.remove();
        });
        
        return modal;
    }
}

// Statistics Animation
class StatsAnimator {
    constructor() {
        this.observedElements = new Set();
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.observedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.observedElements.add(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        // Observe stat numbers
        document.querySelectorAll('.stat-number, .crisis-stat').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/[^\d]/g, ''));
        
        if (!isNaN(number) && number > 0) {
            this.animateNumber(element, 0, number, text);
        }
    }

    animateNumber(element, start, end, originalText) {
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const isMillions = originalText.includes('Million') || originalText.includes('M');
        const suffix = isMillions ? 'M' : '';

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * easeOutQuart);
            
            if (isMillions) {
                element.textContent = `${(current / 1000000).toFixed(1)}${suffix}`;
            } else if (originalText.includes('%')) {
                element.textContent = `${current}%`;
            } else {
                element.textContent = current.toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = originalText; // Restore original text
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Hover Effects Enhancement
class HoverEffects {
    constructor() {
        this.setupHoverEffects();
    }

    setupHoverEffects() {
        // Add subtle hover effects to interactive elements
        const hoverElements = document.querySelectorAll(
            '.crisis-card, .pillar-card, .vision-feature, .feasibility-item, .impact-metric'
        );

        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-8px) scale(1.02)';
                element.style.boxShadow = 'var(--shadow-lg)';
                element.style.transition = 'all 0.3s ease-out';
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0) scale(1)';
                element.style.boxShadow = '';
                element.style.transition = 'all 0.3s ease-out';
            });
        });

        // Add ripple effect to buttons
        this.setupRippleEffect();
    }

    setupRippleEffect() {
        const buttons = document.querySelectorAll('.btn, .control-btn, .nav-dot');

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;

                // Add ripple animation if it doesn't exist
                if (!document.querySelector('#rippleAnimation')) {
                    const style = document.createElement('style');
                    style.id = 'rippleAnimation';
                    style.textContent = `
                        @keyframes ripple {
                            to {
                                transform: scale(2);
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }

                const buttonPosition = getComputedStyle(button).position;
                if (buttonPosition === 'static') {
                    button.style.position = 'relative';
                }

                button.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
}

// Auto-play functionality (optional)
class AutoPlay {
    constructor(presentation) {
        this.presentation = presentation;
        this.isPlaying = false;
        this.interval = null;
        this.duration = 10000; // 10 seconds per slide
    }

    start() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.interval = setInterval(() => {
                if (this.presentation.currentSlide < this.presentation.totalSlides - 1) {
                    this.presentation.nextSlide();
                } else {
                    this.stop(); // Stop at the last slide
                }
            }, this.duration);
        }
    }

    stop() {
        if (this.isPlaying) {
            this.isPlaying = false;
            clearInterval(this.interval);
        }
    }

    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
    }
}

// Global variables for application instances
let presentationApp = null;
let statsAnimator = null;
let hoverEffects = null;
let autoPlay = null;

// Initialize the application
function initializeApp() {
    console.log('Initializing Healthcare Presentation App');
    
    presentationApp = new HealthcarePresentation();
    statsAnimator = new StatsAnimator();
    hoverEffects = new HoverEffects();
    autoPlay = new AutoPlay(presentationApp);

    // Add space bar to toggle auto-play (hidden feature)
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            autoPlay.toggle();
        }
    });

    // Add ESC key to stop auto-play
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            autoPlay.stop();
        }
    });

    // Stop auto-play on user interaction
    document.addEventListener('click', () => {
        autoPlay.stop();
    });

    document.addEventListener('touchstart', () => {
        autoPlay.stop();
    }, { passive: true });

    // Smooth scroll to top when page loads
    window.scrollTo({ top: 0, behavior: 'smooth' });

    console.log('App initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Utility functions
const utils = {
    // Format numbers for display
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HealthcarePresentation,
        StatsAnimator,
        HoverEffects,
        AutoPlay,
        utils
    };
}