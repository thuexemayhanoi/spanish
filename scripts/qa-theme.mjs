#!/usr/bin/env node
// P0 theme regression guard. READ ONLY. Run together with existing site QA.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const assert=(condition,message)=>{if(!condition)throw new Error('THEME_QA_FAIL '+message)};
const css=read('assets/css/theme.css'),js=read('assets/js/app.js');
const main=read('index.html'),notFound=read('404.html');
const state=json('data/factory-state.json'),plan=json('data/editorial-plan.json');
const byId=new Map(plan.articles.map(x=>[x.id,x]));
assert(css.includes('--link:#155c8b')&&css.includes('color-scheme:dark'),'Light/dark design tokens missing');
assert(css.includes('@media(max-width:1120px)'),'Mobile navigation breakpoint CSS missing');
assert(js.includes("matchMedia('(min-width: 1121px)')"),'JS breakpoint does not match CSS');
assert(js.includes("event.key!=='Escape'"),'Escape keyboard control missing');
assert(js.includes("menuButton.setAttribute('aria-expanded'"),'Mobile ARIA state missing');
assert(css.includes('prefers-reduced-motion'),'Reduced motion regression');
assert(css.includes('focus-visible'),'Visible keyboard focus regression');
assert(css.includes('/* P1.04 Premium footer')&&css.includes('.footer-back-to-top'),'Premium footer token/style missing');
assert(js.includes('P1.04 all-pages footer jump'),'Shared footer/back-to-top control missing');
assert(js.includes("anchor.href='#content'"),'Footer back-to-top is not a same-page link');
assert(js.includes("if(!document.querySelector('.prose article'))"),'Prevent duplicate article back-to-top control');
assert(js.includes("header?.classList.toggle('is-scrolled'"),'Scroll shadow enhancement missing');

assert(/<nav class="nav" aria-label="Navegación principal">/.test(main),'Desktop navigation missing');
assert(/id="mobile-nav"[^>]*hidden/.test(main),'Collapsed mobile navigation missing');
assert(/id="menu-toggle"[^>]*aria-expanded="false"/.test(main),'Mobile control initial state wrong');
assert((main.match(/class="nav-group"/g)||[]).length===10,'5 taxonomy groups not rendered twice');
assert(main.includes('<main id="content">'),'Skip-link target missing');
assert(main.includes('<footer class="footer">'),'Shared footer missing');
assert(/name="robots" content="noindex,follow"/.test(notFound),'404 must remain noindex');
assert((notFound.match(/<h1\\b/g)||[]).length===1,'404 must keep one H1');
assert(notFound.includes('<main id="content">')&&notFound.includes('<footer class="footer">'),'Premium 404 shell not generated');
assert(notFound.includes('href="/guia-de-alquiler/"')&&notFound.includes('href="/precios/"'),'404 recovery targets missing');
assert((notFound.match(/class="nav-group"/g)||[]).length===10,'404 desktop/mobile taxonomy nav missing');
assert(!notFound.includes('rel="canonical"'),'404 must not introduce a canonical tag');

assert(state.published_ids.length===new Set(state.published_ids).size,'Duplicate published article IDs');
for(const id of [state.published_ids[0],state.published_ids[Math.floor(state.published_ids.length/2)],state.published_ids.at(-1)]){
  const article=byId.get(id);
  assert(article,'Unknown published article '+id);
  const html=read(article.url.slice(1)+'index.html');
  const canonical='https://es.rentbikehanoi.com'+article.url;
  assert(html.includes('<link rel="canonical" href="'+canonical+'">'),'Canonical changed '+id);
  assert(html.includes('<article>'),'Article body lost '+id);
  assert(html.includes('<footer class="footer">'),'Shared footer lost '+id);
}
console.log('THEME_QA_PASS published='+state.published_ids.length+' taxonomy_groups=5 samples=3 keyboard=PASS');
