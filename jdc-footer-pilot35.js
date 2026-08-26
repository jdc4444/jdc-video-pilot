(function () {
  "use strict";

  var CORE_URL = "https://jdc4444.github.io/jdc-video-pilot/jdc-footer-pilot34.js?v=e009246";
  var LAUFEY_PATH = /^\/laufey-tour-visuals\/?$/;
  var LIMN_PATH = /^\/tobias-rees-limn\/?$/;
  var LOVB_PATH = /^\/lovb-adidas\/?$/;
  var LAUFEY_DURATIONS = [17.386, 11.050, 13.056, 20.522, 9.664, 21.824, 27.370, 15.296];
  var LAUFEY_PERFORMANCE_ID = "757b7b53-188b-4a7e-912d-ce6fda95f78b";
  var LOVB_GALLERY_IDS = [
    "dc827efa-9323-4c31-9621-0757ffffb6cb",
    "52552a86-e839-459b-b5d0-26218324489e",
    "07132cec-1df9-4133-8a13-4a28afa7efaa",
    "9aea1600-07e0-4c9d-847c-e1eb841c1069",
    "b4e69304-f12e-4347-af33-3e05303acc7e",
    "9616c24b-c3cc-4f46-8e20-23e7a3830f52"
  ];
  var lovbObserver = null;

  function videoConfig(shell) {
    try { return JSON.parse(shell.getAttribute("data-jdc-video") || shell.getAttribute("data-config-video") || "{}"); }
    catch (error) { return null; }
  }

  function preseedLaufeyGrid() {
    if (!LAUFEY_PATH.test(window.location.pathname)) return false;
    if (document.querySelector(".jdc-laufey-gallery-grid")) return true;

    var matches = Array.prototype.slice.call(document.querySelectorAll("[data-jdc-video]")).map(function (shell) {
      var config = videoConfig(shell);
      var duration = Number(config && config.durationSeconds);
      if (!Number.isFinite(duration)) return null;
      var nearest = LAUFEY_DURATIONS.reduce(function (best, candidate) {
        var difference = Math.abs(duration - candidate);
        return !best || difference < best.difference ? { duration: candidate, difference: difference } : best;
      }, null);
      return nearest && nearest.difference <= 0.35 ? shell : null;
    }).filter(Boolean);

    if (matches.length < 7) return false;
    var section = matches[0].closest(".page-section, section");
    if (!section || !matches.every(function (shell) {
      return shell.closest(".page-section, section") === section;
    })) return false;

    var contentWrapper = section.querySelector(":scope > .content-wrapper") || section.querySelector(".content-wrapper");
    if (!contentWrapper) return false;
    var grid = document.createElement("div");
    grid.className = "jdc-laufey-gallery-grid";
    grid.setAttribute("data-jdc-laufey-preseed", "pilot35");
    contentWrapper.appendChild(grid);
    document.documentElement.setAttribute("data-jdc-laufey-grid-fix", "pilot35");
    return true;
  }

  function installLimnOverflowFix() {
    if (!LIMN_PATH.test(window.location.pathname) || document.getElementById("jdc-limn-overflow-fix35")) return;
    var style = document.createElement("style");
    style.id = "jdc-limn-overflow-fix35";
    style.textContent = ".jdc-limn-gallery-section{overflow:clip!important}";
    (document.head || document.documentElement).appendChild(style);
    document.documentElement.setAttribute("data-jdc-limn-overflow-fix", "pilot35");
  }

  function laufeyColumnCount() {
    if (window.innerWidth <= 767) return 1;
    if (window.innerWidth <= 1023) return 2;
    return 3;
  }

  function orderLaufeyGallery() {
    if (!LAUFEY_PATH.test(window.location.pathname)) return;
    var grid = document.querySelector(".jdc-laufey-gallery-grid");
    var performance = grid && grid.querySelector(".jdc-laufey-performance-item");
    if (!grid || !performance) return;
    var columns = laufeyColumnCount();
    var clips = Array.prototype.slice.call(grid.querySelectorAll("[data-jdc-laufey-order]")).filter(function (item) {
      return item !== performance && /^\d+$/.test(item.getAttribute("data-jdc-laufey-order") || "");
    }).sort(function (a, b) {
      return Number(a.getAttribute("data-jdc-laufey-order")) - Number(b.getAttribute("data-jdc-laufey-order"));
    });
    clips.forEach(function (item, index) {
      item.style.setProperty("order", String(index < columns ? index + 1 : index + 2), "important");
    });
    performance.style.setProperty("order", String(columns + 1), "important");
    grid.setAttribute("data-jdc-laufey-gallery-count", String(clips.length + 1));
    grid.setAttribute("data-jdc-laufey-performance-after-columns", String(columns));
  }

  function installLaufeyPerformanceStyles() {
    if (!LAUFEY_PATH.test(window.location.pathname) || document.getElementById("jdc-laufey-performance-styles35")) return;
    var style = document.createElement("style");
    style.id = "jdc-laufey-performance-styles35";
    style.textContent = [
      ".jdc-laufey-performance-source-section{display:none!important}",
      ".jdc-laufey-gallery-grid>.jdc-laufey-performance-item{grid-column:1/-1!important;position:relative!important;inset:auto!important;grid-area:auto!important;transform:none!important;width:100%!important;height:auto!important;min-width:0!important;min-height:0!important}",
      ".jdc-laufey-gallery-grid>.jdc-laufey-performance-item>.sqs-block{box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;padding:0!important}",
      ".jdc-laufey-gallery-grid>.jdc-laufey-performance-item [data-jdc-video]{display:block!important;width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:16/9!important;background-position:center!important;background-size:cover!important}"
    ].join("");
    (document.head || document.documentElement).appendChild(style);
  }

  function integrateLaufeyPerformance() {
    if (!LAUFEY_PATH.test(window.location.pathname)) return false;
    var grid = document.querySelector(".jdc-laufey-gallery-grid");
    if (!grid) return false;
    var clipItems = Array.prototype.slice.call(grid.children).filter(function (item) {
      return /^\d+$/.test(item.getAttribute("data-jdc-laufey-order") || "");
    }).sort(function (a, b) {
      return Number(a.getAttribute("data-jdc-laufey-order")) - Number(b.getAttribute("data-jdc-laufey-order"));
    });
    if (clipItems.length < 8 || clipItems.some(function (item, index) {
      return grid.children[index] !== item;
    })) return false;

    var performanceShell = Array.prototype.slice.call(document.querySelectorAll("[data-jdc-video]")).find(function (shell) {
      var config = videoConfig(shell);
      return config && config.systemDataId === LAUFEY_PERFORMANCE_ID;
    });
    if (!performanceShell) return false;
    var wrapper = performanceShell.closest(".fe-block") || performanceShell;
    if (!wrapper.classList.contains("jdc-laufey-performance-item")) {
      var sourceSection = wrapper.closest(".page-section, section");
      wrapper.classList.add("jdc-laufey-gallery-item", "jdc-laufey-performance-item");
      wrapper.setAttribute("data-jdc-laufey-order", "performance");
      wrapper.style.setProperty("grid-column", "1 / -1", "important");
      grid.appendChild(wrapper);
      if (sourceSection && !sourceSection.querySelector(".fe-block")) {
        sourceSection.classList.add("jdc-laufey-performance-source-section");
        sourceSection.setAttribute("aria-hidden", "true");
      }
    }
    orderLaufeyGallery();
    document.documentElement.setAttribute("data-jdc-laufey-performance-layout", "pilot35-after-first-row");
    return true;
  }

  function installLovbStyles() {
    if (!LOVB_PATH.test(window.location.pathname) || document.getElementById("jdc-lovb-gallery-styles35")) return;
    var style = document.createElement("style");
    style.id = "jdc-lovb-gallery-styles35";
    style.textContent = [
      ".jdc-lovb-gallery-section{height:auto!important;min-height:0!important}",
      ".jdc-lovb-gallery-section>.content-wrapper{display:block!important;box-sizing:border-box!important;width:100%!important;max-width:none!important;height:auto!important;min-height:0!important;padding:0!important}",
      ".jdc-lovb-gallery-source{display:none!important}",
      ".jdc-lovb-gallery-flow{display:block!important;box-sizing:border-box!important;width:100%!important;padding:clamp(28px,4.2vw,52px) 4.2vw clamp(28px,4.2vw,52px)!important}",
      ".jdc-lovb-gallery-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:clamp(18px,2.2vw,32px) clamp(12px,1.6vw,18px)!important;width:100%!important;box-sizing:border-box!important;align-items:start!important}",
      ".jdc-lovb-gallery-grid>.jdc-lovb-gallery-item{position:relative!important;inset:auto!important;grid-area:auto!important;transform:none!important;translate:none!important;width:100%!important;height:auto!important;min-width:0!important;min-height:0!important}",
      ".jdc-lovb-gallery-grid>.jdc-lovb-gallery-item>.sqs-block{box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;margin:0!important;padding:0!important;transform:none!important}",
      ".jdc-lovb-gallery-grid .sqs-block-content{width:100%!important;height:auto!important;min-height:0!important}",
      ".jdc-lovb-gallery-grid [data-jdc-video],.jdc-lovb-gallery-grid [data-config-video]{display:block!important;width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:9/16!important;background-position:center!important;background-size:cover!important}",
      ".jdc-lovb-credits{position:relative!important;inset:auto!important;grid-area:auto!important;transform:none!important;translate:none!important;box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;margin:clamp(28px,4.2vw,52px) 0 0!important}",
      ".jdc-lovb-credits>.sqs-block,.jdc-lovb-credits .sqs-block-content{width:100%!important;height:auto!important;min-height:0!important}",
      "@media(max-width:767px){.jdc-lovb-gallery-flow{padding:24px 6vw!important}.jdc-lovb-gallery-grid{grid-template-columns:minmax(0,1fr)!important;gap:24px!important}.jdc-lovb-credits{margin-top:24px!important}}"
    ].join("");
    (document.head || document.documentElement).appendChild(style);
  }

  function applyLovbPortraitAspects() {
    if (!LOVB_PATH.test(window.location.pathname)) return;
    var grid = document.querySelector(".jdc-lovb-gallery-grid");
    if (!grid) return;
    Array.prototype.slice.call(grid.querySelectorAll("[data-jdc-video], [data-config-video]")).forEach(function (shell) {
      var item = shell.closest(".jdc-lovb-gallery-item");
      if (item) {
        item.style.setProperty("height", "auto", "important");
        item.style.setProperty("min-height", "0", "important");
        item.style.setProperty("aspect-ratio", "9 / 16", "important");
        var block = item.querySelector(":scope > .sqs-block");
        if (block) {
          block.style.setProperty("margin", "0", "important");
          block.style.setProperty("margin-bottom", "0", "important");
          block.style.setProperty("transform", "none", "important");
        }
      }
      shell.style.setProperty("--jdc-video-aspect", "0.5625");
      shell.style.setProperty("width", "100%", "important");
      shell.style.setProperty("height", "auto", "important");
      shell.style.setProperty("min-height", "0", "important");
      shell.style.setProperty("aspect-ratio", "9 / 16", "important");
      shell.style.setProperty("background-size", "cover", "important");
      shell.setAttribute("data-jdc-aspect-source", "pilot35-lovb-portrait-crop");
      var stage = shell.querySelector(".native-video-player, .jdc-video-stage");
      if (stage) {
        stage.style.setProperty("position", "absolute", "important");
        stage.style.setProperty("inset", "0", "important");
        stage.style.setProperty("width", "100%", "important");
        stage.style.setProperty("height", "100%", "important");
        stage.style.setProperty("aspect-ratio", "9 / 16", "important");
      }
      var video = shell.querySelector("video");
      if (video) {
        video.style.setProperty("position", "absolute", "important");
        video.style.setProperty("inset", "0", "important");
        video.style.setProperty("width", "100%", "important");
        video.style.setProperty("height", "100%", "important");
        video.style.setProperty("object-fit", "cover", "important");
        video.style.setProperty("object-position", "center", "important");
      }
    });
    document.documentElement.setAttribute("data-jdc-lovb-gallery-layout", "pilot35-siberia-portrait-grid");
  }

  function installLovbGallery() {
    if (!LOVB_PATH.test(window.location.pathname)) return false;
    installLovbStyles();
    var shellsById = new Map();
    Array.prototype.slice.call(document.querySelectorAll("[data-jdc-video], [data-config-video]")).forEach(function (shell) {
      var config = videoConfig(shell);
      if (config && LOVB_GALLERY_IDS.indexOf(config.systemDataId) !== -1) shellsById.set(config.systemDataId, shell);
    });
    if (!LOVB_GALLERY_IDS.every(function (id) { return shellsById.has(id); })) return false;
    var shells = LOVB_GALLERY_IDS.map(function (id) { return shellsById.get(id); });
    var section = shells[0].closest(".page-section, section");
    if (!section || !shells.every(function (shell) { return shell.closest(".page-section, section") === section; })) return false;
    var engine = shells[0].closest(".fluid-engine");
    if (!engine || !shells.every(function (shell) { return shell.closest(".fluid-engine") === engine; })) return false;
    var contentWrapper = section.querySelector(":scope > .content-wrapper") || section.querySelector(".content-wrapper");
    if (!contentWrapper) return false;

    var flow = contentWrapper.querySelector(":scope > .jdc-lovb-gallery-flow");
    if (!flow) {
      flow = document.createElement("div");
      flow.className = "jdc-lovb-gallery-flow";
      var grid = document.createElement("div");
      grid.className = "jdc-lovb-gallery-grid";
      flow.appendChild(grid);
      contentWrapper.appendChild(flow);
    }
    var gallery = flow.querySelector(":scope > .jdc-lovb-gallery-grid");
    shells.forEach(function (shell, index) {
      var wrapper = shell.closest(".fe-block") || shell;
      wrapper.classList.add("jdc-lovb-gallery-item");
      wrapper.setAttribute("data-jdc-lovb-order", String(index + 1));
      gallery.appendChild(wrapper);
    });
    var credits = Array.prototype.slice.call(engine.children).find(function (item) {
      return item.classList && item.classList.contains("fe-block") && !item.querySelector("[data-jdc-video], [data-config-video]");
    });
    if (credits) {
      credits.classList.add("jdc-lovb-credits");
      flow.appendChild(credits);
    }
    var source = engine.closest(".content") || engine;
    source.classList.add("jdc-lovb-gallery-source");
    source.setAttribute("aria-hidden", "true");
    section.classList.add("jdc-lovb-gallery-section");
    section.setAttribute("data-jdc-lovb-gallery", "ready");
    gallery.setAttribute("data-jdc-lovb-gallery-count", String(shells.length));
    applyLovbPortraitAspects();

    if (!lovbObserver && window.MutationObserver) {
      lovbObserver = new MutationObserver(applyLovbPortraitAspects);
      lovbObserver.observe(flow, { childList: true, subtree: true });
    }
    return true;
  }

  function finishRelease() {
    preseedLaufeyGrid();
    installLimnOverflowFix();
    installLaufeyPerformanceStyles();
    installLovbGallery();
    [0, 120, 400, 1000, 2500, 5000, 9000, 14000, 18000].forEach(function (delay) {
      window.setTimeout(integrateLaufeyPerformance, delay);
      window.setTimeout(function () {
        installLovbGallery();
        applyLovbPortraitAspects();
      }, delay);
    });
    [0, 120, 400, 1000, 2500, 5000, 9000, 14000, 18000].forEach(function (delay) {
      window.setTimeout(function () {
        if (document.body) document.body.setAttribute("data-jdc-footer-release", "pilot35");
        document.documentElement.setAttribute("data-jdc-footer-release", "pilot35");
      }, delay);
    });
  }

  function loadCore() {
    if (document.querySelector('script[data-jdc-pilot35-core="pilot34"]')) return;
    var core = document.createElement("script");
    core.src = CORE_URL;
    core.async = false;
    core.crossOrigin = "anonymous";
    core.setAttribute("data-jdc-pilot35-core", "pilot34");
    core.addEventListener("load", finishRelease, { once: true });
    (document.head || document.documentElement).appendChild(core);
  }

  preseedLaufeyGrid();
  installLimnOverflowFix();
  installLaufeyPerformanceStyles();
  installLovbGallery();
  window.addEventListener("resize", orderLaufeyGallery, { passive: true });
  window.addEventListener("resize", applyLovbPortraitAspects, { passive: true });
  loadCore();
})();
