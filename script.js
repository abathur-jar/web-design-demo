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

// === АВТОЗАПУСК ФОНОВЫХ ВИДЕО ===
function initBackgroundVideos() {
    document.querySelectorAll('.video-container video').forEach(video => {
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        
        // Пытаемся запустить воспроизведение
        video.play().catch(error => {
            // Игнорируем ошибки автовоспроизведения - это нормально
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
    document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона
}

// Функция закрытия модального окна
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Возвращаем прокрутку
}

// Добавляем обработчики кликов на изображения в галерее
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.style.cursor = 'pointer'; // Меняем курсор на указатель
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
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// === ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ===
document.addEventListener('DOMContentLoaded', function() {
    // Запускаем фоновые видео
    initBackgroundVideos();
    
    console.log('Сайт загружен! Модальное окно готово к работе.');
});

// Прокрутка галереи
function scrollGallery(direction) {
    const carousel = document.getElementById('galleryCarousel');
    carousel.scrollBy({
        left: direction,
        behavior: 'smooth'
    });
}

// Автопрокрутка галереи (опционально)
function initGalleryAutoScroll() {
    const carousel = document.getElementById('galleryCarousel');
    let scrollAmount = 0;
    
    setInterval(() => {
        scrollAmount += 300;
        if (scrollAmount >= carousel.scrollWidth - carousel.clientWidth) {
            scrollAmount = 0;
        }
        carousel.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }, 4000);
}

// === БУРГЕР-МЕНЮ ===
function initBurgerMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            // Меняем иконку бургера на крестик и обратно
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

// В функции DOMContentLoaded добавь:
document.addEventListener('DOMContentLoaded', function() {
    // Запускаем фоновые видео
    initBackgroundVideos();
    initBurgerMenu(); // Добавляем инициализацию бургер-меню
    
    console.log('Сайт загружен! Модальное окно и бургер-меню готовы к работе.');
});

// В функции DOMContentLoaded добавь:
document.addEventListener('DOMContentLoaded', function() {
    // Запускаем фоновые видео
    initBackgroundVideos();
    initBurgerMenu(); // Добавляем инициализацию бургер-меню
    
    console.log('Сайт загружен! Модальное окно и бургер-меню готовы к работе.');
});