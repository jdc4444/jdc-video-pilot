(function () {
  "use strict";

  var RELEASE = "pilot39";
  var PATH = "/alignment-documentary";
  var CORE_URL = "https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@9487368d8ba4f750dbafb075e2b4ae1844ddb95e/jdc-footer-pilot38.js";
  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : window.location.href;
  var ASSET_BASE = new URL(".", SCRIPT_URL).href;
  var slides = [
    [33, 3517, 1937],
    [34, 3518, 1951],
    [35, 3540, 1951],
    [36, 3518, 1952],
    [37, 3519, 1951],
    [38, 3518, 1951],
    [39, 3533, 1952],
    [40, 3518, 1948],
    [41, 3518, 1952],
    [42, 3518, 1951],
    [43, 3518, 1950],
    [44, 3518, 1952],
    [45, 3518, 1950],
    [46, 3518, 1939],
    [47, 3518, 1950],
    [48, 3518, 1949],
    [49, 3518, 1950],
    [50, 3532, 1952]
  ];

  function normalizePath(path) {
    return String(path || "/").replace(/\/+$/, "") || "/";
  }

  function asset(slide, width) {
    return new URL("media/alignment-slides/slide-" + slide + "-" + width + ".webp", ASSET_BASE).href;
  }

  function installStyles() {
    if (document.getElementById("jdc-alignment-gallery-styles39")) return;
    var style = document.createElement("style");
    style.id = "jdc-alignment-gallery-styles39";
    style.textContent = [
      ".jdc-alignment-gallery-section{display:block!important;box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;background:#fff!important;color:#000!important;overflow:clip!important}",
      ".jdc-alignment-gallery-flow{display:flex!important;flex-direction:column!important;box-sizing:border-box!important;width:100%!important;max-width:none!important;gap:clamp(18px,2.2vw,34px)!important;padding:clamp(30px,4.2vw,58px) 4.2vw clamp(42px,5vw,72px)!important}",
      ".jdc-alignment-slide{display:block!important;box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;background:#f4f4f2!important}",
      ".jdc-alignment-slide img{display:block!important;box-sizing:border-box!important;width:100%!important;height:auto!important;max-width:none!important;margin:0!important;padding:0!important;border:0!important;object-fit:contain!important}",
      "@media(max-width:767px){.jdc-alignment-gallery-flow{gap:18px!important;padding:28px 6vw 40px!important}}"
    ].join("");
    (document.head || document.documentElement).appendChild(style);
  }

  function projectVideoSections() {
    var seen = [];
    Array.prototype.slice.call(document.querySelectorAll("main [data-jdc-video],main [data-config-video]")).forEach(function (shell) {
      var section = shell.closest(".page-section");
      if (section && seen.indexOf(section) === -1) seen.push(section);
    });
    return seen;
  }

  function buildGallery() {
    var section = document.createElement("section");
    section.className = "jdc-alignment-gallery-section page-section";
    section.setAttribute("data-jdc-alignment-gallery", RELEASE);
    section.setAttribute("aria-label", "Alignment visual studies");

    var flow = document.createElement("div");
    flow.className = "jdc-alignment-gallery-flow";
    slides.forEach(function (definition) {
      var slide = definition[0];
      var figure = document.createElement("figure");
      figure.className = "jdc-alignment-slide";
      figure.setAttribute("data-jdc-alignment-slide", String(slide));
      figure.style.aspectRatio = definition[1] + " / " + definition[2];

      var image = document.createElement("img");
      image.src = asset(slide, 1600);
      image.srcset = [asset(slide, 960) + " 960w", asset(slide, 1600) + " 1600w", asset(slide, 2800) + " 2800w"].join(", ");
      image.sizes = "(max-width: 767px) 88vw, 91.6vw";
      image.width = definition[1];
      image.height = definition[2];
      image.alt = "Alignment visual study " + slide;
      image.loading = "lazy";
      image.decoding = "async";
      figure.appendChild(image);
      flow.appendChild(figure);
    });
    section.appendChild(flow);
    return section;
  }

  function installGallery() {
    if (normalizePath(window.location.pathname) !== PATH) return false;
    if (document.querySelector('[data-jdc-alignment-gallery="pilot39"]')) return true;
    var sections = projectVideoSections();
    var anchor = sections[sections.length - 1];
    if (!anchor || !anchor.parentNode) return false;
    installStyles();
    anchor.parentNode.insertBefore(buildGallery(), anchor.nextSibling);
    document.documentElement.setAttribute("data-jdc-alignment-gallery", RELEASE);
    document.documentElement.setAttribute("data-jdc-alignment-gallery-count", String(slides.length));
    return true;
  }

  function loadCore() {
    if (document.querySelector('script[data-jdc-pilot39-core="pilot38"]')) return;
    if (document.querySelector('script[data-jdc-pilot38-core="pilot36"]')) return;
    var core = document.createElement("script");
    core.src = CORE_URL;
    core.async = false;
    core.crossOrigin = "anonymous";
    core.setAttribute("data-jdc-pilot39-core", "pilot38");
    (document.head || document.documentElement).appendChild(core);
  }

  function finish() {
    [0, 120, 400, 1000, 2500, 5000, 7000].forEach(function (delay) {
      window.setTimeout(function () {
        installGallery();
        if (document.body) document.body.setAttribute("data-jdc-footer-release", RELEASE);
      }, delay);
    });
  }

  loadCore();
  finish();
})();
