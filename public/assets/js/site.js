/* М-Маш — navigation, mobile menu, hero slides, copy buttons, contact form */
(() => {
  const root = document.documentElement;
  const scriptURL = document.currentScript.src;
  root.classList.add('js');

  const strings = {
    bg: {
      closeMenu: 'Затвори менюто', copy: 'Копирай', copied: 'Копирано', loading: 'Зареждане на страницата…',
      sending: 'Изпращане…', sendError: 'Не успяхме да потвърдим изпращането. Опитайте отново по-късно или ни пишете директно.',
      photos: 'Снимки', photo: 'Снимка', of: 'от', prev: 'Предишна снимка', next: 'Следваща снимка',
    },
    en: {
      closeMenu: 'Close menu', copy: 'Copy', copied: 'Copied', loading: 'Loading page…',
      sending: 'Sending…', sendError: 'We couldn’t confirm that your inquiry was sent. Try again later or email us directly.',
      photos: 'Photos', photo: 'Photo', of: 'of', prev: 'Previous photo', next: 'Next photo',
    },
    de: {
      closeMenu: 'Menü schließen', copy: 'Kopieren', copied: 'Kopiert', loading: 'Seite wird geladen…',
      sending: 'Wird gesendet…', sendError: 'Wir konnten den Versand nicht bestätigen. Versuchen Sie es später erneut oder schreiben Sie uns direkt.',
      photos: 'Fotos', photo: 'Foto', of: 'von', prev: 'Vorheriges Foto', next: 'Nächstes Foto',
    },
    it: {
      closeMenu: 'Chiudi il menu', copy: 'Copia', copied: 'Copiato', loading: 'Caricamento della pagina…',
      sending: 'Invio in corso…', sendError: 'Non abbiamo potuto confermare l’invio. Riprova più tardi o scrivici direttamente.',
      photos: 'Foto', photo: 'Foto', of: 'di', prev: 'Foto precedente', next: 'Foto successiva',
    },
  };
  const pageText = () => strings[root.lang] || strings.bg;

  function focusTarget(target) {
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    }
    target.focus({ preventScroll: true });
  }

  function fragmentTarget(hash) {
    try {
      return hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    } catch {
      return null;
    }
  }

  /* Mobile menu */
  function initMenu(text, signal) {
    const toggle = document.querySelector('[data-nav-toggle]');
    const nav = document.getElementById('site-nav');
    const brand = document.querySelector('.site-header .header-brand');
    const languages = document.querySelector('.topbar .lang');
    const phone = document.querySelector('.topbar__phone');
    const email = nav?.querySelector('.nav__meta a[href^="mailto:"]');
    const inquiry = nav?.querySelector('.nav__cta--desktop');
    const menu = document.createElement('dialog');
    if (toggle && nav && brand && languages && phone && email && inquiry && typeof menu.showModal === 'function') {
      // Reuse the localized header links; the original nav remains the desktop and no-JS menu.
      const element = (tag, className) => Object.assign(document.createElement(tag), { className });
      const compact = window.matchMedia('(width < 66rem)');
      const desktopLink = nav.querySelector('[aria-current="page"]') || nav.querySelector('a');
      const menuHeader = element('div', 'mobile-menu__header');
      const menuBrand = brand.cloneNode(true);
      const close = element('button', 'mobile-menu__close');
      const closeIcon = element('span', 'mobile-menu__x');
      closeIcon.setAttribute('aria-hidden', 'true');
      close.type = 'button';
      close.setAttribute('aria-label', text.closeMenu);
      close.append(closeIcon);
      menuHeader.append(menuBrand, close);

      const menuBody = element('div', 'mobile-menu__body');
      const menuNav = element('nav', 'mobile-menu__nav');
      const label = nav.getAttribute('aria-label');
      menuNav.setAttribute('aria-label', label);
      menuNav.append(nav.querySelector('.nav__list').cloneNode(true));
      const actions = element('div', 'mobile-menu__actions');
      const menuInquiry = inquiry.cloneNode(true);
      menuInquiry.classList.replace('nav__cta--desktop', 'mobile-menu__inquiry');
      const contacts = element('div', 'mobile-menu__contacts');
      const call = phone.cloneNode(true);
      const phoneIcon = phone.previousElementSibling;
      if (phoneIcon?.classList.contains('icon')) call.prepend(phoneIcon.cloneNode(true));
      contacts.append(call, email.cloneNode(true));
      actions.append(menuInquiry, languages.cloneNode(true), contacts);
      menuBody.append(menuNav, actions);

      menu.id = 'mobile-menu';
      menu.className = 'mobile-menu';
      menu.setAttribute('aria-label', label);
      menu.append(menuHeader, menuBody);
      document.body.append(menu);
      toggle.setAttribute('aria-controls', menu.id);
      toggle.setAttribute('aria-haspopup', 'dialog');

      const closeMenu = () => {
        menu.close();
        root.classList.remove('mobile-menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        (compact.matches ? toggle : desktopLink)?.focus({ preventScroll: true });
      };

      toggle.addEventListener('click', () => {
        if (!compact.matches || menu.open) return;
        menu.scrollTop = 0;
        root.classList.add('mobile-menu-open');
        toggle.setAttribute('aria-expanded', 'true');
        menu.showModal();
        close.focus({ preventScroll: true });
      });
      close.addEventListener('click', closeMenu);
      menu.addEventListener('cancel', (event) => {
        event.preventDefault();
        closeMenu();
      });
      menu.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab') return;
        const last = contacts.lastElementChild;
        if (event.shiftKey ? document.activeElement === menuBrand : document.activeElement === last) {
          event.preventDefault();
          (event.shiftKey ? last : menuBrand).focus();
        }
      });
      menu.addEventListener('click', (event) => {
        const link = event.target.closest('a[href]');
        if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        closeMenu();

        // Reach an inquiry on this page without reloading or discarding the query string.
        if (link.hash && link.origin === location.origin && link.pathname === location.pathname && !link.search) {
          const target = fragmentTarget(link.hash);
          if (!target) return;
          event.preventDefault();
          focusTarget(target);
          if (location.hash === link.hash) target.scrollIntoView();
          else location.hash = link.hash;
        }
      });
      // CSS can hide a focused control before the media query's change event fires.
      const restoreOnResize = (from, hidden, to) => from.addEventListener('focusout', (event) => {
        if (!event.relatedTarget && hidden()) queueMicrotask(() => {
          if (!signal.aborted && document.activeElement === document.body) to?.focus({ preventScroll: true });
        });
      });
      restoreOnResize(nav, () => compact.matches, toggle);
      restoreOnResize(toggle, () => !compact.matches, desktopLink);
      compact.addEventListener('change', (event) => {
        if (!event.matches && menu.open) closeMenu();
      }, { signal });
      signal.addEventListener('abort', () => {
        if (menu.open) menu.close();
        root.classList.remove('nav-ready', 'mobile-menu-open');
      });
      root.classList.add('nav-ready');
    }
  }

  /* Home hero slides: the photos take turns behind the headline every six seconds.
     Arrows and one bar per photo, centred under the buttons, and a swipe on touch screens.
     For visitors whose system asks for less motion, the photo changes only when they choose. */
  function initHero(text, signal) {
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

      document.addEventListener('visibilitychange', schedule, { signal });
      signal.addEventListener('abort', () => clearTimeout(timer));
      show(current);
    }
  }

  /* Copy-to-clipboard buttons */
  function initCopy(text, signal) {
    document.querySelectorAll('[data-copy]').forEach((button) => {
      const label = button.querySelector('[data-copy-label]');
      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(button.dataset.copy);
          if (signal.aborted) return;
          if (label) label.textContent = text.copied;
          setTimeout(() => { if (!signal.aborted && label) label.textContent = text.copy; }, 2000);
        } catch {
          if (!signal.aborted) window.location.href = `mailto:${button.dataset.copy}`;
        }
      });
    });
  }

  /* Enhance the ordinary PHP form POST without leaving the contact page. */
  function initInquiry(text, signal) {
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
          if (signal.aborted) return;
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
          if (!signal.aborted) show(text.sendError, 'error');
        } finally {
          send.disabled = false;
        }
      });
    }
  }

  function initPage() {
    const lifetime = new AbortController();
    const text = pageText();
    initMenu(text, lifetime.signal);
    initHero(text, lifetime.signal);
    initCopy(text, lifetime.signal);
    initInquiry(text, lifetime.signal);
    document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
    return lifetime;
  }

  let pageLifetime = initPage();
  initNavigation();

  /* Progressive navigation. The Navigation API handles history and scroll restoration;
     browsers without it still follow the same real HTML links. */
  function initNavigation() {
    const navHistory = window.navigation;
    if (!navHistory || !window.NavigateEvent?.prototype.intercept || !AbortSignal.any || !AbortSignal.timeout) return;

    const routes = new Map([
      ['', 'za-nas', 'proizvodstvo', 'uslugi', 'kachestvo', 'kontakti'].map((path) => [path, 'bg']),
      ['', 'about', 'capabilities', 'services', 'quality', 'contact'].map((path) => [`en/${path}`, 'en']),
      ['', 'ueber-uns', 'fertigung', 'leistungen', 'qualitaet', 'kontakt'].map((path) => [`de/${path}`, 'de']),
      ['', 'chi-siamo', 'capacita', 'servizi', 'qualita', 'contatti'].map((path) => [`it/${path}`, 'it']),
    ].flat());
    const mount = new URL('../../', scriptURL);
    const routeOf = (url) => url.origin === mount.origin && url.pathname.startsWith(mount.pathname)
      ? url.pathname.slice(mount.pathname.length) : null;
    const pageKey = (url) => url.pathname + url.search;
    let renderedURL = new URL(location.href);
    if (!routes.has(routeOf(renderedURL))) return;

    const metadata = 'meta[name="description"], meta[name="theme-color"], meta[property^="og:"], ' +
      'link[rel="canonical"], link[rel="alternate"][hreflang], script[type="application/ld+json"]';
    const styles = (doc, url) => [...doc.querySelectorAll('head link[rel="stylesheet"]')]
      .map((link) => new URL(link.getAttribute('href'), url).href).join('\n');
    const activeStyles = styles(document, renderedURL);
    const ready = Symbol('prepared page');
    const status = document.createElement('div');
    status.className = 'visually-hidden';
    status.setAttribute('role', 'status');
    document.body.append(status);
    let pendingClick;
    let progressReset;

    function resetProgress() {
      clearTimeout(progressReset);
      root.classList.remove('nav-loaded');
      root.style.removeProperty('--nav-progress-start');
    }

    function startLoading(signal) {
      resetProgress();
      status.textContent = '';
      const timer = setTimeout(() => {
        root.classList.add('nav-loading');
        status.textContent = pageText().loading;
      }, 250);
      const stop = (completed = false) => {
        clearTimeout(timer);
        if (completed && root.classList.contains('nav-loading')) {
          root.style.setProperty('--nav-progress-start', getComputedStyle(root, '::before').transform);
          root.classList.add('nav-loaded');
          progressReset = setTimeout(resetProgress, 260);
        }
        root.classList.remove('nav-loading');
        status.textContent = '';
        signal.removeEventListener('abort', cancel);
      };
      const cancel = () => stop();
      signal.addEventListener('abort', cancel, { once: true });
      return stop;
    }

    async function loadPage(url, signal) {
      const response = await fetch(url, {
        headers: { Accept: 'text/html' },
        mode: 'same-origin',
        redirect: 'error',
        signal: AbortSignal.any([signal, AbortSignal.timeout(7000)]),
      });
      if (!response.ok || !/^text\/html(?:;|$)/i.test(response.headers.get('Content-Type') || '')) {
        throw new Error('Expected an HTML page');
      }

      const page = new DOMParser().parseFromString(await response.text(), 'text/html');
      const script = page.body.querySelector('script[src]');
      if (page.documentElement.lang !== routes.get(routeOf(url)) ||
          page.querySelector('head link[rel="canonical"]')?.getAttribute('href') !== `https://m-mash.net/${routeOf(url)}` ||
          !page.title || !page.body.querySelector('main#main') || page.querySelector('base, head style') ||
          !script || new URL(script.getAttribute('src'), url).href !== scriptURL ||
          styles(page, url) !== activeStyles) {
        throw new Error('Page or shared assets do not match');
      }
      // All public pages share the same JS and styles. Never re-run fetched scripts.
      page.body.querySelectorAll('script').forEach((node) => node.remove());
      return page;
    }

    function render(page, url, traversing) {
      pageLifetime.abort();
      root.lang = page.documentElement.lang;
      document.title = page.title;
      document.head.querySelectorAll(metadata).forEach((node) => node.remove());
      document.head.append(...page.head.querySelectorAll(metadata));
      // Keep the live region mounted while changing the localized header, main and footer.
      for (const node of [...document.body.childNodes]) {
        if (node !== status) node.remove();
      }
      status.before(...page.body.childNodes);
      renderedURL = url;
      pageLifetime = initPage();
      if (traversing) {
        status.textContent = page.title;
      } else {
        status.textContent = '';
        focusTarget(fragmentTarget(url.hash) || document.querySelector('main h1') || document.getElementById('main'));
      }
    }

    navHistory.addEventListener('navigate', (event) => {
      pendingClick?.abort();
      pendingClick = undefined;
      const url = new URL(event.destination.url);
      const traversing = event.navigationType === 'traverse' && event.destination.sameDocument;
      const page = event.info?.[ready];
      if (!event.canIntercept || !routes.has(routeOf(url)) ||
          !(page || (traversing && pageKey(url) !== pageKey(renderedURL)))) return;

      event.intercept({
        focusReset: 'manual',
        async handler() {
          const stop = page ? null : startLoading(event.signal);
          // A traversal can commit before its HTML is ready. Prevent use of old
          // relative links, but leave the loading announcement accessible.
          const oldContent = page ? [] : [...document.body.children].filter((node) => node !== status && !node.inert);
          const unlock = () => oldContent.splice(0).forEach((node) => { node.inert = false; });
          try {
            if (!page) document.querySelector('dialog.mobile-menu[open] .mobile-menu__close')?.click();
            oldContent.forEach((node) => { node.inert = true; });
            event.signal.addEventListener('abort', unlock, { once: true });
            const next = page || await loadPage(url, event.signal);
            if (event.signal.aborted) return;
            stop?.(true);
            render(next, url, traversing);
          } catch {
            if (!event.signal.aborted) {
              stop?.();
              location.reload();
            }
          } finally {
            event.signal.removeEventListener('abort', unlock);
            unlock();
          }
        },
      });
    });

    document.addEventListener('click', async (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
          event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href]');
      if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
      const url = new URL(link.href);
      if (!routes.has(routeOf(url)) || pageKey(url) === pageKey(renderedURL)) return;

      event.preventDefault();
      pendingClick?.abort();
      const request = pendingClick = new AbortController();
      const stop = startLoading(request.signal);
      try {
        const page = await loadPage(url, request.signal);
        if (request.signal.aborted) return;
        stop(true);
        pendingClick = undefined;
        await navHistory.navigate(url, { info: { [ready]: page }, history: 'push' }).finished;
      } catch {
        // An aborted fetch or intercepted navigation has already been superseded.
        if (!request.signal.aborted && pendingClick === request) location.assign(url);
      } finally {
        if (pendingClick === request) {
          pendingClick = undefined;
          stop();
        }
      }
    });
  }
})();
