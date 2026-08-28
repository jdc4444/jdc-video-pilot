(function () {
  "use strict";

  if (window.__JDC_PILOT64__) return;
  window.__JDC_PILOT64__ = true;

  // Release contract: one sitewide project treatment, with no preview UI or
  // query-string propagation. The existing video/stability loader remains the
  // single entry point so homepage playback behavior is unchanged.
  window.__JDC_PILOT53_SITEWIDE_WINNER__ = true;
  // This one project was authored as a single overlapping Fluid Engine
  // section, so keep its already-tested hero/gallery adapter path-specific.
  window.__JDC_PILOT64_PATH_VIDEO_OPT_IN__ = /^\/polymarket-make-your-own-market\/?$/.test(window.location.pathname);

  var scriptUrl = document.currentScript && document.currentScript.src ? document.currentScript.src : window.location.href;
  var releaseUrl = new URL("jdc-footer-pilot52.js", scriptUrl).href;
  var script = document.createElement("script");
  script.src = releaseUrl;
  script.async = false;
  script.crossOrigin = "anonymous";
  script.setAttribute("data-jdc-pilot64-release", "sitewide-winner");
  (document.head || document.documentElement).appendChild(script);
})();
