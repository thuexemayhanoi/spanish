#!/usr/bin/env node
/**
 * SEO Master Standard /spanish — independent, read-only audit.
 * Offline checks inspect all committed pages. Full adds live checks of a bounded rotating sample.
 * No writer state updates, no commits, no GSC credentials and no invented Lighthouse scores.
 * Usage: node scripts/seo-audit.mjs --mode=offline|full --report=/path/report.json
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(ROOT,file),'utf8');
const json=file=>JSON.parse(read(file));
const cfg=json('data/seo-monitor-config.json');
const site=json('site/data.json');
const plan=json('data/editorial-plan.json');
const state=json('data/factory-state.json');
const args=new Map(process.argv.slice(2).filter(s=>s.startsWith('--')).map(s=>{
  const i=s.indexOf('=');return [i<0?s.slice(2):s.slice(2,i),i<0?'true':s.slice(i+1)];
}));
const mode=args.get('mode')||'offline',outFile=args.get('report');
if(!['offline','full'].includes(mode))throw Error('Use --mode=offline or --mode=full');
if(cfg.domain!==site.site.base.replace(/\/$/,'')||cfg.domain!=='https://es.rentbikehanoi.com')throw Error('Spanish domain configuration mismatch');
const checks=[],issues=[],warnings=[];
function record(group,key,result,detail,reference=''){
  checks.push({group,key,result,detail,reference});
  if(result==='FAIL')issues.push({group,key,detail,reference});
  if(result==='WARN')warnings.push({group,key,detail,reference});
}
const entity=s=>String(s||'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const strip=s=>entity(String(s||'').replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
const canonicalOf=h=>(h.match(/<link\s+rel="canonical"\s+href="([^"]+)"\s*\/?>/i)||[])[1];
const titleOf=h=>strip((h.match(/<title>([\s\S]*?)<\/title>/i)||[])[1]);
const meta=(h,name)=>(h.match(new RegExp('<meta\\s+(?:name|property)="'+name+'"\\s+content="([^"]*)"','i'))||[])[1];
const h1Of=h=>strip((h.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]);
const pathFile=u=>u==='/'?'index.html':u.replace(/^\//,'')+'index.html';
const localExists=f=>fs.existsSync(path.join(ROOT,f));
const base=cfg.domain;
const publishedIds=state.published_ids||[];
const catalog=site.pages.map(p=>({...p,role:'base'}));
for(const id of publishedIds){
  const row=plan.articles.find(p=>p.id===id);
  if(!row){record('Content SEO','published/'+id,'FAIL','Published article missing from editorial matrix');continue}
  const file='content/articles/'+id+'.json';
  if(!localExists(file)){record('Content SEO',id,'FAIL','Accepted article JSON missing',file);continue}
  const article=json(file);
  catalog.push({url:row.url,title:article.title,role:'article',id,hub:row.hub});
}
record('Technical SEO','factory-isolation',state.enabled?'INFO':'PASS',
  state.enabled?'Content Factory enabled; SEO audit remains read-only':'Content Factory paused; audit will not alter writer state');
record('Technical SEO','published-count','INFO',
  publishedIds.length+' articles published; '+plan.articles.length+' planned of '+cfg.targetArticles+' target');
record('Technical SEO','CNAME',read('CNAME').trim()==='es.rentbikehanoi.com'?'PASS':'FAIL','GitHub Pages custom domain must remain es.rentbikehanoi.com');
const robots=read('robots.txt');
record('Technical SEO','robots.txt',robots.includes('User-agent: *')&&robots.includes('Allow: /')&&
  !/Disallow:\s*\/\s*$/mi.test(robots)&&robots.includes('Sitemap: '+base+'/sitemap.xml')?'PASS':'FAIL',
  'Public robots must allow crawling and reference the canonical sitemap');
const xml=read('sitemap.xml'),sitemapLinks=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>entity(x[1]));
const sitemapSet=new Set(sitemapLinks),routes=new Set(catalog.map(p=>p.url));
record('Technical SEO','sitemap-count',
  sitemapLinks.length===routes.size&&sitemapSet.size===routes.size&&sitemapLinks.every(x=>x.startsWith(base+'/'))?'PASS':'FAIL',
  'Sitemap URLs='+sitemapLinks.length+', expected='+routes.size+', unique='+sitemapSet.size);
for(const p of catalog)if(!sitemapSet.has(base+p.url))record('Technical SEO','sitemap-missing','FAIL','Expected URL absent from sitemap',p.url);
for(const loc of sitemapSet)if(!routes.has(loc.slice(base.length)))record('Technical SEO','sitemap-extra','FAIL','Sitemap URL has no published page',loc);
const normalization=s=>strip(s).toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const titles=new Map(),canonicalSet=new Set(),h1Set=new Map();
let broken=0,invalidSchema=0;
for(const p of catalog){
  const file=pathFile(p.url),key=p.url;
  if(!localExists(file)){record('Technical SEO','missing-page','FAIL','HTML missing',file);continue}
  const html=read(file),expected=base+p.url,heading=h1Of(html),title=titleOf(html);
  if(!html.includes('<html lang="es"'))record('International SEO','html-lang','FAIL','Missing Spanish HTML language',file);
  if(meta(html,'robots')!=='index,follow')record('Technical SEO','index-directive','FAIL','Page missing index,follow directive',file);
  const canon=canonicalOf(html);
  if(canon!==expected)record('Technical SEO','canonical','FAIL','Self-canonical mismatch: '+String(canon),file);
  if(canonicalSet.has(canon))record('Technical SEO','canonical-duplicate','FAIL','Duplicate canonical: '+canon,file);
  canonicalSet.add(canon);
  if(!title||!meta(html,'description')||!heading)record('On-page SEO','metadata','FAIL','Title, description or H1 missing',file);
  if((html.match(/<h1\b/gi)||[]).length!==1)record('On-page SEO','h1-count','FAIL','Expected exactly one H1',file);
  if(meta(html,'og:url')!==expected)record('On-page SEO','open-graph','FAIL','OG URL must equal canonical',file);
  if((title.length<cfg.titleMinChars||title.length>cfg.titleMaxChars)&&title)record('On-page SEO','title-length','WARN','Title length '+title.length+' outside soft target',file);
  const d=meta(html,'description');
  if(d&&(d.length<cfg.descriptionMinChars||d.length>cfg.descriptionMaxChars))record('On-page SEO','description-length','WARN','Meta length '+d.length+' outside soft target',file);
  const nt=normalization(title);
  if(titles.has(nt))record('On-page SEO','duplicate-title','FAIL','Duplicated title with '+titles.get(nt),file);
  titles.set(nt,file);
  if(h1Set.has(normalization(heading))&&p.role==='article')record('Content SEO','duplicate-h1','WARN','H1 overlaps with '+h1Set.get(normalization(heading)),file);
  h1Set.set(normalization(heading),file);
  if(meta(html,'google-site-verification')!==site.site.googleSiteVerification)
    record('Technical SEO','gsc-verification','FAIL','Shared Google verification tag is absent or mismatched',file);
  let parsed=[];
  for(const x of html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)){
    try{parsed.push(JSON.parse(x[1]))}catch(e){invalidSchema++;record('Structured Data','invalid-jsonld','FAIL','JSON-LD parse error '+e.message,file)}
  }
  const graph=parsed.flatMap(x=>x['@graph']||[x]);
  const b=graph.find(x=>x['@type']==='LocalBusiness');
  if(!b||b.telephone!==site.business.tel||b.hasMap!==site.business.maps||!b.address?.streetAddress||
     b.openingHoursSpecification?.[0]?.opens!=='09:00'||b.openingHoursSpecification?.[0]?.closes!=='21:00')
     record('Structured Data','business-entity','FAIL','Missing or inconsistent verified business NAP/hours',file);
  if(!graph.some(x=>x['@type']==='WebPage'&&x.url===expected))
     record('Structured Data','webpage-entity','FAIL','WebPage entity missing or wrong URL',file);
  if(p.url!=='/'&&!graph.some(x=>x['@type']==='BreadcrumbList'))
     record('Structured Data','breadcrumb-entity','FAIL','Breadcrumb JSON-LD missing',file);
  if(p.url==='/faq/'){
    const f=graph.find(x=>x['@type']==='FAQPage');
    if(f?.mainEntity?.length!==site.faqs.length)record('Structured Data','faq-entity','FAIL','FAQ schema count must match visible FAQs',file);
  }
  if(p.role==='article'&&!graph.some(x=>x['@type']==='Article'))
     record('Structured Data','article-entity','FAIL','Published article missing Article schema',file);
  for(const m of html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)){
    const href=entity(m[1]);if(!href.startsWith('/'))continue;
    const path=href.split('#')[0].split('?')[0]||p.url;
    if(path!=="/"&&!routes.has(path)){broken++;record('Architecture','broken-internal-link','FAIL','Link to unpublished local page '+path,file)}
  }
  if(!/<meta name="viewport" content="width=device-width,initial-scale=1">/.test(html))
     record('Performance','viewport','FAIL','Mobile viewport meta tag missing',file);
  for(const m of html.matchAll(/<img\b[^>]*>/gi)){
    if(!/\balt="/i.test(m[0]))record('Accessibility','image-alt','FAIL','Image without alt attribute',file);
    if(!/\b(width|height)=/i.test(m[0]))record('Performance','image-dimensions','WARN','Set image width/height or aspect-ratio to reduce CLS',file);
  }
}
if(!localExists('404.html')||!/noindex/.test(read('404.html')))record('Technical SEO','404-noindex','FAIL','404 template missing noindex');
record('Architecture','internal-links',broken===0?'PASS':'FAIL',broken+' broken internal links across '+catalog.length+' published pages');
record('Structured Data','jsonld-parse',invalidSchema===0?'PASS':'FAIL',invalidSchema+' JSON-LD parse errors');
const planIds=new Set(),planUrls=new Set(),planKeywords=new Map(),pairs=[];
for(const r of plan.articles){
  if(planIds.has(r.id)||planUrls.has(r.url))record('Content SEO','matrix-duplicates','FAIL','Duplicate ID or URL '+r.id);
  planIds.add(r.id);planUrls.add(r.url);
  if(!r.hub||!routes.has(r.hub))record('Architecture','orphan-matrix-hub','FAIL','Planned article hub missing '+r.hub,r.id);
  if(!r.primary_keyword||!r.intent||!r.brief)record('Content SEO','missing-brief','FAIL','Keyword, intent or brief missing',r.id);
  const keyword=normalization(r.primary_keyword);
  if(planKeywords.has(keyword))record('Content SEO','keyword-collision','FAIL','Exact keyword overlaps with '+planKeywords.get(keyword),r.id);
  planKeywords.set(keyword,r.id);
  pairs.push({id:r.id,k:keyword.split(' ').filter(x=>x.length>2)});
}
let intentAlerts=0;
for(let i=0;i<pairs.length;i++)for(let j=i+1;j<pairs.length;j++){
  const a=new Set(pairs[i].k),b=new Set(pairs[j].k);
  const common=[...a].filter(x=>b.has(x)).length,universe=new Set([...a,...b]).size;
  const overlap=universe?common/universe:0;
  if(Math.min(a.size,b.size)>=4&&overlap>=cfg.intentSimilarityWarning){
    intentAlerts++;if(intentAlerts<=cfg.maxIntentAlerts)record('Content SEO','potential-intent-overlap','WARN',
      pairs[i].id+' versus '+pairs[j].id+' (token similarity '+overlap.toFixed(2)+'): editorial review required');
  }
}
record('Content SEO','intent-audit','INFO','Reviewed '+pairs.length+' planned briefs; '+intentAlerts+' possible similar keyword pairs (heuristic, not search-intent proof)');
for(const [asset,limit] of Object.entries(cfg.assetBudgetsBytes)){
 if(!localExists(asset)){record('Performance','asset-missing','FAIL','Essential asset missing',asset);continue}
 const size=fs.statSync(path.join(ROOT,asset)).size;
 record('Performance','asset-budget',size<=limit?'PASS':'WARN',asset+': '+size+' bytes / soft budget '+limit);
}
record('Performance','core-web-vitals','NOT_MEASURED','LCP, INP and CLS require actual Chrome/Lighthouse or field data; this audit never fabricates scores');
record('Analytics','google-search-console','NOT_CONNECTED','No authenticated Google Search Console API data/inspection supplied to GitHub audit');
record('Analytics','bing-webmaster-tools','NOT_CONNECTED','Bing ownership and sitemap acceptance require authenticated Bing data; site fetch alone cannot verify');
record('Authority','mentions-and-links','NOT_MEASURED','Authority/backlinks not measured by this static site script');
record('International SEO','hreflang','NOT_CONFIGURED','Do not auto-generate hreflang unless reciprocal equivalent translated URLs are verified');

async function fetchChecked(url){
 let last;
 for(let attempt=0;attempt<2;attempt++){
  try{
   const response=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(cfg.requestTimeoutMs),
     headers:{'User-Agent':'SpanishSEOAudit/1.0 (+https://es.rentbikehanoi.com/)','Accept':'text/html,application/xml,text/plain;q=0.9'}});
   const body=await response.text();
   if(response.status>=500&&attempt===0)continue;
   return {status:response.status,url:response.url,body};
  }catch(e){last=e.message}
 }
 throw Error(last||'network failure');
}
async function live(){
 const targets=['/','/precios/','/faq/','/contacto/'];
 const articles=catalog.filter(p=>p.role==='article').map(p=>p.url);
 if(articles.length){
  const start=Math.floor(Date.now()/86400000)%articles.length;
  for(let j=0;j<Math.min(articles.length,cfg.maxLiveUrls-targets.length);j++)targets.push(articles[(start+j)%articles.length]);
 }
 const urls=['/robots.txt','/sitemap.xml',...new Set(targets)];
 for(const pathname of urls){
  try{
   const result=await fetchChecked(base+pathname);
   if(result.status!==200){record('Live Monitoring','http-status','FAIL',pathname+' returned HTTP '+result.status);continue}
   if(pathname==='/robots.txt'){
    record('Live Monitoring','robots-live',result.body.includes('Sitemap: '+base+'/sitemap.xml')?'PASS':'FAIL',
      'Production robots.txt must link Spanish sitemap');
   }else if(pathname==='/sitemap.xml'){
    const locs=[...result.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>entity(x[1]));
    record('Live Monitoring','sitemap-live',
      locs.length===catalog.length&&locs.every(x=>x.startsWith(base+'/'))?'PASS':'FAIL',
      'Production sitemap has '+locs.length+' URLs; repository expects '+catalog.length);
   }else{
    const canonical=canonicalOf(result.body);
    record('Live Monitoring','canonical-live',canonical===base+pathname?'PASS':'FAIL',
      pathname+' live canonical '+String(canonical));
    if(meta(result.body,'robots')==='noindex')
      record('Live Monitoring','index-live','FAIL','Public page has noindex '+pathname);
   }
  }catch(e){record('Live Monitoring','fetch-failed','FAIL',pathname+': '+e.message)}
 }
}
if(mode==='full')await live();
const tally={fail:checks.filter(x=>x.result==='FAIL').length,warn:checks.filter(x=>x.result==='WARN').length,
  pass:checks.filter(x=>x.result==='PASS').length,other:checks.filter(x=>!['FAIL','WARN','PASS'].includes(x.result)).length};
const result={schema_version:1,website:base,repository:'thuexemayhanoi/spanish',mode,generated_at:new Date().toISOString(),
  counts:{published_pages:catalog.length,published_articles:publishedIds.length,planned_articles:plan.articles.length,article_goal:cfg.targetArticles},
  verdict:tally.fail?'FAIL':tally.warn?'PASS_WITH_WARNINGS':'PASS',summary:tally,issues,warnings,checks};
if(outFile){const dest=path.resolve(outFile);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,JSON.stringify(result,null,2)+'\n');}
if(process.env.GITHUB_STEP_SUMMARY){
 const md=['## Spanish SEO Master Audit','', '**Result:** '+result.verdict,
   '**Mode:** '+mode,'**Pages:** '+catalog.length,'**Failures:** '+tally.fail,'**Warnings:** '+tally.warn,'',
   ...issues.slice(0,30).map(x=>'- ❌ '+x.group+'/'+x.key+': '+x.detail+' '+x.reference),
   ...warnings.slice(0,20).map(x=>'- ⚠️ '+x.group+'/'+x.key+': '+x.detail+' '+x.reference),
   '', '_Live Google indexing, Bing ownership and Lighthouse metrics remain unverified without authenticated data / Chrome._'];
 fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,md.join('\n')+'\n');
}
console.log('SEO_AUDIT '+JSON.stringify({mode,verdict:result.verdict,summary:tally,pages:catalog.length,articles:publishedIds.length,planned:plan.articles.length,report:outFile||null}));
if(tally.fail)process.exitCode=1;
