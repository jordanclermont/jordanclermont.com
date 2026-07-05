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

  const root = document.documentElement;
  const store = (key, val) => {
    try {
      if (val) localStorage.setItem(key, val);
      else localStorage.removeItem(key);
    } catch (e) { /* private mode */ }
  };
  const recall = key => {
    try { return localStorage.getItem(key) || ''; } catch (e) { return ''; }
  };
  store('jc-theme', ''); // clear key from the retired palette picker

  // ── day/night toggle — follows the system unless the visitor picks ──
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const effectiveMode = () =>
    root.getAttribute('data-mode') || (prefersDark.matches ? 'night' : 'day');

  const modeBtn = document.createElement('button');
  modeBtn.type = 'button';
  modeBtn.className = 'dp-toggle dp-mode';

  const paintModeBtn = () => {
    const next = effectiveMode() === 'day' ? 'night' : 'day';
    modeBtn.textContent = next === 'night' ? '\u{1F319}' : '\u{2600}\u{FE0F}';
    const label = next === 'night' ? 'Switch to night' : 'Switch to day';
    modeBtn.title = label;
    modeBtn.setAttribute('aria-label', label);
  };

  modeBtn.addEventListener('click', () => {
    const next = effectiveMode() === 'day' ? 'night' : 'day';
    root.setAttribute('data-mode', next);
    store('jc-mode', next);
    paintModeBtn();
  });
  prefersDark.addEventListener('change', paintModeBtn);

  // ══ DEV FONT PANEL — temporary preview tool, remove before launch ══
  const FONTS = [
    { id: '', label: 'Cormorant (current)' },
    { id: 'playfair', label: 'Playfair',
      href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap' },
    { id: 'newsreader', label: 'Newsreader',
      href: 'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,600&display=swap' },
    { id: 'lora', label: 'Lora',
      href: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap' },
    { id: 'spectral', label: 'Spectral',
      href: 'https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap' },
    { id: 'sourceserif', label: 'Source Serif',
      href: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,600&display=swap' },
    { id: 'dmserif', label: 'DM Serif',
      href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap' },
  ];

  const loadedFonts = new Set();
  const loadFont = f => {
    if (!f.href || loadedFonts.has(f.id)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = f.href;
    document.head.appendChild(link);
    loadedFonts.add(f.id);
  };

  const savedFont = recall('jc-font');
  const savedFontDef = FONTS.find(f => f.id === savedFont);
  if (savedFontDef && savedFontDef.id) {
    loadFont(savedFontDef);
    root.setAttribute('data-font', savedFontDef.id);
  }

  const picker = document.createElement('div');
  picker.className = 'dev-picker';
  picker.innerHTML =
    '<div class="dp-panel" role="group" aria-label="Font preview">' +
    '  <div class="dp-heading">Headline font</div>' +
    '  <div class="dp-row" data-kind="font"></div>' +
    '</div>' +
    '<div class="dp-buttons">' +
    '  <button class="dp-toggle dp-fonts" type="button" aria-label="Preview fonts" title="Preview fonts">Aa</button>' +
    '</div>';

  const fontRow = picker.querySelector('[data-kind="font"]');
  FONTS.forEach(f => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dp-font' + (f.id === savedFont ? ' active' : '');
    b.textContent = f.label;
    b.setAttribute('aria-label', 'Headline font: ' + f.label);
    b.addEventListener('click', () => {
      loadFont(f);
      if (f.id) root.setAttribute('data-font', f.id);
      else root.removeAttribute('data-font');
      store('jc-font', f.id);
      fontRow.querySelectorAll('.dp-font').forEach(x => x.classList.toggle('active', x === b));
    });
    fontRow.appendChild(b);
  });

  picker.querySelector('.dp-buttons').prepend(modeBtn);
  picker.querySelector('.dp-fonts').addEventListener('click', () => picker.classList.toggle('open'));
  paintModeBtn();
  document.body.appendChild(picker);
})();
