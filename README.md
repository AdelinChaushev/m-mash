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

The Актуално section is translated on each home page: `en/index.html#news`, `de/index.html#aktuelles` and `it/index.html#notizie`. The linked documents and the EU funding logos stay in Bulgarian, and each section says so. Long words in German headings break only at the `&shy;` marks in the HTML, so add one at the compound joint when writing a new long heading. The few texts that `assets/js/site.js` writes itself (menu label, hero photo buttons, copy button, email greeting and subject) are in the `strings` list at the top of that file.

## Photos and logo: drop them into `assets/img/`

The pages already point at these files. Save each one under exactly this name and it appears on the site, with no code changes. Until a file is there, its slot shows a neutral grey box with the file name; in the home hero, the slide stays dark and names the file in its top corner. The logo falls back to the old `logo.jpg`, and `hero.jpg` and `sgrada.jpg` fall back to the building photo on the old server.

| File | What it should show | Used on | Size |
| --- | --- | --- | --- |
| `logo.svg` | Logo, dark version | Footer, all pages | vector |
| `banner-logo.png` | The old banner's dark strip with the small logo (in place) | Header, top left, all pages | 240 × 81 |
| `banner-strip.png` | A plain slice of that strip (in place) | Header, across the top, all pages | 4 × 81 |
| `banner-gears.png` | The old banner's gears (in place) | Header, left, all pages | 250 × 285 |
| `banner.png` | The old M-MASH banner, the source of the three files above (in place) | Not shown by itself | 760 × 366 |
| `hero.jpg` | Machine or workshop at work, landscape | Home hero, slide 1 | 2400 × 1350 |
| `hero-2.jpg` | Machining close-up, landscape | Home hero, slide 2 | 2400 × 1350 |
| `hero-3.jpg` | Finished parts, landscape | Home hero, slide 3 | 2400 × 1350 |
| `ceh.jpg` | Machined parts on technical drawings (from the client) | Home, "Вашият чертеж…" | 1351 × 1013 |
| `cnc-strugovane.jpg` | CNC lathe / turning (from the client) | Home, Възможности | 1309 × 982 |
| `frezovane.jpg` | Milling | Home, Възможности | 1600 × 1200 |
| `shlifovane.jpg` | Grinding (from the client) | Home, Възможности | 1309 × 982 |
| `detayli.jpg` | Finished parts | Услуги | 1600 × 1200 |
| `kontrol.jpg` | Measuring / inspecting a part (from the client) | Качество | 1309 × 982 |
| `sgrada.jpg` | The M-MASH building | За нас | 1600 × 1200 |

Export JPGs at about 80% quality so each stays under ~400 KB.

The header is the banner from the old m-mash.net site, laid out across the whole screen as in the client's mock-up (11 November 2026). On top is the banner's dark strip with the small logo. Below it is the blue panel: on the left the gears, three squares and "M-Mash Ltd." with "Great quality. Great value." under it, and on the right the menu in white. The strip and the gears are cut from `banner.png` (760 × 366 px, the old banner with its hydraulic cylinder painted out). In `banner-gears.png` the dark stripe and the fine lines that crossed the gears are also removed, as in the mock-up. The blue, the squares and the lettering are drawn by `site.css`, so they stay sharp at any width. The lettering is in each page's header, inside the link to the home page, and screen readers skip it because the link has its own name (`aria-label`).

The header is about a quarter of the screen width tall on phones (106 px on a 402 px wide phone, as in the mock-up) and 150 px on tablets and computers. On small laptops (1081–1270 px wide) it is 94–150 px, so the menu fits beside the lettering. On phones the lettering also gets smaller with the screen, so the menu button always keeps its place. The `--bh` setting in the `.site-header` rule sets the height, and everything in the banner scales with it.

The menu sits on the blue. On computers it shows white links, with an amber line under the current page, the amber inquiry button, and a thin line before the first link. On phones there is a white menu button with a thin line beside it, and the open menu drops down below the banner on the page's light background. The header scrolls away with the page instead of staying at the top, as on the old site.

