(function () {
  "use strict";

  if (window.__JDC_PILOT50__) return;
  window.__JDC_PILOT50__ = true;

  var RELEASE = "pilot50";
  var PARAM = "jdc-credits";
  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : window.location.href;
  var CORE_URL = new URL("jdc-footer-pilot48.js", SCRIPT_URL).href;
  var PREVIEW_URL = new URL("jdc-footer-pilot49.js", SCRIPT_URL).href;
  var requested = new URLSearchParams(window.location.search).get(PARAM);
  var previewActive = ["0", "1", "2", "3"].indexOf(requested) !== -1;
  var option = requested === "1" || requested === "2" ? "3" : requested;
  var observer = null;

  function normalizeLegacyOption() {
    if (requested !== "1" && requested !== "2") return;
    var url = new URL(window.location.href);
    url.searchParams.set(PARAM, "3");
    window.history.replaceState(window.history.state, "", url.href);
  }

  function loadScript(src, marker, callback) {
    if (document.querySelector('script[' + marker + ']')) {
      if (callback) callback();
      return;
    }
    var script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.crossOrigin = "anonymous";
    script.setAttribute(marker, "");
    if (callback) script.addEventListener("load", callback, { once: true });
    (document.head || document.documentElement).appendChild(script);
  }

  function ensureStyles() {
    var existing = document.getElementById("jdc-credits-preview-styles50");
    var base = document.getElementById("jdc-credits-preview-styles49");
    if (existing) {
      if (base && (existing.compareDocumentPosition(base) & Node.DOCUMENT_POSITION_FOLLOWING)) {
        (document.head || document.documentElement).appendChild(existing);
      }
      return;
    }
    var style = document.createElement("style");
    style.id = "jdc-credits-preview-styles50";
    style.textContent = [
      ".jdc-credits-poster49{font-family:inherit!important}",
      "body[data-jdc-credits-option='3'] .jdc-credits-poster49{padding:clamp(28px,4.4vw,68px)!important;border:clamp(2px,.25vw,4px) solid currentColor!important;background:#f0ecdf!important}",
      "body[data-jdc-credits-option='3'] .jdc-credits-poster49 h2{max-width:980px!important;margin-top:clamp(38px,6vw,88px)!important;font-size:clamp(52px,8.8vw,132px)!important;line-height:.86!important;letter-spacing:-.06em!important}",
      "body[data-jdc-credits-option='3'] .jdc-credit-list49{max-width:980px!important;margin-top:clamp(48px,7vw,104px)!important}",
      "@media(max-width:767px){body[data-jdc-credits-option='3'] .jdc-credits-poster49{padding:24px 18px!important}body[data-jdc-credits-option='3'] .jdc-credits-poster49 h2{font-size:clamp(44px,15vw,76px)!important}}"
    ].join("");
    (document.head || document.documentElement).appendChild(style);
  }

  function pruneSwitcher() {
    var nav = document.querySelector(".jdc-credits-preview-nav49");
    if (!nav) return false;
    Array.prototype.slice.call(nav.querySelectorAll("a")).forEach(function (link) {
      var value = link.textContent.trim();
      if (value === "1" || value === "2") link.remove();
      if (value === "3") {
        link.title = "3 — Poster";
        link.setAttribute("aria-label", "Credits option 3: Poster");
      }
    });
    nav.setAttribute("data-jdc-credits-options", "0,3");
    return true;
  }

  function markRelease() {
    if (!document.documentElement) return;
    document.documentElement.setAttribute("data-jdc-credits-preview", RELEASE);
    document.documentElement.setAttribute("data-jdc-credits-preview-option", option || "0");
  }

  function enhance() {
    if (!previewActive) return;
    ensureStyles();
    pruneSwitcher();
    markRelease();
  }

  function observe() {
    if (!previewActive || observer || !window.MutationObserver) return;
    observer = new MutationObserver(enhance);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.__JDC_CREDITS_PREVIEW_OBSERVER50__ = observer;
  }

  normalizeLegacyOption();

  if (!previewActive) {
    loadScript(CORE_URL, "data-jdc-pilot50-core");
    return;
  }

  observe();
  loadScript(PREVIEW_URL, "data-jdc-pilot50-preview", enhance);
  document.addEventListener("DOMContentLoaded", enhance, { once: true });
  window.addEventListener("pageshow", enhance, { passive: true });
  [0, 100, 300, 700, 1400, 2600, 4500].forEach(function (delay) {
    window.setTimeout(enhance, delay);
  });
})();
