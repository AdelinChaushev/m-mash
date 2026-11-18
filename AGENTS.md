# M-MASH project instructions

## Start here

1. Check `git status --short --branch` and read [`DOCS/HANDOFF.md`](DOCS/HANDOFF.md) before working. Preserve existing changes; use Git for history rather than guessing what a previous session did.
2. Use [`DOCS/PROJECT.md`](DOCS/PROJECT.md) for the locale/page map, contact flow and legacy dependencies, [`DOCS/ASSETS.md`](DOCS/ASSETS.md) for design and images, and [`DOCS/WORKFLOW.md`](DOCS/WORKFLOW.md) for verification and deployment.

## Working rules

- This is a static HTML/CSS/vanilla JS site with no build step. Keep it runnable directly from a static server. No dedicated preview is required; see the workflow for on-demand HTTP checks.
- Bulgarian pages live in the root; their counterparts are under `en/`, `de/` and `it/`. For a shared content or component change, check all four variants and keep intentional locale differences. The public top bar, navigation and footer are duplicated; also inspect `dizain-sistema.html` when changing shared banner, footer or styling.
- Use page-relative internal links and asset paths so the site works both at the domain root and under a hosting subpath. Keep absolute canonical and `hreflang` URLs pointed at the intended public domain.
- Design values belong in `assets/css/tokens.css`, component styles in `assets/css/site.css`, and JavaScript-generated translations in `assets/js/site.js`. If any shared CSS/JS changes, advance the common `?v=` value for all three files in all 25 HTML pages. See the workflow for versioned images.
- The contact form prepares a `mailto:` draft; it does not submit to a backend or send email. Use dummy data and don't send real test inquiries without approval.
- Don't deploy, push, change hosting or change repository visibility unless requested.
- Before handing off meaningful work, update `DOCS/HANDOFF.md` with the current state, checks, blockers and next concrete action. Keep it short and current. Don't store tokens, credentials or personal correspondence in the repo.
