# /spanish · Blue Titanium

**Domain:** https://es.rentbikehanoi.com/  
**Repo:** thuexemayhanoi/spanish (GitHub Pages)

Spanish-language static SEO site. **No dependencies and no content workflow.** `CNAME` must remain `es.rentbikehanoi.com`. The reference repo `thuexemayhanoi/web` was read-only.

## Edit once → rebuild everything

- `site/data.json`: single source of truth for NAP, rates, page metadata, visible FAQ, navigation and editorial text.
- `assets/css/theme.css`: global colours (Blue Titanium / black / white), tokens and responsive components.
- `assets/js/app.js`: shared theme preference and keyboard-friendly mobile menu.
- `scripts/build.mjs`: **zero-dependency** generator for every HTML page, shared header/footer, breadcrumbs, canonical tags, JSON-LD, robots and sitemap.

To regenerate, run `node scripts/build.mjs`, review generated diffs, then commit the source **and** generated files. No GitHub Actions added by request. Canonicals/sitemap use only https://es.rentbikehanoi.com/. All prices are indicative; verify model, deposit, delivery and document terms before renting.

Privacy and Terms describe the static code shipped. Review legal text if business operations or data collection change. Real-world mobile screenshot/Lighthouse inspection is recommended after deployment.
