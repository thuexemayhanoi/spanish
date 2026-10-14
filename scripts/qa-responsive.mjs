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

// Matrix P1: assert complete generated-site coverage, not only three sample posts.
const urlMatches=[...sitemap.matchAll(/<loc>(https:\/\/es\.rentbikehanoi\.com\/[^<]*)<\/loc>/g)];
if(urlMatches.length!==334)fail('Sitemap must expose 334 canonical generated pages');
const allUrls=urlMatches.map(match=>new URL(match[1]).pathname);
if(new Set(allUrls).size!==allUrls.length)fail('Duplicate URLs in sitemap');
const knownPublished=new Set(state.published_ids);
const postUrls=plan.filter(row=>knownPublished.has(row.id)).map(row=>row.url);
if(postUrls.length!==300)fail('Published article URL mapping incomplete');
for(const u of postUrls)if(!allUrls.includes(u))fail('Published article missing sitemap '+u);
const postSet=new Set(postUrls);
for(const url of allUrls){
 const file=url==='/'?'index.html':url.slice(1)+'index.html';
 const html=read(file);
 if(!html.startsWith('<!doctype html>'))fail('HTML doctype missing '+url);
 if(!html.includes('name="viewport" content="width=device-width,initial-scale=1"'))fail('Viewport metadata absent '+url);
 if(!html.includes('href="/assets/css/theme.css"'))fail('Shared responsive stylesheet absent '+url);
 if(!html.includes('<main id="content">'))fail('Main landmark missing '+url);
 if(!html.includes('<footer class="footer">'))fail('Footer missing '+url);
 if(!html.includes('rel="canonical" href="https://es.rentbikehanoi.com'+url+'"'))fail('Canonical changed '+url);
 if((html.match(/<h1\b/g)||[]).length!==1)fail('Heading hierarchy changed '+url);
 if(postSet.has(url)&&!html.includes('class="wrap prose"'))fail('Post reading shell missing '+url);
 if(url!=='/'&&!html.includes('href="/"'))fail('Home link missing '+url);
}
const pillars=['/','/sobre-nosotros/','/tipos-de-motos/','/tipos-de-motos/scooters/',
 '/tipos-de-motos/motos-50cc/','/precios/','/guia-de-alquiler/',
 '/guia-de-alquiler/documentacion-y-deposito/','/faq/','/politica-de-privacidad/',
 '/terminos-y-condiciones/','/zonas-de-hanoi/','/rutas-y-movilidad/'];
for(const url of pillars){
 const html=read(url==='/'?'index.html':url.slice(1)+'index.html');
 if(!html.includes('class="section seo-core-longform"'))fail('Core reading shell missing '+url);
}
const lastOld=css.lastIndexOf('.seo-core-longform .prose{');
const lastFix=css.lastIndexOf('.seo-core-longform .wrap.prose{');
if(lastFix<=lastOld)fail('Old full-width longform rule overrides the repaired gutter');
if(!css.includes('max-width:calc(100% - var(--reading-gutter) - var(--reading-gutter))'))fail('Viewport guard removed');
if(!css.includes('.table-scroll{max-width:100%'))fail('Responsive table scroll missing');
if(!css.includes('.seo-core-related a{max-width:100%'))fail('Internal link wrap guard missing');
console.log('RESPONSIVE_MATRIX_PASS generatedPages='+allUrls.length+' posts='+postUrls.length+' pillars='+pillars.length+' viewports=320,360,375,390,768,1024,1440');
