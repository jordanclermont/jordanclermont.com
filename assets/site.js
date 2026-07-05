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

  // ══ DEV THEME PICKER — temporary preview tool, remove before launch ══
  const THEMES = [
    { id: '',        label: 'Horizon (current)', swatch: '#3d5f6e' },
    { id: 'dusk',    label: 'Dusk',              swatch: '#473d63' },
    { id: 'bigsky',  label: 'Big Sky',           swatch: '#33719f' },
    { id: 'harvest', label: 'Harvest',           swatch: '#7d5320' },
    { id: 'chinook', label: 'Chinook',           swatch: '#39465e' },
  ];
  const FONTS = [
    { id: '', label: 'Cormorant' },
    { id: 'fraunces', label: 'Fraunces',
      href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap' },
    { id: 'playfair', label: 'Playfair',
      href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap' },
  ];

  const root = document.documentElement;
  const loadedFonts = new Set();

  const loadFont = f => {
    if (!f.href || loadedFonts.has(f.id)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = f.href;
    document.head.appendChild(link);
    loadedFonts.add(f.id);
  };

  const store = (key, val) => {
    try { localStorage.setItem(key, val); } catch (e) { /* private mode */ }
  };
  const recall = key => {
    try { return localStorage.getItem(key) || ''; } catch (e) { return ''; }
  };

  const apply = (kind, id) => {
    if (id) root.setAttribute('data-' + kind, id);
    else root.removeAttribute('data-' + kind);
    store('jc-' + kind, id);
  };

  // restore saved choices
  const savedTheme = recall('jc-theme');
  const savedFont = recall('jc-font');
  if (savedTheme && THEMES.some(t => t.id === savedTheme)) apply('theme', savedTheme);
  const savedFontDef = FONTS.find(f => f.id === savedFont);
  if (savedFontDef && savedFontDef.id) { loadFont(savedFontDef); apply('font', savedFontDef.id); }

  // build the widget
  const picker = document.createElement('div');
  picker.className = 'dev-picker';
  picker.innerHTML =
    '<div class="dp-panel" role="group" aria-label="Theme preview">' +
    '  <div class="dp-heading">Palette</div>' +
    '  <div class="dp-row" data-kind="theme"></div>' +
    '  <div class="dp-heading">Headline font</div>' +
    '  <div class="dp-row" data-kind="font"></div>' +
    '</div>' +
    '<button class="dp-toggle" type="button" aria-label="Preview themes" title="Preview themes">🎨</button>';

  const themeRow = picker.querySelector('[data-kind="theme"]');
  THEMES.forEach(t => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dp-swatch' + (t.id === savedTheme ? ' active' : '');
    b.style.background = t.swatch;
    b.title = t.label;
    b.setAttribute('aria-label', 'Palette: ' + t.label);
    b.addEventListener('click', () => {
      apply('theme', t.id);
      themeRow.querySelectorAll('.dp-swatch').forEach(x => x.classList.toggle('active', x === b));
    });
    themeRow.appendChild(b);
  });

  const fontRow = picker.querySelector('[data-kind="font"]');
  FONTS.forEach(f => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dp-font' + (f.id === savedFont ? ' active' : '');
    b.textContent = f.label;
    b.setAttribute('aria-label', 'Headline font: ' + f.label);
    b.addEventListener('click', () => {
      loadFont(f);
      apply('font', f.id);
      fontRow.querySelectorAll('.dp-font').forEach(x => x.classList.toggle('active', x === b));
    });
    fontRow.appendChild(b);
  });

  picker.querySelector('.dp-toggle').addEventListener('click', () => picker.classList.toggle('open'));
  document.body.appendChild(picker);
})();
