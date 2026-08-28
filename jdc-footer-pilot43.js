(function () {
  "use strict";

  if (window.__JDC_PILOT43__) return;
  window.__JDC_PILOT43__ = true;

  var RELEASE = "pilot43";
  var DAY_ONE_PATH = "/day-one";
  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : window.location.href;
  var CORE_URL = new URL("jdc-footer-pilot42.js", SCRIPT_URL).href;
  var applying = false;
  var engineObserver = null;
  var galleryObserver = null;
  var discoveryObserver = null;
  var stableWidth = 0;
  var stableTopShift = null;
  var stableGalleryMargin = null;
  var stableSectionHeight = null;
  var legacySpacingQuiesced = false;

  function installStyles() {
    if (document.getElementById("jdc-day-one-scroll-lock43")) return;
    var style = document.createElement("style");
    style.id = "jdc-day-one-scroll-lock43";
    style.textContent = [
      "html[data-jdc-day-one-scroll-lock]{",
      "scroll-snap-type:none!important",
      "}",
      "html[data-jdc-day-one-scroll-lock] body .page-section{",
      "scroll-snap-align:none!important;",
      "scroll-snap-stop:normal!important",
      "}",
      "body.jdc-day-one-scroll-lock43 .jdc-project-spacing-engine{",
      "transform:translateY(var(--jdc-day-one-stable-top-shift,0px))!important",
      "}",
      "body.jdc-day-one-scroll-lock43 .jdc-day-one-project-section43{",
      "box-sizing:border-box!important;",
      "height:var(--jdc-day-one-stable-section-height)!important;",
      "min-height:var(--jdc-day-one-stable-section-height)!important",
      "}",
      "body.jdc-day-one-scroll-lock43 .jdc-day-one-project-section43>.content-wrapper{",
      "justify-content:flex-start!important",
      "}",
      "body.jdc-day-one-scroll-lock43 .jdc-clip-gallery-section[data-jdc-gallery-slug='day-one'] .jdc-clip-gallery-flow{",
      "padding-top:var(--jdc-day-one-gallery-top-gap)!important",
      "}"
    ].join("");
    (document.head || document.documentElement).appendChild(style);
  }

  function normalizePath(path) {
    return String(path || "/").replace(/\/+$/, "") || "/";
  }

  function pixel(value) {
    return Number.parseFloat(value) || 0;
  }

  function targetGap() {
    if (window.innerWidth < 768) return 24;
    return Math.min(52, Math.max(32, window.innerWidth * 0.03));
  }

  function visible(element) {
    if (!element) return false;
    var rect = element.getBoundingClientRect();
    var style = window.getComputedStyle(element);
    return rect.width > 4 && rect.height > 4 && style.display !== "none" &&
      style.visibility !== "hidden" && pixel(style.opacity || "1") > 0;
  }

  function headerTextDocumentBottom() {
    var header = document.querySelector("header#header");
    if (!header) return 0;
    var headerRect = header.getBoundingClientRect();
    var scrollTop = window.scrollY;
    var bottoms = Array.prototype.slice.call(header.querySelectorAll("a, .header-title, .header-nav-item")).filter(function (element) {
      var text = element.textContent.trim().toLowerCase();
      var rect = element.getBoundingClientRect();
      return text && text !== "skip to content" && rect.width > 0 && rect.height > 0 &&
        rect.left >= -1 && rect.right <= window.innerWidth + 1 &&
        rect.top >= headerRect.top - 1 && rect.bottom <= headerRect.bottom + 1;
    }).map(function (element) {
      return element.getBoundingClientRect().bottom + scrollTop;
    });
    return bottoms.length ? Math.max.apply(Math, bottoms) : headerRect.bottom + scrollTop;
  }

  function projectContentBottom(section) {
    var selector = [
      "h1", "h2", "h3", "p", ".native-video-player", ".jdc-video-stage",
      ".jdc-project-following-block img", ".jdc-project-following-block video"
    ].join(",");
    var bottoms = Array.prototype.slice.call(section.querySelectorAll(selector)).filter(visible).map(function (element) {
      return element.getBoundingClientRect().bottom + window.scrollY;
    });
    return bottoms.length ? Math.max.apply(Math, bottoms) : 0;
  }

  function quiesceLegacySpacing() {
    if (legacySpacingQuiesced) return;
    [window.__JDC_PROJECT_SPACING_OBSERVER__, window.__JDC_PROJECT_SPACING_MUTATION_OBSERVER__].forEach(function (observer) {
      try { if (observer && observer.disconnect) observer.disconnect(); } catch (error) {}
    });
    if (window.__JDC_PROJECT_SPACING_SETTLE_TIMER__) {
      window.clearInterval(window.__JDC_PROJECT_SPACING_SETTLE_TIMER__);
    }
    legacySpacingQuiesced = true;
    document.documentElement.setAttribute("data-jdc-day-one-legacy-spacing", "quiesced");
  }

  function stabilize(forceRebase) {
    if (applying || normalizePath(window.location.pathname) !== DAY_ONE_PATH) return false;
    var engine = document.querySelector("main .jdc-project-spacing-engine");
    var lead = document.querySelector("main .jdc-project-lead-block .native-video-player, main .jdc-project-lead-block .jdc-video-stage, main .jdc-project-lead-block .sqs-block-video");
    var projectSection = engine && engine.closest(".page-section, section");
    var infoBand = projectSection && projectSection.querySelector(".jdc-project-info-band");
    var gallery = document.querySelector(".jdc-clip-gallery-section[data-jdc-gallery-slug='day-one']");
    var firstClip = gallery && gallery.querySelector(".jdc-clip-gallery-item");
    if (!engine || !lead || !projectSection || !infoBand || !gallery || !firstClip) return false;
    var leadBottom = lead.getBoundingClientRect().bottom + window.scrollY;
    var readyContentBottom = projectContentBottom(projectSection);
    if (!document.body.getAttribute("data-jdc-project-spacing") ||
        !document.body.getAttribute("data-jdc-project-end-shift") ||
        readyContentBottom < leadBottom + 500) return false;

    applying = true;
    installStyles();
    document.body.classList.add("jdc-day-one-scroll-lock43");
    projectSection.classList.add("jdc-day-one-project-section43");
    var gap = targetGap();
    var shouldRebase = forceRebase === true || stableTopShift == null || stableGalleryMargin == null || stableSectionHeight == null || stableWidth !== window.innerWidth;
    if (shouldRebase) {
      var engineStyle = window.getComputedStyle(engine);
      var currentShift = pixel(engineStyle.getPropertyValue("--jdc-day-one-stable-top-shift"));
      var leadTop = lead.getBoundingClientRect().top + window.scrollY;
      var desiredLeadTop = headerTextDocumentBottom() + gap;
      stableTopShift = currentShift + desiredLeadTop - leadTop;
      engine.style.setProperty("--jdc-day-one-stable-top-shift", Math.round(stableTopShift * 100) / 100 + "px", "important");

      var contentBottom = readyContentBottom;
      var projectTop = projectSection.getBoundingClientRect().top + window.scrollY;
      stableSectionHeight = contentBottom - projectTop;
      stableGalleryMargin = 0;
      stableWidth = window.innerWidth;
    }

    var shiftValue = Math.round(stableTopShift * 100) / 100 + "px";
    if (engine.style.getPropertyValue("--jdc-day-one-stable-top-shift") !== shiftValue ||
        engine.style.getPropertyPriority("--jdc-day-one-stable-top-shift") !== "important") {
      engine.style.setProperty("--jdc-day-one-stable-top-shift", shiftValue, "important");
    }
    var marginValue = Math.round(stableGalleryMargin * 100) / 100 + "px";
    if (gallery.style.getPropertyValue("margin-top") !== marginValue || gallery.style.getPropertyPriority("margin-top") !== "important") {
      gallery.style.setProperty("margin-top", marginValue, "important");
    }
    var galleryGapValue = Math.round(gap * 100) / 100 + "px";
    if (gallery.style.getPropertyValue("--jdc-day-one-gallery-top-gap") !== galleryGapValue ||
        gallery.style.getPropertyPriority("--jdc-day-one-gallery-top-gap") !== "important") {
      gallery.style.setProperty("--jdc-day-one-gallery-top-gap", galleryGapValue, "important");
    }
    var sectionHeightValue = Math.round(stableSectionHeight * 100) / 100 + "px";
    if (projectSection.style.getPropertyValue("--jdc-day-one-stable-section-height") !== sectionHeightValue ||
        projectSection.style.getPropertyPriority("--jdc-day-one-stable-section-height") !== "important") {
      projectSection.style.setProperty("--jdc-day-one-stable-section-height", sectionHeightValue, "important");
    }
    if (shouldRebase) {
      for (var iteration = 0; iteration < 10; iteration += 1) {
        var actualContentBottom = projectContentBottom(projectSection);
        var sectionError = actualContentBottom - (projectSection.getBoundingClientRect().top + window.scrollY) - stableSectionHeight;
        if (Math.abs(sectionError) <= 0.2) break;
        stableSectionHeight += sectionError;
        sectionHeightValue = Math.round(stableSectionHeight * 100) / 100 + "px";
        projectSection.style.setProperty("--jdc-day-one-stable-section-height", sectionHeightValue, "important");
      }
    }

    document.documentElement.setAttribute("data-jdc-day-one-scroll-lock", RELEASE);
    document.documentElement.setAttribute("data-jdc-day-one-scroll-shift", String(Math.round(stableTopShift * 10) / 10));
    document.documentElement.setAttribute("data-jdc-day-one-gallery-margin", String(Math.round(stableGalleryMargin * 10) / 10));
    document.documentElement.setAttribute("data-jdc-day-one-section-height", String(Math.round(stableSectionHeight * 10) / 10));
    if (document.body) document.body.setAttribute("data-jdc-footer-release", RELEASE);
    applying = false;
    observeTargets(engine, gallery);
    quiesceLegacySpacing();
    return true;
  }

  function observeTargets(engine, gallery) {
    if (!engineObserver && window.MutationObserver) {
      engineObserver = new MutationObserver(stabilize);
      engineObserver.observe(engine, { attributes: true, attributeFilter: ["style"] });
      window.__JDC_DAY_ONE_ENGINE_OBSERVER43__ = engineObserver;
    }
    if (!galleryObserver && window.MutationObserver) {
      galleryObserver = new MutationObserver(stabilize);
      galleryObserver.observe(gallery, { attributes: true, attributeFilter: ["style", "class"] });
      window.__JDC_DAY_ONE_GALLERY_OBSERVER43__ = galleryObserver;
    }
  }

  function loadCore() {
    if (document.querySelector('script[data-jdc-pilot43-core="pilot42"]')) return;
    var core = document.createElement("script");
    core.src = CORE_URL;
    core.async = false;
    core.crossOrigin = "anonymous";
    core.setAttribute("data-jdc-pilot43-core", "pilot42");
    (document.head || document.documentElement).appendChild(core);
  }

  if (normalizePath(window.location.pathname) === DAY_ONE_PATH && window.MutationObserver) {
    discoveryObserver = new MutationObserver(stabilize);
    discoveryObserver.observe(document.documentElement, { childList: true, subtree: true });
    window.__JDC_DAY_ONE_DISCOVERY_OBSERVER43__ = discoveryObserver;
  }
  window.addEventListener("resize", function () { stabilize(true); }, { passive: true });
  window.addEventListener("pageshow", stabilize, { passive: true });
  loadCore();
  [0, 120, 400, 1000, 2500, 5000, 7500, 12000, 16000].forEach(function (delay) {
    window.setTimeout(stabilize, delay);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(stabilize);
})();
