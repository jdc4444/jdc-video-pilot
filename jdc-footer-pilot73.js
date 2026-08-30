(function () {
  "use strict";

  if (window.__JDC_PILOT73__) return;
  window.__JDC_PILOT73__ = true;

  var root = document.documentElement;
  var pilotScriptUrl = document.currentScript && document.currentScript.src
    ? document.currentScript.src
    : window.location.href;

  root.setAttribute("data-jdc-visible-playback73", "true");

  var releaseUrl = new URL("jdc-footer-pilot72.js", pilotScriptUrl).href;
  var script = document.createElement("script");
  script.src = releaseUrl;
  script.async = false;
  script.crossOrigin = "anonymous";
  script.setAttribute("data-jdc-pilot73-release", "all-visible-gallery-playback");
  (document.head || root).appendChild(script);
})();
