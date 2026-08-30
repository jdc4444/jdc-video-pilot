(function () {
  "use strict";

  if (window.__JDC_PILOT74__) return;
  window.__JDC_PILOT74__ = true;

  var path = window.location.pathname.replace(/\/+$/, "") || "/";
  var isKombilesa = path === "/kombilesa-mi-los-peinados";
  var root = document.documentElement;
  var pilotScriptUrl = document.currentScript && document.currentScript.src
    ? document.currentScript.src
    : window.location.href;

  if (isKombilesa) {
    var START_AT = 5;
    var TARGET_ID = "13e63c0c-0ff8-476e-ab6b-45679130a4fe";
    var posterUrl = new URL("media/kombilesa-main-start-5s/poster.jpg", pilotScriptUrl).href;
    var preparedVideos = new WeakSet();

    function targetShell() {
      var shells = Array.prototype.slice.call(document.querySelectorAll("body main .jdc-video-shell"));
      return shells.find(function (shell) {
        var config = [
          shell.getAttribute("data-jdc-video"),
          shell.getAttribute("data-native-video-config"),
          shell.getAttribute("data-video-config")
        ].filter(Boolean).join(" ");
        return config.indexOf(TARGET_ID) !== -1;
      }) || shells[0] || null;
    }

    function seekToStart(video) {
      if (!video || video.readyState < 1 || !Number.isFinite(video.duration) || video.duration <= START_AT) return false;
      if (!video.__jdcKombilesaInitialSeek74 && video.currentTime < START_AT - 0.08) {
        try {
          video.currentTime = START_AT;
        } catch (_error) {
          return false;
        }
      }
      video.__jdcKombilesaInitialSeek74 = true;
      return true;
    }

    function restartAtFive(video) {
      if (!video || !seekToStart(video)) return;
      try {
        video.currentTime = START_AT;
      } catch (_error) {
        return;
      }
      var promise = video.play();
      if (promise && typeof promise.catch === "function") promise.catch(function () {});
    }

    function prepare() {
      var shell = targetShell();
      if (!shell) return;

      shell.setAttribute("data-jdc-kombilesa-start", String(START_AT));
      shell.setAttribute("data-jdc-kombilesa-start-source", TARGET_ID);
      shell.style.setProperty("--jdc-poster", "url(\"" + posterUrl.replace(/\"/g, "%22") + "\")");

      var video = shell.querySelector("video");
      if (!video) return;
      video.poster = posterUrl;
      video.loop = false;
      video.removeAttribute("loop");

      if (preparedVideos.has(video)) {
        seekToStart(video);
        return;
      }
      preparedVideos.add(video);
      video.setAttribute("data-jdc-loop-start", String(START_AT));
      video.addEventListener("loadedmetadata", function () { seekToStart(video); });
      video.addEventListener("durationchange", function () { seekToStart(video); });
      video.addEventListener("canplay", function () { seekToStart(video); });
      video.addEventListener("ended", function () { restartAtFive(video); });
      seekToStart(video);
    }

    function bootKombilesaStart() {
      root = document.documentElement;
      if (!root || root.__jdcKombilesaStartObserver74) return !!root;
      root.__jdcKombilesaStartObserver74 = true;
      root.setAttribute("data-jdc-kombilesa-start74", "true");
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", prepare, { once: true });
      } else {
        prepare();
      }
      new MutationObserver(function () {
        window.requestAnimationFrame(prepare);
      }).observe(root, { childList: true, subtree: true });
      window.addEventListener("load", prepare, { once: true });
      [0, 50, 150, 400, 1000, 2500].forEach(function (delay) {
        window.setTimeout(prepare, delay);
      });
      return true;
    }

    if (!bootKombilesaStart()) {
      document.addEventListener("readystatechange", bootKombilesaStart, { once: true });
    }
  }

  function loadRelease() {
    root = document.documentElement;
    var mount = document.head || root;
    if (!mount) {
      document.addEventListener("readystatechange", loadRelease, { once: true });
      return;
    }
    var releaseUrl = new URL("jdc-footer-pilot73.js", pilotScriptUrl).href;
    var script = document.createElement("script");
    script.src = releaseUrl;
    script.async = false;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-jdc-pilot74-release", "kombilesa-five-second-start");
    mount.appendChild(script);
  }

  loadRelease();
})();
