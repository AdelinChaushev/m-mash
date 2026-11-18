# M-MASH · m-mash.net

Manufacturing company website in Bulgarian, English, German and Italian. The frontend is plain HTML, CSS and JavaScript with no build step. The contact form runs on PHP 8.5 and uses Composer and Amazon SES.

Serve **`public/`** as the document root, not the repository root. The [Apache routing setup](DOCS/DEPLOY.md#apache-routing) enables clean URLs and redirects from the old `.html` links. See the [contact setup](DOCS/CONTACT.md) for Mailpit and SES, the [page map](DOCS/PROJECT.md#page-map) for the four locales, and the [design reference](public/dizain-sistema.html) for shared styles and components.

## Maintenance

| File | What you'll find |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | Start here for session setup and editing rules |
| [`DOCS/HANDOFF.md`](DOCS/HANDOFF.md) | Current state, open decisions and next actions |
| [`DOCS/PROJECT.md`](DOCS/PROJECT.md) | Page map, inquiry form, notices and legacy dependencies |
| [`DOCS/ASSETS.md`](DOCS/ASSETS.md) | Design, image slots and photo sources |
| [`DOCS/CONTACT.md`](DOCS/CONTACT.md) | Inquiry endpoint, Mailpit and SES setup |
| [`DOCS/DEPLOY.md`](DOCS/DEPLOY.md) | Deployer setup, VPS releases and rollback |
| [`DOCS/WORKFLOW.md`](DOCS/WORKFLOW.md) | Verification, cache busting and releases |
