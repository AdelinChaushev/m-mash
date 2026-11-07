# M-MASH · m-mash.net

Static site in Bulgarian, English, German and Italian. No build step: upload the folder as it is to any hosting.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Начало, including the Актуално section (EU-funded projects, notices, documents) at `index.html#aktualno` |
| `za-nas.html` | За нас |
| `vazmozhnosti.html` | Производствени възможности |
| `uslugi.html` | Услуги и решения |
| `kachestvo.html` | Качество |
| `kontakti.html` | Контакти и запитване |
| `dizain-sistema.html` | Design system reference (internal, `noindex`) |

## Other languages

The English pages are in `en/`, the German pages in `de/` and the Italian pages in `it/`. They use the same layouts and the same files in `assets/`, so a photo added once appears in all languages. The БГ / EN / DE / IT switch in the top bar opens the same page in the other language, and each page's `hreflang` links tell search engines the pages are translations.

| Bulgarian | English | German | Italian |
| --- | --- | --- | --- |
| `index.html` | `en/index.html` | `de/index.html` | `it/index.html` |
| `za-nas.html` | `en/about.html` | `de/ueber-uns.html` | `it/chi-siamo.html` |
| `vazmozhnosti.html` | `en/capabilities.html` | `de/fertigung.html` | `it/capacita.html` |
| `uslugi.html` | `en/services.html` | `de/leistungen.html` | `it/servizi.html` |
| `kachestvo.html` | `en/quality.html` | `de/qualitaet.html` | `it/qualita.html` |
| `kontakti.html` | `en/contact.html` | `de/kontakt.html` | `it/contatti.html` |

The Актуално section is translated on each home page: `en/index.html#news`, `de/index.html#aktuelles` and `it/index.html#notizie`. The linked documents and the EU funding logos stay in Bulgarian, and each section says so. Long words in German headings break only at the `&shy;` marks in the HTML, so add one at the compound joint when writing a new long heading. The few texts that `assets/js/site.js` writes itself (menu label, copy button, email greeting and subject) are in the `strings` list at the top of that file.

## Photos and logo: drop them into `assets/img/`

The pages already point at these files. Save each one under exactly this name and it appears on the site, with no code changes. Until a file is there, its slot shows a neutral grey box with the file name. The logo falls back to the old `logo.jpg`, and `hero.jpg` and `sgrada.jpg` fall back to the building photo on the old server.

| File | What it should show | Used on | Size |
| --- | --- | --- | --- |
| `logo.svg` | Logo, dark version | Header, all pages | vector |
| `logo-white.svg` | Logo, white version | Footer | vector |
| `hero.jpg` | Machine or workshop at work, landscape | Home hero | 2400 × 1350 |
| `ceh.jpg` | Workshop overview | Home, "Вашият чертеж…" | 1600 × 1200 |
| `cnc-strugovane.jpg` | CNC lathe / turning | Home, Възможности | 1600 × 1200 |
| `frezovane.jpg` | Milling | Home, Възможности | 1600 × 1200 |
| `shlifovane.jpg` | Grinding | Home, Възможности | 1600 × 1200 |
| `detayli.jpg` | Finished parts | Услуги | 1600 × 1200 |
| `kontrol.jpg` | Measuring / inspecting a part | Качество | 1600 × 1200 |
| `sgrada.jpg` | The M-MASH building | За нас | 1600 × 1200 |

Export JPGs at about 80% quality so each stays under ~400 KB.

The browser tab icon is `assets/img/favicon.ico`, cut from the round symbol in the original logo (white on Steel Blue, at 16, 32 and 48 px). The two gears in the footer are `assets/img/footer-gears.svg`, placed by the `.site-footer::before` rule in `site.css`. The gear rising from the footer's top edge is `assets/img/footer-edge-gear.svg`, placed by the `main::after` rule. It stands in the bottom padding of the last section on every page, so end a new page with the band or a `.section`, which leave room for it.

## Design system

- `assets/css/tokens.css`: the four colour families (graphite, steel blue, industrial white, safety amber), type scale and spacing. Change values here only.
- `assets/css/site.css`: components built on the tokens. `.on-dark` remaps the tokens for dark sections.
- `assets/js/site.js`: mobile menu, copy buttons and the contact form.

## Contact form and details (`kontakti.html`)

A short form with six required fields: first name, surname, company, phone number, work email and a description of the part. It sends nothing itself, so the site needs no server code. The button opens the visitor's own email program with a ready message to `info@m-mash.net`. The company goes in the subject, the description in the message, and the name, company, phone and email below it as a signature. Visitors can attach drawings or other files there, and they send it from their own address, so a reply goes straight back to them.

If a visitor has no email program set up, the button can't open one. The message under the button then points them to info@m-mash.net, and the panel beside the form lists what a technical inquiry should include.

The same message covers very long descriptions. The form's text travels inside the email link, where each Cyrillic letter takes six characters, and Chrome on Windows is reported to stop opening such links at about 2,000 characters. A Bulgarian description of about 250 characters reaches that length. Text in Latin letters can run to well over 1,000 characters.

The recipient is set in two places on the form in `kontakti.html`: the `data-inquiry` attribute, and the `action` used when JavaScript is off.

The phone number in the top bar, the footer and on the contact page belongs to Милчо Милчев (управител). Мария Милчева (мениджър продажби) has no phone or email on the site yet.

The map on the contact page is a Google Maps embed, with no API key needed. It searches for the company's Google listing (М-МАШ ЕООД) because Google doesn't recognise the number 307050. To change the pin, edit the `q=` text in the iframe `src` in `kontakti.html`. The address itself appears in the contact card, above the map and in the footer of every page. The map loads from Google, so a privacy policy should mention it.

Font: Onest, loaded from Google Fonts with Cyrillic.

## Files that stay on the old server

The EU funding logos and all project documents in the Актуално section load from the current m-mash.net server (`files/`, `images/Eu-pic.png`, `Info for website_TM 2023.docx`). Keep those files when you upload the new site, or the funding logos and document links break.

## Notes before going live

- The site still needs a privacy policy. The contact form collects personal data, and the Google Fonts and Google Maps requests send visitors' IP addresses to Google.
- The 2026 project ("Енергийна ефективност в М-Маш ЕООД") is described only inside `files/26/Info-website.pdf`. EU rules ask for a short description of the project (aims and results) on the website itself, so paste that text into the Актуално section of `index.html` when you can.
- New notices go at the top of the matching project's `<ol class="notices">` in `index.html`, copying an existing `<li class="notice">`. Add the translated notice to `en/index.html`, `de/index.html` and `it/index.html` too.
- The header, top bar and footer are repeated in every page. Edit all twenty-four pages together, including those in `en/`, `de/` and `it/`.

## Hosting on GitHub Pages

The site is published from the `main` branch of https://github.com/AdelinChaushev/m-mash to https://adelinchaushev.github.io/m-mash/. Every push to `main` updates it within a few minutes. The empty `.nojekyll` file tells GitHub to serve the files as they are.

The EU files and the fallback photos still load from the old m-mash.net server. If m-mash.net itself is later pointed at GitHub Pages, copy those files into this repo and update their links first, or they will stop loading.

## Local preview

```bash
python3 -m http.server 8765
```