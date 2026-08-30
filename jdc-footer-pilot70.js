(function () {
  "use strict";

  if (window.__JDC_PILOT70__) return;
  window.__JDC_PILOT70__ = true;

  var path = window.location.pathname.replace(/\/+$/, "") || "/";
  var isAlignment = path === "/alignment-documentary";
  var root = document.documentElement;
  var pilotScriptUrl = document.currentScript && document.currentScript.src
    ? document.currentScript.src
    : window.location.href;
  var andrewHlsUrl = new URL(
    "media/alignment/andrew-zuckerman/master.m3u8?wb=combined-20260830",
    pilotScriptUrl
  ).href;
  var andrewPosterUrl = new URL(
    "media/alignment/andrew-zuckerman/andrew-intelligence-across-nature.webp?wb=combined-20260830",
    pilotScriptUrl
  ).href;
  var removedSlides = {
    "33": true,
    "43": true,
    "45": true,
    "46": true
  };

  function installAndrewInterview(gallery) {
    var existing = gallery.querySelector("[data-jdc-alignment-interview70='andrew-zuckerman']");
    if (existing) return existing;

    var figure = document.createElement("figure");
    figure.className = "jdc-alignment-interview70";
    figure.setAttribute("data-jdc-alignment-interview70", "andrew-zuckerman");

    var player = document.createElement("div");
    player.className = "sqs-native-video jdc-alignment-interview-player70";
    player.setAttribute("data-config-settings", JSON.stringify({
      muted: true,
      autoPlay: true,
      loop: true,
      controls: "full"
    }));
    player.setAttribute("data-jdc-video", JSON.stringify({
      systemDataSourceType: "mp4",
      alexandriaUrl: andrewHlsUrl,
      durationSeconds: 17.9,
      aspectRatio: 1.5,
      id: "jdc-alignment-andrew-zuckerman",
      systemDataVariants: "1440:960",
      audioCodec: "aac",
      systemDataId: "jdc-alignment-andrew-zuckerman",
      videoCodec: "h264"
    }));
    player.setAttribute("data-jdc-poster", andrewPosterUrl);
    player.setAttribute("aria-label", "Andrew Zuckerman — Intelligence Across Nature");

    figure.appendChild(player);
    gallery.insertBefore(figure, gallery.firstChild);
    return figure;
  }

  function compactAlignmentGallery() {
    if (!isAlignment) return false;
    var gallery = document.querySelector("main .jdc-alignment-gallery-flow");
    if (!gallery) return false;
    var andrewInterview = installAndrewInterview(gallery);
    var referenceVideo = Array.prototype.slice.call(document.querySelectorAll("main .jdc-video-shell")).find(function (video) {
      return !andrewInterview.contains(video) && video.getBoundingClientRect().width > 20;
    });
    if (referenceVideo) {
      andrewInterview.style.setProperty(
        "--jdc-alignment-interview-width70",
        Math.round(referenceVideo.getBoundingClientRect().width) + "px"
      );
    }
    Array.prototype.slice.call(gallery.querySelectorAll(".jdc-alignment-slide")).forEach(function (figure) {
      if (!removedSlides[figure.getAttribute("data-jdc-alignment-slide")]) return;
      if (figure.parentNode) figure.parentNode.removeChild(figure);
    });
    Array.prototype.slice.call(gallery.querySelectorAll(".jdc-alignment-slide img")).forEach(function (image) {
      image.sizes = "(max-width: 767px) 88vw, (max-width: 1746px) 44.8vw, 800px";
    });
    root.setAttribute("data-jdc-alignment-scale70", "compact-grid");
    return true;
  }

  if (isAlignment) {
    var style = document.createElement("style");
    style.id = "jdc-alignment-compact-grid70";
    style.textContent = [
      "html[data-jdc-alignment-scale70='compact-grid'] body main .jdc-alignment-gallery-flow{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;align-items:start!important;box-sizing:border-box!important;width:91.6vw!important;max-width:1600px!important;height:auto!important;min-height:0!important;gap:clamp(16px,1.8vw,26px)!important;margin:0 auto!important;padding:clamp(30px,4.2vw,58px) 0 clamp(42px,5vw,72px)!important}",
      "html[data-jdc-alignment-scale70='compact-grid'] body main .jdc-alignment-slide{width:100%!important;max-width:none!important;height:auto!important;min-height:0!important;margin:0!important}",
      "html[data-jdc-alignment-scale70='compact-grid'] body main .jdc-alignment-slide img{display:block!important;width:100%!important;height:auto!important;max-width:none!important}",
      "html[data-jdc-alignment-scale70='compact-grid'] body main .jdc-alignment-interview70{grid-column:1/-1!important;justify-self:center!important;width:min(var(--jdc-alignment-interview-width70,calc(100vw - 18px)),calc(100vw - 18px))!important;max-width:none!important;margin:0!important}",
      "html[data-jdc-alignment-scale70='compact-grid'] body main .jdc-alignment-interview-player70{display:block!important;width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:3/2!important;background-position:center!important;background-size:cover!important}",
      "html[data-jdc-alignment-scale70='compact-grid'] body main .jdc-alignment-interview70 video{display:block!important;width:100%!important;height:auto!important;aspect-ratio:3/2!important;object-fit:cover!important;background:#e7e3df!important}",
      "@media(max-width:767px){html[data-jdc-alignment-scale70='compact-grid'] body main .jdc-alignment-gallery-flow{grid-template-columns:minmax(0,1fr)!important;width:88vw!important;max-width:88vw!important;gap:14px!important;padding:28px 0 40px!important}}"
    ].join("");
    (document.head || root).appendChild(style);

    var schedule = function () {
      [0, 80, 220, 500, 1000, 2200, 4200].forEach(function (delay) {
        window.setTimeout(compactAlignmentGallery, delay);
      });
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", schedule, { once: true });
    } else {
      schedule();
    }
    if ("MutationObserver" in window) {
      new MutationObserver(compactAlignmentGallery).observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  var releaseUrl = new URL("jdc-footer-pilot69.js", pilotScriptUrl).href;
  var script = document.createElement("script");
  script.src = releaseUrl;
  script.async = false;
  script.crossOrigin = "anonymous";
  script.setAttribute("data-jdc-pilot70-release", "alignment-compact-grid");
  script.addEventListener("load", compactAlignmentGallery);
  (document.head || root).appendChild(script);
})();
