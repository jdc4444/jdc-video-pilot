(function () {
  "use strict";

  if (window.__JDC_PILOT66__) return;
  window.__JDC_PILOT66__ = true;

  var scriptUrl = document.currentScript && document.currentScript.src
    ? document.currentScript.src
    : window.location.href;
  var dataUrl = new URL("jdc-clip-data-pilot66.js", scriptUrl).href;
  var productionUrl =
    "https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@17a571fd826048801397584886b90d248a290c75/jdc-footer-pilot64.js";
  var loadedProduction = false;

  function loadProduction() {
    if (loadedProduction) return;
    loadedProduction = true;

    var production = document.createElement("script");
    production.src = productionUrl;
    production.async = false;
    production.crossOrigin = "anonymous";
    production.setAttribute("data-jdc-pilot66-core", "production-pilot64");
    (document.head || document.documentElement).appendChild(production);
  }

  var data = document.createElement("script");
  data.src = dataUrl;
  data.async = false;
  data.crossOrigin = "anonymous";
  data.setAttribute("data-jdc-pilot66-data", "day-one-four-nine-swap");
  data.addEventListener("load", loadProduction, { once: true });
  data.addEventListener(
    "error",
    function () {
      console.warn("JDC pilot66 order data did not load; retaining production order.");
      loadProduction();
    },
    { once: true }
  );
  (document.head || document.documentElement).appendChild(data);
})();
