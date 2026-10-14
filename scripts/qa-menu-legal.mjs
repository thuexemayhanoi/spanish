#!/usr/bin/env node
// Read-only acceptance check for shared menu/footer, legal/about visibility and responsiveness.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const assert=(test,msg)=>{if(!test)throw Error('MENU_LEGAL_QA_FAIL '+msg)};
const site=json('site/data.json'),tax=json('site/taxonomy.json'),st=json('data/factory-state.json');
const urls=new Set([...site.pages.map(p=>p.url),...tax.parents.map(p=>p.url)]);
const extras=site.navExtras;
assert(extras['/']?.length===1&&extras['/contacto/']?.length===2,'Expected Inicio and Contacto utility links');
const wanted=[
{path:'/sobre-nosotros/',parent:'/',label:'Sobre nosotros'},
{path:'/politica-de-privacidad/',parent:'/contacto/',label:'Política de privacidad'},
{path:'/terminos-y-condiciones/',parent:'/contacto/',label:'Términos y condiciones'}
];
const out=x=>x==='/'?'index.html':x.slice(1)+'index.html';
const words=markup=>markup.replace(/<script\b[\s\S]*?<\/script>/g,' ').replace(/<[^>]*>/g,' ').replace(/&(?:[a-z]+|#[0-9]+);/gi,' ').trim().split(/\s+/u).length;
for(const item of wanted){
 const page=read(out(item.path)),main=page.split('<main id="content">')[1]?.split('</main>')[0]||'';
 assert(words(main)>=1600,item.path+' main text below 1600 words '+words(main));
 assert(main.includes('seo-core-longform'),'Longform missing '+item.path);
 assert((main.match(/class="seo-core-related"/g)||[]).length>=6,'Missing contextual internal links '+item.path);
 assert(page.includes('rel="canonical" href="https://es.rentbikehanoi.com'+item.path+'"'),'Canonical altered '+item.path);
 assert((page.match(/<h1\b/g)||[]).length===1,'H1 mismatch '+item.path);
 assert(page.includes('href="'+item.path+'"'),'Navigation link missing '+item.path);
 assert(extras[item.parent].some(([label,url])=>url===item.path&&label===item.label),'Taxonomy mismatch '+item.path);
 console.log('MENU_LEGAL_PASS '+item.path+' words='+words(main));
}
const samples=['/','/faq/','/contacto/','/politica-de-privacidad/'];
for(const url of samples){
 const html=read(out(url));
 const desktop=html.match(/<nav class="nav" aria-label="Navegación principal">([\s\S]*?)<\/nav>/)?.[1]||'';
 const mobile=html.match(/<nav id="mobile-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1]||'';
 const footer=html.match(/<footer class="footer">([\s\S]*?)<\/footer>/)?.[1]||'';
 assert(desktop&&mobile&&footer,'Header/mobile/footer absent '+url);
 for(const nav of [desktop,mobile,footer]){
  for(const x of wanted)assert(nav.includes('href="'+x.path+'"'),'Utility child link missing '+url+' '+x.path);
  for(const p of tax.parents)assert(nav.includes('href="'+p.url+'"'),'Main taxonomy label missing '+url+' '+p.url);
  assert(nav.includes('href="/faq/"'),'FAQ link missing '+url);
 }
 for(const [label,p] of [['Inicio','/'],['Contacto','/contacto/']]){
  const hit=desktop.includes('<summary>'+label+'</summary>')&&mobile.includes('<summary>'+label+'</summary>');
  assert(hit,'Menu parent missing / not expandable '+url+' '+label);
  assert(footer.includes('href="'+p+'"'),'Footer parent missing '+url+' '+label);
 }
 for(const parent of tax.parents)for(const child of parent.children){
   assert(footer.includes(child.label),'Footer child label missing '+url+' '+child.id);
 }
}
const contact=read('contacto/index.html'),contactMain=contact.split('<main id="content">')[1]?.split('</main>')[0]||'';
assert(words(contactMain)<350,'Contact page should remain short');
assert(st.published_ids.length===300&&new Set(st.published_ids).size===300,'Published editorial inventory changed');
const css=read('assets/css/theme.css'),js=read('assets/js/app.js');
assert(css.includes('Responsive reading gutter fix'),'Missing responsive text fix');
assert(css.includes('calc(100% - var(--reading-gutter) - var(--reading-gutter))'),'Unsafe prose width');
assert(css.includes('.mobile-nav .utility-nav-group'),'Mobile child menu lacks CSS');
assert(js.includes('const taxonomyGroups'),'Keyboard toggle listener missing');
console.log('MENU_LEGAL_QA_PASS three legal/about pages >=1600 words; 300 posts; all header/footer labels and child links');
