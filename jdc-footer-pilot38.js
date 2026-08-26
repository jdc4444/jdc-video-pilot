(function () {
  "use strict";

  var RELEASE = "pilot38";
  var CORE_URL = "https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@b3a2c442b6a2510f964d138b0ef73e29183abbac/jdc-footer-pilot36.js";
  var HLS_JS_URL = "https://cdn.jsdelivr.net/npm/hls.js@1.7.1/dist/hls.min.js";
  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : window.location.href;
  var ASSET_BASE = new URL(".", SCRIPT_URL).href;
  var DATA_URL = new URL("jdc-clip-data-pilot38.js", ASSET_BASE).href;
  var states = [];
  var updateQueued = false;
  var hlsPromise = null;

  function normalizePath(path) {
    return String(path || "/").replace(/\/+$/, "") || "/";
  }

  function parseVideoConfig(shell) {
    try { return JSON.parse(shell.getAttribute("data-jdc-video") || shell.getAttribute("data-config-video") || "{}"); }
    catch (error) { return null; }
  }

  function shellById(id) {
    if (!id) return null;
    return Array.prototype.slice.call(document.querySelectorAll("[data-jdc-video], [data-config-video]")).find(function (shell) {
      var config = parseVideoConfig(shell);
      return config && config.systemDataId === id;
    }) || null;
  }

  function asset(relative) {
    return new URL(relative, ASSET_BASE).href;
  }

  function connectionIsConservative() {
    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return !!(connection && (connection.saveData || /(^|-)2g$/.test(String(connection.effectiveType || ""))));
  }

  function ensureHls() {
    if (window.Hls) return Promise.resolve(window.Hls);
    if (hlsPromise) return hlsPromise;
    hlsPromise = new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = HLS_JS_URL;
      script.async = true;
      script.onload = function () { window.Hls ? resolve(window.Hls) : reject(new Error("hls.js did not initialize")); };
      script.onerror = function () { reject(new Error("hls.js failed to load")); };
      (document.head || document.documentElement).appendChild(script);
    });
    return hlsPromise;
  }

  function installStyles() {
    if (document.getElementById("jdc-clip-gallery-styles38")) return;
    var style = document.createElement("style");
    style.id = "jdc-clip-gallery-styles38";
    style.textContent = [
      ".jdc-clip-gallery-section{display:block!important;box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;background:#fff!important;color:#000!important;overflow:clip!important}",
      ".jdc-clip-gallery-flow{display:block!important;box-sizing:border-box!important;width:100%!important;max-width:none!important;padding:clamp(30px,4.2vw,58px) 4.2vw clamp(38px,5vw,68px)!important}",
      ".jdc-clip-gallery-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:clamp(18px,2.2vw,34px) clamp(12px,1.55vw,20px)!important;width:100%!important;box-sizing:border-box!important;align-items:start!important}",
      ".jdc-clip-gallery-item{position:relative!important;inset:auto!important;display:block!important;box-sizing:border-box!important;width:100%!important;min-width:0!important;height:auto!important;min-height:0!important;aspect-ratio:var(--jdc-clip-aspect,16/9)!important;overflow:hidden!important;background:#080808!important;transform:none!important;translate:none!important}",
      ".jdc-clip-gallery-item img,.jdc-clip-gallery-item video{position:absolute!important;inset:0!important;display:block!important;width:100%!important;height:100%!important;max-width:none!important;object-fit:cover!important;object-position:center!important;margin:0!important;padding:0!important;border:0!important}",
      ".jdc-clip-gallery-item img{z-index:1!important;opacity:1!important;transition:opacity .18s linear!important}",
      ".jdc-clip-gallery-item video{z-index:2!important;opacity:0!important;background:transparent!important}",
      ".jdc-clip-gallery-item[data-jdc-clip-playing='true'] video{opacity:1!important}",
      ".jdc-clip-gallery-item[data-jdc-clip-playing='true'] img{opacity:0!important}",
      ".jdc-clip-gallery-item[data-jdc-clip-error='true'] video{display:none!important}",
      ".jdc-clip-gallery-host{position:relative!important;inset:auto!important;align-self:start!important;height:auto!important;min-height:0!important;aspect-ratio:auto!important;transform:none!important;translate:none!important;overflow:visible!important}",
      ".jdc-clip-gallery-host>.jdc-clip-gallery-grid{position:relative!important;width:100%!important;height:auto!important;min-height:0!important}",
      ".jdc-clip-bts-item{position:relative!important;inset:auto!important;grid-column:1/-1!important;display:flex!important;justify-content:center!important;align-items:flex-start!important;box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:auto!important;overflow:visible!important;background:transparent!important}",
      ".jdc-clip-bts-item>.sqs-block{position:relative!important;inset:auto!important;box-sizing:border-box!important;width:var(--jdc-bts-width,100%)!important;height:auto!important;min-height:0!important;margin:0!important;padding:0!important;transform:none!important;translate:none!important}",
      ".jdc-clip-bts-item [data-jdc-video],.jdc-clip-bts-item [data-config-video]{position:relative!important;inset:auto!important;display:block!important;width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:var(--jdc-bts-aspect,16/9)!important;background-position:center!important;background-size:cover!important;overflow:hidden!important}",
      ".jdc-clip-bts-item .native-video-player,.jdc-clip-bts-item .jdc-video-stage,.jdc-clip-bts-item video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;aspect-ratio:var(--jdc-bts-aspect,16/9)!important;object-fit:cover!important}",
      "@media(max-width:1023px) and (min-width:768px){.jdc-clip-gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}",
      "@media(max-width:767px){.jdc-clip-gallery-flow{padding:28px 6vw 38px!important}.jdc-clip-gallery-grid{grid-template-columns:minmax(0,1fr)!important;gap:24px!important}.jdc-clip-gallery-host>.jdc-clip-gallery-grid{grid-template-columns:minmax(0,1fr)!important}.jdc-clip-bts-item>.sqs-block{width:var(--jdc-bts-mobile-width,100%)!important}}",
      "@media(prefers-reduced-motion:reduce){.jdc-clip-gallery-item img{transition:none!important}}"
    ].join("");
    (document.head || document.documentElement).appendChild(style);
  }

  function buildClipItem(definition, clip, index) {
    var item = document.createElement("div");
    item.className = "jdc-clip-gallery-item";
    item.style.setProperty("--jdc-clip-aspect", String(definition.aspect));
    item.setAttribute("data-jdc-clip-index", String(index + 1));
    item.setAttribute("data-jdc-clip-range", (clip[3] == null ? clip[0] : clip[3]) + "-" + (clip[4] == null ? clip[1] : clip[4]));

    var poster = document.createElement("img");
    poster.src = asset("media/user-selected-clip-galleries/" + definition.slug + "/" + clip[2]);
    poster.alt = "";
    poster.decoding = "async";
    item.appendChild(poster);

    var video = document.createElement("video");
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = false;
    video.preload = "none";
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("aria-hidden", "true");
    item.appendChild(video);

    var source = asset(
      "media/user-selected-clip-galleries/" + definition.slug + "/clip-" + String(index + 1).padStart(2, "0") + "/master.m3u8"
    );
    var state = {
      item: item,
      video: video,
      start: Number(clip[0]),
      end: Number(clip[1]),
      source: source,
      hls: null,
      active: false,
      loading: false,
      positioned: false,
      retryAt: 0
    };
    states.push(state);

    video.addEventListener("playing", function () {
      item.setAttribute("data-jdc-clip-playing", "true");
      item.removeAttribute("data-jdc-clip-error");
    });
    video.addEventListener("pause", function () {
      if (!state.active) item.removeAttribute("data-jdc-clip-playing");
    });
    video.addEventListener("timeupdate", function () {
      if (!state.active || !Number.isFinite(video.currentTime)) return;
      if (video.currentTime >= state.end - 0.045 || video.currentTime < state.start - 0.25) {
        video.currentTime = state.start;
        video.play().catch(function () {});
      }
    });
    video.addEventListener("error", function () { failState(state); });
    return item;
  }

  function positionAndPlay(state) {
    if (!state.active || state.positioned) return;
    if (!Number.isFinite(state.video.duration) && state.video.readyState < 1) return;
    state.positioned = true;
    var playAfterSeek = function () {
      if (!state.active) return;
      state.video.play().catch(function () {});
    };
    try {
      state.video.currentTime = state.start;
      state.video.addEventListener("seeked", playAfterSeek, { once: true });
      window.setTimeout(playAfterSeek, 500);
    } catch (error) {
      state.positioned = false;
    }
  }

  function failState(state) {
    if (!state) return;
    state.loading = false;
    state.retryAt = Date.now() + 3500;
    state.item.setAttribute("data-jdc-clip-error", "true");
    deactivate(state, true);
  }

  function activate(state) {
    if (!state || state.active || state.loading || Date.now() < state.retryAt) return;
    state.active = true;
    state.loading = true;
    state.positioned = false;
    state.item.removeAttribute("data-jdc-clip-error");
    state.video.preload = "auto";
    state.video.addEventListener("loadedmetadata", function () { positionAndPlay(state); }, { once: true });

    var nativeAppleHls = navigator.vendor === "Apple Computer, Inc." &&
      state.video.canPlayType("application/vnd.apple.mpegurl") &&
      !/(CriOS|FxiOS|EdgiOS)/.test(navigator.userAgent);
    if (nativeAppleHls) {
      state.video.src = state.source;
      state.loading = false;
      state.video.load();
      return;
    }

    ensureHls().then(function (Hls) {
      if (!state.active) return;
      if (!Hls.isSupported()) throw new Error("HLS playback is not supported");
      var conservative = connectionIsConservative();
      var hls = new Hls({
        startLevel: conservative ? 0 : -1,
        startFragPrefetch: true,
        capLevelToPlayerSize: true,
        capLevelOnFPSDrop: true,
        maxBufferLength: conservative ? 6 : 10,
        maxMaxBufferLength: conservative ? 10 : 18,
        backBufferLength: 0
      });
      state.hls = hls;
      hls.attachMedia(state.video);
      hls.on(Hls.Events.MEDIA_ATTACHED, function () { hls.loadSource(state.source); });
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        state.loading = false;
        positionAndPlay(state);
      });
      hls.on(Hls.Events.ERROR, function (_event, data) {
        if (data && data.fatal) failState(state);
      });
    }).catch(function () { failState(state); });
  }

  function deactivate(state, preserveError) {
    if (!state) return;
    state.active = false;
    state.loading = false;
    state.positioned = false;
    try { state.video.pause(); } catch (error) {}
    if (state.hls) {
      try { state.hls.destroy(); } catch (error) {}
      state.hls = null;
    }
    try {
      state.video.removeAttribute("src");
      state.video.load();
    } catch (error) {}
    state.item.removeAttribute("data-jdc-clip-playing");
    if (!preserveError) state.item.removeAttribute("data-jdc-clip-error");
  }

  function viewportDistance(item) {
    var rect = item.getBoundingClientRect();
    var center = rect.top + rect.height / 2;
    var viewportCenter = window.innerHeight / 2;
    return Math.abs(center - viewportCenter);
  }

  function updatePlayback() {
    updateQueued = false;
    if (!states.length) return;
    var conservative = connectionIsConservative();
    var maxActive = conservative ? 1 : window.innerWidth >= 900 ? 3 : 2;
    var margin = conservative ? 500 : Math.max(850, window.innerHeight * 1.25);
    var eligible = states.filter(function (state) {
      var rect = state.item.getBoundingClientRect();
      return rect.bottom > -margin && rect.top < window.innerHeight + margin;
    }).sort(function (a, b) { return viewportDistance(a.item) - viewportDistance(b.item); });
    var desired = new Set(eligible.slice(0, maxActive));
    states.forEach(function (state) {
      if (desired.has(state)) activate(state);
      else if (state.active || state.loading) deactivate(state, false);
    });
  }

  function schedulePlaybackUpdate() {
    if (updateQueued) return;
    updateQueued = true;
    window.requestAnimationFrame(updatePlayback);
  }

  function insertStandaloneGallery(definition, items) {
    var lead = shellById(definition.sourceId) || document.querySelector("[data-jdc-video], [data-config-video]");
    var projectSection = lead && lead.closest(".page-section, section");
    if (!projectSection || document.querySelector(".jdc-clip-gallery-section[data-jdc-gallery-slug='" + definition.slug + "']")) return false;
    var section = document.createElement("section");
    section.className = "jdc-clip-gallery-section page-section";
    section.setAttribute("data-jdc-gallery-slug", definition.slug);
    var flow = document.createElement("div");
    flow.className = "jdc-clip-gallery-flow";
    var grid = document.createElement("div");
    grid.className = "jdc-clip-gallery-grid";
    items.forEach(function (item) { grid.appendChild(item); });
    flow.appendChild(grid);
    section.appendChild(flow);
    projectSection.parentNode.insertBefore(section, projectSection.nextSibling);
    return true;
  }

  function normalizeBts(definition, btsItem) {
    if (!btsItem) return;
    var portrait = Number(definition.btsAspect) < 1;
    var blockWidth = portrait ? "min(420px,88vw)" : "100%";
    btsItem.style.setProperty("--jdc-bts-aspect", String(definition.btsAspect || 16 / 9));
    btsItem.style.setProperty("--jdc-bts-width", blockWidth);
    btsItem.style.setProperty("--jdc-bts-mobile-width", blockWidth);
    var nativeBlock = btsItem.querySelector(".sqs-block");
    if (nativeBlock) {
      nativeBlock.style.setProperty("position", "relative", "important");
      nativeBlock.style.setProperty("inset", "auto", "important");
      nativeBlock.style.setProperty("width", blockWidth, "important");
      nativeBlock.style.setProperty("height", "auto", "important");
      nativeBlock.style.setProperty("min-height", "0", "important");
      nativeBlock.style.setProperty("transform", "none", "important");
    }
    var shell = btsItem.querySelector("[data-jdc-video], [data-config-video]");
    if (shell) {
      shell.style.setProperty("--jdc-video-aspect", String(definition.btsAspect || 16 / 9));
      shell.style.setProperty("aspect-ratio", String(definition.btsAspect || 16 / 9), "important");
      shell.style.setProperty("height", "auto", "important");
      shell.style.setProperty("min-height", "0", "important");
    }
  }

  function integrateBtsGallery(definition, items) {
    var btsShell = shellById(definition.btsId);
    var host = btsShell && btsShell.closest(".fe-block");
    var nativeBlock = btsShell && btsShell.closest(".sqs-block");
    var lead = shellById(definition.sourceId) || document.querySelector("[data-jdc-video], [data-config-video]");
    var projectSection = lead && lead.closest(".page-section, section");
    if (!host || !nativeBlock || !projectSection) return false;
    if (document.querySelector(".jdc-clip-gallery-section[data-jdc-gallery-slug='" + definition.slug + "']")) return true;

    var section = document.createElement("section");
    section.className = "jdc-clip-gallery-section page-section";
    section.setAttribute("data-jdc-gallery-slug", definition.slug);
    var flow = document.createElement("div");
    flow.className = "jdc-clip-gallery-flow";
    var grid = document.createElement("div");
    grid.className = "jdc-clip-gallery-grid";
    items.slice(0, 3).forEach(function (item) { grid.appendChild(item); });
    var btsItem = document.createElement("div");
    btsItem.className = "jdc-clip-bts-item";
    btsItem.setAttribute("data-jdc-bts-id", definition.btsId);
    btsItem.appendChild(nativeBlock);
    grid.appendChild(btsItem);
    items.slice(3).forEach(function (item) { grid.appendChild(item); });
    flow.appendChild(grid);
    section.appendChild(flow);
    projectSection.parentNode.insertBefore(section, projectSection.nextSibling);
    host.style.setProperty("display", "none", "important");
    host.setAttribute("data-jdc-bts-relocated", RELEASE);
    normalizeBts(definition, btsItem);
    return true;
  }

  function installGallery() {
    var data = window.JDC_CLIP_GALLERIES_PILOT38 || {};
    var definition = data[normalizePath(window.location.pathname)];
    if (!definition || document.documentElement.getAttribute("data-jdc-clip-gallery") === RELEASE) return false;
    installStyles();
    var items = definition.clips.map(function (clip, index) { return buildClipItem(definition, clip, index); });
    var installed = definition.btsId ? integrateBtsGallery(definition, items) : insertStandaloneGallery(definition, items);
    if (!installed) {
      states.splice(Math.max(0, states.length - items.length), items.length);
      return false;
    }
    document.documentElement.setAttribute("data-jdc-clip-gallery", RELEASE);
    document.documentElement.setAttribute("data-jdc-clip-gallery-slug", definition.slug);
    document.documentElement.setAttribute("data-jdc-clip-gallery-count", String(definition.clips.length));
    schedulePlaybackUpdate();
    return true;
  }

  function loadData() {
    if (window.JDC_CLIP_GALLERIES_PILOT38) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-jdc-clip-data="pilot38"]');
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      var script = document.createElement("script");
      script.src = DATA_URL;
      script.async = false;
      script.setAttribute("data-jdc-clip-data", "pilot38");
      script.onload = resolve;
      script.onerror = reject;
      (document.head || document.documentElement).appendChild(script);
    });
  }

  function loadCore() {
    if (document.querySelector('script[data-jdc-pilot38-core="pilot36"]')) return;
    if (document.querySelector('script[data-jdc-pilot36-core="pilot35"]')) return;
    var core = document.createElement("script");
    core.src = CORE_URL;
    core.async = false;
    core.crossOrigin = "anonymous";
    core.setAttribute("data-jdc-pilot38-core", "pilot36");
    (document.head || document.documentElement).appendChild(core);
  }

  function finish() {
    loadData().then(function () {
      [0, 120, 400, 1000, 2500, 5000].forEach(function (delay) {
        window.setTimeout(function () {
          installGallery();
          var data = window.JDC_CLIP_GALLERIES_PILOT38 || {};
          var definition = data[normalizePath(window.location.pathname)];
          if (definition && definition.btsId) {
            var bts = document.querySelector(".jdc-clip-bts-item");
            normalizeBts(definition, bts);
          }
          if (document.body) document.body.setAttribute("data-jdc-footer-release", RELEASE);
        }, delay);
      });
    }).catch(function (error) { console.warn("JDC clip data failed to load", error); });
  }

  window.addEventListener("scroll", schedulePlaybackUpdate, { passive: true });
  window.addEventListener("resize", schedulePlaybackUpdate, { passive: true });
  window.addEventListener("pageshow", schedulePlaybackUpdate, { passive: true });
  loadCore();
  finish();
})();
