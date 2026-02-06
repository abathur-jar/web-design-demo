// === ОСНОВНЫЕ ФУНКЦИИ ===

// Плавная прокрутка
document.querySelector('.sketch-button').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#works').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
});

// Плавная прокрутка для меню
document.querySelectorAll('.sketch-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Закрываем мобильное меню если открыто
            const navLeft = document.querySelector('.nav-left');
            const navRight = document.querySelector('.nav-right');
            const menuToggle = document.querySelector('.menu-toggle');
            
            if (navLeft.classList.contains('mobile-active')) {
                navLeft.classList.remove('mobile-active');
                navRight.classList.remove('mobile-active');
                menuToggle.textContent = '☰';
            }
            
            // Прокручиваем к цели
            targetElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// === АНИМАЦИЯ ПРИ СКРОЛЛЕ ===
function initScrollAnimations() {
    const workItems = document.querySelectorAll('.sketch-card');
    const aboutParagraphs = document.querySelectorAll('.sketch-paragraph');
    
    function checkVisibility() {
        // Работы
        workItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            if (rect.top <= windowHeight * 0.85 && rect.bottom >= 0) {
                item.classList.add('visible');
            }
        });
        
        // Параграфы "Обо мне"
        aboutParagraphs.forEach((para, index) => {
            const rect = para.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            if (rect.top <= windowHeight * 0.85 && rect.bottom >= 0) {
                setTimeout(() => {
                    para.style.opacity = '1';
                    para.style.transform = 'translateX(0)';
                }, index * 200);
            }
        });
    }
    
    // Изначально скрываем элементы
    workItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    aboutParagraphs.forEach(para => {
        para.style.opacity = '0';
        para.style.transform = 'translateX(-20px)';
        para.style.transition = 'all 0.5s ease';
    });
    
    // Проверяем при загрузке и скролле
    window.addEventListener('load', checkVisibility);
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);
    
    // Первая проверка
    setTimeout(checkVisibility, 100);
}

// === ГАЛЕРЕЯ ===
function scrollGallery(direction) {
    const carousel = document.getElementById('galleryCarousel');
    if (carousel) {
        const scrollAmount = 350;
        carousel.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }
}

// Добавляем возможность перетаскивания галереи
function initGalleryDrag() {
    const carousel = document.getElementById('galleryCarousel');
    if (!carousel) return;
    
    let isDragging = false;
    let startX;
    let scrollLeft;
    
    carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        carousel.style.cursor = 'grabbing';
    });
    
    carousel.addEventListener('mouseleave', () => {
        isDragging = false;
        carousel.style.cursor = 'grab';
    });
    
    carousel.addEventListener('mouseup', () => {
        isDragging = false;
        carousel.style.cursor = 'grab';
    });
    
    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });
    
    carousel.style.cursor = 'grab';
}

// === ВИДЕО ===
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const videoModalTitle = document.getElementById('videoModalTitle');
const videoModalDescription = document.getElementById('videoModalDescription');

function openVideoModal(videoSrc, title, description) {
    if (!videoModal) return;
    
    videoModal.style.display = 'block';
    modalVideo.src = videoSrc;
    videoModalTitle.textContent = title;
    videoModalDescription.textContent = description;
    document.body.style.overflow = 'hidden';
    
    // Пытаемся запустить видео
    const playPromise = modalVideo.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(e => {
            console.log('Автовоспроизведение заблокировано');
        });
    }
}

function closeVideoModal() {
    if (!videoModal) return;
    
    videoModal.style.display = 'none';
    modalVideo.pause();
    modalVideo.currentTime = 0;
    document.body.style.overflow = 'auto';
}

// === ИЗОБРАЖЕНИЯ ===
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');

function openModal(imgSrc, title, description) {
    if (!modal) return;
    
    modal.style.display = 'block';
    modalImg.src = imgSrc;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!modal) return;
    
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Добавляем обработчики кликов на изображения
function initGalleryClicks() {
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            const galleryItem = this.closest('.gallery-item');
            const title = galleryItem.querySelector('.gallery-title').textContent;
            const description = galleryItem.querySelector('.gallery-description').textContent;
            openModal(this.src, title, description);
        });
    });
}

