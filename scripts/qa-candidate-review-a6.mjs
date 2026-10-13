// A6 editorial review safety: verifies 270 per-ID decisions without promoting posts to the writer queue.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const source=read('data/editorial-candidates-270-a6.json'),review=read('data/editorial-review-270-a6.json');
const plan=read('data/editorial-plan.json'),state=read('data/factory-state.json'),queue=read('data/writer-queue.json');
const cfg=read('data/factory-config.json'),errors=[],check=(p,m)=>{if(!p)errors.push(m)};
check(source.candidates.length===270&&review.reviews.length===270,'Expected 270 candidate+review records');
check(review.summary.holds===12&&review.summary.prescreened===258,'Expected 12 HOLD and 258 pending validation');
check(review.summary.unsupported_hub===110,'Expected 110 topics outside present factory hub allowlist');
check(plan.articles.length===300&&['ES-0001','ES-0002','ES-0003','ES-0004','ES-0005'].every(id=>state.published_ids.includes(id)),'Expanded plan or original articles missing');
check(queue.queue.every(r=>r.status==='PLANNED'&&!review.reviews.some(v=>v.id===r.id&&v.decision==='HOLD_CONSOLIDATION_REVIEW')),'HOLD present in writer queue');
check(cfg.allowed_hubs.length===7,'Expected 7 supported factory hubs');
const allIds=new Set(plan.articles.map(x=>x.id)),seen=new Set();
for(const c of source.candidates){
 check(!seen.has(c.id),'Duplicate candidate ID '+c.id);seen.add(c.id);
 const planned=plan.articles.find(r=>r.id===c.id);check(Boolean(planned),'Missing planned candidate '+c.id);
 if(planned)check(planned.url===c.proposed_url&&planned.category_id===c.category_id,'Candidate mismatch '+c.id);
 const matching=review.reviews.filter(x=>x.id===c.id);
 check(matching.length===1,'Missing or duplicated review '+c.id);
 if(!matching.length)continue;
 const x=matching[0],held=c.status==='HOLD_FOR_INTENT_REVIEW';
 check(x.proposed_url===c.proposed_url&&x.category_id===c.category_id,'Candidate identity changed '+c.id);
 check(x.decision===(held?'HOLD_CONSOLIDATION_REVIEW':'PRE_SCREENED_NOT_PUBLICATION_APPROVED'),'Hold/approval mismatch '+c.id);
 check(!x.serp_verified&&!x.facts_verified,'Invented evidence '+c.id);
 check(x.current_factory_hub_supported===['/guia-de-alquiler/','/tipos-de-motos/scooters/','/tipos-de-motos/motos-50cc/','/precios/'].includes(c.hub),'Historical A6 hub annotation drift '+c.id);
 check(x.required_checks.includes('VERIFY_SEARCH_INTENT_AND_SERP'),'Missing SERP gate '+c.id);
}
check(source.candidates.filter(c=>c.status==='HOLD_FOR_INTENT_REVIEW').length===12,'Unexpected hold count');
check(review.safety.candidates_published===0&&review.safety.candidates_written_to_writer_queue===0,'Historical A6 snapshot mutated');
for(const c of source.candidates.filter(x=>x.status==='HOLD_FOR_INTENT_REVIEW'))check(plan.articles.find(p=>p.id===c.id)?.status==='HOLD_FOR_INTENT_REVIEW','HOLD protection missing '+c.id);
if(errors.length){console.error(errors.slice(0,60).join('\n'));process.exit(1)}
console.log('A6_REVIEW_QA_PASS reviewed=270 pending_SERP_and_sources=258 HOLD=12 unsupported_hubs=110 factory=PAUSED');
