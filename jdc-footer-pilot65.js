(function () {
  "use strict";

  if (window.__JDC_PILOT65__) return;
  window.__JDC_PILOT65__ = true;

  var scriptUrl = document.currentScript && document.currentScript.src
    ? document.currentScript.src
    : window.location.href;
  var releaseUrl = new URL("jdc-footer-pilot64.js", scriptUrl).href;
  var yannHlsUrl = new URL(
    "media/alignment/yann-lecun-3x2/master.m3u8",
    scriptUrl
  ).href;
  var yannPosterUrl = new URL(
    "media/alignment/yann-lecun-3x2/poster.jpg",
    scriptUrl
  ).href;
  var yannSystemDataId = "477191e0-7531-4b97-862c-56c1b0f8710a";
  var configAttributes = ["data-config-video", "data-jdc-video"];

  function reviseConfig(element, attribute) {
    if (!element || !element.hasAttribute || !element.hasAttribute(attribute)) return;
    var raw = element.getAttribute(attribute) || "{}";
    var config;
    try {
      config = JSON.parse(raw);
    } catch (error) {
      return;
    }
    if (String(config.systemDataId || "") !== yannSystemDataId) return;

    var revised = config.alexandriaUrl !== yannHlsUrl || Number(config.aspectRatio) !== 1.5;
    if (revised) {
      config.alexandriaUrl = yannHlsUrl;
      config.aspectRatio = 1.5;
      config.systemDataVariants = "1620:1080";
      element.setAttribute(attribute, JSON.stringify(config));
    }
    element.setAttribute("data-jdc-yann-revised", "3x2-audio-matched");
    element.setAttribute("data-jdc-poster", yannPosterUrl);
  }

  function revise(root) {
    if (!root || root.nodeType !== 1) return;
    configAttributes.forEach(function (attribute) {
      reviseConfig(root, attribute);
      if (!root.querySelectorAll) return;
      root.querySelectorAll("[" + attribute + "]").forEach(function (element) {
        reviseConfig(element, attribute);
      });
    });
  }

  var observer = new MutationObserver(function (records) {
    records.forEach(function (record) {
      if (record.type === "attributes") revise(record.target);
      record.addedNodes.forEach(revise);
    });
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: configAttributes
  });
  revise(document.documentElement);

  var style = document.createElement("style");
  style.id = "jdc-yann-lecun-reframe65";
  style.textContent = [
    "[data-jdc-yann-revised='3x2-audio-matched']{aspect-ratio:3/2!important;background-size:cover!important}",
    "[data-jdc-yann-revised='3x2-audio-matched'] .jdc-video-stage,[data-jdc-yann-revised='3x2-audio-matched'] video{aspect-ratio:3/2!important}"
  ].join("");
  (document.head || document.documentElement).appendChild(style);

  var script = document.createElement("script");
  script.src = releaseUrl;
  script.async = false;
  script.crossOrigin = "anonymous";
  script.setAttribute("data-jdc-pilot65-release", "yann-lecun-3x2-audio-match");
  (document.head || document.documentElement).appendChild(script);
})();
