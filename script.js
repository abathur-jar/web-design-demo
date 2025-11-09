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

// === ВИДЕО СИСТЕМА КАК НА PINTEREST ===
let currentlyPlaying = null;

function initVideoSystem() {
    document.querySelectorAll('.work-item').forEach(item => {
        const video = item.querySelector('video');
        const videoSrc = item.getAttribute('data-video');
        
        // Загружаем правильное видео
        if (videoSrc) {
            video.innerHTML = `<source src="${videoSrc}" type="video/mp4">`;
        }
        
        // Устанавливаем превью (первый кадр)
        video.currentTime = 0.1;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        
        // Клик по видео
        item.addEventListener('click', function(e) {
            // Если кликнули на кнопки управления - игнорируем
            if (e.target.closest('.control-btn')) return;
            
            if (currentlyPlaying === this) {
                pauseVideo(this);
            } else {
                if (currentlyPlaying) {
                    pauseVideo(currentlyPlaying);
                }
                playVideo(this);
            }
        });
        
        // Создаем контролы
        createVideoControls(item, video);
    });
}

function playVideo(item) {
    const video = item.querySelector('video');
    const preview = item.querySelector('.video-preview');
    
    // Останавливаем текущее видео
    if (currentlyPlaying && currentlyPlaying !== item) {
        pauseVideo(currentlyPlaying);
    }
    
    // Запускаем новое
    video.muted = false;
    video.play().then(() => {
        item.classList.add('playing');
        currentlyPlaying = item;
        
        // Прокручиваем к видео если оно не в зоне видимости
        const rect = item.getBoundingClientRect();
        if (rect.top < 100 || rect.bottom > window.innerHeight - 100) {
            item.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }).catch(e => {
        console.log('Ошибка воспроизведения:', e);
    });
}

function pauseVideo(item) {
    const video = item.querySelector('video');
    video.pause();
    video.currentTime = 0;
    video.muted = true;
    item.classList.remove('playing');
    
    if (currentlyPlaying === item) {
        currentlyPlaying = null;
    }
}

function createVideoControls(item, video) {
    const controls = document.createElement('div');
    controls.className = 'video-controls';
    
    controls.innerHTML = `
        <button class="control-btn play-pause">⏸</button>
        <button class="control-btn restart">↺</button>
        <span class="video-time">0:00</span>
    `;
    
    item.querySelector('.video-preview').appendChild(controls);
    
    // Обработчики контролов
    controls.querySelector('.play-pause').addEventListener('click', function(e) {
        e.stopPropagation();
        if (video.paused) {
            playVideo(item);
        } else {
            pauseVideo(item);
        }
    });
    
    controls.querySelector('.restart').addEventListener('click', function(e) {
        e.stopPropagation();
        video.currentTime = 0;
        if (video.paused) {
            playVideo(item);
        }
    });
    
    // Обновление времени
    video.addEventListener('timeupdate', function() {
        const minutes = Math.floor(video.currentTime / 60);
        const seconds = Math.floor(video.currentTime % 60);
        controls.querySelector('.video-time').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    });
    
    // Обновление иконки паузы/воспроизведения
    video.addEventListener('play', function() {
        controls.querySelector('.play-pause').textContent = '⏸';
    });
    
    video.addEventListener('pause', function() {
        controls.querySelector('.play-pause').textContent = '▶';
    });
}

// Останавливаем видео при скролле далеко от него
window.addEventListener('scroll', function() {
    if (currentlyPlaying) {
        const rect = currentlyPlaying.getBoundingClientRect();
        if (rect.top < -200 || rect.bottom > window.innerHeight + 200) {
            pauseVideo(currentlyPlaying);
        }
    }
});

// === МОДАЛЬНОЕ ОКНО ДЛЯ ИЗОБРАЖЕНИЙ ===
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const closeBtn = document.querySelector('.modal-close');

function openModal(imgSrc, title, description) {
    modal.style.display = 'block';
    modalImg.src = imgSrc;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

document.querySelectorAll('.gallery-item img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
        const galleryItem = this.closest('.gallery-item');
        const title = galleryItem.querySelector('.gallery-title').textContent;
        const description = galleryItem.querySelector('.gallery-description').textContent;
        openModal(this.src, title, description);
    });
});

closeBtn.addEventListener('click', closeModal);

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
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
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            this.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                menuToggle.textContent = '☰';
            });
        });
        
        document.addEventListener('click', function(e) {
            if (!e.target.closest('nav') && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });
    }
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function() {
    initVideoSystem();
    initBurgerMenu();
    console.log('Сайт загружен! Pinterest-стиль видео готов.');
});