// main.js
// Содержит: 1) переключение темы (сохраняется в localStorage)
//            2) кнопка Share с fallback'ами и ссылками на соцсети

// ---------------------------
// 1) Theme toggle (твой оригинальный IIFE, без изменений логики, но в своём локальном scope)
(() => {
  const root = document.documentElement;
  const key = 'roWikiTheme';
  const saved = localStorage.getItem(key);
  root.dataset.theme = saved === 'light' ? 'light' : 'dark';

  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;

  const setLabel = () => {
    const dark = root.dataset.theme === 'dark';
    btn.textContent = dark ? '☀️ Light mode' : '🌙 Dark mode';
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  };

  setLabel();
  btn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(key, root.dataset.theme);
    setLabel();
  });
})();


// ---------------------------
// 2) Share button logic (отдельный IIFE)
(() => {
  // Кэшируем элементы
  const shareBtn = document.getElementById('shareBtn');
  const shareLinks = document.getElementById('shareLinks');
  const twShare = document.getElementById('twShare');
  const tgShare = document.getElementById('tgShare');
  const vkShare = document.getElementById('vkShare');
  const toastEl = document.getElementById('shareToast');

  if (!shareBtn || !toastEl) return;

  // Определяем URL и title страницы — приоритет: canonical -> og:url -> location
  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  const ogUrl = document.querySelector('meta[property="og:url"]')?.content;
  const pageUrl = canonical || ogUrl || location.href;
  const pageTitle = document.querySelector('meta[property="og:title"]')?.content || document.title || '';

  function showToast(text, timeout = 2200) {
    toastEl.textContent = text;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, timeout);
  }

  function buildSocialLinks(url, title) {
    const encUrl = encodeURIComponent(url);
    const encTitle = encodeURIComponent(title);
    return {
      twitter: `https://twitter.com/intent/tweet?text=${encTitle}&url=${encUrl}`,
      telegram: `https://t.me/share/url?url=${encUrl}&text=${encTitle}`,
      vk: `https://vk.com/share.php?url=${encUrl}&title=${encTitle}`
    };
  }

  // Primary click handler
  shareBtn.addEventListener('click', async (e) => {
    // Prevent default if button in form or link
    e.preventDefault();

    // 1) Web Share API (mobile / supported browsers) — самый лучший UX
    if (navigator.share) {
      try {
        await navigator.share({
          title: pageTitle,
          text: pageTitle,
          url: pageUrl
        });
        showToast('Ссылка отправлена');
        return;
      } catch (err) {
        // Если пользователь отменил action или произошла ошибка — идём дальше в fallback
        console.warn('navigator.share error:', err);
      }
    }

    // 2) Clipboard API (современные браузеры; требует user gesture — у нас клик)
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(pageUrl);
        showToast('Ссылка скопирована в буфер обмена');
        return;
      } catch (err) {
        console.warn('clipboard.writeText failed:', err);
      }
    }

    // 3) Fallback: execCommand copy (старые браузеры)
    try {
      const textarea = document.createElement('textarea');
      textarea.value = pageUrl;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (ok) {
        showToast('Ссылка скопирована (fallback)');
        return;
      }
    } catch (err) {
      console.warn('execCommand copy failed:', err);
    }

    // 4) Если ничто не сработало — показываем соцсети (fallback для десктопа)
    const links = buildSocialLinks(pageUrl, pageTitle);
    if (twShare) twShare.href = links.twitter;
    if (tgShare) tgShare.href = links.telegram;
    if (vkShare) vkShare.href = links.vk;
    shareLinks?.setAttribute('aria-hidden', 'false');
    showToast('Откройте одну из соцсетей для шаринга');
  });

  // Accessibility: нажимая Enter/Space на ссылках — открывать в новой вкладке уже задано через target="_blank"
  // Optionally: закрыть блок соцсетей при клике вне него
  document.addEventListener('click', (evt) => {
    // Если клик вне shareWrap, скрываем ссылки
    const wrap = shareBtn?.closest('.share-wrap');
    if (!wrap) return;
    if (!wrap.contains(evt.target)) {
      shareLinks?.setAttribute('aria-hidden', 'true');
    }
  });
})();
