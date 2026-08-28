(function () {
  "use strict";

  if (window.__JDC_PILOT53__) return;
  window.__JDC_PILOT53__ = true;

  var RELEASE = "pilot53";
  var PARAM = "jdc-credits";
  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : window.location.href;
  var CORE_URL = new URL("jdc-footer-pilot51.js", SCRIPT_URL).href;
  var DATA_URL = new URL("jdc-press-recognition-pilot53.js", SCRIPT_URL).href;
  var CREDIT_DATA_URL = new URL("jdc-credit-data-pilot54.js", SCRIPT_URL).href;
  var requested = new URLSearchParams(window.location.search).get(PARAM);
  var previewActive = ["0", "1", "2", "3", "4"].indexOf(requested) !== -1;
  var option = requested === "1" || requested === "2" ? "3" : requested;
  var CREDIT_STYLE_PARAM = "jdc-credit-style";
  var requestedCreditStyle = new URLSearchParams(window.location.search).get(CREDIT_STYLE_PARAM);
  var creditStyle = ["0", "1", "2", "3"].indexOf(requestedCreditStyle) !== -1 ? requestedCreditStyle : "0";
  var CREDIT_FLOW_PARAM = "jdc-credit-flow";
  var creditFlow = new URLSearchParams(window.location.search).get(CREDIT_FLOW_PARAM);
  var creditFlowEnabled = previewActive && option === "4" && ["1", "2"].indexOf(creditFlow) !== -1 && /^\/day-one\/?$/.test(window.location.pathname);
  var creditStyleEnabled = previewActive && (option === "3" || option === "4") && ["0", "1", "2", "3"].indexOf(requestedCreditStyle) !== -1;
  var creditStylePreview = creditStyleEnabled && !creditFlowEnabled && /^\/day-one\/?$/.test(window.location.pathname);
  var observer = null;
  var scheduled = false;

  function load(url, attribute, value, complete) {
    var existing = document.querySelector("script[" + attribute + "='" + value + "']");
    if (existing) {
      if (complete) complete();
      return;
    }
    var script = document.createElement("script");
    script.src = url;
    script.async = false;
    script.crossOrigin = "anonymous";
    script.setAttribute(attribute, value);
    if (complete) script.addEventListener("load", complete, { once: true });
    (document.head || document.documentElement).appendChild(script);
  }

  function ensureStyles() {
    if (!previewActive || document.getElementById("jdc-project-blocks-styles53")) return;
    var style = document.createElement("style");
    style.id = "jdc-project-blocks-styles53";
    style.textContent = [
      "body[data-jdc-credits-option='3'] .jdc-project-body-block .jdc-credit-list51{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))!important;align-content:start!important;gap:10px 18px!important}",
      "body[data-jdc-credits-option='4'] .jdc-layout4-credits51 .jdc-credit-list51{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;align-content:start!important;gap:10px 18px!important}",
      "body[data-jdc-credits-option='3'].jdc-project-spacing .jdc-project-info-band:not(.jdc-project-info-stacked){flex-direction:column!important;align-items:stretch!important;gap:clamp(18px,2vw,28px)!important}",
      "body[data-jdc-credits-option='3'].jdc-project-spacing .jdc-project-info-band:not(.jdc-project-info-stacked)>.jdc-project-title-block,body[data-jdc-credits-option='3'].jdc-project-spacing .jdc-project-info-band:not(.jdc-project-info-stacked)>.jdc-project-body-block{flex:0 0 auto!important;width:100%!important;max-width:none!important}",
      "body[data-jdc-credits-option='3'].jdc-project-spacing .jdc-project-info-band:not(.jdc-project-info-stacked)>.jdc-project-body-block>.sqs-block-html{padding-left:0!important;padding-right:0!important}",
      "body[data-jdc-credits-option='3'] .jdc-project-body-block .jdc-credit-item51,body[data-jdc-credits-option='4'] .jdc-layout4-credits51 .jdc-credit-item51{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:1px!important;min-width:0!important}",
      "body[data-jdc-credits-option='3'] .jdc-project-body-block .jdc-credit-name51,body[data-jdc-credits-option='3'] .jdc-project-body-block .jdc-credit-role51,body[data-jdc-credits-option='4'] .jdc-layout4-credits51 .jdc-credit-name51,body[data-jdc-credits-option='4'] .jdc-layout4-credits51 .jdc-credit-role51{max-width:none!important;text-align:left!important}",
      "body[data-jdc-credits-option='3'] .jdc-project-body-block .jdc-credit-item51[data-jdc-large53='name'] .jdc-credit-name51,body[data-jdc-credits-option='3'] .jdc-project-body-block .jdc-credit-item51[data-jdc-large53='role'] .jdc-credit-role51,body[data-jdc-credits-option='4'] .jdc-layout4-credits51 .jdc-credit-item51[data-jdc-large53='name'] .jdc-credit-name51,body[data-jdc-credits-option='4'] .jdc-layout4-credits51 .jdc-credit-item51[data-jdc-large53='role'] .jdc-credit-role51{order:1!important;color:#050505!important;font-size:12px!important;font-weight:500!important;letter-spacing:-.01em!important;line-height:1.14!important;text-transform:none!important}",
      "body[data-jdc-credits-option='3'] .jdc-project-body-block .jdc-credit-item51[data-jdc-large53='name'] .jdc-credit-role51,body[data-jdc-credits-option='3'] .jdc-project-body-block .jdc-credit-item51[data-jdc-large53='role'] .jdc-credit-name51,body[data-jdc-credits-option='4'] .jdc-layout4-credits51 .jdc-credit-item51[data-jdc-large53='name'] .jdc-credit-role51,body[data-jdc-credits-option='4'] .jdc-layout4-credits51 .jdc-credit-item51[data-jdc-large53='role'] .jdc-credit-name51{order:2!important;color:rgba(0,0,0,.48)!important;font-size:8px!important;font-weight:400!important;letter-spacing:.045em!important;line-height:1.18!important;text-transform:uppercase!important}",
      "body[data-jdc-credits-option='3'] .jdc-project-body-block .jdc-credit-item51[data-jdc-single='true'],body[data-jdc-credits-option='4'] .jdc-layout4-credits51 .jdc-credit-item51[data-jdc-single='true']{grid-column:1/-1!important}",
      "body[data-jdc-credits-option='3'] .jdc-project-body-block .jdc-credit-item51[data-jdc-single='true'] .jdc-credit-name51,body[data-jdc-credits-option='4'] .jdc-layout4-credits51 .jdc-credit-item51[data-jdc-single='true'] .jdc-credit-name51{color:#050505!important;font-size:12px!important;font-weight:500!important;letter-spacing:-.01em!important;line-height:1.14!important;text-transform:none!important}",
      "body[data-jdc-credits-option='4'] .jdc-layout4-credits51{width:100%!important;max-width:none!important}",
      ".jdc-project-press53{box-sizing:border-box!important;width:100%!important;margin:0!important;padding:clamp(42px,5.5vw,82px) 4vw clamp(58px,8vw,112px)!important;background:transparent!important;color:#050505!important;font-family:inherit!important}",
      ".jdc-project-press-inner53{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr))!important;gap:clamp(30px,4vw,58px) 24px!important;width:100%!important;margin:0!important;padding:0!important}",
      ".jdc-project-press-title53{grid-column:1/-1!important;margin:0!important;padding:0!important;font-size:8px!important;font-weight:400!important;letter-spacing:.075em!important;line-height:1.2!important;text-transform:uppercase!important;color:rgba(0,0,0,.48)!important}",
      ".jdc-project-press-block53{grid-column:span 6!important;min-width:0!important;margin:0!important;padding:0!important}",
      ".jdc-project-press-block53[data-jdc-only-block='true']{grid-column:1/-1!important}",
      ".jdc-project-press-label53{margin:0 0 9px!important;padding:0!important;color:#050505!important;font-size:12px!important;font-weight:500!important;letter-spacing:-.01em!important;line-height:1.15!important}",
      ".jdc-project-press-links53{display:flex!important;flex-wrap:wrap!important;gap:5px 14px!important;margin:0!important;padding:0!important}",
      ".jdc-project-press-links53 a{display:inline!important;margin:0!important;padding:0!important;color:rgba(0,0,0,.56)!important;font-size:9px!important;font-weight:400!important;letter-spacing:.02em!important;line-height:1.3!important;text-decoration:underline!important;text-decoration-color:rgba(0,0,0,.24)!important;text-decoration-thickness:1px!important;text-underline-offset:2px!important}",
      ".jdc-project-press-links53 a:hover{color:#050505!important;text-decoration-color:#050505!important}",
      ".jdc-project-quotes53{grid-column:1/-1!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:28px 24px!important;min-width:0!important;margin:0!important;padding:0!important}",
      ".jdc-project-quote53{display:flex!important;flex-direction:column!important;gap:8px!important;min-width:0!important;margin:0!important;padding:0!important}",
      ".jdc-project-quote-copy53{margin:0!important;padding:0!important;color:#050505!important;font-size:12px!important;font-weight:400!important;letter-spacing:-.012em!important;line-height:1.34!important}",
      ".jdc-project-quote-source53{margin:0!important;padding:0!important;color:rgba(0,0,0,.48)!important;font-size:8px!important;font-weight:400!important;letter-spacing:.055em!important;line-height:1.2!important;text-transform:uppercase!important}",
      ".jdc-credit-style-nav53{position:fixed!important;z-index:2147483639!important;top:8px!important;right:8px!important;display:flex!important;align-items:center!important;gap:2px!important;margin:0!important;padding:3px!important;background:#fff!important;color:#050505!important;box-shadow:0 0 0 1px rgba(0,0,0,.14)!important;font-family:Arial,sans-serif!important;font-size:9px!important;line-height:1!important}",
      ".jdc-credit-style-nav53>span{padding:0 6px!important;color:rgba(0,0,0,.5)!important;text-transform:uppercase!important;letter-spacing:.06em!important}",
      ".jdc-credit-style-nav53>a{display:flex!important;align-items:center!important;justify-content:center!important;min-width:42px!important;height:23px!important;margin:0!important;padding:0 7px!important;color:#050505!important;text-decoration:none!important;white-space:nowrap!important}",
      ".jdc-credit-style-nav53>a[aria-current='page']{background:#050505!important;color:#fff!important}",
      ".jdc-credit-flow-nav55{position:fixed!important;z-index:2147483640!important;top:8px!important;right:8px!important;display:flex!important;align-items:center!important;gap:2px!important;margin:0!important;padding:3px!important;background:#fff!important;color:#050505!important;box-shadow:0 0 0 1px rgba(0,0,0,.14)!important;font-family:Arial,sans-serif!important;font-size:9px!important;line-height:1!important}",
      ".jdc-credit-flow-nav55>span{padding:0 6px!important;color:rgba(0,0,0,.5)!important;text-transform:uppercase!important;letter-spacing:.06em!important}",
      ".jdc-credit-flow-nav55>a{display:flex!important;align-items:center!important;justify-content:center!important;height:23px!important;margin:0!important;padding:0 8px!important;color:#050505!important;text-decoration:none!important;white-space:nowrap!important}",
      ".jdc-credit-flow-nav55>a[aria-current='page']{background:#050505!important;color:#fff!important}",
      "body[data-jdc-credit-flow55] .jdc-credits-preview-nav51{display:none!important}",
      "body[data-jdc-credit-flow55] .jdc-layout4-title51{box-sizing:border-box!important;width:100%!important;margin:0!important;padding:clamp(42px,5vw,72px) 4vw clamp(28px,3.5vw,48px)!important;text-align:center!important}",
      "body[data-jdc-credit-flow55] .jdc-layout4-title51 h1{max-width:none!important;margin:0 auto!important;text-align:center!important}",
      "body[data-jdc-credit-flow55] .jdc-layout4-credits51{box-sizing:border-box!important;display:block!important;width:100%!important;max-width:none!important;margin:0!important;padding:clamp(42px,5.5vw,82px) 4vw clamp(58px,8vw,112px)!important;background:transparent!important;color:#050505!important;font-family:inherit!important}",
      "body[data-jdc-credit-flow55] .jdc-project-credits-title55{box-sizing:border-box!important;width:100%!important;margin:0 0 clamp(24px,3vw,42px)!important;padding:0!important;color:rgba(0,0,0,.48)!important;font-size:8px!important;font-weight:400!important;letter-spacing:.075em!important;line-height:1.2!important;text-transform:uppercase!important}",
      "body[data-jdc-credit-flow55] .jdc-layout4-credits51 .jdc-credit-list51{display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;align-content:start!important;gap:8px 16px!important;width:100%!important;margin:0!important;padding:0!important}",
      "body[data-jdc-credit-flow55] .jdc-layout4-credits51 .jdc-credit-item51{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:1px!important;min-width:0!important}",
      "body[data-jdc-credits-option='4'][data-jdc-credit-flow55] .jdc-layout4-credits51 .jdc-credit-item51[data-jdc-large53] .jdc-credit-name51{order:2!important;max-width:none!important;color:#050505!important;font-size:10px!important;font-weight:500!important;letter-spacing:-.008em!important;line-height:1.12!important;text-align:left!important;text-transform:none!important}",
      "body[data-jdc-credits-option='4'][data-jdc-credit-flow55] .jdc-layout4-credits51 .jdc-credit-item51[data-jdc-large53] .jdc-credit-role51{order:1!important;max-width:none!important;color:rgba(0,0,0,.46)!important;font-size:6.5px!important;font-weight:400!important;letter-spacing:.055em!important;line-height:1.15!important;text-align:left!important;text-transform:uppercase!important}",
      "body[data-jdc-credit-flow55] .jdc-layout4-credits51 .jdc-credit-item51[data-jdc-single='true']{grid-column:1/-1!important}",
      "body[data-jdc-credit-flow55] .jdc-clip-gallery-grid>.jdc-project-press53{grid-column:1/-1!important;min-width:0!important}",
      "body[data-jdc-credits-option='3'][data-jdc-credit-style='1'] .jdc-project-body-block .jdc-credit-item51[data-jdc-large53='name'] .jdc-credit-role51,body[data-jdc-credits-option='3'][data-jdc-credit-style='1'] .jdc-project-body-block .jdc-credit-item51[data-jdc-large53='role'] .jdc-credit-name51{order:1!important}",
      "body[data-jdc-credits-option='3'][data-jdc-credit-style='1'] .jdc-project-body-block .jdc-credit-item51[data-jdc-large53='name'] .jdc-credit-name51,body[data-jdc-credits-option='3'][data-jdc-credit-style='1'] .jdc-project-body-block .jdc-credit-item51[data-jdc-large53='role'] .jdc-credit-role51{order:2!important;font-size:13px!important;line-height:1.08!important}",
      "body[data-jdc-credits-option='3'][data-jdc-credit-style='2'] .jdc-project-body-block .jdc-credit-list51{grid-template-columns:repeat(auto-fit,minmax(180px,1fr))!important;grid-auto-flow:dense!important;gap:14px 22px!important}",
      "body[data-jdc-credits-option='3'][data-jdc-credit-style='2'] .jdc-project-body-block .jdc-credit-item51[data-jdc-large53='name'] .jdc-credit-role51,body[data-jdc-credits-option='3'][data-jdc-credit-style='2'] .jdc-project-body-block .jdc-credit-item51[data-jdc-large53='role'] .jdc-credit-name51{order:1!important}",
      "body[data-jdc-credits-option='3'][data-jdc-credit-style='2'] .jdc-project-body-block .jdc-credit-item51[data-jdc-large53='name'] .jdc-credit-name51,body[data-jdc-credits-option='3'][data-jdc-credit-style='2'] .jdc-project-body-block .jdc-credit-item51[data-jdc-large53='role'] .jdc-credit-role51{order:2!important;font-size:13px!important;line-height:1.08!important}",
      "body[data-jdc-credits-option='3'][data-jdc-credit-style='2'] .jdc-project-body-block .jdc-credit-item51:first-child{grid-column:span 2!important}",
      "body[data-jdc-credits-option='3'][data-jdc-credit-style='2'] .jdc-project-body-block .jdc-credit-item51:first-child .jdc-credit-name51,body[data-jdc-credits-option='3'][data-jdc-credit-style='2'] .jdc-project-body-block .jdc-credit-item51:first-child .jdc-credit-role51{max-width:520px!important}",
      "body[data-jdc-credits-option='3'][data-jdc-credit-style='3'] .jdc-project-body-block .jdc-credit-list51{grid-template-columns:repeat(auto-fit,minmax(180px,1fr))!important;gap:9px 22px!important}",
      "body[data-jdc-credits-option='3'][data-jdc-credit-style='3'] .jdc-project-body-block .jdc-credit-item51{flex-direction:row!important;align-items:baseline!important;align-content:flex-start!important;flex-wrap:wrap!important;gap:1px 5px!important}",
      "body[data-jdc-credits-option='3'][data-jdc-credit-style='3'] .jdc-project-body-block .jdc-credit-item51[data-jdc-large53='name'] .jdc-credit-name51,body[data-jdc-credits-option='3'][data-jdc-credit-style='3'] .jdc-project-body-block .jdc-credit-item51[data-jdc-large53='role'] .jdc-credit-role51{font-size:13px!important;line-height:1.08!important}",
      "@media(max-width:1099px){body[data-jdc-credit-flow55] .jdc-layout4-credits51 .jdc-credit-list51{grid-template-columns:repeat(5,minmax(0,1fr))!important}.jdc-project-quotes53{grid-template-columns:repeat(2,minmax(0,1fr))!important}}",
      "@media(max-width:767px){body[data-jdc-credits-option='3'] .jdc-project-body-block .jdc-credit-list51,body[data-jdc-credits-option='4'] .jdc-layout4-credits51 .jdc-credit-list51,body[data-jdc-credits-option='3'][data-jdc-credit-style='2'] .jdc-project-body-block .jdc-credit-list51,body[data-jdc-credits-option='3'][data-jdc-credit-style='3'] .jdc-project-body-block .jdc-credit-list51,body[data-jdc-credit-flow55] .jdc-layout4-credits51 .jdc-credit-list51{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px 14px!important}body[data-jdc-credit-style='2'] .jdc-credit-item51:first-child{grid-column:1/-1!important}.jdc-credit-style-nav53,.jdc-credit-flow-nav55{top:6px!important;right:6px!important}.jdc-credit-style-nav53>span,.jdc-credit-flow-nav55>span{display:none!important}.jdc-credit-style-nav53>a{min-width:28px!important;padding:0 5px!important}.jdc-credit-flow-nav55>a{padding:0 6px!important}.jdc-credit-flow-nav55>a:first-of-type{font-size:0!important}.jdc-credit-flow-nav55>a:first-of-type:after{content:'Press first';font-size:9px!important}.jdc-credit-flow-nav55>a:last-of-type{font-size:0!important}.jdc-credit-flow-nav55>a:last-of-type:after{content:'Gallery split';font-size:9px!important}body[data-jdc-credit-flow55] .jdc-layout4-title51{padding:38px 6.15vw 24px!important}body[data-jdc-credit-flow55] .jdc-layout4-credits51,.jdc-project-press53{padding:44px 6.15vw 70px!important}.jdc-project-press-inner53{gap:32px 14px!important}.jdc-project-press-block53{grid-column:1/-1!important}.jdc-project-quotes53{grid-template-columns:minmax(0,1fr)!important;gap:24px!important}.jdc-project-quote-copy53{font-size:12px!important}}"
    ].join("");
    (document.head || document.documentElement).appendChild(style);
  }

  function projectData() {
    var path = String(window.location.pathname || "/").replace(/\/+$/, "") || "/";
    var source = window.JDC_PRESS_RECOGNITION || {};
    return source[path] || null;
  }

  function canonicalCreditData() {
    var path = String(window.location.pathname || "/").replace(/\/+$/, "") || "/";
    var source = window.JDC_CREDIT_DATA || {};
    return source[path] || null;
  }

  function installCreditStylePreview() {
    if (!document.body) return false;
    if (creditStyleEnabled) document.body.setAttribute("data-jdc-credit-style", creditStyle);
    if (!creditStylePreview) return creditStyleEnabled;
    var nav = document.querySelector(".jdc-credit-style-nav53");
    if (nav) return true;
    nav = document.createElement("nav");
    nav.className = "jdc-credit-style-nav53";
    nav.setAttribute("aria-label", "Bon Iver credit treatments");
    var label = document.createElement("span");
    label.textContent = "Credit treatment";
    nav.appendChild(label);
    [
      ["0", "Clean"],
      ["1", "Caption"],
      ["2", "Mosaic"],
      ["3", "Inline"]
    ].forEach(function (entry) {
      var url = new URL(window.location.href);
      url.searchParams.set(CREDIT_STYLE_PARAM, entry[0]);
      var link = document.createElement("a");
      link.href = url.href;
      link.textContent = entry[1];
      if (entry[0] === creditStyle) link.setAttribute("aria-current", "page");
      nav.appendChild(link);
    });
    document.body.appendChild(nav);
    return true;
  }

  function installCreditFlowPreview() {
    if (!creditFlowEnabled || !document.body) return false;
    document.body.setAttribute("data-jdc-credit-flow55", creditFlow);
    var nav = document.querySelector(".jdc-credit-flow-nav55");
    if (nav) return true;
    nav = document.createElement("nav");
    nav.className = "jdc-credit-flow-nav55";
    nav.setAttribute("aria-label", "Bon Iver page order treatments");
    var label = document.createElement("span");
    label.textContent = "Page order";
    nav.appendChild(label);
    [
      ["1", "Press → gallery → credits"],
      ["2", "Credits → split gallery"]
    ].forEach(function (entry) {
      var url = new URL(window.location.href);
      url.searchParams.set(PARAM, "4");
      url.searchParams.set(CREDIT_STYLE_PARAM, "2");
      url.searchParams.set(CREDIT_FLOW_PARAM, entry[0]);
      var link = document.createElement("a");
      link.href = url.href;
      link.textContent = entry[1];
      if (entry[0] === creditFlow) link.setAttribute("aria-current", "page");
      nav.appendChild(link);
    });
    document.body.appendChild(nav);
    return true;
  }

  function arrangeCreditFlowPreview() {
    if (!creditFlowEnabled || !document.body) return false;
    var gallery = document.querySelector("main .jdc-clip-gallery-section");
    var flow = gallery && gallery.querySelector(":scope > .jdc-clip-gallery-flow");
    var title = flow && flow.querySelector(":scope > .jdc-layout4-title51");
    var grid = flow && flow.querySelector(":scope > .jdc-clip-gallery-grid");
    var credits = flow && flow.querySelector(":scope > .jdc-layout4-credits51");
    var press = document.querySelector(".jdc-project-press53");
    if (!gallery || !flow || !title || !grid || !credits || !press) return false;

    var creditsTitle = credits.querySelector(":scope > .jdc-project-credits-title55");
    if (!creditsTitle) {
      creditsTitle = document.createElement("div");
      creditsTitle.className = "jdc-project-credits-title55";
      creditsTitle.textContent = "Credits";
      credits.insertBefore(creditsTitle, credits.firstChild);
    }
    credits.setAttribute("data-jdc-credit-flow55", creditFlow);
    title.setAttribute("data-jdc-credit-flow55", creditFlow);
    gallery.setAttribute("data-jdc-credit-flow55", creditFlow);

    flow.insertBefore(title, flow.firstChild);
    if (creditFlow === "1") {
      flow.insertBefore(press, grid);
      flow.appendChild(credits);
      press.setAttribute("data-jdc-credit-flow-placement55", "before-gallery");
    } else {
      flow.insertBefore(credits, grid);
      var clips = Array.prototype.slice.call(grid.children).filter(function (item) {
        return item.classList.contains("jdc-clip-gallery-item");
      });
      grid.insertBefore(press, clips[6] || null);
      press.setAttribute("data-jdc-credit-flow-placement55", "inside-gallery");
    }
    document.documentElement.setAttribute("data-jdc-credit-flow-preview", creditFlow);
    return true;
  }

  function roleScore(value) {
    var text = String(value || "").toLowerCase();
    var matches = text.match(/\b(director|producer|production|executive|creative|cinematographer|cinematography|photographer|photography|editor|editing|designer|design|animation|animator|vfx|visual effects|colorist|color|music|composer|sound|audio|stylist|styling|wardrobe|costume|hair|makeup|gaffer|grip|camera|operator|assistant|agency|client|artist|featuring|cast|casting|choreographer|choreography|title|story|copywriter|copywriting|label|commissioner|post house|set pas|prod co|dp|ep|pm|ac|ae|slt|hmu|bts|bbg)\b/g);
    return matches ? matches.length : 0;
  }

  function makeCreditItem(person, credit) {
    var item = document.createElement("div");
    item.className = "jdc-credit-item51";
    var name = document.createElement("span");
    name.className = "jdc-credit-name51";
    name.textContent = person;
    item.appendChild(name);
    var role = document.createElement("span");
    role.className = "jdc-credit-role51";
    role.textContent = credit;
    item.appendChild(role);
    return item;
  }

  function makeSingleCreditItem(text) {
    var item = document.createElement("div");
    item.className = "jdc-credit-item51";
    item.setAttribute("data-jdc-single", "true");
    var name = document.createElement("span");
    name.className = "jdc-credit-name51";
    name.textContent = text;
    item.appendChild(name);
    return item;
  }

  function applyCanonicalCredits() {
    if (option !== "3" && option !== "4") return false;
    var data = canonicalCreditData();
    var lists = Array.prototype.slice.call(document.querySelectorAll(".jdc-credit-list51"));
    if (!data || !lists.length) return false;
    lists.forEach(function (list) {
      if (list.getAttribute("data-jdc-canonical-credits53") === RELEASE) return;
      while (list.firstChild) list.removeChild(list.firstChild);
      data.forEach(function (entry) {
        list.appendChild(entry.credit ? makeCreditItem(entry.name, entry.credit) : makeSingleCreditItem(entry.name));
      });
      list.setAttribute("data-jdc-canonical-credits53", RELEASE);
    });
    document.documentElement.setAttribute("data-jdc-canonical-credits", RELEASE);
    return true;
  }

  function repairCreditLines() {
    Array.prototype.slice.call(document.querySelectorAll(".jdc-credit-item51")).forEach(function (item) {
      var name = item.querySelector(".jdc-credit-name51");
      var role = item.querySelector(".jdc-credit-role51");
      if (!name) return;

      var featuring = !role && name.textContent.match(/^Featuring\s+(.+)$/i);
      if (featuring) {
        name.textContent = featuring[1].trim();
        var featuringRole = document.createElement("span");
        featuringRole.className = "jdc-credit-role51";
        featuringRole.textContent = "Featuring";
        item.appendChild(featuringRole);
        item.removeAttribute("data-jdc-single");
        return;
      }

      if (role && /^BBG$/i.test(name.textContent.trim()) && /^Thorn Shaffer\s+B-Unit Gaffer\s*[-–—]\s*Trevor Dunnigan,\s*Monty Sloan$/i.test(role.textContent.trim())) {
        name.textContent = "Thorn Shaffer";
        role.textContent = "BBG";
        item.parentNode.insertBefore(makeCreditItem("Trevor Dunnigan, Monty Sloan", "B-Unit Gaffer"), item.nextSibling);
      }
    });
  }

  function normalizeCreditHierarchy() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".jdc-credit-item51:not([data-jdc-single='true'])"));
    items.forEach(function (item) {
      var name = item.querySelector(".jdc-credit-name51");
      var role = item.querySelector(".jdc-credit-role51");
      if (!name || !role) return;
      if (item.closest("[data-jdc-canonical-credits53='" + RELEASE + "']")) {
        item.setAttribute("data-jdc-large53", "name");
        return;
      }
      var nameScore = roleScore(name.textContent);
      var roleValueScore = roleScore(role.textContent);
      var large = roleValueScore > nameScore ? "name" : "role";
      item.setAttribute("data-jdc-large53", large);
    });
    return items.length > 0;
  }

  function makeLinkGroup(label, links) {
    if (!links.length) return null;
    var block = document.createElement("section");
    block.className = "jdc-project-press-block53";
    var heading = document.createElement("h3");
    heading.className = "jdc-project-press-label53";
    heading.textContent = label;
    block.appendChild(heading);
    var list = document.createElement("div");
    list.className = "jdc-project-press-links53";
    links.forEach(function (item) {
      var link = document.createElement("a");
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = item.label;
      list.appendChild(link);
    });
    block.appendChild(list);
    return block;
  }

  function makeQuotes(quotes) {
    if (!quotes.length) return null;
    var grid = document.createElement("div");
    grid.className = "jdc-project-quotes53";
    quotes.forEach(function (item) {
      var quote = document.createElement("blockquote");
      quote.className = "jdc-project-quote53";
      var copy = document.createElement("p");
      copy.className = "jdc-project-quote-copy53";
      copy.textContent = "“" + item.text + "”";
      quote.appendChild(copy);
      if (item.source) {
        var source = document.createElement("cite");
        source.className = "jdc-project-quote-source53";
        source.textContent = item.source;
        quote.appendChild(source);
      }
      grid.appendChild(quote);
    });
    return grid;
  }

  function buildPressSection() {
    if (option !== "3" && option !== "4") return false;
    if (document.querySelector(".jdc-project-press53")) return true;
    var data = projectData();
    var page = document.querySelector("main#page, main");
    if (!data || !page) return false;

    var recognition = [];
    var media = [];
    (data.fields || []).forEach(function (field) {
      var target = /^press$/i.test(field.label || "") ? media : recognition;
      (field.links || []).forEach(function (link) { target.push(link); });
    });

    var section = document.createElement("section");
    section.className = "jdc-project-press53";
    section.setAttribute("aria-label", "Press and recognition for " + data.title);
    var inner = document.createElement("div");
    inner.className = "jdc-project-press-inner53";
    var title = document.createElement("div");
    title.className = "jdc-project-press-title53";
    title.textContent = "Press & Recognition";
    inner.appendChild(title);

    var blocks = [];
    var recognitionBlock = makeLinkGroup("Awards & Recognition", recognition);
    var mediaBlock = makeLinkGroup("Media", media);
    if (recognitionBlock) blocks.push(recognitionBlock);
    if (mediaBlock) blocks.push(mediaBlock);
    if (blocks.length === 1) blocks[0].setAttribute("data-jdc-only-block", "true");
    blocks.forEach(function (block) { inner.appendChild(block); });

    var quotes = makeQuotes(data.quotes || []);
    if (quotes) inner.appendChild(quotes);
    section.appendChild(inner);
    page.appendChild(section);
    document.documentElement.setAttribute("data-jdc-press-integrated", RELEASE);
    return true;
  }

  function install() {
    scheduled = false;
    if (!previewActive) return;
    ensureStyles();
    installCreditStylePreview();
    installCreditFlowPreview();
    applyCanonicalCredits();
    repairCreditLines();
    normalizeCreditHierarchy();
    buildPressSection();
    arrangeCreditFlowPreview();
  }

  function schedule() {
    if (scheduled || !previewActive) return;
    scheduled = true;
    window.requestAnimationFrame(install);
  }

  function observe() {
    if (!previewActive || observer || !window.MutationObserver) return;
    observer = new MutationObserver(schedule);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.__JDC_PROJECT_BLOCKS_OBSERVER53__ = observer;
  }

  load(CORE_URL, "data-jdc-pilot53-core", "pilot51", function () {
    if (!previewActive) return;
    ensureStyles();
    load(CREDIT_DATA_URL, "data-jdc-pilot53-credit-data", "canonical-credits", function () {
      load(DATA_URL, "data-jdc-pilot53-data", "press-recognition", function () {
        observe();
        document.addEventListener("DOMContentLoaded", schedule, { once: true });
        window.addEventListener("pageshow", schedule, { passive: true });
        [0, 100, 300, 700, 1400, 2600, 4500].forEach(function (delay) {
          window.setTimeout(schedule, delay);
        });
        schedule();
      });
    });
  });
})();