// === БУРГЕР-МЕНЮ ===
function initBurgerMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLeft = document.querySelector('.nav-left');
    const navRight = document.querySelector('.nav-right');
    
    if (!menuToggle || !navLeft || !navRight) return;
    
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const isActive = navLeft.classList.contains('mobile-active');
        
        if (isActive) {
            navLeft.classList.remove('mobile-active');
            navRight.classList.remove('mobile-active');
            this.textContent = '☰';
            this.style.transform = 'rotate(0deg)';
        } else {
            navLeft.classList.add('mobile-active');
            navRight.classList.add('mobile-active');
            this.textContent = '✕';
            this.style.transform = 'rotate(90deg)';
        }
    });
    
    // Закрытие по клику на ссылку
    document.querySelectorAll('.sketch-link, .sketch-social').forEach(link => {
        link.addEventListener('click', () => {
            navLeft.classList.remove('mobile-active');
            navRight.classList.remove('mobile-active');
            menuToggle.textContent = '☰';
            menuToggle.style.transform = 'rotate(0deg)';
        });
    });
    
    // Закрытие по клику вне меню
    document.addEventListener('click', function(e) {
        if (!e.target.closest('nav') && 
            !e.target.closest('.menu-toggle') &&
            (navLeft.classList.contains('mobile-active') || 
             navRight.classList.contains('mobile-active'))) {
            navLeft.classList.remove('mobile-active');
            navRight.classList.remove('mobile-active');
            menuToggle.textContent = '☰';
            menuToggle.style.transform = 'rotate(0deg)';
        }
    });
}

// === ОБЩИЕ ОБРАБОТЧИКИ ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('✨ Сайт в стиле Yellow Yeti загружен!');
    
    // Инициализация всех функций
    initScrollAnimations();
    initGalleryDrag();
    initGalleryClicks();
    initBurgerMenu();
    
    // Закрытие модалок по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (videoModal && videoModal.style.display === 'block') {
                closeVideoModal();
            }
            if (modal && modal.style.display === 'block') {
                closeModal();
            }
        }
    });
    
    // Закрытие модалок по клику на оверлей
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        });
    }
    
    if (videoModal) {
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal || e.target.classList.contains('modal-overlay')) {
                closeVideoModal();
            }
        });
    }
    
    // Прелоад видео для плавного воспроизведения
    document.querySelectorAll('.video-container video').forEach(video => {
        video.preload = 'metadata';
        video.addEventListener('loadedmetadata', function() {
            this.currentTime = 0.1;
        });
        
        // Обработка ошибок загрузки видео
        video.addEventListener('error', function() {
            console.warn('Не удалось загрузить видео:', this.src);
            const container = this.closest('.video-container');
            if (container) {
                container.innerHTML = `
                    <div class="video-error">
                        <div class="error-icon">⚠</div>
                        <div class="error-text">Видео не загружено</div>
                        <div class="error-subtext">Проверьте путь к файлу</div>
                    </div>
                `;
            }
        });
    });
    
    // Добавляем CSS для ошибок видео
    const errorStyle = document.createElement('style');
    errorStyle.textContent = `
        .video-error {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #f0f0f0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #666;
            font-family: 'Shantell Sans', cursive;
        }
        
        .error-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.6;
        }
        
        .error-text {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .error-subtext {
            font-size: 0.9rem;
            opacity: 0.8;
        }
    `;
    document.head.appendChild(errorStyle);
    
    // Анимация загрузки
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-doodle">✎</div>
        <div class="loader-text">Рисую сайт...</div>
    `;
    document.body.appendChild(loader);
    
    const loaderStyle = document.createElement('style');
    loaderStyle.textContent = `
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--paper);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        
        .loader-doodle {
            font-size: 4rem;
            color: var(--accent-yellow);
            animation: loaderSpin 1s linear infinite;
            margin-bottom: 1.5rem;
        }
        
        .loader-text {
            font-family: 'Caveat', cursive;
            font-size: 1.8rem;
            color: var(--ink);
        }
        
        @keyframes loaderSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(loaderStyle);
    
    // Скрываем лоадер после загрузки
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            
            // Удаляем лоадер из DOM через некоторое время
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 500);
        }, 800);
    });
});

// Предотвращаем перетаскивание изображений
document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// Обработка изменения ориентации устройства
let lastOrientation = window.orientation;
window.addEventListener('orientationchange', function() {
    if (window.orientation !== lastOrientation) {
        lastOrientation = window.orientation;
        // Принудительно обновляем анимации при повороте
        setTimeout(initScrollAnimations, 300);
    }
});

// Добавляем поддержку касаний для галереи на мобильных
function initTouchGallery() {
    const carousel = document.getElementById('galleryCarousel');
    if (!carousel) return;
    
    let startX = 0;
    let scrollLeft = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    }, { passive: true });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!startX) return;
        e.preventDefault();
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    }, { passive: false });
    
    carousel.addEventListener('touchend', () => {
        startX = 0;
    });
}

// Инициализация касаний после загрузки
if ('ontouchstart' in window) {
    document.addEventListener('DOMContentLoaded', initTouchGallery);
}

// Сохраняем позицию скролла для плавного возврата
let scrollPosition = 0;
window.addEventListener('scroll', function() {
    scrollPosition = window.scrollY;
});

// Плавный скролл кверху при обновлении
window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});