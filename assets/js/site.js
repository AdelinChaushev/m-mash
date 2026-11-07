/* М-Маш — site behaviour: header state, mobile menu, copy buttons, contact form */
(() => {
  const root = document.documentElement;
  root.classList.add('js');

  const strings = {
    bg: { openMenu: 'Отвори менюто', closeMenu: 'Затвори менюто', copy: 'Копирай', copied: 'Копирано', greeting: 'Здравейте,', subject: 'Запитване от сайта' },
    en: { openMenu: 'Open menu', closeMenu: 'Close menu', copy: 'Copy', copied: 'Copied', greeting: 'Hello,', subject: 'Inquiry from the website' },
    de: { openMenu: 'Menü öffnen', closeMenu: 'Menü schließen', copy: 'Kopieren', copied: 'Kopiert', greeting: 'Guten Tag,', subject: 'Anfrage über die Website' },
    it: { openMenu: 'Apri il menu', closeMenu: 'Chiudi il menu', copy: 'Copia', copied: 'Copiato', greeting: 'Buongiorno,', subject: 'Richiesta dal sito' },
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
