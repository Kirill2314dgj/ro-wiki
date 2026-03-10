// Прогресс бар
window.addEventListener('scroll', function() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const progressBar = document.getElementById('progressBar');
  if (progressBar) progressBar.style.width = scrolled + '%';
});

// Мобильное меню
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// Кнопка Share
const shareBtn = document.getElementById('shareBtn');
const shareLinks = document.getElementById('shareLinks');
const toast = document.getElementById('shareToast');

if (shareBtn && shareLinks && toast) {
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  shareBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = shareLinks.getAttribute('aria-hidden') === 'true';
    shareLinks.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
    
    if (isHidden) {
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      
      const twShare = document.getElementById('twShare');
      const tgShare = document.getElementById('tgShare');
      const vkShare = document.getElementById('vkShare');
      
      if (twShare) twShare.href = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
      if (tgShare) tgShare.href = `https://t.me/share/url?url=${url}&text=${title}`;
      if (vkShare) vkShare.href = `https://vk.com/share.php?url=${url}&title=${title}`;
    }
  });

  shareBtn.addEventListener('dblclick', () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('✅ Link copied!');
    shareLinks.setAttribute('aria-hidden', 'true');
  });

  document.addEventListener('click', (e) => {
    if (!shareBtn.contains(e.target) && !shareLinks.contains(e.target)) {
      shareLinks.setAttribute('aria-hidden', 'true');
    }
  });
}

// Переключение темы
const themeToggles = document.querySelectorAll('[data-theme-toggle]');

themeToggles.forEach(btn => {
  btn.addEventListener('click', () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
});

// Загружаем сохраненную тему
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

// Обработка ресайза
window.addEventListener('resize', () => {
  if (window.innerWidth > 960) {
    if (mobileMenu) mobileMenu.classList.remove('active');
    if (hamburgerBtn) hamburgerBtn.classList.remove('active');
    document.body.style.overflow = '';
  }
});
