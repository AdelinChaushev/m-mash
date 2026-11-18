# Session handoff

## Current baseline

- The frontend still has no build step. All 25 pages and their assets are under `public/`. Shared CSS/JS uses `2026-11-18.4`.
- All 24 public pages now have clean URLs in Apache, with one-hop `301` redirects from the old `.html` URLs. Bulgarian capabilities is `/proizvodstvo`. Internal links, canonical URLs, `hreflang` and the sitemap agree. The design reference stays at `/dizain-sistema.html` and is not in the sitemap. `tests/routes.py` passed on the Docker vhost and a separate Apache instance at both the root and a nested mount. Mobile Chromium followed the Bulgarian capabilities → German capabilities → German inquiry links. PHP returned `405` for GET and `422` for an incomplete POST; no mail was sent.
- The mobile hamburger opens a full-screen white dialog with simple link rows and a sticky, icon-only X with localized accessible labels. The dialog reuses the header links. Chromium verified the original full-screen behavior across all 24 pages, including the no-JS fallback and breakpoint focus; the light update was rechecked in all four locales at 320 px and in landscape, including Close, Escape and same-page inquiry focus. The closed header and desktop navigation keep their existing layout. Known fallback requests for `logo.svg`, `sgrada.jpg` and design-page `example.jpg` still return 404 locally. The header, menu and routing work are local only.
- The four contact forms submit to a PHP 8.5 endpoint with localized inline and no-JS responses, optional phone, no attachments and private file-based rate limiting. Production defaults to SES v2. On this checkout, the ignored `config/.env.local` enables Mailpit on the working `m-mash.test` vhost; no Docker LAMP settings were changed. See [contact setup](CONTACT.md).
- Git `origin` and Deployer both use `git@github.com:vdonchev/m-mash.git` on `master`. Confirmed the VPS can read the new repository with the existing agent forwarded for one connection. For future releases, see [deploy options](DEPLOY.md#deploy-or-roll-back).
- Production releases are fetched from GitHub to `ubuntu@151.80.145.236:/var/www/m-mash.net`. Check `current/REVISION` for the active commit. Apache and PHP-FPM 8.5 both run as `www-data`. The recipe does not configure Apache or DNS.
- Deployer now shares `config/.env` and preserves existing content; `.env.local` remains available for Mailpit. Composer validation, mocked SES signing with dummy dotenv credentials, Docker Mailpit configuration loading and private file creation checks passed. No live SES messages.

## Open items

| Item | What is needed |
| --- | --- |
| VPS and SES | Apache does not yet have an `m-mash.net` vhost on the VPS. Use `/var/www/m-mash.net/current/public` and the [Apache routing setup](DEPLOY.md#apache-routing). Verify the sender domain and DKIM after getting DNS control, then request SES production access in the same region; verify delivery only with approval. |
| Privacy policy | Obtain approved copy and publication requirements. Cover form data processed via SES and the use of Google Fonts and Google Maps. No policy is currently in the repo. |
| 2026 EU project | Obtain an approved summary of the aims and results of «Енергийна ефективност в М-Маш ЕООД», currently linked through `files/26/Info-website.pdf`. Add it to the four home news sections and confirm the translated text and funding requirements. |
| ISO certificate | The linked scan shows an expiry date of 24 June 2021, while the About copy describes certification as valid. Ask for a current certificate and confirmation of the certification claim; update the four home sections and About variants as needed. |
| Client photo permissions | Confirm the provenance and permission for the four client-supplied photos in [the asset register](ASSETS.md#photo-provenance). |
| Legacy-host migration | Required if the canonical domain moves off the old server. Inventory and migrate documents, funding logos, certificate and fallback images before switching. |

**Next action:** Test the Apache HTTPS vhost and redirects on the VPS before switching public traffic. Follow the [VPS/SES checklist](CONTACT.md#vps-and-ses) to populate the shared `.env` with a send-only key.

## Keep this current

After meaningful progress, replace stale state rather than appending a diary. Record the affected pages or areas, checks actually run and their result, blockers with an owner when known, and the next actionable step. Keep stable conventions in the other docs and don't store secrets or private correspondence here.
