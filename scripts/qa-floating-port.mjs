#!/usr/bin/env node
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const app=read('assets/js/app.js');
const js=read('assets/js/floating-port.js');
const bot=read('assets/js/assistant.js');
const cfg=read('assets/js/business-config.js');
const css=read('assets/css/theme.css');
const index=JSON.parse(read('assets/chat/search-index.json'));
const html=read('index.html');
const required=[
 ['shared loader on every existing generated page',app.includes("portScript.src='/assets/js/floating-port.js'")],
 ['two bottom-floats',js.includes('id=\\\"quick-contact\\\"') && js.includes('id=\\\"chat-fab\\\"')],
 ['real URL links',js.includes('tel:+84942467674') && js.includes('https://wa.me/84942467674') && js.includes('https://zalo.me/0942467674') && js.includes('cid=7448790013669858019')],
 ['keyboard safe VisualViewport',js.includes('visualViewport') && js.includes('setChatKeyboard') && js.includes('positionFloats')],
 ['close/mutual exclusions',js.includes('setChat(false)')&&js.includes('setQC(false)')],
 ['source assistant features preserved',bot.includes('SiteSearch.prototype.search')&&bot.includes('Engine.prototype.reply')&&bot.includes('Session memory')],
 ['Spanish assistant',bot.includes('Spanish-first adapter')&&bot.includes('Consultar precios y depósitos')],
 ['genuine electric pricing',cfg.includes('"electric"')&&cfg.includes('"day": null')],
 ['theme-mapped float style',css.includes('--brand:var(--blue)')&&css.includes('.floating-chat-open .reader-toc')],
 ['index for all public pages',index.e.length===334 && new Set(index.e.map(x=>x.u)).size===334],
 ['published Spanish articles remain 300',JSON.parse(read('data/factory-state.json')).published_ids.length===300],
 ['original homepage untouched',html.includes('<link rel="canonical" href="https://es.rentbikehanoi.com/')]
];
const failures=required.filter(x=>!x[1]);
for(const [name,ok] of required)console.log((ok?'PASS ':'FAIL ')+name);
if(failures.length)process.exit(1);
