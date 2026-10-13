# Spanish editorial factory: post-batch checkpoint — 2026-10-14 (ICT)

Repository: `thuexemayhanoi/spanish` / branch `main`; production: https://es.rentbikehanoi.com/.

## Verified state at checkpoint

- Published unique article IDs: **288** / commercial/editorial target: **300**.
- This session added and factory-accepted **ES-0287 through ES-0300** (14 original Spanish supporting articles, at least 1,000 words in intro + sections each).
- Factory: `enabled=true`, `blocked=false`, `last_error=null`.
- Writer queue: `PLAN_EXHAUSTED` with 12 unavailable slots. This is intentional quarantine, not proof that target=300 has been reached.
- Last accepted editorial batch: ES-0300; source: `data/factory-state.json`.

## Remaining 12 quarantine IDs

`ES-0089, ES-0090, ES-0091, ES-0092, ES-0093, ES-0095, ES-0096, ES-0097, ES-0098, ES-0099, ES-0234, ES-0254`.

The 10 ES-0089..ES-0099 entries primarily vary rental *duration* and carry likely overlapping commercial search intent. The other two concern collection locations and could imply service-area promises without operational confirmation. They must not be blindly released into the writer queue.

## QA and architectural safeguards

- `scripts/factory.mjs` explicitly validates twelve quarantined IDs and refuses to publish them.
- `scripts/qa-candidate-review-a6.mjs` freezes 270 A6 records, their identities, and the twelve historical HOLD decisions.
- `scripts/qa-growth-a4-a6.mjs` asserts a 300-slot historical matrix with 30 original entries plus 270 candidates.
- `site/taxonomy.json` encodes five parent clusters, 20 children, and 300 editorial planning slots.
- Do not remove, weaken or bypass these guards to manipulate the article counter. A safe expansion needs a separately reviewed replacement matrix, unique intents, consistent taxonomy quota, preserved historical A6 audit trail, then technical change + CI regression checks before publication.

## Suggested next execution

1. Collect verified search-intent and topical-gap evidence for twelve **genuinely distinct replacement topics**, rather than multiplying articles by rental duration or fabricating pickup coverage.
2. Prepare an explicit frozen-A6-compatible replacement plan on a feature branch, with diffs, a QA contract, and rollback instructions. Maintain production URLs and NAP.
3. Produce drafts with original value, verifiable facts/sources, 1,000–5,000 words, FAQ, and valid contextual links. Review factual claims and plagiarism risk before accepting.
4. Run complete `site-qa.yml`, `article-factory.yml`, taxonomy, cannibalization, and live GitHub Pages validation; only then merge and publish.
5. Keep the 12 HOLD entries as historical evidence until the replacements are validated; **288/300 is the truthful current production count**.

This document records a conservative safe-stop; it is not permission to override the existing editorial protections.
