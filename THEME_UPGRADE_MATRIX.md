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
| P1-04 | P1 | Premium mega footer | Verified NAP/links, responsive columns and back-to-top; branch + PR QA passed; manual iPhone verification pending | IMPLEMENTED / CI PASS (NOT DEPLOYED) |
| P1-05 | P1 | Homepage/editorial layout | Featured published articles and taxonomy clusters without changing existing text metadata | TODO |
| P1-06 | P1 | Category archive experience | Intro, category grouping and pagination; threshold for empty/low-content archives retained | TODO |
| P2-01 | P2 | Result and 404 pages | 404 premium recovery on technical branch, stable across article count; search results still missing | 404 CI PASS / SEARCH TODO |
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


## Checkpoint — additional theme batch (2026-10-14 ICT)

### Refreshed state and parallel-work safety

- Verified current production `main` at `67bde7ce26396353f855c7573085bbaed3b3968d`: **300 published articles**, Factory `TARGET_REACHED`. Production may advance; re-fetch before proposing a merge.
- Existing Draft PR #12 and this branch were opened before the final article runs, when the branch held **291** articles. It is **behind `main`**; do not merge without safe reconciliation and a complete post-rebase QA. In particular do not overwrite the nine most recent published articles.
- `AGENTS.md` absent in original main; created theme-scoped file on this branch to preserve operational boundaries, not editorial content.
- No WordPress/API migration, Writer trigger, NAP change, existing URL change, generated HTML regeneration, sitemap change, or production deployment was performed in this checkpoint.

### AgentMarkup audit (source inspection, not package installation)

- Custom Node `scripts/build.mjs` owns final generated HTML. The suggested AgentMarkup adapter is `@agentmarkup/cli` **post-build**, not Vite/Astro/Next, because no `package.json` or framework build layer exists.
- Existing HTML has meaningful Spanish text, `lang="es"`, canonical tags, Google verification meta, HTML breadcrumbs, structured data including LocalBusiness and Article, sitemap and `robots.txt`; preserve them.
- `llms.txt` and `_headers` are absent; markdown mirrors are optional because the final HTML is substantive. No AgentMarkup packages installed, no `agentmarkup check` executed, no AI user-agent audit run.
- Introducing `llms.txt`, a discovery `<link>`, Content-Signal, new AI-crawler policies or markdown mirrors changes the site's SEO/machine-readable surface; **separate explicit approval required**. Do not emit an A2A Agent Card without an actual agent service.

### Browser Use production-only visual audit

Read-only at 1512px desktop / 390px mobile; production baseline had no observed horizontal overflow, a functioning mobile menu and valid breadcrumb landmarks.

| Priority | Observation | Evidence / guard |
|---|---|---|
| P2 | Site search absent; `/?s=vision` shows normal homepage; `/buscar/?s=vision` is 404 | Design a static bounded/sharded search index first; do not create a new public route without SEO/URL review |
| P2 | Card labeled “Motos semiautomáticas” points to `/precios/` rather than a matching vehicle hub | Internal-link destination change requires SEO approval |
| P3 | Live 404 has no header/footer/search recovery (only home link) | Generator change would require complete HTML regeneration and validation |
| P3 | Footer fragments appear concatenated on mobile | New footer spacing styles and jump link committed; markup-level text separation still needs generated build |
| P3 | Mixed taxonomy archive and silo URL families | Preserve URLs; assess SEO separately rather than redirect/rename |

All are production baseline findings: code on the unmerged branch is **not a live fix**.

### New branch commits and scope

| Commit | Feature | Files | Verification |
|---|---|---|---|
| `db26aa9e097007af12f5adb8ff9f2d88c47785fb` | P1.04 premium footer typography, mobile grid, focus contrast | `assets/css/theme.css` | CI pending |
| `a00c079f5a552b996e539758670a0ed73bea9218` | Non-article Back to Top, footer jump link, lightweight sticky shadow | `assets/js/app.js` | CI pending |
| `f4928fbcd098b9fe554ef97c1a464a70402234cf` | Automated source regression assertions for P1.04 | `scripts/qa-theme.mjs` | CI pending |
| `29596c1b0a0bdb8181dec5fe7c7ff841e74ecdb9` | Safe contributor/agent guard and rollback contract | `AGENTS.md` | Documentation only |

