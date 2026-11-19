# Session handoff

## Current baseline

- The frontend still has no build step. All 25 pages and their assets are under `public/`. Shared CSS/JS uses `2026-11-18.5`.
- All 24 public pages now have clean URLs in Apache, with one-hop `301` redirects from the old `.html` URLs. Bulgarian capabilities is `/proizvodstvo`. Internal links, canonical URLs, `hreflang` and the sitemap agree. The design reference stays at `/dizain-sistema.html` and is not in the sitemap. `tests/routes.py` passed on the Docker vhost and a separate Apache instance at both the root and a nested mount. Mobile Chromium followed the Bulgarian capabilities → German capabilities → German inquiry links. PHP returned `405` for GET and `422` for an incomplete POST; no mail was sent.
- The mobile hamburger opens a full-screen white dialog with simple link rows and a sticky, icon-only X with localized accessible labels. The dialog reuses the header links. The closed header and desktop navigation keep their existing layout. Known fallback requests for `logo.svg`, `sgrada.jpg` and design-page `example.jpg` still return 404 locally.
- Enhanced navigation reuses the document between the 24 public HTML pages on supported browsers. An amber progress bar appears after 250 ms, fills left to right on completion, and hides. Chromium verified all 24 routes, mobile language and inquiry navigation, metadata, Back/Forward and scroll, rapid clicks, reduced motion, and normal links after a failed fetch or with JavaScript or the Navigation API disabled. The contact check used a mocked response only.
- The four contact forms submit to a PHP 8.5 endpoint with localized inline and no-JS responses, optional phone, no attachments and private file-based rate limiting. Production defaults to SES v2. On this checkout, the ignored `config/.env.local` enables Mailpit on the working `m-mash.test` vhost; no Docker LAMP settings were changed. See [contact setup](CONTACT.md).
- Push local `master` to `origin/master` (`vdonchev/m-mash`) and `legacy/main` (`AdelinChaushev/m-mash`) as documented in `AGENTS.md`. The dual push was verified. Deployer reads only `origin/master`; VPS access worked with the [one-off forwarded agent option](DEPLOY.md#deploy-or-roll-back), not without it.
- Production release `4` (`724b021`) was verified on the VPS: the active revision, required public files and PHP endpoint lint passed. Check `/var/www/m-mash.net/current/REVISION` on the VPS for the current revision rather than updating this file after routine releases. Apache still has no `m-mash.net` vhost, so the release was not verified over public HTTPS. Apache and PHP-FPM 8.5 both run as `www-data`. The recipe does not configure Apache or DNS.
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

**Next action:** Configure and test the Apache HTTPS vhost and redirects on the VPS before switching public traffic. Follow the [VPS/SES checklist](CONTACT.md#vps-and-ses) to populate the shared `.env` with a send-only key.

## Keep this current

After meaningful progress, replace stale state rather than appending a diary. Record the affected pages or areas, checks actually run and their result, blockers with an owner when known, and the next actionable step. Keep stable conventions in the other docs and don't store secrets or private correspondence here.
