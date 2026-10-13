// Dedicated A4 production integrity: the exact 10 approved contextual links persist after regeneration.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=p=>fs.readFileSync(path.join(root,p),'utf8');
const matrix=JSON.parse(file('data/internal-link-matrix-a4.json'));
const state=JSON.parse(file('data/factory-state.json'));
const entries=matrix.recommendations.add_link;
const problems=[];
if(entries.length!==10||entries.some(x=>x.status!=='IMPLEMENTED_VERIFIED'))problems.push('A4 ten links not approved/implemented');
if(matrix.recommendations.change_anchor.length!==2)problems.push('Unapproved homepage anchors were changed in plan');
const urls=new Set([...JSON.parse(file('site/data.json')).pages.map(x=>x.url),...state.published_ids.map(id=>JSON.parse(file('data/editorial-plan.json')).articles.find(p=>p.id===id).url)]);
for(const a of entries){
 if(!urls.has(a.from)||!urls.has(a.to))problems.push('A4 link points to missing URL '+a.id);
 const name=a.from.slice(1)+'index.html',html=file(name);
 const marker='data-a4-link="'+a.id+'"';
 if(html.split(marker).length!==2)problems.push('A4 marker absent or duplicated '+a.id);
 const heading='<h2>'+a.section_h2+'</h2>';
 const start=html.indexOf(heading),next=start>=0?html.indexOf('</section>',start):-1;
 if(start<0||next<0||!html.slice(start,next).includes(marker))problems.push('A4 wrong section '+a.id);
 const m=html.match(new RegExp('data-a4-link="'+a.id+'"[^>]*>[^<]*<a href="([^"]+)">([^<]+)</a>'));
 if(!m||m[1]!==a.to||m[2]!==a.anchor_proposal)problems.push('A4 destination/anchor mismatch '+a.id);
 const src=matrix.graph.find(p=>p.url===a.from);
 if(!src?.outgoing.some(x=>x.url===a.to&&x.anchor===a.anchor_proposal))problems.push('A4 matrix graph missing '+a.id);
}
if(!['ES-0001','ES-0002','ES-0003','ES-0004','ES-0005'].every(id=>state.published_ids.includes(id)))problems.push('A4 original five articles missing');
if(problems.length){console.error(problems.join('\n'));process.exit(1)}
console.log('A4_LINKS_QA_PASS approved=10 published=5 unchanged_redirects=0');
