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
check(plan.articles.length===30&&state.published_ids.length===5&&!state.enabled,'Writer production state changed');
check(queue.status==='PAUSED'&&queue.queue.length===0,'Writer queue changed');
check(cfg.allowed_hubs.length===4,'Factory allowed hubs changed');
const allIds=new Set(plan.articles.map(x=>x.id)),seen=new Set();
for(const c of source.candidates){
 check(!allIds.has(c.id)&&!seen.has(c.id),'Duplicate candidate ID '+c.id);seen.add(c.id);
 const matching=review.reviews.filter(x=>x.id===c.id);
 check(matching.length===1,'Missing or duplicated review '+c.id);
 if(!matching.length)continue;
 const x=matching[0],held=c.status==='HOLD_FOR_INTENT_REVIEW';
 check(x.proposed_url===c.proposed_url&&x.category_id===c.category_id,'Candidate identity changed '+c.id);
 check(x.decision===(held?'HOLD_CONSOLIDATION_REVIEW':'PRE_SCREENED_NOT_PUBLICATION_APPROVED'),'Hold/approval mismatch '+c.id);
 check(!x.serp_verified&&!x.facts_verified,'Invented evidence '+c.id);
 check(x.current_factory_hub_supported===cfg.allowed_hubs.includes(c.hub),'Hub status mismatch '+c.id);
 check(x.required_checks.includes('VERIFY_SEARCH_INTENT_AND_SERP'),'Missing SERP gate '+c.id);
}
check(source.candidates.filter(c=>c.status==='HOLD_FOR_INTENT_REVIEW').length===12,'Unexpected hold count');
check(review.safety.candidates_published===0&&review.safety.candidates_written_to_writer_queue===0,'Unauthorized content promotion');
if(errors.length){console.error(errors.slice(0,60).join('\n'));process.exit(1)}
console.log('A6_REVIEW_QA_PASS reviewed=270 pending_SERP_and_sources=258 HOLD=12 unsupported_hubs=110 factory=PAUSED');
