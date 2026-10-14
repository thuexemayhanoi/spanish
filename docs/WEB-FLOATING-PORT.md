# Transferencia de botones de contacto y asistente — /web → /spanish
- Source: `thuexemayhanoi/web` — `site/partials/floating-ui.html`, `assets/js/app.js` (floating controls), `assets/js/assistant.js`, floating CSS region.
- Destination: `thuexemayhanoi/spanish`, feature branch `feature/spanish-local-ai-quick-call-20261014`.
- No changes to any of the 300 accepted articles, 334 generated HTML URLs, factory state, canonical, sitemap or structured data.
- Shared `assets/js/app.js` loads `floating-port.js` across all generated pages; this preserves existing HTML/SEO and keeps maintenance centralized.
- Blue Titanium styling overrides web's original orange. Two launchers: Quick Contact lower-left; AI lower-right; iOS VisualViewport keyboard positioning, Escape, mutual exclusion, accessible expanded state, click-away and menu-hidden behavior preserved.
- Quick Contact: phone, WhatsApp, Zalo, Maps. WhatsApp still requires owner confirmation of active account.
- Local assistant: same rule-based EN/VI search/memory architecture, added Spanish intents and locally indexed Spanish articles, no paid AI API. Business NAP/prices from `site/data.json`; electric pricing is **not invented**. The source website's contact email is carried over and should be owner-verified.
- `scripts/build-chat-index.mjs` regenerates rich full-content Spanish search index from the 300 article JSON sources. Commit the generated output whenever editorial publication changes.
- Needs browser QA on phone/tablet/desktop for overlap, viewport keyboard, chat suggestions, pricing, index, all contact links and menu interactions. Keep PR unmerged until those checks pass.
