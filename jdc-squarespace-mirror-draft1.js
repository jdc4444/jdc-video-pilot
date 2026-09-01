(function () {
  "use strict";

  if (window.__JDC_SQUARESPACE_MIRROR_DRAFT1__) return;
  window.__JDC_SQUARESPACE_MIRROR_DRAFT1__ = true;

  var DATA = window.JDC_SQUARESPACE_MIRROR_DRAFT;
  if (!DATA || !Array.isArray(DATA.projects)) return;
  var RELEASE = DATA.release || "squarespace-mirror-draft1";
  var path = String(window.location.pathname || "/").replace(/\/+$/, "") || "/";
  var projectsByRoute = DATA.projects.reduce(function (lookup, project) {
    lookup[project.route] = project;
    return lookup;
  }, {});
  var hiddenCollectionRoutes = new Set([
    "/maybelline-gigi-whip-it-up",
    "/maybelline-loaded-bolds"
  ]);
  var onepageProjects = DATA.projects.filter(function (project) {
    return !hiddenCollectionRoutes.has(project.route);
  });
  var homepageProjects = onepageProjects.filter(function (project) {
    return project.homepageVisible !== false;
  });
  var activeSoundVideo = null;
  var activeSoundFrame = null;
  var creativeRoleOverrides = new Set([
    "/new-york-lottery-loteria",
    "/mtv-vote-early",
    "/laufey-tour-visuals",
    "/diamond-terrifier-action-fortress",
    "/spotify-hip-hop-classics-1",
    "/polymarket-make-your-own-market",
    "/basis",
    "/maybelline-superstay",
    "/maybelline-loaded-bolds"
  ]);

  function el(name, className, text) {
    var node = document.createElement(name);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function append(parent) {
    Array.prototype.slice.call(arguments, 1).forEach(function (child) {
      if (child) parent.appendChild(child);
    });
    return parent;
  }

  function splitTitle(title) {
    var value = String(title || "");
    if (value === "Thom Yorke — Last I Heard (…He Was Circling the Drain)") {
      value = "Thom Yorke — Last I Heard...";
    }
    var marker = " — ";
    var markerIndex = value.indexOf(marker);
    if (markerIndex < 0) return document.createTextNode(value);
    var fragment = document.createDocumentFragment();
    fragment.appendChild(document.createTextNode(value.slice(0, markerIndex)));
    fragment.appendChild(document.createElement("br"));
    fragment.appendChild(document.createTextNode(value.slice(markerIndex + marker.length)));
    return fragment;
  }

  function previewTitle(title) {
    var value = String(title || "");
    if (value === "Thom Yorke — Last I Heard (…He Was Circling the Drain)") {
      value = "Thom Yorke — Last I Heard...";
    }
    var marker = " — ";
    var markerIndex = value.indexOf(marker);
    if (markerIndex >= 0) value = value.slice(markerIndex + marker.length);
    return value.trim().toLocaleUpperCase();
  }

  function isJos(name) {
    return /\bjos(?:e|é)?\s+diaz\s+contreras\b/i.test(String(name || ""));
  }

  function hasJosRole(project, roleTest) {
    return (project.credits || []).some(function (pair) {
      return isJos(pair[1]) && roleTest(String(pair[0] || ""));
    });
  }

  function matchesRoleFilter(project, filter) {
    if (filter === "all") return true;
    if (filter === "director") {
      return !creativeRoleOverrides.has(project.route) &&
        hasJosRole(project, function (role) { return role.trim().toLowerCase() === "director"; });
    }
    if (filter === "producer") {
      return hasJosRole(project, function (role) { return /producer/i.test(role); });
    }
    if (filter === "editor") {
      return hasJosRole(project, function (role) { return /editor|editing/i.test(role); });
    }
    if (filter === "creative") {
      return creativeRoleOverrides.has(project.route) || hasJosRole(project, function (role) {
        return /(?:creative|art|graphics).*director|director.*(?:creative|art|graphics)/i.test(role);
      });
    }
    return true;
  }

  function mediaUrl(value) {
    if (!value) return "";
    if (/^(?:https?:)?\/\//i.test(value) || /^data:/i.test(value)) return value;
    return new URL(value, window.location.origin).href;
  }

  function setVolume(video, target, duration) {
    if (activeSoundFrame) window.cancelAnimationFrame(activeSoundFrame);
    var started = performance.now();
    var initial = Number(video.volume || 0);
    function frame(now) {
      var progress = Math.min(1, (now - started) / duration);
      video.volume = initial + (target - initial) * progress;
      if (progress < 1) activeSoundFrame = window.requestAnimationFrame(frame);
      else activeSoundFrame = null;
    }
    activeSoundFrame = window.requestAnimationFrame(frame);
  }

  function quietVideo(video, immediate) {
    if (!video) return;
    if (immediate) {
      video.volume = 0;
      video.muted = true;
      return;
    }
    setVolume(video, 0, 220);
    window.setTimeout(function () {
      if (video !== activeSoundVideo) video.muted = true;
    }, 240);
  }

  function activateSound(video) {
    if (!video || video.getAttribute("data-jdc-has-audio") === "false") return;
    if (activeSoundVideo && activeSoundVideo !== video) quietVideo(activeSoundVideo, false);
    activeSoundVideo = video;
    video.muted = false;
    video.volume = 0;
    var attempt = video.play();
    if (attempt && attempt.catch) attempt.catch(function () {});
    setVolume(video, 0.82, 260);
  }

  function releaseSound(video) {
    if (activeSoundVideo !== video) return;
    activeSoundVideo = null;
    quietVideo(video, false);
  }

  function makeVideo(record, options) {
    var settings = options || {};
    var video = document.createElement("video");
    var source = mediaUrl(record.src);
    var poster = mediaUrl(record.poster);
    if (source && settings.deferSource) video.setAttribute("data-jdc-deferred-src", source);
    else if (source) video.src = source;
    if (poster) video.poster = poster;
    video.playsInline = true;
    video.preload = settings.preload || "metadata";
    video.muted = settings.muted !== false;
    video.defaultMuted = video.muted;
    video.loop = settings.loop === true;
    video.autoplay = settings.autoplay === true;
    video.controls = settings.controls === true;
    video.setAttribute("playsinline", "");
    video.setAttribute("data-jdc-has-audio", record.hasAudio === false ? "false" : "true");
    if (video.muted) video.setAttribute("muted", "");
    if (settings.hoverSound) {
      video.addEventListener("pointerenter", function () { activateSound(video); });
      video.addEventListener("pointerleave", function () { releaseSound(video); });
      video.addEventListener("focus", function () { activateSound(video); });
      video.addEventListener("blur", function () { releaseSound(video); });
    }
    return video;
  }

  function installPlayerControls(frame, video, label) {
    if (!frame || !video || frame.querySelector(".jdc-video-controls")) return;
    frame.classList.add("jdc-mirror-player", "jdc-video-shell", "jdc-video-block", "jdc-video-ready");
    video.controls = false;
    video.removeAttribute("controls");

    var controls = el("div", "jdc-video-controls");
    controls.setAttribute("role", "group");
    controls.setAttribute("aria-label", (label || "Video") + " controls");
    var playButton = el("button", "", "Play");
    playButton.type = "button";
    playButton.setAttribute("data-jdc-play", "");
    playButton.setAttribute("aria-label", "Play " + (label || "video"));
    var progress = el("div", "jdc-video-progress");
    progress.setAttribute("role", "slider");
    progress.setAttribute("tabindex", "0");
    progress.setAttribute("aria-label", (label || "Video") + " playback position");
    progress.setAttribute("aria-valuemin", "0");
    progress.setAttribute("aria-valuemax", "100");
    progress.setAttribute("aria-valuenow", "0");
    progress.appendChild(el("span"));
    var muteButton = el("button", "", "Sound");
    muteButton.type = "button";
    muteButton.setAttribute("data-jdc-mute", "");
    muteButton.setAttribute("aria-label", "Turn on sound for " + (label || "video"));
    append(controls, playButton, progress, muteButton);
    frame.appendChild(controls);

    function updatePlayer() {
      var playing = !video.paused && !video.ended;
      frame.classList.toggle("jdc-video-playing", playing);
      playButton.textContent = playing ? "Pause" : "Play";
      playButton.setAttribute("aria-label", (playing ? "Pause " : "Play ") + (label || "video"));
      muteButton.textContent = video.muted ? "Sound" : "Mute";
      muteButton.setAttribute("aria-label", (video.muted ? "Turn on sound for " : "Mute ") + (label || "video"));
      var ratio = Number.isFinite(video.duration) && video.duration > 0
        ? Math.min(1, Math.max(0, video.currentTime / video.duration))
        : 0;
      progress.firstElementChild.style.width = (ratio * 100) + "%";
      progress.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
    }

    function seekToRatio(ratio) {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      video.currentTime = Math.min(1, Math.max(0, ratio)) * video.duration;
      updatePlayer();
    }

    playButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (video.paused || video.ended) {
        var attempt = video.play();
        if (attempt && attempt.catch) attempt.catch(function () {});
      } else {
        video.pause();
      }
    });
    muteButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (video.muted) activateSound(video);
      else releaseSound(video);
    });
    progress.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var rect = progress.getBoundingClientRect();
      if (!rect.width) return;
      seekToRatio((event.clientX - rect.left) / rect.width);
    });
    progress.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      event.stopPropagation();
      var ratio = Number.isFinite(video.duration) && video.duration > 0 ? video.currentTime / video.duration : 0;
      seekToRatio(ratio + (event.key === "ArrowRight" ? 0.05 : -0.05));
    });
    frame.addEventListener("pointerenter", function () { activateSound(video); });
    frame.addEventListener("pointerleave", function () { releaseSound(video); });
    ["play", "pause", "ended", "volumechange", "timeupdate", "loadedmetadata", "durationchange"].forEach(function (eventName) {
      video.addEventListener(eventName, updatePlayer);
    });
    updatePlayer();
  }

  function observeAutoplay(root) {
    var videos = Array.prototype.slice.call(root.querySelectorAll("video[data-jdc-autoplay='true'],video[data-jdc-deferred-src]"));
    function loadDeferred(video) {
      var deferredSource = video.getAttribute("data-jdc-deferred-src");
      if (!deferredSource) return;
      video.src = deferredSource;
      video.removeAttribute("data-jdc-deferred-src");
      video.load();
    }
    if (!window.IntersectionObserver) {
      videos.slice(0, 2).forEach(function (video) {
        loadDeferred(video);
        if (video.getAttribute("data-jdc-autoplay") !== "true") return;
        var attempt = video.play();
        if (attempt && attempt.catch) attempt.catch(function () {});
      });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (entry.isIntersecting) {
          loadDeferred(video);
          if (video.getAttribute("data-jdc-autoplay") !== "true") return;
          video.muted = true;
          var attempt = video.play();
          if (attempt && attempt.catch) attempt.catch(function () {});
        } else {
          releaseSound(video);
          if (!video.paused) video.pause();
        }
      });
    }, { rootMargin: "40% 0px", threshold: 0.01 });
    videos.forEach(function (video) { observer.observe(video); });
    window.__JDC_SQUARESPACE_MIRROR_OBSERVER__ = observer;
  }

  function installStyles() {
    if (document.getElementById("jdc-squarespace-mirror-draft1-styles")) return;
    var style = el("style");
    style.id = "jdc-squarespace-mirror-draft1-styles";
    style.textContent = [
      "html[data-jdc-squarespace-mirror]{scroll-behavior:auto!important}",
      "html[data-jdc-squarespace-mirror] body{margin:0!important;background:#fff!important;color:#050505!important}",
      "html[data-jdc-squarespace-mirror] main#page,html[data-jdc-squarespace-mirror] main{box-sizing:border-box!important;width:100%!important;max-width:none!important;margin:0!important;padding:0!important;overflow:visible!important}",
      ".jdc-mirror-home{display:block;width:100%;margin:0;padding:0;background:#080808;color:#fff}",
      ".jdc-mirror-home-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px;width:100%;margin:0;padding:0}",
      ".jdc-mirror-home-card{position:relative;min-width:0;margin:0;background:#0b0b0b;overflow:hidden}",
      ".jdc-mirror-home-link{position:relative;display:block;width:100%;aspect-ratio:16/9;color:#fff;text-decoration:none;overflow:hidden;background:#0b0b0b}",
      ".jdc-mirror-home-media{position:absolute;inset:0;width:100%;height:100%;overflow:hidden;background:#0b0b0b}",
      ".jdc-mirror-home-media video,.jdc-mirror-home-media img{display:block;width:100%;height:100%;object-fit:cover;object-position:center;border:0}",
      ".jdc-mirror-home-shade{position:absolute;z-index:1;inset:45% 0 0;background:linear-gradient(transparent,rgba(0,0,0,.62));pointer-events:none}",
      ".jdc-mirror-home-title{position:absolute;z-index:2;left:clamp(18px,2.4vw,38px);right:clamp(18px,2.4vw,38px);bottom:clamp(18px,2.2vw,34px);margin:0;color:#fff;font-size:clamp(22px,2.9vw,50px);font-weight:500;letter-spacing:-.045em;line-height:.95;text-wrap:balance}",
      ".jdc-mirror-home-type{position:absolute;z-index:2;top:clamp(15px,1.8vw,28px);left:clamp(18px,2.4vw,38px);margin:0;color:rgba(255,255,255,.78);font-size:8px;font-weight:400;letter-spacing:.08em;line-height:1.1;text-transform:uppercase}",
      ".jdc-mirror-project{display:block;width:100%;margin:0;padding:0 0 clamp(70px,9vw,140px);background:#fff;color:#050505}",
      ".jdc-mirror-films{display:block;width:100%;margin:0;padding:0;background:#080808}",
      ".jdc-mirror-film{position:relative;display:block;width:100%;aspect-ratio:16/9;margin:0;background:#080808;overflow:hidden}",
      ".jdc-mirror-film+.jdc-mirror-film{margin-top:2px}",
      ".jdc-mirror-film video{display:block;width:100%;height:100%;object-fit:cover;object-position:center;background:#080808;border:0}",
      ".jdc-mirror-player .jdc-video-controls{position:absolute;z-index:4;left:16px;right:16px;bottom:14px;display:flex;align-items:center;gap:10px;opacity:0;transition:opacity 160ms ease}",
      ".jdc-mirror-player:hover .jdc-video-controls,.jdc-mirror-player:focus-within .jdc-video-controls{opacity:1}",
      ".jdc-mirror-player .jdc-video-controls button{appearance:none;border:0;border-radius:999px;padding:8px 11px;color:#fff;background:rgba(0,0,0,.58);font:600 11px/1 system-ui,sans-serif;cursor:pointer}",
      ".jdc-mirror-player .jdc-video-progress{flex:1;height:3px;border-radius:999px;overflow:hidden;background:rgba(255,255,255,.35);cursor:pointer}",
      ".jdc-mirror-player .jdc-video-progress>span{display:block;width:0;height:100%;background:#fff}",
      ".jdc-mirror-preview-link{position:relative;display:block;width:100%;color:inherit;text-decoration:none;background:#080808;overflow:hidden}",
      ".jdc-mirror-preview-link .jdc-mirror-film{pointer-events:none}",
      ".jdc-mirror-preview-title{position:absolute;z-index:3;top:50%;left:50%;box-sizing:border-box;width:min(90%,1200px);margin:0;padding:0;transform:translate(-50%,-50%);color:#fff;font:500 clamp(30px,6vw,96px)/.92 Poppins,Arial,Helvetica,sans-serif;letter-spacing:-.045em;text-align:center;text-shadow:0 2px 24px rgba(0,0,0,.38);text-transform:uppercase;text-wrap:balance;pointer-events:none}",
      ".jdc-mirror-below-fold-films{box-sizing:border-box;display:block;width:100%;margin:0;padding:0 4.2vw clamp(48px,6vw,88px)}",
      ".jdc-mirror-below-fold-film{position:relative;display:block;width:100%;aspect-ratio:16/9;margin:0;background:#080808;overflow:hidden}",
      ".jdc-mirror-below-fold-film+.jdc-mirror-below-fold-film{margin-top:clamp(8px,1.1vw,18px)}",
      ".jdc-mirror-below-fold-film video{display:block;width:100%;height:100%;object-fit:cover;object-position:center;background:#080808;border:0}",
      ".jdc-mirror-meta{box-sizing:border-box;display:block;width:100%;max-width:1080px;margin:0 auto;padding:clamp(44px,6vw,92px) clamp(28px,4vw,48px) clamp(54px,7vw,106px)}",
      ".jdc-mirror-heading{min-width:0;margin:0;text-align:center}",
      ".jdc-mirror-title{margin:0;color:#050505;font-size:clamp(35px,5vw,82px);font-weight:500;letter-spacing:-.05em;line-height:.91;text-wrap:balance}",
      ".jdc-mirror-subtitle{margin:14px 0 0;color:rgba(0,0,0,.48);font-size:9px;font-weight:400;letter-spacing:.075em;line-height:1.25;text-transform:uppercase}",
      ".jdc-mirror-description{max-width:46ch;margin:22px auto 0;color:rgba(0,0,0,.72);font-size:13px;line-height:1.42}",
      ".jdc-mirror-credits{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));align-content:start;gap:8px 16px;width:83.6vw;max-width:1180px;min-width:0;margin:clamp(42px,4.6vw,64px) 0 0 50%;padding:0;transform:translateX(-50%)}",
      ".jdc-mirror-credit{display:flex;flex-direction:column;align-items:flex-start;gap:1px;min-width:0}",
      ".jdc-mirror-credit-name{order:2;max-width:none;color:#050505;font-size:11.5px;font-weight:500;letter-spacing:-.008em;line-height:1.12;text-align:left;text-transform:none}",
      ".jdc-mirror-credit-role{order:1;max-width:none;color:rgba(0,0,0,.46);font-size:7.5px;font-weight:400;letter-spacing:.055em;line-height:1.15;text-align:left;text-transform:uppercase}",
      ".jdc-mirror-gallery{box-sizing:border-box;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(8px,1.1vw,18px);width:100%;margin:0;padding:0 4.2vw clamp(48px,6vw,88px)}",
      ".jdc-mirror-gallery[data-count='1']{grid-template-columns:minmax(0,1fr)}",
      ".jdc-mirror-gallery[data-count='2']{grid-template-columns:repeat(2,minmax(0,1fr))}",
      ".jdc-mirror-gallery[data-columns='2']{grid-template-columns:repeat(2,minmax(0,1fr))}",
      ".jdc-mirror-gallery[data-columns='4']{grid-template-columns:repeat(4,minmax(0,1fr))}",
      ".jdc-mirror-gallery-item{position:relative;display:block;min-width:0;margin:0;background:#0a0a0a;overflow:hidden}",
      ".jdc-mirror-gallery-item video,.jdc-mirror-gallery-item img{display:block;width:100%;height:100%;object-fit:cover;object-position:center;background:#0a0a0a;border:0}",
      ".jdc-mirror-fields{box-sizing:border-box;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:42px 5vw;width:100%;margin:0;padding:clamp(26px,4vw,64px) 4.2vw clamp(48px,7vw,100px);border-top:1px solid rgba(0,0,0,.1)}",
      ".jdc-mirror-project-type{grid-column:1/-1;margin:0;color:rgba(0,0,0,.48);font-size:9px;font-weight:400;letter-spacing:.075em;line-height:1.25;text-align:left;text-transform:uppercase}",
      ".jdc-mirror-field{min-width:0}.jdc-mirror-field h3{margin:0 0 12px;color:rgba(0,0,0,.48);font-size:9px;font-weight:400;letter-spacing:.075em;text-transform:uppercase}",
      ".jdc-mirror-field-links{display:flex;flex-wrap:wrap;gap:7px 15px}.jdc-mirror-field a{color:#050505;font-size:11px;text-underline-offset:3px}",
      ".jdc-mirror-quotes{box-sizing:border-box;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px 24px;width:100%;margin:0;padding:0 4.2vw clamp(48px,7vw,100px)}",
      ".jdc-mirror-quote{margin:0}.jdc-mirror-quote blockquote{margin:0;color:#050505;font-size:13px;letter-spacing:-.01em;line-height:1.38}.jdc-mirror-quote cite{display:block;margin-top:9px;color:rgba(0,0,0,.48);font-size:8px;font-style:normal;letter-spacing:.065em;text-transform:uppercase}",
      ".jdc-mirror-onepage{display:block;width:100%;margin:0;padding:0;background:#fff}",
      "html[data-jdc-squarespace-mirror-page='onepage'] #header{position:fixed!important;top:0!important;right:0!important;left:0!important;width:100%!important;z-index:9999!important;background:transparent!important;transform:none!important}",
      "html[data-jdc-squarespace-mirror-page='onepage'] #header .header-inner{align-items:stretch!important}",
      "html[data-jdc-squarespace-mirror-page='onepage'] #header .header-display-desktop,html[data-jdc-squarespace-mirror-page='onepage'] #header .header-display-mobile{display:none!important}",
      ".jdc-mirror-onepage-header-row{box-sizing:border-box;display:grid;grid-template-columns:minmax(72px,1fr) auto minmax(72px,1fr);align-items:end;column-gap:24px;width:100%;height:100%;min-width:0;margin:0;padding:0;color:#fff}",
      ".jdc-mirror-onepage-header-row[data-jdc-header-fallback='true']{position:fixed;z-index:100000;top:0;left:0;height:auto;padding:38px 4vw;background:transparent}",
      ".jdc-mirror-onepage-brand,.jdc-mirror-onepage-contact{position:relative;z-index:2;display:block;margin:0;color:#fff!important;text-decoration:none;text-shadow:none;white-space:nowrap}",
      ".jdc-mirror-onepage-brand{justify-self:start;font:500 31.36px/43.904px Poppins,Arial,Helvetica,sans-serif}",
      ".jdc-mirror-onepage-contact{justify-self:end;padding-bottom:1px;font:300 12px/19.2px Poppins,Arial,Helvetica,sans-serif}",
      ".jdc-mirror-onepage-brand:hover,.jdc-mirror-onepage-contact:hover{text-decoration:underline;text-underline-offset:4px}",
      ".jdc-mirror-onepage-filters{position:static;z-index:2;box-sizing:border-box;display:flex;align-items:flex-end;justify-content:center;min-width:0;width:auto;margin:0;padding:0;background:transparent;pointer-events:none}",
      ".jdc-mirror-onepage-filter-set{display:flex;flex-wrap:nowrap;justify-content:center;gap:0 19px;max-width:100%;min-width:0;margin:0;padding:0;pointer-events:auto;white-space:nowrap}",
      ".jdc-mirror-onepage-filter-input{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0}",
      ".jdc-mirror-onepage-filter{appearance:none;margin:0;padding:0 0 1px;border:0;border-bottom:1px solid transparent;border-radius:0;background:transparent;color:inherit;font:300 10px/19.2px Poppins,Arial,Helvetica,sans-serif;letter-spacing:.055em;text-decoration:none;text-shadow:none;text-transform:uppercase;cursor:pointer;opacity:.68}",
      ".jdc-mirror-onepage-filter:hover{border-bottom-color:currentColor;opacity:1}",
      ".jdc-mirror-onepage-filter-input:focus-visible+.jdc-mirror-onepage-filter{border-bottom-color:currentColor;outline:1px solid currentColor;outline-offset:4px;opacity:1}",
      ".jdc-mirror-onepage-filter-input:checked+.jdc-mirror-onepage-filter{border-bottom-color:currentColor;opacity:1}",
      ".jdc-mirror-onepage-projects>.jdc-mirror-project+.jdc-mirror-project{border-top:1px solid rgba(0,0,0,.12)}",
      ".jdc-mirror-onepage-projects>.jdc-mirror-project[hidden]{display:none!important}",
      "@media(max-width:1099px){.jdc-mirror-credits{grid-template-columns:repeat(3,minmax(0,1fr))}}",
      "@media(max-width:1023px) and (min-width:768px){.jdc-mirror-gallery[data-columns='4']{grid-template-columns:repeat(2,minmax(0,1fr))}}",
      "@media(max-width:767px){.jdc-mirror-home-grid{grid-template-columns:1fr}.jdc-mirror-home-title{font-size:clamp(28px,8.6vw,48px)}.jdc-mirror-preview-title{width:88%;font-size:clamp(24px,9vw,46px)}.jdc-mirror-meta{padding:38px 6vw 56px}.jdc-mirror-credits{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px 14px;width:87.7vw;max-width:none}.jdc-mirror-below-fold-films,.jdc-mirror-gallery,.jdc-mirror-gallery[data-count],.jdc-mirror-gallery[data-columns]{grid-template-columns:1fr;padding-left:6vw;padding-right:6vw}.jdc-mirror-fields,.jdc-mirror-quotes{grid-template-columns:1fr;padding-left:6vw;padding-right:6vw}.jdc-mirror-onepage-header-row{grid-template-columns:auto minmax(0,1fr) auto;column-gap:8px}.jdc-mirror-onepage-brand{font-size:23px;line-height:32px}.jdc-mirror-onepage-contact{padding-bottom:1px;font-size:10px;line-height:15px}.jdc-mirror-onepage-filter-set{gap:0 4px}.jdc-mirror-onepage-filter{padding-bottom:1px;font-size:7px;line-height:15px;letter-spacing:.025em}}",
      "@media(hover:none){.jdc-mirror-player .jdc-video-controls{opacity:1}}",
      "@media(prefers-reduced-motion:reduce){.jdc-mirror-home-media video,.jdc-mirror-gallery-item video{animation:none!important}.jdc-mirror-player .jdc-video-controls{transition:none}}"
    ].join("");
    (document.head || document.documentElement).appendChild(style);
  }

  function ensureMain() {
    var main = document.querySelector("main#page,main");
    if (!main) {
      main = el("main");
      main.id = "page";
      document.body.appendChild(main);
    }
    return main;
  }

  function renderHomeCard(project) {
    var card = el("article", "jdc-mirror-home-card");
    card.setAttribute("data-jdc-route", project.route);
    var link = el("a", "jdc-mirror-home-link");
    link.href = new URL(project.route, window.location.origin).href;
    link.setAttribute("aria-label", project.title);
    var media = el("div", "jdc-mirror-home-media");
    var preview = makeVideo({
      src: project.media && project.media.src,
      poster: project.media && project.media.poster,
      hasAudio: false
    }, { muted: true, loop: true, autoplay: true, preload: "metadata" });
    preview.setAttribute("data-jdc-autoplay", "true");
    append(media, preview);
    var shade = el("span", "jdc-mirror-home-shade");
    shade.setAttribute("aria-hidden", "true");
    var type = el("span", "jdc-mirror-home-type", project.projectType || "Selected work");
    var title = el("h2", "jdc-mirror-home-title");
    title.appendChild(splitTitle(project.title));
    append(link, media, shade, type, title);
    return append(card, link);
  }

  function renderHome(main) {
    document.documentElement.setAttribute("data-jdc-squarespace-mirror-page", "home");
    document.body.setAttribute("data-jdc-squarespace-mirror-page", "home");
    var home = el("div", "jdc-mirror-home");
    var grid = el("div", "jdc-mirror-home-grid");
    homepageProjects.forEach(function (project) { grid.appendChild(renderHomeCard(project)); });
    home.appendChild(grid);
    main.replaceChildren(home);
    observeAutoplay(home);
    document.title = "JDC — Selected Work";
  }

  function renderCredits(project) {
    var credits = el("div", "jdc-mirror-credits");
    credits.setAttribute("role", "list");
    (project.credits || []).forEach(function (pair) {
      var item = el("div", "jdc-mirror-credit");
      item.setAttribute("role", "listitem");
      append(item, el("span", "jdc-mirror-credit-name", pair[1]), el("span", "jdc-mirror-credit-role", pair[0]));
      credits.appendChild(item);
    });
    return credits;
  }

  function renderFilms(project) {
    if (!project.fullFilms || !project.fullFilms.length) return null;
    var films = el("div", "jdc-mirror-films");
    project.fullFilms.forEach(function (film, index) {
      var frame = el("figure", "jdc-mirror-film");
      frame.setAttribute("data-jdc-film-index", String(index + 1));
      frame.style.aspectRatio = String(Number(film.aspect) > 0 ? Number(film.aspect) : 16 / 9);
      var video = makeVideo(film, {
        muted: true,
        controls: false,
        autoplay: true,
        loop: true,
        preload: "metadata",
        hoverSound: false
      });
      video.setAttribute("data-jdc-autoplay", "true");
      video.setAttribute("aria-label", project.title + (project.fullFilms.length > 1 ? " film " + String(index + 1) : " film"));
      frame.appendChild(video);
      installPlayerControls(frame, video, project.title + (project.fullFilms.length > 1 ? " film " + String(index + 1) : " film"));
      films.appendChild(frame);
    });
    return films;
  }

  function renderPreview(project) {
    if (!project.media || !project.media.src) return null;
    var link = el("a", "jdc-mirror-preview-link");
    link.href = new URL(project.route, window.location.origin).href;
    link.setAttribute("aria-label", "Open " + project.title);
    var frame = el("figure", "jdc-mirror-film");
    frame.setAttribute("data-jdc-preview", "true");
    frame.style.aspectRatio = String(
      Number(project.media.aspect) > 0 ? Number(project.media.aspect) : 16 / 9
    );
    var video = makeVideo({
      src: project.media.src,
      poster: project.media.poster,
      hasAudio: false
    }, { muted: true, loop: true, autoplay: true, preload: "metadata", deferSource: true });
    video.setAttribute("data-jdc-autoplay", "true");
    video.setAttribute("aria-label", project.title + " preview");
    append(frame, video, el("span", "jdc-mirror-preview-title", previewTitle(project.title)));
    link.appendChild(frame);
    return link;
  }

  function renderBelowFoldFilms(project, onepage) {
    var records = onepage ? project.onepageBelowFoldFilms : project.belowFoldFilms;
    if (!records || !records.length) return null;
    var films = el("section", "jdc-mirror-below-fold-films");
    films.setAttribute("aria-label", project.title + " additional films");
    records.forEach(function (film, index) {
      var frame = el("figure", "jdc-mirror-below-fold-film");
      frame.setAttribute("data-jdc-below-fold-film-index", String(index + 1));
      frame.style.aspectRatio = String(Number(film.aspect) > 0 ? Number(film.aspect) : 16 / 9);
      var video = makeVideo(film, {
        muted: true,
        controls: false,
        autoplay: false,
        loop: false,
        preload: "metadata",
        hoverSound: false,
        deferSource: onepage
      });
      video.setAttribute("aria-label", project.title + " additional film " + String(index + 1));
      frame.appendChild(video);
      installPlayerControls(frame, video, project.title + " additional film " + String(index + 1));
      films.appendChild(frame);
    });
    return films;
  }

  function renderMeta(project) {
    var meta = el("section", "jdc-mirror-meta");
    meta.setAttribute("aria-label", "Project title and credits");
    var heading = el("div", "jdc-mirror-heading");
    var title = el("h1", "jdc-mirror-title");
    title.appendChild(splitTitle(project.title));
    append(heading, title);
    if (project.description) heading.appendChild(el("p", "jdc-mirror-description", project.description));
    return append(meta, heading, renderCredits(project));
  }

  function renderGallery(project, onepage) {
    var items = onepage && Array.isArray(project.onepageGallery)
      ? project.onepageGallery
      : project.gallery;
    if (!items || !items.length) return null;
    var gallery = el("section", "jdc-mirror-gallery");
    gallery.setAttribute("aria-label", project.title + " selected clips");
    gallery.setAttribute("data-count", String(items.length));
    var columns = onepage ? project.onepageGalleryColumns : project.galleryColumns;
    if (Number(columns) > 0) gallery.setAttribute("data-columns", String(columns));
    items.forEach(function (item, index) {
      var frame = el("figure", "jdc-mirror-gallery-item");
      frame.setAttribute("data-jdc-gallery-index", String(index + 1));
      frame.style.aspectRatio = String(Number(item.aspect) > 0 ? Number(item.aspect) : 16 / 9);
      if (item.type === "image") {
        var image = document.createElement("img");
        image.src = mediaUrl(item.src);
        image.alt = project.title + " still " + String(index + 1);
        image.loading = "lazy";
        frame.appendChild(image);
      } else {
        var video = makeVideo(item, { muted: true, loop: true, autoplay: true, preload: "metadata", hoverSound: true, deferSource: onepage });
        video.setAttribute("data-jdc-autoplay", "true");
        video.setAttribute("aria-label", project.title + " clip " + String(index + 1));
        frame.appendChild(video);
      }
      gallery.appendChild(frame);
    });
    return gallery;
  }

  function renderFields(project) {
    if (!project.projectType && (!project.fields || !project.fields.length)) return null;
    var fields = el("section", "jdc-mirror-fields");
    fields.setAttribute("aria-label", "Project type, press and recognition");
    if (project.projectType) fields.appendChild(el("p", "jdc-mirror-project-type", project.projectType));
    (project.fields || []).forEach(function (field) {
      var block = el("div", "jdc-mirror-field");
      var links = el("div", "jdc-mirror-field-links");
      (field.links || []).forEach(function (link) {
        var anchor = el("a", "", link.label);
        anchor.href = link.url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        links.appendChild(anchor);
      });
      append(block, el("h3", "", field.label), links);
      fields.appendChild(block);
    });
    return fields;
  }

  function renderQuotes(project) {
    if (!project.quotes || !project.quotes.length) return null;
    var quotes = el("section", "jdc-mirror-quotes");
    project.quotes.forEach(function (quote) {
      var figure = el("figure", "jdc-mirror-quote");
      append(figure, el("blockquote", "", quote.text), el("cite", "", quote.source));
      quotes.appendChild(figure);
    });
    return quotes;
  }

  function projectNode(project, onepage) {
    var root = el(onepage ? "section" : "article", "jdc-mirror-project");
    root.setAttribute("data-jdc-project-route", project.route);
    if (onepage) root.id = "onepage-" + String(project.index).padStart(2, "0");
    append(
      root,
      onepage ? renderPreview(project) : renderFilms(project),
      renderMeta(project),
      renderBelowFoldFilms(project, onepage),
      renderGallery(project, onepage),
      renderFields(project),
      renderQuotes(project)
    );
    return root;
  }

  function renderProject(main, project) {
    document.documentElement.setAttribute("data-jdc-squarespace-mirror-page", "project");
    document.body.setAttribute("data-jdc-squarespace-mirror-page", "project");
    var root = projectNode(project, false);
    main.replaceChildren(root);
    observeAutoplay(root);
    document.title = project.title + " — JDC";
  }

  function renderOnepage(main) {
    document.documentElement.setAttribute("data-jdc-squarespace-mirror-page", "onepage");
    document.body.setAttribute("data-jdc-squarespace-mirror-page", "onepage");
    var onepage = el("div", "jdc-mirror-onepage");
    var filterBar = el("nav", "jdc-mirror-onepage-filters");
    filterBar.id = "jdc-mirror-onepage-filters";
    filterBar.setAttribute("aria-label", "Filter projects by Jos Diaz Contreras role");
    var headerRow = el("div", "jdc-mirror-onepage-header-row");
    headerRow.id = "jdc-mirror-onepage-header-row";
    headerRow.setAttribute("data-jdc-onepage-header", "pinned-row-78");
    var brandLink = el("a", "jdc-mirror-onepage-brand", "JDC");
    brandLink.href = "/onepage";
    brandLink.setAttribute("aria-label", "Show all JDC projects");
    brandLink.style.setProperty("color", "#fff", "important");
    var contactLink = el("a", "jdc-mirror-onepage-contact", "Contact");
    contactLink.href = "/contact";
    contactLink.style.setProperty("color", "#fff", "important");
    var filterSet = el("div", "jdc-mirror-onepage-filter-set");
    filterSet.setAttribute("role", "group");
    filterSet.setAttribute("aria-label", "Project role");
    var filters = [
      ["director", "Director"],
      ["producer", "Producer"],
      ["creative", "Creative Director"],
      ["editor", "Editor"]
    ];
    var requestedFilter = new URLSearchParams(window.location.search).get("role") || "all";
    if (requestedFilter !== "all" && !filters.some(function (record) { return record[0] === requestedFilter; })) requestedFilter = "all";
    var projectList = el("div", "jdc-mirror-onepage-projects");
    projectList.id = "jdc-mirror-onepage-projects";
    var projectEntries = onepageProjects.map(function (project) {
      var node = projectNode(project, true);
      ["director", "producer", "editor", "creative"].forEach(function (role) {
        node.setAttribute("data-jdc-role-" + role, matchesRoleFilter(project, role) ? "true" : "false");
      });
      projectList.appendChild(node);
      return { project: project, node: node };
    });
    function applyRoleFilter(filter) {
      projectEntries.forEach(function (entry) {
        var visible = matchesRoleFilter(entry.project, filter);
        entry.node.hidden = !visible;
        if (visible) return;
        Array.prototype.forEach.call(entry.node.querySelectorAll("video"), function (video) {
          if (activeSoundVideo === video) releaseSound(video);
          if (!video.paused) video.pause();
        });
      });
      document.documentElement.setAttribute("data-jdc-onepage-role", filter);
      document.body.setAttribute("data-jdc-onepage-role", filter);
    }
    brandLink.setAttribute("aria-controls", projectList.id);
    brandLink.addEventListener("click", function (event) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      var filterUrl = new URL(window.location.href);
      filterUrl.searchParams.delete("role");
      window.history.replaceState(null, "", filterUrl.href);
      Array.prototype.forEach.call(filterSet.querySelectorAll("input[data-jdc-role-filter]"), function (input) {
        input.checked = false;
      });
      applyRoleFilter("all");
    });
    filters.forEach(function (record) {
      var input = el("input", "jdc-mirror-onepage-filter-input");
      input.type = "radio";
      input.name = "jdc-mirror-role-filter";
      input.id = "jdc-mirror-role-" + record[0];
      input.value = record[0];
      input.checked = record[0] === requestedFilter;
      input.setAttribute("data-jdc-role-filter", record[0]);
      input.setAttribute("aria-controls", projectList.id);
      var label = el("label", "jdc-mirror-onepage-filter", record[1]);
      label.htmlFor = input.id;
      input.addEventListener("change", function () {
        if (!input.checked) return;
        var filterUrl = new URL(window.location.href);
        filterUrl.searchParams.set("role", record[0]);
        window.history.replaceState(null, "", filterUrl.href);
        applyRoleFilter(record[0]);
      });
      append(filterSet, input, label);
    });
    filterBar.appendChild(filterSet);
    append(onepage, projectList);
    main.replaceChildren(onepage);
    var previousHeaderRow = document.getElementById(headerRow.id);
    if (previousHeaderRow && previousHeaderRow !== headerRow) previousHeaderRow.remove();
    append(headerRow, brandLink, filterBar, contactLink);
    var headerMount = document.querySelector("#header .header-inner");
    if (headerMount) {
      var siteHeader = headerMount.closest("#header");
      if (siteHeader) {
        siteHeader.style.setProperty("position", "fixed", "important");
        siteHeader.style.setProperty("top", "0", "important");
        siteHeader.style.setProperty("right", "0", "important");
        siteHeader.style.setProperty("left", "0", "important");
        siteHeader.style.setProperty("width", "100%", "important");
        siteHeader.style.setProperty("transform", "none", "important");
      }
      headerMount.appendChild(headerRow);
    }
    else {
      headerRow.setAttribute("data-jdc-header-fallback", "true");
      document.body.appendChild(headerRow);
    }
    applyRoleFilter(requestedFilter);
    observeAutoplay(onepage);
    document.title = "Onepage — JDC";
  }

  function install() {
    if (!document.body) return;
    // Keep the regular Squarespace homepage intact. Its native page owns the
    // approved one-column project selection and text treatment; the mirror is
    // reserved for Onepage and individual project routes.
    if (path === "/") return;
    installStyles();
    document.documentElement.setAttribute("data-jdc-squarespace-mirror", RELEASE);
    document.body.setAttribute("data-jdc-squarespace-mirror", RELEASE);
    var main = ensureMain();
    if (path === "/onepage") renderOnepage(main);
    else if (projectsByRoute[path]) renderProject(main, projectsByRoute[path]);
    else return;
    document.documentElement.setAttribute("data-jdc-squarespace-mirror-ready", "true");
    document.body.setAttribute("data-jdc-squarespace-mirror-ready", "true");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true });
  else install();
})();
