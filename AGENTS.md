# AGENTS.md — Spanish theme technical branch

Scope: `thuexemayhanoi/spanish`, GitHub Pages at `https://es.rentbikehanoi.com/`. This document defines a safe workflow for **theme-only** editing; it does not authorize publishing or modifying editorial content.

## Source ownership

- The final HTML is authored by zero-dependency Node 22 generator `scripts/build.mjs`; HTML, breadcrumbs, JSON-LD, sitemap and `robots.txt` are derived output.
- Design source is `assets/css/theme.css`; interaction source is `assets/js/app.js`; business identity is curated in `site/data.json`.
- Theme QA: `scripts/qa-theme.mjs` and existing `.github/workflows/theme-branch-qa.yml`; Writer uses the **separate** `scripts/factory.mjs` / `.github/workflows/article-factory.yml`.

## Protected boundaries

1. Never merge or deploy to `main` without specific user approval. Work only on the technical branch and Draft PR.
2. Never edit the 300 accepted article JSON files, editorial plan/state/queue, frozen historical A6 HOLD entries, Factory ownership, NAP, prices, or public URL/canonical/slug for a theme task.
3. Do not enable Writer, dispatch Factory process/resume, or create unapproved pages for search or taxonomy.
4. Before a theme edit, refresh **both** branch HEAD and `main` HEAD. Preserve parallel writer/agent commits and avoid forced branch updates.
5. If a generator edit changes rendered HTML, regenerate **all** affected pages, compare SEO metadata and run complete site QA. Do not commit a source-only generator change that makes `node scripts/build.mjs --check` fail.
6. Keep technical UI improvements progressive: full content and navigation remain available without JavaScript; avoid indexing all article bodies in the client. Search architecture needs a bounded, sharded index and benchmarking before claims about 10k–40k posts.
7. For AgentMarkup, the final-output owner is the custom Node generator; prefer CLI postbuild **after explicit metadata-change approval**. Preserve existing JSON-LD, `robots.txt`, canonical, and structured data; no A2A agent card without a real service.

## Branch-only checks

```sh
node --check assets/js/app.js
node --check scripts/build.mjs
node --check scripts/qa-theme.mjs
node scripts/build.mjs --check
node scripts/qa-factory.mjs
node scripts/qa-taxonomy.mjs
node scripts/qa-growth-a4-a6.mjs
node scripts/qa-candidate-review-a6.mjs
node scripts/qa-approved-links-a4.mjs
node scripts/qa-theme.mjs
node scripts/smoke-factory.mjs
```

If full local repository checkout is unavailable, use GitHub Actions branch QA and label manual browser/Lighthouse checks as not yet verified. Never report DONE based only on code existing.

## Release and rollback

Work in small independent commits and log evidence in `THEME_UPGRADE_MATRIX.md`. Revert the relevant branch commit or discard the unmerged Draft PR to roll back. Do not force-push or rewrite the production history.
