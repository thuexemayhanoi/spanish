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
| P0-01 | P0 | Responsive nav breakpoint conflict | Matched CSS 1120px / JS min 1121px; automated guard PASS, tablet hands-on preview still needed | IMPLEMENTED / QA PASS |
| P0-02 | P0 | Keyboard / touch navigation safety | Escape, exclusive open, outside click, focus and aria-expanded implemented; manual keyboard + SR testing pending | IMPLEMENTED / QA PASS |
| P0-03 | P0 | Shared accessible design tokens | Blue Titanium, new spacing/shadow/link/focus tokens, 44px targets, 390px footer spacing; full contrast sweep pending | IMPLEMENTED / QA PASS |
| P0-04 | P0 | Content + SEO immutability guard | Branch diff limited to CSS/JS, read-only QA, docs and output-neutral build lookup refactor; --check confirms generated HTML unchanged | QA PASS |
| P0-05 | P0 | Browser/CI regression | Branch Action and GitHub PR #12 Site Build QA both PASS; production desktop/mobile baseline checked; branch preview/Lighthouse/manual accessibility pending | PARTIAL / CI PASS |
| P1-01 | P1 | Premium header/menu layout | Multi-column sections only for live taxonomy groups; no dead links or new phantom URLs | TODO |
| P1-02 | P1 | Search | Static, bounded per-category/paginated index; progressive enhancement and a true no-JS fallback | TODO |
| P1-03 | P1 | Article navigation | Progressive TOC, scroll progress, back-to-top via JS/CSS without generator HTML change; browser acceptance pending | IMPLEMENTED / CI PASS |
| P1-04 | P1 | Premium mega footer | Reuse verified NAP, About, Privacy, Terms and published hub links; mobile column stacking/back to top | TODO |
| P1-05 | P1 | Homepage/editorial layout | Featured published articles and taxonomy clusters without changing existing text metadata | TODO |
| P1-06 | P1 | Category archive experience | Intro, category grouping and pagination; threshold for empty/low-content archives retained | TODO |
| P2-01 | P2 | Result and 404 pages | SEO noindex search results; 404 recovery, no fictitious links | TODO |
| P2-02 | P2 | Article and pillar layouts | Reading measure, sidebar, credibility UI, author verified from existing site data | TODO |
| P2-03 | P2 | Performance pass | CSS budgets, no layout shift, no render-blocking resources, iPhone CWV | TODO |
| P2-04 | P2 | SEO/AEO/GEO QA | Preserve schema & local entity data; validate breadcrumb, internal links and Article metadata | TODO |
| P3-01 | P3 | Scale architecture | Replaced repeated article lookup/duplicate URL scan with Map/Set; no benchmark; other O(N) and index sharding work remains | PARTIAL |
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

## Execution evidence — batch P0 + reader UI (2026-10-14 ICT)

| Workstream | Commit | Verification |
|---|---|---|
| Baseline Matrix | `7f45200532415a375eb9d9a62270ef7b3a0fb8ad` | Audit of 288 published articles at baseline |
| P0 design system | `2af7993f07ddb41f5e24e77c0166383abf18cbf8` | CI source checks passed |
| P0 navigation | `383ae83f9a2bfd3bfe05e1818ec0b179c12cfe4d` | Breakpoint + Escape/ARIA script checks passed |
| P0 read-only theme QA | `4853886c23f111fdeaed6325bd29e2e88d417c8d` | `scripts/qa-theme.mjs` |
| Branch-only QA workflow | `f74f262583e0ba430c369a092b21ad747ad4b2fb` | `theme-branch-qa.yml`: no deployment, no writer dispatch |
| Visual footer fix | `14b6ec87bee843a659797d98889a859af305922d` | Addresses baseline 390px observed footer issue |
| Reader utilities | `31e1ae178f8611fba94352f216d233e4304ac818`, `3940d5625e698e6676e97740ace239f326874b51` | Existing article HTML preserved; manual UX test pending |
| Renderer lookup optimization | `12ad956220f5ca9b67e1dfea29b02238a076136b` | `build.mjs --check` proved identical HTML output |
| Safe main refresh | `3a88cf47a70989bc19b949ac43aecb431191aeb1` | Merge commit retains contemporary Factory source and 3 new published articles |
| Refreshed branch QA | [Run #38449316592](https://github.com/thuexemayhanoi/spanish/actions/runs/38449316592) | **PASS**: 328 generated files / 325 routes / 291 published articles, SEO, taxonomy, historical HOLD and smoke checks |

### Real production baseline audit (not a branch preview)

- Public site at 1440px and 390px had no observed horizontal overflow; 122 sampled internal URLs returned 200.
- Baseline desktop taxonomy menu usable; mobile accordion permitted multiple opened sections. Improved exclusive open logic is implemented on the branch, but not verified visually on a branch preview.
- A 390px footer text collision was observed; CSS fix committed on this branch. Not visible on production until separately approved deployment.
- Article TOC/search/back-to-top were absent on production at inspection time. TOC/back-to-top now exist only on the unmerged branch.
- No claim of WCAG 2.2 AA certification, CWV pass or 40k article support without hands-on/browser and benchmark evidence.

### Concurrent production writer change

Another authorized AI session changed `main` after the baseline by creating 12 replacement assignments while preserving 12 historical HOLDs; it also published 3 articles. Branch was safely merged with that source at `bf2cae3b10a9c02b9e4aae2bbfef4fb5f0851055`, preserving existing factory and generated output. Snapshot after merge: **291 published / 312 planned / 12 protected historical HOLDs**. Other writers may advance `main` again, so refresh before merge.

### Next checkpoint

1. Verify all current branch CI and the full pull-request CI; log any regression.
2. Build a preview without touching production and manually inspect 390px / 768px / 1024px / 1440px keyboard, touch, zoom, contrast, TOC, progress and focus.
3. Plan build-generated mega footer, search index with lazy shards, editorial homepage/hub layouts and readable 404 as separate PR batches; expect many derived HTML diffs if generator markup changes.
4. Benchmark build and search at larger fixture sizes before a 10k–40k claim.
5. **Never merge or deploy without a separate explicit user approval.**

### Rollback (technical branch only)

Revert individual P0/P1 commits in reverse dependency order with `git revert <sha>` on this branch, re-run read-only QA, or close the unmerged draft PR. Production is unchanged by this work.

### Draft PR acceptance checkpoint

- Draft PR (not merge-approved): https://github.com/thuexemayhanoi/spanish/pull/12
- Entire pull-request Site Build QA passed: https://github.com/thuexemayhanoi/spanish/actions/runs/38449525594
- Branch-specific full QA passed after safe main refresh: https://github.com/thuexemayhanoi/spanish/actions/runs/38449316592
- `main` untouched by theme modifications; production remains on existing Pages deployment.
- **Gate**: do not merge without user approval and manual browser preview of the branch.
