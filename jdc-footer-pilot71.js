(function () {
  "use strict";

  if (window.__JDC_PILOT71__) return;
  window.__JDC_PILOT71__ = true;

  var path = window.location.pathname.replace(/\/+$/, "") || "/";
  var isNikeJordan = path === "/nike-jordan";
  var root = document.documentElement;
  var pilotScriptUrl = document.currentScript && document.currentScript.src
    ? document.currentScript.src
    : window.location.href;

  if (isNikeJordan) {
    var style = document.createElement("style");
    style.id = "jdc-nike-balanced-frame71";
    style.textContent = [
      "html[data-jdc-nike-balanced-frame71='true'] body main .jdc-clip-gallery-section .jdc-clip-gallery-item{aspect-ratio:73/54!important;overflow:hidden!important;background:#000!important}",
      "html[data-jdc-nike-balanced-frame71='true'] body main .jdc-clip-gallery-section .jdc-clip-gallery-item>img,html[data-jdc-nike-balanced-frame71='true'] body main .jdc-clip-gallery-section .jdc-clip-gallery-item>video{width:100%!important;height:100%!important;object-fit:cover!important;object-position:50% 50%!important}"
    ].join("");
    (document.head || root).appendChild(style);
    root.setAttribute("data-jdc-nike-balanced-frame71", "true");
  }

  var releaseUrl = new URL("jdc-footer-pilot70.js", pilotScriptUrl).href;
  var script = document.createElement("script");
  script.src = releaseUrl;
  script.async = false;
  script.crossOrigin = "anonymous";
  script.setAttribute("data-jdc-pilot71-release", "nike-balanced-frame");
  (document.head || root).appendChild(script);
})();
