/**
 * YELLOW YETI STYLE - Сайт-портфолио
 * Скрипты в стилистике Yellow Yeti
 */

// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
const DOM = {
    menuToggle: document.getElementById('menuToggle'),
    mobileMenu: document.getElementById('mobileMenu'),
    imageModal: document.getElementById('imageModal'),
    videoModal: document.getElementById('videoModal'),
    modalOverlay: document.getElementById('modalOverlay'),
    videoModalOverlay: document.getElementById('videoModalOverlay'),
    modalClose: document.getElementById('modalClose'),
    videoModalClose: document.getElementById('videoModalClose'),
    modalImage: document.getElementById('modalImage'),
    modalVideo: document.getElementById('modalVideo'),
    modalTitle: document.getElementById('modalTitle'),
    modalDescription: document.getElementById('modalDescription'),
    videoModalTitle: document.getElementById('videoModalTitle'),
    videoModalDescription: document.getElementById('videoModalDescription')
};

// Состояние приложения
const AppState = {
    isMenuOpen: false,
    isModalOpen: false,
    currentVideo: null
};

// ===== ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 YULIA BYUKLIY — сайт в стиле Yellow Yeti загружен');

    initMobileMenu();
    initSmoothScrolling();
    initGallery();
    initVideoPlayers();
    initModals();
    initScrollAnimations();

    // Предзагрузка видео для превью
    preloadVideoPreviews();
});

// ===== МОБИЛЬНОЕ МЕНЮ =====
function initMobileMenu() {
    if (!DOM.menuToggle || !DOM.mobileMenu) return;

    DOM.menuToggle.addEventListener('click', toggleMobileMenu);
    DOM.menuToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMobileMenu();
        }
    });

    // Закрытие меню по клику на ссылку
    document.querySelectorAll('.yy-mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Закрытие меню по клику вне его
    document.addEventListener('click', (e) => {
        if (AppState.isMenuOpen && 
            !DOM.mobileMenu.contains(e.target) && 
            !DOM.menuToggle.contains(e.target)) {
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
    AppState.isMenuOpen = !AppState.isMenuOpen;
    
    DOM.mobileMenu.classList.toggle('active', AppState.isMenuOpen);
    DOM.menuToggle.setAttribute('aria-expanded', AppState.isMenuOpen.toString());
    
    // Блокировка скролла
    document.body.style.overflow = AppState.isMenuOpen ? 'hidden' : '';
    
    // Анимация иконки
    const iconLines = DOM.menuToggle.querySelectorAll('.yy-menu-icon');
    if (AppState.isMenuOpen) {
        iconLines[0].style.transform = 'translateY(11px) rotate(45deg)';
        iconLines[1].style.opacity = '0';
        iconLines[2].style.transform = 'translateY(-11px) rotate(-45deg)';
    } else {
        iconLines[0].style.transform = '';
        iconLines[1].style.opacity = '';
        iconLines[2].style.transform = '';
    }
}

function closeMobileMenu() {
    AppState.isMenuOpen = false;
    DOM.mobileMenu.classList.remove('active');
    DOM.menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    
    const iconLines = DOM.menuToggle.querySelectorAll('.yy-menu-icon');
    iconLines[0].style.transform = '';
    iconLines[1].style.opacity = '';
    iconLines[2].style.transform = '';
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
}

// ===== ГАЛЕРЕЯ ИЗОБРАЖЕНИЙ =====
function initGallery() {
    const viewButtons = document.querySelectorAll('.yy-view-button');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            
            openImageModal(imageSrc, title, description);
        });
    });
}

// ===== ВИДЕО ПЛЕЕРЫ =====
function initVideoPlayers() {
    const videoWrappers = document.querySelectorAll('.yy-video-wrapper');
    
    videoWrappers.forEach(wrapper => {
        // Клик по обёртке видео
        wrapper.addEventListener('click', function() {
            const videoSrc = this.getAttribute('data-video');
            const title = this.getAttribute('data-title');
            const description = this.getAttribute('data-description');
            
            openVideoModal(videoSrc, title, description);
        });
        
        // Клавиатурная доступность
        wrapper.setAttribute('tabindex', '0');
        wrapper.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const videoSrc = this.getAttribute('data-video');
                const title = this.getAttribute('data-title');
                const description = this.getAttribute('data-description');
                
                openVideoModal(videoSrc, title, description);
            }
        });
        
        // Предпросмотр видео
        const video = wrapper.querySelector('.yy-video-preview');
        if (video) {
            video.addEventListener('loadedmetadata', () => {
                video.currentTime = 1; // Устанавливаем на 1 секунду для превью
            });
            
            video.addEventListener('timeupdate', () => {
                if (video.currentTime > 3) {
                    video.pause();
                    video.currentTime = 1;
                }
            });
        }
    });
}