The title box at the top of each inner page (`.page-hero`) is navy like the banner, as in the mock-up, with sky-blue links in its breadcrumb. The inquiry band at the bottom of the pages (`.band`) stays steel blue, and the other dark sections stay graphite.

### Stock photos in use

Four photos came from the client on 12 November 2026 and were cropped to the 4:3 slots: `ceh.jpg` (two machined parts on technical drawings), `cnc-strugovane.jpg` (a CNC lathe turning a shaft), `shlifovane.jpg` (a CNC grinder throwing sparks) and `kontrol.jpg` (a man measuring a part with a micrometer). Their source isn't recorded here. Unlike the stock photos, the grinder shows a maker's name on the machine ("PRECISION TECH GRINDER PRO"), and the measuring photo shows a person's face. Make sure M-MASH may use them on its website.

Five of these photos are free stock photos, in place until M-MASH has its own: `hero.jpg`, `hero-2.jpg`, `hero-3.jpg`, `frezovane.jpg` and `detayli.jpg`. `sgrada.jpg` and the banner are M-MASH's own. The stock photos come from Unsplash and Pexels, whose licences allow free use on a business website without paying or crediting anyone; the photographers keep the copyright, and the photos must not be resold as they are. All are real photographs (each carries the camera's data), with no recognisable faces or company logos. Because they show other companies' machines, their descriptions on the pages (the `alt` texts) say what is in the picture rather than calling it M-MASH's. To use your own photo instead, save it over the same file name; if it shows M-MASH's own workshop or parts, its description can say so again.

