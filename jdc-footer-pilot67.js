(function () {
  "use strict";

  if (window.__JDC_PILOT67__) return;
  window.__JDC_PILOT67__ = true;

  var path = window.location.pathname.replace(/\/+$/, "") || "/";
  var compactMetaPaths = {
    "/ggm-accoustic": true,
    "/dig-brand-identity": true,
    "/nike-aja-sabrina": true,
    "/polymarket-documentary": true,
    "/alignment-documentary": true
  };

  if (compactMetaPaths[path]) {
    document.documentElement.setAttribute("data-jdc-compact-meta67", "true");

    var style = document.createElement("style");
    style.id = "jdc-compact-project-meta67";
    style.textContent = [
      "html[data-jdc-compact-meta67='true'][data-jdc-project-design-preview='1'] body .jdc-balanced-meta-flow57>.jdc-layout4-title51,html[data-jdc-compact-meta67='true'][data-jdc-project-design-preview='1'] body .jdc-balanced-meta-flow57>.jdc-layout4-credits51{box-sizing:border-box!important;width:calc(100% - 8.4vw)!important;max-width:calc(100% - 8.4vw)!important;margin-left:4.2vw!important;margin-right:4.2vw!important}",
      "html[data-jdc-compact-meta67='true'][data-jdc-project-design-preview='1'] body .jdc-balanced-meta-flow57>.jdc-layout4-title51{padding:26px 4vw 18px!important}",
      "@media(max-width:767px){html[data-jdc-compact-meta67='true'][data-jdc-project-design-preview='1'] body .jdc-balanced-meta-flow57>.jdc-layout4-title51,html[data-jdc-compact-meta67='true'][data-jdc-project-design-preview='1'] body .jdc-balanced-meta-flow57>.jdc-layout4-credits51{width:88vw!important;max-width:88vw!important;margin-left:6vw!important;margin-right:6vw!important}html[data-jdc-compact-meta67='true'][data-jdc-project-design-preview='1'] body .jdc-balanced-meta-flow57>.jdc-layout4-title51{padding:20px 6.15vw 14px!important}}"
    ].join("");
    (document.head || document.documentElement).appendChild(style);
  }

  var scriptUrl = document.currentScript && document.currentScript.src
    ? document.currentScript.src
    : window.location.href;
  var releaseUrl = new URL("jdc-footer-pilot64.js", scriptUrl).href;
  var script = document.createElement("script");
  script.src = releaseUrl;
  script.async = false;
  script.crossOrigin = "anonymous";
  script.setAttribute("data-jdc-pilot67-release", "compact-project-meta");
  (document.head || document.documentElement).appendChild(script);
})();
