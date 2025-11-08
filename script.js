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

// === МОДАЛЬНОЕ ОКНО ДЛЯ ВИДЕО ===
function initVideoModal() {
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <video controls>
                Ваш браузер не поддерживает видео
            </video>
            <div class="video-info">
                <h3 class="video-title"></h3>
                <p class="video-description"></p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const modalVideo = modal.querySelector('video');

    // Открытие модального окна при клике на видео
    document.querySelectorAll('.video-container').forEach(container => {
        container.addEventListener('click', function() {
            const video = this.querySelector('video');
            const source = video.querySelector('source').src;
            const workContent = this.closest('.work-item').querySelector('.work-content');
            const title = workContent.querySelector('h3').textContent;
            const description = workContent.querySelector('p').textContent;
            
            openModal(source, title, description);
        });
    });

    function openModal(videoSrc, title, description) {
        // Останавливаем все фоновые видео
        document.querySelectorAll('.video-container video').forEach(vid => {
            vid.pause();
        });
        
        // Настраиваем модальное видео
        modalVideo.innerHTML = '';
        const source = document.createElement('source');
        source.src = videoSrc;
        source.type = 'video/mp4';
        modalVideo.appendChild(source);
        
        modal.querySelector('.video-title').textContent = title;
        modal.querySelector('.video-description').textContent = description;
        
        // Показываем модальное окно
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Загружаем видео
        modalVideo.load();
        
        // Пытаемся воспроизвести, но не блокируем если браузер запрещает автоплей
        modalVideo.play().catch(e => {
            console.log('Браузер запретил автовоспроизведение - пользователь запустит вручную');
        });
    }

    function closeModal() {
        const modal = document.querySelector('.video-modal');
        modal.classList.remove('active');
        modalVideo.pause();
        modalVideo.currentTime = 0;
        document.body.style.overflow = 'auto';
        
        // Перезапускаем фоновые видео через секунду
        setTimeout(() => {
            document.querySelectorAll('.video-container video').forEach(vid => {
                vid.play().catch(e => {
                    // Игнорируем ошибки автовоспроизведения для фоновых видео
                });
            });
        }, 1000);
    }

    // Закрытие модального окна
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);

    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// === ПРОВЕРКА ВИДЕО ФАЙЛОВ ===
function checkVideos() {
    document.querySelectorAll('video source').forEach(source => {
        const src = source.getAttribute('src');
        
        // Проверяем существование файла
        fetch(src, { method: 'HEAD' })
            .then(response => {
                if (!response.ok) {
                    console.error('Файл не найден:', src);
                    showVideoError(source);
                }
            })
            .catch(error => {
                console.error('Ошибка загрузки:', src, error);
                showVideoError(source);
            });
    });
}

function showVideoError(source) {
    const video = source.closest('video');
    const container = video.closest('.video-container');
    
    // Не блокируем клик, но показываем ошибку
    container.style.position = 'relative';
    
    const errorMsg = document.createElement('div');
    errorMsg.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 0, 0, 0.8);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 0.8rem;
        z-index: 10;
    `;
    errorMsg.textContent = 'Файл не найден';
    
    container.appendChild(errorMsg);
}

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

// === ИНИЦИАЛИЗАЦИЯ ВСЕГО ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ===
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем модальное окно
    initVideoModal();
    
    // Запускаем фоновые видео
    initBackgroundVideos();
    
    // Проверяем наличие видео файлов
    checkVideos();
    
    console.log('Сайт загружен! Модальное окно готово к работе.');
});