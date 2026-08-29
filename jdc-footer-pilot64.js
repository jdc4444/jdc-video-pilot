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

  // Install homepage navigation before the video/player release begins
  // loading. Squarespace video layers can briefly sit above the visible title
  // while a panel initializes, so resolve clicks against the title link's
  // actual painted line boxes instead of trusting the event target alone.
  if (path === "/" && !window.__JDC_HOME_PROJECT_NAV69__) {
    window.__JDC_HOME_PROJECT_NAV69__ = true;
    document.documentElement.setAttribute("data-jdc-home-nav", "pilot69");

    var homeNavStyle = document.createElement("style");
    homeNavStyle.id = "jdc-home-project-nav69";
    homeNavStyle.textContent = [
      "html[data-jdc-home-nav='pilot69'] main h1,html[data-jdc-home-nav='pilot69'] main h2,html[data-jdc-home-nav='pilot69'] main h3{position:relative!important;z-index:2147483646!important;pointer-events:auto!important}",
      "html[data-jdc-home-nav='pilot69'] main h1 a[href],html[data-jdc-home-nav='pilot69'] main h2 a[href],html[data-jdc-home-nav='pilot69'] main h3 a[href]{position:relative!important;z-index:2147483647!important;pointer-events:auto!important;cursor:pointer!important}"
    ].join("");
    (document.head || document.documentElement).appendChild(homeNavStyle);

    var titleLinkAtPoint = function (clientX, clientY) {
      var links = document.querySelectorAll("main h1 a[href],main h2 a[href],main h3 a[href]");
      var tolerance = 8;
      for (var linkIndex = 0; linkIndex < links.length; linkIndex += 1) {
        var link = links[linkIndex];
        var rects = link.getClientRects();
        for (var rectIndex = 0; rectIndex < rects.length; rectIndex += 1) {
          var rect = rects[rectIndex];
          if (
            rect.width > 0 && rect.height > 0 &&
            clientX >= rect.left - tolerance && clientX <= rect.right + tolerance &&
            clientY >= rect.top - tolerance && clientY <= rect.bottom + tolerance
          ) return link;
        }
      }
      return null;
    };

    document.addEventListener("click", function (event) {
      if (
        (window.location.pathname.replace(/\/+$/, "") || "/") !== "/" ||
        event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      ) return;

      var target = event.target && event.target.nodeType === 1 ? event.target : event.target && event.target.parentElement;
      var link = target && target.closest ? target.closest("main h1 a[href],main h2 a[href],main h3 a[href]") : null;
      if (!link) link = titleLinkAtPoint(event.clientX, event.clientY);
      if (!link) return;

      var destination;
      try {
        destination = new URL(link.getAttribute("href"), window.location.href);
      } catch (error) {
        return;
      }
      if (destination.origin !== window.location.origin) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(destination.href);
    }, true);
  }
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
