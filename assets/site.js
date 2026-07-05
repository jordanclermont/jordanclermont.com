/* jordanclermont.com — shared scripts */
(() => {
  // ── reveal case studies as they scroll into view ──
  const articles = document.querySelectorAll('.case-study');
  if (articles.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.animationPlayState = 'running';
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    articles.forEach(a => {
      a.style.animationPlayState = 'paused';
      obs.observe(a);
    });
  }

  // ── day/night — follows the system unless the visitor picks a side ──
  const root = document.documentElement;
  const store = (key, val) => {
    try {
      if (val) localStorage.setItem(key, val);
      else localStorage.removeItem(key);
    } catch (e) { /* private mode */ }
  };
  store('jc-theme', ''); // clear keys from the retired preview tools
  store('jc-font', '');

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const effectiveMode = () =>
    root.getAttribute('data-mode') || (prefersDark.matches ? 'night' : 'day');

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'mode-toggle';

  const paint = () => {
    const next = effectiveMode() === 'day' ? 'night' : 'day';
    btn.textContent = next === 'night' ? '☾' : '☼'; // ☾ / ☼
    const label = next === 'night' ? 'Switch to night' : 'Switch to day';
    btn.title = label;
    btn.setAttribute('aria-label', label);
  };

  btn.addEventListener('click', () => {
    const next = effectiveMode() === 'day' ? 'night' : 'day';
    root.setAttribute('data-mode', next);
    store('jc-mode', next);
    paint();
  });
  prefersDark.addEventListener('change', paint);

  paint();
  document.body.appendChild(btn);
})();
