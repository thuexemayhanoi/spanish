# A1–A3 /spanish — SEO taxonomy implementation

Approved scope only: **A1** central taxonomy, **A2** classify 30 topics / five accepted articles, **A3** category navigation and conditional archive pages. No content rewrites, redirects, canonical/URL changes, or automatic contextual internal-link SEO actions (A4–A6 remain pending).

- `site/taxonomy.json` defines **five parent groups and 20 child groups** with **300 planned-capacity slots**. These are not 300 published articles.
- `data/editorial-plan.json` has `parent_id` and `category_id` on the 30 existing rows. `id`, `hub`, `slug`, `url`, `title`, `intent` remain unchanged. Five existing articles are associated with categories without moving their URLs.
- `scripts/taxonomy.mjs` validates assignments and renders the dropdowns, article category link, and grouped parent hub articles from configuration (not per-page copy/paste).
- Each of five parent dropdowns lists four child groups. Empty groups appear as inactive **Próximamente** labels, never broken links. Existing active categories link to their parent's on-page section.
- Child archives `/categorias/{parent}/{child}/` are created only after **5 accepted articles** in that category. Category hubs `/zonas-de-hanoi/` and `/rutas-y-movilidad/` are held back until relevant articles are actually published. New pages get canonical + sitemap only when generated.
- CSS is shared in `assets/css/theme.css`; mobile native `details` menus require no new dependency.
- Test: `node scripts/build.mjs --check && node scripts/qa-factory.mjs && node scripts/qa-taxonomy.mjs && node scripts/seo-audit.mjs --mode=offline`.
- Existing Content Factory workflow, writer queue, content, status **PAUSED** and SEO Monitoring workflow are retained.

Before production, compare original 17 sitemap URLs, Google verification, LocalBusiness schema, articles and meta. Preview branch generator tests are removed before merge.
