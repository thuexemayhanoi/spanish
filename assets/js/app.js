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
