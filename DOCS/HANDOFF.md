# Session handoff

## Current baseline

- The frontend still has no build step. All 25 pages and their assets are under `public/`. Shared CSS/JS uses `2026-11-20`.
- All 24 public pages now have clean URLs in Apache, with one-hop `301` redirects from the old `.html` URLs. Bulgarian capabilities is `/proizvodstvo`. Internal links, canonical URLs, `hreflang` and the sitemap agree. The design reference stays at `/dizain-sistema.html` and is not in the sitemap. `tests/routes.py` passed on the Docker vhost and a separate Apache instance at both the root and a nested mount. Mobile Chromium followed the Bulgarian capabilities → German capabilities → German inquiry links. PHP returned `405` for GET and `422` for an incomplete POST; no mail was sent.
- The mobile hamburger opens a full-screen white dialog with simple link rows and a sticky, icon-only X with localized accessible labels. The dialog reuses the header links. The closed header and desktop navigation keep their existing layout.
- Removed the broken footer, ISO and EU image slots and legacy image fallbacks in all four locales. The footer uses a text home link; EU funding acknowledgments and notices remain. All four About pages now use the supplied 1440 × 1080 building photo at `public/assets/img/sgrada.jpg`. The local Apache route suite passed, the JPEG returned `200`, and Chromium verified it renders in all four locales at 320 px and 1440 px.
- Enhanced navigation reuses the document between the 24 public HTML pages on supported browsers. After the image release, fresh Chromium on `https://m-mash.net/` reused the document from Bulgarian home to each of the other 23 pages and on mobile menu and language clicks. Simulating a tab with the pre-release CSS/JS URLs reproduced one full load on the first click because the destination uses new shared assets; subsequent clicks in that tab reused the document. Cloudflare Email Address Obfuscation previously caused full loads, but the sampled live responses did not contain its injected script. Older browsers without the required Navigation API features still follow ordinary links.
- The 3 px amber loading bar intentionally waits 250 ms. Live Chromium testing to `/proizvodstvo` showed no bar on a 138 ms fetch and showed it appear, complete and disappear on a delayed fetch, without reloading the document in either case.
- The four contact forms submit to a PHP 8.5 endpoint with localized inline and no-JS responses, optional phone, no attachments and private file-based rate limiting. Production defaults to SES v2. On this checkout, the ignored `config/.env.local` enables Mailpit on the working `m-mash.test` vhost; no Docker LAMP settings were changed. See [contact setup](CONTACT.md).
- Push local `master` to `origin/master` (`vdonchev/m-mash`) and `legacy/main` (`AdelinChaushev/m-mash`) as documented in `AGENTS.md`. The dual push was verified. Deployer reads only `origin/master`; VPS access worked with the [one-off forwarded agent option](DEPLOY.md#deploy-or-roll-back), not without it.
- The root `.idea/` directory is ignored and untracked. It stays local because Deployer releases committed files from Git.
- The `m-mash.net` HTTPS vhost serves `/var/www/m-mash.net/current/public`. After the operator fixed Apache routing, `/proizvodstvo` returned `200` and `/vazmozhnosti.html` redirected to it with `301` at both the origin and through Cloudflare. Public `/za-nas` returned `200` and GET `/contact-submit.php` returned `405`. Check `/var/www/m-mash.net/current/REVISION` for the active revision.
- Production `current/config/.env` points to the empty shared `.env` (`0640`, `ubuntu:www-data`); `.env.local` is also empty. The PHP worker can read the shared file and write to the private state directory. An unauthenticated HTTPS probe reached the Frankfurt SES endpoint, but AWS rejected the local CLI profile, so the SES identity and account status are unconfirmed. No production changes or live messages.

## Open items

| Item | What is needed |
| --- | --- |
| SES | Authenticate to the intended AWS account. Check the regional SES account and domain identity, add any required DKIM records in Cloudflare without changing inbound MX, then install a send-only key and verify delivery with approval. |
| `www` hostname | `https://www.m-mash.net/` serves an unrelated WordPress site and `/za-nas` returns its 404. Use `https://m-mash.net/`. With hosting approval, redirect `www` to the canonical hostname, preserving paths and query strings, and verify both protocols. |
| Privacy policy | Obtain approved copy and publication requirements. Cover form data processed via SES and the use of Google Fonts and Google Maps. No policy is currently in the repo. |
| 2026 EU project | Obtain an approved summary of the aims and results of «Енергийна ефективност в М-Маш ЕООД», currently linked through `files/26/Info-website.pdf`. Add it to the four home news sections and confirm the translated text and funding requirements. |
| ISO certificate | The removed scan showed an expiry date of 24 June 2021, while the About copy describes certification as valid. Ask for a current certificate and confirmation of the certification claim; update the four home sections and About variants as needed. |
| Client photo permissions | Confirm the provenance and permission for the four client-supplied photos in [the asset register](ASSETS.md#photo-provenance). |
| Legacy-host migration | Inventory the remaining project documents. Recover official funding graphics and the 2023 PNG notice from the client or a backup if required for publication; the legacy funding images and footer logo were never bundled in Git. |

**Next action:** Restore AWS access and follow the [VPS/SES checklist](CONTACT.md#vps-and-ses), starting with the SES domain identity.

## Keep this current

After meaningful progress, replace stale state rather than appending a diary. Record the affected pages or areas, checks actually run and their result, blockers with an owner when known, and the next actionable step. Keep stable conventions in the other docs and don't store secrets or private correspondence here.
