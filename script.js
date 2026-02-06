class MonolithPortfolio {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 Monolith Portfolio — Yellow Yeti Style');
        
        this.initScrollAnimations();
        this.initNavigation();
        this.initForm();
        this.initProjectInteractions();
        this.initParallax();
        this.initGlitchEffect();
        this.initAdditionalEffects();
    }

    // ===== SCROLL-АНИМАЦИИ ДЛЯ ЭФФЕКТА "МОНОЛИТА" =====
    initScrollAnimations() {
        // Используем GSAP ScrollTrigger для продвинутых анимаций
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            // Анимация появления секций
            gsap.utils.toArray('.canvas-section').forEach((section, i) => {
                gsap.from(section, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    },
                    opacity: 0,
                    y: 50,
                    duration: 1,
                    delay: i * 0.2,
                    ease: 'power3.out'
                });
            });
            
            // Анимация элементов в секциях
            gsap.utils.toArray('.project-item').forEach((item, i) => {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 30,
                    rotate: () => Math.random() * 10 - 5,
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: 'back.out(1.7)'
                });
            });
            
            // Анимация рисованных линий
            const lines = document.querySelectorAll('.hand-drawn-underline, .title-underline');
            lines.forEach(line => {
                const path = line.querySelector('path');
                if (path) {
                    const length = path.getTotalLength();
                    
                    gsap.set(path, {
                        strokeDasharray: length,
                        strokeDashoffset: length
                    });
                    
                    gsap.to(path, {
                        scrollTrigger: {
                            trigger: line,
                            start: 'top 80%',
                            toggleActions: 'play none none none'
                        },
                        strokeDashoffset: 0,
                        duration: 2,
                        ease: 'power2.out'
                    });
                }
            });
            
            // Анимация прогресса навыков
            const skillProgress = document.querySelectorAll('.skill-progress');
            skillProgress.forEach(progress => {
                const width = progress.style.width;
                progress.style.width = '0%';
                
                gsap.to(progress, {
                    scrollTrigger: {
                        trigger: progress,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    },
                    width: width,
                    duration: 2,
                    ease: 'power2.out'
                });
            });
        } else {
            // Fallback на Intersection Observer если GSAP не загрузился
            this.initScrollObserver();
        }
    }

    initScrollObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Добавляем случайное смещение для "рисованного" эффекта
                    if (entry.target.classList.contains('project-item')) {
                        const randomX = Math.random() * 20 - 10;
                        const randomY = Math.random() * 20 - 10;
                        entry.target.style.transform = `translate(${randomX}px, ${randomY}px)`;
                        
                        setTimeout(() => {
                            entry.target.style.transform = '';
                        }, 300);
                    }
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.canvas-section, .project-item, .vibe-text-block').forEach(el => {
            observer.observe(el);
        });
    }

    // ===== НАВИГАЦИЯ =====
    initNavigation() {
        const navDots = document.querySelectorAll('.nav-dot');
        const sections = document.querySelectorAll('.canvas-section');
        
        // Активная точка при скролле
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navDots.forEach(dot => {
                        dot.classList.toggle('active', 
                            dot.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(section => observer.observe(section));
        
        // Клик по точкам
        navDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = dot.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== ПАРАЛЛАКС ДЛЯ ГЛУБИНЫ =====
    initParallax() {
        // Лёгкий параллакс для заднего фона
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const spaceBg = document.querySelector('.space-background');
            
            if (spaceBg) {
                spaceBg.style.transform = `translateY(${scrolled * 0.2}px)`;
            }
            
            // Микро-движение для декоративных элементов
            const doodles = document.querySelectorAll('.doodle-element');
            doodles.forEach(doodle => {
                const speed = 0.1;
                const yOffset = scrolled * speed;
                doodle.style.transform = `translateY(${yOffset}px)`;
            });
        });
    }

    // ===== ГЛИТЧ-ЭФФЕКТ ДЛЯ ЗАГОЛОВКОВ =====
    initGlitchEffect() {
        const glitchTitles = document.querySelectorAll('.glitch-title');
        
        glitchTitles.forEach(title => {
            // Создаём клон для эффекта глитча
            const clone = title.cloneNode(true);
            clone.classList.add('glitch-clone');
            title.parentNode.appendChild(clone);
            
            // Случайные глитчи
            setInterval(() => {
                if (Math.random() > 0.7) {
                    this.triggerGlitch(title);
                }
            }, 3000);
        });
    }

    triggerGlitch(element) {
        element.style.animation = 'none';
        
        setTimeout(() => {
            element.style.animation = 'glitchLine 0.3s';
            
            // Случайное смещение
            const shiftX = Math.random() * 10 - 5;
            const shiftY = Math.random() * 5 - 2.5;
            
            gsap.to(element, {
                x: shiftX,
                y: shiftY,
                duration: 0.05,
                repeat: 3,
                yoyo: true,
                onComplete: () => {
                    gsap.to(element, {
                        x: 0,
                        y: 0,
                        duration: 0.1
                    });
                }
            });
        }, 10);
    }

    // ===== ФОРМА =====
    initForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Валидация
            if (!data.name || !data.email || !data.message) {
                this.showFormMessage('Заполните все поля', 'error');
                return;
            }
            
            // Эффект отправки
            const submitBtn = contactForm.querySelector('.hand-drawn-button');
            const originalText = submitBtn.querySelector('.button-text').textContent;
            
            submitBtn.querySelector('.button-text').textContent = 'ОТПРАВЛЯЕТСЯ...';
            submitBtn.disabled = true;
            
            // Имитация отправки
            setTimeout(() => {
                this.showFormMessage('Сообщение отправлено!', 'success');
                contactForm.reset();
                
                submitBtn.querySelector('.button-text').textContent = originalText;
                submitBtn.disabled = false;
                
                // Анимация успеха
                gsap.to(submitBtn, {
                    scale: 1.1,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1
                });
            }, 1500);
        });
        
        // Интерактивность полей формы
        const formInputs = contactForm.querySelectorAll('.hand-drawn-input, .hand-drawn-textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                const group = input.closest('.form-group');
                group.classList.add('focused');
                
                // Анимация линии
                const line = group.querySelector('.input-line, .textarea-line');
                if (line) {
                    gsap.to(line, {
                        width: '100%',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
            
            input.addEventListener('blur', () => {
                const group = input.closest('.form-group');
                if (!input.value) {
                    group.classList.remove('focused');
                    
                    const line = group.querySelector('.input-line, .textarea-line');
                    if (line) {
                        gsap.to(line, {
                            width: 0,
                            duration: 0.3,
                            ease: 'power2.out'
                        });
                    }
                }
            });
        });
    }

    showFormMessage(text, type) {
        // Удаляем старые сообщения
        const oldMessage = document.querySelector('.form-message');
        if (oldMessage) oldMessage.remove();
        
        // Создаём новое
        const message = document.createElement('div');
        message.className = `form-message ${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'error' ? '#ff4444' : '#00C851'};
            color: white;
            border-radius: 4px;
            font-family: var(--font-mono);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        // Удаляем через 5 секунд
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => message.remove(), 300);
        }, 5000);
    }

    // ===== ВЗАИМОДЕЙСТВИЯ С ПРОЕКТАМИ =====
    initProjectInteractions() {
        const projects = document.querySelectorAll('.project-item');
        
        projects.forEach(project => {
            // Эффект наведения
            project.addEventListener('mouseenter', () => {
                const media = project.querySelector('.project-media');
                const year = project.querySelector('.project-year');
                
                gsap.to(media, {
                    y: -10,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                gsap.to(year, {
                    scale: 1.2,
                    duration: 0.2,
                    ease: 'back.out(1.7)'
                });
                
                // Случайное вращение возвращается к 0
                gsap.to(project, {
                    rotate: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            project.addEventListener('mouseleave', () => {
                const media = project.querySelector('.project-media');
                const year = project.querySelector('.project-year');
                const originalRotation = getComputedStyle(project).getPropertyValue('--rotation') || '0deg';
                
                gsap.to(media, {
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                gsap.to(year, {
                    scale: 1,
                    duration: 0.2
                });
                
                gsap.to(project, {
                    rotate: originalRotation,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            // Клик по проекту (открытие модального окна или ссылка)
            project.addEventListener('click', (e) => {
                if (!e.target.closest('.play-indicator')) {
                    // Здесь можно добавить открытие детальной страницы проекта
                    console.log('Открыть проект:', 
                        project.querySelector('h3').textContent);
                }
            });
            
            // Клик по кнопке play
            const playBtn = project.querySelector('.play-indicator');
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    // Эффект нажатия
                    gsap.to(playBtn, {
                        scale: 0.9,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1
                    });
                    
                    // Здесь можно добавить открытие видео
                    console.log('Воспроизвести видео проекта');
                });
            }
        });
    }

    // ===== ДОПОЛНИТЕЛЬНЫЕ ЭФФЕКТЫ =====
    initAdditionalEffects() {
        // Эффект "дыхания" для некоторых элементов
        const breathingElements = document.querySelectorAll('.hand-drawn-badge, .nav-dot.active');
        breathingElements.forEach(el => {
            gsap.to(el, {
                opacity: 0.7,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        });
        
        // Добавляем звёзды
        this.createStars();
    }

    createStars() {
        const spaceBg = document.querySelector('.space-background');
        if (!spaceBg) return;
        
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3}px;
                height: ${Math.random() * 3}px;
                background: white;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${0.2 + Math.random() * 0.5};
                animation: twinkleStar ${2 + Math.random() * 3}s infinite alternate;
            `;
            spaceBg.appendChild(star);
        }
        
        // Добавляем анимацию для звёзд
        const style = document.createElement('style');
        style.textContent = `
            @keyframes twinkleStar {
                0%, 100% { opacity: 0.2; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new MonolithPortfolio();
});

// Добавляем CSS для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .glitch-clone {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        pointer-events: none;
    }
    
    @keyframes glitchLine {
        0%, 95%, 100% { transform: translateX(0); }
        96% { transform: translateX(-3px); }
        97% { transform: translateX(3px); }
        98% { transform: translateX(-2px); }
    }
`;
document.head.appendChild(style);

// Обработка ошибок
window.addEventListener('error', (e) => {
    console.warn('Ошибка загрузки:', e.target.src || e.target.href);
});