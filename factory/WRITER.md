# Spanish Article Factory — writer contract

Repository: **thuexemayhanoi/spanish**, domain: **https://es.rentbikehanoi.com/**. Do not modify /web.

Read `data/writer-queue.json`; produce only queued drafts inside `_factory/inbox/ES-XXXX.json`. Stop on PAUSED, BLOCKED, PLAN_EXHAUSTED or TARGET_REACHED.

**Required JSON fields:** `id`, `title`, `description`, `h1`, `intro`, `sections`, `faq`, `related`, `source_urls`, `status`.

- `sections`: array of objects `{"heading":"...","paragraphs":["...","..."]}`. At least four sections, each with two substantial paragraphs. Editorial text 1,000–5,000 words, excluding shell/navigation.
- Unique Spanish title 30–95 characters, meta description 100–190 characters, original H1 and meaningful introduction.
- `faq`: array of `{"question":"...","answer":"..."}`, up to eight relevant pairs, or empty.
- `related`: 2–8 internal URLs **already published** (e.g., `/precios/`, `/faq/`). No links to planned pages.
- `source_urls`: real, verified HTTPS references; at least one for legal/licensing/insurance articles. Sources must support claims and be checked, not invented.
- `status`: exactly `READY_FOR_QA`.
- Do not change factory state, code, sitemap, site configuration or shared components.
- Never invent deposits, availability, discounts, delivery charges, licenses, personal experiences or reviews. Use `site/data.json` for factual business information.
- No bulk translation from English /web. Every article must satisfy a distinct search intent and provide substantial original value.

**Sample skeleton (NOT publishable because it lacks 1,000 words):**

```json
{"id":"ES-0001","title":"Un título español real con una extensión adecuada","description":"Una descripción realmente útil de por lo menos cien caracteres sobre el artículo y sus preguntas principales.","h1":"Encabezado relevante para lectores","intro":"Introducción original y detallada de más de noventa caracteres para explicar el propósito de la guía al usuario.","sections":[{"heading":"Sección principal","paragraphs":["Párrafo real de más de noventa caracteres con información comprobada y útil para lectores.","Segundo párrafo contrastado de más de noventa caracteres con detalles útiles y no repetidos."]}],"faq":[],"related":["/precios/","/faq/"],"source_urls":[],"status":"READY_FOR_QA"}
```

Workflow passes structural QA, not a guarantee of editorial quality, source validity or Google rankings.