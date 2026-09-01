(function () {
  "use strict";

  var POLYMARKET_PATH = /^\/polymarket-make-your-own-market\/?$/;
  if (!POLYMARKET_PATH.test(window.location.pathname)) return;

  function installStyles() {
    if (document.getElementById("jdc-polymarket-flow-fix75")) return;
    var style = document.createElement("style");
    style.id = "jdc-polymarket-flow-fix75";
    style.textContent = [
      ".jdc-polymarket-gallery-section>.content-wrapper{display:block!important;width:100%!important;height:auto!important;min-height:0!important}",
      ".jdc-polymarket-gallery-section .fluid-engine{display:block!important;width:100%!important;max-width:none!important;height:auto!important;min-height:0!important}",
      ".jdc-polymarket-gallery-section .fluid-engine>.fe-block{position:relative!important;inset:auto!important;width:100%!important;height:auto!important;min-height:0!important;transform:none!important}",
      ".jdc-polymarket-gallery-section .fluid-engine>.fe-block:not(.jdc-polymarket-lead75){display:none!important}",
      ".jdc-polymarket-gallery-section .jdc-polymarket-lead75 [data-jdc-video]{display:block!important;width:100%!important;max-width:none!important;height:auto!important;min-height:0!important;aspect-ratio:16/9!important}",
      ".jdc-polymarket-gallery-section>.content-wrapper>.jdc-polymarket-gallery-grid{height:auto!important;min-height:0!important;margin-top:clamp(24px,3vw,48px)!important;translate:none!important}",
      "@media(max-width:767px){.jdc-polymarket-gallery-section>.content-wrapper{padding-left:0!important;padding-right:0!important}}"
    ].join("");
    document.head.appendChild(style);
  }

  function repairFlow() {
    var section = document.querySelector(".jdc-polymarket-gallery-section");
    if (!section) return false;
    var engine = section.querySelector(".fluid-engine");
    if (!engine) return false;
    var leadVideo = engine.querySelector("[data-jdc-video]");
    var leadBlock = leadVideo && (leadVideo.closest(".fe-block") || leadVideo.parentElement);
    if (!leadBlock) return false;
    Array.prototype.forEach.call(engine.children, function (child) {
      child.classList.toggle("jdc-polymarket-lead75", child === leadBlock);
    });
    section.setAttribute("data-jdc-polymarket-flow", "pilot75");
    document.documentElement.setAttribute("data-jdc-polymarket-flow-fix", "pilot75");
    return true;
  }

  installStyles();
  [0, 120, 400, 1000, 2500, 5000].forEach(function (delay) {
    window.setTimeout(repairFlow, delay);
  });
  var observer = new MutationObserver(function () { repairFlow(); });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();

(function () {
  "use strict";

  var CREDIT_PATHS = {
    "/black-twitter": true,
    "/kings-of-tupelo": true,
    "/shaq-hbo": true,
    "/celeste-everyday": true
  };
  var OLD_ROLES = {
    "Art & Graphics Director": true,
    "Art & Graphics Director / EP": true,
    "Art Director": true,
    "Animation Director": true,
    "Graphics Director": true
  };
  var NEW_ROLE = "Art & Animation Director";
  var PERSON = "Jos Diaz Contreras";

  function normalizePath(pathname) {
    var clean = pathname.replace(/\/+$/, "");
    return clean || "/";
  }

  function normalizeCredits() {
    if (!CREDIT_PATHS[normalizePath(window.location.pathname)]) return false;
    var list = document.querySelector('[aria-label="Project credits"] [data-jdc-canonical-credits53], [aria-label="Project credits"] [class*="credit-list"]');
    if (!list) return false;

    var matches = [];
    Array.prototype.forEach.call(list.children, function (item) {
      var name = item.querySelector('[class*="credit-name"]');
      var role = item.querySelector('[class*="credit-role"]');
      if (!name || !role || name.textContent.trim() !== PERSON) return;
      var roleText = role.textContent.trim();
      if (roleText === NEW_ROLE || OLD_ROLES[roleText]) matches.push({ item: item, role: role });
    });
    if (!matches.length) return false;
    if (
      matches.length === 1 &&
      matches[0].role.textContent.trim() === NEW_ROLE &&
      matches[0].item.getAttribute("data-jdc-credit-normalized76") === "true"
    ) return true;

    matches[0].role.textContent = NEW_ROLE;
    matches[0].item.setAttribute("data-jdc-credit-normalized76", "true");
    matches.slice(1).forEach(function (match) { match.item.remove(); });
    document.documentElement.setAttribute("data-jdc-credit-normalization", "pilot76");
    return true;
  }

  [0, 120, 400, 1000, 2500, 5000].forEach(function (delay) {
    window.setTimeout(normalizeCredits, delay);
  });
  var observer = new MutationObserver(function () { normalizeCredits(); });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("popstate", normalizeCredits);
})();
