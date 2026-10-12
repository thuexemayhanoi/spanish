import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {fileURLToPath} from 'node:url';import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'spanish-factory-smoke-'));
const run=(file,arg)=>execFileSync(process.execPath,[file,...arg],{cwd:tmp,encoding:'utf8',stdio:'pipe'});
const read=p=>fs.readFileSync(path.join(tmp,p),'utf8');
try{
 fs.cpSync(root,tmp,{recursive:true,filter:s=>!s.split(path.sep).includes('.git')&&!s.split(path.sep).includes('node_modules')});
 // Isolate the writer smoke fixture from production publication progress.
 // Every invocation tests a fresh ES-0001 on a disposable local copy.
 const isolated=JSON.parse(read('data/factory-state.json'));
 isolated.enabled=false;isolated.blocked=false;isolated.published_ids=[];isolated.last_run=null;isolated.last_error=null;
 fs.writeFileSync(path.join(tmp,'data/factory-state.json'),JSON.stringify(isolated,null,2)+'\n');
 // Discard inbox copies from production so the fixture tests exactly one synthetic queued article.
 fs.rmSync(path.join(tmp,'_factory/inbox'),{recursive:true,force:true});
 fs.mkdirSync(path.join(tmp,'_factory/inbox'),{recursive:true});
 run('scripts/build.mjs',[]);

 run('scripts/build.mjs',['--check']);
 run('scripts/qa-factory.mjs',[]);
 const initial=JSON.parse(read('data/factory-state.json'));if(initial.published_ids.length!==0)throw Error('Smoke fixture requires zero published');
 run('scripts/factory.mjs',['resume']);
 run('scripts/factory.mjs',['refresh-queue']);
 const queue=JSON.parse(read('data/writer-queue.json'));if(queue.status!=='READY'||queue.queue[0].id!=='ES-0001')throw Error('Queue failed');
 const paragraph=('Para preparar un alquiler responsable en Hanói, conviene revisar los datos que ofrece el establecimiento, confirmar el modelo elegido y documentar por escrito cada coste antes de circular. ').repeat(12);
 const sections=[1,2,3,4].map(n=>({heading:'Apartado de prueba '+n,paragraphs:[paragraph,paragraph]}));
 const draft={id:'ES-0001',title:'Cómo alquilar una moto en Hanói: planificación práctica',description:'Consulta una guía práctica en español para preparar una consulta sobre alquiler de motos en Hanói, revisar precios, depósitos y condiciones antes de firmar.',h1:'Preparar el alquiler de una moto en Hanói',intro:paragraph,sections,faq:[],related:['/precios/','/faq/'],source_urls:[],status:'READY_FOR_QA'};
 fs.mkdirSync(path.join(tmp,'_factory/inbox'),{recursive:true});
 fs.writeFileSync(path.join(tmp,'_factory/inbox/ES-0001.json'),JSON.stringify(draft));
 run('scripts/factory.mjs',['process']);
 run('scripts/build.mjs',[]);
 run('scripts/qa-factory.mjs',[]);
 run('scripts/build.mjs',['--check']);
 const after=JSON.parse(read('data/factory-state.json'));
 if(after.published_ids.join(',')!=='ES-0001')throw Error('Published state bad');
 const article=read('guia-de-alquiler/pasos-para-alquilar-una-moto/index.html');
 if(!article.includes('"@type":"Article"'))throw Error('Article schema missing');
 if(!read('sitemap.xml').includes('/guia-de-alquiler/pasos-para-alquilar-una-moto/'))throw Error('Sitemap missing article');
 if(!read('guia-de-alquiler/index.html').includes('/guia-de-alquiler/pasos-para-alquilar-una-moto/'))throw Error('Hub backlink missing');
 const stateBefore=read('data/factory-state.json');
 run('scripts/factory.mjs',['process']);
 if(stateBefore!==read('data/factory-state.json'))throw Error('Idle process changed state');
 console.log('SMOKE_PASS: isolated published article, schema, hub links, sitemap and no-op idle');
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
