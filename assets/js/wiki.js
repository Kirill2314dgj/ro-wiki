// assets/js/wiki.js
// Скрипты только для страниц Wiki

document.addEventListener('DOMContentLoaded', function() {
    // === ПРОГРЕСС-БАР ===
    function initProgressBar() {
        const progressBar = document.getElementById('progressBar');
        if (!progressBar) return;
        
        window.addEventListener('scroll', function() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // === ШЕРИНГ ===
    function initSharing() {
        const shareBtn = document.getElementById('shareBtn');
        const shareLinks = document.getElementById('shareLinks');
        const toast = document.getElementById('shareToast');
        
        if (!shareBtn || !shareLinks || !toast) return;

        // Показать уведомление
        function showToast(message, duration = 3000) {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, duration);
        }

        // Копирование ссылки
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('✅ Link copied to clipboard!');
            }).catch(() => {
                showToast('❌ Failed to copy link');
            });
        }

        // Настройка ссылок для шаринга
        function setupShareLinks() {
            const currentUrl = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            const twLink = document.getElementById('twShare');
            const tgLink = document.getElementById('tgShare');
            const vkLink = document.getElementById('vkShare');
            
            if (twLink) twLink.href = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${title}`;
            if (tgLink) tgLink.href = `https://t.me/share/url?url=${currentUrl}&text=${title}`;
            if (vkLink) vkLink.href = `https://vk.com/share.php?url=${currentUrl}&title=${title}`;
        }

        // Показываем/скрываем ссылки
        shareBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isHidden = shareLinks.getAttribute('aria-hidden') === 'true';
            
            if (isHidden) {
                shareLinks.setAttribute('aria-hidden', 'false');
                setupShareLinks();
            } else {
                shareLinks.setAttribute('aria-hidden', 'true');
            }
        });

        // Обработка клика по ссылкам
        document.querySelectorAll('.share-links a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const url = this.href;
                window.open(url, '_blank', 'width=600,height=400');
                shareLinks.setAttribute('aria-hidden', 'true');
            });
        });

        // Копирование при двойном клике
        shareBtn.addEventListener('dblclick', function() {
            copyToClipboard(window.location.href);
            shareLinks.setAttribute('aria-hidden', 'true');
        });

        // Закрытие при клике вне
        document.addEventListener('click', function(e) {
            if (!shareBtn.contains(e.target) && !shareLinks.contains(e.target)) {
                shareLinks.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // === ДАТЫ ===
    function initDates() {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = today.toLocaleDateString('en-US', options);
        const isoDate = today.toISOString().split('T')[0];
        
        document.querySelectorAll('time').forEach(timeEl => {
            if (!timeEl.getAttribute('datetime')) {
                timeEl.setAttribute('datetime', isoDate);
            }
            if (!timeEl.textContent || timeEl.textContent.trim() === '') {
                timeEl.textContent = formattedDate;
            }
        });
    }

    // === ПЛАВНАЯ НАВИГАЦИЯ ПО ЯКОРЯМ ===
    function initSmoothScroll() {
        document.querySelectorAll('.article-aside a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Обновляем URL без перезагрузки
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // === ПОДСВЕТКА ТЕКУЩЕГО РАЗДЕЛА В САЙДБАРЕ ===
    function initActiveSection() {
        const sections = document.querySelectorAll('h2[id], h3[id]');
        const navLinks = document.querySelectorAll('.article-aside a[href^="#"]');
        
        if (!sections.length || !navLinks.length) return;

        window.addEventListener('scroll', function() {
            let current = '';
            const scrollPos = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollPos >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.removeAttribute('aria-current');
                const href = link.getAttribute('href').substring(1);
                if (href === current) {
                    link.setAttribute('aria-current', 'location');
                }
            });
        });
    }

    // === LIGHTBOX ДЛЯ ИЗОБРАЖЕНИЙ ===
    function initLightbox() {
        // Создаем элементы lightbox, если их нет
        if (!document.getElementById('lightboxModal')) {
            const lightboxHTML = `
                <div class="lightbox-modal" id="lightboxModal" onclick="lightboxClick(event)">
                    <div class="lightbox-content">
                        <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
                        <img id="lightboxImage" src="" alt="">
                        <div class="lightbox-caption" id="lightboxCaption"></div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        }

        const lightboxModal = document.getElementById('lightboxModal');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxCaption = document.getElementById('lightboxCaption');

        if (!lightboxModal || !lightboxImage || !lightboxCaption) return;

        // Функция открытия lightbox
        window.openLightbox = function(imgElement) {
            lightboxImage.src = imgElement.src;
            lightboxImage.alt = imgElement.alt || 'Full size image';
            lightboxCaption.textContent = imgElement.alt || imgElement.title || 'Image preview';
            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // запрещаем прокрутку страницы
        };

        // Функция закрытия lightbox
        window.closeLightbox = function() {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = ''; // возвращаем прокрутку
            // Очищаем src после закрытия
            setTimeout(() => {
                lightboxImage.src = '';
            }, 300);
        };

        // Обработка клика вне изображения
        window.lightboxClick = function(event) {
            if (event.target === lightboxModal) {
                closeLightbox();
            }
        };

        // Закрытие по клавише Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && lightboxModal.classList.contains('active')) {
                closeLightbox();
            }
        });

        // Добавляем обработчики для всех изображений в статье
        function addClickHandlersToImages() {
            const articleImages = document.querySelectorAll('.article-content img');
            articleImages.forEach(img => {
                // Убеждаемся, что у изображения есть src
                if (img.src) {
                    // Удаляем старый обработчик, если был
                    img.removeEventListener('click', img.clickHandler);
                    
                    // Создаем новый обработчик
                    img.clickHandler = function() {
                        openLightbox(this);
                    };
                    
                    // Добавляем обработчик
                    img.addEventListener('click', img.clickHandler);
                    
                    // Добавляем атрибут для стилей
                    img.setAttribute('data-lightbox', 'true');
                    
                    // Добавляем кнопку для открытия (опционально)
                    addOpenButtonToImage(img);
                }
            });
        }

        // Добавляем кнопку "Открыть" рядом с изображением (опционально)
        function addOpenButtonToImage(img) {
            // Проверяем, есть ли уже кнопка
            const container = img.parentElement;
            if (!container) return;
            
            // Ищем существующую кнопку
            const existingBtn = container.querySelector('.image-open-btn');
            if (existingBtn) return;

            // Создаем кнопку
            const btn = document.createElement('button');
            btn.className = 'image-open-btn';
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M15 3h6v6h-2V5h-4V3zM9 3v2H5v4H3V3h6zm6 18v-2h4v-4h2v6h-6zm-6 0H3v-6h2v4h4v2z"/>
                </svg>
                View full size
            `;
            
            // Добавляем обработчик
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                openLightbox(img);
            });
            
            // Вставляем после изображения или его контейнера
            if (container.tagName === 'P' || container.tagName === 'DIV') {
                container.insertAdjacentElement('afterend', btn);
            } else {
                img.insertAdjacentElement('afterend', btn);
            }
        }

        // Запускаем добавление обработчиков
        addClickHandlersToImages();

        // Наблюдаем за изменениями в DOM (на случай динамической загрузки контента)
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    addClickHandlersToImages();
                }
            });
        });

        // Начинаем наблюдение за контентом статьи
        const articleContent = document.querySelector('.article-content');
        if (articleContent) {
            observer.observe(articleContent, {
                childList: true,
                subtree: true
            });
        }
    }

    // === ОБРАБОТКА ОШИБОК ЗАГРУЗКИ ИЗОБРАЖЕНИЙ ===
    function initImageErrorHandling() {
        document.querySelectorAll('.article-content img').forEach(img => {
            img.addEventListener('error', function() {
                // Если изображение не загрузилось, показываем заглушку
                this.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23333\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\' font-family=\'monospace\' font-size=\'14\'%3EImage not found%3C/text%3E%3C/svg%3E';
                this.alt = 'Image failed to load';
            });
        });
    }

    // === ЗАПУСК ВСЕХ ФУНКЦИЙ ===
    initProgressBar();
    initSharing();
    initDates();
    initSmoothScroll();
    initActiveSection();
    initLightbox();
    initImageErrorHandling();
});
