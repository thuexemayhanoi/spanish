#!/usr/bin/env node
/* Zero dependencies; rebuild Spanish chatbot index from approved, published content. */
import fs from 'node:fs';
const site=JSON.parse(fs.readFileSync('site/data.json','utf8'));
const plan=JSON.parse(fs.readFileSync('data/editorial-plan.json','utf8')).articles;
const state=JSON.parse(fs.readFileSync('data/factory-state.json','utf8'));
const byId=new Map(plan.map(e=>[e.id,e]));
const entries=[];
for(const id of state.published_ids){
 const row=byId.get(id);
 if(!row)throw Error('Published article missing editorial assignment: '+id);
 const src=JSON.parse(fs.readFileSync('content/articles/'+id+'.json','utf8'));
 const sections=(src.sections||[]).map(s=>({h:s.heading,p:s.paragraphs||[]}));
 entries.push({u:row.url,t:src.title,head:[src.h1],s:[{h:src.h1,p:[src.intro||'']},...sections]});
}
for(const p of site.pages||[]){
 if(p.type==='article'||entries.some(x=>x.u===p.url))continue;
 entries.push({u:p.url,t:p.title,head:[p.h1||p.title],s:[{h:p.h1||p.title,p:[p.intro||p.desc||'']}]});
}
if(new Set(entries.map(x=>x.u)).size!==entries.length)throw Error('Duplicate chatbot search URLs');
const data=JSON.stringify({site:site.site.base.slice(0,-1),locale:'es',e:entries})+'\n';
const file='assets/chat/search-index.json';
if(process.argv.includes('--check')){
 if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==data)throw Error('Chat search index stale');
 console.log('Verified Spanish chat index: '+entries.length+' pages');
}else{
 fs.mkdirSync('assets/chat',{recursive:true});fs.writeFileSync(file,data);
 console.log('Generated Spanish chat index: '+entries.length+' pages');
}
