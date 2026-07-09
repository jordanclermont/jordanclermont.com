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

// ── "what brings you here?" intent chooser (landing page only) ──
// Progressive enhancement: with JS off, all four doors show with the
// default intro and no CTA — identical to the page's static markup.
(() => {
  const chips = Array.from(document.querySelectorAll('.intent-chip'));
  if (!chips.length) return;

  const DEFAULT_INTRO = 'Different disciplines, same person. Start anywhere — it all connects.';
  const intents = {
    project: {
      intro: 'Tell me where the friction is — comms, design, or a bit of both — and start with the work closest to your problem.',
      recommend: ['communications', 'design'],
      flag: 'Start here',
      cta: '<p>Got something specific in mind? See how the work breaks down, or send a link and I&rsquo;ll tell you how I&rsquo;d approach it.</p>' +
           '<a href="/services">See how I work &rarr;</a>' +
           '<a href="mailto:hello@jordanclermont.com?subject=Project%20inquiry">hello@jordanclermont.com &rarr;</a>'
    },
    hiring: {
      intro: 'Nine and a half years leading communications, plus design, writing, and music on the side. The comms work is the place to start.',
      recommend: ['communications'],
      flag: 'Start here',
      cta: '<p>Sizing me up for a role? Here&rsquo;s the r&eacute;sum&eacute;, or connect directly.</p>' +
           '<a href="/resume">R&eacute;sum&eacute; &rarr;</a>' +
           '<a href="https://linkedin.com/in/jordanclermont" target="_blank" rel="noopener">LinkedIn &rarr;</a>'
    },
    browsing: {
      intro: DEFAULT_INTRO,
      recommend: [],
      flag: null,
      cta: null
    }
  };

  const intro = document.getElementById('doorsIntro');
  const ctaBox = document.getElementById('intentCta');
  const doors = Array.from(document.querySelectorAll('.door'));

  function clearState() {
    doors.forEach(d => {
      d.classList.remove('is-recommended');
      const flag = d.querySelector('.door-flag');
      if (flag) flag.remove();
    });
    ctaBox.hidden = true;
    ctaBox.innerHTML = '';
  }

  function apply(key) {
    const cfg = intents[key];
    clearState();
    intro.textContent = cfg.intro;

    cfg.recommend.forEach(name => {
      const door = doors.find(d => d.dataset.door === name);
      if (!door) return;
      door.classList.add('is-recommended');
      const info = door.querySelector('.door-info');
      const flag = document.createElement('span');
      flag.className = 'door-flag';
      flag.textContent = cfg.flag;
      info.appendChild(flag);
    });

    if (cfg.cta) {
      ctaBox.innerHTML = cfg.cta;
      ctaBox.hidden = false;
    }
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const key = chip.dataset.intent;
      const alreadyOn = chip.getAttribute('aria-pressed') === 'true';
      chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
      if (alreadyOn) {
        apply('browsing');
      } else {
        chip.setAttribute('aria-pressed', 'true');
        apply(key);
      }
    });
  });
})();
