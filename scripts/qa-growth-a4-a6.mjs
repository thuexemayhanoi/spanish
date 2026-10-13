#!/usr/bin/env node
// READ-ONLY QA for approved SEO Growth phases A4–A6.
// Never promotes editorial candidates to factory plans or changes publication state.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const taxonomy=read('site/taxonomy.json'),plan=read('data/editorial-plan.json');
const state=read('data/factory-state.json'),queue=read('data/writer-queue.json');
const link=read('data/internal-link-matrix-a4.json');
const cann=read('data/cannibalization-watchlist-a5.json');
const gap=read('data/editorial-candidates-270-a6.json');
const norm=s=>String(s||'').toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const issues=[],warnings=[];
const assert=(truth,msg)=>{if(!truth)issues.push(msg)};
const parentMap=new Map(taxonomy.parents.map(p=>[p.id,p]));
const childMap=new Map(taxonomy.parents.flatMap(p=>p.children.map(c=>[c.id,p.id])));
const base30=plan.articles.filter(p=>Number(p.id.slice(3))<=30);
const currentIds=new Set(base30.map(p=>p.id));
const currentUrls=new Set(base30.map(p=>p.url));
const currentTitles=new Set(base30.map(p=>norm(p.working_title)));
const pages=new Set([...read('site/data.json').pages.map(p=>p.url),...state.published_ids.filter(id=>Number(id.slice(3))<=5).map(id=>plan.articles.find(p=>p.id===id)?.url)]); // Frozen A4 17-URL baseline, not all newly published A6 URLs.
assert(typeof state.enabled==='boolean','Factory state malformed');
assert(state.blocked===false,'Factory blocked status changed');
assert(queue.status===(state.blocked?'BLOCKED':!state.enabled?'PAUSED':queue.queue.length?'READY':'PLAN_EXHAUSTED'),'Writer queue inconsistent');
assert(['ES-0001','ES-0002','ES-0003','ES-0004','ES-0005'].every(id=>state.published_ids.includes(id)),'A4 original article IDs missing');
assert(plan.articles.length===300&&base30.length===30,'Expected 300 plan slots and 30 originals');
assert(gap.candidates.length===270,'A6 candidate count must be 270');
assert(gap.existing_editorial_plan===30,'A6 base plan count mismatched');
assert(gap.target_total_articles===300,'A6 target mismatch');
assert(gap.candidates.every(c=>c.status==='CANDIDATE_ONLY_NOT_IN_FACTORY'||c.status==='HOLD_FOR_INTENT_REVIEW'),'A6 publication gate missing');
assert(gap.candidates.every(c=>c.serp_validation==='PENDING'&&c.keyword_volume===null&&c.keyword_difficulty===null),'A6 unverified keyword metrics must remain null');
const candidateIds=new Set(),candidateUrls=new Set(),candidateTitles=new Set(),catCounts=new Map();
for(let i=0;i<gap.candidates.length;i++){
 const c=gap.candidates[i],expected='ES-'+String(i+31).padStart(4,'0');
 assert(c.id===expected,'Unexpected candidate ID '+c.id+' vs '+expected);
 if(candidateIds.has(c.id)||currentIds.has(c.id))issues.push('Candidate ID repeated '+c.id);
 candidateIds.add(c.id);
 if(candidateUrls.has(c.proposed_url)||currentUrls.has(c.proposed_url)||pages.has(c.proposed_url))issues.push('Duplicate candidate/production URL '+c.proposed_url);
 candidateUrls.add(c.proposed_url);
 const t=norm(c.working_title);
 if(candidateTitles.has(t)||currentTitles.has(t))issues.push('Duplicate topic title '+c.id);
 candidateTitles.add(t);
 assert(c.proposed_url.startsWith(c.hub)&&c.proposed_url.endsWith('/'),'Candidate URL not under proposed hub '+c.id);
 assert(parentMap.has(c.parent_id)&&childMap.get(c.category_id)===c.parent_id,'Invalid candidate taxonomy '+c.id);
 assert(c.parent_pillar_url===parentMap.get(c.parent_id)?.url,'Wrong parent pillar '+c.id);
 assert(c.primary_or_supporting==='SUPPORTING','Proposal must not displace existing primary commercial page '+c.id);
 catCounts.set(c.category_id,(catCounts.get(c.category_id)||0)+1);
}
for(const parent of taxonomy.parents)for(const child of parent.children){
 const existing=base30.filter(p=>p.category_id===child.id).length;
 assert(existing+(catCounts.get(child.id)||0)===child.planned_capacity,'Category planning capacity mismatch '+child.id);
}
assert(link.pages_crawled===17&&link.graph.length===17,'A4 must inventory all 17 production pages');
assert(link.recommendations.add_link.length===10,'A4 add-link proposals missing');
assert(link.recommendations.change_anchor.length===2,'A4 anchor-change proposals missing');
assert(link.recommendations.remove_link.length===0,'No removals approved');
const urlset=new Set(link.graph.map(x=>x.url));
for(const x of link.graph){
 assert(pages.has(x.url),'A4 graph includes unpublished URL '+x.url);
 for(const y of x.outgoing)if(y.url.startsWith('/'))assert(urlset.has(y.url),'A4 broken internal content URL '+y.url);
}
for(const x of link.recommendations.add_link)assert(urlset.has(x.from)&&urlset.has(x.to)&&x.status==='IMPLEMENTED_VERIFIED','A4 proposal target/action invalid '+x.id);
assert(cann.baseline.published_urls===17&&cann.baseline.published_articles===5,'A5 publication baseline mismatch');
assert(cann.article_actions.length===5&&cann.article_actions.every(a=>a.action==='KEEP'&&!a.merge&&!a.redirect&&!a.rewrite),'A5 unexpectedly authorizes merge/edit');
assert(cann.actual_cannibalization_confirmed===false,'A5 cannot assert confirmed cannibalization');
const held=gap.candidates.filter(c=>c.status==='HOLD_FOR_INTENT_REVIEW').length;
if(held<1)warnings.push('No near-duplicate intent candidates are quarantined');
const result={verdict:issues.length?'FAIL':'PASS',published_articles:state.published_ids.length,existing_plan:plan.articles.length,candidates:gap.candidates.length,
 held_intent_review:held,categories:catCounts.size,graph_urls:link.graph.length,new_link_proposals:link.recommendations.add_link.length,
 issues,warnings,network_metrics:'NOT VERIFIED (GSC/Ubersuggest quota)'};
console.log('GROWTH_A4_A6_QA '+JSON.stringify(result));
if(issues.length)process.exit(1);
