(function () {
  "use strict";

  if (window.__JDC_PILOT69__) return;
  window.__JDC_PILOT69__ = true;

  var path = window.location.pathname.replace(/\/+$/, "") || "/";
  var isAcousticSessions = path === "/ggm-accoustic";
  var root = document.documentElement;
  var frame = 0;
  var resizeObserver = null;
  var observed = [];

  function px(value) {
    var number = parseFloat(value || "0");
    return isFinite(number) ? number : 0;
  }

  function paintedElement(block) {
    return block.querySelector(".jdc-video-shell") ||
      block.querySelector(".native-video-player video") ||
      block.querySelector("video") ||
      block.querySelector("iframe") ||
      block.querySelector("img");
  }

  function watch(element) {
    if (!resizeObserver || !element || observed.indexOf(element) !== -1) return;
    observed.push(element);
    resizeObserver.observe(element);
  }

  function setPx(element, property, value) {
    var next = Math.round(value) + "px";
    if (element.style.getPropertyValue(property) !== next) {
      element.style.setProperty(property, next);
    }
  }

  function packAcousticSessions() {
    if (!isAcousticSessions) return false;

    var meta = document.querySelector("main .jdc-native-single-meta65");
    var engine = document.querySelector("main .jdc-native-single-engine65");
    if (!meta || !engine) return false;

    var blocks = Array.prototype.slice.call(engine.querySelectorAll(":scope > .fe-block"));
    var coreShift = px(engine.style.getPropertyValue("--jdc-native-single-shift65"));
    var coreExtension = px(engine.style.getPropertyValue("--jdc-native-single-extension65"));
    var packedAlready = root.getAttribute("data-jdc-ggm-spacing69") === "packed";
    var engineRect = engine.getBoundingClientRect();
    var baseEngineHeight = Math.max(1, engineRect.height - (packedAlready ? 0 : coreExtension));

    var media = blocks.map(function (block) {
      var element = paintedElement(block);
      if (!element) return null;
      var rect = element.getBoundingClientRect();
      if (rect.width < 20 || rect.height < 20) return null;
      var ownShift = px(block.style.getPropertyValue("--jdc-ggm-block-shift69"));
      var activeShift = packedAlready
        ? ownShift
        : (block.classList.contains("jdc-native-single-shift65") ? coreShift : 0);
      return {
        block: block,
        element: element,
        top: rect.top - activeShift,
        bottom: rect.bottom - activeShift,
        height: rect.height
      };
    }).filter(Boolean).sort(function (a, b) {
      return a.top - b.top;
    });

    if (media.length < 2) return false;

    var gap = window.matchMedia("(max-width: 767px)").matches ? 28 : 44;
    var hero = media[0];
    var metaTop = hero.bottom - engineRect.top + gap;
    var cursor = metaTop + meta.getBoundingClientRect().height + gap;

    setPx(meta, "--jdc-ggm-meta-top69", metaTop);
    hero.block.style.setProperty("--jdc-ggm-block-shift69", "0px");

    media.slice(1).forEach(function (item) {
      var baseTop = item.top - engineRect.top;
      setPx(item.block, "--jdc-ggm-block-shift69", cursor - baseTop);
      cursor += item.height + gap;
      watch(item.element);
    });

    var desiredExtent = cursor;
    setPx(engine, "--jdc-ggm-engine-extension69", Math.max(0, desiredExtent - baseEngineHeight));
    setPx(engine, "--jdc-ggm-engine-trim69", Math.max(0, baseEngineHeight - desiredExtent));
    root.setAttribute("data-jdc-ggm-spacing69", "packed");
    watch(hero.element);
    watch(meta);
    return true;
  }

  function schedulePack() {
    if (!isAcousticSessions || frame) return;
    frame = window.requestAnimationFrame(function () {
      frame = 0;
      packAcousticSessions();
    });
  }

  if (isAcousticSessions) {
    var style = document.createElement("style");
    style.id = "jdc-ggm-acoustic-spacing69";
    style.textContent = [
      "html[data-jdc-ggm-spacing69='packed'][data-jdc-sitewide-winner='pilot64'] body main .jdc-native-single-meta65{top:var(--jdc-ggm-meta-top69,var(--jdc-native-single-top65,0px))!important}",
      "html[data-jdc-ggm-spacing69='packed'][data-jdc-sitewide-winner='pilot64'] body main .jdc-native-single-shift65{transform:translateY(var(--jdc-ggm-block-shift69,var(--jdc-native-single-shift65,0px)))!important}",
      "html[data-jdc-ggm-spacing69='packed'][data-jdc-sitewide-winner='pilot64'] body main .jdc-native-single-engine65{box-sizing:content-box!important;padding-bottom:var(--jdc-ggm-engine-extension69,0px)!important;margin-bottom:calc(-1 * var(--jdc-ggm-engine-trim69,0px))!important}"
    ].join("");
    (document.head || root).appendChild(style);

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(schedulePack);
    }

    var start = function () {
      schedulePack();
      var main = document.querySelector("main");
      if (main && "MutationObserver" in window) {
        new MutationObserver(schedulePack).observe(main, { childList: true, subtree: true });
      }
      [60, 160, 360, 700, 1200, 2200, 4000].forEach(function (delay) {
        window.setTimeout(schedulePack, delay);
      });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
      start();
    }
    window.addEventListener("resize", schedulePack, { passive: true });
  }

  var scriptUrl = document.currentScript && document.currentScript.src
    ? document.currentScript.src
    : window.location.href;
  var releaseUrl = new URL("jdc-footer-pilot67.js", scriptUrl).href;
  var script = document.createElement("script");
  script.src = releaseUrl;
  script.async = false;
  script.crossOrigin = "anonymous";
  script.setAttribute("data-jdc-pilot69-release", "acoustic-spacing");
  script.addEventListener("load", schedulePack);
  (document.head || root).appendChild(script);
})();
