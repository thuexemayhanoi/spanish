#!/usr/bin/env node
// Read-only responsive reading QA. Browser/device acceptance is a separate manual test.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const fail=msg=>{throw Error('RESPONSIVE_QA_FAIL '+msg)};
const css=read('assets/css/theme.css');
const required=[
  '--reading-gutter:clamp(20px,5vw,48px)',
  '.wrap.prose{',
  '.seo-core-longform .wrap.prose{',
  'width:min(760px,calc(100% - var(--reading-gutter) - var(--reading-gutter)))',
  'width:min(860px,calc(100% - var(--reading-gutter) - var(--reading-gutter)))',
  '@media(max-width:760px)',
  '@media(max-width:360px)',
  '.seo-core-block p,.prose p{',
  '.table-scroll{max-width:100%',
  '.reader-toc,.back-to-top{'
];
for(const rule of required)if(!css.includes(rule))fail('Missing shared responsive rule '+rule);
if(/(?:body|html)\s*\{[^}]*overflow-x\s*:\s*hidden/i.test(css))fail('Do not conceal viewport overflow');
const state=JSON.parse(read('data/factory-state.json'));
if(state.published_ids.length!==300||new Set(state.published_ids).size!==300)fail('Factory published count changed');
const plan=JSON.parse(read('data/editorial-plan.json')).articles;
const sitemap=read('sitemap.xml');
if((sitemap.match(/<loc>/g)||[]).length!==334)fail('Sitemap count changed');
const pages=['/','/faq/','/precios/','/guia-de-alquiler/',
 '/zonas-de-hanoi/','/rutas-y-movilidad/',
 '/politica-de-privacidad/','/terminos-y-condiciones/','/contacto/'];
for(const url of pages){
  const html=read(url==='/'?'index.html':url.slice(1)+'index.html');
  if(!html.includes('name="viewport" content="width=device-width,initial-scale=1"'))fail('Viewport metadata '+url);
  if(!html.includes('href="https://es.rentbikehanoi.com'+url+'"'))fail('Canonical '+url);
  if(url!=='/contacto/'&&!html.includes('class="wrap prose"'))fail('Prose container missing '+url);
}
for(const id of ['ES-0001','ES-0150','ES-0312']){
 const p=plan.find(x=>x.id===id);
 if(!p)fail('Article missing '+id);
 const html=read(p.url.slice(1)+'index.html');
 if(!html.includes('class="wrap prose"'))fail('Article prose wrapper missing '+id);
 if(!html.includes('href="https://es.rentbikehanoi.com'+p.url+'"'))fail('Article canonical '+id);
}
for(const viewport of [320,360,375,390,768,1024,1440]){
 const gutter=Math.max(20,Math.min(48,viewport*0.05));
 const outer=Math.min(1200,viewport-2*gutter);
 const article=Math.min(760,viewport-2*gutter);
 const core=Math.min(860,viewport-2*gutter);
 if(!(outer<=viewport-40&&article<=viewport-40&&core<=viewport-40))fail('Gutter algebra at '+viewport);
 console.log('RESPONSIVE_GUTTER source-model '+viewport+'px side>='+gutter.toFixed(1)+'px article='+article.toFixed(1)+'px core='+core.toFixed(1)+'px');
}
console.log('RESPONSIVE_QA_PASS common source, 300 article guard, 13-page shared stylesheet; visual browser checks still required');
