# SEO MASTER STANDARD — Spanish Flagship

**Repository boundary:** `thuexemayhanoi/spanish` only.  
**Production:** https://es.rentbikehanoi.com/  
**SEO monitoring workflow:** `.github/workflows/seo-audit-monitor.yml` (independent from `article-factory.yml`).  
**Principle:** Edit shared templates/data once; build every page; audit objectively; publish only after QA.

## Nine audit dimensions

| Dimension | Required checks | Monitoring |
|---|---|---|
| 1. Technical SEO | robots, XML sitemap, canonical, index/noindex, HTTP status, 404 | All offline pages; selected public live pages |
| 2. Architecture | Pillar → Hub → Silo → Cluster, breadcrumbs, existing internal links | All committed content and editorial plan |
| 3. On-page SEO | Unique title, meta, H1, OG, HTML language | All committed content |
| 4. Content SEO | Unique ID/URL/primary keyword, editorial intent similarity warnings, source brief | All planned briefs |
| 5. Structured Data | LocalBusiness NAP, WebPage, BreadcrumbList, Article and visible FAQ parity | JSON-LD parse + semantic checks |
| 6. Performance | Mobile viewport, image dimensions, CSS/JS budgets | Static heuristic **only** |
| 7. Accessibility / UX | image alt, mobile-first viewport, semantic headings | Static inspection |
| 8. Analytics | Google Search Console, Bing status, clicks, index coverage | **External integration required**, not fabricated |
| 9. Authority / GEO | sources, real brand references, crawlability, verified links | Editorial/external research needed |

Nine categories are an **audit management matrix**, not nine separate Google ranking factors.

## Workflow ownership and schedule

- **SEO Audit & Monitoring**: daily at **02:23 UTC / 09:23 ICT (Vietnam)**, manual run, and CI on relevant PR/push. Read-only; `contents: read`; never modifies article queues, website code, sitemap, factory state, or main branch.
- **Content Factory**: stays exactly as deployed, **paused** until explicitly resumed by the owner. Writer drafts and batch publishing are controlled exclusively by that workflow.
- New GitHub Actions workflow uploads JSON reports (retained 30 days) and publishes a job summary; failure/warning groups are explicit. QA failure marks the workflow red rather than silently pretending success.
- Manual run: GitHub → Actions → **Spanish SEO Audit & Monitoring** → Run workflow → `offline` or `full`.

## Source-of-truth and reproducible checks

- `site/data.json`: brand NAP, Google verification, page metadata/navigation/FAQ.
- `scripts/build.mjs`: generates shared HTML, JSON-LD, canonical and sitemap.
- `data/editorial-plan.json`: currently **30 researched/planned briefs**, **not 300 real articles**.
- `data/factory-state.json`: authoritative published article IDs (currently 0).
- `data/seo-monitor-config.json`: performance budgets, live sampling and duplicate-intent warning thresholds.
- `scripts/seo-audit.mjs`: read-only validation of the published site and the plan.

Run without extra npm packages:

```bash
node scripts/build.mjs --check
node scripts/qa-factory.mjs
node scripts/seo-audit.mjs --mode=offline --report=seo-offline-report.json
node scripts/seo-audit.mjs --mode=full --report=seo-live-report.json
```

The *offline* audit covers every generated HTML page, including accepted articles as they grow. The *full* audit also fetches production robots/sitemap and a daily rotating **bounded** sample of priority pages; it is **not a 300-page live crawl**. A recent push may take time to deploy on GitHub Pages; run live audit after deployment rather than interpreting deployment lag as a persistent SEO issue.

## Deliberate limitations

1. Google indexing is authoritative only through an authenticated GSC property/URL Inspection. Robots/sitemaps and HTTP 200 mean **crawlable**, not necessarily indexed. The previously connected GSC tools had no `es.rentbikehanoi.com` property; this workflow cannot claim URL Inspection, site submission or GSC click data.
2. Bing Webmaster Tools data is authenticated and independent. HTTP fetching the sitemap is not Bing submission.
3. Performance checks are lightweight static budgets; **no made-up Lighthouse mobile score, LCP, INP, or CLS**. Run Chrome Lighthouse/PageSpeed Insights or collect CrUX/RUM when available.
4. Search-intent similarity is a conservative keyword-token **warning**, not automatic proof of cannibalization. A human should review overlapping briefs.
5. No invented ratings, local reviews, backlinks, branch locations, prices, legal guarantees, or source claims. Each article still needs editorial fact review.
6. Never automatically generate `hreflang` between other-language domains without manually verified equivalent canonical URLs and reciprocal tags.

## Production safety acceptance gate

Before promoting SEO configuration changes: ensure `CNAME` unchanged, no URL/SEO regressions, build `--check` passes, legacy `Spanish Site Build QA` passes, independent audit passes with warnings reviewed, and live Pages deployment verified. The monitor itself must not mutate production.
