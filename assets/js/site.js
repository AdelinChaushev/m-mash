/* М-Маш — site behaviour: header state, mobile menu, hero slides, copy buttons, contact form */
(() => {
  const root = document.documentElement;
  root.classList.add('js');

  const strings = {
    bg: {
      openMenu: 'Отвори менюто', closeMenu: 'Затвори менюто', copy: 'Копирай', copied: 'Копирано', greeting: 'Здравейте,', subject: 'Запитване от сайта',
      photos: 'Снимки', photo: 'Снимка', of: 'от', pause: 'Спри смяната на снимките', play: 'Пусни смяната на снимките',
    },
    en: {
      openMenu: 'Open menu', closeMenu: 'Close menu', copy: 'Copy', copied: 'Copied', greeting: 'Hello,', subject: 'Inquiry from the website',
      photos: 'Photos', photo: 'Photo', of: 'of', pause: 'Pause the slideshow', play: 'Play the slideshow',
    },
    de: {
      openMenu: 'Menü öffnen', closeMenu: 'Menü schließen', copy: 'Kopieren', copied: 'Kopiert', greeting: 'Guten Tag,', subject: 'Anfrage über die Website',
      photos: 'Fotos', photo: 'Foto', of: 'von', pause: 'Bildwechsel anhalten', play: 'Bildwechsel starten',
    },
    it: {
      openMenu: 'Apri il menu', closeMenu: 'Chiudi il menu', copy: 'Copia', copied: 'Copiato', greeting: 'Buongiorno,', subject: 'Richiesta dal sito',
      photos: 'Foto', photo: 'Foto', of: 'di', pause: 'Ferma lo scorrimento delle foto', play: 'Avvia lo scorrimento delle foto',
    },
  };
  const text = strings[root.lang] || strings.bg;

  /* Header shadow once the page scrolls; the open mobile menu tracks the header's bottom edge */
  const header = document.querySelector('[data-header]');
  const syncMenuTop = () => root.style.setProperty('--menu-top', `${header.getBoundingClientRect().bottom}px`);
  const onScroll = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 8);
    if (root.classList.contains('menu-open')) syncMenuTop();
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.getElementById('site-nav');
  const toggleLabel = toggle?.querySelector('.visually-hidden');

  const setMenu = (open) => {
    if (!toggle) return;
    if (open) syncMenuTop();
    toggle.setAttribute('aria-expanded', String(open));
    if (toggleLabel) toggleLabel.textContent = open ? text.closeMenu : text.openMenu;
    root.classList.toggle('menu-open', open);
  };

  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && root.classList.contains('menu-open')) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.matchMedia('(max-width: 1080px)').addEventListener('change', (event) => {
    if (!event.matches) setMenu(false);
  });

  /* Home hero slides: the photos take turns behind the headline every six seconds.
     One bar per photo, a pause button, and a swipe on touch screens.
     For visitors whose system asks for less motion, the photos start paused. */
  const hero = document.querySelector('[data-slides]');
  const slides = hero ? [...hero.querySelectorAll('.hero__slide')] : [];
  if (slides.length > 1) {
    let current = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
    let playing = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let held = false;
    let timer;

    const control = (className, html) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `hero__control ${className}`;
      button.innerHTML = html;
      return button;
    };

    const schedule = () => {
      clearTimeout(timer);
      if (playing && !held && !document.hidden) timer = setTimeout(() => show(current + 1), 6000);
    };

    /* A slide whose photo is missing stays dark; the note names the file it waits for */
    const note = document.createElement('p');
    note.className = 'hero__note';
    note.setAttribute('aria-hidden', 'true');
    note.innerHTML = '<span></span><span></span>';
    const [folder, file] = note.children;
    const name = () => {
      const slide = slides[current];
      const path = slide.classList.contains('hero__slide--missing') ? slide.dataset.label || '' : '';
      const cut = path.lastIndexOf('/') + 1;
      folder.textContent = path.slice(0, cut);
      file.textContent = path.slice(cut);
    };
    slides.forEach((slide) => slide.querySelector('img')?.addEventListener('error', name));

    const show = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
      dots.forEach((dot, i) => (i === current ? dot.setAttribute('aria-current', 'true') : dot.removeAttribute('aria-current')));
      name();
      schedule();
    };

    const dots = slides.map((_, index) => {
      const dot = control('hero__dot', `<span class="visually-hidden">${text.photo} ${index + 1} ${text.of} ${slides.length}</span>`);
      dot.addEventListener('click', () => show(index));
      /* While a bar has keyboard focus the photo waits, so the amber bar stays where the visitor is */
      dot.addEventListener('focus', () => { held = dot.matches(':focus-visible'); schedule(); });
      dot.addEventListener('blur', () => { held = false; schedule(); });
      return dot;
    });

    const pause = control('hero__pause', '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path/></svg><span class="visually-hidden"></span>');
    const setPlaying = (value) => {
      playing = value;
      pause.querySelector('path').setAttribute('d', playing ? 'M9 5v14M15 5v14' : 'M8 5.5v13l10-6.5Z');
      pause.querySelector('.visually-hidden').textContent = playing ? text.pause : text.play;
      schedule();
    };
    pause.addEventListener('click', () => setPlaying(!playing));

    const bar = document.createElement('div');
    bar.className = 'container hero__bar';
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', text.photos);
    bar.append(...dots, pause, note);
    hero.append(bar);

    /* Swipe left for the next photo, right for the previous one */
    let start = null;
    hero.addEventListener('pointerdown', (event) => {
      start = event.pointerType === 'touch' ? { x: event.clientX, y: event.clientY } : null;
    });
    hero.addEventListener('pointerup', (event) => {
      if (!start) return;
      const dx = event.clientX - start.x;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(event.clientY - start.y)) show(current + (dx < 0 ? 1 : -1));
      start = null;
    });
    hero.addEventListener('pointercancel', () => { start = null; });

    document.addEventListener('visibilitychange', schedule);
    setPlaying(playing);
    show(current);
  }

  /* Copy-to-clipboard buttons */
  document.querySelectorAll('[data-copy]').forEach((button) => {
    const label = button.querySelector('[data-copy-label]');
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        if (label) label.textContent = text.copied;
        setTimeout(() => { if (label) label.textContent = text.copy; }, 2000);
      } catch {
        window.location.href = `mailto:${button.dataset.copy}`;
      }
    });
  });

  /* Contact form → opens the visitor's e-mail app with the message filled in; files can be attached there */
  const form = document.querySelector('[data-inquiry]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const value = (key) => (data.get(key) || '').toString().trim();

    const body = [
      text.greeting,
      '',
      value('description'),
      '',
      `${value('first-name')} ${value('last-name')}`,
      value('company'),
      value('phone'),
      value('email'),
    ].join('\n').replace(/\r?\n/g, '\r\n');

    const subject = `${text.subject} – ${value('company')}`;
    const link = document.createElement('a');
    link.href = `mailto:${form.dataset.inquiry}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.body.append(link);
    link.click();
    link.remove();

    const status = form.querySelector('[data-inquiry-status]');
    if (status) {
      status.hidden = false;
      status.scrollIntoView({ block: 'nearest' });
    }
  });

  /* Current year */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
