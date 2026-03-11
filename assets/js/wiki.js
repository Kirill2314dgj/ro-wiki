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

        function showToast(message, duration = 3000) {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, duration);
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('✅ Link copied to clipboard!');
            }).catch(() => {
                showToast('❌ Failed to copy link');
            });
        }

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

        document.querySelectorAll('.share-links a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const url = this.href;
                window.open(url, '_blank', 'width=600,height=400');
                shareLinks.setAttribute('aria-hidden', 'true');
            });
        });

        shareBtn.addEventListener('dblclick', function() {
            copyToClipboard(window.location.href);
            shareLinks.setAttribute('aria-hidden', 'true');
        });

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
                    
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // === ПОДСВЕТКА ТЕКУЩЕГО РАЗДЕЛА ===
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
        const lightboxModal = document.getElementById('lightboxModal');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxCaption = document.getElementById('lightboxCaption');
        const lightboxClose = document.getElementById('lightboxClose');

        if (!lightboxModal || !lightboxImage || !lightboxCaption || !lightboxClose) {
            console.log('Lightbox elements not found');
            return;
        }

        // Функция открытия lightbox
        function openLightbox(imgElement) {
            console.log('Opening lightbox with image:', imgElement.src);
            lightboxImage.src = imgElement.src;
            lightboxImage.alt = imgElement.alt || 'Full size image';
            lightboxCaption.textContent = imgElement.alt || imgElement.title || 'Image preview';
            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Функция закрытия lightbox
        function closeLightbox() {
            console.log('Closing lightbox');
            lightboxModal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                lightboxImage.src = '';
            }, 300);
        }

        // Закрытие по клику на крестик
        lightboxClose.addEventListener('click', closeLightbox);

        // Закрытие по клику вне изображения
        lightboxModal.addEventListener('click', function(event) {
            if (event.target === lightboxModal) {
                closeLightbox();
            }
        });

        // Закрытие по клавише Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && lightboxModal.classList.contains('active')) {
                closeLightbox();
            }
        });

        // Добавляем обработчики для всех изображений в статье
        function addClickHandlersToImages() {
            const articleImages = document.querySelectorAll('.article-content img');
            console.log('Found images:', articleImages.length);
            
            articleImages.forEach((img) => {
                if (img.src) {
                    console.log('Adding click handler to image:', img.src);
                    
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
                    img.style.cursor = 'pointer';
                }
            });
        }

        // Запускаем добавление обработчиков
        addClickHandlersToImages();

        // Наблюдаем за изменениями в DOM
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    addClickHandlersToImages();
                }
            });
        });

        const articleContent = document.querySelector('.article-content');
        if (articleContent) {
            observer.observe(articleContent, {
                childList: true,
                subtree: true
            });
        }
    }

    // === ЗАПУСК ВСЕХ ФУНКЦИЙ ===
    initProgressBar();
    initSharing();
    initDates();
    initSmoothScroll();
    initActiveSection();
    initLightbox(); // Добавляем инициализацию lightbox
});
