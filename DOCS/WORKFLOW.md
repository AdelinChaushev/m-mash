# Development and handoff workflow

## Optional local HTTP checks

No dedicated preview site is required. To check changes over HTTP on demand, run from the repository root:

```sh
python3 -m http.server 8765
```

Open <http://localhost:8765/> and use the site navigation or the [page map](PROJECT.md#page-map). The repository does not configure a development hostname. If a containerized browser cannot reach WSL's `localhost`, try the Docker host address at the same port (`http://host.docker.internal:8765/`) and verify it serves this repo before relying on it. For a hosting-subpath check, serve the parent directory instead and open `/m-mash.test/` on that server (use the checkout's actual directory name).

## Make and check changes

1. Identify the counterpart pages and the shared assets before editing. Preserve page-relative paths (`assets/` from root pages, `../assets/` from locale pages), language-specific anchors and copy, and reciprocal `hreflang` metadata.
2. **Cache busting:** When `tokens.css`, `site.css` or `site.js` changes, update the common `?v=` token for all three references in all 25 HTML files. Use a new `YYYY-MM-DD` value or increment the same-day suffix (`.2`, `.3`, …). The onboarding baseline is `2026-11-12.3`; read the HTML for the latest value. If replacing a banner slice, also update its image URL version in `site.css`; if replacing a versioned client photo (`ceh.jpg`, `cnc-strugovane.jpg`, `shlifovane.jpg`, `kontrol.jpg`), update every HTML reference to that photo.
3. Run `git diff --check` and review the complete diff, including any new files. If Node is available and the JS changed, run `node --check assets/js/site.js`.
4. For site changes, verify affected routes over HTTP: check desktop and mobile, confirm the expected page actually loaded, and inspect the browser console and network for unexpected errors or failed local assets. For shared layout changes, inspect representative pages across locales, including a long German heading and a translated contact page. For navigation changes, check the current-page state, the language switch, mobile menu and keyboard dismissal. For form or hero changes, exercise the changed interaction with dummy data or reduced-motion emulation as appropriate. Do not send a real inquiry. Check local links and their anchors as well as any altered external document links.
5. Update [the handoff](HANDOFF.md) with what changed, what was verified (and what wasn't), pending decisions and the next action. Keep durable instructions in the relevant reference doc; don't copy the whole diff or commit log into the handoff.

## Hosting and releases

The prior setup used [GitHub Pages](https://adelinchaushev.github.io/m-mash/) from the repository root on `main` at [`AdelinChaushev/m-mash`](https://github.com/AdelinChaushev/m-mash). A push to `main` may still publish if that setup is active; `.nojekyll` disables Jekyll processing. There is no requirement to retain or replace the preview for the move to a private repo. The site can be served by any static host without a build.

- If Pages is still active, private repository access does not necessarily make the published site private; see [GitHub's Pages publishing guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). If a public host serves the repository root, assume Markdown docs may be reachable too. To keep the docs private, deploy only website files.
- Treat the Pages URL as distinct from the canonical `m-mash.net` URLs. Before any domain or hosting cutover, resolve the [legacy file dependencies](PROJECT.md#legacy-m-mashnet-dependencies).
- After an authorized release, verify the expected origin and path, primary pages and locale switching, shared asset versions, and affected external links. Record any release blockers in the handoff.
