import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {validateTaxonomy,decorateTaxonomy} from './taxonomy.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const json=file=>JSON.parse(read(file));
const cfg=json('data/factory-config.json'),plan=json('data/editorial-plan.json').articles,state=json('data/factory-state.json'),site=json('site/data.json');
const taxonomy=json('site/taxonomy.json');
validateTaxonomy(taxonomy,plan,state.published_ids,site.pages);
const accepted=state.published_ids.map(id=>{
 const row=plan.find(r=>r.id===id);if(!row)throw Error('Published ID unknown: '+id);
 const article=json('content/articles/'+id+'.json');
 return {...row,title:article.title,intro:article.intro};
});
const pages=site.pages.map(p=>({...p}));
decorateTaxonomy(taxonomy,pages,accepted);
pages.push(...accepted);
const urls=new Set(pages.map(p=>p.url)),titles=new Set(),issues=[],sitemap=read('sitemap.xml');
if(urls.size!==pages.length)issues.push('duplicate URLs');
for(const page of pages){
 const filename=page.url==='/'?'index.html':page.url.slice(1)+'index.html';
 const html=read(filename),canonical=cfg.domain+page.url;
 if(!html.includes('rel="canonical" href="'+canonical+'"'))issues.push('canonical '+filename);
 if(!html.includes('lang="es"'))issues.push('wrong language '+filename);
 const gscTag='<meta name="google-site-verification" content="'+site.site.googleSiteVerification+'">';
 if(!html.includes(gscTag)||(html.match(/<meta name="google-site-verification"/g)||[]).length!==1)issues.push('Google verification meta '+filename);
 if((html.match(/<h1\b/g)||[]).length!==1)issues.push('H1 count '+filename);
 if(!html.includes('application/ld+json'))issues.push('missing schema '+filename);

 if(!html.includes('<meta name="robots" content="index,follow">'))issues.push('indexability '+filename);
 const jsonld=html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
 if(!jsonld)issues.push('missing JSON-LD '+filename);
 else try{
  const graph=JSON.parse(jsonld[1])['@graph']||[];
  const business=graph.find(x=>x['@type']==='LocalBusiness');
  if(!business||business.telephone!==site.business.tel||business.hasMap!==site.business.maps||
    business.address?.streetAddress!=='112 Nguyễn Văn Cừ')issues.push('LocalBusiness/NAP '+filename);
  const hours=site.business.hours.split('–');
  const opening=business?.openingHoursSpecification?.[0];
  if(opening?.opens!==hours[0]||opening?.closes!==hours[1]||
    opening?.dayOfWeek?.length!==7)issues.push('LocalBusiness hours '+filename);
  if(page.url!=='/'&&!graph.some(x=>x['@type']==='BreadcrumbList'))issues.push('breadcrumb schema '+filename);
  if(page.url==='/faq/'){
   const faq=graph.find(x=>x['@type']==='FAQPage');
   if(faq?.mainEntity?.length!==site.faqs.length)issues.push('FAQ schema '+filename);
  }
 }catch(error){issues.push('JSON-LD invalid '+filename+': '+error.message)}

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
