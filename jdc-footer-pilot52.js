(function () {
  "use strict";

  if (window.__JDC_PILOT52__) return;
  window.__JDC_PILOT52__ = true;

  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : window.location.href;
  var PLAYER_URL = new URL("jdc-footer-pilot27.js", SCRIPT_URL).href;
  var CORE_URL = new URL("jdc-footer-pilot53.js", SCRIPT_URL).href;
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

  function enablePreviewVideoGate() {
    window.__JDC_VIDEO_V2_ENABLED__ = true;
    if (window.__JDC_VIDEO_GATE__) return;

    var pairs = [
      ["data-config-native-video", "data-jdc-native-video"],
      ["data-config-video", "data-jdc-video"]
    ];

    function quarantineNativeController(element) {
      if (!element || element.nodeType !== 1) return;
      var controllers = element.getAttribute("data-controller");
      if (!controllers) return;
      var retained = controllers.split(/\s+/).filter(function (controller) {
        return controller && controller !== "VideoBackgroundNative";
      });
      if (retained.length) element.setAttribute("data-controller", retained.join(" "));
      else element.removeAttribute("data-controller");
    }

    function quarantineElement(element) {
      if (!element || element.nodeType !== 1) return;
      pairs.forEach(function (pair) {
        if (!element.hasAttribute(pair[0])) return;
        element.setAttribute(pair[1], element.getAttribute(pair[0]));
        element.removeAttribute(pair[0]);
      });
    }

    function quarantine(root) {
      if (!root) return;
      quarantineNativeController(root);
      quarantineElement(root);
      if (!root.querySelectorAll) return;
      root.querySelectorAll('[data-controller~="VideoBackgroundNative"]').forEach(quarantineNativeController);
      pairs.forEach(function (pair) {
        root.querySelectorAll("[" + pair[0] + "]").forEach(quarantineElement);
      });
    }

    var observer = new MutationObserver(function (records) {
      records.forEach(function (record) {
        record.addedNodes.forEach(quarantine);
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    quarantine(document.documentElement);
    window.__JDC_VIDEO_GATE__ = { quarantine: quarantine, observer: observer };
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
    load(CORE_URL, "data-jdc-pilot52-core", "pilot53", function () {
      document.documentElement.setAttribute("data-jdc-stability-release", "pilot53");
      stabilizeBombas();
    });
  }

  if (previewActive) {
    enablePreviewVideoGate();
    load(PLAYER_URL, "data-jdc-pilot52-player", "pilot27", loadCreditsCore);
  } else loadCreditsCore();
})();
