(function () {
  "use strict";

  if (window.__JDC_PILOT51__) return;
  window.__JDC_PILOT51__ = true;

  var RELEASE = "pilot51";
  var PARAM = "jdc-credits";
  var OPTIONS = ["0", "3", "4"];
  var LABELS = ["Current", "Credits before gallery", "Credits after gallery"];
  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : window.location.href;
  var CORE_URL = new URL("jdc-footer-pilot48.js", SCRIPT_URL).href;
  var requested = new URLSearchParams(window.location.search).get(PARAM);
  var previewActive = ["0", "1", "2", "3", "4"].indexOf(requested) !== -1;
  var option = requested === "1" || requested === "2" ? "3" : requested;
  var observer = null;
  var scheduled = false;

  function normalizeLegacyOption() {
    if (requested !== "1" && requested !== "2") return;
    var url = new URL(window.location.href);
    url.searchParams.set(PARAM, "3");
    window.history.replaceState(window.history.state, "", url.href);
  }

  function loadCore() {
    if (document.querySelector('script[data-jdc-pilot51-core="pilot48"]')) return;
    var core = document.createElement("script");
    core.src = CORE_URL;
    core.async = false;
    core.crossOrigin = "anonymous";
    core.setAttribute("data-jdc-pilot51-core", "pilot48");
    (document.head || document.documentElement).appendChild(core);
  }

  function ensureStyles() {
    if (!previewActive || document.getElementById("jdc-credits-preview-styles51")) return;
    var style = document.createElement("style");
    style.id = "jdc-credits-preview-styles51";
    style.textContent = [
      "#header{overflow:visible!important}",
      ".jdc-credits-preview-nav51{position:absolute!important;left:50%!important;top:50%!important;z-index:10001!important;display:flex!important;align-items:center!important;gap:3px!important;box-sizing:border-box!important;padding:4px!important;transform:translate(-50%,-50%)!important;border:1px solid #111!important;border-radius:999px!important;background:rgba(255,255,255,.96)!important;box-shadow:0 2px 18px rgba(0,0,0,.08)!important;color:#111!important;font-family:Arial,Helvetica,sans-serif!important;font-size:10px!important;line-height:1!important;white-space:nowrap!important;backdrop-filter:blur(10px)!important;-webkit-backdrop-filter:blur(10px)!important}",
      ".jdc-credits-preview-nav51>span{padding:0 6px 0 8px!important;text-transform:uppercase!important;letter-spacing:.04em!important;opacity:.62!important}",
      ".jdc-credits-preview-nav51>a{display:grid!important;place-items:center!important;box-sizing:border-box!important;min-width:25px!important;height:25px!important;padding:0 7px!important;border-radius:999px!important;color:#111!important;text-decoration:none!important;font:inherit!important}",
      ".jdc-credits-preview-nav51>a[aria-current='page']{background:#111!important;color:#fff!important}",
      ".jdc-credit-list51{display:flex!important;flex-direction:column!important;gap:8px!important;width:100%!important;margin:0!important;padding:0!important}",
      ".jdc-credit-item51{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:baseline!important;gap:3px 14px!important;min-width:0!important;margin:0!important;padding:0!important;font-family:inherit!important}",
      ".jdc-credit-name51{min-width:0!important;font-size:12px!important;font-weight:500!important;line-height:1.3!important;overflow-wrap:anywhere!important}",
      ".jdc-credit-role51{max-width:150px!important;color:rgba(0,0,0,.52)!important;font-size:8px!important;font-weight:400!important;letter-spacing:.055em!important;line-height:1.25!important;text-align:right!important;text-transform:uppercase!important;overflow-wrap:anywhere!important}",
      ".jdc-credit-item51[data-jdc-single='true'] .jdc-credit-name51{grid-column:1/-1!important}",
      "body[data-jdc-credits-option='3'] .jdc-project-body-block .sqs-html-content{white-space:normal!important}",
      "body[data-jdc-credits-option='3'] .jdc-project-title-block h1{font-family:inherit!important;font-weight:400!important}",
      "body[data-jdc-credits-option='4'].jdc-credits-layout4-ready51 .jdc-project-info-band{display:none!important}",
      "body[data-jdc-credits-option='4'] .jdc-clip-gallery-section{overflow:visible!important}",
      ".jdc-layout4-title51{box-sizing:border-box!important;width:100%!important;margin:0 0 clamp(30px,4vw,52px)!important;padding:0!important}",
      ".jdc-layout4-title51 h1{max-width:100%!important;margin:0!important;padding:0!important;color:#000!important;font-family:inherit!important;font-size:clamp(28px,3.1vw,44px)!important;font-weight:400!important;letter-spacing:-.035em!important;line-height:1.03!important;overflow-wrap:anywhere!important}",
      ".jdc-layout4-credits51{box-sizing:border-box!important;width:100%!important;max-width:760px!important;margin:clamp(40px,5vw,72px) 0 0 auto!important;padding:0!important}",
      "@media(max-width:767px){.jdc-credits-preview-nav51{gap:2px!important;padding:3px!important;font-size:9px!important}.jdc-credits-preview-nav51>span{display:none!important}.jdc-credits-preview-nav51>a{min-width:23px!important;height:23px!important;padding:0 6px!important}.jdc-credit-list51{gap:10px!important}.jdc-credit-item51{grid-template-columns:minmax(0,1fr)!important;gap:2px!important}.jdc-credit-role51{max-width:none!important;text-align:left!important}.jdc-layout4-title51{margin-bottom:28px!important}.jdc-layout4-credits51{max-width:none!important;margin-top:42px!important}}"
    ].join("");
    (document.head || document.documentElement).appendChild(style);
  }

  function optionUrl(value) {
    var url = new URL(window.location.href);
    url.searchParams.set(PARAM, value);
    return url.href;
  }

  function ensureSwitcher() {
    if (!previewActive || document.querySelector(".jdc-credits-preview-nav51")) return false;
    var header = document.querySelector("header#header");
    if (!header) return false;
    var nav = document.createElement("div");
    nav.className = "jdc-credits-preview-nav51";
    nav.setAttribute("role", "navigation");
    nav.setAttribute("aria-label", "Credits layout preview");
    var label = document.createElement("span");
    label.textContent = "Credits";
    nav.appendChild(label);
    OPTIONS.forEach(function (value, index) {
      var link = document.createElement("a");
      link.href = optionUrl(value);
      link.textContent = value;
      link.title = value + " — " + LABELS[index];
      link.setAttribute("aria-label", "Credits option " + value + ": " + LABELS[index]);
      if (value === option) link.setAttribute("aria-current", "page");
      nav.appendChild(link);
    });
    header.appendChild(nav);
    return true;
  }

  function internalUrl(link) {
    if (!link || !link.getAttribute("href")) return null;
    var raw = link.getAttribute("href");
    if (/^(#|mailto:|tel:|javascript:)/i.test(raw)) return null;
    try {
      var url = new URL(raw, document.baseURI);
      var isJdc = /(^|\.)josdiazcontreras\.com$/i.test(url.hostname) ||
        /(^|\.)josdiazcontreras\.squarespace\.com$/i.test(url.hostname) ||
        url.origin === window.location.origin;
      if (!isJdc) return null;
      var local = new URL(window.location.href);
      local.pathname = url.pathname;
      local.search = url.search;
      local.hash = url.hash;
      local.searchParams.set(PARAM, option);
      return local.href;
    } catch (error) {
      return null;
    }
  }

  function decorateInternalLinks() {
    if (!previewActive) return;
    Array.prototype.slice.call(document.querySelectorAll("a[href]")).forEach(function (link) {
      if (link.closest(".jdc-credits-preview-nav51")) return;
      var next = internalUrl(link);
      if (next) link.href = next;
    });
  }

  function splitCredit(text) {
    var value = String(text || "").replace(/\s+/g, " ").trim();
    var by = value.match(/^(.+?)\s+by\s+(.+)$/i);
    if (by) return { name: by[2].trim(), role: by[1].trim() };
    var colon = value.indexOf(":");
    if (colon > 0 && colon < value.length - 1) {
      return { name: value.slice(0, colon).trim(), role: value.slice(colon + 1).trim() };
    }
    var dash = value.match(/^(.+?)\s+[–—-]\s+(.+)$/);
    if (dash) return { name: dash[1].trim(), role: dash[2].trim() };
    return { name: value, role: "" };
  }

  function sourceLines(body) {
    return Array.prototype.slice.call(body.querySelectorAll("p")).map(function (paragraph) {
      return paragraph.textContent.replace(/\s+/g, " ").trim();
    }).filter(Boolean);
  }

  function makeList(lines) {
    var list = document.createElement("div");
    list.className = "jdc-credit-list51";
    lines.forEach(function (line) {
      var parts = splitCredit(line);
      var item = document.createElement("div");
      item.className = "jdc-credit-item51";
      if (!parts.role) item.setAttribute("data-jdc-single", "true");
      var name = document.createElement("span");
      name.className = "jdc-credit-name51";
      name.textContent = parts.name;
      item.appendChild(name);
      if (parts.role) {
        var role = document.createElement("span");
        role.className = "jdc-credit-role51";
        role.textContent = parts.role;
        item.appendChild(role);
      }
      list.appendChild(item);
    });
    return list;
  }

  function buildBeforeGallery(infoBand) {
    if (option !== "3" || !infoBand) return false;
    var body = infoBand.querySelector(":scope > .jdc-project-body-block");
    var content = body && body.querySelector(".sqs-html-content");
    if (!body || !content) return false;
    if (body.getAttribute("data-jdc-credits-layout") === "3") {
      window.requestAnimationFrame(positionBeforeGallery);
      return true;
    }
    var lines = sourceLines(body);
    if (!lines.length) return false;
    content.textContent = "";
    content.appendChild(makeList(lines));
    body.setAttribute("data-jdc-credits-layout", "3");
    window.requestAnimationFrame(positionBeforeGallery);
    return true;
  }

  function positionBeforeGallery() {
    if (option !== "3") return;
    var infoBand = document.querySelector("main .jdc-project-info-band");
    var gallery = document.querySelector(".jdc-clip-gallery-section");
    if (!infoBand || !gallery) return;
    takeOverSectionSpacing(gallery);
    gallery.style.setProperty("margin-top", "0px", "important");
    var infoRect = infoBand.getBoundingClientRect();
    var galleryRect = gallery.getBoundingClientRect();
    var gap = window.innerWidth <= 767 ? 28 : Math.max(30, Math.min(58, window.innerWidth * 0.042));
    var push = Math.max(0, infoRect.bottom + gap - galleryRect.top);
    gallery.style.setProperty("margin-top", Math.round(push) + "px", "important");
  }

  function takeOverSectionSpacing(gallery) {
    if (window.__JDC_SECTION_SPACING_OBSERVER42__) window.__JDC_SECTION_SPACING_OBSERVER42__.disconnect();
    if (window.__JDC_PILOT42_MUTATION_OBSERVER__) window.__JDC_PILOT42_MUTATION_OBSERVER__.disconnect();
    gallery.classList.remove("jdc-section-gap-transparent42");
    gallery.removeAttribute("data-jdc-section-gap");
    gallery.removeAttribute("data-jdc-section-gap-before");
    gallery.removeAttribute("data-jdc-section-gap-shift");
    var anchor = gallery.previousElementSibling;
    if (anchor) anchor.classList.remove("jdc-section-gap-anchor42");
  }

  function positionAfterGallery(gallery) {
    if (option !== "4" || !gallery) return;
    var shell = document.querySelector("main .jdc-project-lead-block .jdc-video-shell, main .jdc-project-lead-block [data-jdc-video], main .jdc-project-lead-block [data-config-video]");
    if (!shell) return;
    takeOverSectionSpacing(gallery);
    gallery.style.setProperty("margin-top", "0px", "important");
    var shellRect = shell.getBoundingClientRect();
    var galleryRect = gallery.getBoundingClientRect();
    var gap = window.innerWidth <= 767 ? 28 : Math.max(30, Math.min(58, window.innerWidth * 0.042));
    var pull = Math.max(0, galleryRect.top - shellRect.bottom - gap);
    gallery.style.setProperty("margin-top", (-Math.round(pull)) + "px", "important");
  }

  function buildAfterGallery(infoBand) {
    if (option !== "4" || !infoBand) return false;
    var title = infoBand.querySelector(":scope > .jdc-project-title-block h1,:scope > .jdc-project-title-block h2,:scope > .jdc-project-title-block h3");
    var body = infoBand.querySelector(":scope > .jdc-project-body-block");
    var gallery = document.querySelector(".jdc-clip-gallery-section");
    var flow = gallery && gallery.querySelector(".jdc-clip-gallery-flow");
    var grid = flow && flow.querySelector(".jdc-clip-gallery-grid");
    if (!title || !body || !gallery || !flow || !grid) return false;
    var lines = sourceLines(body);
    if (!lines.length) return false;

    if (!flow.querySelector(":scope > .jdc-layout4-title51")) {
      var titleBlock = document.createElement("div");
      titleBlock.className = "jdc-layout4-title51";
      var heading = document.createElement("h1");
      heading.textContent = title.textContent.trim();
      titleBlock.appendChild(heading);
      flow.insertBefore(titleBlock, grid);
    }
    if (!flow.querySelector(":scope > .jdc-layout4-credits51")) {
      var credits = document.createElement("div");
      credits.className = "jdc-layout4-credits51";
      credits.appendChild(makeList(lines));
      flow.appendChild(credits);
    }
    gallery.setAttribute("data-jdc-credits-layout", "4");
    document.body.classList.add("jdc-credits-layout4-ready51");
    window.requestAnimationFrame(function () { positionAfterGallery(gallery); });
    return true;
  }

  function install() {
    scheduled = false;
    if (!previewActive) return;
    ensureStyles();
    ensureSwitcher();
    decorateInternalLinks();
    if (document.body) document.body.setAttribute("data-jdc-credits-option", option);
    var infoBand = document.querySelector("main .jdc-project-info-band");
    var built = option === "3" ? buildBeforeGallery(infoBand) : option === "4" ? buildAfterGallery(infoBand) : false;
    document.documentElement.setAttribute("data-jdc-credits-preview", RELEASE);
    document.documentElement.setAttribute("data-jdc-credits-preview-option", option || "0");
    document.documentElement.setAttribute("data-jdc-credits-preview-built", built ? "true" : "false");
  }

  function schedule() {
    if (scheduled || !previewActive) return;
    scheduled = true;
    window.requestAnimationFrame(install);
  }

  function observe() {
    if (!previewActive || observer || !window.MutationObserver) return;
    observer = new MutationObserver(schedule);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.__JDC_CREDITS_PREVIEW_OBSERVER51__ = observer;
  }

  normalizeLegacyOption();
  loadCore();
  if (!previewActive) return;
  observe();
  document.addEventListener("DOMContentLoaded", schedule, { once: true });
  window.addEventListener("pageshow", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  [0, 100, 300, 700, 1400, 2600, 4500, 7500, 11000].forEach(function (delay) {
    window.setTimeout(schedule, delay);
  });
})();
