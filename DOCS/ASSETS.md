# Design and assets

## Shared design

- [`public/assets/css/tokens.css`](../public/assets/css/tokens.css) defines the graphite, steel blue, navy, industrial white and safety amber palettes, plus type and spacing. [`public/assets/css/site.css`](../public/assets/css/site.css) defines components; `.on-dark` remaps roles for dark sections.
- The banner follows the client's mock-up dated 11 November 2026, implemented in `ff2f231`. Three image slices recreate the old banner's dark top strip, logo and gears; CSS draws the blue field and squares. The brand text is live HTML inside the home link, which already has an accessible name. The header scrolls away. Desktop links are white with an amber active indicator and inquiry button; the mobile menu opens beneath the banner on a light background.
- Banner scale is controlled by `--bh` on `.site-header`. Check around 402 px (106 px banner in the mock-up), the 1080 px menu switch, the 1081–1270 px compact desktop range and a wider viewport.
- Inner-page `.page-hero` sections use navy and sky-blue breadcrumb links; the inquiry `.band` stays steel blue. Other dark sections use graphite. The footer uses the page's light background. `footer-gears.svg` and `footer-edge-gear.svg` are CSS masks on `.site-footer::before` and `main::after`; the rising gear needs room in the final section's bottom padding. End new public pages with `.band` or `.section`, or reserve that space explicitly.
- The [design reference](../public/dizain-sistema.html) shows the tokens and components. It also states the preference for M-MASH's own photos; the current stock files are temporary exceptions, not photos of M-MASH's workshop.

## Image slots

Images live in [`public/assets/img/`](../public/assets/img/). Reuse the existing filename and crop unless the design is changing. Aim for JPGs under about 400 KB, at roughly 80% quality. Keep alt text accurate in all affected locales. Keep decorative hero images at `alt=""`.

| File | Slot | Reference size |
| --- | --- | --- |
| `logo.svg` | Optional dark logo in the shared footer; currently uses a legacy fallback | Vector |
| `banner.png` | Original banner artwork used to create the three slices; not displayed directly | 760 × 366 |
| `banner-logo.png` | Top strip with the logo | 240 × 81 |
| `banner-strip.png` | Repeating top strip | 4 × 81 |
| `banner-gears.png` | Gears with the crossing line and strip removed | 250 × 285 |
| `hero.jpg`, `hero-2.jpg`, `hero-3.jpg` | Home hero slides | 2400 × 1350 |
| `ceh.jpg` | Home intro: machined parts on drawings | 1351 × 1013 |
| `cnc-strugovane.jpg` | CNC turning | 1309 × 982 |
| `frezovane.jpg` | Milling | 1600 × 1200 |
| `shlifovane.jpg` | Grinding | 1309 × 982 |
| `detayli.jpg` | Finished parts | 1600 × 1200 |
| `kontrol.jpg` | Quality and inspection | 1309 × 982 |
| `sgrada.jpg` | Building photo slot on About; currently uses a legacy fallback | 1600 × 1200 |
| `favicon.ico` | Browser icon from the original round logo | 16, 32 and 48 px |

Missing regular photos with `data-label` show a neutral placeholder; missing secondary hero slides show a dark placeholder with the file label. The primary hero and building slots use the old building photo as fallback, and the footer logo falls back to the old `logo.jpg`.

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
