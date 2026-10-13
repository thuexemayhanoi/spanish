# THEME UPGRADE MATRIX — Spanish Blue Titanium

> Technical branch: `theme/spanish-premium-p0-20261014` • Target repo: `thuexemayhanoi/spanish` • Production: https://es.rentbikehanoi.com/  
> Baseline main HEAD: `071aee9b82b45d1182c45d8cccac78333aa9c7a9` • Started: 2026-10-14 ICT  
> **NO MERGE / NO PRODUCTION DEPLOY / NO WRITER TRIGGER** without separate user approval.

## Scope and initial read-only audit

- Framework: dependency-free Node.js 22 static-site generator (`scripts/build.mjs`), HTML generated into repository, GitHub Pages. No React/WordPress/runtime API.
- Existing: 288 published Spanish articles; 12 editorial HOLD slots must stay protected. Source of truth: `data/editorial-plan.json`, `data/factory-state.json`, `site/data.json` and `site/taxonomy.json`.
- Current CSS: `assets/css/theme.css`; JS: `assets/js/app.js`. Two breakpoint rules govern mobile navigation: CSS switches at 1120px, while JS closes on resize above 760px. This is a reproducible logic conflict for 761–1120px.
- Existing design: Blue Titanium / light+dark, responsive hero/cards, five parent taxonomy `details` menus, accordion-style mobile menu, taxonomy archives; existing footer has three columns with NAP and legal links.
- Gaps: no on-site search or results route; no article TOC or reading progress, no back-to-top, small 404, no article pagination, no scale-safe search indexing, no benchmark at 10k–40k.
- Architecture constraint: changing markup in `scripts/build.mjs` requires regeneration and review of **all** derived HTML/sitemap; source-only CSS/JS changes do not alter title, URL, meta, canonical or NAP.
- Original `AGENTS.md`: absent at main root (404); no instructions were inferred.
- Repository work must remain on this branch, not `main`; workflows `article-factory.yml`, `site-qa.yml`, `seo-audit-monitor.yml` are read-only/protected by scope.

## Prioritized implementation matrix

| ID | Priority | Feature / defect | Evidence or acceptance requirement | State |
|---|---|---|---|---|
| P0-01 | P0 | Responsive nav breakpoint conflict | CSS 1120px vs JS 760px; mobile panel must work at 768/1024px and collapse at desktop width | IN PROGRESS |
| P0-02 | P0 | Keyboard / touch navigation safety | Escape closes correct panels, outside click closes stale details, focus-visible, ARIA sync, no dead menus | TODO |
| P0-03 | P0 | Shared accessible design tokens | Preserve Blue Titanium; spacing, radius, shadows, logical focus styles, reduced motion, minimum 44px targets, contrast review | TODO |
| P0-04 | P0 | Content + SEO immutability guard | No changes to canonical, URL, title, H1, robots, sitemap, NAP, editorial/Factory files in theme-only batch | TODO |
| P0-05 | P0 | Browser/CI regression | Node syntax and static checks; PR QA, manual desktop/mobile QA, screenshots and rollback evidence | TODO |
| P1-01 | P1 | Premium header/menu layout | Multi-column sections only for live taxonomy groups; no dead links or new phantom URLs | TODO |
| P1-02 | P1 | Search | Static, bounded per-category/paginated index; progressive enhancement and a true no-JS fallback | TODO |
| P1-03 | P1 | Article navigation | TOC from existing H2; reading progress; related links, accessible semantics | TODO |
| P1-04 | P1 | Premium mega footer | Reuse verified NAP, About, Privacy, Terms and published hub links; mobile column stacking/back to top | TODO |
| P1-05 | P1 | Homepage/editorial layout | Featured published articles and taxonomy clusters without changing existing text metadata | TODO |
| P1-06 | P1 | Category archive experience | Intro, category grouping and pagination; threshold for empty/low-content archives retained | TODO |
| P2-01 | P2 | Result and 404 pages | SEO noindex search results; 404 recovery, no fictitious links | TODO |
| P2-02 | P2 | Article and pillar layouts | Reading measure, sidebar, credibility UI, author verified from existing site data | TODO |
| P2-03 | P2 | Performance pass | CSS budgets, no layout shift, no render-blocking resources, iPhone CWV | TODO |
| P2-04 | P2 | SEO/AEO/GEO QA | Preserve schema & local entity data; validate breadcrumb, internal links and Article metadata | TODO |
| P3-01 | P3 | Scale architecture | Build-size benchmark at 1k/10k/40k; pagination/index sharding, peak memory + build time | TODO |
| P3-02 | P3 | Full accessibility audit | WCAG 2.2 AA keyboard/touch/contrast/zoom and screen-reader manual verification | TODO |
| P3-03 | P3 | Cross-device visual QA | iPhone Safari, tablet and desktop screenshots compared to baseline | TODO |

## Batch protocol & safety

1. Audit new `main` HEAD and branch HEAD; never rewrite work from parallel agents.
2. Limit each commit to one related feature family. Push to **this branch only**.
3. Tests must include syntax and `site-qa` on PR, plus HTML/SEO comparison if generator changes. Changes to writer/controller, plan, published articles, NAP, URLs or production require separate approval.
4. Commit stable checkpoints here, including SHA, tests and unresolved items. Never mark DONE without verified test evidence.
5. Do not assert that scaling to 40,000 posts has been proven until measured.

## Checkpoint / rollback

- Baseline: `071aee9b82b45d1182c45d8cccac78333aa9c7a9`.
- Work branch: `theme/spanish-premium-p0-20261014`. Roll back a batch with `git revert <batch-sha>` **on the technical branch**, or abandon the branch. Production `main` remains unaffected.
- Live confirmation, QA pass, benchmark and feature-by-feature status must be appended after execution (not inferred from merely committing).
