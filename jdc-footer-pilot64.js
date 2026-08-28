(function () {
  "use strict";

  if (window.__JDC_PILOT64__) return;
  window.__JDC_PILOT64__ = true;

  // Release contract: one sitewide project treatment, with no preview UI or
  // query-string propagation. The existing video/stability loader remains the
  // single entry point so homepage playback behavior is unchanged.
  window.__JDC_PILOT53_SITEWIDE_WINNER__ = true;
  // These projects were authored as overlapping/scattered Fluid Engine
  // sections and have dedicated, already-tested compact gallery adapters.
  var path = window.location.pathname.replace(/\/+$/, "") || "/";
  // The release player owns native video delivery everywhere video can appear.
  // Its exact first-frame poster remains visible until the first decoded frame,
  // while project geometry stays under the sitewide layout release below.
  window.__JDC_PILOT64_VIDEO_OPT_IN__ = path !== "/contact";
  window.__JDC_PILOT64_PATH_VIDEO_OPT_IN__ = [
    "/polymarket-make-your-own-market",
    "/laufey-tour-visuals",
    "/tobias-rees-limn",
    "/basis",
    "/dig-brand-identity"
  ].indexOf(path) !== -1;
  if (window.__JDC_PILOT64_PATH_VIDEO_OPT_IN__) {
    document.documentElement.setAttribute("data-jdc-adapter-scroll-anchor", "off");
    var anchorStyle = document.createElement("style");
    anchorStyle.id = "jdc-adapter-scroll-anchor64";
    anchorStyle.textContent = [
      "html[data-jdc-adapter-scroll-anchor='off']{overflow-anchor:none!important;scroll-snap-type:none!important;scroll-behavior:auto!important}",
      "html[data-jdc-adapter-scroll-anchor='off'] body,html[data-jdc-adapter-scroll-anchor='off'] body *{overflow-anchor:none!important}",
      "html[data-jdc-adapter-scroll-anchor='off'] body .page-section{scroll-snap-align:none!important;scroll-snap-stop:normal!important}"
    ].join("");
    (document.head || document.documentElement).appendChild(anchorStyle);
    if (window.scrollY < 2 && !window.location.hash) {
      var keepInitialTop = true;
      var cancelInitialTop = function () { keepInitialTop = false; };
      ["wheel", "touchstart", "pointerdown", "keydown"].forEach(function (eventName) {
        window.addEventListener(eventName, cancelInitialTop, { once: true, passive: true });
      });
      [40, 120, 300, 700, 1400, 2400].forEach(function (delay) {
        window.setTimeout(function () {
          if (keepInitialTop && window.scrollY > 0) window.scrollTo(0, 0);
        }, delay);
      });
      window.setTimeout(function () { keepInitialTop = false; }, 2600);
    }
  }

  var scriptUrl = document.currentScript && document.currentScript.src ? document.currentScript.src : window.location.href;
  var releaseUrl = new URL("jdc-footer-pilot52.js", scriptUrl).href;
  var script = document.createElement("script");
  script.src = releaseUrl;
  script.async = false;
  script.crossOrigin = "anonymous";
  script.setAttribute("data-jdc-pilot64-release", "sitewide-winner");
  (document.head || document.documentElement).appendChild(script);
})();
