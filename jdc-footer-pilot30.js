(function () {
  "use strict";

  var CORE_URL = "https://jdc4444.github.io/jdc-video-pilot/jdc-footer-pilot27.js?v=53afd0d";
  var POLYMARKET_PATH = /^\/polymarket-make-your-own-market\/?$/;

  function installPolymarketFlowFix() {
    if (!POLYMARKET_PATH.test(window.location.pathname)) return;
    if (document.getElementById("jdc-polymarket-flow-fix30")) return;

    var style = document.createElement("style");
    style.id = "jdc-polymarket-flow-fix30";
    style.textContent = [
      ".jdc-polymarket-gallery-section>.content-wrapper{display:block!important;width:100%!important;min-height:0!important}",
      ".jdc-polymarket-gallery-section .fluid-engine{display:grid!important;width:100%!important;max-width:none!important;min-height:0!important;margin-bottom:var(--jdc-project-top-shift,0px)!important}",
      ".jdc-polymarket-gallery-section>.content-wrapper>.jdc-polymarket-gallery-grid{display:grid!important;width:100%!important;max-width:none!important;height:auto!important;min-height:0!important;align-items:start!important;align-content:start!important;grid-auto-rows:auto!important}",
      ".jdc-polymarket-gallery-grid>.jdc-polymarket-gallery-item{align-self:start!important;height:auto!important;min-height:0!important}",
      ".jdc-polymarket-gallery-grid>.jdc-polymarket-gallery-item>.sqs-block{position:relative!important;inset:auto!important;width:100%!important;height:auto!important;min-height:0!important;transform:none!important}",
      ".jdc-polymarket-gallery-grid>.jdc-polymarket-gallery-item .sqs-block-content{width:100%!important;height:auto!important;min-height:0!important}",
      ".jdc-polymarket-gallery-grid>.jdc-polymarket-gallery-item [data-jdc-video]{width:100%!important;height:auto!important;min-height:0!important}",
      ".jdc-polymarket-gallery-section .jdc-project-lead-block{z-index:2!important}",
      ".jdc-polymarket-gallery-section .jdc-project-lead-block [data-jdc-video]{width:100%!important;max-width:none!important}",
      "@media(max-width:767px){.jdc-polymarket-gallery-section>.content-wrapper{padding-left:0!important;padding-right:0!important}}"
    ].join("");
    document.head.appendChild(style);
    document.documentElement.setAttribute("data-jdc-polymarket-flow-fix", "pilot30");
  }

  function loadPilot27Core() {
    if (window.__JDC_SMART_VIDEO__) return;
    if (document.querySelector('script[data-jdc-pilot30-core="pilot27"]')) return;

    var core = document.createElement("script");
    core.src = CORE_URL;
    core.async = false;
    core.crossOrigin = "anonymous";
    core.setAttribute("data-jdc-pilot30-core", "pilot27");
    core.addEventListener("load", function () {
      if (document.body) document.body.setAttribute("data-jdc-footer-release", "pilot30");
    }, { once: true });
    (document.head || document.documentElement).appendChild(core);
  }

  installPolymarketFlowFix();
  loadPilot27Core();
})();