### Next guarded batches

1. Verify branch-specific and Draft PR Actions QA after these commits. If CI fails, fix on this branch, never on `main`.
2. Sync **from current `main` into the technical branch only** after diff review (no Writer, no production deploy) and preserve all 300 accepted articles and A6 safeguards.
3. Design P1 search with lazy bounded shards and test keyboard/no-JS behavior. Do not load tens of thousands of full articles client-side.
4. Implement header/footer/404 generator markup in a separate batch with complete regeneration of all derived HTML and careful canonical/title/schema diff.
5. Manually preview 390px / 768px / 1024px / desktop, perform WCAG 2.2 AA contrast/keyboard and Lighthouse checks, and benchmark scale before claiming a 40k-ready system.

**Status:** theme upgrades remain **unmerged and un-deployed**. P1.04 is implemented on branch but not accepted until CI and browser preview.


### Batch acceptance — premium 404 and new CSS/JS (2026-10-14 ICT)

- Footer style `db26aa9`: [Theme QA run #9](https://github.com/thuexemayhanoi/spanish/actions/runs/38451875593) PASS.
- Global Back to Top `a00c079`: [Theme QA run #10](https://github.com/thuexemayhanoi/spanish/actions/runs/38451943610) PASS.
- P1.04 regression assertions `f4928fb`: [Theme QA run #11](https://github.com/thuexemayhanoi/spanish/actions/runs/38452064830) PASS and [PR Site QA run #58](https://github.com/thuexemayhanoi/spanish/actions/runs/38452072909) PASS.
- First generated-404 change `dfe98a1`: technical-branch QA passed but PR merge-ref QA found `STALE 404.html`, because menu counts differed between the 291-article theme branch and 300-article `main`. Treat these prior failed runs as real findings, not evidence of success.
- P2 404 correction `4569fd11a92428e03929e0ff98ee76b0f645105d`: made the fallback navigation independent of article counts, kept `noindex,follow`, preserved one H1, reused existing site footer, and linked only to verified pages. The generator and generated `404.html` were committed together atomically. [Theme QA run #16](https://github.com/thuexemayhanoi/spanish/actions/runs/38453114892) **PASS** and [PR Site Build QA run #64](https://github.com/thuexemayhanoi/spanish/actions/runs/38453122386) **PASS**.
- `scripts/qa-theme.mjs` protects the 404 navigation, H1, noindex, crawl-safe links, and shared footer.
- 404 before/after source length **448 B → 3,803 B** (generated HTML); layout renders with shared CSS and mobile controls. **Branch preview screenshot is not verified**, so do not assert visual parity or WCAG conformance.
- `main` remains unchanged. Existing article paths/structured data/nap/sitemap were not modified; `AGENTS.md` protects handoff and Writer separation.

### Remaining approval gates / unresolved technical work

- **Branch synchronization:** P0 branch was based on an earlier 291-article snapshot, whereas current main has 300. Both PR CI runs pass, but branch must still be safely reconciled before any merge. Never let the merge delete nine new articles or change Factory state.
- **Search:** no true site search at `/?s=` or `/buscar/`. Requires sharded lazy search architecture and separately reviewed search route/metadata; not DONE.
- **Misrouted homepage CTA:** “Motos semiautomáticas” currently points at `/precios/`. Internal-link change awaits SEO approval, so left untouched.
- **Homepage featured, hub pagination, pillar/sidebar, mega-menu item curation, metadata/AgentMarkup CLI, Core Web Vitals, 40k article benchmark:** pending. No claims of real-world 40k scale or WCAG 2.2 AA certification.

Rollback on this unmerged branch: revert `4569fd11` to undo the premium 404, `a00c079` for back-to-top and `db26aa9` for footer styling. Run the same branch and full PR tests; do not revert production `main`.
