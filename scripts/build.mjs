// Rebuild all static HTML, canonical tags, breadcrumbs, schema and sitemap without dependencies.
// Usage: node scripts/build.mjs
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {addApprovedContextualLinks} from './seo-links-a4.mjs';
import {validateTaxonomy,decorateTaxonomy,taxonomyMenu,archiveUrl,parentCategorySection,categoryArchiveBody,articleCategoryTrail} from './taxonomy.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'site/data.json'),'utf8'));
const pillarFiles=['home','about','models','scooters','50cc','pricing','guide','deposit','faq','privacy','terms','zones','mobility'];
const pillars=new Map(pillarFiles.map(name=>{
 const p=JSON.parse(fs.readFileSync(path.join(root,'site/pillars',name+'.json'),'utf8'));
 if(!p.page||!Array.isArray(p.sections)||p.sections.length<6)throw Error('Malformed pillar: '+name);
 return [p.page,p];
}));
const bike="<svg viewBox=\"0 0 620 430\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Ilustración de una moto urbana color titanio azul\"><defs><linearGradient id=\"b\" x2=\"1\" y2=\"1\"><stop stop-color=\"#d9f6ff\"/><stop offset=\".6\" stop-color=\"#75beeb\"/><stop offset=\"1\" stop-color=\"#265e85\"/></linearGradient></defs><ellipse cx=\"305\" cy=\"384\" rx=\"240\" ry=\"18\" fill=\"#02101e\" opacity=\".4\"/><circle cx=\"147\" cy=\"321\" r=\"80\" fill=\"#111b27\" stroke=\"#adc9dc\" stroke-width=\"9\"/><circle cx=\"147\" cy=\"321\" r=\"49\" fill=\"#273e55\" stroke=\"#79b2d1\" stroke-width=\"12\"/><circle cx=\"147\" cy=\"321\" r=\"17\" fill=\"#c9e8f7\"/><circle cx=\"477\" cy=\"321\" r=\"80\" fill=\"#111b27\" stroke=\"#adc9dc\" stroke-width=\"9\"/><circle cx=\"477\" cy=\"321\" r=\"49\" fill=\"#273e55\" stroke=\"#79b2d1\" stroke-width=\"12\"/><circle cx=\"477\" cy=\"321\" r=\"17\" fill=\"#c9e8f7\"/><path d=\"m147 318 61-94 136 14 133 82\" fill=\"none\" stroke=\"#c3eafc\" stroke-width=\"17\" stroke-linecap=\"round\"/><path d=\"M203 205q40-31 130-27l56 19 65 85-69 8-45-34-79 20-40 51-94-11z\" fill=\"url(#b)\" stroke=\"#dff6ff\" stroke-width=\"5\"/><path d=\"M206 201q35-29 145-23l11 22-133 24z\" fill=\"#101c2a\"/><path d=\"m341 180 49-63 25 8-9 29 46 80-36 5z\" fill=\"url(#b)\" stroke=\"#e6faff\" stroke-width=\"4\"/><path d=\"m404 123 35-32 45 0\" stroke=\"#d4ecfa\" stroke-width=\"9\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"m472 91 10-10\" stroke=\"#0b1825\" stroke-width=\"13\" stroke-linecap=\"round\"/><path d=\"m377 131-47-24-21-1\" stroke=\"#d2e9f5\" stroke-width=\"9\" stroke-linecap=\"round\" fill=\"none\"/><path d=\"M423 228q26-8 39-2l25 40-53 12z\" fill=\"#b1e7ff\" stroke=\"#e3faff\" stroke-width=\"4\"/><circle cx=\"453\" cy=\"232\" r=\"12\" fill=\"#fff\"/><path d=\"m279 274 100 9\" stroke=\"#144061\" stroke-width=\"9\" stroke-linecap=\"round\"/></svg>";
function generate(c){
 const out={}, base=c.site.base, B=c.business, E=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"), abs=url=>base.slice(0,-1)+url, link=(url,label)=>`<a href="${E(url)}">${E(label)}</a>`;
 const pagesByUrl=new Map(c.pages.map(page=>[page.url,page]));
 const get=url=>pagesByUrl.get(url);
 const nav=p=>taxonomyMenu(c.taxonomy,c.pages,c.liveCategories,p,c.navExtras);
 const layoutHead=p=>`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${E(p.desc)}"><meta name="theme-color" content="#101820"><meta name="google-site-verification" content="${E(c.site.googleSiteVerification)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${abs(p.url)}"><link rel="icon" type="image/svg+xml" href="/assets/favicon.svg"><link rel="stylesheet" href="/assets/css/theme.css"><meta property="og:type" content="website"><meta property="og:locale" content="es_ES"><meta property="og:title" content="${E(p.title)}"><meta property="og:description" content="${E(p.desc)}"><meta property="og:url" content="${abs(p.url)}"><meta name="twitter:card" content="summary"><title>${E(p.title)}</title>${schema(p)}</head><body>`;
 function schema(p){const graph=[{"@type":"LocalBusiness","@id":base+"#organization",name:B.name,telephone:B.tel,url:base,hasMap:B.maps,openingHoursSpecification:[{"@type":"OpeningHoursSpecification",dayOfWeek:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],opens:B.hours.split("–")[0],closes:B.hours.split("–")[1]}],address:{"@type":"PostalAddress",streetAddress:"112 Nguyễn Văn Cừ",addressLocality:"Bồ Đề, Long Biên, Hanói",addressCountry:"VN"}},{"@type":"WebSite","@id":base+"#website",url:base,name:c.site.title,inLanguage:"es",publisher:{"@id":base+"#organization"}},{"@type":"WebPage","@id":abs(p.url)+"#webpage",url:abs(p.url),name:p.title,description:p.desc,inLanguage:"es",isPartOf:{"@id":base+"#website"}}];if(p.url!=="/"){const li=[{"@type":"ListItem",position:1,name:"Inicio",item:base}];if(p.type==="taxonomy-archive"){const parent=c.taxonomy.parents.find(x=>x.id===p.parent_id);if(!parent)throw Error("Archive parent not found");li.push({"@type":"ListItem",position:2,name:parent.label,item:abs(parent.url)},{"@type":"ListItem",position:3,name:p.h1,item:abs(p.url)});}else{let u="/";p.url.split("/").filter(Boolean).forEach((part,i)=>{u+=part+"/";li.push({"@type":"ListItem",position:i+2,name:get(u)?.h1||part,item:abs(u)})});}graph.push({"@type":"BreadcrumbList",itemListElement:li})}if(p.type==="faq"){graph.push({"@type":"FAQPage",mainEntity:c.faqs.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))})}return `<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@graph":graph}).replace(/</g,"\\u003c")}</script>`;}
 const header=p=>`<a class="skip" href="#content">Saltar al contenido</a><header class="header"><div class="wrap top"><a class="logo" href="/"><span class="mark">N</span><span>NGUYỄN TÚ<small>MOTO RENTAL · HANÓI</small></span></a><nav class="nav" aria-label="Navegación principal">${nav(p)}</nav><div class="tools"><button id="theme-toggle" class="tool" type="button" aria-label="Cambiar tema">◐</button><button id="menu-toggle" class="tool mobile-trigger" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Abrir menú">☰</button></div></div><nav id="mobile-nav" class="wrap mobile-nav" aria-label="Menú móvil" hidden>${nav(p)}</nav></header>`;
 const footerNav=[
   ['Inicio','/'],...c.taxonomy.parents.filter(parent=>pagesByUrl.has(parent.url)).map(parent=>[parent.nav_label,parent.url]),
   ['FAQ','/faq/'],['Contacto','/contacto/']
 ].map(([label,url])=>{
   const extras=(c.navExtras||{})[url]||[];
   return '<div class="footer-nav-group">'+link(url,label)+
     extras.map(([name,href])=>'<div class="footer-nav-child">'+link(href,name)+'</div>').join('')+'</div>';
 }).join('');
 const footerTopics=c.taxonomy.parents.map(parent=>{
   const entries=parent.children.map(child=>{
     const archive=archiveUrl(parent,child);
     const live=(c.liveCategories.get(child.id)||[]).length;
     const href=pagesByUrl.has(archive)?archive:(live>0?parent.url+'#categoria-'+child.id:null);
     return href?link(href,child.label):'';
   }).filter(Boolean).join('');
   return '<div class="footer-topic-group"><strong>'+E(parent.label)+'</strong>'+entries+'</div>';
 }).join('');
 const footer=`<footer class="footer"><div class="wrap"><div class="foot-grid"><div><h3>NGUYỄN TÚ · HANÓI</h3><p>${E(B.address)}</p><p>${E(B.hours)} · Todos los días</p><p><a href="tel:${B.tel}">${E(B.international)}</a></p><p>${link(B.maps,"Ver ubicación en Google Maps ↗")}</p></div><div><h3>Navegación principal</h3><nav class="foot-links" aria-label="Navegación del sitio">${footerNav}</nav></div><div><h3>Temas y subcategorías</h3><nav class="foot-links footer-topics" aria-label="Categorías y subcategorías del sitio">${footerTopics}</nav></div><div><h3>Información</h3><p>Alquiler de motos en Hanói. Comprueba modelo, precio y condiciones antes de reservar.</p><p>${link("/faq/","Preguntas frecuentes")}</p><p>${link("/contacto/","Contacto y ubicación")}</p></div></div><div class="foot-bottom"><span>© ${new Date().getUTCFullYear()} ${E(B.name)}. Información orientativa.</span><span>Diseño Blue Titanium · Español</span></div></div></footer>`;
 const callout=`<section class="callout"><div class="wrap"><div><p class="eyebrow">SIGUIENTE PASO</p><h2>Elige tu moto. Confirma cada detalle.</h2><p>Precios, depósito y entrega deben acordarse antes de reservar.</p></div><a class="btn btn-blue" href="tel:${B.tel}">Llamar · ${E(B.phone)} ↗</a></div></section>`;
 const breadcrumbs=p=>{if(p.type==="taxonomy-archive"){const parent=c.taxonomy.parents.find(x=>x.id===p.parent_id);if(!parent)throw Error("Archive parent not found");return `<nav class="crumb" aria-label="Ruta de navegación">${link("/","Inicio")} / ${link(parent.url,parent.label)} / ${E(p.h1)}</nav>`;}let u="/";return p.url==="/"? "" : `<nav class="crumb" aria-label="Ruta de navegación">${link("/","Inicio")}${p.url.split("/").filter(Boolean).map(part=>{u+=part+"/";return ` / ${u===p.url?E(get(u)?.h1||part):link(u,get(u)?.h1||part)}`}).join("")}</nav>`};
 const top=p=>`<section class="page-top"><div class="wrap">${breadcrumbs(p)}<p class="eyebrow">${E(p.label)}</p><h1>${E(p.h1)}</h1><p class="lead">${E(p.intro)}</p></div></section>`;
 const groups=[["Motos semiautomáticas","Honda Wave y referencias por día, semana y mes.","/tipos-de-motos/"],["Scooters automáticos","Honda Vision, Air Blade, Click y Mio; compara condiciones.","/tipos-de-motos/scooters/"],["Motos de 50 cc","Precio orientativo, depósito y requisitos legales.","/tipos-de-motos/motos-50cc/"]];
 const steps=[["Seleccionar el vehículo","Piensa en tu experiencia, ruta y clase de moto.","/tipos-de-motos/"],["Comparar precios","Consulta precios, duración, depósito y costes de entrega.","/precios/"],["Confirmar el acuerdo","Verifica documentación, garantías y devolución.","/guia-de-alquiler/documentacion-y-deposito/"]];
 const cards=items=>`<div class="cards">${items.map(([h,t,u],i)=>`<article class="card"><span class="index">${String(i+1).padStart(2,"0")} / EXPLORAR</span><h3>${E(h)}</h3><p>${E(t)}</p>${link(u,"Descubrir ↗")}</article>`).join("")}</div>`;
 const faq=list=>`<div class="faq">${list.map(([q,a])=>`<details><summary>${E(q)}</summary><p>${E(a)}</p></details>`).join("")}</div>`;
 const prices=()=>`<div class="table-scroll"><table><caption>Tarifas orientativas en VND</caption><thead><tr><th>Modelo</th><th>Día</th><th>Semana</th><th>Mes</th><th>Depósito</th></tr></thead><tbody>${c.prices.map(r=>`<tr>${r.map((v,i)=>i===0?`<th scope="row">${E(v)}</th>`:`<td>${E(v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div><div class="note">Precios y depósitos de referencia. Confirma importe final, estado de la moto, entrega, documentación y devolución antes del contrato.</div>`;
 const home=()=>`<section class="hero"><div class="wrap hero-grid"><div><p class="eyebrow">ALQUILER DE MOTOS · HANÓI</p><h1>Hanói,<br>a tu <span style="color:#9bd8fd">ritmo.</span></h1><p class="lead">${E(c.pages[0].intro)}</p><div class="actions"><a class="btn btn-blue" href="/tipos-de-motos/">Explorar motos ↗</a><a class="btn" href="/precios/" style="color:#fff;border-color:#7c9fb9">Ver precios</a></div></div><div class="art">${bike}</div></div><div class="wrap rail"><span><strong>01</strong> · Atención directa</span><span><strong>02</strong> · Modelos variados</span><span><strong>03</strong> · Precios orientativos</span><span><strong>04</strong> · Long Biên, Hanói</span></div></section><section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">LA COLECCIÓN</p><h2>Cada ruta merece su propia moto.</h2><p>Conoce las categorías y pregunta por el modelo exacto antes de decidir.</p></div>${cards(groups)}</div></section><section class="section alt"><div class="wrap split"><div><p class="eyebrow">EL VIAJE COMIENZA AQUÍ</p><h2>Información antes de aceleración.</h2></div><div><p>Alquilar una moto no es solo elegir cilindrada. Importan la duración, el depósito, la documentación y las condiciones del contrato.</p><p>Este sitio organiza en español las referencias publicadas por Nguyễn Tú, con una guía sencilla para preparar tu consulta.</p>${link("/guia-de-alquiler/","Leer la guía completa ↗")}</div></div></section><section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">ANTES DE RESERVAR</p><h2>Tres pasos para empezar bien.</h2></div>${cards(steps)}</div></section><section class="section alt"><div class="wrap split"><div><p class="eyebrow">DUDAS REALES</p><h2>Respuestas sin promesas inventadas.</h2><p>Depósitos, modelos, licencias y horarios.</p></div><div>${faq(c.faqs.slice(0,6))}<p style="margin-top:20px">${link("/faq/","Ver las 20 preguntas frecuentes ↗")}</p></div></div></section>`;
 function body(p){if(p.type==="home")return home();let h=top(p);if(p.type==='taxonomy-parent')return h;if(p.type==='taxonomy-archive')return h+categoryArchiveBody(p,c.taxonomy,c.liveCategories);if(p.type==="models")return h+`<section class="section"><div class="wrap"><div class="section-head"><h2>Compara por tipo de viaje.</h2><p>Conducir una moto semiautomática no es lo mismo que llevar un scooter automático.</p></div>${cards(groups)}</div></section>`;
 if(p.type==="prices")return h+`<section class="section"><div class="wrap"><h2>Tarifas por modelo.</h2>${prices()}<div class="prose" style="padding-top:45px"><h2>Antes de confirmar</h2><p>Un precio mensual puede publicarse como un intervalo, y para vehículos eléctricos o algunos periodos de 50 cc es necesario pedir una cotización individual.</p><p>La tarifa semanal no se calcula automáticamente multiplicando el precio diario por siete. Solicita siempre el total que corresponda a tus fechas.</p>${link("/guia-de-alquiler/documentacion-y-deposito/","Documentación y depósito ↗")}</div></div></section>`;
 if(p.type==="guide")return h+`<section class="section"><div class="wrap"><h2>Planifica antes de circular.</h2>${cards(steps)}<div class="prose" style="padding-top:50px"><h2>Seguridad y requisitos legales</h2><p>Verifica permiso, normas locales, casco, seguro y estado del vehículo antes de conducir. No asumas que una categoría de moto te exime de requisitos sin comprobar la legislación aplicable.</p><p>Al recibir la moto, revisa neumáticos, frenos, espejos y luces, y confirma las condiciones de devolución.</p></div></div></section>`;
 if(p.type==="article"){
  const sections=p.article.sections.map(s=>'<section><h2>'+E(s.heading)+'</h2>'+s.paragraphs.map(t=>'<p>'+E(t)+'</p>').join('')+'</section>').join('');
  const faq=(p.article.faq||[]).map(t=>'<h3>'+E(t.question)+'</h3><p>'+E(t.answer)+'</p>').join('');
  const related=(p.article.related||[]).filter(u=>u!==p.url&&pagesByUrl.has(u)).slice(0,8).map(u=>link(u,get(u)?.title||u)).join(' ');
  return h+articleCategoryTrail(p,c.taxonomy,c.pages)+'<section class="section"><div class="wrap prose"><article>'+sections+(faq?'<section><h2>Preguntas relacionadas</h2>'+faq+'</section>':'')+'<div class="more"><h2>Lecturas relacionadas</h2>'+related+'</div></article></div></section>';
 }
 if(p.type==="faq")return h+`<section class="section"><div class="wrap"><p class="eyebrow">20 PREGUNTAS Y RESPUESTAS</p>${faq(c.faqs)}</div></section>`;
 if(p.type==="contact")return h+`<section class="section"><div class="wrap split"><div><h2>Confirma antes de desplazarte.</h2><p>Indica fecha, duración, modelo preferido y consulta la entrega antes de reservar.</p></div><div class="box"><h3>Nguyễn Tú</h3><dl><dt>Dirección</dt><dd>${E(B.address)}</dd><dt>Teléfono / Zalo</dt><dd>${link("tel:"+B.tel,B.phone)}</dd><dt>Internacional</dt><dd>${link("tel:"+B.tel,B.international)}</dd><dt>Horario</dt><dd>${E(B.hours)}, todos los días</dd></dl><div class="actions"><a class="btn btn-blue" href="tel:${B.tel}">Llamar ↗</a><a class="btn btn-outline" href="${B.maps}" target="_blank" rel="noopener noreferrer">Google Maps ↗</a></div></div></div></section>`;
 return h+`<section class="section"><div class="wrap prose">${p.sections.map(([title,content])=>`<section><h2>${E(title)}</h2><p>${E(content)}</p></section>`).join("")}<div class="more">${link("/precios/","Precios ↗")}${link("/faq/","FAQ ↗")}${link("/contacto/","Contacto ↗")}</div></div></section>`;}
 const longform=p=>{
  const record=pillars.get(p.url);if(!record)return '';
  const sections=record.sections.map((section,index)=>{
   if(typeof section.heading!=='string'||!Array.isArray(section.paragraphs)||section.paragraphs.length<2)throw Error('Bad SEO section '+p.url);
   const paragraphs=section.paragraphs.map(t=>'<p>'+E(t)+'</p>').join('');
   const related=(section.links||[]).map(item=>{
    // Topic hubs may not exist during the protected five-article Factory smoke simulation.
    // Only emit links when the target is a real page in the current generated snapshot.
    if(!pagesByUrl.has(item.url))return '';
    return link(item.url,item.label);
   }).join('');
   return '<section class="seo-core-block" id="guia-'+(index+1)+'"><h2>'+E(section.heading)+'</h2>'+paragraphs+'<nav class="seo-core-related" aria-label="Lecturas relacionadas">'+related+'</nav></section>';
  }).join('');
  return '<section class="section seo-core-longform" aria-label="Guía ampliada"><div class="wrap prose"><div class="section-head"><p class="eyebrow">INFORMACIÓN ÚTIL · HANÓI</p><h2>Guía práctica y respuestas verificables</h2></div>'+sections+'</div></section>';
 };
 for(const p of c.pages){const file=p.url==="/"? "index.html":p.url.slice(1)+"index.html";out[file]=layoutHead(p)+header(p)+`<main id="content">${body(p)}${longform(p)}${callout}</main>`+footer+`<script src="/assets/js/app.js" defer></script></body></html>`;}
 out["404.html"]=`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Página no encontrada · Nguyễn Tú</title><link rel="stylesheet" href="/assets/css/theme.css"></head><body><a class="skip" href="#content">Saltar al contenido</a><header class="header"><div class="wrap top"><a class="logo" href="/"><span class="mark">N</span><span>NGUYỄN TÚ<small>MOTO RENTAL · HANÓI</small></span></a><nav class="nav" aria-label="Navegación principal"><a href="/tipos-de-motos/">Tipos de motos</a><a href="/precios/">Precios</a><a href="/guia-de-alquiler/">Guías</a><a href="/zonas-de-hanoi/">Zonas</a><a href="/rutas-y-movilidad/">Rutas</a><a href="/faq/">FAQ</a><a href="/contacto/">Contacto</a></nav><div class="tools"><button id="theme-toggle" class="tool" type="button" aria-label="Cambiar tema">◐</button><button id="menu-toggle" class="tool mobile-trigger" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Abrir menú">☰</button></div></div><nav id="mobile-nav" class="wrap mobile-nav" aria-label="Menú móvil" hidden><a href="/tipos-de-motos/">Tipos de motos</a><a href="/precios/">Precios</a><a href="/guia-de-alquiler/">Guías</a><a href="/zonas-de-hanoi/">Zonas</a><a href="/rutas-y-movilidad/">Rutas</a><a href="/faq/">FAQ</a><a href="/contacto/">Contacto</a></nav></header><main id="content"><section class="page-top"><div class="wrap"><nav class="crumb" aria-label="Ruta de navegación"><a href="/">Inicio</a> / Página no encontrada</nav><p class="eyebrow">ERROR 404</p><h1>Página no encontrada.</h1><p class="lead">La dirección no está disponible. Puedes volver al inicio o continuar con nuestras guías de alquiler de motos en Hanói.</p></div></section><section class="section"><div class="wrap"><div class="section-head"><h2>Continúa explorando</h2><p>Encuentra información práctica y páginas existentes de nuestro sitio.</p></div><div class="cards"><article class="card"><span class="index">01 / EXPLORAR</span><h3>Tipos de motos</h3><p>Compara opciones de motos y scooters en Hanói.</p><a href="/tipos-de-motos/">Ver motos ↗</a></article><article class="card"><span class="index">02 / EXPLORAR</span><h3>Precios y condiciones</h3><p>Consulta tarifas orientativas y términos antes de reservar.</p><a href="/precios/">Ver precios ↗</a></article><article class="card"><span class="index">03 / EXPLORAR</span><h3>Guía de alquiler</h3><p>Prepara documentación, entrega y devolución de la moto.</p><a href="/guia-de-alquiler/">Leer guía ↗</a></article></div><div class="actions"><a class="btn btn-blue" href="/">Volver al inicio ↗</a><a class="btn btn-outline" href="/contacto/">Contacto</a></div></div></section></main>${footer}<script src="/assets/js/app.js" defer></script></body></html>`;
 out["robots.txt"]=`User-agent: *\nAllow: /\nSitemap: ${base}sitemap.xml\n`;
 out["sitemap.xml"]=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${c.pages.map(p=>`<url><loc>${abs(p.url)}</loc></url>`).join("")}</urlset>`;
 return out;
}

const registry=JSON.parse(fs.readFileSync(path.join(root,'data/editorial-plan.json'),'utf8')).articles;
const published=JSON.parse(fs.readFileSync(path.join(root,'data/factory-state.json'),'utf8')).published_ids;
const taxonomy=JSON.parse(fs.readFileSync(path.join(root,'site/taxonomy.json'),'utf8'));
validateTaxonomy(taxonomy,registry,published,data.pages);
const approvedLinks=JSON.parse(fs.readFileSync(path.join(root,'data/internal-link-matrix-a4.json'),'utf8')).recommendations.add_link;
const accepted=[];
const registryById=new Map(registry.map(row=>[row.id,row]));
const usedUrls=new Set(data.pages.map(page=>page.url));
for(const id of published){
 const row=registryById.get(id);
 if(!row)throw Error('Unplanned published article '+id);
 const article=JSON.parse(fs.readFileSync(path.join(root,'content/articles',id+'.json'),'utf8'));
 if(article.id!==row.id)throw Error('Bad article ID '+id);
 const page={url:row.url,type:'article',title:article.title,desc:article.description,h1:article.h1,intro:article.intro,
 label:'ARTÍCULO · '+row.primary_keyword,hub:row.hub,parent_id:row.parent_id,category_id:row.category_id,article};
 if(usedUrls.has(page.url))throw Error('Duplicate canonical '+page.url);
 usedUrls.add(page.url);
 data.pages.push(page);accepted.push(page);
}
data.taxonomy=taxonomy;
data.liveCategories=decorateTaxonomy(taxonomy,data.pages,accepted);
const files=generate(data);
for(const page of accepted){
 const filename=page.url.slice(1)+'index.html';
 files[filename]=addApprovedContextualLinks(files[filename],page.url,approvedLinks);
}

const escapeHtml=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
for(const page of accepted){
 const filename=page.url.slice(1)+'index.html';
 const schema={'@context':'https://schema.org','@type':'Article',headline:page.title,description:page.desc,inLanguage:'es',
  mainEntityOfPage:data.site.base.slice(0,-1)+page.url,datePublished:page.article.published_at,
  dateModified:page.article.published_at,author:{'@type':'Organization',name:data.business.name},
  publisher:{'@type':'Organization',name:data.business.name}};
 files[filename]=files[filename].replace('</head>','<script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script></head>');
}
for(const page of data.pages.filter(p=>p.type!=='article'&&p.type!=='taxonomy-archive')){
 const html=parentCategorySection(page.url,taxonomy,data.liveCategories,data.pages);
 if(!html)continue;
 const filename=page.url==='/'?'index.html':page.url.slice(1)+'index.html';
 files[filename]=files[filename].replace('<section class="callout">',html+'<section class="callout">');
}
const check=process.argv.includes('--check');let stale=0;
for(const [p,s] of Object.entries(files)){
 const dest=path.join(root,p);
 if(check){if(!fs.existsSync(dest)||fs.readFileSync(dest,'utf8')!==s){stale++;console.error('STALE '+p)}}
 else{fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,s,'utf8')}
}
if(check&&stale)process.exitCode=1;
else console.log((check?'Verified ':'Generated ')+Object.keys(files).length+' HTML/SEO files; articles='+accepted.length);
