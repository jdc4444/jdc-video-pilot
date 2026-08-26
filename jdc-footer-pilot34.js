(function () {
  "use strict";

  var CORE_URL = "https://jdc4444.github.io/jdc-video-pilot/jdc-footer-pilot33.js?v=e73e0e3";
  var TARGET_PATH = /^\/(?:tobias-rees-limn|basis|laufey-tour-visuals|dig-brand-identity)\/?$/;
  var observer = null;

  function promoteLayoutStyles() {
    if (!TARGET_PATH.test(window.location.pathname)) return;
    var style = document.getElementById("jdc-project-gallery-flow-fix33");
    if (style && style.parentNode === document.head && style.nextElementSibling) {
      document.head.appendChild(style);
    }
    if (document.body) document.body.setAttribute("data-jdc-footer-release", "pilot34");
    document.documentElement.setAttribute("data-jdc-project-gallery-flow-order", "pilot34");
  }

  function schedulePromotion() {
    [0, 120, 400, 1000, 2500, 5000, 9000, 14000].forEach(function (delay) {
      window.setTimeout(promoteLayoutStyles, delay);
    });
    if (!observer && document.head && window.MutationObserver) {
      observer = new MutationObserver(promoteLayoutStyles);
      observer.observe(document.head, { childList: true });
    }
  }

  function loadCore() {
    if (window.__JDC_SMART_VIDEO__) {
      schedulePromotion();
      return;
    }
    if (document.querySelector('script[data-jdc-pilot34-core="pilot33"]')) return;
    var core = document.createElement("script");
    core.src = CORE_URL;
    core.async = false;
    core.crossOrigin = "anonymous";
    core.setAttribute("data-jdc-pilot34-core", "pilot33");
    core.addEventListener("load", schedulePromotion, { once: true });
    (document.head || document.documentElement).appendChild(core);
  }

  schedulePromotion();
  loadCore();
})();
