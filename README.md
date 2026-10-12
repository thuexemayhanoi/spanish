# /spanish · Blue Titanium

**Domain:** https://es.rentbikehanoi.com/  
**Repo:** thuexemayhanoi/spanish (GitHub Pages)

Spanish-language static SEO site. **No runtime dependencies. Protected editorial factory for up to 300 articles (paused by default).** `CNAME` must remain `es.rentbikehanoi.com`. The reference repo `thuexemayhanoi/web` was read-only.

## Edit once → rebuild everything

- `site/data.json`: single source of truth for NAP, rates, page metadata, visible FAQ, navigation and editorial text.
- `assets/css/theme.css`: global colours (Blue Titanium / black / white), tokens and responsive components.
- `assets/js/app.js`: shared theme preference and keyboard-friendly mobile menu.
- `scripts/build.mjs`: **zero-dependency** generator for every HTML page, shared header/footer, breadcrumbs, canonical tags, JSON-LD, robots and sitemap.

To regenerate, run `node scripts/build.mjs`, review generated diffs, then commit the source **and** generated files. No GitHub Actions added by request. Canonicals/sitemap use only https://es.rentbikehanoi.com/. All prices are indicative; verify model, deposit, delivery and document terms before renting.

Privacy and Terms describe the static code shipped. Review legal text if business operations or data collection change. Real-world mobile screenshot/Lighthouse inspection is recommended after deployment.

## Spanish Article Factory 300

Target: **300 original Spanish supporting articles**, excluding the existing 12 main site pages. The initial editorial matrix contains **30 research briefs**; the remaining 270 slots are unplanned until unique search intent and verifiable sources are established. The factory **does not** call an AI API or create content by itself.

Single source / safe operations:

- `data/editorial-plan.json`: approved assignments and canonical paths.
- `data/factory-config.json`: cap 300, batch 3, 1,000–5,000 words, allowed hubs.
- `data/factory-state.json`: published article IDs and enable/disable switch; **PAUSED by default**.
- `data/writer-queue.json`: next queue generated from unpublished assignments.
- `factory/WRITER.md`: external writer input contract and verification rules.
- `_factory/inbox/ES-XXXX.json`: unpublished drafts; `content/articles/ES-XXXX.json`: accepted articles.
- `scripts/factory.mjs`: status, pause, resume, refresh-queue, process.
- `scripts/build.mjs`: templates, canonical, Article schema, hub index, sitemap, related links.
- `scripts/qa-factory.mjs`: indexability, sitemap, duplicate titles and broken links.
- `.github/workflows/article-factory.yml`: hourly recovery + manual controls; safe stop if main changes.
- `.github/workflows/site-qa.yml`: PR and push QA.

**Activate only after an external writer is ready:** GitHub → Actions → Spanish Article Factory 300 → Run workflow → `resume`. Run `refresh-queue`, produce the first queued JSON drafts and commit them to `_factory/inbox/`. The factory validates up to three drafts per run. It cannot verify facts by itself; manually review researched claims before writer submission.

Local test commands: `node scripts/factory.mjs status`, `node scripts/build.mjs --check`, `node scripts/qa-factory.mjs`. No existing URL or public content is overwritten by unapproved drafts. Do not touch `thuexemayhanoi/web`.
