# SEO Growth Actions A4–A6 — Spanish repository

**Repository:** `thuexemayhanoi/spanish`  
**Website:** https://es.rentbikehanoi.com/  
**Authorization:** A4 Internal Link Matrix, A5 Cannibalization Assessment, A6 Editorial Content Gap Candidate Research.  
**Production safety:** A4 implemented ten approved contextual links in the shared generator and generated HTML; A5/A6 remain planning/review artifacts. Existing URL, title, canonicals, 17-page sitemap, five published posts, paused Content Factory, and existing 30-row Editorial Matrix remain unchanged.

## A4 — Content-level internal link graph

- Inventory: **17 actual published HTML pages** (12 site foundation pages + five long-form posts).
- Each of the five published articles receives **one distinct inbound link in page body**, from the guide hub; header/footer links deliberately excluded from that figure.
- **5 KEEP LINK** — preserve hub → ES-0001..0005.
- **10 ADD LINK IMPLEMENTED** — two contextual links added per published article, exact H2, approved anchor and URL; PR #8 / commit 021ab9e7, QA PASS, production HTTP 200.
- **2 CHANGE ANCHOR NOT EXECUTED** — homepage model-card anchor changes remain unapproved and untouched.
- **0 REMOVE LINK** — no clearly irrelevant or broken relationship established.
- Full graph and action details: `data/internal-link-matrix-a4.json`.
- **Approval gate:** Owner approved and A4 completed exactly 10 contextual links. Only the two homepage anchor changes remain pending separate approval.

## A5 — Full published cannibalization review

- Inventory: five published articles and their primary page/hub relationships, in a 17-URL site.
- **1 medium-risk hypothesis:** `/guia-de-alquiler/` (pillar/navigation intent) vs `/guia-de-alquiler/pasos-para-alquilar-una-moto/` (detailed procedural intent).
- **4 low-risk hypotheses:** general procedural guide versus price/contract/delivery and errors versus inspection.
- **0 verified competing Google queries**: connected GSC integration still lacks this Spanish property.
- KEEP **5/5 published posts**. MERGE **0**, REWRITE **0**, REDIRECT **0**, TITLE CHANGE **0**. Distinct editorial focus is a recommendation, not an implemented rewrite.
- Full evidence and hold conditions: `data/cannibalization-watchlist-a5.json`.

## A6 — Content gap research for the remaining 270 slots

- Added **270 individual Spanish-language editorial candidates**, IDs ES-0031 through ES-0300, distributed across the existing 20 child-category capacities. Original 30 topic assignments are preserved.
- Source of new proposals: editorial gap analysis of the business services, 30-brief plan, taxonomy, and existing five articles. This is *ideation*, **not independently verified search volume or SERP demand**.
- **12 topics flagged `HOLD_FOR_INTENT_REVIEW`**: original nine duration variants plus ES-0098 (monthly contract), ES-0234 (Nguyễn Văn Cừ pickup) and ES-0254 (Gia Lâm station); preliminary editorial overlap hypothesis, not proven SERP cannibalization.
- All topics have topic title, keyword hypothesis, category, parent hub/primary URL, prospective URL, funnel/intent guess, proposed incoming/outgoing links, evidence requirements, cannibalization review flag, and **null** keyword volume/difficulty.
- **0 candidates published, 0 candidates added to `data/editorial-plan.json` or writer queue.** Do not treat `target=300` as permission to publish low-value content.
- Candidate data: `data/editorial-candidates-270-a6.json`. Per-ID screening of **270/270**, comprising **258 preliminary-screened / 12 HOLD**, is in `data/editorial-review-270-a6.json` and `docs/A6-EDITORIAL-REVIEW.md`. **110 candidates** require separately approved expansion of factory allowed hubs before queue promotion.

## Why numeric keyword metrics are absent

- GSC SEO Content Planner currently lists other properties, not `https://es.rentbikehanoi.com/`. The assistant cannot determine clicks, impressions, true query-to-URL overlaps, or rank 10 blockers for the Spanish domain.
- Ubersuggest account is connected on a **free tier** but reported **daily report limit reached (HTTP 403)** during Spanish keyword discovery. Upgrading to a paid Ubersuggest tier would increase daily report capacity for immediate research; no paid action was requested or taken. Plan details: https://app.neilpatel.com/en/pricing.
- Semrush available lookup did not accept direct keyword arguments in its discovery call. No Semrush keyword-volume claim is made.
- Local landing page concepts require *actual local visitor value* and verified business service coverage. No fabricated branch office, service area, current restrictions, or delivery coverage.

## SEO priority roadmap and next approval checkpoint

| Priority | Action | Impact | Difficulty | Status |
|---|---|---|---|---|
| P0 | Keep indexed commercial pages stable: `/`, `/precios/`, `/tipos-de-motos/` | High | Low | KEEP |
| P1 | Insert exactly ten approved A4 contextual links within five articles | Medium | Low–Medium | DONE / QA PASS / PUBLISHED |
| P1 | Verify Google Search Console property and key query clusters for cannibalization + CTR | High for evidence | Medium | EXTERNAL AUTH REQUIRED |
| P1 | Research keyword demand/competitors and SERP intent for high-conversion content candidates | High potential | Medium | BLOCKED ON QUOTA / RESEARCH |
| P2 | Verify unique search intent and evidence for 12 HOLDs and remaining 258 candidates | Prevents low-value SEO | Medium | HOLD 12 + 258 PENDING SERP/SOURCES |
| P3 | Publish new article batches only after separate user authorization and source QA | Variable | Medium–High | FACTORY PAUSED |
| DEFER | Authority, local citations and backlinks | Longer term | Medium–High | OUTSIDE A4–A6 |

**Final guard:** The authorized A4 ten-link implementation and A6 preliminary 270-topic screening are complete. No additional article has been published; do not promote candidates, change the 30-row editorial plan, expand factory hubs or approve the two outstanding anchor changes without new authorization.
