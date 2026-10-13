#!/usr/bin/env node
// Read-only acceptance guard for Spanish core-page SEO expansion.
// Never changes article JSON, editorial plan, published IDs, URLs or metadata.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const json=p=>JSON.parse(read(p));
const site=json('site/data.json'),taxonomy=json('site/taxonomy.json'),state=json('data/factory-state.json');
const targets=[
'/','/sobre-nosotros/','/tipos-de-motos/','/tipos-de-motos/scooters/',
'/tipos-de-motos/motos-50cc/','/precios/','/guia-de-alquiler/',
'/guia-de-alquiler/documentacion-y-deposito/','/faq/',
'/politica-de-privacidad/','/terminos-y-condiciones/',
'/zonas-de-hanoi/','/rutas-y-movilidad/'
];
const fail=(m)=>{throw Error('CORE_SEO_QA_FAIL '+m)};
if(state.published_ids.length!==300||new Set(state.published_ids).size!==300)fail('Article count / uniqueness changed');
const allPages=new Set([...site.pages.map(x=>x.url),...taxonomy.parents.map(x=>x.url)]);
const legal=['/politica-de-privacidad/','/terminos-y-condiciones/','/sobre-nosotros/'];
for(const url of targets){
 const file=url==='/'?'index.html':url.slice(1)+'index.html';
 const html=read(file);
 const main=html.split('<main id="content">')[1]?.split('</main>')[0];
 if(!main)fail('Main missing '+url);
 const words=main.replace(/<script\b[\s\S]*?<\/script>/g,' ').replace(/<[^>]*>/g,' ').replace(/&(?:[a-z]+|#[0-9]+);/gi,' ').trim().split(/\s+/u).length;
 if(words<1500)fail(url+' only '+words+' visible main-text words');
 if(!main.includes('class="section seo-core-longform"'))fail('Expanded source missing '+url);
 if((html.match(/<h1\b/g)||[]).length!==1)fail('H1 mismatch '+url);
 if(!html.includes('rel="canonical" href="https://es.rentbikehanoi.com'+url+'"'))fail('Canonical mismatch '+url);
 if(!html.includes('name="robots" content="index,follow"'))fail('Indexability '+url);
 if(!html.includes('<footer class="footer">'))fail('Footer missing '+url);
 for(const [label,link] of site.nav)if(!html.includes('href="'+link+'"'))fail('Missing global nav '+label+' '+url);
 for(const parent of taxonomy.parents)if(!html.includes('href="'+parent.url+'"'))fail('Footer missing parent '+parent.url+' '+url);
 for(const destination of [...main.matchAll(/class="seo-core-related"[^>]*>([\s\S]*?)<\/nav>/g)].flatMap(x=>[...x[1].matchAll(/href="([^"]+)"/g)].map(z=>z[1])))if(!allPages.has(destination))fail('Invalid core internal link '+url+' => '+destination);
 console.log('CORE_PAGE_PASS '+url+' words='+words);
}
const home=read('index.html'),faq=read('faq/index.html');
const countFaq=html=>{const a=html.indexOf('<div class="faq">');if(a<0)fail('FAQ block absent');return (html.slice(a,html.indexOf('</div>',a)).match(/<summary>/g)||[]).length};
if(countFaq(home)!==6)fail('Homepage must show six FAQs');
if(countFaq(faq)!==20)fail('Existing dedicated FAQ must retain all 20 questions');
if(!faq.includes('"@type":"FAQPage"'))fail('Existing FAQ schema missing');
const contact=read('contacto/index.html'),contactMain=contact.split('<main id="content">')[1]?.split('</main>')[0]||'';
const contactWords=contactMain.replace(/<[^>]*>/g,' ').trim().split(/\s+/u).length;
if(contactWords>=1500)fail('Contact must stay concise');
for(const key of [site.business.address,site.business.hours,site.business.international]){
 if(!contact.includes(key)&&!contact.includes(key.replace(/&/g,'&amp;')))fail('Contact detail missing '+key);
}
for(const sample of ['ES-0001','ES-0150','ES-0312']){
 const plan=json('data/editorial-plan.json').articles.find(x=>x.id===sample);
 if(!plan)fail('Sample ID not planned '+sample);
 const html=read(plan.url.slice(1)+'index.html');
 if(html.includes('class="section seo-core-longform"'))fail('Published article body overwritten '+sample);
 if(!html.includes('rel="canonical" href="https://es.rentbikehanoi.com'+plan.url+'"'))fail('Sample canonical '+sample);
}
for(const url of legal)if(!targets.includes(url))fail('Legal missing '+url);
console.log('CORE_SEO_QA_PASS expanded='+targets.length+' faq_home=6 faq_page=20 posts=300 contact_words='+contactWords);
