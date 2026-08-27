(function () {
  "use strict";

  if (window.__JDC_PILOT52__) return;
  window.__JDC_PILOT52__ = true;

  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : window.location.href;
  var PLAYER_URL = new URL("jdc-footer-pilot27.js", SCRIPT_URL).href;
  var CORE_URL = new URL("jdc-footer-pilot51.js", SCRIPT_URL).href;
  var bombasPath = /^\/bombas-spring\/?$/.test(window.location.pathname);
  var requested = new URLSearchParams(window.location.search).get("jdc-credits");
  var previewActive = ["0", "1", "2", "3", "4"].indexOf(requested) !== -1;

  function load(url, attribute, value, complete) {
    var script = document.createElement("script");
    script.src = url;
    script.async = false;
    script.crossOrigin = "anonymous";
    script.setAttribute(attribute, value);
    if (complete) script.addEventListener("load", complete, { once: true });
    (document.head || document.documentElement).appendChild(script);
  }

  function stabilizeBombas() {
    if (!bombasPath) return;
    var lastKey = "";
    var stableCount = 0;
    window.setInterval(function () {
      var shell = document.querySelector("main .jdc-project-lead-block .jdc-video-shell");
      var gallery = document.querySelector(".jdc-bombas-gallery-section");
      var info = document.querySelector(".jdc-project-info-band");
      if (!shell || !gallery || !info) return;
      var preview = new URLSearchParams(window.location.search).get("jdc-credits");
      if (["1", "2", "3", "4"].indexOf(preview) !== -1 &&
          document.documentElement.getAttribute("data-jdc-credits-preview-built") !== "true") return;
      var shellRect = shell.getBoundingClientRect();
      var galleryRect = gallery.getBoundingClientRect();
      var infoRect = info.getBoundingClientRect();
      if (shellRect.height < 100 || galleryRect.height < 100) return;
      var key = [
        Math.round((shellRect.top + window.scrollY) * 2) / 2,
        Math.round(shellRect.height * 2) / 2,
        Math.round((galleryRect.top + window.scrollY) * 2) / 2,
        Math.round((infoRect.bottom + window.scrollY) * 2) / 2
      ].join(":");
      stableCount = key === lastKey ? stableCount + 1 : 0;
      lastKey = key;
      if (stableCount < 4 || window.__JDC_BOMBAS_LAYOUT_FROZEN52__) return;
      window.__JDC_BOMBAS_LAYOUT_FROZEN52__ = { width: window.innerWidth, geometry: key };
      if (window.__JDC_PROJECT_SPACING_OBSERVER__) window.__JDC_PROJECT_SPACING_OBSERVER__.disconnect();
      if (window.__JDC_PROJECT_SPACING_MUTATION_OBSERVER__) window.__JDC_PROJECT_SPACING_MUTATION_OBSERVER__.disconnect();
      if (window.__JDC_PROJECT_SPACING_SETTLE_TIMER__) window.clearInterval(window.__JDC_PROJECT_SPACING_SETTLE_TIMER__);
      document.body.setAttribute("data-jdc-bombas-stable52", key);
    }, 150);
  }

  function loadCreditsCore() {
    load(CORE_URL, "data-jdc-pilot52-core", "pilot51", function () {
      document.documentElement.setAttribute("data-jdc-stability-release", "pilot52");
      stabilizeBombas();
    });
  }

  if (previewActive) load(PLAYER_URL, "data-jdc-pilot52-player", "pilot27", loadCreditsCore);
  else loadCreditsCore();
})();
