(function () {
  "use strict";

  if (window.__JDC_PILOT49__) return;
  window.__JDC_PILOT49__ = true;

  var RELEASE = "pilot49";
  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : window.location.href;
  var CORE_URL = new URL("jdc-footer-pilot48.js", SCRIPT_URL).href;
  var PARAM = "jdc-credits";
  var OPTIONS = ["0", "1", "2", "3"];
  var LABELS = ["Current", "Ledger", "Slate", "Billing"];
  var option = new URLSearchParams(window.location.search).get(PARAM);
  var previewActive = OPTIONS.indexOf(option) !== -1;
  var scheduled = false;
  var observer = null;

  function ensureStyles() {
    if (!previewActive || document.getElementById("jdc-credits-preview-styles49")) return;
    var style = document.createElement("style");
    style.id = "jdc-credits-preview-styles49";
    style.textContent = [
      "#header{overflow:visible!important}",
      ".jdc-credits-preview-nav49{position:absolute!important;left:50%!important;top:50%!important;z-index:10001!important;display:flex!important;align-items:center!important;gap:3px!important;box-sizing:border-box!important;padding:4px!important;transform:translate(-50%,-50%)!important;border:1px solid #111!important;border-radius:999px!important;background:rgba(255,255,255,.96)!important;box-shadow:0 2px 18px rgba(0,0,0,.08)!important;color:#111!important;font-family:Arial,Helvetica,sans-serif!important;font-size:10px!important;line-height:1!important;letter-spacing:.04em!important;white-space:nowrap!important;backdrop-filter:blur(10px)!important;-webkit-backdrop-filter:blur(10px)!important}",
      ".jdc-credits-preview-nav49>span{padding:0 6px 0 8px!important;text-transform:uppercase!important;opacity:.62!important}",
      ".jdc-credits-preview-nav49>a{display:grid!important;place-items:center!important;box-sizing:border-box!important;min-width:25px!important;height:25px!important;padding:0 7px!important;border-radius:999px!important;color:#111!important;text-decoration:none!important;font:inherit!important;letter-spacing:0!important}",
      ".jdc-credits-preview-nav49>a[aria-current='page']{background:#111!important;color:#fff!important}",
      ".jdc-credits-preview-nav49>a:hover{background:#ddd!important;color:#111!important}",
      ".jdc-credits-preview-nav49>a[aria-current='page']:hover{background:#111!important;color:#fff!important}",
      "body[data-jdc-credits-option='1'] .jdc-project-info-band,body[data-jdc-credits-option='2'] .jdc-project-info-band,body[data-jdc-credits-option='3'] .jdc-project-info-band{display:block!important;width:100%!important;max-width:none!important;min-width:0!important;overflow:visible!important}",
      "body[data-jdc-credits-option='1'] .jdc-project-info-band>.jdc-project-title-block,body[data-jdc-credits-option='1'] .jdc-project-info-band>.jdc-project-body-block,body[data-jdc-credits-option='2'] .jdc-project-info-band>.jdc-project-title-block,body[data-jdc-credits-option='2'] .jdc-project-info-band>.jdc-project-body-block,body[data-jdc-credits-option='3'] .jdc-project-info-band>.jdc-project-title-block,body[data-jdc-credits-option='3'] .jdc-project-info-band>.jdc-project-body-block{display:none!important}",
      ".jdc-credits-poster49{position:relative!important;display:block!important;box-sizing:border-box!important;width:100%!important;max-width:none!important;height:auto!important;min-height:0!important;margin:0!important;overflow:hidden!important;color:#111!important;font-family:Arial,Helvetica,sans-serif!important}",
      ".jdc-credits-poster49 *{box-sizing:border-box!important}",
      ".jdc-credits-poster49 h2{max-width:none!important;margin:0!important;padding:0!important;color:inherit!important;font-family:inherit!important;font-weight:500!important;letter-spacing:-.045em!important;text-wrap:balance!important}",
      ".jdc-credit-kicker49{display:flex!important;justify-content:space-between!important;align-items:center!important;gap:20px!important;margin:0!important;padding:0!important;font-size:10px!important;line-height:1!important;letter-spacing:.12em!important;text-transform:uppercase!important}",
      ".jdc-credit-list49{margin:0!important;padding:0!important}",
      ".jdc-credit-item49{position:relative!important;min-width:0!important;break-inside:avoid!important}",
      ".jdc-credit-number49{font-variant-numeric:tabular-nums!important;opacity:.48!important}",
      ".jdc-credit-primary49,.jdc-credit-secondary49{display:block!important;min-width:0!important;overflow-wrap:anywhere!important}",
      ".jdc-credit-secondary49{text-transform:uppercase!important;letter-spacing:.08em!important;opacity:.58!important}",

      "body[data-jdc-credits-option='1'] .jdc-credits-poster49{padding:clamp(26px,3.8vw,58px)!important;border-top:1px solid #111!important;border-bottom:1px solid #111!important;background:#fff!important}",
      "body[data-jdc-credits-option='1'] .jdc-credits-poster49 h2{width:min(100%,980px)!important;margin-top:clamp(30px,5vw,76px)!important;font-size:clamp(44px,6.2vw,94px)!important;line-height:.94!important}",
      "body[data-jdc-credits-option='1'] .jdc-credit-list49{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:0 clamp(24px,4vw,70px)!important;margin-top:clamp(42px,6vw,92px)!important;border-bottom:1px solid rgba(0,0,0,.2)!important}",
      "body[data-jdc-credits-option='1'] .jdc-credit-item49{display:grid!important;grid-template-columns:28px minmax(0,1fr)!important;gap:10px!important;padding:11px 0 12px!important;border-top:1px solid rgba(0,0,0,.2)!important;font-size:13px!important;line-height:1.25!important}",
      "body[data-jdc-credits-option='1'] .jdc-credit-primary49{font-size:14px!important}",
      "body[data-jdc-credits-option='1'] .jdc-credit-secondary49{margin-top:4px!important;font-size:8px!important;line-height:1.25!important}",

      "body[data-jdc-credits-option='2'] .jdc-credits-poster49{display:flex!important;flex-direction:column!important;justify-content:space-between!important;min-height:clamp(480px,62vw,820px)!important;padding:clamp(28px,4.6vw,72px)!important;background:#0b0b0b!important;color:#f4f1e8!important}",
      "body[data-jdc-credits-option='2'] .jdc-credits-poster49:before{content:''!important;position:absolute!important;inset:14px!important;border:1px solid rgba(244,241,232,.24)!important;pointer-events:none!important}",
      "body[data-jdc-credits-option='2'] .jdc-credits-poster49 h2{position:relative!important;z-index:1!important;width:min(100%,1050px)!important;margin-top:clamp(42px,7vw,110px)!important;font-size:clamp(52px,8.5vw,132px)!important;line-height:.86!important;letter-spacing:-.06em!important}",
      "body[data-jdc-credits-option='2'] .jdc-credit-list49{position:relative!important;z-index:1!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:0 clamp(18px,3vw,46px)!important;margin-top:clamp(70px,10vw,160px)!important}",
      "body[data-jdc-credits-option='2'] .jdc-credit-item49{padding:11px 0 15px!important;border-top:1px solid rgba(244,241,232,.34)!important;font-size:12px!important;line-height:1.18!important}",
      "body[data-jdc-credits-option='2'] .jdc-credit-number49{display:none!important}",
      "body[data-jdc-credits-option='2'] .jdc-credit-primary49{font-size:13px!important;line-height:1.15!important}",
      "body[data-jdc-credits-option='2'] .jdc-credit-secondary49{margin-top:5px!important;color:#d7ff36!important;font-size:8px!important;line-height:1.2!important;opacity:1!important}",

      "body[data-jdc-credits-option='3'] .jdc-credits-poster49{padding:clamp(30px,5vw,80px)!important;border:clamp(4px,.55vw,9px) solid #111!important;background:#eee9dc!important;color:#111!important;text-align:center!important}",
      "body[data-jdc-credits-option='3'] .jdc-credit-kicker49{justify-content:center!important}",
      "body[data-jdc-credits-option='3'] .jdc-credit-kicker49>span:last-child{display:none!important}",
      "body[data-jdc-credits-option='3'] .jdc-credits-poster49 h2{width:min(100%,1080px)!important;margin:clamp(44px,7vw,110px) auto 0!important;font-size:clamp(58px,10.5vw,160px)!important;line-height:.82!important;letter-spacing:-.07em!important;text-transform:uppercase!important}",
      "body[data-jdc-credits-option='3'] .jdc-credit-list49{display:flex!important;flex-wrap:wrap!important;justify-content:center!important;align-items:flex-start!important;gap:0!important;max-width:1080px!important;margin:clamp(58px,9vw,140px) auto 0!important;padding-top:20px!important;border-top:2px solid #111!important}",
      "body[data-jdc-credits-option='3'] .jdc-credit-item49{display:inline-flex!important;align-items:baseline!important;gap:6px!important;margin:0!important;padding:5px 9px 6px!important;font-size:11px!important;line-height:1.05!important;text-transform:uppercase!important}",
      "body[data-jdc-credits-option='3'] .jdc-credit-item49:not(:last-child):after{content:'/'!important;margin-left:10px!important;opacity:.45!important}",
      "body[data-jdc-credits-option='3'] .jdc-credit-number49{display:none!important}",
      "body[data-jdc-credits-option='3'] .jdc-credit-copy49{display:inline-flex!important;align-items:baseline!important;gap:5px!important}",
      "body[data-jdc-credits-option='3'] .jdc-credit-primary49,body[data-jdc-credits-option='3'] .jdc-credit-secondary49{display:inline!important;font-size:inherit!important;line-height:inherit!important}",
      "body[data-jdc-credits-option='3'] .jdc-credit-primary49{font-weight:700!important}",
      "body[data-jdc-credits-option='3'] .jdc-credit-secondary49{font-size:7px!important;font-weight:400!important;opacity:.7!important}",

      "@media(max-width:767px){.jdc-credits-preview-nav49{gap:2px!important;padding:3px!important;font-size:9px!important}.jdc-credits-preview-nav49>span{padding:0 4px 0 6px!important}.jdc-credits-preview-nav49>a{min-width:23px!important;height:23px!important;padding:0 5px!important}body[data-jdc-credits-option='1'] .jdc-credit-list49{grid-template-columns:minmax(0,1fr)!important}body[data-jdc-credits-option='2'] .jdc-credits-poster49{min-height:0!important}body[data-jdc-credits-option='2'] .jdc-credit-list49{grid-template-columns:repeat(2,minmax(0,1fr))!important}body[data-jdc-credits-option='3'] .jdc-credit-item49{padding-left:5px!important;padding-right:5px!important}body[data-jdc-credits-option='3'] .jdc-credit-item49:not(:last-child):after{margin-left:6px!important}}",
      "@media(max-width:430px){.jdc-credits-preview-nav49>span{display:none!important}body[data-jdc-credits-option='2'] .jdc-credit-list49{grid-template-columns:minmax(0,1fr)!important}}"
    ].join("");
    (document.head || document.documentElement).appendChild(style);
  }

  function optionUrl(value) {
    var url = new URL(window.location.href);
    url.searchParams.set(PARAM, value);
    return url.href;
  }

  function ensureSwitcher() {
    if (!previewActive || document.querySelector(".jdc-credits-preview-nav49")) return false;
    var header = document.querySelector("header#header");
    if (!header) return false;
    var nav = document.createElement("div");
    nav.className = "jdc-credits-preview-nav49";
    nav.setAttribute("role", "navigation");
    nav.setAttribute("aria-label", "Credits design preview");
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
      if (link.closest(".jdc-credits-preview-nav49")) return;
      var next = internalUrl(link);
      if (next) link.href = next;
    });
  }

  function splitCredit(text) {
    var value = String(text || "").replace(/\s+/g, " ").trim();
    var by = value.match(/^(.+?)\s+by\s+(.+)$/i);
    if (by) return { primary: by[2].trim(), secondary: by[1].trim() };
    var dash = value.match(/^(.+?)\s+[–—-]\s+(.+)$/);
    if (dash) return { primary: dash[2].trim(), secondary: dash[1].trim() };
    var colon = value.indexOf(":");
    if (colon > 0 && colon < value.length - 1) {
      return { primary: value.slice(0, colon).trim(), secondary: value.slice(colon + 1).trim() };
    }
    return { primary: value, secondary: "" };
  }

  function creditLines(body) {
    var paragraphs = Array.prototype.slice.call(body.querySelectorAll("p")).map(function (paragraph) {
      return paragraph.textContent.replace(/\s+/g, " ").trim();
    }).filter(Boolean);
    if (paragraphs.length) return paragraphs;
    return body.textContent.split(/\n+/).map(function (line) { return line.trim(); }).filter(Boolean);
  }

  function buildPoster(infoBand) {
    if (!previewActive || option === "0" || !infoBand) return false;
    var titleBlock = infoBand.querySelector(":scope > .jdc-project-title-block");
    var bodyBlock = infoBand.querySelector(":scope > .jdc-project-body-block");
    var heading = titleBlock && titleBlock.querySelector("h1,h2,h3");
    if (!titleBlock || !bodyBlock || !heading) return false;
    var lines = creditLines(bodyBlock);
    if (!lines.length) return false;

    var current = infoBand.querySelector(":scope > .jdc-credits-poster49");
    if (current && current.getAttribute("data-jdc-option") === option) return true;
    if (current) current.remove();

    var poster = document.createElement("article");
    poster.className = "jdc-credits-poster49";
    poster.setAttribute("data-jdc-option", option);
    poster.setAttribute("data-jdc-credit-count", String(lines.length));
    poster.setAttribute("aria-label", "Project credits, design option " + option);

    var kicker = document.createElement("div");
    kicker.className = "jdc-credit-kicker49";
    var kickerLeft = document.createElement("span");
    kickerLeft.textContent = "JDC / Project credits";
    var kickerRight = document.createElement("span");
    kickerRight.textContent = String(lines.length).padStart(2, "0") + " credits / 0" + option;
    kicker.appendChild(kickerLeft);
    kicker.appendChild(kickerRight);
    poster.appendChild(kicker);

    var title = document.createElement("h2");
    title.textContent = heading.textContent.trim();
    poster.appendChild(title);

    var list = document.createElement("div");
    list.className = "jdc-credit-list49";
    lines.forEach(function (line, index) {
      var parts = splitCredit(line);
      var item = document.createElement("div");
      item.className = "jdc-credit-item49";
      if (!parts.secondary) item.setAttribute("data-jdc-single", "true");
      if (line.length > 82) item.setAttribute("data-jdc-long", "true");
      var number = document.createElement("span");
      number.className = "jdc-credit-number49";
      number.textContent = String(index + 1).padStart(2, "0");
      var copy = document.createElement("span");
      copy.className = "jdc-credit-copy49";
      var primary = document.createElement("span");
      primary.className = "jdc-credit-primary49";
      primary.textContent = parts.primary;
      copy.appendChild(primary);
      if (parts.secondary) {
        var secondary = document.createElement("span");
        secondary.className = "jdc-credit-secondary49";
        secondary.textContent = parts.secondary;
        copy.appendChild(secondary);
      }
      item.appendChild(number);
      item.appendChild(copy);
      list.appendChild(item);
    });
    poster.appendChild(list);
    infoBand.appendChild(poster);
    document.documentElement.setAttribute("data-jdc-credits-preview", RELEASE);
    document.documentElement.setAttribute("data-jdc-credits-preview-option", option);
    return true;
  }

  function install() {
    scheduled = false;
    if (!previewActive) return;
    ensureStyles();
    ensureSwitcher();
    decorateInternalLinks();
    if (document.body) document.body.setAttribute("data-jdc-credits-option", option);
    var infoBands = Array.prototype.slice.call(document.querySelectorAll("main .jdc-project-info-band"));
    var built = infoBands.reduce(function (count, infoBand) {
      return count + (buildPoster(infoBand) ? 1 : 0);
    }, 0);
    document.documentElement.setAttribute("data-jdc-credits-preview-posters", String(built));
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
    window.__JDC_CREDITS_PREVIEW_OBSERVER49__ = observer;
  }

  function loadCore() {
    if (document.querySelector('script[data-jdc-pilot49-core="pilot48"]')) return;
    var core = document.createElement("script");
    core.src = CORE_URL;
    core.async = false;
    core.crossOrigin = "anonymous";
    core.setAttribute("data-jdc-pilot49-core", "pilot48");
    (document.head || document.documentElement).appendChild(core);
  }

  loadCore();
  if (!previewActive) return;
  observe();
  document.addEventListener("DOMContentLoaded", schedule, { once: true });
  window.addEventListener("pageshow", schedule, { passive: true });
  [0, 100, 300, 700, 1400, 2600, 4500, 7500, 11000].forEach(function (delay) {
    window.setTimeout(schedule, delay);
  });
})();
