/* Port of /web's two-bubble interface. Source behavior preserved; Spanish labels/colors. */
(function(){
 "use strict";
 if(document.getElementById("chat-panel")||document.getElementById("quick-contact"))return;
 document.body.insertAdjacentHTML("beforeend","<div class=\"quick-contact\" id=\"quick-contact\" data-open=\"false\">\n  <button class=\"qc-main\" type=\"button\" aria-expanded=\"false\" aria-label=\"Opciones de contacto\">\n    <svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M21 16.5v3a1.5 1.5 0 0 1-1.7 1.5A18.5 18.5 0 0 1 3 4.7 1.5 1.5 0 0 1 4.5 3h3A1.5 1.5 0 0 1 9 4.3c.1 1 .4 2 .7 2.9a1.5 1.5 0 0 1-.3 1.6L8 10.2a15 15 0 0 0 5.8 5.8l1.4-1.4a1.5 1.5 0 0 1 1.6-.3c.9.3 1.9.6 2.9.7a1.5 1.5 0 0 1 1.3 1.5z\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linejoin=\"round\"/></svg>\n  </button>\n  <div class=\"qc-actions\">\n    <a class=\"qc-btn\" href=\"tel:+84942467674\" aria-label=\"Llamar al 0942 467 674\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M21 16.5v3a1.5 1.5 0 0 1-1.7 1.5A18.5 18.5 0 0 1 3 4.7 1.5 1.5 0 0 1 4.5 3h3A1.5 1.5 0 0 1 9 4.3c.1 1 .4 2 .7 2.9a1.5 1.5 0 0 1-.3 1.6L8 10.2a15 15 0 0 0 5.8 5.8l1.4-1.4a1.5 1.5 0 0 1 1.6-.3c.9.3 1.9.6 2.9.7a1.5 1.5 0 0 1 1.3 1.5z\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linejoin=\"round\"/></svg><span class=\"qc-tip\">Llamar</span></a>\n    <a class=\"qc-btn\" href=\"https://wa.me/84942467674\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Contactar por WhatsApp\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M20.5 11.9a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.2-4.3a8.5 8.5 0 1 1 15.8-4.3z\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linejoin=\"round\"/><path d=\"M8.2 8.1c0 3.4 4.3 7.7 7.6 7.7l1.1-1.7-2.7-1.3-1 1a7.4 7.4 0 0 1-3.1-3.1l1-1-1.3-2.7-1.6 1.1z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linejoin=\"round\"/></svg><span class=\"qc-tip\">WhatsApp</span></a>\n    <a class=\"qc-btn\" href=\"https://zalo.me/0942467674\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Contactar por Zalo\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M20 11.6a8 8 0 0 1-11.5 7.2L4 20l1.2-4.4a8 8 0 1 1 14.8-4z\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linejoin=\"round\"/><path d=\"M9 9h6l-6 6h6\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg><span class=\"qc-tip\">Zalo</span></a>\n    <a class=\"qc-btn\" href=\"https://maps.google.com/maps?cid=7448790013669858019\" target=\"_blank\" rel=\"noopener\" aria-label=\"Ver ubicación en Google Maps\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linejoin=\"round\"/><circle cx=\"12\" cy=\"10\" r=\"2.6\" stroke=\"currentColor\" stroke-width=\"1.7\"/></svg><span class=\"qc-tip\">Maps</span></a>\n  </div>\n</div>\n\n\n\n<button class=\"chat-fab\" id=\"chat-fab\" type=\"button\" aria-expanded=\"false\" aria-controls=\"chat-panel\" aria-label=\"Abrir asistente\">\n  <svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M21 12a8.5 8.5 0 0 1-12.4 7.5L4 21l1.6-4.4A8.5 8.5 0 1 1 21 12z\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linejoin=\"round\"/><path d=\"M9 11.5h.01M12.5 11.5h.01M16 11.5h.01\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg>\n  <span class=\"chat-tip\">Pregúntanos</span>\n</button>\n<div class=\"chat-panel\" id=\"chat-panel\" hidden role=\"dialog\" aria-label=\"Asistente de alquiler de motos en Hanói\">\n  <div class=\"chat-head\">\n    <span class=\"chat-title\">Asistente de alquiler de motos en Hanói</span>\n    <button class=\"chat-close btn-icon\" type=\"button\" aria-label=\"Cerrar chat\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M6 6l12 12M18 6L6 18\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\"/></svg></button>\n  </div>\n  <div class=\"chat-log\" aria-live=\"polite\"></div>\n  <div class=\"chat-quick\">\n    <button type=\"button\" data-q=\"Precios\">Precios</button>\n    <button type=\"button\" data-q=\"Alquiler mensual\">Alquiler mensual</button>\n    <button type=\"button\" data-q=\"Precio de motos 50cc\">Motos 50cc</button>\n    <button type=\"button\" data-q=\"Dirección\">Dirección</button>\n    <button type=\"button\" data-q=\"Horario\">Horario</button>\n    <button type=\"button\" data-q=\"Contacto\">Contacto</button>\n  </div>\n  <form class=\"chat-input\">\n    <input type=\"text\" placeholder=\"Pregunta por motos, precios o ubicación…\" aria-label=\"Tu mensaje\" autocomplete=\"off\">\n    <button type=\"submit\" aria-label=\"Enviar\"><svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M4 12h14m-5-5 5 5-5 5\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg></button>\n  </form>\n</div>");
 // Shared source-of-truth data is loaded before the original assistant engine.
 function load(src,next){
   var script=document.createElement("script");
   script.src=src; script.async=false;
   if(next)script.onload=next;
   document.head.appendChild(script);
 }
 load("/assets/js/business-config.js",function(){
   load("/assets/js/assistant.js");
 });
  var qc = document.getElementById("quick-contact");
  /* Upgrade legacy published Quick Contact Email links without editing each HTML page.
     New pages already render WhatsApp from site/partials/floating-ui.html. */
  var legacyEmailBtn = qc ? qc.querySelector('.qc-actions a[href^="mailto:"]') : null;
  if (legacyEmailBtn) {
    var configuredWhatsApp = window.CONTACT_METHODS && window.CONTACT_METHODS.whatsapp &&
      window.CONTACT_METHODS.whatsapp.href;
    var phoneDigits = BUSINESS && BUSINESS.phoneTel ? BUSINESS.phoneTel.replace(/\D/g, "") : "";
    var whatsAppUrl = configuredWhatsApp || (phoneDigits ? "https://wa.me/" + phoneDigits : "");
    if (whatsAppUrl) {
      legacyEmailBtn.href = whatsAppUrl;
      legacyEmailBtn.target = "_blank";
      legacyEmailBtn.rel = "noopener noreferrer";
      legacyEmailBtn.setAttribute("aria-label", "Chat on WhatsApp");
      legacyEmailBtn.innerHTML = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M20.5 11.9a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.2-4.3a8.5 8.5 0 1 1 15.8-4.3z\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linejoin=\"round\"/><path d=\"M8.2 8.1c0 3.4 4.3 7.7 7.6 7.7l1.1-1.7-2.7-1.3-1 1a7.4 7.4 0 0 1-3.1-3.1l1-1-1.3-2.7-1.6 1.1z\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linejoin=\"round\"/></svg><span class=\"qc-tip\">WhatsApp</span>";
    }
  }
  var qcMain = qc ? qc.querySelector(".qc-main") : null;
  var chatFab = document.getElementById("chat-fab");
  var chatPanel = document.getElementById("chat-panel");
  var chatClose = chatPanel ? chatPanel.querySelector(".chat-close") : null;
  var chatInput = chatPanel ? chatPanel.querySelector(".chat-input input") : null;
  var chatKeyboardOpen = false;
  var maxVisualHeight = 0;

  function setQC(open) {
    if (!qc || !qcMain) return;
    qc.setAttribute("data-open", String(open));
    qcMain.setAttribute("aria-expanded", String(open));
  }
  function setChat(open) {
    if (!chatFab || !chatPanel) return;
    var wasOpen = !chatPanel.hidden;
    chatPanel.hidden = !open;
    chatFab.setAttribute("aria-expanded", String(open));
    if (open && !wasOpen) {
      /* assistant.js greets + lazily loads the search index on this event */
      try { chatPanel.dispatchEvent(new CustomEvent("chat:open")); } catch (e) {}
      /* Do not force the mobile keyboard open just because chat was opened.
         Desktop keeps the convenient autofocus. */
      var coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
      if (chatInput && !coarse) chatInput.focus();
    }
    if (!open) setChatKeyboard(false);
    positionFloats();
  }

  if (qcMain) qcMain.addEventListener("click", function () {
    var open = qc.getAttribute("data-open") === "true";
    setChat(false);           /* opening Quick Call collapses chat */
    setQC(!open);
    positionFloats();
  });

  if (chatFab) chatFab.addEventListener("click", function () {
    var open = !chatPanel.hidden;
    setQC(false);             /* opening chat collapses Quick Call */
    setChat(!open);
  });
  if (chatClose) chatClose.addEventListener("click", function () { setChat(false); chatFab.focus(); });

  document.addEventListener("click", function (e) {
    if (!qc || qc.getAttribute("data-open") !== "true") return;
    if (qc.contains(e.target)) return;
    setQC(false);
  });

  /* -------- Shared floating viewport manager --------
     On mobile, VisualViewport is the reliable source for the area above the
     software keyboard. The chat panel is fitted entirely inside that area. */
  var floatRAF = 0;

  function setChatKeyboard(open) {
    chatKeyboardOpen = !!open;
    if (chatPanel) chatPanel.setAttribute("data-keyboard-open", String(chatKeyboardOpen));
    document.body.classList.toggle("chat-keyboard-open", chatKeyboardOpen);
  }

  function positionFloats() {
    if (floatRAF) return;
    floatRAF = requestAnimationFrame(function () {
      floatRAF = 0;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var vv = window.visualViewport;
      var vvH = vv ? Math.round(vv.height) : vh;
      var vvTop = vv ? Math.round(vv.offsetTop || 0) : 0;

      if (!chatKeyboardOpen && vvH > maxVisualHeight) maxVisualHeight = vvH;
      if (!maxVisualHeight) maxVisualHeight = vvH;

      document.documentElement.style.setProperty("--vv-h", vvH + "px");

      var inputFocused = !!(chatInput && document.activeElement === chatInput);
      var keyboardReducedViewport = vv ? (maxVisualHeight - vvH > 80) : false;
      var keyboardOpen = inputFocused && keyboardReducedViewport;

      setChatKeyboard(keyboardOpen);

      if (keyboardOpen && chatPanel) {
        var gap = 8;
        var available = Math.max(240, vvH - gap * 2);
        var panelH = Math.min(520, available);
        var top = vvTop + Math.max(gap, vvH - panelH - gap);
        document.documentElement.style.setProperty("--chat-vv-top", Math.round(top) + "px");
        document.documentElement.style.setProperty("--chat-vv-height", Math.round(panelH) + "px");
      } else {
        document.documentElement.style.removeProperty("--chat-vv-top");
        document.documentElement.style.removeProperty("--chat-vv-height");
      }
    });
  }
  window.addEventListener("resize", positionFloats, { passive: true });
  window.addEventListener("orientationchange", positionFloats, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", positionFloats, { passive: true });
    window.visualViewport.addEventListener("scroll", positionFloats, { passive: true });
  }
  if (chatInput) {
    chatInput.addEventListener("focus", function () {
      /* Let Safari finish opening the keyboard before measuring. */
      window.setTimeout(positionFloats, 60);
      window.setTimeout(positionFloats, 240);
    });
    chatInput.addEventListener("blur", function () {
      window.setTimeout(function () {
        setChatKeyboard(false);
        positionFloats();
      }, 60);
    });
  }
  positionFloats();

  /* hide floating buttons while the full-screen menu (drawer) is open */
  var spanishMobileNav = document.getElementById("mobile-nav");
  if(spanishMobileNav){
    var syncMenuState = function(){
      var active = !spanishMobileNav.hidden;
      [qc,chatFab,chatPanel].forEach(function(el){
        if(el) (active ? el.setAttribute("data-float-hidden","") : el.removeAttribute("data-float-hidden"));
      });
      if(active){ setQC(false); setChat(false); }
    };
    new MutationObserver(syncMenuState).observe(spanishMobileNav,{attributes:true,attributeFilter:["hidden"]});
    syncMenuState();
  }

  /* Global Escape: close dropdowns, drawer, chat, quick contact; return focus to the chat button */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var chatWasOpen = chatPanel && !chatPanel.hidden;
    /* The Spanish theme owns its own navigation and Escape handling. */
    setQC(false);
    setChat(false);
    if (chatWasOpen && chatFab) chatFab.focus();
  });


 // Avoid overlapping Spanish article Table of Contents while the chat is open.
 var openPanel=document.getElementById("chat-panel");
 if(openPanel){new MutationObserver(function(){
   document.body.classList.toggle("floating-chat-open",!openPanel.hidden);
 }).observe(openPanel,{attributes:true,attributeFilter:["hidden"]});}
})();
