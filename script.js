/**
 * YELLOW YETI STYLE - Сайт-портфолио
 * JavaScript для стиля Yellow Yeti
 */

// Состояние приложения
const AppState = {
    isMenuOpen: false,
    isModalOpen: false,
    currentVideo: null
};

// ===== ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 YULIA BYUKLIY — сайт в стиле Yellow Yeti инициализирован');

    // Инициализация всех модулей
    initMobileMenu();
    initSmoothScrolling();
    initVideoPlayers();
    initImageGallery();
    initModals();
    initScrollAnimations();
    initVideoPreviews();

    // Добавляем класс для анимаций после загрузки
    document.body.classList.add('loaded');
});

// ===== МОБИЛЬНОЕ МЕНЮ =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', toggleMobileMenu);

    // Закрытие меню по клику на ссылку
    document.querySelectorAll('.yy-mobile-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Закрытие по клику вне меню
    document.addEventListener('click', (e) => {
        if (AppState.isMenuOpen && 
            !mobileMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && AppState.isMenuOpen) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    AppState.isMenuOpen = !AppState.isMenuOpen;
    
    mobileMenu.classList.toggle('active', AppState.isMenuOpen);
    menuToggle.classList.toggle('active', AppState.isMenuOpen);
    menuToggle.setAttribute('aria-expanded', AppState.isMenuOpen.toString());
    
    // Блокировка скролла
    document.body.style.overflow = AppState.isMenuOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    AppState.isMenuOpen = false;
    mobileMenu.classList.remove('active');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// ===== ПЛАВНАЯ ПРОКРУТКА =====
function initSmoothScrolling() {
    // Все внутренние ссылки
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Пропускаем якорь "#" и ссылки с target="_blank"
            if (href === '#' || this.getAttribute('target') === '_blank') return;
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Закрываем мобильное меню если открыто
                if (AppState.isMenuOpen) {
                    closeMobileMenu();
                }
                
                // Плавный скролл
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Обновляем URL без перезагрузки
                history.pushState(null, '', href);
            }
        });
    });

    // Кнопка "Наверх" в футере
    const backLink = document.querySelector('.yy-back-link');
    if (backLink) {
        backLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== ВИДЕО ПЛЕЕРЫ =====
function initVideoPlayers() {
    const videoContainers = document.querySelectorAll('.yy-video-container');
    
    videoContainers.forEach(container => {
        container.addEventListener('click', function() {
            const videoSrc = this.getAttribute('data-video');
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-desc');
            
            openVideoModal(videoSrc, title, description);
        });
        
        // Клавиатурная доступность
        container.setAttribute('tabindex', '0');
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const videoSrc = container.getAttribute('data-video');
                const title = container.getAttribute('data-title');
                const description = container.getAttribute('data-desc');
                
                openVideoModal(videoSrc, title, description);
            }
        });
    });
}

function initVideoPreviews() {
    const videos = document.querySelectorAll('.yy-video-preview');
    
    videos.forEach(video => {
        video.muted = true;
        video.playsInline = true;
        video.loop = true;
        
        // Устанавливаем видео на 1 секунду для превью
        video.addEventListener('loadedmetadata', () => {
            if (video.duration > 1) {
                video.currentTime = 1;
            }
        });
        
        // Пытаемся запустить для превью
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Автовоспроизведение заблокировано
            });
        }
    });
}

// ===== ГАЛЕРЕЯ ИЗОБРАЖЕНИЙ =====
function initImageGallery() {
    const viewButtons = document.querySelectorAll('.yy-view-btn');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-img');
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-desc');
            
            openImageModal(imageSrc, title, description);
        });
    });
}

// ===== МОДАЛЬНЫЕ ОКНА =====
function initModals() {
    const closeImageModalBtn = document.getElementById('closeImageModal');
    const closeVideoModalBtn = document.getElementById('closeVideoModal');
    const modalOverlays = document.querySelectorAll('.yy-modal-overlay');
    
    // Кнопки закрытия
    if (closeImageModalBtn) {
        closeImageModalBtn.addEventListener('click', closeImageModal);
    }
    
    if (closeVideoModalBtn) {
        closeVideoModalBtn.addEventListener('click', closeVideoModal);
    }
    
    // Клик по оверлею
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            if (document.getElementById('imageModal').classList.contains('active')) {
                closeImageModal();
            }
            if (document.getElementById('videoModal').classList.contains('active')) {
                closeVideoModal();
            }
        });
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (document.getElementById('imageModal').classList.contains('active')) {
                closeImageModal();
            }
            if (document.getElementById('videoModal').classList.contains('active')) {
                closeVideoModal();
            }
        }
    });
}

