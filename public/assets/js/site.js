/* М-Маш — site behaviour: mobile menu, hero slides, copy buttons, contact form */
(() => {
  const root = document.documentElement;
  root.classList.add('js');

  const strings = {
    bg: {
      openMenu: 'Отвори менюто', closeMenu: 'Затвори менюто', copy: 'Копирай', copied: 'Копирано',
      sending: 'Изпращане…', sendError: 'Не успяхме да потвърдим изпращането. Опитайте отново по-късно или ни пишете директно.',
      photos: 'Снимки', photo: 'Снимка', of: 'от', prev: 'Предишна снимка', next: 'Следваща снимка',
    },
    en: {
      openMenu: 'Open menu', closeMenu: 'Close menu', copy: 'Copy', copied: 'Copied',
      sending: 'Sending…', sendError: 'We couldn’t confirm that your inquiry was sent. Try again later or email us directly.',
      photos: 'Photos', photo: 'Photo', of: 'of', prev: 'Previous photo', next: 'Next photo',
    },
    de: {
      openMenu: 'Menü öffnen', closeMenu: 'Menü schließen', copy: 'Kopieren', copied: 'Kopiert',
      sending: 'Wird gesendet…', sendError: 'Wir konnten den Versand nicht bestätigen. Versuchen Sie es später erneut oder schreiben Sie uns direkt.',
      photos: 'Fotos', photo: 'Foto', of: 'von', prev: 'Vorheriges Foto', next: 'Nächstes Foto',
    },
    it: {
      openMenu: 'Apri il menu', closeMenu: 'Chiudi il menu', copy: 'Copia', copied: 'Copiato',
      sending: 'Invio in corso…', sendError: 'Non abbiamo potuto confermare l’invio. Riprova più tardi o scrivici direttamente.',
      photos: 'Foto', photo: 'Foto', of: 'di', prev: 'Foto precedente', next: 'Foto successiva',
    },
  };
  const text = strings[root.lang] || strings.bg;

  /* Mobile menu */
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.getElementById('site-nav');
  if (toggle && nav) {
    const toggleLabel = toggle.querySelector('.visually-hidden');
    const compact = window.matchMedia('(width < 66rem)');
    const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
    const setMenu = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      if (toggleLabel) toggleLabel.textContent = open ? text.closeMenu : text.openMenu;
    };

    toggle.addEventListener('click', () => setMenu(!isOpen()));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && compact.matches && isOpen()) {
        setMenu(false);
        toggle.focus();
      }
    });
    compact.addEventListener('change', (event) => {
      const active = document.activeElement;
      setMenu(false);
      if (event.matches && nav.contains(active)) toggle.focus();
      if (!event.matches && active === toggle) (nav.querySelector('[aria-current="page"]') || nav.querySelector('a'))?.focus();
    });
    root.classList.add('nav-ready');
  }

  /* Home hero slides: the photos take turns behind the headline every six seconds.
     Arrows and one bar per photo, centred under the buttons, and a swipe on touch screens.
     For visitors whose system asks for less motion, the photo changes only when they choose. */
  const hero = document.querySelector('[data-slides]');
  const slides = hero ? [...hero.querySelectorAll('.hero__slide')] : [];
  if (slides.length > 1) {
    const autoplay = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
    let hovered = false;
    let focused = false;
    let timer;

    const control = (className, label, icon = '') => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `hero__control ${className}`;
      button.innerHTML = `${icon}<span class="visually-hidden">${label}</span>`;
      return button;
    };
    const chevron = (path) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;

    const schedule = () => {
      clearTimeout(timer);
      if (autoplay && !hovered && !focused && !document.hidden) timer = setTimeout(() => show(current + 1), 6000);
    };

    const show = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
      dots.forEach((dot, i) => (i === current ? dot.setAttribute('aria-current', 'true') : dot.removeAttribute('aria-current')));
      schedule();
    };

    const prev = control('hero__arrow', text.prev, chevron('m15 18-6-6 6-6'));
    const next = control('hero__arrow', text.next, chevron('m9 18 6-6-6-6'));
    prev.addEventListener('click', () => show(current - 1));
    next.addEventListener('click', () => show(current + 1));
    const dots = slides.map((_, index) => {
      const dot = control('hero__dot', `${text.photo} ${index + 1} ${text.of} ${slides.length}`);
      dot.addEventListener('click', () => show(index));
      return dot;
    });

    const bar = document.createElement('div');
    bar.className = 'container hero__bar';
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', text.photos);
    bar.append(prev, ...dots, next);
    hero.append(bar);

    /* The photo waits while the pointer or keyboard focus is on the arrows and bars, so it doesn't change under the visitor */
    bar.addEventListener('pointerenter', () => { hovered = true; schedule(); });
    bar.addEventListener('pointerleave', () => { hovered = false; schedule(); });
    bar.addEventListener('focusin', (event) => { focused = event.target.matches(':focus-visible'); schedule(); });
    bar.addEventListener('focusout', (event) => {
      if (!bar.contains(event.relatedTarget)) { focused = false; schedule(); }
    });

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

  /* Enhance the ordinary PHP form POST without leaving the contact page. */
  const form = document.querySelector('[data-inquiry]');
  if (form && window.fetch) {
    const status = form.querySelector('[data-inquiry-status]');
    const send = form.querySelector('[type="submit"]');
    const show = (message, state) => {
      status.dataset.state = state;
      status.textContent = message;
    };
    const invalidFields = () => form.querySelectorAll('[aria-invalid="true"]');

    form.addEventListener('input', ({ target }) => target.removeAttribute('aria-invalid'));
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (send.disabled) return;

      const body = new URLSearchParams(new FormData(form));
      invalidFields().forEach((field) => field.removeAttribute('aria-invalid'));
      send.disabled = true;
      show(text.sending, 'pending');

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body,
          signal: AbortSignal.timeout?.(15000),
        });
        const result = await response.json();
        if (typeof result.message !== 'string') throw new Error('Invalid inquiry response');

        if (response.ok && result.result === 'sent') {
          // Do not clear edits made while the request was in flight.
          if (String(body) === String(new URLSearchParams(new FormData(form)))) form.reset();
          show(result.message, 'sent');
        } else {
          show(result.message, 'error');
          if (response.status === 422 && Array.isArray(result.invalid)) {
            for (const name of result.invalid) {
              const field = form.elements.namedItem(name);
              if (field?.classList.contains('input') && field.value === body.get(name)) {
                field.setAttribute('aria-invalid', 'true');
              }
            }
            invalidFields()[0]?.focus();
          }
        }
      } catch {
        show(text.sendError, 'error');
      } finally {
        send.disabled = false;
      }
    });
  }

  /* Current year */
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
