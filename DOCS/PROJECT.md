# Project reference

M-MASH is a multilingual manufacturing company website. The repository contains plain HTML, shared CSS, vanilla JavaScript and assets. There is no build step, application server, package installation or automated test suite in the repository.

## Page map

| Page | Bulgarian (root) | English | German | Italian |
| --- | --- | --- | --- | --- |
| Home | [`index.html`](../index.html) | [`en/index.html`](../en/index.html) | [`de/index.html`](../de/index.html) | [`it/index.html`](../it/index.html) |
| About | [`za-nas.html`](../za-nas.html) | [`en/about.html`](../en/about.html) | [`de/ueber-uns.html`](../de/ueber-uns.html) | [`it/chi-siamo.html`](../it/chi-siamo.html) |
| Capabilities | [`vazmozhnosti.html`](../vazmozhnosti.html) | [`en/capabilities.html`](../en/capabilities.html) | [`de/fertigung.html`](../de/fertigung.html) | [`it/capacita.html`](../it/capacita.html) |
| Services | [`uslugi.html`](../uslugi.html) | [`en/services.html`](../en/services.html) | [`de/leistungen.html`](../de/leistungen.html) | [`it/servizi.html`](../it/servizi.html) |
| Quality | [`kachestvo.html`](../kachestvo.html) | [`en/quality.html`](../en/quality.html) | [`de/qualitaet.html`](../de/qualitaet.html) | [`it/qualita.html`](../it/qualita.html) |
| Contact | [`kontakti.html`](../kontakti.html) | [`en/contact.html`](../en/contact.html) | [`de/kontakt.html`](../de/kontakt.html) | [`it/contatti.html`](../it/contatti.html) |

The 24 public pages duplicate their top bar, banner, navigation and footer. [`dizain-sistema.html`](../dizain-sistema.html) is a Bulgarian design reference with a simplified header and footer. It uses the shared assets and is marked `noindex, nofollow`; that does not restrict access.

The language switch should open the matching page, not the other language's home page. Public pages use `lang`, localized metadata and absolute canonical and `hreflang` links on `https://m-mash.net/`. Keep all counterparts aligned when URLs change. German headings use `&shy;` at compound boundaries where long words need a line-break opportunity.

## Content and behavior

- **News and EU-funded projects:** The home page anchors are [`#aktualno`](../index.html#aktualno), [`#news`](../en/index.html#news), [`#aktuelles`](../de/index.html#aktuelles) and [`#notizie`](../it/index.html#notizie). Add notices at the top of the relevant `<ol class="notices">` in all four locales, following the existing `<li class="notice">` markup. The linked documents and EU funding logos remain Bulgarian; translated sections explain that.
- **JavaScript:** [`assets/js/site.js`](../assets/js/site.js) handles header scroll state, the mobile menu, home hero slides, email copy buttons, the contact draft and the footer year. The `strings` object supplies localized labels, greeting and subject, selected by the HTML `lang`.
- **Inquiry form:** All four contact pages have six required fields: first name, surname, company, phone, work email and part description. JavaScript reads `data-inquiry`, puts the company in the subject, and builds the message from the description and contact signature. The no-JS fallback uses the form's `action`. Both point to `info@m-mash.net`; check the direct-email links and fallback copy if the recipient changes. Visitors attach drawings and send the draft from their own mail app. Without a configured mail handler, or with a very long encoded URL (especially with Cyrillic text), the draft may not open.
- **Published contact details:** The shared phone number belongs to Милчо Милчев (manager). Мария Милчева (sales manager) has a separate number, +359 899 703 510, on the four contact pages only; the site does not list an email for her. Address changes may affect the contact card, map caption and the repeated footer; search all locales.
- **Map and fonts:** Contact pages embed Google Maps without an API key. The iframe's `q=` searches for the company's listing (`М-МАШ ЕООД`) instead of the address number `307050`, which the original docs report Google did not recognize. Keep locale labels consistent when editing the embed. The site loads Onest, including Cyrillic, from Google Fonts. Both services can receive visitors' IP addresses.

## Legacy `m-mash.net` dependencies

The home pages link to EU project material on the old server under `files/`, `images/Eu-pic.png`, and `Info for website_TM 2023.docx`. They also display the ISO certificate from `images/CCF31102018.jpg`. Some photos and the logo fall back to legacy files under `images/`. These are not bundled with this repository.

Before replacing the legacy host or pointing `m-mash.net` at another deployment, inventory the actual URLs in the HTML, preserve or migrate the files, and verify the links in each locale. Do not drop historical notices or alter their dates while moving files. See [the handoff](HANDOFF.md) for outstanding content and release questions.
