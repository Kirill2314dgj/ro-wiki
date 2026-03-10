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

    // === ЗАПУСК ВСЕХ ФУНКЦИЙ ===
    initProgressBar();
    initSharing();
    initDates();
    initSmoothScroll();
    initActiveSection();
});
