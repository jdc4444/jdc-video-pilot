(function () {
  "use strict";

  var CORE_URL = "https://jdc4444.github.io/jdc-video-pilot/jdc-footer-pilot32.js?v=9554191";
  var PATHS = {
    limn: /^\/tobias-rees-limn\/?$/,
    basis: /^\/basis\/?$/,
    laufey: /^\/laufey-tour-visuals\/?$/,
    dig: /^\/dig-brand-identity\/?$/
  };
  var pending = false;
  var observers = [];

  function currentProject() {
    var path = window.location.pathname;
    return Object.keys(PATHS).find(function (name) { return PATHS[name].test(path); }) || "";
  }

  function edgeGap() {
    var value = Number.parseFloat(document.body && document.body.getAttribute("data-jdc-project-edge-gap"));
    if (Number.isFinite(value)) return value;
    return window.innerWidth < 768 ? 24 : Math.min(52, Math.max(32, window.innerWidth * 0.03));
  }

  function installLayoutStyles() {
    if (!currentProject() || document.getElementById("jdc-project-gallery-flow-fix33")) return;
    var style = document.createElement("style");
    style.id = "jdc-project-gallery-flow-fix33";
    style.textContent = [
      ".jdc-limn-gallery-section>.content-wrapper,.jdc-basis-project-section>.content-wrapper{display:block!important;box-sizing:border-box!important;width:100%!important;max-width:none!important;min-height:0!important}",
      ".jdc-limn-gallery-section>.content-wrapper>.content,.jdc-basis-project-section>.content-wrapper>.content{display:block!important;box-sizing:border-box!important;width:100%!important;max-width:none!important;min-height:0!important}",
      ".jdc-limn-gallery-section .fluid-engine{display:grid!important;width:100%!important;max-width:none!important;min-height:0!important;margin-bottom:var(--jdc-project-top-shift,0px)!important}",
      ".jdc-limn-gallery-section>.content-wrapper>.jdc-limn-gallery-grid{display:grid!important;width:100%!important;max-width:none!important;height:auto!important;min-height:0!important;align-items:start!important;align-content:start!important;grid-auto-rows:auto!important;margin-top:0!important;margin-bottom:calc(clamp(20px,2.2vw,34px) + var(--jdc-limn-grid-shift,0px))!important;translate:0 var(--jdc-limn-grid-shift,0px)!important}",
      ".jdc-limn-gallery-grid>.jdc-limn-gallery-item{align-self:start!important;height:auto!important;min-height:0!important}",
      ".jdc-limn-gallery-grid>.jdc-limn-gallery-item>.sqs-block{position:relative!important;inset:auto!important;width:100%!important;height:auto!important;min-height:0!important;transform:none!important}",
      ".jdc-limn-gallery-grid>.jdc-limn-gallery-item .sqs-block-content{width:100%!important;height:auto!important;min-height:0!important}",
      ".jdc-limn-gallery-grid>.jdc-limn-gallery-item [data-jdc-video]{display:block!important;width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:2/1!important;background-size:contain!important}",
      ".jdc-basis-project-section{height:auto!important;min-height:0!important}",
      ".jdc-basis-project-section>.content-wrapper{padding:clamp(24px,2.5vw,38px) 0 0!important}",
      ".jdc-basis-project-section>.content-wrapper>.content:has(.fluid-engine:empty){display:none!important}",
      ".jdc-basis-project-grid{display:grid!important;width:100%!important;max-width:none!important;height:auto!important;min-height:0!important}",
      ".jdc-basis-project-grid>.jdc-basis-project-item{height:auto!important;min-height:0!important}",
      ".jdc-basis-project-grid>.jdc-basis-project-item>.sqs-block{position:relative!important;inset:auto!important;width:100%!important;height:auto!important;min-height:0!important;transform:none!important}",
      ".jdc-basis-project-grid>.jdc-basis-title{box-sizing:border-box!important;width:100%!important;margin:0!important;padding:var(--jdc-project-edge-gap,clamp(32px,3vw,52px)) 4vw!important}",
      ".jdc-basis-project-grid>.jdc-basis-title h1{margin:0!important}",
      ".jdc-basis-project-grid>.jdc-basis-phone{margin:0 0 var(--jdc-project-edge-gap,clamp(32px,3vw,52px))!important}",
      ".jdc-laufey-gallery-section{height:auto!important;min-height:0!important}",
      ".jdc-laufey-gallery-section>.content-wrapper{display:block!important;box-sizing:border-box!important;width:100%!important;max-width:none!important;min-height:0!important;padding:0!important}",
      ".jdc-laufey-gallery-grid{width:100%!important;max-width:none!important;height:auto!important;min-height:0!important;margin-top:0!important;margin-bottom:calc(clamp(20px,2.2vw,34px) + var(--jdc-laufey-grid-shift,0px))!important;translate:0 var(--jdc-laufey-grid-shift,0px)!important}",
      ".jdc-dig-gallery-section{padding:0!important}",
      ".jdc-dig-gallery-grid{width:100%!important;max-width:none!important;margin-top:0!important;margin-bottom:calc(clamp(20px,2.2vw,34px) + var(--jdc-dig-grid-shift,0px))!important;translate:0 var(--jdc-dig-grid-shift,0px)!important}",
      "@media(max-width:767px){.jdc-limn-gallery-section>.content-wrapper,.jdc-basis-project-section>.content-wrapper,.jdc-laufey-gallery-section>.content-wrapper{padding-left:0!important;padding-right:0!important}.jdc-basis-project-section>.content-wrapper{padding-top:24px!important}.jdc-basis-project-grid>.jdc-basis-title{padding:24px 4vw!important}.jdc-basis-project-grid>.jdc-basis-phone{margin-bottom:24px!important}.jdc-laufey-gallery-grid,.jdc-dig-gallery-grid{margin-bottom:calc(14px + var(--jdc-laufey-grid-shift,var(--jdc-dig-grid-shift,0px)))!important}}"
    ].join("");
    document.head.appendChild(style);
    document.documentElement.setAttribute("data-jdc-project-gallery-flow-fix", "pilot33");
  }

  function closestInfoBefore(element) {
    if (!element) return null;
    var top = element.getBoundingClientRect().top;
    return Array.prototype.slice.call(document.querySelectorAll(".jdc-project-info-band"))
      .filter(function (info) { return info.getBoundingClientRect().bottom <= top + 1; })
      .sort(function (a, b) { return b.getBoundingClientRect().bottom - a.getBoundingClientRect().bottom; })[0] || document.querySelector(".jdc-project-info-band");
  }

  function alignElement(element, info, property, marker) {
    if (!element || !info) return false;
    var desiredGap = edgeGap();
    var currentShift = Number.parseFloat(getComputedStyle(element).getPropertyValue(property)) || 0;
    var currentGap = element.getBoundingClientRect().top - info.getBoundingClientRect().bottom;
    var desiredShift = currentShift + desiredGap - currentGap;
    if (Math.abs(desiredShift - currentShift) > 0.1) {
      element.style.setProperty(property, Math.round(desiredShift * 100) / 100 + "px");
    }
    document.documentElement.setAttribute(marker, String(Math.round(desiredGap * 100) / 100));
    return true;
  }

  function alignCurrentProject() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () {
      pending = false;
      var project = currentProject();
      var target = null;
      var info = null;

      if (project === "limn") {
        target = document.querySelector(".jdc-limn-gallery-grid");
        info = document.querySelector(".jdc-limn-gallery-section .jdc-project-info-band") || closestInfoBefore(target);
        alignElement(target, info, "--jdc-limn-grid-shift", "data-jdc-limn-gallery-gap");
      } else if (project === "laufey") {
        target = document.querySelector(".jdc-laufey-gallery-grid");
        info = closestInfoBefore(target);
        alignElement(target, info, "--jdc-laufey-grid-shift", "data-jdc-laufey-gallery-gap");
      } else if (project === "dig") {
        target = document.querySelector(".jdc-dig-gallery-grid");
        info = closestInfoBefore(target);
        alignElement(target, info, "--jdc-dig-grid-shift", "data-jdc-dig-gallery-gap");
      }

      if (target && info && window.ResizeObserver && !target.hasAttribute("data-jdc-flow-observed33")) {
        target.setAttribute("data-jdc-flow-observed33", "true");
        var observer = new ResizeObserver(alignCurrentProject);
        observer.observe(target);
        observer.observe(info);
        observers.push(observer);
      }
      if (document.body) document.body.setAttribute("data-jdc-footer-release", "pilot33");
    });
  }

  function scheduleAlignment() {
    [0, 120, 400, 1000, 2500, 5000, 9000].forEach(function (delay) {
      window.setTimeout(function () {
        installLayoutStyles();
        alignCurrentProject();
      }, delay);
    });
    window.addEventListener("resize", alignCurrentProject, { passive: true });
  }

  function loadCore() {
    if (window.__JDC_SMART_VIDEO__) {
      scheduleAlignment();
      return;
    }
    if (document.querySelector('script[data-jdc-pilot33-core="pilot32"]')) return;
    var core = document.createElement("script");
    core.src = CORE_URL;
    core.async = false;
    core.crossOrigin = "anonymous";
    core.setAttribute("data-jdc-pilot33-core", "pilot32");
    core.addEventListener("load", scheduleAlignment, { once: true });
    (document.head || document.documentElement).appendChild(core);
  }

  installLayoutStyles();
  loadCore();
})();
