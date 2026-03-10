// assets/js/toc-mobile.js
document.addEventListener('DOMContentLoaded', function() {
    // Создаем кнопку и модальное окно только на мобильных устройствах
    if (window.innerWidth <= 768) {
        createMobileTOC();
    }
    
    // Обновляем при изменении размера окна
    window.addEventListener('resize', function() {
        const existingFab = document.querySelector('.toc-fab');
        const existingModal = document.querySelector('.toc-modal');
        
        if (window.innerWidth <= 768) {
            if (!existingFab) {
                createMobileTOC();
            }
        } else {
            if (existingFab) existingFab.remove();
            if (existingModal) existingModal.remove();
        }
    });
    
    function createMobileTOC() {
        // Получаем оригинальное оглавление
        const originalToc = document.querySelector('.article-aside');
        if (!originalToc) return;
        
        // Клонируем содержимое
        const tocContent = originalToc.cloneNode(true);
        
        // Создаем кнопку
        const fab = document.createElement('button');
        fab.className = 'toc-fab';
        fab.setAttribute('aria-label', 'Open table of contents');
        fab.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/>
            </svg>
        `;
        
        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.className = 'toc-modal';
        modal.innerHTML = `
            <div class="toc-modal-content">
                <div class="toc-modal-header">
                    <h2>On this page</h2>
                    <button class="toc-close" aria-label="Close">×</button>
                </div>
                ${tocContent.innerHTML}
            </div>
        `;
        
        document.body.appendChild(fab);
        document.body.appendChild(modal);
        
        // Открытие модального окна
        fab.addEventListener('click', function() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Закрытие
        const closeBtn = modal.querySelector('.toc-close');
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Закрытие по клику на фон
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Закрытие по ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Плавный скролл к якорям
        modal.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                    
                    setTimeout(() => {
                        const headerOffset = 100;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }, 300);
                }
            });
        });
    }
});