function preloadVideoPreviews() {
    const videos = document.querySelectorAll('.yy-video-preview');
    
    videos.forEach(video => {
        video.muted = true;
        video.playsInline = true;
        
        // Пытаемся запустить для превью
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Автовоспроизведение заблокировано - это нормально
            });
        }
    });
}

// ===== МОДАЛЬНЫЕ ОКНА =====
function initModals() {
    // Закрытие модалок
    if (DOM.modalClose) {
        DOM.modalClose.addEventListener('click', closeImageModal);
    }
    
    if (DOM.videoModalClose) {
        DOM.videoModalClose.addEventListener('click', closeVideoModal);
    }
    
    if (DOM.modalOverlay) {
        DOM.modalOverlay.addEventListener('click', closeImageModal);
    }
    
    if (DOM.videoModalOverlay) {
        DOM.videoModalOverlay.addEventListener('click', closeVideoModal);
    }
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (DOM.imageModal.classList.contains('active')) {
                closeImageModal();
            }
            if (DOM.videoModal.classList.contains('active')) {
                closeVideoModal();
            }
        }
    });
}

function openImageModal(imageSrc, title, description) {
    if (!DOM.imageModal) return;
    
    DOM.modalImage.src = imageSrc;
    DOM.modalImage.alt = title;
    DOM.modalTitle.textContent = title;
    DOM.modalDescription.textContent = description;
    
    DOM.imageModal.classList.add('active');
    AppState.isModalOpen = true;
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    if (!DOM.imageModal) return;
    
    DOM.imageModal.classList.remove('active');
    AppState.isModalOpen = false;
    document.body.style.overflow = '';
    
    // Сбрасываем src чтобы освободить память
    setTimeout(() => {
        DOM.modalImage.src = '';
    }, 300);
}

function openVideoModal(videoSrc, title, description) {
    if (!DOM.videoModal) return;
    
    // Останавливаем предыдущее видео если есть
    if (AppState.currentVideo) {
        AppState.currentVideo.pause();
        AppState.currentVideo.currentTime = 0;
    }
    
    DOM.modalVideo.src = videoSrc;
    DOM.videoModalTitle.textContent = title;
    DOM.videoModalDescription.textContent = description;
    
    DOM.videoModal.classList.add('active');
    AppState.isModalOpen = true;
    document.body.style.overflow = 'hidden';
    
    // Запоминаем текущее видео
    AppState.currentVideo = DOM.modalVideo;
    
    // Пытаемся запустить воспроизведение
    const playPromise = DOM.modalVideo.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Автовоспроизведение заблокировано:', error);
        });
    }
}

function closeVideoModal() {
    if (!DOM.videoModal) return;
    
    DOM.videoModal.classList.remove('active');
    AppState.isModalOpen = false;
    document.body.style.overflow = '';
    
    // Останавливаем видео
    if (DOM.modalVideo) {
        DOM.modalVideo.pause();
        DOM.modalVideo.currentTime = 0;
    }
    
    AppState.currentVideo = null;
}

// ===== АНИМАЦИИ ПРИ СКРОЛЛЕ =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.yy-gallery-item, .yy-work-card, .yy-about-block'
    );
    
    // Функция проверки видимости
    function checkVisibility() {
        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            // Элемент виден на 20% своей высоты
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
        this.style.backgroundColor = '#f2f2f2';
        this.style.padding = '2rem';
        this.alt = 'Изображение не загружено';
    });
});

// Ленивая загрузка
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
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
    sessionStorage.setItem('scrollPosition', window.scrollY);
});

window.addEventListener('load', () => {
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition));
        sessionStorage.removeItem('scrollPosition');
    }
});