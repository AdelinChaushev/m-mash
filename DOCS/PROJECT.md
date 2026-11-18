# Project reference

M-MASH is a multilingual manufacturing company website. The frontend is plain HTML, CSS and JavaScript in `public/` with no build step. The contact endpoint uses PHP 8.5 and Composer; see [contact setup](CONTACT.md) for its configuration and tests.

## Page map

| Page | Bulgarian (root) | English | German | Italian |
| --- | --- | --- | --- | --- |
| Home | [`/`](../public/index.html) | [`/en/`](../public/en/index.html) | [`/de/`](../public/de/index.html) | [`/it/`](../public/it/index.html) |
| About | [`/za-nas`](../public/za-nas.html) | [`/en/about`](../public/en/about.html) | [`/de/ueber-uns`](../public/de/ueber-uns.html) | [`/it/chi-siamo`](../public/it/chi-siamo.html) |
| Capabilities | [`/proizvodstvo`](../public/vazmozhnosti.html) | [`/en/capabilities`](../public/en/capabilities.html) | [`/de/fertigung`](../public/de/fertigung.html) | [`/it/capacita`](../public/it/capacita.html) |
| Services | [`/uslugi`](../public/uslugi.html) | [`/en/services`](../public/en/services.html) | [`/de/leistungen`](../public/de/leistungen.html) | [`/it/servizi`](../public/it/servizi.html) |
| Quality | [`/kachestvo`](../public/kachestvo.html) | [`/en/quality`](../public/en/quality.html) | [`/de/qualitaet`](../public/de/qualitaet.html) | [`/it/qualita`](../public/it/qualita.html) |
| Contact | [`/kontakti`](../public/kontakti.html) | [`/en/contact`](../public/en/contact.html) | [`/de/kontakt`](../public/de/kontakt.html) | [`/it/contatti`](../public/it/contatti.html) |

The 24 public pages duplicate their utility bar, header navigation and footer. [`dizain-sistema.html`](../public/dizain-sistema.html) is a Bulgarian design reference with a simplified header and footer. It uses the shared assets and is marked `noindex, nofollow`; that does not restrict access.

The page map shows public URLs and links to their backing HTML files. [`public/.htaccess`](../public/.htaccess) serves the clean URLs and redirects old `.html` URLs with a `301`. Only the homepages end in a slash. Keep the language switch on the matching page and keep canonical links, reciprocal `hreflang`, and [`sitemap.xml`](../public/sitemap.xml) aligned on `https://m-mash.net/`. German headings use `&shy;` at compound boundaries where long words need a line-break opportunity.

## Content and behavior

- **News and EU-funded projects:** The home page anchors are [`#aktualno`](../public/index.html#aktualno), [`#news`](../public/en/index.html#news), [`#aktuelles`](../public/de/index.html#aktuelles) and [`#notizie`](../public/it/index.html#notizie). Add notices at the top of the relevant `<ol class="notices">` in all four locales, following the existing `<li class="notice">` markup. The linked documents and EU funding logos remain Bulgarian; translated sections explain that.
- **JavaScript:** [`site.js`](../public/assets/js/site.js) handles the mobile menu, home hero slides, email copy buttons, the inline form response and the footer year. The `strings` object supplies localized client text selected by the HTML `lang`.
- **Inquiry form:** All four contact pages post to [`contact-submit.php`](../public/contact-submit.php), with optional phone and no attachments. The endpoint's locale-specific copy lives in [`src/contact-copy.php`](../src/contact-copy.php). On failure, inline or no-JS submission preserves the entered details when possible. Production sends via Amazon SES to `info@m-mash.net`, which is also the direct fallback for files or direct contact. See [contact setup](CONTACT.md).
- **Published contact details:** The shared phone number belongs to Милчо Милчев (manager). Мария Милчева (sales manager) has a separate number, +359 899 703 510, on the four contact pages only; the site does not list an email for her. Address changes may affect the contact card, map caption and the repeated footer; search all locales.
- **Map and fonts:** Contact pages embed Google Maps without an API key. The iframe's `q=` searches for the company's listing (`М-МАШ ЕООД`) instead of the address number `307050`, which the original docs report Google did not recognize. Keep locale labels consistent when editing the embed. The site loads Onest, including Cyrillic, from Google Fonts. Both services can receive visitors' IP addresses.

## Legacy `m-mash.net` dependencies

The home pages link to EU project material on the old server under `files/`, `images/Eu-pic.png`, and `Info for website_TM 2023.docx`. They also display the ISO certificate from `images/CCF31102018.jpg`. Some photos and the logo fall back to legacy files under `images/`. These are not bundled with this repository.

Before replacing the legacy host or pointing `m-mash.net` at another deployment, inventory the actual URLs in the HTML, preserve or migrate the files, and verify the links in each locale. Do not drop historical notices or alter their dates while moving files. See [the handoff](HANDOFF.md) for outstanding content and release questions.
