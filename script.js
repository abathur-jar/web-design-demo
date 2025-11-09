// === ПЛАВНАЯ ПРОКРУТКА ===
document.querySelector('.cta-button').addEventListener('click', function() {
    document.querySelector('#works').scrollIntoView({ 
        behavior: 'smooth' 
    });
});

// Плавная прокрутка для всех ссылок в меню
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({ 
            behavior: 'smooth' 
        });
    });
});

// === АНИМАЦИЯ ПРИ СКРОЛЛЕ ===
window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('.work-item');
    elements.forEach(element => {
        const position = element.getBoundingClientRect();
        
        // Если элемент в зоне видимости
        if(position.top < window.innerHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});

// Изначально скрываем элементы для анимации
document.querySelectorAll('.work-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'all 0.6s ease';
});

// === ВИДЕО ПРЕВЬЮ И МОДАЛЬНОЕ ОКНО ===
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const videoModalTitle = document.getElementById('videoModalTitle');
const videoModalDescription = document.getElementById('videoModalDescription');

// Функция открытия видео модалки
function openVideoModal(videoSrc, title, description) {
    videoModal.style.display = 'block';
    modalVideo.src = videoSrc;
    videoModalTitle.textContent = title;
    videoModalDescription.textContent = description;
    document.body.style.overflow = 'hidden';
    
    // Автозапуск видео при открытии
    modalVideo.play().catch(e => {
        console.log('Автовоспроизведение заблокировано браузером - пользователь запустит вручную');
    });
}

// Функция закрытия видео модалки
function closeVideoModal() {
    videoModal.style.display = 'none';
    modalVideo.pause();
    modalVideo.currentTime = 0;
    document.body.style.overflow = 'auto';
}

// Закрытие по клику вне видео
videoModal.addEventListener('click', function(e) {
    if (e.target === videoModal) {
        closeVideoModal();
    }
});

// Закрытие по Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && videoModal.style.display === 'block') {
        closeVideoModal();
    }
});

// Инициализация видео превью
function initVideoPreviews() {
    document.querySelectorAll('.video-container video').forEach(video => {
        // Устанавливаем видео на начало и приостанавливаем
        video.currentTime = 0.1;
        video.play().then(() => {
            video.pause();
        }).catch(e => {
            // Игнорируем ошибки автовоспроизведения
        });
    });
}

// === МОДАЛЬНОЕ ОКНО ДЛЯ ИЗОБРАЖЕНИЙ ===
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const closeBtn = document.querySelector('.modal-close');

// Функция открытия модального окна
function openModal(imgSrc, title, description) {
    modal.style.display = 'block';
    modalImg.src = imgSrc;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    document.body.style.overflow = 'hidden';
}

// Функция закрытия модального окна
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Добавляем обработчики кликов на изображения в галерее
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
        const galleryItem = this.closest('.gallery-item');
        const title = galleryItem.querySelector('.gallery-title').textContent;
        const description = galleryItem.querySelector('.gallery-description').textContent;
        openModal(this.src, title, description);
    });
});

// Закрытие по клику на крестик
closeBtn.addEventListener('click', closeModal);

// Закрытие по клику вне изображения
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Закрытие по клавише Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (modal.style.display === 'block') {
            closeModal();
        }
        if (videoModal.style.display === 'block') {
            closeVideoModal();
        }
    }
});

// Прокрутка галереи
function scrollGallery(direction) {
    const carousel = document.getElementById('galleryCarousel');
    carousel.scrollBy({
        left: direction,
        behavior: 'smooth'
    });
}

// === БУРГЕР-МЕНЮ ===
function initBurgerMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        console.log('Бургер-меню инициализировано');
        
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            this.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
        
        // Закрываем меню при клике на ссылку
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });
        
        // Закрываем меню при клике вне его области
        document.addEventListener('click', function(e) {
            if (!e.target.closest('nav') && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });
    }
}

// === ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ===
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем видео превью
    initVideoPreviews();
    
    // Инициализируем бургер-меню
    initBurgerMenu();
    
    console.log('Сайт загружен! Видеоплеер и модальные окна готовы.');
});