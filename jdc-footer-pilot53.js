(function () {
  "use strict";

  if (window.__JDC_PILOT53__) return;
  window.__JDC_PILOT53__ = true;

  var RELEASE = "pilot53";
  var PARAM = "jdc-credits";
  var sitewideRelease = window.__JDC_PILOT53_SITEWIDE_WINNER__ === true;
  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : window.location.href;
  var CORE_URL = new URL("jdc-footer-pilot51.js", SCRIPT_URL).href;
  var DATA_URL = new URL("jdc-press-recognition-pilot53.js", SCRIPT_URL).href;
  var CREDIT_DATA_URL = new URL("jdc-credit-data-pilot54.js", SCRIPT_URL).href;
  var requested = sitewideRelease ? "4" : new URLSearchParams(window.location.search).get(PARAM);
  var previewActive = sitewideRelease || ["0", "1", "2", "3", "4"].indexOf(requested) !== -1;
  var option = sitewideRelease ? "4" : (requested === "1" || requested === "2" ? "3" : requested);
  var CREDIT_STYLE_PARAM = "jdc-credit-style";
  var requestedCreditStyle = sitewideRelease ? "2" : new URLSearchParams(window.location.search).get(CREDIT_STYLE_PARAM);
  var creditStyle = ["0", "1", "2", "3"].indexOf(requestedCreditStyle) !== -1 ? requestedCreditStyle : "0";
  var CREDIT_FLOW_PARAM = "jdc-credit-flow";
  var creditFlow = sitewideRelease ? "3" : new URLSearchParams(window.location.search).get(CREDIT_FLOW_PARAM);
  var CREDIT_COLUMNS_PARAM = "jdc-credit-columns";
  var creditColumns = sitewideRelease ? "4" : new URLSearchParams(window.location.search).get(CREDIT_COLUMNS_PARAM);
  var ORDER_ALT_PARAM = "jdc-order-alt";
  var orderAlt = "5";
  var PROJECT_DESIGN_PARAM = "jdc-project-design";
  var projectDesign = "1";
  var PROJECT_LOOK_PARAM = "jdc-project-look";
  var projectLook = new URLSearchParams(window.location.search).get(PROJECT_LOOK_PARAM);
  var behindTheScenesLook = sitewideRelease && projectLook === "behind-the-scenes";
  var creditFlowEnabled = previewActive && option === "4" && (
    creditFlow === "3" ||
    (["1", "2"].indexOf(creditFlow) !== -1 && /^\/day-one\/?$/.test(window.location.pathname))
  );
  var creditColumnsEnabled = previewActive && option === "4" && (creditColumns === "4" || creditFlow === "3");
  var creditStyleEnabled = previewActive && (option === "3" || option === "4") && ["0", "1", "2", "3"].indexOf(requestedCreditStyle) !== -1;
  var creditStylePreview = creditStyleEnabled && !creditFlowEnabled && /^\/day-one\/?$/.test(window.location.pathname);
  var sitewideWinnerEnabled = creditFlowEnabled && creditFlow === "3";
  var orderAltEnabled = sitewideWinnerEnabled;
  var nativeClipGalleryPaths65 = {
    "/amber-mark-out-of-this-world": true,
    "/armando-young-belladonna": true,
    "/armando-young-prizefighyer": true,
    "/black-twitter": true,
    "/bright-eyes-mariana-trench": true,
    "/celeste-everyday": true,
    "/day-one": true,
    "/diamond-terrifier-action-fortress": true,
    "/ggm-aguita": true,
    "/kelsey-lu-boys-noize-ride-or-die": true,
    "/kings-of-tupelo": true,
    "/kombilesa-mi-los-peinados": true,
    "/lovb-launch": true,
    "/mitski-a-pearl": true,
    "/mtv-vote-early": true,
    "/nike-jordan": true,
    "/shaq-hbo": true,
    "/thom-yorke-last-i-heard": true,
    "/wynn-awakening": true
  };
  var homepageProjectTitles65 = {
    "/day-one": "Bon Iver : Day One",
    "/lovb-adidas": "LOVB x Adidas",
    "/bombas-dream-of-comfort": "Bombas : Dream of Comfort",
    "/nike-aja-sabrina": "Nike : Aja & Sabrina",
    "/bombas-spring": "Bombas : Spring Campaign",
    "/polymarket-documentary": "Polymarket : Documentary",
    "/siberia-hills": "Siberia Hills : Lookbook",
    "/alignment-documentary": "Alignment : Documentary",
    "/ggm-aguita": "Gabriel Garzon Montano : Agüita",
    "/wynn-awakening": "Wynn : Awakening",
    "/amber-mark-out-of-this-world": "Amber Mark : Out of This World",
    "/thom-yorke-last-i-heard": "Thom Yorke : Last I Heard",
    "/polymarket-make-your-own-market": "Polymarket : Make Your Own Market",
    "/nike-jordan": "Nike : Jordan 39",
    "/shaq-hbo": "HBO : Shaq",
    "/bright-eyes-mariana-trench": "Bright Eyes : Mariana Trench",
    "/kings-of-tupelo": "Netflix : Kings of Tupelo",
    "/celeste-everyday": "Celeste : Everyday",
    "/spotify-hip-hop-classics-1": "Spotify : Hip Hop Classics",
    "/armando-young-prizefighyer": "Armando Young : Prizefighter",
    "/kelsey-lu-boys-noize-ride-or-die": "Kelsey Lu & Boys Noize : Ride or Die",
    "/black-twitter": "Hulu : Black Twitter",
    "/mitski-a-pearl": "Mitski : A Pearl",
    "/ggm-accoustic": "Gabriel Garzón-Montano : Fender Sessions",
    "/kombilesa-mi-los-peinados": "Kombilesa Mi : Los Peinados",
    "/lovb-launch": "LOVB : Launch",
    "/diamond-terrifier-action-fortress": "Diamond Terrifier : Action Fortress",
    "/armando-young-belladonna": "Armando Young : Belladonna",
    "/laufey-tour-visuals": "Laufey : Tour Visuals",
    "/dig-brand-identity": "DIG : Brand Identity",
    "/mtv-vote-early": "MTV : Vote Early"
  };
  var observer = null;
  var scheduled = false;
  var brightEyesSpacingQuiesced = false;

  function dependencyReady(value) {
    if (value === "pilot51") return window.__JDC_PILOT51__ === true;
    if (value === "canonical-credits") return !!window.JDC_CREDIT_DATA;
    if (value === "press-recognition") return !!window.JDC_PRESS_RECOGNITION;
    return false;
  }

  function load(url, attribute, value, complete) {
    var existing = document.querySelector("script[" + attribute + "='" + value + "']");
    if (existing) {
      if (complete) {
        if (dependencyReady(value)) complete();
        else existing.addEventListener("load", complete, { once: true });
      }
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
      "html[data-jdc-home-title-fix='pilot68'] body main h1,html[data-jdc-home-title-fix='pilot68'] body main h2,html[data-jdc-home-title-fix='pilot68'] body main h3{position:relative!important;z-index:2147483000!important;pointer-events:auto!important}",
      "html[data-jdc-home-title-fix='pilot68'] body main h1 a,html[data-jdc-home-title-fix='pilot68'] body main h1 a:visited,html[data-jdc-home-title-fix='pilot68'] body main h2 a,html[data-jdc-home-title-fix='pilot68'] body main h2 a:visited,html[data-jdc-home-title-fix='pilot68'] body main h3 a,html[data-jdc-home-title-fix='pilot68'] body main h3 a:visited{position:relative!important;z-index:1!important;pointer-events:auto!important;cursor:pointer!important;color:#fff!important;text-decoration:none!important}",
      "body[data-jdc-credits-option='3'] .jdc-project-body-block .jdc-credit-list51{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))!important;align-content:start!important;gap:10px 18px!important}",
      "body[data-jdc-credits-option='4'] .jdc-layout4-credits51 .jdc-credit-list51{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;align-content:start!important;gap:10px 18px!important}",
      "body[data-jdc-credits-option='4'][data-jdc-credit-columns='4'] .jdc-layout4-credits51 .jdc-credit-list51{grid-template-columns:repeat(4,minmax(0,1fr))!important}",
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
      ".jdc-project-press53,.jdc-project-quotes-section53{box-sizing:border-box!important;width:100%!important;margin:0!important;padding:clamp(42px,5.5vw,82px) 4vw clamp(58px,8vw,112px)!important;background:transparent!important;color:#050505!important;font-family:inherit!important}",
      ".jdc-project-press-inner53{display:grid!important;grid-template-columns:repeat(12,minmax(0,1fr))!important;gap:clamp(30px,4vw,58px) 24px!important;width:100%!important;margin:0!important;padding:0!important}",
      ".jdc-project-quotes-inner53{width:100%!important;margin:0!important;padding:0!important}",
      ".jdc-project-press-title53{grid-column:1/-1!important;margin:0!important;padding:0!important;font-size:9px!important;font-weight:400!important;letter-spacing:.075em!important;line-height:1.2!important;text-transform:uppercase!important;color:rgba(0,0,0,.48)!important}",
      ".jdc-project-press-block53{grid-column:span 6!important;min-width:0!important;margin:0!important;padding:0!important}",
      ".jdc-project-press-block53[data-jdc-only-block='true']{grid-column:1/-1!important}",
      ".jdc-project-press-label53{margin:0 0 9px!important;padding:0!important;color:#050505!important;font-size:13px!important;font-weight:500!important;letter-spacing:-.01em!important;line-height:1.15!important}",
      ".jdc-project-press-links53{display:flex!important;flex-wrap:wrap!important;gap:5px 14px!important;margin:0!important;padding:0!important}",
      ".jdc-project-press-links53 a{display:inline!important;margin:0!important;padding:0!important;color:rgba(0,0,0,.56)!important;font-size:10px!important;font-weight:400!important;letter-spacing:.02em!important;line-height:1.3!important;text-decoration:underline!important;text-decoration-color:rgba(0,0,0,.24)!important;text-decoration-thickness:1px!important;text-underline-offset:2px!important}",
      ".jdc-project-press-links53 a:hover{color:#050505!important;text-decoration-color:#050505!important}",
      ".jdc-project-quotes53{grid-column:1/-1!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:28px 24px!important;min-width:0!important;margin:0!important;padding:0!important}",
      ".jdc-project-quote53{display:flex!important;flex-direction:column!important;gap:8px!important;min-width:0!important;margin:0!important;padding:0!important}",
      ".jdc-project-quotes53>.jdc-project-quote53:only-child{grid-column:1/-1!important}",
      ".jdc-project-quote-copy53{margin:0!important;padding:0!important;color:#050505!important;font-size:13px!important;font-weight:400!important;letter-spacing:-.012em!important;line-height:1.34!important}",
      ".jdc-project-quote-source53{margin:0!important;padding:0!important;color:rgba(0,0,0,.48)!important;font-size:9px!important;font-weight:400!important;letter-spacing:.055em!important;line-height:1.2!important;text-transform:uppercase!important}",
      ".jdc-credit-style-nav53{position:fixed!important;z-index:2147483639!important;top:8px!important;right:8px!important;display:flex!important;align-items:center!important;gap:2px!important;margin:0!important;padding:3px!important;background:#fff!important;color:#050505!important;box-shadow:0 0 0 1px rgba(0,0,0,.14)!important;font-family:Arial,sans-serif!important;font-size:9px!important;line-height:1!important}",
      ".jdc-credit-style-nav53>span{padding:0 6px!important;color:rgba(0,0,0,.5)!important;text-transform:uppercase!important;letter-spacing:.06em!important}",
      ".jdc-credit-style-nav53>a{display:flex!important;align-items:center!important;justify-content:center!important;min-width:42px!important;height:23px!important;margin:0!important;padding:0 7px!important;color:#050505!important;text-decoration:none!important;white-space:nowrap!important}",
      ".jdc-credit-style-nav53>a[aria-current='page']{background:#050505!important;color:#fff!important}",
      ".jdc-credit-flow-nav55{position:fixed!important;z-index:2147483640!important;top:8px!important;right:8px!important;display:flex!important;align-items:center!important;gap:2px!important;margin:0!important;padding:3px!important;background:#fff!important;color:#050505!important;box-shadow:0 0 0 1px rgba(0,0,0,.14)!important;font-family:Arial,sans-serif!important;font-size:9px!important;line-height:1!important}",
      ".jdc-credit-flow-nav55>span{padding:0 6px!important;color:rgba(0,0,0,.5)!important;text-transform:uppercase!important;letter-spacing:.06em!important}",
      ".jdc-credit-flow-nav55>a{display:flex!important;align-items:center!important;justify-content:center!important;height:23px!important;margin:0!important;padding:0 8px!important;color:#050505!important;text-decoration:none!important;white-space:nowrap!important}",
      ".jdc-credit-flow-nav55>a[aria-current='page']{background:#050505!important;color:#fff!important}",
      ".jdc-order-alt-nav59{position:fixed!important;z-index:2147483641!important;top:40px!important;right:8px!important;display:flex!important;align-items:center!important;gap:2px!important;margin:0!important;padding:3px!important;background:#fff!important;color:#050505!important;box-shadow:0 0 0 1px rgba(0,0,0,.14)!important;font-family:Arial,sans-serif!important;font-size:9px!important;line-height:1!important}",
      ".jdc-order-alt-nav59>span{padding:0 6px!important;color:rgba(0,0,0,.5)!important;text-transform:uppercase!important;letter-spacing:.06em!important}",
      ".jdc-order-alt-nav59>a{display:flex!important;align-items:center!important;justify-content:center!important;min-width:23px!important;height:23px!important;margin:0!important;padding:0 6px!important;color:#050505!important;text-decoration:none!important;white-space:nowrap!important}",
      ".jdc-order-alt-nav59>a[aria-current='page']{background:#050505!important;color:#fff!important}",
      "html[data-jdc-order-alt-preview]{scroll-snap-type:none!important;scroll-behavior:auto!important}",
      "html[data-jdc-order-alt-preview] body .page-section{scroll-snap-align:none!important;scroll-snap-stop:normal!important}",
      "html[data-jdc-order-alt-preview] body[data-jdc-order-alt59] .jdc-layout4-title51{padding:26px 4vw 18px!important}",
      "body.jdc-order-alt-scroll-stable60 .jdc-order-alt-project-section60{box-sizing:border-box!important;height:var(--jdc-order-alt-section-height60)!important;min-height:var(--jdc-order-alt-section-height60)!important;padding-bottom:0!important}",
      "body.jdc-order-alt-scroll-stable60 .jdc-order-alt-project-section60>.content-wrapper{justify-content:flex-start!important}",
      "body.jdc-order-alt-scroll-stable60 .jdc-order-alt-project-engine60{box-sizing:border-box!important;height:var(--jdc-order-alt-engine-height60)!important;min-height:var(--jdc-order-alt-engine-height60)!important;padding-bottom:0!important;margin-bottom:0!important;transform:none!important}",
      "body.jdc-order-alt-scroll-stable60 .jdc-clip-gallery-section[data-jdc-gallery-slug='bright-eyes-mariana-trench']{margin-top:0!important}",
      "body[data-jdc-credit-flow55] .jdc-credits-preview-nav51{display:none!important}",
      "body[data-jdc-credit-flow55] .jdc-layout4-title51{box-sizing:border-box!important;width:100%!important;margin:0!important;padding:clamp(42px,5vw,72px) 4vw clamp(28px,3.5vw,48px)!important;text-align:center!important}",
      "body[data-jdc-credit-flow55] .jdc-layout4-title51 h1{max-width:none!important;margin:0 auto!important;text-align:center!important}",
      "body[data-jdc-credit-flow55] .jdc-layout4-credits51{box-sizing:border-box!important;display:block!important;width:100%!important;max-width:none!important;margin:0!important;padding:clamp(42px,5.5vw,82px) 4vw clamp(58px,8vw,112px)!important;background:transparent!important;color:#050505!important;font-family:inherit!important}",
      "body[data-jdc-credit-flow55] .jdc-project-credits-title55{box-sizing:border-box!important;width:100%!important;margin:0 0 clamp(24px,3vw,42px)!important;padding:0!important;color:rgba(0,0,0,.48)!important;font-size:9px!important;font-weight:400!important;letter-spacing:.075em!important;line-height:1.2!important;text-transform:uppercase!important}",
      "body[data-jdc-credit-flow55] .jdc-layout4-credits51 .jdc-credit-list51{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;align-content:start!important;gap:8px 16px!important;width:100%!important;margin:0!important;padding:0!important}",
      "body[data-jdc-credit-flow55] .jdc-layout4-credits51 .jdc-credit-item51{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:1px!important;min-width:0!important}",
      "body[data-jdc-credits-option='4'][data-jdc-credit-flow55] .jdc-layout4-credits51 .jdc-credit-item51[data-jdc-large53] .jdc-credit-name51{order:2!important;max-width:none!important;color:#050505!important;font-size:11.5px!important;font-weight:500!important;letter-spacing:-.008em!important;line-height:1.12!important;text-align:left!important;text-transform:none!important}",
      "body[data-jdc-credits-option='4'][data-jdc-credit-flow55] .jdc-layout4-credits51 .jdc-credit-item51[data-jdc-large53] .jdc-credit-role51{order:1!important;max-width:none!important;color:rgba(0,0,0,.46)!important;font-size:7.5px!important;font-weight:400!important;letter-spacing:.055em!important;line-height:1.15!important;text-align:left!important;text-transform:uppercase!important}",
      "body[data-jdc-credit-flow55] .jdc-layout4-credits51 .jdc-credit-item51[data-jdc-single='true']{grid-column:1/-1!important}",
      "body[data-jdc-credit-flow55] .jdc-clip-gallery-grid>.jdc-project-press53,body[data-jdc-credit-flow55] .jdc-clip-gallery-grid>.jdc-project-quotes-section53{grid-column:1/-1!important;min-width:0!important;padding-left:0!important;padding-right:0!important}",
      "body[data-jdc-credit-flow55='3'].jdc-balanced-preview-ready57 .jdc-project-info-band{display:none!important}",
      "body[data-jdc-credit-flow55='3'] .jdc-balanced-meta57{display:block!important;position:relative!important;z-index:5!important;box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;margin:0!important;padding:0!important;background:#fff!important;color:#050505!important}",
      "body[data-jdc-credit-flow55='3'] .jdc-balanced-meta-flow57{display:block!important;box-sizing:border-box!important;width:100%!important;margin:0!important;padding:0!important}",
      "body[data-jdc-credit-flow55='3'] .jdc-balanced-meta57 .jdc-layout4-title51{padding-bottom:18px!important}",
      "body[data-jdc-credit-flow55='3'] .jdc-balanced-meta57 .jdc-project-press53{padding-top:24px!important}",
      "body[data-jdc-credit-flow55='3'] .jdc-split-credit-block57{grid-column:1/-1!important;flex:0 0 auto!important;width:100%!important;max-width:none!important;margin:0!important;padding:clamp(48px,6vw,82px) 0!important}",
      "body[data-jdc-credit-flow55='3'] .jdc-balanced-meta57 .jdc-split-credit-block57{padding:clamp(24px,3vw,42px) 4vw clamp(58px,7vw,96px)!important}",
      "body[data-jdc-credit-flow55='3'] .jdc-lovb-credits{display:none!important}",
      "body[data-jdc-order-alt59] .jdc-clip-gallery-grid>.jdc-layout4-credits51,body[data-jdc-order-alt59] .jdc-clip-gallery-grid>.jdc-project-press53,body[data-jdc-order-alt59] .jdc-clip-gallery-grid>.jdc-project-quotes-section53{grid-column:1/-1!important;min-width:0!important}",
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
      "@media(max-width:1099px){body[data-jdc-credit-flow55] .jdc-layout4-credits51 .jdc-credit-list51{grid-template-columns:repeat(3,minmax(0,1fr))!important}.jdc-project-quotes53{grid-template-columns:repeat(2,minmax(0,1fr))!important}}",
      "@media(max-width:1099px){body[data-jdc-credits-option='4'][data-jdc-credit-columns='4'] .jdc-layout4-credits51 .jdc-credit-list51{grid-template-columns:repeat(3,minmax(0,1fr))!important}}",
      "@media(max-width:767px){body[data-jdc-credits-option='3'] .jdc-project-body-block .jdc-credit-list51,body[data-jdc-credits-option='4'] .jdc-layout4-credits51 .jdc-credit-list51,body[data-jdc-credits-option='3'][data-jdc-credit-style='2'] .jdc-project-body-block .jdc-credit-list51,body[data-jdc-credits-option='3'][data-jdc-credit-style='3'] .jdc-project-body-block .jdc-credit-list51,body[data-jdc-credit-flow55] .jdc-layout4-credits51 .jdc-credit-list51{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px 14px!important}body[data-jdc-credit-style='2'] .jdc-credit-item51:first-child{grid-column:1/-1!important}.jdc-credit-style-nav53,.jdc-credit-flow-nav55{top:6px!important;right:6px!important}.jdc-order-alt-nav59{top:38px!important;right:6px!important}.jdc-credit-style-nav53>span,.jdc-credit-flow-nav55>span,.jdc-order-alt-nav59>span{display:none!important}.jdc-credit-style-nav53>a{min-width:28px!important;padding:0 5px!important}.jdc-credit-flow-nav55>a,.jdc-order-alt-nav59>a{padding:0 6px!important}body:not([data-jdc-credit-flow55='3']) .jdc-credit-flow-nav55>a:first-of-type{font-size:0!important}body:not([data-jdc-credit-flow55='3']) .jdc-credit-flow-nav55>a:first-of-type:after{content:'Press first';font-size:9px!important}body:not([data-jdc-credit-flow55='3']) .jdc-credit-flow-nav55>a:last-of-type{font-size:0!important}body:not([data-jdc-credit-flow55='3']) .jdc-credit-flow-nav55>a:last-of-type:after{content:'Gallery split';font-size:9px!important}body[data-jdc-credit-flow55] .jdc-layout4-title51{padding:38px 6.15vw 24px!important}body[data-jdc-credit-flow55] .jdc-layout4-credits51,.jdc-project-press53,.jdc-project-quotes-section53{padding:44px 6.15vw 70px!important}.jdc-project-press-inner53{gap:32px 14px!important}.jdc-project-press-block53{grid-column:1/-1!important}.jdc-project-quotes53{grid-template-columns:minmax(0,1fr)!important;gap:24px!important}.jdc-project-quote-copy53{font-size:13px!important}}",
      "@media(max-width:767px){body[data-jdc-credits-option='4'][data-jdc-credit-columns='4'] .jdc-layout4-credits51 .jdc-credit-list51{grid-template-columns:repeat(2,minmax(0,1fr))!important}}",
      "@media(max-width:767px){html[data-jdc-order-alt-preview] body[data-jdc-order-alt59] .jdc-layout4-title51{padding:20px 6.15vw 14px!important}}"
    ].join("");
    (document.head || document.documentElement).appendChild(style);
  }

  function ensureSitewideWinnerStyles() {
    if (!sitewideWinnerEnabled || document.getElementById("jdc-sitewide-winner64")) return;
    var style = document.createElement("style");
    style.id = "jdc-sitewide-winner64";
    style.textContent = [
      "body[data-jdc-project-design61] .jdc-project-credits-title55,body[data-jdc-project-design61] .jdc-project-press-title53{display:none!important}",
      "body[data-jdc-project-design61] .jdc-layout4-credits51 .jdc-credit-list51{width:100%!important;max-width:1180px!important;margin-left:auto!important;margin-right:auto!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-clip-gallery-flow{padding-top:0!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-layout4-title51{box-sizing:border-box!important;width:100%!important;padding:clamp(42px,4.8vw,64px) 4vw 0!important;text-align:center!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-layout4-title51 h1{max-width:none!important;margin:0 auto!important;color:#000!important;font-size:clamp(48px,5vw,68px)!important;font-weight:400!important;letter-spacing:-.04em!important;line-height:.92!important;text-align:center!important;text-transform:none!important;overflow-wrap:normal!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-clip-gallery-grid>.jdc-layout4-credits51,html[data-jdc-project-design-preview='1'] body .jdc-balanced-meta-flow57>.jdc-layout4-credits51{box-sizing:border-box!important;width:100%!important;padding:clamp(28px,3.2vw,42px) 4vw clamp(42px,4.8vw,64px)!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-project-press53[data-jdc-order-alt-placement59='between-title-and-credits']{padding:10px 4vw 0!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-project-press53[data-jdc-order-alt-placement59='between-title-and-credits']+.jdc-layout4-credits51{padding-top:0!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-balanced-meta-flow57>.jdc-project-press53[data-jdc-order-alt-placement59='between-title-and-credits']+.jdc-layout4-credits51{margin-top:clamp(24px,2.2vw,28px)!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-layout4-credits51 .jdc-credit-list51{justify-items:stretch!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-layout4-credits51 .jdc-credit-item51{align-items:flex-start!important;text-align:left!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-layout4-credits51 .jdc-credit-name51,html[data-jdc-project-design-preview='1'] body .jdc-layout4-credits51 .jdc-credit-role51{text-align:left!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-sitewide-winner-grid64>.jdc-project-press53,html[data-jdc-project-design-preview='1'] body .jdc-sitewide-winner-grid64>.jdc-project-quotes-section53{box-sizing:border-box!important;grid-column:1/-1!important;flex:0 0 100%!important;width:100%!important;max-width:none!important;padding-left:0!important;padding-right:0!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-balanced-meta-flow57{display:block!important;width:100%!important;padding:0!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-project-press53{clear:both!important}",
      "html[data-jdc-project-design-preview='1'] body [data-jdc-sitewide-native-copy64]{display:none!important}",
      "html[data-jdc-sitewide-winner='pilot64'] body [data-jdc-sitewide-native-copy64]{display:none!important}",
      "html[data-jdc-sitewide-winner='pilot64'] body .jdc-native-single-engine65{box-sizing:content-box!important;padding-bottom:var(--jdc-native-single-extension65,0px)!important}",
      "html[data-jdc-sitewide-winner='pilot64'] body .jdc-native-single-meta65{position:absolute!important;z-index:4!important;left:0!important;top:var(--jdc-native-single-top65,0px)!important;box-sizing:border-box!important;width:100%!important;max-width:none!important;margin:0!important;background:#fff!important}",
      "html[data-jdc-sitewide-winner='pilot64'] body .jdc-native-single-shift65{transform:translateY(var(--jdc-native-single-shift65,0px))!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-polymarket-gallery-section{height:auto!important;min-height:0!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-polymarket-gallery-section>.content-wrapper{box-sizing:border-box!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;width:100%!important;max-width:none!important;padding:0!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-polymarket-gallery-section .jdc-project-spacing-engine{position:relative!important;order:1!important;display:block!important;width:100%!important;height:auto!important;min-height:0!important;inset:auto!important;transform:none!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-polymarket-gallery-section .jdc-project-lead-block{position:relative!important;box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;inset:auto!important;transform:none!important;margin:0!important;padding:0!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-polymarket-gallery-section .jdc-project-lead-block>.sqs-block-video{box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;margin:0!important;padding:0!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-polymarket-gallery-section .jdc-project-lead-block .native-video-player{width:100%!important;height:auto!important;aspect-ratio:16/9!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-polymarket-gallery-section .jdc-balanced-meta57{order:2!important;box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;margin:0!important;padding:0!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-polymarket-gallery-section .jdc-polymarket-gallery-grid{order:3!important;box-sizing:border-box!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:16px!important;width:100%!important;height:auto!important;min-height:0!important;margin:0!important;padding:0 4vw 4vw!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-polymarket-gallery-section .jdc-polymarket-gallery-item{position:relative!important;box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;inset:auto!important;transform:none!important;margin:0!important;padding:0!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-polymarket-gallery-section .jdc-polymarket-gallery-item>.sqs-block-video{width:100%!important;height:auto!important;min-height:0!important;margin:0!important;padding:0!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-polymarket-gallery-section .jdc-polymarket-gallery-item .native-video-player{width:100%!important;height:auto!important;aspect-ratio:16/9!important}",
      "html[data-jdc-project-design-preview='1'] body .jdc-polymarket-gallery-section .native-video-player video{width:100%!important;height:100%!important;object-fit:cover!important}",
      "@media(max-width:767px){html[data-jdc-project-design-preview='1'] body .jdc-polymarket-gallery-section .jdc-polymarket-gallery-grid{grid-template-columns:1fr!important;gap:10px!important;padding:0 6.15vw 6.15vw!important}}",
      "@media(max-width:767px){html[data-jdc-project-design-preview='1'] body .jdc-layout4-title51{padding:36px 6.15vw 0!important}html[data-jdc-project-design-preview='1'] body .jdc-layout4-title51 h1{font-size:clamp(34px,10vw,46px)!important;line-height:.94!important}html[data-jdc-project-design-preview='1'] body .jdc-clip-gallery-grid>.jdc-layout4-credits51,html[data-jdc-project-design-preview='1'] body .jdc-balanced-meta-flow57>.jdc-layout4-credits51{padding:26px 6.15vw 42px!important}html[data-jdc-project-design-preview='1'] body .jdc-project-press53[data-jdc-order-alt-placement59='between-title-and-credits']{padding:10px 6.15vw 0!important}html[data-jdc-project-design-preview='1'] body .jdc-project-press53[data-jdc-order-alt-placement59='between-title-and-credits']+.jdc-layout4-credits51{padding-top:0!important}}"
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
    if (sitewideWinnerEnabled) {
      Array.prototype.slice.call(document.querySelectorAll(".jdc-credit-flow-nav55")).forEach(function (nav) {
        if (nav.parentNode) nav.parentNode.removeChild(nav);
      });
      return true;
    }
    var nav = document.querySelector(".jdc-credit-flow-nav55");
    if (nav) return true;
    nav = document.createElement("nav");
    nav.className = "jdc-credit-flow-nav55";
    nav.setAttribute("aria-label", creditFlow === "3" ? "Sitewide project layout preview" : "Bon Iver page order treatments");
    var label = document.createElement("span");
    label.textContent = "Page order";
    nav.appendChild(label);
    var entries = creditFlow === "3" ? [
      ["0", "Current"],
      ["3", "Balanced preview"]
    ] : [
      ["1", "Press → gallery → credits"],
      ["2", "Credits → split gallery"]
    ];
    entries.forEach(function (entry) {
      var url = new URL(window.location.href);
      if (entry[0] === "0") {
        url.searchParams.set(PARAM, "0");
        url.searchParams.delete(CREDIT_STYLE_PARAM);
        url.searchParams.delete(CREDIT_FLOW_PARAM);
        url.searchParams.delete(CREDIT_COLUMNS_PARAM);
      } else {
        url.searchParams.set(PARAM, "4");
        url.searchParams.set(CREDIT_STYLE_PARAM, "2");
        url.searchParams.set(CREDIT_FLOW_PARAM, entry[0]);
        if (entry[0] === "3") url.searchParams.set(CREDIT_COLUMNS_PARAM, "4");
      }
      var link = document.createElement("a");
      link.href = url.href;
      link.textContent = entry[1];
      if (entry[0] === creditFlow) link.setAttribute("aria-current", "page");
      nav.appendChild(link);
    });
    document.body.appendChild(nav);
    return true;
  }

  function installOrderAltPreview() {
    if (!sitewideWinnerEnabled || !document.body) return false;
    document.body.setAttribute("data-jdc-order-alt59", orderAlt);
    document.body.setAttribute("data-jdc-project-design61", projectDesign);
    document.documentElement.setAttribute("data-jdc-project-design-preview", projectDesign);
    ensureSitewideWinnerStyles();
    Array.prototype.slice.call(document.querySelectorAll(".jdc-order-alt-nav59")).forEach(function (nav) {
      if (nav.parentNode) nav.parentNode.removeChild(nav);
    });
    document.documentElement.setAttribute("data-jdc-sitewide-winner", "pilot64");
    return true;
  }

  function arrangeCreditFlowPreview() {
    if (!creditFlowEnabled || !document.body) return false;
    if (creditFlow === "3") return arrangeBalancedSitewidePreview();
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

    // This installer is intentionally re-run as Squarespace and the gallery
    // hydrate. Moving an element that is already in the right place still
    // emits child-list mutations, which used to make this observer schedule
    // itself forever. Besides wasting a frame on every cycle, temporarily
    // detaching the large press/credits blocks changes the document height and
    // makes Safari's scroll anchoring jump. Only move a block when its actual
    // sibling relationship needs to change.
    if (title.parentNode !== flow || title !== flow.firstElementChild) {
      flow.insertBefore(title, flow.firstElementChild);
    }
    if (creditFlow === "1") {
      if (press.parentNode !== flow || press.nextElementSibling !== grid) {
        flow.insertBefore(press, grid);
      }
      if (credits.parentNode !== flow || credits !== flow.lastElementChild) {
        flow.appendChild(credits);
      }
      press.setAttribute("data-jdc-credit-flow-placement55", "before-gallery");
    } else {
      if (credits.parentNode !== flow || credits.nextElementSibling !== grid) {
        flow.insertBefore(credits, grid);
      }
      var clips = Array.prototype.slice.call(grid.children).filter(function (item) {
        return item.classList.contains("jdc-clip-gallery-item");
      });
      var splitPoint = clips[6] || null;
      if (press.parentNode !== grid || press.nextElementSibling !== splitPoint) {
        grid.insertBefore(press, splitPoint);
      }
      press.setAttribute("data-jdc-credit-flow-placement55", "inside-gallery");
    }
    document.documentElement.setAttribute("data-jdc-credit-flow-preview", creditFlow);
    return true;
  }

  function stableInsert(parent, node, before) {
    if (!parent || !node) return false;
    var reference = before || null;
    if (node.parentNode === parent && node.nextElementSibling === reference) return false;
    parent.insertBefore(node, reference);
    return true;
  }

  function reconcileOrder(parent, desired) {
    if (!parent || !desired || !desired.length) return false;
    var actual = Array.prototype.slice.call(parent.children);
    var target = desired.concat(actual.filter(function (node) {
      return desired.indexOf(node) === -1;
    }));
    var unchanged = actual.length === target.length && actual.every(function (node, index) {
      return node === target[index];
    });
    if (unchanged) return false;
    var fragment = document.createDocumentFragment();
    target.forEach(function (node) { fragment.appendChild(node); });
    parent.appendChild(fragment);
    return true;
  }

  function setImportantPixel(node, property, value) {
    if (!node) return false;
    var rounded = Math.round(value * 100) / 100 + "px";
    if (node.style.getPropertyValue(property) === rounded && node.style.getPropertyPriority(property) === "important") return false;
    node.style.setProperty(property, rounded, "important");
    return true;
  }

  function stabilizeBrightEyesOrderScroll() {
    if (!orderAltEnabled || !document.body) return false;
    var engine = document.querySelector("main .jdc-project-spacing-engine");
    var projectSection = engine && engine.closest(".page-section,section");
    var lead = projectSection && projectSection.querySelector(".jdc-project-lead-block");
    var media = lead && (lead.querySelector(".jdc-video-shell") || lead.querySelector(".native-video-player") || lead.querySelector(".sqs-block-video"));
    var gallery = document.querySelector("main .jdc-clip-gallery-section[data-jdc-gallery-slug='bright-eyes-mariana-trench']");
    if (!engine || !projectSection || !lead || !media || !gallery) return false;

    var sectionRect = projectSection.getBoundingClientRect();
    var engineRect = engine.getBoundingClientRect();
    var mediaRect = media.getBoundingClientRect();
    if (mediaRect.height < 100 || engineRect.width < 100) return false;

    // The Fluid Engine lead block changes its grid height while Squarespace
    // hydrates and while the legacy spacing pass runs. The actual 16:9 media
    // shell has a stable aspect ratio, so freeze to its visible bottom rather
    // than the fluctuating empty grid area below it.
    var engineHeight = Math.max(mediaRect.height, mediaRect.bottom - engineRect.top);
    var sectionHeight = Math.max(engineHeight, engineRect.top - sectionRect.top + engineHeight);
    projectSection.classList.add("jdc-order-alt-project-section60");
    engine.classList.add("jdc-order-alt-project-engine60");
    document.body.classList.add("jdc-order-alt-scroll-stable60");
    setImportantPixel(projectSection, "--jdc-order-alt-section-height60", sectionHeight);
    setImportantPixel(engine, "--jdc-order-alt-engine-height60", engineHeight);
    if (gallery.style.getPropertyValue("margin-top") !== "0px" || gallery.style.getPropertyPriority("margin-top") !== "important") {
      gallery.style.setProperty("margin-top", "0px", "important");
    }

    if (!brightEyesSpacingQuiesced) {
      if (window.__JDC_PROJECT_SPACING_OBSERVER__) window.__JDC_PROJECT_SPACING_OBSERVER__.disconnect();
      if (window.__JDC_PROJECT_SPACING_MUTATION_OBSERVER__) window.__JDC_PROJECT_SPACING_MUTATION_OBSERVER__.disconnect();
      if (window.__JDC_PROJECT_SPACING_SETTLE_TIMER__) window.clearInterval(window.__JDC_PROJECT_SPACING_SETTLE_TIMER__);
      brightEyesSpacingQuiesced = true;
    }
    document.documentElement.setAttribute("data-jdc-order-alt-scroll-stable", "pilot60");
    return true;
  }

  function arrangeSitewideWinnerPreview() {
    if (!sitewideWinnerEnabled || !document.body) return false;
    var gallery = document.querySelector("main .jdc-clip-gallery-section");
    var flow = gallery && gallery.querySelector(":scope > .jdc-clip-gallery-flow");
    var title = flow && flow.querySelector(":scope > .jdc-layout4-title51");
    var grid = flow && flow.querySelector(":scope > .jdc-clip-gallery-grid");
    var credits = document.querySelector("main .jdc-layout4-credits51");
    var press = document.querySelector("main .jdc-project-press53");
    var quotes = document.querySelector("main .jdc-project-quotes-section53");
    if (!gallery || !flow || !title || !grid || (!credits && !press && !quotes)) return false;

    var clips = Array.prototype.slice.call(grid.children).filter(function (item) {
      return item.classList.contains("jdc-clip-gallery-item");
    });
    var extras = Array.prototype.slice.call(grid.children).filter(function (item) {
      return clips.indexOf(item) === -1 && item !== credits && item !== press && item !== quotes;
    });
    var templateColumns = window.getComputedStyle ? window.getComputedStyle(grid).gridTemplateColumns : "";
    var rowSize = templateColumns && templateColumns !== "none" ? templateColumns.trim().split(/\s+/).length : 3;
    rowSize = Math.max(1, Math.min(3, rowSize));
    var flowOrder = [title, grid];
    var completedRows = clips.length >= rowSize * 2 ? rowSize * 2 :
      (clips.length > rowSize ? rowSize : clips.length);
    var gridOrder = [];
    if (behindTheScenesLook && press) gridOrder.push(press);
    if (credits) gridOrder.push(credits);
    gridOrder = gridOrder.concat(clips.slice(0, completedRows));
    if (behindTheScenesLook && quotes) gridOrder.push(quotes);
    if (!behindTheScenesLook && press) gridOrder.push(press);
    gridOrder = gridOrder.concat(clips.slice(completedRows), extras);
    if (press) press.setAttribute("data-jdc-order-alt-placement59", behindTheScenesLook ? "between-title-and-credits" : "after-complete-rows");
    if (credits) credits.setAttribute("data-jdc-order-alt-placement59", "before-first-row");
    if (quotes) quotes.setAttribute("data-jdc-order-alt-placement59", "after-complete-rows");

    reconcileOrder(grid, gridOrder);
    reconcileOrder(flow, flowOrder);
    gallery.setAttribute("data-jdc-order-alt59", orderAlt);
    document.documentElement.setAttribute("data-jdc-order-alt-preview", orderAlt);
    document.documentElement.setAttribute("data-jdc-order-alt-release", "pilot64");
    stabilizeBrightEyesOrderScroll();
    return true;
  }

  function pagePath() {
    return String(window.location.pathname || "/").replace(/\/+$/, "") || "/";
  }

  function syncHomepageProjectTitles() {
    if (pagePath() !== "/") return;
    Array.prototype.slice.call(document.querySelectorAll("main a[href]")).forEach(function (link) {
      var linkPath = "";
      try {
        linkPath = String(new URL(link.href, window.location.href).pathname || "").replace(/\/+$/, "") || "/";
      } catch (error) {
        return;
      }
      var title = homepageProjectTitles65[linkPath];
      if (!title) return;
      // Keep the Squarespace anchor intact: its link styles provide the
      // homepage's white type and per-line hover underline treatment.
      var label = Array.prototype.slice.call(link.children).find(function (child) {
        return child.tagName === "SPAN";
      });
      if (!label) {
        label = document.createElement("span");
        link.textContent = "";
        link.appendChild(label);
      }
      label.textContent = title;
      document.documentElement.setAttribute("data-jdc-home-title-fix", "pilot68");
    });
  }

  function installHomepageProjectNavigation() {
    if (pagePath() !== "/" || window.__JDC_HOME_PROJECT_NAV68__) return;
    window.__JDC_HOME_PROJECT_NAV68__ = true;
    document.addEventListener("click", function (event) {
      if (pagePath() !== "/" || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var heading = event.target && event.target.closest ? event.target.closest("main h1,main h2,main h3") : null;
      if (!heading) return;
      var link = heading.querySelector("a[href]");
      if (!link) return;
      var destination;
      try {
        destination = new URL(link.getAttribute("href"), window.location.href);
      } catch (error) {
        return;
      }
      if (destination.origin !== window.location.origin) return;
      event.preventDefault();
      event.stopPropagation();
      window.location.assign(destination.href);
    }, true);
  }

  function originalProjectHeading() {
    return document.querySelector("main .jdc-project-info-band .jdc-project-title-block h1,main .jdc-project-info-band .jdc-project-title-block h2,main .jdc-project-info-band .jdc-project-title-block h3");
  }

  function formatBalancedTitle(text) {
    return String(text || "").trim().replace(/\s+[–—-]\s+/, " : ");
  }

  function makeBalancedTitle() {
    var canonicalTitle = homepageProjectTitles65[pagePath()] || "";
    var block = document.querySelector("main .jdc-layout4-title51");
    if (block) {
      var existingHeading = block.querySelector("h1,h2,h3");
      if (existingHeading) existingHeading.textContent = formatBalancedTitle(canonicalTitle || existingHeading.textContent);
      return block;
    }
    var data = projectData();
    var source = originalProjectHeading();
    var text = canonicalTitle || (source ? source.textContent.trim() : data && data.title ? data.title : document.title.split("—")[0].trim());
    text = formatBalancedTitle(text);
    if (!text) return null;
    block = document.createElement("div");
    block.className = "jdc-layout4-title51";
    var heading = document.createElement("h1");
    heading.textContent = text;
    block.appendChild(heading);
    return block;
  }

  function ensureCreditsTitle(block) {
    if (!block) return null;
    var title = block.querySelector(":scope > .jdc-project-credits-title55");
    if (title) return title;
    title = document.createElement("div");
    title.className = "jdc-project-credits-title55";
    title.textContent = "Credits";
    block.insertBefore(title, block.firstChild);
    return title;
  }

  function makeBalancedCredits() {
    var existing = document.querySelector("main .jdc-layout4-credits51");
    if (existing) {
      ensureCreditsTitle(existing);
      existing.classList.add("jdc-split-credit-block57");
      existing.setAttribute("data-jdc-credit-flow55", "3");
      return existing;
    }
    var data = canonicalCreditData();
    document.documentElement.setAttribute("data-jdc-credit-source-count", data && data.length ? String(data.length) : "0");
    if (!data || !data.length) return null;
    var block = document.createElement("section");
    block.className = "jdc-layout4-credits51 jdc-split-credit-block57";
    block.setAttribute("aria-label", "Project credits");
    block.setAttribute("data-jdc-credit-flow55", "3");
    ensureCreditsTitle(block);
    var list = document.createElement("div");
    list.className = "jdc-credit-list51";
    data.forEach(function (entry) {
      var item = entry.credit ? makeCreditItem(entry.name, entry.credit) : makeSingleCreditItem(entry.name);
      if (entry.credit) item.setAttribute("data-jdc-large53", "name");
      list.appendChild(item);
    });
    list.setAttribute("data-jdc-canonical-credits53", RELEASE);
    block.appendChild(list);
    return block;
  }

  function ensureBalancedMeta() {
    var meta = document.querySelector("main .jdc-balanced-meta57");
    if (meta) return meta;
    meta = document.createElement("section");
    meta.className = "jdc-balanced-meta57";
    var flow = document.createElement("div");
    flow.className = "jdc-balanced-meta-flow57";
    meta.appendChild(flow);
    return meta;
  }

  function removeBalancedDuplicates(selector, keep) {
    Array.prototype.slice.call(document.querySelectorAll("main " + selector)).forEach(function (node) {
      if (node === keep || !node.parentNode) return;
      node.parentNode.removeChild(node);
    });
  }

  function cleanBalancedScaffolding(title, credits, meta) {
    removeBalancedDuplicates(".jdc-layout4-title51", title);
    removeBalancedDuplicates(".jdc-layout4-credits51", credits);
    Array.prototype.slice.call(document.querySelectorAll("main .jdc-balanced-meta57")).forEach(function (node) {
      if (node === meta || !node.parentNode) return;
      node.parentNode.removeChild(node);
    });
  }

  function compactNativeHeroCopy(meta, heroSection) {
    if (!meta || !heroSection) return false;
    // Measure the persistent media shell as well as the transient <video>.
    // The adaptive player intentionally unmounts far-offscreen video elements;
    // spacing must not expand just because the hero is outside the viewport.
    var media = Array.prototype.slice.call(heroSection.querySelectorAll(
      "[data-jdc-video],[data-jdc-native-video],[data-config-video],[data-config-native-video],video"
    ));
    var mediaRects = media.map(function (node) { return node.getBoundingClientRect(); }).filter(function (rect) {
      return rect.height >= 100 && rect.width >= 100;
    });
    if (!mediaRects.length) return false;
    var mediaBottom = Math.max.apply(Math, mediaRects.map(function (rect) { return rect.bottom; }));
    Array.prototype.slice.call(heroSection.querySelectorAll(".sqs-block-html")).forEach(function (block) {
      if (block.closest(".jdc-balanced-meta57")) return;
      var rect = block.getBoundingClientRect();
      if (rect.top >= mediaBottom - 4) block.setAttribute("data-jdc-sitewide-native-copy64", "superseded");
    });
    var sectionRect = heroSection.getBoundingClientRect();
    var desiredGap = window.innerWidth <= 767 ? 28 : 44;
    var pull = Math.max(0, sectionRect.bottom - mediaBottom - desiredGap);
    meta.style.setProperty("margin-top", pull > 1 ? (-Math.round(pull)) + "px" : "0px", "important");
    heroSection.setAttribute("data-jdc-sitewide-native-hero64", "compacted");
    return true;
  }

  function compactSectionTail(nextNode, mediaSection) {
    if (!nextNode || !mediaSection) return false;
    var media = Array.prototype.slice.call(mediaSection.querySelectorAll(
      "[data-jdc-video],[data-jdc-native-video],[data-config-video],[data-config-native-video],video"
    ));
    var mediaRects = media.map(function (node) { return node.getBoundingClientRect(); }).filter(function (rect) {
      return rect.height >= 100 && rect.width >= 100;
    });
    if (!mediaRects.length) return false;
    var mediaBottom = Math.max.apply(Math, mediaRects.map(function (rect) { return rect.bottom; }));
    var sectionRect = mediaSection.getBoundingClientRect();
    var desiredGap = window.innerWidth <= 767 ? 28 : 44;
    var pull = Math.max(0, sectionRect.bottom - mediaBottom - desiredGap);
    nextNode.style.setProperty("margin-top", pull > 1 ? (-Math.round(pull)) + "px" : "0px", "important");
    return true;
  }

  function customGalleryDescriptor() {
    var specs = [
      [".jdc-alignment-gallery-flow", ".jdc-alignment-slide", 4, "alignment"],
      [".jdc-laufey-gallery-grid", ".jdc-laufey-gallery-item", 6, "laufey"],
      [".jdc-polymarket-gallery-grid", ".jdc-polymarket-gallery-item", 6, "polymarket"],
      [".jdc-limn-gallery-grid", ".jdc-limn-gallery-item", 6, "limn"],
      [".jdc-dig-gallery-grid", ".jdc-dig-gallery-item", 6, "dig"],
      [".jdc-lovb-gallery-grid", ".jdc-lovb-gallery-item", 6, "lovb"],
      [".jdc-basis-project-grid", ".jdc-basis-project-item", 2, "basis"]
    ];
    for (var index = 0; index < specs.length; index += 1) {
      var container = document.querySelector("main " + specs[index][0]);
      if (!container) continue;
      var items = Array.prototype.slice.call(container.children).filter(function (item) {
        return item.matches(specs[index][1]);
      });
      if (specs[index][3] === "laufey") {
        items = items.filter(function (item) {
          return !item.classList.contains("jdc-laufey-performance-item");
        });
      }
      return {
        container: container,
        items: items,
        split: specs[index][2],
        type: specs[index][3],
        section: container.closest(".page-section, section")
      };
    }
    var bombas = document.querySelector("main .jdc-bombas-gallery-section");
    if (bombas) return { container: null, items: [], split: 0, type: "bombas", section: bombas };
    return null;
  }

  function markSupersededNativeCopy() {
    if (!sitewideWinnerEnabled || !document.querySelector("main .jdc-layout4-title51") || !document.querySelector("main .jdc-layout4-credits51")) return false;
    var changed = false;
    Array.prototype.slice.call(document.querySelectorAll("main .sqs-block-html")).forEach(function (block) {
      if (block.closest(".jdc-balanced-meta57,.jdc-clip-gallery-section,.jdc-project-press53,.jdc-project-quotes-section53")) return;
      if (!block.textContent.replace(/\s+/g, " ").trim()) return;
      if (block.getAttribute("data-jdc-sitewide-native-copy64") !== "superseded") {
        block.setAttribute("data-jdc-sitewide-native-copy64", "superseded");
        changed = true;
      }
    });
    return changed;
  }

  function pxNumber(value) {
    var number = Number.parseFloat(String(value || ""));
    return Number.isFinite(number) ? number : 0;
  }

  function setStyleValue(node, name, value, priority) {
    if (!node || !node.style) return false;
    var currentValue = node.style.getPropertyValue(name);
    var currentPriority = node.style.getPropertyPriority(name);
    var nextPriority = priority || "";
    if (currentValue === value && currentPriority === nextPriority) return false;
    node.style.setProperty(name, value, nextPriority);
    return true;
  }

  function resetSingleFluidMeta(meta) {
    if (meta) {
      meta.classList.remove("jdc-native-single-meta65");
      meta.style.removeProperty("--jdc-native-single-top65");
      meta.style.setProperty("margin-top", "0px", "important");
    }
    Array.prototype.slice.call(document.querySelectorAll("main .jdc-native-single-engine65")).forEach(function (engine) {
      engine.classList.remove("jdc-native-single-engine65");
      engine.style.removeProperty("--jdc-native-single-shift65");
      engine.style.removeProperty("--jdc-native-single-extension65");
    });
    Array.prototype.slice.call(document.querySelectorAll("main .jdc-native-single-shift65")).forEach(function (block) {
      block.classList.remove("jdc-native-single-shift65");
    });
    Array.prototype.slice.call(document.querySelectorAll("main .jdc-native-single-section65")).forEach(function (section) {
      section.classList.remove("jdc-native-single-section65");
      section.removeAttribute("data-jdc-native-single-winner65");
      section.removeAttribute("data-jdc-native-single-shift65");
    });
    document.documentElement.removeAttribute("data-jdc-native-single-layout");
  }

  function placeSingleFluidMeta(meta) {
    if (!sitewideWinnerEnabled || !meta) return false;
    if (nativeClipGalleryPaths65[pagePath()]) return false;
    // A separately inserted BTS section is the natural boundary after the
    // hero. Do not pull metadata upward with the one-section Fluid fallback.
    if (document.querySelector("main .jdc-bts-section40")) return false;
    var sections = Array.prototype.slice.call(document.querySelectorAll("main .page-section"));
    if (sections.length !== 1) return false;
    var section = sections[0];
    var engine = section.querySelector(":scope > .content-wrapper > .fluid-engine,:scope > .content-wrapper .fluid-engine");
    if (!engine) return false;
    var mediaBlocks = Array.prototype.slice.call(engine.querySelectorAll(":scope > .fe-block")).filter(function (block) {
      return !!block.querySelector("video,[data-config-video],[data-config-native-video],[data-jdc-video]");
    });
    if (!mediaBlocks.length) return false;

    stableInsert(engine, meta, null);
    meta.classList.add("jdc-native-single-meta65");
    engine.classList.add("jdc-native-single-engine65");
    section.classList.add("jdc-native-single-section65");

    var currentShift = pxNumber(engine.style.getPropertyValue("--jdc-native-single-shift65"));
    var currentExtension = pxNumber(engine.style.getPropertyValue("--jdc-native-single-extension65"));
    var engineRect = engine.getBoundingClientRect();
    var baseEngineHeight = Math.max(0, engineRect.height - currentExtension);
    var geometry = mediaBlocks.map(function (block) {
      var rect = block.getBoundingClientRect();
      var shifted = block.classList.contains("jdc-native-single-shift65") ? currentShift : 0;
      return { block: block, top: rect.top - shifted, bottom: rect.bottom - shifted, width: rect.width, height: rect.height };
    }).filter(function (item) { return item.width >= 100 && item.height >= 100; });
    if (!geometry.length) return false;
    geometry.sort(function (a, b) {
      if (Math.abs(a.top - b.top) > 2) return a.top - b.top;
      return b.width - a.width;
    });
    var hero = geometry[0];
    var gallery = geometry.filter(function (item) { return item.block !== hero.block; });
    var galleryTop = gallery.length ? Math.min.apply(Math, gallery.map(function (item) { return item.top; })) : null;
    var gap = window.innerWidth <= 767 ? 28 : 44;
    var metaTop = Math.max(0, Math.round(hero.bottom - engineRect.top + gap));
    setStyleValue(meta, "--jdc-native-single-top65", metaTop + "px", "");
    var metaHeight = Math.max(1, meta.getBoundingClientRect().height);
    var shift = galleryTop === null ? 0 : Math.max(0, Math.round(metaTop + metaHeight + gap - (galleryTop - engineRect.top)));
    var extension = galleryTop === null ? Math.max(0, Math.round(metaTop + metaHeight + gap - baseEngineHeight)) : shift;

    gallery.forEach(function (item) {
      if (!item.block.classList.contains("jdc-native-single-shift65")) item.block.classList.add("jdc-native-single-shift65");
    });
    setStyleValue(engine, "--jdc-native-single-shift65", shift + "px", "");
    setStyleValue(engine, "--jdc-native-single-extension65", extension + "px", "");
    section.setAttribute("data-jdc-native-single-winner65", "true");
    section.setAttribute("data-jdc-native-single-shift65", String(shift));
    document.documentElement.setAttribute("data-jdc-native-single-layout", "pilot65");
    return true;
  }

  function placeMeta(meta, descriptor) {
    if (!meta) return false;
    var bts = document.querySelector("main .jdc-bts-section40");
    var projectSection = document.querySelector("main .jdc-project-info-band") &&
      document.querySelector("main .jdc-project-info-band").closest(".page-section");
    if (descriptor || bts) resetSingleFluidMeta(meta);
    var pageSections = Array.prototype.slice.call(document.querySelectorAll("main .page-section"));
    var heroSection = pageSections.find(function (section) {
      return Array.prototype.some.call(section.querySelectorAll(
        "[data-jdc-video],[data-jdc-native-video],[data-config-video],[data-config-native-video],video"
      ), function (media) {
        var rect = media.getBoundingClientRect();
        return getComputedStyle(media).display !== "none" && rect.width >= 100 && rect.height >= 100;
      });
    });
    if (descriptor && descriptor.type === "alignment" && pageSections.length > 1 && pageSections[1].parentNode) {
      compactNativeHeroCopy(meta, heroSection || pageSections[0]);
      var movedAlignmentMeta = stableInsert(pageSections[1].parentNode, meta, pageSections[1]);
      compactSectionTail(descriptor.section, pageSections[1]);
      return movedAlignmentMeta;
    }
    if (descriptor && descriptor.type === "basis" && descriptor.container) {
      return stableInsert(descriptor.container, meta, descriptor.items[1] || null);
    }
    if (descriptor && descriptor.section) {
      if (heroSection && heroSection !== descriptor.section) compactNativeHeroCopy(meta, heroSection);
      if (descriptor.container && (descriptor.section.contains(originalProjectHeading()) || descriptor.section.querySelector(".jdc-project-lead-block"))) {
        return stableInsert(descriptor.container.parentNode, meta, descriptor.container);
      }
      return stableInsert(descriptor.section.parentNode, meta, descriptor.section);
    }
    if (sitewideWinnerEnabled) {
      // Native Squarespace projects often keep the hero in the first section
      // and the gallery in a later section. Place the Winner composition at
      // that natural break without enabling the alternate video-layout pilot.
      var nativeSections = pageSections;
      var firstGallerySection = nativeSections.slice(1).find(function (section) {
        var media = section.querySelectorAll("video,[data-config-video],[data-config-native-video],[data-jdc-video]");
        return media.length >= 2;
      });
      if (firstGallerySection && firstGallerySection.parentNode) {
        resetSingleFluidMeta(meta);
        compactNativeHeroCopy(meta, nativeSections[0]);
        return stableInsert(firstGallerySection.parentNode, meta, firstGallerySection);
      }
    }
    if (placeSingleFluidMeta(meta)) return true;
    if (bts) return stableInsert(bts.parentNode, meta, bts);
    if (projectSection && projectSection.parentNode) return stableInsert(projectSection.parentNode, meta, projectSection.nextElementSibling);
    var regions = document.querySelector("main .page-regions");
    return regions ? stableInsert(regions, meta, null) : false;
  }

  function decorateBalancedInternalLinks() {
    if (creditFlow !== "3" || sitewideRelease) return;
    Array.prototype.slice.call(document.querySelectorAll("a[href]")).forEach(function (link) {
      if (link.closest(".jdc-credit-flow-nav55,.jdc-credits-preview-nav51,.jdc-credit-style-nav53")) return;
      var raw = link.getAttribute("href");
      if (!raw || /^(#|mailto:|tel:|javascript:)/i.test(raw)) return;
      try {
        var url = new URL(raw, document.baseURI);
        var internal = /(^|\.)josdiazcontreras\.com$/i.test(url.hostname) ||
          /(^|\.)josdiazcontreras\.squarespace\.com$/i.test(url.hostname) ||
          url.origin === window.location.origin;
        if (!internal) return;
        var local = new URL(window.location.href);
        local.pathname = url.pathname;
        local.search = url.search;
        local.hash = url.hash;
        local.searchParams.set(PARAM, "4");
        local.searchParams.set(CREDIT_STYLE_PARAM, "2");
        local.searchParams.set(CREDIT_FLOW_PARAM, "3");
        local.searchParams.set(CREDIT_COLUMNS_PARAM, "4");
        link.href = local.href;
      } catch (error) {
        return;
      }
    });
  }

  function arrangeBalancedSitewidePreview() {
    if (creditFlow !== "3" || !document.body) return false;
    var creditsData = canonicalCreditData();
    var press = document.querySelector(".jdc-project-press53");
    var quotes = document.querySelector(".jdc-project-quotes-section53");
    if ((!creditsData || !creditsData.length) && !press && !quotes) return false;

    var title = makeBalancedTitle();
    var credits = makeBalancedCredits();
    var clipGallery = document.querySelector("main .jdc-clip-gallery-section");
    var clipFlow = clipGallery && clipGallery.querySelector(":scope > .jdc-clip-gallery-flow");
    var clipGrid = clipFlow && clipFlow.querySelector(":scope > .jdc-clip-gallery-grid");
    if (clipFlow && clipGrid && title && credits) {
      if (sitewideWinnerEnabled) {
        var nativeSections = Array.prototype.slice.call(document.querySelectorAll("main .page-section"));
        var nativeHeroSection = nativeSections.find(function (section) {
          return !section.classList.contains("jdc-clip-gallery-section") &&
            section.querySelector("video,[data-config-video],[data-config-native-video]");
        });
        if (nativeHeroSection && nativeHeroSection !== clipGallery) {
          compactNativeHeroCopy(clipGallery, nativeHeroSection);
        }
      }
      stableInsert(clipFlow, title, clipFlow.firstElementChild);
      if (sitewideWinnerEnabled) {
        stableInsert(clipGrid, credits, clipGrid.firstElementChild);
      } else {
        var clips = Array.prototype.slice.call(clipGrid.children).filter(function (item) {
          return item.classList.contains("jdc-clip-gallery-item");
        });
        var btsItem = Array.prototype.slice.call(clipGrid.children).find(function (item) {
          return item.classList.contains("jdc-clip-bts-item");
        }) || null;
        var creditReference = clips.length > 6 ? clips[6] : (btsItem || null);
        stableInsert(clipGrid, credits, creditReference);
        if (press) {
          if (pagePath() === "/day-one" && btsItem) {
            stableInsert(clipGrid, press, btsItem);
            press.setAttribute("data-jdc-credit-flow-placement55", "before-bts");
          } else {
            stableInsert(clipFlow, press, clipGrid);
            press.setAttribute("data-jdc-credit-flow-placement55", "before-gallery");
          }
        }
      }
      clipGallery.setAttribute("data-jdc-credit-flow55", "3");
      clipGallery.setAttribute("data-jdc-balanced-layout57", "clip-gallery");
      cleanBalancedScaffolding(title, credits, null);
    } else {
      var descriptor = customGalleryDescriptor();
      var meta = ensureBalancedMeta();
      var metaFlow = meta.querySelector(":scope > .jdc-balanced-meta-flow57");
      if (title) stableInsert(metaFlow, title, metaFlow.firstElementChild);
      if (sitewideWinnerEnabled && behindTheScenesLook && press) {
        stableInsert(metaFlow, press, null);
        press.setAttribute("data-jdc-order-alt-placement59", "between-title-and-credits");
      }
      if (credits) stableInsert(metaFlow, credits, null);

      if (descriptor && descriptor.container) {
        descriptor.container.classList.add("jdc-sitewide-winner-grid64");
        var galleryPress = sitewideWinnerEnabled && behindTheScenesLook ? quotes : press;
        if (galleryPress) {
          var customColumns = window.getComputedStyle ? window.getComputedStyle(descriptor.container).gridTemplateColumns : "";
          var customRowSize = customColumns && customColumns !== "none" ? customColumns.trim().split(/\s+/).length : 2;
          customRowSize = Math.max(1, Math.min(3, customRowSize));
          var customSplit = descriptor.items.length >= customRowSize * 2 ? customRowSize * 2 :
            (descriptor.items.length > customRowSize ? customRowSize : descriptor.items.length);
          stableInsert(descriptor.container, galleryPress, descriptor.items[customSplit] || null);
          galleryPress.setAttribute("data-jdc-order-alt-placement59", "after-complete-rows");
        }
        descriptor.section && descriptor.section.setAttribute("data-jdc-balanced-layout57", descriptor.type);
      } else if (descriptor && descriptor.section && (sitewideWinnerEnabled && behindTheScenesLook ? quotes : press)) {
        var afterGalleryPress = sitewideWinnerEnabled && behindTheScenesLook ? quotes : press;
        stableInsert(descriptor.section.parentNode, afterGalleryPress, descriptor.section.nextElementSibling);
        afterGalleryPress.setAttribute("data-jdc-order-alt-placement59", "after-gallery");
      } else if (sitewideWinnerEnabled && behindTheScenesLook && quotes) {
        stableInsert(metaFlow, quotes, null);
      } else if (press) {
        stableInsert(metaFlow, press, null);
      }
      placeMeta(meta, descriptor);
      meta.setAttribute("data-jdc-balanced-layout57", descriptor ? descriptor.type : "project");
      cleanBalancedScaffolding(title, credits, meta);
    }

    markSupersededNativeCopy();
    document.body.classList.add("jdc-balanced-preview-ready57", "jdc-credits-layout4-ready51");
    document.body.setAttribute("data-jdc-credit-columns", "4");
    document.documentElement.setAttribute("data-jdc-credit-flow-preview", "3");
    document.documentElement.setAttribute("data-jdc-credits-preview-built", "true");
    document.documentElement.setAttribute("data-jdc-balanced-preview", "pilot57");
    decorateBalancedInternalLinks();
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

  function splitWinnerPressSection(section) {
    if (!sitewideWinnerEnabled || !behindTheScenesLook || !section) return null;
    var existing = document.querySelector(".jdc-project-quotes-section53");
    if (existing) return existing;
    var quotes = section.querySelector(".jdc-project-quotes53");
    if (!quotes) return null;
    var quoteSection = document.createElement("section");
    quoteSection.className = "jdc-project-quotes-section53";
    quoteSection.setAttribute("aria-label", "Selected press quotes");
    var quoteInner = document.createElement("div");
    quoteInner.className = "jdc-project-quotes-inner53";
    quoteInner.appendChild(quotes);
    quoteSection.appendChild(quoteInner);
    if (section.parentNode) section.parentNode.insertBefore(quoteSection, section.nextSibling);
    if (!section.querySelector(".jdc-project-press-block53") && section.parentNode) {
      section.parentNode.removeChild(section);
    }
    return quoteSection;
  }

  function buildPressSection() {
    if (option !== "3" && option !== "4") return false;
    var existingSection = document.querySelector(".jdc-project-press53");
    if (existingSection) {
      splitWinnerPressSection(existingSection);
      return true;
    }
    if (document.querySelector(".jdc-project-quotes-section53")) return true;
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
    title.textContent = "Press and Recognition";
    inner.appendChild(title);

    var blocks = [];
    var recognitionBlock = makeLinkGroup("Press and Recognition", recognition);
    var mediaBlock = makeLinkGroup("Media", media);
    if (recognitionBlock) blocks.push(recognitionBlock);
    if (mediaBlock) blocks.push(mediaBlock);
    if (blocks.length === 1) blocks[0].setAttribute("data-jdc-only-block", "true");
    blocks.forEach(function (block) { inner.appendChild(block); });

    var quotes = makeQuotes(data.quotes || []);
    if (quotes) inner.appendChild(quotes);
    section.appendChild(inner);
    page.appendChild(section);
    splitWinnerPressSection(section);
    document.documentElement.setAttribute("data-jdc-press-integrated", RELEASE);
    return true;
  }

  function install() {
    scheduled = false;
    if (!previewActive) return;
    ensureStyles();
    syncHomepageProjectTitles();
    installHomepageProjectNavigation();
    document.documentElement.setAttribute("data-jdc-project-look", behindTheScenesLook ? "behind-the-scenes" : "portfolio");
    if (document.body) document.body.setAttribute("data-jdc-credits-option", option);
    if (creditColumnsEnabled && document.body) document.body.setAttribute("data-jdc-credit-columns", "4");
    installCreditStylePreview();
    installCreditFlowPreview();
    installOrderAltPreview();
    applyCanonicalCredits();
    repairCreditLines();
    normalizeCreditHierarchy();
    buildPressSection();
    arrangeCreditFlowPreview();
    arrangeSitewideWinnerPreview();
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
        window.addEventListener("resize", schedule, { passive: true });
        [0, 100, 300, 700, 1400, 2600, 4500].forEach(function (delay) {
          window.setTimeout(schedule, delay);
        });
        schedule();
      });
    });
  });
})();
