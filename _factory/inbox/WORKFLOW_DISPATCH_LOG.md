# Spanish Factory — approved 300-article completion

The 12 legacy HOLD slots remain excluded. ES-0301–ES-0312 are independent, mapped replacement topics on the existing 312-row plan. The 300-article production target does not mean deleting or releasing HOLD entries.

Batch dispatcher: after each verified Factory run, this file is updated to trigger the next 3-article GitHub Action without changing editorial records. This is necessary because GitHub's built-in GITHUB_TOKEN commits do not themselves start a second push-triggered workflow.

Execution 1: process planned drafts ES-0304, ES-0305 and ES-0306. Before advancing, verify <300 articles, green build/SEO checks, no protected HOLD publication, and no existing conflict.

Execution 1 verified: ES-0304..ES-0306 published, state 294/300, last run 2026-10-13T18:49:03.222Z.

Execution 2: process planned drafts ES-0307..ES-0309 (VND payments, expense breakdown, Nội Bài to Long Biên transfers). Continue only after Factory QA passes.

Execution 2 verified: ES-0307..ES-0309 published; state 297/300; last run 2026-10-13T18:49:32.458Z.

Execution 3: process planned drafts ES-0310..ES-0312 (rail stations, accessibility, overnight-flight fatigue). The twelve historical HOLD slots must remain unpublished. Goal exactly 300 unique published articles.
