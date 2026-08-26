(function () {
  "use strict";

  var CORE_URL = "https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@608057322a17e92f8563991ea6336f0c14d39dfe/jdc-footer-pilot35.js";
  var HOME_PATH = /^\/$/;

  function installHomepageTitleUnderline() {
    if (!HOME_PATH.test(window.location.pathname) || document.getElementById("jdc-home-title-underline36")) return;

    var style = document.createElement("style");
    style.id = "jdc-home-title-underline36";
    style.textContent = [
      "html[data-jdc-home-title-underline='pilot36'] h1 a::after{display:none!important}",
      "html[data-jdc-home-title-underline='pilot36'] h1 a>span{",
      "background-image:linear-gradient(currentColor,currentColor)!important;",
      "background-position:left bottom!important;",
      "background-repeat:no-repeat!important;",
      "background-size:0 3px!important;",
      "-webkit-box-decoration-break:clone;box-decoration-break:clone;",
      "transition:background-size .4s cubic-bezier(.25,1,.5,1)!important",
      "}",
      "html[data-jdc-home-title-underline='pilot36'] h1 a:hover>span,",
      "html[data-jdc-home-title-underline='pilot36'] h1 a:focus-visible>span{background-size:100% 3px!important}",
      "@media (prefers-reduced-motion:reduce){",
      "html[data-jdc-home-title-underline='pilot36'] h1 a>span{transition:none!important}",
      "}"
    ].join("");
    (document.head || document.documentElement).appendChild(style);
    document.documentElement.setAttribute("data-jdc-home-title-underline", "pilot36");
  }

  function loadCore() {
    if (document.querySelector('script[data-jdc-pilot36-core="pilot35"]')) return;
    var core = document.createElement("script");
    core.src = CORE_URL;
    core.async = false;
    core.crossOrigin = "anonymous";
    core.setAttribute("data-jdc-pilot36-core", "pilot35");
    (document.head || document.documentElement).appendChild(core);
  }

  installHomepageTitleUnderline();
  loadCore();
})();
