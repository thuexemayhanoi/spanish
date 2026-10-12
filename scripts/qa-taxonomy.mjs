// Standalone taxonomy QA: frozen URLs, classifications, safe menu links, mature archives.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {validateTaxonomy,decorateTaxonomy,archiveUrl} from './taxonomy.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const json=f=>JSON.parse(read(f));
const site=json('site/data.json'),taxonomy=json('site/taxonomy.json'),plan=json('data/editorial-plan.json').articles;
const state=json('data/factory-state.json'),errors=[];
validateTaxonomy(taxonomy,plan,state.published_ids,site.pages);
const articles=state.published_ids.map(id=>{const row=plan.find(p=>p.id===id),draft=json('content/articles/'+id+'.json');return {...row,title:draft.title,intro:draft.intro}});
const pages=site.pages.map(p=>({...p}));
const group=decorateTaxonomy(taxonomy,pages,articles);
const urls=new Set([...pages,...articles].map(p=>p.url));
const sitemap=read('sitemap.xml'),locs=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);
if(locs.length!==urls.size||locs.some(x=>!urls.has(x.replace('https://es.rentbikehanoi.com',''))))errors.push('Sitemap does not match classified pages');
for(const page of [...pages,...articles]){
 const filename=page.url==='/'?'index.html':page.url.slice(1)+'index.html';
 if(!fs.existsSync(path.join(root,filename))){errors.push('Missing HTML '+filename);continue}
 const html=read(filename),expected='https://es.rentbikehanoi.com'+page.url;
 if(!html.includes('rel="canonical" href="'+expected+'"'))errors.push('Canonical regression '+filename);
 if((html.match(/class="nav-group"/g)||[]).length!==10)errors.push('Five menu groups missing in both navigations '+filename);
 for(const m of html.matchAll(/href="(\/[^"]*)"/g)){
  const target=m[1].split('#')[0].split('?')[0],fragment=m[1].includes('#')?m[1].split('#')[1]:null;
  if(target.startsWith('/assets/'))continue;
  if(!urls.has(target))errors.push('Broken navigation target: '+filename+' -> '+m[1]);
  if(fragment?.startsWith('categoria-')&&page.url===target&&!html.includes('id="'+fragment+'"'))errors.push('Missing local category anchor '+filename);
 }
}
for(const parent of taxonomy.parents)for(const category of parent.children){
 const members=group.get(category.id)||[],archive=archiveUrl(parent,category);
 if(members.length<taxonomy.separate_archive_min_articles&&urls.has(archive))errors.push('Premature archive '+archive);
 if(members.length>=taxonomy.separate_archive_min_articles&&!urls.has(archive))errors.push('Archive not generated '+archive);
 if(members.length&&urls.has(parent.url)){
  const html=read(parent.url.slice(1)+'index.html');
  if(!html.includes('id="categoria-'+category.id+'"'))errors.push('Missing parent category section '+category.id);
 }
}
if(state.published_ids.length===5){
 const established=['/','/sobre-nosotros/','/tipos-de-motos/','/tipos-de-motos/scooters/','/tipos-de-motos/motos-50cc/','/precios/','/guia-de-alquiler/','/guia-de-alquiler/documentacion-y-deposito/','/faq/','/contacto/','/politica-de-privacidad/','/terminos-y-condiciones/'];
 if(urls.size!==17||established.some(p=>!urls.has(p)))errors.push('17 existing URLs changed during taxonomy introduction');
}
if(errors.length){console.error(errors.slice(0,60).join('\n'));process.exit(1)}
console.log('TAXONOMY_QA_PASS parent=5 child=20 plan='+plan.length+' published='+state.published_ids.length+' URLs='+urls.size);
