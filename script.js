class DrawnPortfolio {
    constructor() {
        this.init();
    }

    init() {
        console.log('🎨 Детский рисованный портфолио запущен!');
        
        this.initPreloader();
        this.initDoodleAnimations();
        this.initScribbleEffects();
        this.initWobbleElements();
        this.initFormDrawing();
        this.initPlayfulInteractions();
        this.initStickerEffect();
    }

    initPreloader() {
        const preloader = document.querySelector('.preloader');
        if (!preloader) return;

        window.addEventListener('load', () => {
            // Рисуем линию перед исчезновением
            const pencil = document.querySelector('.pencil');
            if (pencil) {
                pencil.style.animation = 'drawLine 1s ease-out forwards';
            }

            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                
                // Запускаем начальные анимации
                this.startEntranceAnimations();
            }, 1500);
        });
    }

    initDoodleAnimations() {
        // Анимируем все рисованные элементы
        const doodles = document.querySelectorAll('.doodle, .drawn-border');
        
        doodles.forEach((doodle, index) => {
            // Случайное движение для каждого элемента
            const randomDelay = Math.random() * 2;
            const randomDuration = 3 + Math.random() * 2;
            
            doodle.style.animationDelay = `${randomDelay}s`;
            doodle.style.animationDuration = `${randomDuration}s`;
            
            // Случайный угол наклона
            const randomRotate = -2 + Math.random() * 4;
            doodle.style.transform += ` rotate(${randomRotate}deg)`;
        });

        // Интерактивные каракули
        document.addEventListener('mousemove', (e) => {
            const doodlesNearCursor = document.querySelectorAll('.doodle');
            doodlesNearCursor.forEach(doodle => {
                const rect = doodle.getBoundingClientRect();
                const distance = Math.sqrt(
                    Math.pow(e.clientX - (rect.left + rect.width/2), 2) +
                    Math.pow(e.clientY - (rect.top + rect.height/2), 2)
                );
                
                if (distance < 100) {
                    this.pushDoodleAway(doodle, e.clientX, e.clientY);
                }
            });
        });
    }

    pushDoodleAway(doodle, mouseX, mouseY) {
        const rect = doodle.getBoundingClientRect();
        const centerX = rect.left + rect.width/2;
        const centerY = rect.top + rect.height/2;
        
        const dx = centerX - mouseX;
        const dy = centerY - mouseY;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance < 100) {
            const force = (100 - distance) / 100 * 10;
            const angle = Math.atan2(dy, dx);
            
            doodle.style.transform = `translate(${Math.cos(angle) * force}px, ${Math.sin(angle) * force}px)`;
            
            setTimeout(() => {
                doodle.style.transform = '';
            }, 300);
        }
    }

    initScribbleEffects() {
        // Эффект рисования для заголовков
        const titles = document.querySelectorAll('.hero-title, .section-title');
        
        titles.forEach(title => {
            // Создаем SVG для эффекта подчеркивания
            this.createScribbleUnderline(title);
            
            // Эффект появления буква за буквой
            if (title.classList.contains('hero-title')) {
                this.typewriterEffect(title);
            }
        });
    }

    createScribbleUnderline(element) {
        const underline = document.createElement('div');
        underline.className = 'scribble-underline';
        underline.style.cssText = `
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, 
                var(--crayon-red) 0%, 
                var(--crayon-yellow) 25%, 
                var(--crayon-blue) 50%, 
                var(--crayon-green) 75%, 
                var(--crayon-red) 100%);
            margin-top: 10px;
            border-radius: 2px;
            opacity: 0.7;
            position: relative;
            overflow: hidden;
        `;
        
        const scribble = document.createElement('div');
        scribble.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, white, transparent);
            animation: scribbleMove 2s linear infinite;
        `;
        
        underline.appendChild(scribble);
        element.parentNode.insertBefore(underline, element.nextSibling);
        
        // Добавляем стили для анимации
        const style = document.createElement('style');
        style.textContent = `
            @keyframes scribbleMove {
                0% { left: -100%; }
                100% { left: 100%; }
            }
        `;
        document.head.appendChild(style);
    }

    typewriterEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const type = () => {
            if (i < text.length) {
                // Случайная задержка для эффекта "неуверенного" написания
                const delay = 50 + Math.random() * 100;
                
                setTimeout(() => {
                    element.textContent += text.charAt(i);
                    i++;
                    type();
                    
                    // Случайный звук печатания (опционально)
                    if (Math.random() > 0.7) {
                        this.playTypeSound();
                    }
                }, delay);
            }
        };
        
        // Начинаем с небольшой задержки
        setTimeout(type, 500);
    }

    playTypeSound() {
        // Простые звуки пишущей машинки через Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800 + Math.random() * 400, audioContext.currentTime);
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Если Web Audio API не доступен, игнорируем
        }
    }

    initWobbleElements() {
        // Элементы, которые будут качаться при наведении
        const wobbleElements = document.querySelectorAll('.btn, .nav-link, .work-card, .gallery-item');
        
        wobbleElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.wobbleElement(el);
            });
            
            el.addEventListener('click', () => {
                this.bounceElement(el);
            });
        });
    }

    wobbleElement(element) {
        element.style.animation = 'wobble 0.5s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    bounceElement(element) {
        element.style.animation = 'bounce 0.5s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
        
        // Создаем частицы при клике
        this.createClickParticles(element);
    }

    createClickParticles(element) {
        const rect = element.getBoundingClientRect();
        const colors = ['#FFD012', '#4A90E2', '#FF6B6B', '#51D88A'];
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${color};
                border-radius: 50%;
                left: ${rect.left + rect.width/2}px;
                top: ${rect.top + rect.height/2}px;
                pointer-events: none;
                z-index: 10000;
            `;
            
            document.body.appendChild(particle);
            
            // Анимация частицы
            const angle = Math.random() * Math.PI * 2;
            const distance = 20 + Math.random() * 30;
            const duration = 400 + Math.random() * 300;
            
            particle.animate([
                {
                    transform: `translate(0, 0) scale(1)`,
                    opacity: 1
                },
                {
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)'
            });
            
            // Удаляем частицу после анимации
            setTimeout(() => {
                particle.remove();
            }, duration);
        }
    }

    initFormDrawing() {
        const formInputs = document.querySelectorAll('.form-input, .form-textarea');
        
        formInputs.forEach(input => {
            // Эффект рисования при фокусе
            input.addEventListener('focus', () => {
                this.drawAroundElement(input);
            });
            
            // Случайные подсказки
            input.addEventListener('input', (e) => {
                if (Math.random() > 0.95 && e.target.value.length > 3) {
                    this.showFunnyComment(e.target);
                }
            });
        });
    }

    drawAroundElement(element) {
        const rect = element.getBoundingClientRect();
        const highlight = document.createElement('div');
        
        highlight.className = 'drawing-highlight';
        highlight.style.cssText = `
            position: fixed;
            border: 2px dashed var(--crayon-yellow);
            border-radius: 10px;
            pointer-events: none;
            z-index: 1000;
            left: ${rect.left - 10}px;
            top: ${rect.top - 10}px;
            width: ${rect.width + 20}px;
            height: ${rect.height + 20}px;
            opacity: 0;
            animation: drawBox 1s ease-out forwards;
        `;
        
        document.body.appendChild(highlight);
        
        // Добавляем стили для анимации
        const style = document.createElement('style');
        style.textContent = `
            @keyframes drawBox {
                0% {
                    opacity: 0;
                    clip-path: polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%);
                }
                100% {
                    opacity: 1;
                    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Удаляем через 2 секунды
        setTimeout(() => {
            highlight.remove();
            style.remove();
        }, 2000);
    }

    showFunnyComment(element) {
        const comments = [
            "Отлично! ✨",
            "Так держать! 🚀",
            "Круто придумал! 💡",
            "Интересно! 🤔",
            "Продолжай в том же духе! 💪",
            "Гениально! 🎯"
        ];
        
        const comment = comments[Math.floor(Math.random() * comments.length)];
        const tooltip = document.createElement('div');
        
        tooltip.className = 'funny-tooltip';
        tooltip.textContent = comment;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--crayon-yellow);
            color: var(--pencil-gray);
            padding: 5px 10px;
            border-radius: 10px;
            font-family: var(--font-scribble);
            font-size: 0.9rem;
            white-space: nowrap;
            z-index: 1000;
            transform: translateY(-100%) rotate(-3deg);
            animation: floatUp 2s ease-out forwards;
            border: 2px solid var(--pencil-gray);
        `;
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width/2}px`;
        tooltip.style.top = `${rect.top}px`;
        
        document.body.appendChild(tooltip);
        
        // Удаляем через 2 секунды
        setTimeout(() => {
            tooltip.remove();
        }, 2000);
        
        // Добавляем стили для анимации
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                0% {
                    opacity: 0;
                    transform: translateY(0) rotate(-3deg);
                }
                20% {
                    opacity: 1;
                    transform: translateY(-30px) rotate(-3deg);
                }
                80% {
                    opacity: 1;
                    transform: translateY(-50px) rotate(-3deg);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-70px) rotate(-3deg);
                }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => style.remove(), 2000);
    }

    initPlayfulInteractions() {
        // Случайные звуки при взаимодействии
        document.addEventListener('click', (e) => {
            if (Math.random() > 0.7 && !e.target.matches('input, textarea')) {
                this.playClickSound();
            }
        });
        
        // Эффект дрожания при прокрутке
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Легкое дрожание при быстрой прокрутке
            if (Math.abs(currentScroll - lastScroll) > 50) {
                document.body.style.transform = `translateX(${Math.random() * 2 - 1}px)`;
                
                setTimeout(() => {
                    document.body.style.transform = '';
                }, 100);
            }
            
            lastScroll = currentScroll;
        });
        
        // Случайное появление рисованных элементов
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.createRandomDoodle();
            }
        }, 5000);
    }

    playClickSound() {
        // Простой звук клика
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Игнорируем если Web Audio API не доступен
        }
    }

    createRandomDoodle() {
        const doodle = document.createElement('div');
        const shapes = ['circle', 'square', 'triangle', 'star'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const colors = ['#FFD012', '#4A90E2', '#FF6B6B', '#51D88A', '#9B51E0'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        doodle.className = 'random-doodle';
        doodle.style.cssText = `
            position: fixed;
            opacity: 0.3;
            z-index: -1;
            animation: randomFloat 10s ease-in-out forwards;
            pointer-events: none;
        `;
        
        let shapeCSS = '';
        switch(shape) {
            case 'circle':
                shapeCSS = `
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: ${color};
                `;
                break;
            case 'square':
                shapeCSS = `
                    width: 40px;
                    height: 40px;
                    background: ${color};
                    transform: rotate(45deg);
                `;
                break;
            case 'triangle':
                shapeCSS = `
                    width: 0;
                    height: 0;
                    border-left: 20px solid transparent;
                    border-right: 20px solid transparent;
                    border-bottom: 40px solid ${color};
                `;
                break;
            case 'star':
                shapeCSS = `
                    width: 40px;
                    height: 40px;
                    background: ${color};
                    clip-path: polygon(
                        50% 0%, 61% 35%, 98% 35%, 68% 57%,
                        79% 91%, 50% 70%, 21% 91%, 32% 57%,
                        2% 35%, 39% 35%
                    );
                `;
                break;
        }
        
        doodle.style.cssText += shapeCSS;
        
        // Случайная позиция
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 50;
        
        doodle.style.left = `${startX}px`;
        doodle.style.top = `${startY}px`;
        
        document.body.appendChild(doodle);
        
        // Анимация всплытия
        const animation = doodle.animate([
            {
                transform: `translate(0, 0) rotate(0deg)`,
                opacity: 0.3
            },
            {
                transform: `translate(${Math.random() * 100 - 50}px, -${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`,
                opacity: 0
            }
        ], {
            duration: 10000,
            easing: 'linear'
        });
        
        // Удаляем после анимации
        animation.onfinish = () => doodle.remove();
    }

    initStickerEffect() {
        // Эффект наклейки для карточек работ
        const workCards = document.querySelectorAll('.work-card');
        
        workCards.forEach(card => {
            // Случайный угол наклона
            const rotation = -5 + Math.random() * 10;
            card.style.transform = `rotate(${rotation}deg)`;
            
            // Создаем эффект загнутых уголков
            this.createFoldEffect(card);
        });
    }

    createFoldEffect(element) {
        // Верхний правый загнутый уголок
        const fold = document.createElement('div');
        fold.className = 'paper-fold';
        fold.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            width: 30px;
            height: 30px;
            background: linear-gradient(225deg, transparent 50%, rgba(0,0,0,0.1) 50%);
            border-bottom-left-radius: 5px;
            z-index: 2;
        `;
        
        element.style.position = 'relative';
        element.appendChild(fold);
        
        // Тень от загнутого уголка
        const shadow = document.createElement('div');
        shadow.className = 'fold-shadow';
        shadow.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            width: 30px;
            height: 30px;
            background: rgba(0,0,0,0.05);
            filter: blur(2px);
            z-index: 1;
        `;
        
        element.appendChild(shadow);
    }

    startEntranceAnimations() {
        // Последовательное появление элементов
        const elements = [
            ...document.querySelectorAll('.doodle'),
            ...document.querySelectorAll('.hero-title'),
            ...document.querySelectorAll('.hero-subtitle'),
            ...document.querySelectorAll('.btn'),
            ...document.querySelectorAll('.work-card'),
            ...document.querySelectorAll('.gallery-item')
        ];
        
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform += ' translateY(20px)';
            
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = el.style.transform.replace(' translateY(20px)', '');
                
                // Случайный звук появления
                if (Math.random() > 0.5) {
                    this.playAppearSound();
                }
            }, 100 + index * 100);
        });
    }

    playAppearSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            // Игнорируем если Web Audio API не доступен
        }
    }
}

// Запускаем когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    new DrawnPortfolio();
});

// Случайные весёлые сообщения в консоли
const funMessages = [
    "🎨 Твоё портфолио выглядит отлично!",
    "✏️ Кто тут рисует такие крутые штуки?",
    "🖍️ Ого, какой креативный дизайн!",
    "📌 Выглядит как настоящая детская тетрадка!",
    "✨ Магия рисования в действии!",
    "🚀 Взлетаем на креативных волнах!"
];

console.log(funMessages[Math.floor(Math.random() * funMessages.length)]);
console.log("%c 🎯 Совет: Попробуй покликать на разные элементы!", 
    "color: #FF6B6B; font-size: 16px; font-weight: bold;");

// Обработка ошибок изображений
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.log('Картинка не загрузилась, но мы её нарисуем! 🖍️');
        e.target.style.background = `
            repeating-linear-gradient(
                45deg,
                var(--crayon-yellow),
                var(--crayon-yellow) 10px,
                var(--crayon-red) 10px,
                var(--crayon-red) 20px
            )
        `;
        e.target.style.border = '3px dashed var(--pencil-gray)';
        e.target.alt = '🖼️ Картинка рисуется...';
    }
}, true);