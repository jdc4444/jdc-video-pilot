(function () {
  "use strict";

  var RELEASE = "pilot40";
  var CORE_URL = "https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@b704fcaceefd5819170e4d9a06c8f84087a52778/jdc-footer-pilot39.js";
  var DAY_ONE_PATH = "/day-one";
  var DAY_ONE_BTS_ID = "c1e56f2c-33a3-4fb1-b221-a7c964548622";
  var BOMBAS_PATH = "/bombas-dream-of-comfort";
  var BOMBAS_BTS_ID = "f639e441-43ba-4ac7-84c0-b63c8f20af7b";

  function normalizePath(path) {
    return String(path || "/").replace(/\/+$/, "") || "/";
  }

  function parseVideoConfig(shell) {
    try { return JSON.parse(shell.getAttribute("data-jdc-video") || shell.getAttribute("data-config-video") || "{}"); }
    catch (error) { return null; }
  }

  function shellById(id) {
    return Array.prototype.slice.call(document.querySelectorAll("[data-jdc-video], [data-config-video]")).find(function (shell) {
      var config = parseVideoConfig(shell);
      return config && config.systemDataId === id;
    }) || null;
  }

  function installStyles() {
    if (document.getElementById("jdc-bts-fix-styles40")) return;
    var style = document.createElement("style");
    style.id = "jdc-bts-fix-styles40";
    style.textContent = [
      ".jdc-clip-bts-item[data-jdc-bts-fix='pilot40']{grid-column:1/-1!important;display:flex!important;justify-content:center!important;align-items:flex-start!important;width:100%!important;height:var(--jdc-bts-fix-height,auto)!important;min-height:var(--jdc-bts-fix-height,0)!important;overflow:visible!important}",
      ".jdc-clip-bts-item[data-jdc-bts-fix='pilot40']>.sqs-block{width:var(--jdc-bts-fix-width)!important;max-width:100%!important;height:auto!important;min-height:0!important}",
      ".jdc-bts-section40{display:block!important;box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;background:#fff!important;color:#000!important;overflow:clip!important}",
      ".jdc-bts-flow40{display:block!important;box-sizing:border-box!important;width:100%!important;max-width:none!important;padding:clamp(30px,4.2vw,58px) 4.2vw clamp(42px,5vw,72px)!important}",
      ".jdc-bts-frame40{position:relative!important;display:block!important;box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:16/9!important;overflow:hidden!important;background:#080808!important}",
      ".jdc-bts-frame40>.sqs-block{position:relative!important;inset:auto!important;display:block!important;box-sizing:border-box!important;width:100%!important;height:100%!important;min-height:0!important;margin:0!important;padding:0!important;transform:none!important;translate:none!important}",
      ".jdc-bts-frame40 [data-jdc-video],.jdc-bts-frame40 [data-config-video]{position:relative!important;inset:auto!important;display:block!important;width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:16/9!important;overflow:hidden!important;background-position:center!important;background-size:cover!important}",
      ".jdc-bts-frame40 .native-video-player,.jdc-bts-frame40 .jdc-video-stage,.jdc-bts-frame40 video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;aspect-ratio:16/9!important;object-fit:cover!important}",
      "@media(max-width:767px){.jdc-bts-flow40{padding:28px 6vw 40px!important}}"
    ].join("");
    (document.head || document.documentElement).appendChild(style);
  }

  function syncDayOneBts() {
    if (normalizePath(window.location.pathname) !== DAY_ONE_PATH) return false;
    var btsItem = document.querySelector(".jdc-clip-bts-item[data-jdc-bts-id='" + DAY_ONE_BTS_ID + "']");
    var grid = btsItem && btsItem.closest(".jdc-clip-gallery-grid");
    var block = btsItem && btsItem.querySelector(":scope > .sqs-block");
    var reference = grid && grid.querySelector(".jdc-clip-gallery-item");
    if (!btsItem || !grid || !block || !reference) return false;

    if (grid.lastElementChild !== btsItem) grid.appendChild(btsItem);
    btsItem.setAttribute("data-jdc-bts-fix", RELEASE);
    var referenceWidth = Math.max(1, reference.getBoundingClientRect().width);
    var targetWidth = Math.min(420, referenceWidth);
    btsItem.style.setProperty("--jdc-bts-fix-width", targetWidth + "px");
    block.style.setProperty("width", targetWidth + "px", "important");
    block.style.setProperty("height", "auto", "important");
    btsItem.style.removeProperty("--jdc-bts-fix-height");
    window.requestAnimationFrame(function () {
      var height = Math.ceil(block.getBoundingClientRect().height);
      if (height > 0) btsItem.style.setProperty("--jdc-bts-fix-height", height + "px");
    });
    document.documentElement.setAttribute("data-jdc-bts-fix", RELEASE);
    document.documentElement.setAttribute("data-jdc-bts-fix-page", "day-one");
    return true;
  }

  function trimBombasSection(section, hiddenHost) {
    var grid = section && section.querySelector(".fluid-engine");
    if (!grid) return;
    window.requestAnimationFrame(function () {
      var visibleBlocks = Array.prototype.slice.call(section.querySelectorAll(".fe-block")).filter(function (block) {
        return block !== hiddenHost && window.getComputedStyle(block).display !== "none";
      });
      if (!visibleBlocks.length) return;
      var contentBottom = Math.max.apply(null, visibleBlocks.map(function (block) { return block.getBoundingClientRect().bottom; }));
      var sectionBottom = section.getBoundingClientRect().bottom;
      var gap = window.innerWidth < 768 ? 28 : 40;
      var adjustment = sectionBottom - contentBottom - gap;
      var currentMargin = parseFloat(window.getComputedStyle(grid).marginBottom) || 0;
      grid.style.setProperty("margin-bottom", (currentMargin - adjustment) + "px", "important");
    });
  }

  function installBombasBts() {
    if (normalizePath(window.location.pathname) !== BOMBAS_PATH) return false;
    var shell = shellById(BOMBAS_BTS_ID);
    var block = shell && shell.closest(".sqs-block");
    var host = shell && shell.closest(".fe-block");
    var nativeSection = host && host.closest(".page-section");
    if (!shell || !block || !host || !nativeSection || !nativeSection.parentNode) return false;

    var section = document.querySelector(".jdc-bts-section40[data-jdc-bts-id='" + BOMBAS_BTS_ID + "']");
    if (!section) {
      section = document.createElement("section");
      section.className = "jdc-bts-section40 page-section";
      section.setAttribute("data-jdc-bts-id", BOMBAS_BTS_ID);
      section.setAttribute("aria-label", "Bombas behind the scenes");
      var flow = document.createElement("div");
      flow.className = "jdc-bts-flow40";
      var frame = document.createElement("div");
      frame.className = "jdc-bts-frame40";
      frame.appendChild(block);
      flow.appendChild(frame);
      section.appendChild(flow);
      nativeSection.parentNode.insertBefore(section, nativeSection.nextSibling);
    }

    host.style.setProperty("display", "none", "important");
    host.setAttribute("data-jdc-bts-relocated", RELEASE);
    shell.style.setProperty("aspect-ratio", "16 / 9", "important");
    shell.style.setProperty("height", "auto", "important");
    trimBombasSection(nativeSection, host);
    document.documentElement.setAttribute("data-jdc-bts-fix", RELEASE);
    document.documentElement.setAttribute("data-jdc-bts-fix-page", "bombas-dream-of-comfort");
    return true;
  }

  function install() {
    installStyles();
    var path = normalizePath(window.location.pathname);
    if (path === DAY_ONE_PATH) syncDayOneBts();
    if (path === BOMBAS_PATH) installBombasBts();
    if (document.body) document.body.setAttribute("data-jdc-footer-release", RELEASE);
  }

  function loadCore() {
    if (document.querySelector('script[data-jdc-pilot40-core="pilot39"]')) return;
    if (document.querySelector('script[data-jdc-pilot39-core="pilot38"]')) return;
    var core = document.createElement("script");
    core.src = CORE_URL;
    core.async = false;
    core.crossOrigin = "anonymous";
    core.setAttribute("data-jdc-pilot40-core", "pilot39");
    (document.head || document.documentElement).appendChild(core);
  }

  function finish() {
    [0, 120, 400, 1000, 2500, 5000, 7000].forEach(function (delay) {
      window.setTimeout(install, delay);
    });
  }

  window.addEventListener("resize", function () { window.setTimeout(install, 80); }, { passive: true });
  window.addEventListener("pageshow", install, { passive: true });
  loadCore();
  finish();
})();
