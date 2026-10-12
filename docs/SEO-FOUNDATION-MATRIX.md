# SEO Foundation Matrix — /spanish (Phase 1)

**Audited:** 2026-10-12  
**Repository:** `thuexemayhanoi/spanish` (production `main`)  
**Canonical domain:** https://es.rentbikehanoi.com/  
**Scope:** Audit of the 12 existing foundational pages **before** scaling to 300 Spanish-language articles. `thuexemayhanoi/web` is read-only.

## Evidence and status

| ID | Priority | Item | Status | Evidence / next action |
|---|---|---|---|---|
| SEO-01 | P0 | HTTP availability | **PASS** | All 12 live sitemap URL paths returned HTTP 200 on 2026-10-12. |
| SEO-02 | P0 | robots.txt | **PASS** | HTTP 200, `User-agent: *`, `Allow: /`, contains the canonical sitemap URL. |
| SEO-03 | P0 | XML sitemap | **PASS** | HTTP 200, 12 distinct URLs using only `https://es.rentbikehanoi.com/`. Every expected site page covered. |
| SEO-04 | P0 | Canonical and indexability signals | **PASS (technical)** | 12/12 HTML pages expose a self-referencing canonical, `<html lang="es">`, `index,follow`, and one H1. Technical crawlability does not prove Google indexing. |
| SEO-05 | P0 | Google indexing / URL Inspection | **NOT VERIFIED** | The connected Search Console account did not list a property for `https://es.rentbikehanoi.com/` at audit time. Verify the URL-prefix property and submit `/sitemap.xml` before claiming index status. A public `site:` search returned no indexed results at the time; this alone is not authoritative. |
| SEO-06 | P1 | Structured data | **PASS (syntax), ENHANCEMENT IDENTIFIED** | JSON-LD parses on checked HTML. Site-wide `Organization`, `WebSite`, `WebPage`; `BreadcrumbList` on inner pages; `FAQPage` with 20 matching FAQ questions. Consider a `LocalBusiness` entity using *verified* address/phone/09:00–21:00 hours. Do not invent coordinates, ratings, review counts or rich-result eligibility. |
| SEO-07 | P1 | Core Web Vitals / Lighthouse mobile | **PENDING MEASUREMENT** | Google PageSpeed API responded HTTP 429 (quota exceeded). Browser interaction also timed out. No credible LCP/INP/CLS or performance score measured; retry PSI/Lighthouse when available. |
| SEO-08 | P1 | Static asset footprint | **PASS (static inspection only)** | Primary CSS ~8,903 characters; JavaScript ~1,111 characters; HTML home ~10,252 characters. No external CDN/font asset references detected in those files. This is not a substitute for a mobile real-user or Lighthouse test. |
| SEO-09 | P2 | Shared-source design / SEO | **PASS** | `site/data.json`, `assets/css/theme.css`, and `scripts/build.mjs` are the common sources. Keep central generation of canonical, sitemap, navigation and JSON-LD for all later articles. |
| SEO-10 | P2 | International SEO | **DEFERRED** | `hreflang` should only be configured when actual equivalent translated URLs and reciprocal links are verified across languages; do not infer pairs from other repositories. |

## Verified URLs

```
/
 /sobre-nosotros/
 /tipos-de-motos/
 /tipos-de-motos/scooters/
 /tipos-de-motos/motos-50cc/
 /precios/
 /guia-de-alquiler/
 /guia-de-alquiler/documentacion-y-deposito/
 /faq/
 /contacto/
 /politica-de-privacidad/
 /terminos-y-condiciones/
```

## Priority actions

1. **P0 — Search Console**: add/verify the URL-prefix property `https://es.rentbikehanoi.com/`. Submit `https://es.rentbikehanoi.com/sitemap.xml`. Use URL Inspection for home, price, FAQ and one silo page; capture whether indexed, discovered/crawled and selected canonical.
2. **P1 — Mobile performance**: run PageSpeed Insights mobile for homepage and representative article/hub after Google quota recovers; document Lighthouse score, FCP, LCP, CLS, TBT (lab) and INP where field data is available. Do not make up scores.
3. **P1 — Structured data enhancement**: consider `LocalBusiness` in the shared generator using only established NAP, Maps URL and hours. Validate generated graph on multiple pages.
4. **P2 — Regression gate before 300 articles**: check sitemap URL counts, canonical self-reference, duplicate titles, broken internal links, 404 index policy, mobile layout, and JSON-LD after every batch.

## Strict protection

- Only `thuexemayhanoi/spanish` may be modified in this workstream.
- Never change the production hostname, `CNAME`, existing URL paths, reference pricing, deposits, or NAP from unverified assumptions.
- Avoid publishing placeholder articles or declaring the 300-article factory complete on the basis of this Phase 1 audit.
- Phase 1 checks are **complete where measurable**, but SEO-05 and SEO-07 remain unresolved pending live external evidence.