| File | Photo | Photographer | Source |
| --- | --- | --- | --- |
| `hero.jpg` | CNC machine spindle with coolant lines | Daniel Smyth | [Pexels](https://www.pexels.com/photo/close-up-shot-of-a-cnc-machine-8865187/) |
| `hero-2.jpg` | CNC milling with coolant splashing | Daniel Smyth | [Pexels](https://www.pexels.com/photo/close-up-of-machine-splashing-milk-8956445/) |
| `hero-3.jpg` | Rows of finished turned steel parts | Hans Westbeek | [Unsplash](https://unsplash.com/photos/rows-of-shiny-metal-components-on-a-textured-surface-fimoFLchbuk) |
| `frezovane.jpg` | End mill cutting an aluminium block | Daniel Smyth | [Pexels](https://www.pexels.com/photo/close-up-photo-of-metal-tool-10406128/) |
| `detayli.jpg` | Two machined parts on technical drawings | EnCata PD | [Unsplash](https://unsplash.com/photos/two-metal-mechanical-parts-on-engineering-blueprints-SRqJ3eli-4I) |

The home hero shows its three photos in turn, a new one every six seconds, behind the same headline and buttons. Under the buttons, centred, two arrows move to the previous or next photo and the bars between them pick any photo; on a phone a sideways swipe does the same. While the pointer or keyboard focus is on the arrows and bars, the photo waits. For visitors whose system asks for less motion, the photo changes only when they choose. To add a fourth photo, copy the `hero-3.jpg` line in the hero of all four home pages and change the file name in its `data-label` and `src`. `site.js` makes one bar per photo.

The browser tab icon is `assets/img/favicon.ico`, cut from the round symbol in the original logo (white on Steel Blue, at 16, 32 and 48 px). The two gears in the footer are `assets/img/footer-gears.svg`, placed by the `.site-footer::before` rule in `site.css`. The gear rising from the footer's top edge is `assets/img/footer-edge-gear.svg`, placed by the `main::after` rule. It stands in the bottom padding of the last section on every page, so end a new page with the band or a `.section`, which leave room for it. The footer has the page's own light background (`--color-bg`). Both gear files are used only as shapes (CSS masks), so `site.css` sets their colours: the rising gear matches the footer, and the footer's gears are one shade darker (`--iwhite-200`).

## Design system

- `assets/css/tokens.css`: the five colour families (graphite, steel blue, navy from the old banner, industrial white, safety amber), type scale and spacing. Change values here only.
- `assets/css/site.css`: components built on the tokens. `.on-dark` remaps the tokens for dark sections.
- `assets/js/site.js`: mobile menu, hero photos, copy buttons and the contact form.

Every page loads these three files with a version after the name, now `?v=2026-11-11`, and `site.css` loads the three banner images the same way (`?v=2026-11-11`). GitHub Pages lets browsers keep each file for 10 minutes, so without the version a browser could show a new page with an old stylesheet. When you change one of these files, change the version in all 25 pages. When you change a banner image, change its version in `site.css`. The four photos from the client (`ceh.jpg`, `cnc-strugovane.jpg`, `shlifovane.jpg`, `kontrol.jpg`) also load with `?v=2026-11-12`; change that too when you replace one of them. Use a new date, or the same date with `.2`, `.3` and so on. Browsers then fetch the new files at once.

## Contact form and details (`kontakti.html`)

A short form with six required fields: first name, surname, company, phone number, work email and a description of the part. It sends nothing itself, so the site needs no server code. The button opens the visitor's own email program with a ready message to `info@m-mash.net`. The company goes in the subject, the description in the message, and the name, company, phone and email below it as a signature. Visitors can attach drawings or other files there, and they send it from their own address, so a reply goes straight back to them.

If a visitor has no email program set up, the button can't open one. The message under the button then points them to info@m-mash.net, and the panel beside the form lists what a technical inquiry should include.

The same message covers very long descriptions. The form's text travels inside the email link, where each Cyrillic letter takes six characters, and Chrome on Windows is reported to stop opening such links at about 2,000 characters. A Bulgarian description of about 250 characters reaches that length. Text in Latin letters can run to well over 1,000 characters.

The recipient is set in two places on the form in `kontakti.html`: the `data-inquiry` attribute, and the `action` used when JavaScript is off.

The phone number in the top bar, the footer and on the contact page belongs to Милчо Милчев (управител). Мария Милчева (мениджър продажби) has her own number, +359 899 703 510, shown under her name on the contact page only; she has no email on the site yet.

The map on the contact page is a Google Maps embed, with no API key needed. It searches for the company's Google listing (М-МАШ ЕООД) because Google doesn't recognise the number 307050. To change the pin, edit the `q=` text in the iframe `src` in `kontakti.html`. The address itself appears in the contact card, above the map and in the footer of every page. The map loads from Google, so a privacy policy should mention it.

Font: Onest, loaded from Google Fonts with Cyrillic.

## Files that stay on the old server

The EU funding logos and all project documents in the Актуално section load from the current m-mash.net server (`files/`, `images/Eu-pic.png`, `Info for website_TM 2023.docx`), and so does the ISO certificate on the home pages (`images/CCF31102018.jpg`). Keep those files when you upload the new site, or the funding logos, document links and certificate break.

## Notes before going live

- The site still needs a privacy policy. The contact form collects personal data, and the Google Fonts and Google Maps requests send visitors' IP addresses to Google.
- The 2026 project ("Енергийна ефективност в М-Маш ЕООД") is described only inside `files/26/Info-website.pdf`. EU rules ask for a short description of the project (aims and results) on the website itself, so paste that text into the Актуално section of `index.html` when you can.
- The certificate in the Quality section of the home pages is the scan from the old site. It shows an expiry date of 24 June 2021, while `za-nas.html` and its translations call the certification valid. When a newer certificate is ready, upload it over `images/CCF31102018.jpg` under the same name. If the certification body has changed, also update the caption in the `.certificate` block of the four home pages.
- New notices go at the top of the matching project's `<ol class="notices">` in `index.html`, copying an existing `<li class="notice">`. Add the translated notice to `en/index.html`, `de/index.html` and `it/index.html` too.
- The top bar, banner, header and footer are repeated in every page. Edit all twenty-four pages together, including those in `en/`, `de/` and `it/`.

## Hosting on GitHub Pages

The site is published from the `main` branch of https://github.com/AdelinChaushev/m-mash to https://adelinchaushev.github.io/m-mash/. Every push to `main` updates it within a few minutes. The empty `.nojekyll` file tells GitHub to serve the files as they are.

The EU files, the certificate and the fallback photos still load from the old m-mash.net server. If m-mash.net itself is later pointed at GitHub Pages, copy those files into this repo and update their links first, or they will stop loading.

## Local preview

```bash
python3 -m http.server 8765
```