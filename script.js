/**
 * YULIA BYUKLIY PORTFOLIO
 * Yellow Yeti Inspired Website
 */

class YellowYetiPortfolio {
    constructor() {
        this.state = {
            isMenuOpen: false,
            isModalOpen: false,
            currentVideo: null,
            scrollPosition: 0
        };

        this.init();
    }

    init() {
        console.log('🎨 YULIA BYUKLIY Portfolio — Yellow Yeti Style');

        // Initialize all modules
        this.initPreloader();
        this.initNavigation();
        this.initSmoothScrolling();
        this.initVideoPlayers();
        this.initImageGallery();
        this.initModals();
        this.initContactForm();
        this.initAnimations();
        this.initIntersectionObserver();
        this.initScrollProgress();

        // Set body as loaded
        setTimeout(() => {
            document.body.classList.add('page-loaded');
        }, 100);
    }

    // ===== PRELOADER =====
    initPreloader() {
        const preloader = document.getElementById('preloader');
        
        if (!preloader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                
                // Trigger initial animations
                this.animateOnLoad();
            }, 800);
        });
    }

    // ===== NAVIGATION =====
    initNavigation() {
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileClose = document.getElementById('mobileClose');
        const navLinks = document.querySelectorAll('.yy-nav-link, .yy-mobile-link');

        // Menu toggle
        if (menuToggle) {
            menuToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Mobile close button
        if (mobileClose) {
            mobileClose.addEventListener('click', () => this.closeMenu());
        }

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.state.isMenuOpen && 
                !mobileMenu.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.yy-header');
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    toggleMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const menuToggle = document.getElementById('menuToggle');
        
        this.state.isMenuOpen = !this.state.isMenuOpen;
        
        if (mobileMenu) mobileMenu.classList.toggle('active', this.state.isMenuOpen);
        if (menuToggle) menuToggle.classList.toggle('active', this.state.isMenuOpen);
        
        // Toggle body scroll
        document.body.style.overflow = this.state.isMenuOpen ? 'hidden' : '';
        
        // Update aria attributes
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', this.state.isMenuOpen.toString());
        }
    }

    closeMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const menuToggle = document.getElementById('menuToggle');
        
        this.state.isMenuOpen = false;
        
        if (mobileMenu) mobileMenu.classList.remove('active');
        if (menuToggle) {
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
        
        document.body.style.overflow = '';
    }

    // ===== SMOOTH SCROLLING =====
    initSmoothScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Skip if it's just "#" or has target="_blank"
                if (href === '#' || anchor.getAttribute('target') === '_blank') return;
                
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (this.state.isMenuOpen) {
                        this.closeMenu();
                    }
                    
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without reload
                    history.pushState(null, '', href);
                }
            });
        });

        // Back to top button
        const backToTop = document.querySelector('.yy-back-to-top');
        if (backToTop) {
            backToTop.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // ===== VIDEO PLAYERS =====
    initVideoPlayers() {
        const videoWrappers = document.querySelectorAll('.yy-video-wrapper');
        
        videoWrappers.forEach(wrapper => {
            // Click to open modal
            wrapper.addEventListener('click', () => {
                const videoSrc = wrapper.getAttribute('data-video');
                const title = wrapper.closest('.yy-work-card').querySelector('.yy-work-title').textContent;
                const description = wrapper.closest('.yy-work-card').querySelector('.yy-work-description').textContent;
                
                this.openVideoModal(videoSrc, title, description);
            });
            
            // Keyboard accessibility
            wrapper.setAttribute('tabindex', '0');
            wrapper.setAttribute('role', 'button');
            wrapper.setAttribute('aria-label', 'Открыть видео');
            
            wrapper.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    wrapper.click();
                }
            });
            
            // Hover effect for preview
            const preview = wrapper.querySelector('.yy-video-preview');
            if (preview) {
                wrapper.addEventListener('mouseenter', () => {
                    preview.play().catch(() => {
                        // Autoplay blocked, handle gracefully
                    });
                });
                
                wrapper.addEventListener('mouseleave', () => {
                    preview.pause();
                    preview.currentTime = 0;
                });
            }
        });
    }

    // ===== IMAGE GALLERY =====
    initImageGallery() {
        const viewButtons = document.querySelectorAll('.yy-gallery-view');
        
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering parent click
                
                const galleryItem = button.closest('.yy-gallery-item');
                const imageSrc = galleryItem.querySelector('.yy-gallery-image').getAttribute('src');
                const title = button.getAttribute('data-title');
                const description = button.getAttribute('data-description');
                
                this.openImageModal(imageSrc, title, description);
            });
        });
    }

    // ===== MODALS =====
    initModals() {
        // Close buttons
        const closeImageModal = document.getElementById('closeImageModal');
        const closeVideoModal = document.getElementById('closeVideoModal');
        const modalOverlays = document.querySelectorAll('.yy-modal-overlay');
        
        if (closeImageModal) {
            closeImageModal.addEventListener('click', () => this.closeImageModal());
        }
        
        if (closeVideoModal) {
            closeVideoModal.addEventListener('click', () => this.closeVideoModal());
        }
        
        // Close on overlay click
        modalOverlays.forEach(overlay => {
            overlay.addEventListener('click', () => {
                if (document.getElementById('imageModal').classList.contains('active')) {
                    this.closeImageModal();
                }
                if (document.getElementById('videoModal').classList.contains('active')) {
                    this.closeVideoModal();
                }
            });
        });
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (document.getElementById('imageModal').classList.contains('active')) {
                    this.closeImageModal();
                }
                if (document.getElementById('videoModal').classList.contains('active')) {
                    this.closeVideoModal();
                }
            }
        });
    }

    openImageModal(imageSrc, title, description) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalImageTitle');
        const modalDesc = document.getElementById('modalImageDesc');
        
        if (!modal || !modalImg) return;
        
        // Set content
        modalImg.src = imageSrc;
        modalImg.alt = title;
        modalTitle.textContent = title;
        modalDesc.textContent = description;
        
        // Show modal
        modal.classList.add('active');
        this.state.isModalOpen = true;
        document.body.style.overflow = 'hidden';
    }

    closeImageModal() {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        
        if (!modal) return;
        
        modal.classList.remove('active');
        this.state.isModalOpen = false;
        document.body.style.overflow = '';
        
        // Clear image src after animation
        setTimeout(() => {
            if (modalImg) modalImg.src = '';
        }, 300);
    }

    openVideoModal(videoSrc, title, description) {
        const modal = document.getElementById('videoModal');
        const modalVideo = document.getElementById('modalVideo');
        const modalTitle = document.getElementById('modalVideoTitle');
        const modalDesc = document.getElementById('modalVideoDesc');
        
        if (!modal || !modalVideo) return;
        
        // Stop current video if playing
        if (this.state.currentVideo) {
            this.state.currentVideo.pause();
            this.state.currentVideo.currentTime = 0;
        }
        
        // Set content
        modalVideo.src = videoSrc;
        modalTitle.textContent = title;
        modalDesc.textContent = description;
        
        // Show modal
        modal.classList.add('active');
        this.state.isModalOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Store reference to current video
        this.state.currentVideo = modalVideo;
        
        // Try to play video
        const playPromise = modalVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay blocked, user can click to play
            });
        }
    }

    closeVideoModal() {
        const modal = document.getElementById('videoModal');
        const modalVideo = document.getElementById('modalVideo');
        
        if (!modal) return;
        
        modal.classList.remove('active');
        this.state.isModalOpen = false;
        document.body.style.overflow = '';
        
        // Stop video
        if (modalVideo) {
            modalVideo.pause();
            modalVideo.currentTime = 0;
        }
        
        this.state.currentVideo = null;
    }

    // ===== CONTACT FORM =====
    initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.message) {
                this.showFormError('Пожалуйста, заполните все поля');
                return;
            }
            
            // Simulate form submission
            this.submitForm(data);
        });
    }

    submitForm(data) {
        // Show loading state
        const submitBtn = document.querySelector('#contactForm .yy-btn');
        const originalText = submitBtn.querySelector('.yy-btn-text').textContent;
        
        submitBtn.querySelector('.yy-btn-text').textContent = 'ОТПРАВЛЯЕТСЯ...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Success message
            this.showFormSuccess('Сообщение отправлено! Я свяжусь с вами в ближайшее время.');
            
            // Reset form
            document.getElementById('contactForm').reset();
            
            // Reset button
            submitBtn.querySelector('.yy-btn-text').textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    showFormError(message) {
        // Create error message element
        const errorEl = document.createElement('div');
        errorEl.className = 'yy-form-error';
        errorEl.textContent = message;
        errorEl.style.color = '#ff4444';
        errorEl.style.marginTop = '1rem';
        errorEl.style.fontSize = '0.9rem';
        
        // Remove existing error
        const existingError = document.querySelector('.yy-form-error');
        if (existingError) existingError.remove();
        
        // Add new error
        const contactForm = document.getElementById('contactForm');
        contactForm.appendChild(errorEl);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            errorEl.remove();
        }, 5000);
    }

    showFormSuccess(message) {
        // Create success message element
        const successEl = document.createElement('div');
        successEl.className = 'yy-form-success';
        successEl.textContent = message;
        successEl.style.color = '#00C851';
        successEl.style.marginTop = '1rem';
        successEl.style.fontSize = '0.9rem';
        successEl.style.textAlign = 'center';
        
        // Remove existing messages
        const existingMessage = document.querySelector('.yy-form-success');
        if (existingMessage) existingMessage.remove();
        
        // Add new message
        const contactForm = document.getElementById('contactForm');
        contactForm.appendChild(successEl);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            successEl.remove();
        }, 5000);
    }

    // ===== ANIMATIONS =====
    initAnimations() {
        // GSAP animations if available
        if (typeof gsap !== 'undefined') {
            this.initGSAPAnimations();
        }
        
        // CSS animations
        this.initCSSAnimations();
    }

    initGSAPAnimations() {
        // Hero section animations
        const heroTitle = document.querySelector('.yy-hero-title');
        const heroDescription = document.querySelector('.yy-hero-description');
        const heroActions = document.querySelector('.yy-hero-actions');
        
        if (heroTitle) {
            gsap.from(heroTitle, {
                duration: 1,
                y: 50,
                opacity: 0,
                ease: 'power3.out'
            });
        }
        
        if (heroDescription) {
            gsap.from(heroDescription, {
                duration: 1,
                y: 30,
                opacity: 0,
                delay: 0.3,
                ease: 'power3.out'
            });
        }
        
        if (heroActions) {
            gsap.from(heroActions, {
                duration: 1,
                y: 30,
                opacity: 0,
                delay: 0.6,
                ease: 'power3.out'
            });
        }
        
        // ScrollTrigger animations for sections
        if (typeof ScrollTrigger !== 'undefined') {
            // Animate work cards on scroll
            const workCards = document.querySelectorAll('.yy-work-card');
            
            workCards.forEach((card, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: 'power3.out'
                });
            });
            
            // Animate gallery items
            const galleryItems = document.querySelectorAll('.yy-gallery-item');
            
            galleryItems.forEach((item, i) => {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    y: 40,
                    opacity: 0,
                    duration: 0.7,
                    delay: i * 0.1,
                    ease: 'power3.out'
                });
            });
            
            // Animate skills progress bars
            const skillProgress = document.querySelectorAll('.yy-skill-progress');
            
            skillProgress.forEach(progress => {
                gsap.from(progress, {
                    scrollTrigger: {
                        trigger: progress,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    },
                    width: 0,
                    duration: 1.5,
                    ease: 'power2.out'
                });
            });
        }
    }

    initCSSAnimations() {
        // Add animation classes on load
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
    }

    animateOnLoad() {
        // Add staggered animation to elements
        const animatedElements = document.querySelectorAll('.yy-work-card, .yy-gallery-item, .yy-about-paragraph, .yy-skill');
        
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100 + (index * 100));
        });
    }

    // ===== INTERSECTION OBSERVER =====
    initIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            // Lazy load images
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                            img.removeAttribute('data-srcset');
                        }
                        
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            // Observe all lazy images
            document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
                imageObserver.observe(img);
            });
            
            // Animate elements on scroll
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            });
            
            // Observe elements to animate
            document.querySelectorAll('.yy-stat, .yy-contact-item, .yy-form-group').forEach(el => {
                animationObserver.observe(el);
            });
        }
    }

    // ===== SCROLL PROGRESS =====
    initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'yy-scroll-progress';
        progressBar.style.position = 'fixed';
        progressBar.style.top = '0';
        progressBar.style.left = '0';
        progressBar.style.width = '0%';
        progressBar.style.height = '3px';
        progressBar.style.backgroundColor = 'var(--yy-yellow)';
        progressBar.style.zIndex = '999';
        progressBar.style.transition = 'width 0.1s ease';
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            
            progressBar.style.width = scrolled + '%';
        });
    }

    // ===== UTILITIES =====
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
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new YellowYetiPortfolio();
});

// Error handling for images
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        console.warn('Image failed to load:', e.target.src);
        e.target.style.opacity = '0.5';
        e.target.style.filter = 'grayscale(100%)';
    }
}, true);

// Save scroll position
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('yy_scrollPosition', window.scrollY);
});

// Restore scroll position
window.addEventListener('load', () => {
    const savedPosition = sessionStorage.getItem('yy_scrollPosition');
    if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition));
        sessionStorage.removeItem('yy_scrollPosition');
    }
});