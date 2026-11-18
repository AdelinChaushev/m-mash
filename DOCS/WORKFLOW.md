# Development and handoff workflow

## Optional local HTTP checks

No dedicated preview site is required. To check layout over HTTP on demand, run from the repository root:

```sh
php -S 127.0.0.1:8765 -t public
```

Open <http://localhost:8765/> and use the site navigation or the [page map](PROJECT.md#page-map). For a working contact form, use [the Mailpit setup](CONTACT.md#local-testing-with-mailpit) instead. For a hosting-subpath check, mount only `public/` at the desired path in a PHP-capable web server; never serve the repository's parent directory. See the global Playwright instructions if accessing a local host from a containerized browser.

## Make and check changes

1. Identify the counterpart pages and the shared assets before editing. Preserve page-relative paths (`assets/` from root pages, `../assets/` from locale pages), language-specific anchors and copy, and reciprocal `hreflang` metadata.
2. **Cache busting:** When `tokens.css`, `site.css` or `site.js` changes, update the common `?v=` token for all three references in all 25 HTML files and the two CSS links in [`src/contact-result.php`](../src/contact-result.php). Use a new `YYYY-MM-DD` value or increment the same-day suffix (`.2`, `.3`, …). If replacing a banner slice, also update its image URL version in `site.css`; if replacing a versioned client photo (`ceh.jpg`, `cnc-strugovane.jpg`, `shlifovane.jpg`, `kontrol.jpg`), update every HTML reference to that photo.
3. Run `git diff --check` and review the complete diff, including any new files. If the JS changed, run `node --check public/assets/js/site.js`. For PHP changes, lint the changed PHP files and run `composer test`.
4. For site changes, verify affected routes over HTTP: check desktop and mobile, confirm the expected page actually loaded, and inspect the browser console and network for unexpected errors or failed local assets. For shared layout changes, inspect representative pages across locales, including a long German heading and a translated contact page. For navigation changes, check the current-page state, the language switch, mobile menu and keyboard dismissal. For form or hero changes, exercise the changed interaction with dummy data or reduced-motion emulation as appropriate. Do not send a real inquiry. Check local links and their anchors as well as any altered external document links.
5. Update [the handoff](HANDOFF.md) with what changed, what was verified (and what wasn't), pending decisions and the next action. Keep durable instructions in the relevant reference doc; don't copy the whole diff or commit log into the handoff.

## Hosting and releases

The intended production host is a VPS running PHP 8.5 over HTTPS, with `current/public/` as the document root. Follow the [Deployer instructions](DEPLOY.md) and [SES checklist](CONTACT.md#vps-and-ses). The previous GitHub Pages preview is not needed and cannot execute PHP.

- If GitHub Pages is still configured to publish `main`, turn it off before pushing this structure. Do not publish the repository root to a static host; it would expose private implementation files.
- Before any domain or hosting cutover, resolve the [legacy file dependencies](PROJECT.md#legacy-m-mashnet-dependencies), including any `files/` and `images/` routes that need to survive.
- After an authorized release, verify the expected origin and path, primary pages and locale switching, shared asset versions, and affected external links. Record any release blockers in the handoff.
