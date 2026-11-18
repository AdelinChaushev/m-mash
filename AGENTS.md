# M-MASH project instructions

## Start here

1. Check `git status --short --branch` and read [`DOCS/HANDOFF.md`](DOCS/HANDOFF.md) before working. Preserve existing changes; use Git for history rather than guessing what a previous session did.
2. Use [`DOCS/PROJECT.md`](DOCS/PROJECT.md) for the locale/page map, contact flow and legacy dependencies, [`DOCS/ASSETS.md`](DOCS/ASSETS.md) for design and images, and [`DOCS/WORKFLOW.md`](DOCS/WORKFLOW.md) for verification and deployment.

## Working rules

- The site has no frontend build step. Serve only `public/`; the inquiry endpoint needs PHP 8.5 and Composer dependencies. Keep `src/`, `vendor/`, `config/` and runtime state outside the document root. Don't commit `.local` configuration files.
- Bulgarian pages live in `public/`; their counterparts are under `public/en/`, `public/de/` and `public/it/`. For a shared content or component change, check all four variants and keep intentional locale differences. The public top bar, navigation and footer are duplicated; also inspect `public/dizain-sistema.html` when changing shared banner, footer or styling.
- Use page-relative internal links and asset paths so the site works both at the domain root and under a hosting subpath. Keep absolute canonical and `hreflang` URLs pointed at the intended public domain.
- Design values belong in `public/assets/css/tokens.css`, component styles in `public/assets/css/site.css`, and JavaScript-generated translations in `public/assets/js/site.js`. If any shared CSS/JS changes, advance the common `?v=` value for all three files in all 25 HTML pages and for the two CSS links in `src/contact-result.php`. See the workflow for versioned images.
- All four contact pages submit to `public/contact-submit.php`. Use dummy data with Mailpit or the mocked SES tests; don't send real test inquiries without approval. See [`DOCS/CONTACT.md`](DOCS/CONTACT.md).
- Don't deploy, push, change hosting or change repository visibility unless requested. See [`DOCS/DEPLOY.md`](DOCS/DEPLOY.md) for the Deployer recipe and local verification.
- Before handing off meaningful work, update `DOCS/HANDOFF.md` with the current state, checks, blockers and next concrete action. Keep it short and current. Don't store tokens, credentials or personal correspondence in the repo.
