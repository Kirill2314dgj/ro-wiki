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
