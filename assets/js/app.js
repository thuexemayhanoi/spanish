/* P0 navigation and theme controls. Zero dependencies; no content/URL mutation. */
(()=>{
  'use strict';
  const root=document.documentElement;
  const themeButton=document.getElementById('theme-toggle');
  const menuButton=document.getElementById('menu-toggle');
  const mobileNav=document.getElementById('mobile-nav');
  const desktopQuery=window.matchMedia('(min-width: 1121px)');
  const taxonomyGroups=[...document.querySelectorAll('.nav .nav-group, .mobile-nav .nav-group')];

  function setTheme(mode){
    const value=mode==='dark'?'dark':'light';
    root.dataset.theme=value;
    if(themeButton){
      themeButton.textContent=value==='dark'?'☀':'◐';
      themeButton.setAttribute('aria-label',value==='dark'?'Activar tema claro':'Activar tema oscuro');
      themeButton.setAttribute('title',value==='dark'?'Activar tema claro':'Activar tema oscuro');
    }
    try{localStorage.setItem('spanish-theme',value)}catch(_){}
  }
  let saved;
  try{saved=localStorage.getItem('spanish-theme')}catch(_){}
  setTheme(saved==='dark'||(!saved&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light');
  themeButton?.addEventListener('click',()=>setTheme(root.dataset.theme==='dark'?'light':'dark'));

  function closeGroups(except){
    for(const group of taxonomyGroups){
      if(group!==except&&group.open)group.open=false;
    }
  }
  function closeMenu(restoreFocus=false){
    if(!mobileNav||!menuButton)return;
    const wasOpen=!mobileNav.hidden;
    mobileNav.hidden=true;
    menuButton.setAttribute('aria-expanded','false');
    menuButton.setAttribute('aria-label','Abrir menú');
    closeGroups();
    if(restoreFocus&&wasOpen)menuButton.focus();
  }
  if(menuButton&&mobileNav){
    menuButton.addEventListener('click',()=>{
      if(!mobileNav.hidden){closeMenu();return;}
      closeGroups();
      mobileNav.hidden=false;
      menuButton.setAttribute('aria-expanded','true');
      menuButton.setAttribute('aria-label','Cerrar menú');
    });
    desktopQuery.addEventListener('change',event=>{
      if(event.matches)closeMenu();
    });
  }
  for(const group of taxonomyGroups){
    const summary=group.querySelector(':scope > summary');
    if(!summary)continue;
    group.addEventListener('toggle',()=>{
      if(group.open)closeGroups(group);
    });
    summary.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&group.open){
        group.open=false;
        event.preventDefault();
        summary.focus();
      }
    });
  }
  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    const opened=taxonomyGroups.find(g=>g.open);
    if(opened){
      closeGroups();
      const summary=opened.querySelector(':scope > summary');
      summary?.focus();
      event.preventDefault();
      return;
    }
    if(mobileNav&&!mobileNav.hidden){
      closeMenu(true);
      event.preventDefault();
    }
  });
  // P1 editorial utilities: overlay only (no reflow or article/SEO mutations).
  function initReader(){
    const article=document.querySelector('.prose article');
    if(!article)return;
    const headings=[...article.querySelectorAll('section > h2')];
    if(headings.length>=2){
      const toc=document.createElement('aside');
      toc.className='reader-toc';
      const details=document.createElement('details');
      const summary=document.createElement('summary');
      summary.textContent='Contenido';
      const nav=document.createElement('nav');
      nav.setAttribute('aria-label','Índice del artículo');
      const list=document.createElement('ol');
      headings.forEach((heading,index)=>{
        if(!heading.id)heading.id='seccion-'+(index+1);
        const item=document.createElement('li');
        const link=document.createElement('a');
        link.href='#'+heading.id;
        link.textContent=heading.textContent.trim();
        item.append(link);list.append(item);
        link.addEventListener('click',()=>{details.open=false});
      });
      nav.append(list);details.append(summary,nav);toc.append(details);
      document.body.append(toc);
      document.addEventListener('click',event=>{
        if(details.open&&!toc.contains(event.target))details.open=false;
      });
      document.addEventListener('keydown',event=>{
        if(details.open&&event.key==='Escape'){
          details.open=false;summary.focus();event.preventDefault();
        }
      });
    }
    const progress=document.createElement('div');
    progress.className='reading-progress';
    progress.setAttribute('aria-hidden','true');
    const track=document.createElement('span');
    progress.append(track);
    document.body.append(progress);
    let scheduled=false;
    function update(){
      scheduled=false;
      const bounds=article.getBoundingClientRect();
      const start=bounds.top+window.scrollY;
      const finish=start+bounds.height;
      const position=window.scrollY+window.innerHeight*.42;
      const percent=Math.max(0,Math.min(1,(position-start)/Math.max(1,finish-start)));
      track.style.transform='scaleX('+percent.toFixed(3)+')';
    }
    function schedule(){
      if(scheduled)return;
      scheduled=true;
      requestAnimationFrame(update);
    }
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule,{passive:true});
    update();
  }
  initReader();

  // P1.04 all-pages footer jump and lightweight sticky shadow
  const header=document.querySelector('.header');
  const footerBottom=document.querySelector('.footer .foot-bottom');
  if(footerBottom&&!footerBottom.querySelector('.footer-back-to-top')){
    const anchor=document.createElement('a');
    anchor.className='footer-back-to-top';
    anchor.href='#content';
    anchor.textContent='↑ Volver arriba';
    footerBottom.append(anchor);
  }
  // No floating back-to-top duplicates. The only site-owned Back to Top is in the footer.
  if(header){
    let frame=false;
    const updateShadow=()=>{
      frame=false;
      header.classList.toggle('is-scrolled',window.scrollY>10);
    };
    window.addEventListener('scroll',()=>{
      if(frame)return;
      frame=true;
      window.requestAnimationFrame(updateShadow);
    },{passive:true});
    updateShadow();
  }

  document.addEventListener('click',event=>{
    const target=event.target;
    if(!(target instanceof Element))return;
    const clickedGroup=target.closest('.nav-group');
    if(!clickedGroup)closeGroups();
    if(mobileNav&&!mobileNav.hidden&&!mobileNav.contains(target)&&!menuButton?.contains(target)){
      closeMenu();
    }
  });
})();
