# Spanish Editorial Matrix 300 · Mistral writer handoff

Scope: **thuexemayhanoi/spanish** only · https://es.rentbikehanoi.com/.

## Truthful state after expansion
- `data/editorial-plan.json` carries **all 300 stable IDs ES-0001 → ES-0300** and existing canonical URLs.
- Historical A6 research remains unchanged: 270 source candidates, **12 HOLD_FOR_INTENT_REVIEW** (ES-0089, 0090, 0091, 0092, 0093, 0095, 0096, 0097, 0098, 0099, 0234, 0254). No unique-content/intent approval has been invented.
- **288 authorable planning slots** (including previously published posts), 12 blocked until rewritten/replaced and separately approved. A full 300 published articles cannot be promised while those 12 remain held.
- 5 parent topics, 20 child categories, category capacity 300; 7 factory hubs now permit taxonomy-backed paths. Empty parent/child indexable archives remain forbidden.
- Factory target=300, batch size=3, hourly controller already exists. No additional GitHub schedule or paid LLM API has been added.
- A historical research status of `PRE_SCREENED_NOT_PUBLICATION_APPROVED` reflects lack of SERP, GSC, source and business-offer verification. Expanded plan entries are editorial *assignments*, not validated search demand or publication approval.

## Mistral operating procedure
1. Pull GitHub **main** fresh; read `factory/WRITER.md`, `data/writer-queue.json`, `data/editorial-plan.json`, `data/factory-config.json`, `data/editorial-review-270-a6.json`.
2. Write **ONLY IDs currently present in `queue`**. Queue may skip some numeric IDs; never assume the next integer is approved.
3. Check whether another writer or Factory run has already claimed/published an ID before writing; avoid races and GitHub stale commits.
4. For every article: original Spanish es-ES, distinct search intent, 1,000–5,000 substantive words, real verified source URLs for legal/license/insurance/50cc, accurate NAP, no fabricated delivery, discount, deposit, availability or personal experience.
5. Put one approved JSON draft per queued ID in `_factory/inbox/ES-XXXX.json`. Factory validates then publishes **max 3** in one batch; push to main may trigger immediate processing; the scheduled hourly workflow only *processes submitted drafts*, it does not write them.
6. When QA fails, read actual GitHub job logs, repair underlying source or generated files, re-run build and QA. Never bypass or disable failed QA or force push.
7. Periodically check progress `data/factory-state.json`, sitemap, Pages deployment, read-only SEO audit, writer source/intent reviews. Report actual published count, not "300 completed" until validated.
8. HOLD IDs: **do not put drafts into inbox**, do not add the held IDs to `queue` or override `status`. Recommend original distinct replacement briefs after SERP and GSC evidence, and obtain owner approval before release.
9. For currently unverified new hubs, use only already published `related` targets in JSON. The first accepted article generates its category parent; do not insert links to nonexistent future archives.
10. No modifications outside repo `/spanish`, no paid API usage without authorization and no extra recurring schedule.

## Approval and QA gates
- `node scripts/build.mjs --check`
- `node scripts/qa-factory.mjs`
- `node scripts/qa-taxonomy.mjs`
- `node scripts/qa-growth-a4-a6.mjs`
- `node scripts/qa-candidate-review-a6.mjs`
- `node scripts/qa-approved-links-a4.mjs`
- `node scripts/smoke-factory.mjs`
- `node scripts/seo-audit.mjs --mode=offline`

Keep original A4 10 approved internal links, original A5 cannibalization baseline and original 270 A6 review hypotheses intact. None of these historical snapshots are live GSC data.
