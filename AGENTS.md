# M-MASH project instructions

## Start here

1. Check `git status --short --branch` and read [`DOCS/HANDOFF.md`](DOCS/HANDOFF.md) before working. Preserve existing changes; use Git for history rather than guessing what a previous session did.
2. Use [`DOCS/PROJECT.md`](DOCS/PROJECT.md) for the locale/page map, contact flow and legacy dependencies, [`DOCS/ASSETS.md`](DOCS/ASSETS.md) for design and images, and [`DOCS/WORKFLOW.md`](DOCS/WORKFLOW.md) for verification and deployment.

## Working rules

- The site has no frontend build step. Serve only `public/`; the inquiry endpoint needs PHP 8.5 and Composer dependencies. Keep `src/`, `vendor/`, `config/` and runtime state outside the document root. Don't commit `config/.env` or `.local` configuration files.
- Bulgarian pages live in `public/`; their counterparts are under `public/en/`, `public/de/` and `public/it/`. For a shared content or component change, check all four variants and keep intentional locale differences. The public top bar, navigation and footer are duplicated; also inspect `public/dizain-sistema.html` when changing shared banner, footer or styling.
- Use page-relative, extensionless internal page links and keep assets and the form action page-relative. Apache serves the clean URLs via `public/.htaccess`, including under a hosting subpath. Keep absolute canonical, `hreflang` and sitemap URLs on the public domain and update them together. See the [page map](DOCS/PROJECT.md#page-map).
- Design values belong in `public/assets/css/tokens.css`, component styles in `public/assets/css/site.css`, and JavaScript-generated translations in `public/assets/js/site.js`. If any shared CSS/JS changes, advance the common `?v=` value for all three files in all 25 HTML pages and for the two CSS links in `src/contact-result.php`. See the workflow for versioned images.
- All four contact pages submit to `public/contact-submit.php`. Use dummy data with Mailpit or the mocked SES tests; don't send real test inquiries without approval. See [`DOCS/CONTACT.md`](DOCS/CONTACT.md).
- Don't deploy, push, change hosting or change repository visibility unless requested. See [`DOCS/DEPLOY.md`](DOCS/DEPLOY.md) for the Deployer recipe and local verification.
- For a normal push request, push local `master` to both `origin/main` (`AdelinChaushev/m-mash`) and `donchev/master` (`vdonchev/m-mash`). Use `git push origin master:main` and `git push donchev master:master`; do not force-push if either branch rejects the update. Deployer still reads `master` from `vdonchev/m-mash`.
- With the production workflow enabled, a push to `vdonchev/m-mash:master` can deploy. Don't run a local deploy for the same push. See [automatic releases](DOCS/DEPLOY.md#automatic-releases-from-github).
- Before handing off meaningful work, update `DOCS/HANDOFF.md` with the current state, checks, blockers and next concrete action. Keep it short and current. Don't store tokens, credentials or personal correspondence in the repo.
- For a routine deploy, commit any planned handoff edits before pushing, then verify the release without editing tracked files. Report the deployed revision and smoke checks in the final response; use the VPS `current/REVISION` as the source of truth. If deployment reveals a new blocker that needs a lasting note, report it before making a separate docs change. Check `git status --short` before finishing and preserve any pre-existing changes.