function openImageModal(imageSrc, title, description) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalImageTitle');
    const modalDesc = document.getElementById('modalImageDesc');
    
    if (!modal || !modalImg) return;
    
    modalImg.src = imageSrc;
    modalImg.alt = title;
    modalTitle.textContent = title;
    modalDesc.textContent = description;
    
    modal.classList.add('active');
    AppState.isModalOpen = true;
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    if (!modal) return;
    
    modal.classList.remove('active');
    AppState.isModalOpen = false;
    document.body.style.overflow = '';
    
    // Сбрасываем src чтобы освободить память
    setTimeout(() => {
        if (modalImg) modalImg.src = '';
    }, 300);
}

function openVideoModal(videoSrc, title, description) {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.getElementById('modalVideoTitle');
    const modalDesc = document.getElementById('modalVideoDesc');
    
    if (!modal || !modalVideo) return;
    
    // Останавливаем предыдущее видео если есть
    if (AppState.currentVideo) {
        AppState.currentVideo.pause();
        AppState.currentVideo.currentTime = 0;
    }
    
    modalVideo.src = videoSrc;
    modalTitle.textContent = title;
    modalDesc.textContent = description;
    
    modal.classList.add('active');
    AppState.isModalOpen = true;
    document.body.style.overflow = 'hidden';
    
    // Запоминаем текущее видео
    AppState.currentVideo = modalVideo;
    
    // Пытаемся запустить воспроизведение
    const playPromise = modalVideo.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Автовоспроизведение заблокировано:', error);
        });
    }
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    
    if (!modal) return;
    
    modal.classList.remove('active');
    AppState.isModalOpen = false;
    document.body.style.overflow = '';
    
    // Останавливаем видео
    if (modalVideo) {
        modalVideo.pause();
        modalVideo.currentTime = 0;
    }
    
    AppState.currentVideo = null;
}

// ===== АНИМАЦИИ ПРИ СКРОЛЛЕ =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.yy-work-card, .yy-gallery-item, .yy-about-p, .yy-tool'
    );
    
    // Функция проверки видимости
    function checkVisibility() {
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            
            // Элемент виден на 80% своей высоты
            if (rect.top <= windowHeight * 0.8 && rect.bottom >= 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            }
        });
    }
    
    // Изначально скрываем элементы
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
    });
    
    // Проверяем при загрузке и скролле
    window.addEventListener('load', checkVisibility);
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);
    
    // Первая проверка
    setTimeout(checkVisibility, 100);
}

// ===== УТИЛИТЫ =====
// Обработка ошибок загрузки изображений
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        console.warn('Не удалось загрузить изображение:', this.src);
        this.style.backgroundColor = '#1a1a1a';
        this.style.padding = '2rem';
        this.alt = 'Изображение не загружено';
        
        // Создаем плейсхолдер
        const placeholder = document.createElement('div');
        placeholder.style.width = '100%';
        placeholder.style.height = '100%';
        placeholder.style.display = 'flex';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
        placeholder.style.color = '#8a8a8a';
        placeholder.style.fontFamily = 'Roboto Mono, monospace';
        placeholder.textContent = 'Изображение не загружено';
        
        this.parentNode.replaceChild(placeholder, this);
    });
});

// Ленивая загрузка изображений
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Сохранение позиции скролла
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('yy_scrollPosition', window.scrollY);
});

window.addEventListener('load', () => {
    const savedPosition = sessionStorage.getItem('yy_scrollPosition');
    if (savedPosition) {
        requestAnimationFrame(() => {
            window.scrollTo(0, parseInt(savedPosition));
            sessionStorage.removeItem('yy_scrollPosition');
        });
    }
});

// Индикатор загрузки
window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 300);
});