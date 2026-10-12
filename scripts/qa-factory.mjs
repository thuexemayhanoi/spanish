import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const json=file=>JSON.parse(read(file));
const cfg=json('data/factory-config.json'),plan=json('data/editorial-plan.json').articles,state=json('data/factory-state.json'),site=json('site/data.json');
const pages=[...site.pages,...state.published_ids.map(id=>{const row=plan.find(r=>r.id===id);if(!row)throw Error('Published ID unknown: '+id);return row})];
const urls=new Set(pages.map(p=>p.url)),titles=new Set(),issues=[],sitemap=read('sitemap.xml');
if(urls.size!==pages.length)issues.push('duplicate URLs');
for(const page of pages){
 const filename=page.url==='/'?'index.html':page.url.slice(1)+'index.html';
 const html=read(filename),canonical=cfg.domain+page.url;
 if(!html.includes('rel="canonical" href="'+canonical+'"'))issues.push('canonical '+filename);
 if(!html.includes('lang="es"'))issues.push('wrong language '+filename);
 if((html.match(/<h1\b/g)||[]).length!==1)issues.push('H1 count '+filename);
 if(!html.includes('application/ld+json'))issues.push('missing schema '+filename);
 if(!sitemap.includes('<loc>'+canonical+'</loc>'))issues.push('sitemap '+filename);
 const title=(html.match(/<title>([^<]+)<\/title>/)||[])[1]||'';
 if(titles.has(title.toLowerCase()))issues.push('duplicate title '+filename);titles.add(title.toLowerCase());
 for(const match of html.matchAll(/href="(\/[^"#?]*)"/g)){
  const target=match[1];if(target.startsWith('/assets/'))continue;
  if(!urls.has(target))issues.push('broken internal link '+filename+' -> '+target);
 }
}
if((sitemap.match(/<url>/g)||[]).length!==pages.length)issues.push('sitemap count');
if(read('CNAME').trim()!=='es.rentbikehanoi.com')issues.push('CNAME mismatch');
if(state.published_ids.length>cfg.target_articles)issues.push('over 300 article cap');
if(issues.length){console.error(issues.join('\n'));process.exit(1)}
console.log('QA_PASS pages='+pages.length+' articles='+state.published_ids.length);
