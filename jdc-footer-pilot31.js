(function () {
  "use strict";

  var CORE_URL = "https://jdc4444.github.io/jdc-video-pilot/jdc-footer-pilot27.js?v=53afd0d";
  var POLYMARKET_PATH = /^\/polymarket-make-your-own-market\/?$/;
  var alignmentPending = false;
  var alignmentObserver = null;

  function installPolymarketFlowFix() {
    if (!POLYMARKET_PATH.test(window.location.pathname)) return;
    if (document.getElementById("jdc-polymarket-flow-fix31")) return;

    var style = document.createElement("style");
    style.id = "jdc-polymarket-flow-fix31";
    style.textContent = [
      ".jdc-polymarket-gallery-section>.content-wrapper{display:block!important;width:100%!important;min-height:0!important}",
      ".jdc-polymarket-gallery-section .fluid-engine{display:grid!important;width:100%!important;max-width:none!important;min-height:0!important;margin-bottom:var(--jdc-project-top-shift,0px)!important}",
      ".jdc-polymarket-gallery-section>.content-wrapper>.jdc-polymarket-gallery-grid{display:grid!important;width:100%!important;max-width:none!important;height:auto!important;min-height:0!important;align-items:start!important;align-content:start!important;grid-auto-rows:auto!important;margin-top:var(--jdc-polymarket-grid-margin,clamp(20px,2.2vw,34px))!important}",
      ".jdc-polymarket-gallery-grid>.jdc-polymarket-gallery-item{align-self:start!important;height:auto!important;min-height:0!important}",
      ".jdc-polymarket-gallery-grid>.jdc-polymarket-gallery-item>.sqs-block{position:relative!important;inset:auto!important;width:100%!important;height:auto!important;min-height:0!important;transform:none!important}",
      ".jdc-polymarket-gallery-grid>.jdc-polymarket-gallery-item .sqs-block-content{width:100%!important;height:auto!important;min-height:0!important}",
      ".jdc-polymarket-gallery-grid>.jdc-polymarket-gallery-item [data-jdc-video]{width:100%!important;height:auto!important;min-height:0!important}",
      ".jdc-polymarket-gallery-section .jdc-project-lead-block{z-index:2!important}",
      ".jdc-polymarket-gallery-section .jdc-project-lead-block [data-jdc-video]{width:100%!important;max-width:none!important}",
      "@media(max-width:767px){.jdc-polymarket-gallery-section>.content-wrapper{padding-left:0!important;padding-right:0!important}}"
    ].join("");
    document.head.appendChild(style);
    document.documentElement.setAttribute("data-jdc-polymarket-flow-fix", "pilot31");
  }

  function alignPolymarketGallery() {
    if (!POLYMARKET_PATH.test(window.location.pathname) || alignmentPending) return;
    alignmentPending = true;
    requestAnimationFrame(function () {
      alignmentPending = false;
      var grid = document.querySelector(".jdc-polymarket-gallery-grid");
      var info = document.querySelector(".jdc-polymarket-gallery-section .jdc-project-info-band");
      var engine = document.querySelector(".jdc-polymarket-gallery-section .fluid-engine");
      if (!grid || !info || !engine) return;

      var desiredGap = Number.parseFloat(document.body.getAttribute("data-jdc-project-edge-gap"));
      if (!Number.isFinite(desiredGap)) desiredGap = window.innerWidth < 768 ? 24 : Math.min(52, Math.max(32, window.innerWidth * 0.03));
      var currentMargin = Number.parseFloat(getComputedStyle(grid).marginTop) || 0;
      var currentGap = grid.getBoundingClientRect().top - info.getBoundingClientRect().bottom;
      var desiredMargin = currentMargin + desiredGap - currentGap;
      if (Math.abs(desiredMargin - currentMargin) > 0.1) {
        grid.style.setProperty("--jdc-polymarket-grid-margin", Math.round(desiredMargin * 100) / 100 + "px");
      }
      document.documentElement.setAttribute("data-jdc-polymarket-gallery-gap", String(Math.round(desiredGap * 100) / 100));

      if (!alignmentObserver && window.ResizeObserver) {
        alignmentObserver = new ResizeObserver(alignPolymarketGallery);
        alignmentObserver.observe(engine);
        alignmentObserver.observe(info);
        alignmentObserver.observe(grid);
      }
    });
  }

  function schedulePolymarketAlignment() {
    [0, 120, 400, 1000, 2500, 5000].forEach(function (delay) {
      window.setTimeout(alignPolymarketGallery, delay);
    });
    window.addEventListener("resize", alignPolymarketGallery, { passive: true });
  }

  function loadPilot27Core() {
    if (window.__JDC_SMART_VIDEO__) {
      schedulePolymarketAlignment();
      return;
    }
    if (document.querySelector('script[data-jdc-pilot31-core="pilot27"]')) return;

    var core = document.createElement("script");
    core.src = CORE_URL;
    core.async = false;
    core.crossOrigin = "anonymous";
    core.setAttribute("data-jdc-pilot31-core", "pilot27");
    core.addEventListener("load", function () {
      if (document.body) document.body.setAttribute("data-jdc-footer-release", "pilot31");
      schedulePolymarketAlignment();
    }, { once: true });
    (document.head || document.documentElement).appendChild(core);
  }

  installPolymarketFlowFix();
  loadPilot27Core();
})();
