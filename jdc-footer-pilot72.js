(function () {
  "use strict";

  if (window.__JDC_PILOT72__) return;
  window.__JDC_PILOT72__ = true;

  var path = window.location.pathname.replace(/\/+$/, "") || "/";
  var isNikeJordan = path === "/nike-jordan";
  var root = document.documentElement;
  var pilotScriptUrl = document.currentScript && document.currentScript.src
    ? document.currentScript.src
    : window.location.href;

  if (isNikeJordan) {
    function setImportant(element, property, value) {
      if (!element) return;
      if (element.style.getPropertyValue(property) !== value ||
          element.style.getPropertyPriority(property) !== "important") {
        element.style.setProperty(property, value, "important");
      }
    }

    function balanceMainDisplay() {
      var shell = document.querySelector("body main .jdc-video-shell");
      if (!shell) return;
      var player = shell.querySelector(".native-video-player");
      var video = shell.querySelector("video");

      setImportant(shell, "width", "76.0416666667%");
      setImportant(shell, "max-width", "none");
      setImportant(shell, "height", "auto");
      setImportant(shell, "min-height", "0px");
      setImportant(shell, "aspect-ratio", "73 / 54");
      setImportant(shell, "margin-left", "auto");
      setImportant(shell, "margin-right", "auto");
      setImportant(shell, "background-size", "cover");
      setImportant(shell, "background-position", "50% 50%");

      setImportant(player, "inset", "0px");
      setImportant(player, "width", "100%");
      setImportant(player, "height", "100%");
      setImportant(player, "aspect-ratio", "73 / 54");

      setImportant(video, "width", "100%");
      setImportant(video, "height", "100%");
      setImportant(video, "object-fit", "cover");
      setImportant(video, "object-position", "50% 50%");

    }

    var style = document.createElement("style");
    style.id = "jdc-nike-main-balanced-frame72";
    style.textContent = [
      "html[data-jdc-nike-main-balanced-frame72='true'] body main .jdc-video-shell{width:76.0416666667%!important;max-width:none!important;height:auto!important;min-height:0!important;aspect-ratio:73/54!important;margin-left:auto!important;margin-right:auto!important;background-size:cover!important;background-position:50% 50%!important}",
      "html[data-jdc-nike-main-balanced-frame72='true'] body main .jdc-video-shell .native-video-player{inset:0!important;width:100%!important;height:100%!important;aspect-ratio:73/54!important}",
      "html[data-jdc-nike-main-balanced-frame72='true'] body main .jdc-video-shell video{width:100%!important;height:100%!important;object-fit:cover!important;object-position:50% 50%!important}"
    ].join("");
    (document.head || root).appendChild(style);
    root.setAttribute("data-jdc-nike-main-balanced-frame72", "true");

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", balanceMainDisplay, { once: true });
    } else {
      balanceMainDisplay();
    }
    new MutationObserver(balanceMainDisplay).observe(root, {
      childList: true,
      subtree: true
    });
    window.addEventListener("resize", function () {
      window.requestAnimationFrame(balanceMainDisplay);
      window.setTimeout(balanceMainDisplay, 100);
    }, { passive: true });
    [0, 250, 1000, 2500].forEach(function (delay) {
      window.setTimeout(balanceMainDisplay, delay);
    });
  }

  var releaseUrl = new URL("jdc-footer-pilot71.js", pilotScriptUrl).href;
  var script = document.createElement("script");
  script.src = releaseUrl;
  script.async = false;
  script.crossOrigin = "anonymous";
  script.setAttribute("data-jdc-pilot72-release", "nike-main-balanced-frame");
  (document.head || root).appendChild(script);
})();
