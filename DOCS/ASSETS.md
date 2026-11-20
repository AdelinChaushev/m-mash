# Design and assets

## Shared design

- [`public/assets/css/tokens.css`](../public/assets/css/tokens.css) defines the graphite, steel blue, navy, industrial white and safety amber palettes, plus type and spacing. [`public/assets/css/site.css`](../public/assets/css/site.css) defines components; `.on-dark` remaps roles for dark sections.
- The header follows the refined CNC mockup: a navy contact and language strip above a white navigation row. The new mark redraws the angular M and open ring of the original logo; the wordmark and slogan are live HTML inside the named home link. The footer uses the localized company name as a home link. The original artwork and favicon are unchanged.
- Below `66rem`, the closed header keeps the shorter wordmark, phone, four languages and localized inquiry button. The hamburger opens a full-screen white dialog with an icon-only X (locally labelled for screen readers), large navy links, light dividers, an amber current-page marker and inquiry button, language links, phone and email. The dialog scrolls on short screens while the close control stays visible and the background page does not scroll. Without JavaScript or dialog support, the original in-page navigation stays visible. The site header itself is not sticky. Check a 320 px phone, landscape, both sides of the 1056 px breakpoint at default browser font size and a wide desktop.
- Inner-page `.page-hero` sections use navy and sky-blue breadcrumb links; the inquiry `.band` stays steel blue. Other dark sections use graphite. The footer uses the page's light background. `footer-gears.svg` and `footer-edge-gear.svg` are CSS masks on `.site-footer::before` and `main::after`; the rising gear needs room in the final section's bottom padding. End new public pages with `.band` or `.section`, or reserve that space explicitly.
- The [design reference](../public/dizain-sistema.html) shows the tokens and components. It also states the preference for M-MASH's own photos; the current stock files are temporary exceptions, not photos of M-MASH's workshop.

## Image slots

Images live in [`public/assets/img/`](../public/assets/img/). Reuse the existing filename and crop unless the design is changing. Aim for JPGs under about 400 KB, at roughly 80% quality. Keep alt text accurate in all affected locales. Keep decorative hero images at `alt=""`.

| File | Slot | Reference size |
| --- | --- | --- |
| `m-mash-mark.svg` | Header mark redrawn from the original circular M; also used in organization metadata | Vector, 64 × 64 viewBox |
| `banner.png` | Original banner artwork, retained as a reference | 760 × 366 |
| `banner-logo.png` | Retired banner: top strip with the original logo | 240 × 81 |
| `banner-strip.png` | Retired banner: repeating top strip | 4 × 81 |
| `banner-gears.png` | Retired banner: gears with the crossing line and strip removed | 250 × 285 |
| `hero.jpg`, `hero-2.jpg`, `hero-3.jpg` | Home hero slides | 2400 × 1350 |
| `ceh.jpg` | Home intro: machined parts on drawings | 1351 × 1013 |
| `cnc-strugovane.jpg` | CNC turning | 1309 × 982 |
| `frezovane.jpg` | Milling | 1600 × 1200 |
| `shlifovane.jpg` | Grinding | 1309 × 982 |
| `detayli.jpg` | Finished parts | 1600 × 1200 |
| `kontrol.jpg` | Quality and inspection | 1309 × 982 |
| `sgrada.jpg` | About: company building in Kazanlak | 1440 × 1080 |
| `favicon.ico` | Browser icon from the original round logo | 16, 32 and 48 px |

The home hero and About building photo use bundled images only, with no legacy fallbacks.

The home hero cycles every six seconds. Arrows, slide indicators and touch swipes allow manual selection. Hover or keyboard focus on the controls pauses rotation; reduced-motion users get manual changes only. To add a slide, copy the `hero-3.jpg` markup in all four home pages and update `data-label` and `src`; JS creates one indicator per slide.

## Photo provenance

The client provided `ceh.jpg`, `cnc-strugovane.jpg`, `shlifovane.jpg` and `kontrol.jpg` on 12 November 2026. Their original sources and permissions are not recorded. The grinder shows a maker name; the inspection photo shows a recognizable face. Confirm publication permissions with the client. The original banner and building photo are M-MASH material.

These stock references document the current temporary files. Keep source records when images change; describe what's visible rather than calling stock subjects M-MASH equipment or parts.

| File | Photographer | Source |
| --- | --- | --- |
| `hero.jpg` | Daniel Smyth | [Pexels: CNC machine close-up](https://www.pexels.com/photo/close-up-shot-of-a-cnc-machine-8865187/) |
| `hero-2.jpg` | Daniel Smyth | [Pexels: coolant splashing](https://www.pexels.com/photo/close-up-of-machine-splashing-milk-8956445/) |
| `hero-3.jpg` | Hans Westbeek | [Unsplash: turned steel parts](https://unsplash.com/photos/rows-of-shiny-metal-components-on-a-textured-surface-fimoFLchbuk) |
| `frezovane.jpg` | Daniel Smyth | [Pexels: milling cutter](https://www.pexels.com/photo/close-up-photo-of-metal-tool-10406128/) |
| `detayli.jpg` | EnCata PD | [Unsplash: parts on engineering drawings](https://unsplash.com/photos/two-metal-mechanical-parts-on-engineering-blueprints-SRqJ3eli-4I) |
