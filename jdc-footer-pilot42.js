(function () {
  "use strict";

  if (window.__JDC_PILOT42__) return;
  window.__JDC_PILOT42__ = true;

  var RELEASE = "pilot42";
  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : window.location.href;
  var CORE_URL = new URL("jdc-footer-pilot41.js", SCRIPT_URL).href;
  var scheduled = false;
  var sectionObserver = null;

  function ensureStyle() {
    if (document.getElementById("jdc-pilot42-style")) return;
    var style = document.createElement("style");
    style.id = "jdc-pilot42-style";
    style.textContent = [
      ".jdc-section-gap-transparent42 > .section-border,",
      ".jdc-section-gap-transparent42 > .section-background {",
      "  background-color: transparent !important;",
      "}",
      ".jdc-section-gap-transparent42 {",
      "  position: relative !important;",
      "  z-index: 1 !important;",
      "}",
      ".jdc-section-gap-anchor42 > .content-wrapper {",
      "  position: relative !important;",
      "  z-index: 3 !important;",
      "}"
    ].join("\n");
    (document.head || document.documentElement).appendChild(style);
  }

  function pixel(value) {
    return Number.parseFloat(value) || 0;
  }

  function visible(element) {
    if (!element) return false;
    var rect = element.getBoundingClientRect();
    var style = window.getComputedStyle(element);
    return rect.width > 4 && rect.height > 4 && style.display !== "none" &&
      style.visibility !== "hidden" && pixel(style.opacity || "1") > 0;
  }

  function configuredAspect(shell) {
    try {
      var config = JSON.parse(shell.getAttribute("data-jdc-video") || shell.getAttribute("data-config-video") || "{}");
      return Number(config.aspectRatio) || 0;
    } catch (error) {
      return 0;
    }
  }

  function applyDecodedAspect(shell) {
    if (!shell || !shell.classList.contains("jdc-video-block")) return false;
    var video = shell.querySelector("video");
    if (!video || !video.videoWidth || !video.videoHeight) return false;
    var decoded = video.videoWidth / video.videoHeight;
    var configured = configuredAspect(shell);
    if (!configured || !Number.isFinite(decoded) || decoded <= 0) return false;
    var mismatch = Math.abs(decoded / configured - 1);
    if (mismatch < 0.04) return false;

    var value = String(Math.round(decoded * 100000000) / 100000000);
    var stage = shell.querySelector(".native-video-player, .jdc-video-stage");
    var embed = shell.parentElement;
    var block = shell.closest(".sqs-block-video");
    shell.style.setProperty("--jdc-video-aspect", value);
    [
      ["width", "100%"], ["height", "auto"], ["min-height", "0"],
      ["aspect-ratio", value], ["background-size", "contain"]
    ].forEach(function (pair) { shell.style.setProperty(pair[0], pair[1], "important"); });
    if (stage) {
      [
        ["position", "absolute"], ["inset", "0"], ["width", "100%"],
        ["height", "100%"], ["min-height", "0"], ["padding", "0"],
        ["padding-bottom", "0"], ["aspect-ratio", value]
      ].forEach(function (pair) { stage.style.setProperty(pair[0], pair[1], "important"); });
    }
    [
      ["position", "absolute"], ["inset", "0"], ["width", "100%"],
      ["height", "100%"], ["object-fit", "contain"]
    ].forEach(function (pair) { video.style.setProperty(pair[0], pair[1], "important"); });
    [embed, block].forEach(function (element) {
      if (!element) return;
      element.style.setProperty("height", "auto", "important");
      element.style.setProperty("min-height", "0", "important");
    });
    shell.setAttribute("data-jdc-aspect-source", "decoded-metadata");
    shell.setAttribute("data-jdc-configured-aspect", String(Math.round(configured * 100000) / 100000));
    shell.setAttribute("data-jdc-decoded-aspect", value);
    if (document.body) {
      document.body.setAttribute("data-jdc-aspect-corrections", String(document.querySelectorAll('[data-jdc-aspect-source="decoded-metadata"]').length));
    }
    return true;
  }

  function correctDecodedAspects() {
    var changed = false;
    Array.prototype.slice.call(document.querySelectorAll(".jdc-video-block")).forEach(function (shell) {
      if (applyDecodedAspect(shell)) changed = true;
    });
    return changed;
  }

  function contentBounds(section) {
    var selector = [
      "h1", "h2", "h3", "p", "img", "video", ".native-video-player", ".jdc-video-stage",
      ".jdc-clip-gallery-item", ".jdc-alignment-slide", ".jdc-bts-frame40",
      ".jdc-lovb-gallery-item", ".jdc-laufey-gallery-item", ".jdc-polymarket-gallery-item",
      ".jdc-limn-gallery-item", ".jdc-basis-project-item", ".jdc-dig-gallery-item"
    ].join(",");
    var elements = Array.prototype.slice.call(section.querySelectorAll(selector)).filter(visible);
    if (!elements.length) return null;
    var tops = elements.map(function (element) { return element.getBoundingClientRect().top; });
    var bottoms = elements.map(function (element) { return element.getBoundingClientRect().bottom; });
    return { top: Math.min.apply(Math, tops), bottom: Math.max.apply(Math, bottoms) };
  }

  function targetGap() {
    if (window.innerWidth < 768) return 24;
    return Math.min(52, Math.max(32, window.innerWidth * 0.03));
  }

  function paintedBackground(section) {
    var candidates = [
      section.querySelector(":scope > .section-border"),
      section.querySelector(":scope > .section-background"),
      section,
      document.body
    ].filter(Boolean);
    for (var index = 0; index < candidates.length; index += 1) {
      var color = window.getComputedStyle(candidates[index]).backgroundColor;
      if (color && color !== "transparent" && color !== "rgba(0, 0, 0, 0)") return color;
    }
    return "rgba(0, 0, 0, 0)";
  }

  function normalizeSectionGaps() {
    if (!document.body || !document.body.classList.contains("jdc-project-spacing")) return false;
    // Bombas has its own playlist/gallery compositor in pilot27. Running the
    // generic section-gap pass over that moving layout can temporarily place
    // the gallery over the lead film while the playlist swaps media.
    if (/^\/bombas-spring\/?$/.test(window.location.pathname) ||
        ["3", "4"].indexOf(document.body.getAttribute("data-jdc-credits-option")) !== -1) return false;
    Array.prototype.slice.call(document.querySelectorAll(".jdc-section-gap-anchor42")).forEach(function (section) {
      section.classList.remove("jdc-section-gap-anchor42");
    });
    var sections = Array.prototype.slice.call(document.querySelectorAll("main .page-section")).filter(visible);
    sections.forEach(function (section) {
      if (section.getAttribute("data-jdc-section-gap") === RELEASE) {
        section.style.removeProperty("margin-top");
        section.classList.remove("jdc-section-gap-transparent42");
        section.removeAttribute("data-jdc-section-gap");
        section.removeAttribute("data-jdc-section-gap-before");
        section.removeAttribute("data-jdc-section-gap-shift");
      }
    });
    if (sections.length < 2) return false;

    var desired = targetGap();
    var changes = [];
    for (var index = 1; index < sections.length; index += 1) {
      var previous = contentBounds(sections[index - 1]);
      var current = contentBounds(sections[index]);
      if (!previous || !current) continue;
      var gap = current.top - previous.bottom;
      if (gap <= desired + 8) continue;
      var baseMargin = pixel(window.getComputedStyle(sections[index]).marginTop);
      // Mobile Fluid Engine sections can retain an entire desktop-height canvas
      // after their visible blocks have reflowed.  Collapse only the measured
      // empty space, with a larger mobile ceiling that still guards against a
      // malformed section producing an unbounded negative margin.
      var maximumCollapse = window.innerWidth < 768 ? 2000 : 420;
      var shift = Math.max(-maximumCollapse, desired - gap);
      var previousSection = sections[index - 1];
      var currentTop = sections[index].getBoundingClientRect().top;
      var backgroundsMatch = paintedBackground(previousSection) === paintedBackground(sections[index]);
      if (currentTop + shift < previous.bottom) {
        if (backgroundsMatch) {
          sections[index].classList.add("jdc-section-gap-transparent42");
          previousSection.classList.add("jdc-section-gap-anchor42");
        } else {
          // Preserve differently colored section boundaries rather than letting
          // a later canvas paint over earlier content.
          shift = Math.max(shift, previous.bottom - currentTop);
        }
      }
      sections[index].style.setProperty("margin-top", (baseMargin + shift) + "px", "important");
      sections[index].setAttribute("data-jdc-section-gap", RELEASE);
      sections[index].setAttribute("data-jdc-section-gap-before", String(Math.round(gap * 10) / 10));
      sections[index].setAttribute("data-jdc-section-gap-shift", String(Math.round(shift * 10) / 10));
      changes.push(Math.round(shift * 10) / 10);
    }
    document.body.setAttribute("data-jdc-section-spacing", RELEASE);
    document.body.setAttribute("data-jdc-section-gap-target", String(Math.round(desired * 10) / 10));
    document.body.setAttribute("data-jdc-section-gap-shifts", changes.join(","));
    return changes.length > 0;
  }

  function install() {
    scheduled = false;
    ensureStyle();
    var aspectChanged = correctDecodedAspects();
    if (aspectChanged) window.requestAnimationFrame(normalizeSectionGaps);
    normalizeSectionGaps();
    if (document.body) document.body.setAttribute("data-jdc-footer-release", RELEASE);
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(install);
  }

  function observe() {
    if (!document.body || sectionObserver || !window.ResizeObserver) return;
    sectionObserver = new ResizeObserver(schedule);
    Array.prototype.slice.call(document.querySelectorAll("main .page-section")).forEach(function (section) {
      sectionObserver.observe(section);
    });
    window.__JDC_SECTION_SPACING_OBSERVER42__ = sectionObserver;
  }

  function loadCore() {
    if (document.querySelector('script[data-jdc-pilot42-core="pilot41"]')) return;
    var core = document.createElement("script");
    core.src = CORE_URL;
    core.async = false;
    core.crossOrigin = "anonymous";
    core.setAttribute("data-jdc-pilot42-core", "pilot41");
    (document.head || document.documentElement).appendChild(core);
  }

  document.addEventListener("loadedmetadata", schedule, true);
  document.addEventListener("resize", schedule, true);
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("pageshow", schedule, { passive: true });
  var mutationObserver = new MutationObserver(function () {
    observe();
    schedule();
  });
  mutationObserver.observe(document.documentElement, { childList: true, subtree: true });
  window.__JDC_PILOT42_MUTATION_OBSERVER__ = mutationObserver;
  loadCore();
  [0, 120, 400, 1000, 2500, 5000, 7500].forEach(function (delay) {
    window.setTimeout(function () {
      observe();
      install();
    }, delay);
  });
})();
