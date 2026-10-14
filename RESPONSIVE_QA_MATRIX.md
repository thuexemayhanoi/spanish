# RESPONSIVE MATRIX — Spanish Publishing Site

**Scope:** https://es.rentbikehanoi.com/ · GitHub `thuexemayhanoi/spanish` · CSS `assets/css/theme.css` · 300 published articles, 13 editorial pillars, 334 sitemap URLs.  
**Goal:** comfortable edge spacing and stable layouts at phone, tablet, desktop sizes, without rewriting article content, changing URLs, canonicals, NAP, schema, Factory, or prices.

## Evidence and source of the incident

- User iPhone screenshot (14 Oct 2026): long Spanish SEO paragraphs pressed against both phone edges.
- Read-only browser baseline BEFORE CSS repair at **375px**: homepage/FAQ/privacy SEO paragraph left=0, right≈375px; published article paragraph left≈17px.
- At **768px**: SEO paragraphs start at x=0; at **1440px**, no edge contact. Baseline body had no horizontal scroll, so `overflow-x:hidden` is **not** a fix.
- Root cause: `.seo-core-longform .prose{width:min(860px,100%)}` overrides the `.wrap` container width; its specificity removes narrow-device horizontal gutters.
- Global repair has already been merged and deployed on `main`: `--reading-gutter:clamp(20px,5vw,48px)`, `.wrap.prose`, `.seo-core-longform .wrap.prose`, long-word/link wrapping, responsive tables and fixed controls. **No need to reapply a stale theme branch.**
- Latest verified baseline at matrix creation: `main 46559a2296a556b5d30d1ee96aafdb4f1a244f6a`; GitHub Pages run 38505210172 **PASS**, Site Build QA run 38505210730 **PASS**.

## Device / template coverage

| Priority | Component / template | Phone 320–390px | Tablet 768–1024px | Desktop ≥1121px | Source status | Next acceptance |
|---|---|---|---|---|---|---|
| P0 | 13 long-form landing/FAQ/legal/category pages | ≥20px paragraph inset each side | ≥38.4px at 768px, centered reading width | center ≤860px | CSS fix **DEPLOYED** | Measure browser text bounding boxes post-deploy |
| P0 | 300 article reading pages | ≥20px edge inset | ≤760px centered reading column | ≤760px centered | Shared CSS **DEPLOYED** | Browser spot-check varied article lengths |
| P0 | Body/global overflow | No horizontal scroll | No horizontal scroll | No horizontal scroll | Before repair baseline already showed none | Recheck every representative template |
| P1 | 5 taxonomy parents, 20 archives | 1-column, card text wraps | 2-column or 1 per breakpoint | 2-column archives | CSS rules present | Mobile/tablet browser screenshots |
| P1 | FAQ, pricing table and long internal-link lists | FAQ fits, price table scrolls **within** region | Cards/columns don't clip | Full table/readable content | Shared CSS implemented | Click, scroll, verify accessible keyboard |
| P1 | Header navigation, expanded mobile menu, 4-column footer | No overlap, links accessible | Menu breakpoint 1120px | Two-row utility nav, full links | Latest independent navigation **DEPLOYED** | Touch/keyboard interaction QA |
| P1 | Hero illustration, media, article TOC/reading controls | Images stay within viewport | No overlaps | Controls not obscure content | Media max-width guards in CSS | Browser visual QA |
| P2 | Contrast, line lengths, heading wraps, tap targets | ≥44px interactive targets where practical | Clear line lengths | Clear editorial rhythm | Partially CSS-guarded | Accessibility/visual review |
| P2 | LCP, INP, CLS, reduced motion | Test under network throttling | Test | Test | Not measured | Real-device/Lighthouse checks |

## Automated gates

- `scripts/qa-responsive.mjs` verifies the responsive declarations and gutter algebra at 320, 360, 375, 390, 768, 1024, 1440 CSS px.
- Added a **full generated-output guard** for all 334 sitemap pages: canonical/viewport/stylesheet/main/footer, one H1, all 300 article reading wrappers and all 13 pillar reading sections. This is not the same as physically rendering all devices.
- `site-qa.yml` now runs `node scripts/qa-responsive.mjs` on pull requests and on pushes affecting source/CSS/JS.
- Existing Factory, taxonomy and SEO acceptance checks must stay green. No bulk article modifications.

## Acceptance / deployment checklist

1. PR checks pass (site build, SEO, Factory, 334-page responsive static checks).
2. Browser geometry at 375px for home, FAQ, privacy and an article: first SEO paragraph has **left ≥20px and right inset ≥20px**, and `documentElement.scrollWidth <= innerWidth`.
3. Repeat at 768px (≥20px inset), and 1440px (centered, no overflow); verify pricing scroll, 404, header/footer and navigation.
4. Check at 320px if available (font scale, brand header, button wrapping); screenshot no clipping.
5. Preserve 300 published IDs, 12 historical HOLD entries, all existing SEO metadata and routes.
6. If regression occurs, revert only the matrix/QA PR separately from the already published responsive CSS.

**Transparency:** Source-level guards can confirm template invariants, not visual pixel geometry. A post-deploy Browser Use run ended before returning measurements, so *physical post-deploy browser acceptance is still pending*; do not mark it as visually approved without independent evidence.
