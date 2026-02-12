// Инициализация сайта
document.addEventListener('DOMContentLoaded', function() {
    console.log('Julia Byukliy Portfolio loaded');
    
    // Автозапуск видео при наведении
    initVideoHover();
    
    // Инициализация модальных окон
    initModals();
    
    // Инициализация бургер меню
    initMobileMenu();
    
    // Анимация кнопки CTA
    initCTAButton();
    
    // Партиклы и анимации
    initParticles();
});

// Автозапуск видео при наведении
function initVideoHover() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        
        container.addEventListener('mouseenter', () => {
            if (video) {
                video.play().catch(e => console.log('Autoplay prevented:', e));
            }
        });
        
        container.addEventListener('mouseleave', () => {
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
        
        // Клик для открытия модального окна с видео
        container.addEventListener('click', (e) => {
            if (!e.target.classList.contains('play-button')) {
                const onclick = container.getAttribute('onclick');
                if (onclick) {
                    eval(onclick);
                }
            }
        });
    });
}

// Инициализация модальных окон
function initModals() {
    // Модалка для изображений
    const imageModal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const imageClose = imageModal.querySelector('.modal-close');
    
    // Модалка для видео
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const videoTitle = document.getElementById('videoModalTitle');
    const videoDescription = document.getElementById('videoModalDescription');
    const videoClose = videoModal.querySelector('.modal-close');
    
    // Закрытие по клику на overlay
    [imageModal, videoModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                if (modal === videoModal) {
                    modalVideo.pause();
                }
            }
        });
    });
    
    // Закрытие по кнопке
    imageClose.addEventListener('click', () => {
        imageModal.style.display = 'none';
    });
    
    videoClose.addEventListener('click', () => {
        videoModal.style.display = 'none';
        modalVideo.pause();
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            imageModal.style.display = 'none';
            videoModal.style.display = 'none';
            modalVideo.pause();
        }
    });
    
    // Открытие изображений из галереи
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const title = item.querySelector('.gallery-title').textContent;
            const description = item.querySelector('.gallery-description').textContent;
            
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            imageModal.style.display = 'flex';
        });
    });
}

// Функции для работы с видео модалкой
function openVideoModal(videoSrc, title, description) {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    const modalTitle = document.getElementById('videoModalTitle');
    const modalDescription = document.getElementById('videoModalDescription');
    
    video.src = videoSrc;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modal.style.display = 'flex';
    
    // Автозапуск видео
    setTimeout(() => {
        video.play().catch(e => {
            console.log('Autoplay prevented, waiting for user interaction');
        });
    }, 300);
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    
    modal.style.display = 'none';
    video.pause();
    video.currentTime = 0;
}

// Галерея карусель
function scrollGallery(distance) {
    const carousel = document.getElementById('galleryCarousel');
    carousel.scrollBy({
        left: distance,
        behavior: 'smooth'
    });
}

// Мобильное меню
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLeft = document.querySelector('.nav-left');
    const navRight = document.querySelector('.nav-right');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLeft.style.display === 'flex';
            
            if (isOpen) {
                navLeft.style.display = 'none';
                navRight.style.display = 'none';
                menuToggle.innerHTML = '☰';
            } else {
                navLeft.style.display = 'flex';
                navRight.style.display = 'flex';
                navLeft.style.flexDirection = 'column';
                navRight.style.flexDirection = 'column';
                navLeft.style.position = 'absolute';
                navRight.style.position = 'absolute';
                navLeft.style.top = '100%';
                navRight.style.top = '100%';
                navLeft.style.left = '20px';
                navRight.style.right = '20px';
                navLeft.style.background = 'rgba(0,0,0,0.9)';
                navRight.style.background = 'rgba(0,0,0,0.9)';
                navLeft.style.padding = '20px';
                navRight.style.padding = '20px';
                navLeft.style.gap = '15px';
                navRight.style.gap = '15px';
                menuToggle.innerHTML = '✕';
            }
        });
    }
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-left a, .nav-right a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLeft.style.display = 'none';
                navRight.style.display = 'none';
                menuToggle.innerHTML = '☰';
            }
        });
    });
}

// Анимация кнопки CTA
function initCTAButton() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            document.getElementById('works').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

// Дополнительные партиклы и анимации
function initParticles() {
    // Добавляем дополнительные партиклы при скролле
    window.addEventListener('scroll', () => {
        if (Math.random() > 0.98 && document.querySelectorAll('.floating-particle').length < 10) {
            createParticle();
        }
    });
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        const size = 2 + Math.random() * 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = '100%';
        particle.style.animationDuration = `${15 + Math.random() * 20}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        document.body.appendChild(particle);
        
        // Удаление после анимации
        setTimeout(() => {
            particle.remove();
        }, 30000);
    }
    
    // Создаем начальные партиклы
    for (let i = 0; i < 3; i++) {
        setTimeout(createParticle, i * 1000);
    }
}

// Предзагрузка видео
function preloadVideos() {
    const videoSources = [
        'videos/Murad.mp4',
        'videos/Lipgloss.mp4',
        'videos/Comp.mp4',
        'videos/abathur.mp4',
        'videos/Ring.mp4',
        'videos/Slurry.mp4',
        'videos/ZheeShe.mp4',
        'videos/solar.mp4'
    ];
    
    videoSources.forEach(src => {
        const video = document.createElement('video');
        video.src = src;
        video.preload = 'metadata';
    });
}

// Запускаем предзагрузку
setTimeout(preloadVideos, 1000);

// Анимация появления элементов при скролле
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Наблюдаем за всеми секциями
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Добавляем CSS для анимации появления
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.8s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    section {
        opacity: 0;
    }
`;
document.head.appendChild(style);

// Запускаем анимации появления
setTimeout(initScrollAnimations, 500);