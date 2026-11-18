# Session handoff

## Current baseline

- The frontend still has no build step. All 25 pages and their assets moved under `public/` without changing visitor URLs. Shared CSS/JS uses `2026-11-18`.
- The four contact forms submit to a PHP 8.5 endpoint with localized inline and no-JS responses, optional phone, no attachments and private file-based rate limiting. Production defaults to SES v2. On this checkout, the ignored `config/.env.local` enables Mailpit on the working `m-mash.test` vhost; no Docker LAMP settings were changed. See [contact setup](CONTACT.md).
- PHP Deployer targets `151.80.145.236:/var/www/m-mash.net` on `main`. Tested two disposable localhost releases and rollback, including shared state/settings and no-dev install. The recipe has not been run on the VPS. See [release setup](DEPLOY.md).
- Composer validation, configuration precedence, audit and mocked SES tests passed. Earlier checks covered all 25 pages at root and under a subpath and inline/no-JS form behavior in Chromium. A dummy inquiry through the actual `m-mash.test` vhost reached Docker LAMP's Mailpit after the config change, with the expected `Reply-To`. No live SES messages.

## Open items

| Item | What is needed |
| --- | --- |
| VPS and SES | Confirm the SSH deploy account, VPS access to the private GitHub repo and deployment permissions. Use `/var/www/m-mash.net/current/public` as the document root after the first release. Verify the sender domain and DKIM after getting DNS control, then request SES production access in the same region; verify delivery only with approval. |
| Privacy policy | Obtain approved copy and publication requirements. Cover form data processed via SES and the use of Google Fonts and Google Maps. No policy is currently in the repo. |
| 2026 EU project | Obtain an approved summary of the aims and results of «Енергийна ефективност в М-Маш ЕООД», currently linked through `files/26/Info-website.pdf`. Add it to the four home news sections and confirm the translated text and funding requirements. |
| ISO certificate | The linked scan shows an expiry date of 24 June 2021, while the About copy describes certification as valid. Ask for a current certificate and confirmation of the certification claim; update the four home sections and About variants as needed. |
| Client photo permissions | Confirm the provenance and permission for the four client-supplied photos in [the asset register](ASSETS.md#photo-provenance). |
| Legacy-host migration | Required if the canonical domain moves off the old server. Inventory and migrate documents, funding logos, certificate and fallback images before switching. |

**Next action:** Follow the [VPS/SES checklist](CONTACT.md#vps-and-ses) once DNS control is available. For another local test, use [Mailpit mode](CONTACT.md#local-testing-with-mailpit).

## Keep this current

After meaningful progress, replace stale state rather than appending a diary. Record the affected pages or areas, checks actually run and their result, blockers with an owner when known, and the next actionable step. Keep stable conventions in the other docs and don't store secrets or private correspondence here.
