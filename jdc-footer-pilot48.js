(function () {
  "use strict";

  if (window.__JDC_PILOT48__) return;
  window.__JDC_PILOT48__ = true;

  var RELEASE = "pilot48";
  var HOME_PATH = "/";
  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : window.location.href;
  var CORE_URL = new URL("jdc-footer-pilot43.js", SCRIPT_URL).href;
  var TOP_PATHS = [
    "/nike-aja-sabrina",
    "/bombas-spring",
    "/polymarket-documentary",
    "/siberia-hills",
    "/alignment-documentary"
  ];
  var DIG_PATH = "/dig-brand-identity";
  var CASE_STUDIES_PATH = "/tech";
  var observer = null;
  var scheduled = false;
  var applying = false;

  function normalizePath(path) {
    return String(path || "/").replace(/\/+$/, "") || "/";
  }

  function pathForLink(link) {
    if (!link) return "";
    try {
      return normalizePath(new URL(link.href, window.location.origin).pathname);
    } catch (error) {
      return normalizePath(link.getAttribute("href"));
    }
  }

  function sectionForPath(path) {
    var target = normalizePath(path);
    return Array.prototype.slice.call(document.querySelectorAll("main .page-section")).find(function (section) {
      return Array.prototype.slice.call(section.querySelectorAll("a[href]")).some(function (link) {
        return pathForLink(link) === target;
      });
    }) || null;
  }

  function sectionPath(section) {
    var link = section && section.querySelector("a[href]");
    return link ? pathForLink(link) : "";
  }

  function markOrder(verified, count) {
    document.documentElement.setAttribute("data-jdc-home-order", verified ? RELEASE : RELEASE + "-incomplete");
    document.documentElement.setAttribute("data-jdc-home-order-count", String(count));
    document.documentElement.setAttribute("data-jdc-home-order-top", TOP_PATHS.join(","));
  }

  function preserveScrollDuring(callback) {
    var root = document.documentElement;
    var body = document.body;
    var scrollTop = window.scrollY;
    var rootAnchor = root.style.getPropertyValue("overflow-anchor");
    var rootPriority = root.style.getPropertyPriority("overflow-anchor");
    var bodyAnchor = body && body.style.getPropertyValue("overflow-anchor");
    var bodyPriority = body && body.style.getPropertyPriority("overflow-anchor");
    root.style.setProperty("overflow-anchor", "none", "important");
    if (body) body.style.setProperty("overflow-anchor", "none", "important");

    callback();

    function holdPosition() {
      window.scrollTo(0, scrollTop);
    }

    holdPosition();
    window.requestAnimationFrame(function () {
      holdPosition();
      window.requestAnimationFrame(holdPosition);
    });
    window.setTimeout(function () {
      holdPosition();
      if (rootAnchor) root.style.setProperty("overflow-anchor", rootAnchor, rootPriority);
      else root.style.removeProperty("overflow-anchor");
      if (body) {
        if (bodyAnchor) body.style.setProperty("overflow-anchor", bodyAnchor, bodyPriority);
        else body.style.removeProperty("overflow-anchor");
      }
    }, 160);
  }

  function applyHomepageOrder() {
    scheduled = false;
    if (applying || normalizePath(window.location.pathname) !== HOME_PATH) return false;

    var topSections = TOP_PATHS.map(sectionForPath);
    var dig = sectionForPath(DIG_PATH);
    var caseStudies = sectionForPath(CASE_STUDIES_PATH);
    if (topSections.some(function (section) { return !section; }) || !dig || !caseStudies) return false;

    var parent = topSections[0].parentElement;
    var allSections = Array.prototype.slice.call(parent.children).filter(function (element) {
      return element.matches && element.matches(".page-section");
    });
    var sameParent = topSections.concat([dig, caseStudies]).every(function (section) {
      return section.parentElement === parent;
    });
    if (!parent || !sameParent || !allSections.length) return false;

    var currentPaths = allSections.map(sectionPath);
    var alreadyVerified = TOP_PATHS.every(function (path, index) {
      return currentPaths[index] === path;
    }) && currentPaths.indexOf(DIG_PATH) + 1 === currentPaths.indexOf(CASE_STUDIES_PATH);
    if (alreadyVerified) {
      markOrder(true, allSections.length);
      return true;
    }

    var topSet = new Set(topSections);
    var firstRemainder = allSections.find(function (section) { return !topSet.has(section); });
    if (!firstRemainder) return false;

    applying = true;
    preserveScrollDuring(function () {
      topSections.forEach(function (section) {
        parent.insertBefore(section, firstRemainder);
      });
      parent.insertBefore(dig, caseStudies);
    });

    var finalSections = Array.prototype.slice.call(parent.children).filter(function (element) {
      return element.matches && element.matches(".page-section");
    });
    var finalPaths = finalSections.map(sectionPath);
    var verified = TOP_PATHS.every(function (path, index) {
      return finalPaths[index] === path;
    }) && finalPaths.indexOf(DIG_PATH) + 1 === finalPaths.indexOf(CASE_STUDIES_PATH);

    markOrder(verified, finalSections.length);
    applying = false;
    return verified;
  }

  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(applyHomepageOrder);
  }

  function observeHomepage() {
    if (observer || !window.MutationObserver || normalizePath(window.location.pathname) !== HOME_PATH) return;
    observer = new MutationObserver(scheduleApply);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.__JDC_HOMEPAGE_ORDER_OBSERVER48__ = observer;
  }

  function loadCore() {
    if (document.querySelector('script[data-jdc-pilot48-core="pilot43"]')) return;
    var core = document.createElement("script");
    core.src = CORE_URL;
    core.async = false;
    core.crossOrigin = "anonymous";
    core.setAttribute("data-jdc-pilot48-core", "pilot43");
    (document.head || document.documentElement).appendChild(core);
  }

  observeHomepage();
  loadCore();
  document.addEventListener("DOMContentLoaded", scheduleApply, { once: true });
  window.addEventListener("pageshow", scheduleApply, { passive: true });
  [0, 100, 300, 800, 1800, 3500, 6500].forEach(function (delay) {
    window.setTimeout(scheduleApply, delay);
  });
})();
