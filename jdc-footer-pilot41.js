(function () {
  "use strict";

  var RELEASE = "pilot41";
  var LEGACY_RELEASE = "pilot38";
  var CORE_URL = "https://cdn.jsdelivr.net/gh/jdc4444/jdc-video-pilot@d76657fe91db4aadcfb9a2d1f344f1fab2d32ce5/jdc-footer-pilot40.js";
  var SCRIPT_URL = document.currentScript && document.currentScript.src ? document.currentScript.src : window.location.href;
  var ASSET_BASE = new URL(".", SCRIPT_URL).href;
  var DATA_URL = new URL("jdc-clip-data-pilot38.js", ASSET_BASE).href;
  var GALLERY_ASPECTS = { "wynn-awakening": 40 / 17 };
  var galleryPaths = new Set([
    "/amber-mark-out-of-this-world",
    "/armando-young-belladonna",
    "/armando-young-prizefighyer",
    "/black-twitter",
    "/bright-eyes-mariana-trench",
    "/celeste-everyday",
    "/day-one",
    "/diamond-terrifier-action-fortress",
    "/ggm-aguita",
    "/kelsey-lu-boys-noize-ride-or-die",
    "/kings-of-tupelo",
    "/kombilesa-mi-los-peinados",
    "/lovb-launch",
    "/mitski-a-pearl",
    "/mtv-vote-early",
    "/nike-jordan",
    "/shaq-hbo",
    "/thom-yorke-last-i-heard",
    "/wynn-awakening"
  ]);
  var states = [];
  var updateQueued = false;
  var installed = false;

  function normalizePath(path) {
    return String(path || "/").replace(/\/+$/, "") || "/";
  }

  function asset(relative) {
    return new URL(relative, ASSET_BASE).href;
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

  function connectionClass() {
    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!connection) return "fast";
    if (connection.saveData || /(^|-)2g$/.test(String(connection.effectiveType || ""))) return "slow";
    if (connection.effectiveType === "3g" || (Number(connection.downlink) > 0 && Number(connection.downlink) < 5)) return "medium";
    return "fast";
  }

  function blockLegacyGallery() {
    if (!galleryPaths.has(normalizePath(window.location.pathname))) return;
    document.documentElement.setAttribute("data-jdc-clip-gallery", LEGACY_RELEASE);
    document.documentElement.setAttribute("data-jdc-clip-gallery-loader", RELEASE);
  }

  function installStyles() {
    if (document.getElementById("jdc-clip-gallery-styles38")) return;
    var style = document.createElement("style");
    style.id = "jdc-clip-gallery-styles38";
    style.textContent = [
      ".jdc-clip-gallery-section{display:block!important;box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;background:#fff!important;color:#000!important;overflow:clip!important}",
      ".jdc-clip-gallery-flow{display:block!important;box-sizing:border-box!important;width:100%!important;max-width:none!important;padding:clamp(30px,4.2vw,58px) 4.2vw clamp(38px,5vw,68px)!important}",
      ".jdc-clip-gallery-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:clamp(18px,2.2vw,34px) clamp(12px,1.55vw,20px)!important;width:100%!important;box-sizing:border-box!important;align-items:start!important}",
      ".jdc-clip-gallery-grid[data-jdc-grid-columns='2']{grid-template-columns:repeat(2,minmax(0,1fr))!important}",
      ".jdc-clip-gallery-grid[data-jdc-clip-count='4']{grid-template-columns:repeat(2,minmax(0,1fr))!important}",
      ".jdc-clip-gallery-grid[data-jdc-clip-count='7']>.jdc-clip-gallery-item:last-child{grid-column:2!important}",
      "@media(max-width:1023px) and (min-width:768px){.jdc-clip-gallery-grid[data-jdc-hide-one-at-two-columns='true']>.jdc-clip-gallery-item[data-jdc-last-added='true']{display:none!important}}",
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
      "@media(max-width:1023px) and (min-width:768px){.jdc-clip-gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.jdc-clip-gallery-grid[data-jdc-clip-count='7']>.jdc-clip-gallery-item:last-child{grid-column:1/-1!important;width:calc(50% - 10px)!important;justify-self:center!important}}",
      "@media(max-width:767px){.jdc-clip-gallery-flow{padding:28px 6vw 38px!important}.jdc-clip-gallery-grid,.jdc-clip-gallery-grid[data-jdc-grid-columns='2'],.jdc-clip-gallery-grid[data-jdc-clip-count='4']{grid-template-columns:minmax(0,1fr)!important;gap:24px!important}.jdc-clip-gallery-grid[data-jdc-clip-count='7']>.jdc-clip-gallery-item:last-child{grid-column:auto!important;width:100%!important;justify-self:stretch!important}.jdc-clip-gallery-host>.jdc-clip-gallery-grid{grid-template-columns:minmax(0,1fr)!important}.jdc-clip-bts-item>.sqs-block{width:var(--jdc-bts-mobile-width,100%)!important}}",
      "@media(prefers-reduced-motion:reduce){.jdc-clip-gallery-item img{transition:none!important}}"
    ].join("");
    (document.head || document.documentElement).appendChild(style);
  }

  function buildClipItem(definition, clip, sourceIndex) {
    var item = document.createElement("div");
    item.className = "jdc-clip-gallery-item";
    item.style.setProperty("--jdc-clip-aspect", String(GALLERY_ASPECTS[definition.slug] || definition.aspect));
    item.setAttribute("data-jdc-clip-index", String(sourceIndex + 1));
    item.setAttribute("data-jdc-source-index", String(sourceIndex));
    if (definition.lastAddedIndex != null && sourceIndex === Number(definition.lastAddedIndex)) {
      item.setAttribute("data-jdc-last-added", "true");
    }
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
    video.loop = true;
    video.preload = "none";
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("aria-hidden", "true");
    item.appendChild(video);

    var state = {
      item: item,
      video: video,
      source: asset("media/user-selected-clip-galleries/" + definition.slug + "/clip-" + String(sourceIndex + 1).padStart(2, "0") + "/gallery.mp4"),
      attached: false,
      active: false,
      failed: false,
      attempts: 0,
      retryTimer: null
    };
    states.push(state);

    video.addEventListener("playing", function () {
      item.setAttribute("data-jdc-clip-playing", "true");
      item.removeAttribute("data-jdc-clip-error");
    });
    video.addEventListener("pause", function () {
      if (!state.active) item.removeAttribute("data-jdc-clip-playing");
    });
    video.addEventListener("canplay", function () {
      if (state.active) video.play().catch(function () {});
    });
    video.addEventListener("error", function () { retryState(state); });
    return item;
  }

  function displayClipEntries(definition) {
    var clips = (definition.clips || []).map(function (clip, sourceIndex) {
      return { clip: clip, sourceIndex: sourceIndex };
    });
    // Three-column desktop galleries must end in a complete row. Even totals
    // use two columns instead; an odd non-multiple drops the newest selection,
    // falling back to the final chronological clip only for legacy data.
    if (clips.length > 3 && clips.length % 3 !== 0 && clips.length % 2 !== 0) {
      var newestIndex = definition.lastAddedIndex != null && Number.isInteger(Number(definition.lastAddedIndex)) ? Number(definition.lastAddedIndex) : clips.length - 1;
      var newestPosition = clips.findIndex(function (entry) { return entry.sourceIndex === newestIndex; });
      clips.splice(newestPosition >= 0 ? newestPosition : clips.length - 1, 1);
    }
    return clips;
  }

  function desktopColumns(count) {
    return count % 3 === 0 ? 3 : 2;
  }

  function attachState(state) {
    if (!state || state.attached || state.failed) return;
    state.attached = true;
    state.attempts += 1;
    state.video.preload = "auto";
    state.video.src = state.source;
    state.video.load();
  }

  function retryState(state) {
    if (!state || state.retryTimer) return;
    state.attached = false;
    try {
      state.video.pause();
      state.video.removeAttribute("src");
      state.video.load();
    } catch (error) {}
    if (state.attempts >= 3) {
      state.failed = true;
      state.item.setAttribute("data-jdc-clip-error", "true");
      return;
    }
    state.retryTimer = window.setTimeout(function () {
      state.retryTimer = null;
      state.item.removeAttribute("data-jdc-clip-error");
      attachState(state);
      if (state.active) state.video.play().catch(function () {});
    }, 1200 * state.attempts);
  }

  function setActive(state, active) {
    if (!state) return;
    state.active = active;
    if (active) {
      attachState(state);
      state.video.play().catch(function () {});
      return;
    }
    try { state.video.pause(); } catch (error) {}
    state.item.removeAttribute("data-jdc-clip-playing");
  }

  function viewportDistance(item) {
    var rect = item.getBoundingClientRect();
    return Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
  }

  function updatePlayback() {
    updateQueued = false;
    if (!states.length) return;
    if (document.hidden) {
      states.forEach(function (state) { setActive(state, false); });
      document.documentElement.setAttribute("data-jdc-clip-gallery-attached", String(states.filter(function (state) { return state.attached; }).length));
      document.documentElement.setAttribute("data-jdc-clip-gallery-playing", "0");
      return;
    }
    var connection = connectionClass();
    var maxPlaying = connection === "slow" ? 1 :
      connection === "medium" ? (window.innerWidth >= 900 ? 3 : 2) :
      states.length;
    var warmCount = connection === "slow" ? 2 : connection === "medium" ? 4 : states.length;
    var warmMargin = connection === "slow" ? 350 : connection === "medium" ? 500 : Math.max(900, window.innerHeight * 1.5);
    var nearby = states.filter(function (state) {
      var rect = state.item.getBoundingClientRect();
      return rect.bottom > -warmMargin && rect.top < window.innerHeight + warmMargin;
    }).sort(function (a, b) { return viewportDistance(a.item) - viewportDistance(b.item); });

    nearby.slice(0, warmCount).forEach(attachState);
    var visible = nearby.filter(function (state) {
      var rect = state.item.getBoundingClientRect();
      return rect.bottom > -80 && rect.top < window.innerHeight + 120;
    }).sort(function (a, b) {
      return a.item.getBoundingClientRect().top - b.item.getBoundingClientRect().top;
    });
    var playbackOrder = visible.concat(nearby.filter(function (state) { return visible.indexOf(state) === -1; }));
    var desired = new Set(playbackOrder.slice(0, maxPlaying));
    states.forEach(function (state) { setActive(state, desired.has(state)); });
    document.documentElement.setAttribute("data-jdc-clip-gallery-attached", String(states.filter(function (state) { return state.attached; }).length));
    document.documentElement.setAttribute("data-jdc-clip-gallery-playing", String(states.filter(function (state) { return state.active; }).length));
  }

  function schedulePlaybackUpdate() {
    if (updateQueued) return;
    updateQueued = true;
    window.requestAnimationFrame(updatePlayback);
  }

  function normalizeBts(definition, btsItem) {
    if (!btsItem) return;
    var portrait = Number(definition.btsAspect) < 1;
    var blockWidth = portrait ? "min(420px,88vw)" : "100%";
    btsItem.style.setProperty("--jdc-bts-aspect", String(definition.btsAspect || 16 / 9));
    btsItem.style.setProperty("--jdc-bts-width", blockWidth);
    btsItem.style.setProperty("--jdc-bts-mobile-width", blockWidth);
    var block = btsItem.querySelector(":scope > .sqs-block");
    var shell = btsItem.querySelector("[data-jdc-video], [data-config-video]");
    if (block) {
      block.style.setProperty("position", "relative", "important");
      block.style.setProperty("inset", "auto", "important");
      block.style.setProperty("width", blockWidth, "important");
      block.style.setProperty("height", "auto", "important");
      block.style.setProperty("min-height", "0", "important");
      block.style.setProperty("transform", "none", "important");
    }
    if (shell) {
      shell.style.setProperty("--jdc-video-aspect", String(definition.btsAspect || 16 / 9));
      shell.style.setProperty("aspect-ratio", String(definition.btsAspect || 16 / 9), "important");
      shell.style.setProperty("height", "auto", "important");
      shell.style.setProperty("min-height", "0", "important");
    }
  }

  function buildSection(definition, items) {
    var lead = shellById(definition.sourceId) || document.querySelector("[data-jdc-video], [data-config-video]");
    var projectSection = lead && lead.closest(".page-section, section");
    if (!projectSection || !projectSection.parentNode) return false;

    var section = document.createElement("section");
    section.className = "jdc-clip-gallery-section page-section";
    section.setAttribute("data-jdc-gallery-slug", definition.slug);
    section.setAttribute("data-jdc-gallery-delivery", RELEASE + "-progressive-mp4");
    var flow = document.createElement("div");
    flow.className = "jdc-clip-gallery-flow";
    var grid = document.createElement("div");
    grid.className = "jdc-clip-gallery-grid";
    grid.setAttribute("data-jdc-clip-count", String(items.length));
    grid.setAttribute("data-jdc-grid-columns", String(desktopColumns(items.length)));
    if (items.length % 2 !== 0 && items.some(function (item) { return item.getAttribute("data-jdc-last-added") === "true"; })) {
      grid.setAttribute("data-jdc-hide-one-at-two-columns", "true");
    }

    if (definition.btsId) {
      var btsShell = shellById(definition.btsId);
      var host = btsShell && btsShell.closest(".fe-block");
      var nativeBlock = btsShell && btsShell.closest(".sqs-block");
      if (!host || !nativeBlock) return false;
      items.forEach(function (item) { grid.appendChild(item); });
      var btsItem = document.createElement("div");
      btsItem.className = "jdc-clip-bts-item";
      btsItem.setAttribute("data-jdc-bts-id", definition.btsId);
      btsItem.appendChild(nativeBlock);
      grid.appendChild(btsItem);
      host.remove();
      normalizeBts(definition, btsItem);
    } else {
      items.forEach(function (item) { grid.appendChild(item); });
    }

    flow.appendChild(grid);
    section.appendChild(flow);
    projectSection.parentNode.insertBefore(section, projectSection.nextSibling);
    return true;
  }

  function installGallery() {
    var data = window.JDC_CLIP_GALLERIES_PILOT38 || {};
    var path = normalizePath(window.location.pathname);
    var definition = data[path];
    if (!definition) return false;
    var existing = document.querySelector(".jdc-clip-gallery-section[data-jdc-gallery-slug='" + definition.slug + "']");
    if (existing) {
      installed = true;
      return existing.getAttribute("data-jdc-gallery-delivery") === RELEASE + "-progressive-mp4";
    }
    if (installed || states.length) {
      states.forEach(function (state) {
        if (state.retryTimer) window.clearTimeout(state.retryTimer);
        try { state.video.pause(); } catch (error) {}
      });
      states.length = 0;
      installed = false;
    }
    installStyles();
    var before = states.length;
    var entries = displayClipEntries(definition);
    var items = entries.map(function (entry) { return buildClipItem(definition, entry.clip, entry.sourceIndex); });
    if (Array.isArray(definition.displaySwapIndices) && definition.displaySwapIndices.length === 2) {
      var firstPosition = items.findIndex(function (item) { return Number(item.getAttribute("data-jdc-source-index")) === Number(definition.displaySwapIndices[0]); });
      var secondPosition = items.findIndex(function (item) { return Number(item.getAttribute("data-jdc-source-index")) === Number(definition.displaySwapIndices[1]); });
      if (firstPosition >= 0 && secondPosition >= 0) {
        var swappedItem = items[firstPosition];
        items[firstPosition] = items[secondPosition];
        items[secondPosition] = swappedItem;
      }
    }
    if (!buildSection(definition, items)) {
      states.splice(before, items.length);
      return false;
    }
    installed = true;
    document.documentElement.setAttribute("data-jdc-clip-gallery", RELEASE);
    document.documentElement.setAttribute("data-jdc-clip-gallery-slug", definition.slug);
    document.documentElement.setAttribute("data-jdc-clip-gallery-count", String(items.length));
    document.documentElement.setAttribute("data-jdc-clip-gallery-source-count", String(definition.clips.length));
    document.documentElement.setAttribute("data-jdc-clip-gallery-delivery", "progressive-mp4");
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
    if (document.querySelector('script[data-jdc-pilot41-core="pilot40"]')) return;
    if (document.querySelector('script[data-jdc-pilot40-core="pilot39"]')) return;
    var core = document.createElement("script");
    core.src = CORE_URL;
    core.async = false;
    core.crossOrigin = "anonymous";
    core.setAttribute("data-jdc-pilot41-core", "pilot40");
    (document.head || document.documentElement).appendChild(core);
  }

  function finish() {
    if (!galleryPaths.has(normalizePath(window.location.pathname))) {
      loadCore();
      return;
    }
    loadData().then(function () {
      installGallery();
      loadCore();
      [120, 400, 1000, 2500, 5000, 7500].forEach(function (delay) {
        window.setTimeout(function () {
          installGallery();
          schedulePlaybackUpdate();
          if (document.body) document.body.setAttribute("data-jdc-footer-release", RELEASE);
        }, delay);
      });
    }).catch(function (error) {
      loadCore();
      console.warn("JDC progressive clip data failed to load", error);
    });
  }

  blockLegacyGallery();
  window.addEventListener("scroll", schedulePlaybackUpdate, { passive: true });
  window.addEventListener("resize", schedulePlaybackUpdate, { passive: true });
  window.addEventListener("pageshow", schedulePlaybackUpdate, { passive: true });
  document.addEventListener("visibilitychange", schedulePlaybackUpdate, { passive: true });
  finish();
  window.__JDC_CLIP_GALLERY_PILOT41__ = { states: states, update: updatePlayback };
})();
