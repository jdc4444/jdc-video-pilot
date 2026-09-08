(function () {
  "use strict";

  if (window.__JDC_ABOUT_PILOT107__) return;
  window.__JDC_ABOUT_PILOT107__ = true;

  var POSTER_URL = "https://jdc4444.github.io/jdc_resume/media/project-galleries/website-videos/c1e56f2c-33a3-4fb1-b221-a7c964548622-about-start.webp?v=about-start-6875";
  var VIDEO_URL = "https://jdc4444.github.io/jdc_resume/media/project-galleries/website-videos/c1e56f2c-33a3-4fb1-b221-a7c964548622-about-cut-v2.mp4?v=about-cut-v2";
  var root = document.documentElement;
  var view = null;
  var video = null;

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

  function currentAboutUrl() {
    var next = new URL(window.location.href);
    next.searchParams.set("jdc-about", "1");
    return next.pathname + next.search + next.hash;
  }

  function isHeaderContactLink(link) {
    if (!link || !link.closest("#header,header,.header")) return false;
    var rawHref = link.getAttribute("href") || "";
    var label = String(link.textContent || "").trim().toLowerCase();
    var isContactRoute = false;
    try {
      isContactRoute = new URL(rawHref, window.location.href).pathname.replace(/\/+$/, "") === "/contact";
    } catch (_error) {}
    return isContactRoute || label === "contact" || link.hasAttribute("data-jdc-about-trigger");
  }

  function setAboutLabel(link) {
    var mobileLabel = link.querySelector(".header-menu-nav-item-content");
    if (mobileLabel) mobileLabel.textContent = "About";
    else link.textContent = "About";
    link.href = currentAboutUrl();
    link.setAttribute("data-jdc-about-trigger", "pilot107");
    link.setAttribute("aria-controls", "jdc-sitewide-about-view");
    link.setAttribute("aria-expanded", root.getAttribute("data-jdc-about-open") === "true" ? "true" : "false");
  }

  function promoteHeaderLinks() {
    Array.prototype.forEach.call(document.querySelectorAll("#header a,header a,.header a"), function (link) {
      if (isHeaderContactLink(link)) setAboutLabel(link);
    });
  }

  function setTriggerState(open) {
    Array.prototype.forEach.call(document.querySelectorAll("[data-jdc-about-trigger]"), function (link) {
      link.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function updateUrl(open) {
    var next = new URL(window.location.href);
    if (open) next.searchParams.set("jdc-about", "1");
    else next.searchParams.delete("jdc-about");
    window.history.replaceState(null, "", next.href);
    promoteHeaderLinks();
  }

  function openAbout(changeUrl) {
    if (!view) return;
    view.hidden = false;
    view.scrollTop = 0;
    root.setAttribute("data-jdc-about-open", "true");
    if (document.body) document.body.setAttribute("data-jdc-about-open", "true");
    setTriggerState(true);
    if (video && !video.getAttribute("src")) {
      video.src = video.getAttribute("data-src");
      video.load();
    }
    if (video) {
      var promise = video.play();
      if (promise && typeof promise.catch === "function") promise.catch(function () {});
    }
    if (changeUrl) updateUrl(true);
  }

  function closeAbout(changeUrl) {
    if (!view) return;
    view.hidden = true;
    root.removeAttribute("data-jdc-about-open");
    if (document.body) document.body.removeAttribute("data-jdc-about-open");
    setTriggerState(false);
    if (video && !video.paused) video.pause();
    if (changeUrl) updateUrl(false);
  }

  function installStyles() {
    if (document.getElementById("jdc-sitewide-about-styles")) return;
    var style = el("style");
    style.id = "jdc-sitewide-about-styles";
    style.textContent = [
      "html[data-jdc-about-open='true'] body{overflow:hidden!important}",
      "html[data-jdc-about-open='true'] #header,html[data-jdc-about-open='true'] header.header{z-index:10000!important}",
      "html[data-jdc-about-open='true'] #header a,html[data-jdc-about-open='true'] header.header a{color:#fff!important}",
      "html[data-jdc-about-open='true'] #header a:after,html[data-jdc-about-open='true'] header.header a:after{background:#fff!important;border-color:#fff!important}",
      ".jdc-sitewide-about-view{position:fixed;z-index:9998;inset:0;box-sizing:border-box;display:block;overflow-y:auto;overscroll-behavior:contain;padding:clamp(112px,10vw,142px) 4vw clamp(42px,6vw,80px);background:#0b0b0b;color:#f4f4f0;font-family:Raleway,Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased}",
      ".jdc-sitewide-about-view[hidden]{display:none!important}",
      ".jdc-sitewide-about-layout{display:grid;grid-template-columns:minmax(220px,31%) minmax(360px,43%) minmax(220px,26%);width:100%;min-height:calc(100svh - clamp(154px,16vw,220px));border-top:1px solid rgba(255,255,255,.2)}",
      ".jdc-sitewide-about-heading{box-sizing:border-box;margin:0;padding:clamp(24px,3vw,44px) clamp(22px,3vw,46px) clamp(54px,8vw,112px) 0}",
      ".jdc-sitewide-about-kicker{display:block;margin:0 0 18px;color:rgba(255,255,255,.5);font-size:9px;font-weight:400;letter-spacing:.08em;line-height:1.2;text-transform:uppercase}",
      ".jdc-sitewide-about-title{max-width:11ch;margin:0;color:#fff;font-size:clamp(34px,4.5vw,72px);font-weight:500;letter-spacing:-.05em;line-height:.93;text-wrap:balance}",
      ".jdc-sitewide-about-copy{box-sizing:border-box;min-width:0;margin:0;padding:clamp(24px,3vw,44px);border-left:1px solid rgba(255,255,255,.2)}",
      ".jdc-sitewide-about-copy p{max-width:45em;margin:0 0 1.35em;color:#fff;font-size:clamp(13px,1.05vw,16px);font-weight:400;letter-spacing:-.01em;line-height:1.48}",
      ".jdc-sitewide-about-contact{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin:clamp(34px,4vw,58px) 0 0;padding:18px 0 0;border-top:1px solid rgba(255,255,255,.2)}",
      ".jdc-sitewide-about-contact-link{display:flex;flex-direction:column;align-items:flex-start;gap:3px;min-width:0;color:#fff!important;text-decoration:none!important}",
      ".jdc-sitewide-about-contact-label{color:rgba(255,255,255,.48);font-size:8px;font-weight:400;letter-spacing:.08em;line-height:1.2;text-transform:uppercase}",
      ".jdc-sitewide-about-contact-value{max-width:100%;border-bottom:1px solid transparent;font-size:12px;font-weight:400;line-height:1.35;overflow-wrap:anywhere}",
      ".jdc-sitewide-about-contact-link:hover .jdc-sitewide-about-contact-value,.jdc-sitewide-about-contact-link:focus-visible .jdc-sitewide-about-contact-value{border-bottom-color:currentColor}",
      ".jdc-sitewide-about-film-stage{box-sizing:border-box;min-width:0;padding:clamp(24px,3vw,44px);border-left:1px solid rgba(255,255,255,.2)}",
      ".jdc-sitewide-about-film{width:min(100%,310px);margin:0 auto}",
      ".jdc-sitewide-about-film-frame{position:relative;width:100%;aspect-ratio:9/16;overflow:hidden;background:#111}",
      ".jdc-sitewide-about-film-poster,.jdc-sitewide-about-film-video{position:absolute;inset:0;display:block;width:100%;height:100%;border:0;object-fit:cover}",
      ".jdc-sitewide-about-film-poster{z-index:1}.jdc-sitewide-about-film-video{z-index:2;background:transparent}",
      ".jdc-sitewide-about-film-caption{margin:8px 0 0;color:rgba(255,255,255,.48);font-size:8px;font-weight:400;letter-spacing:.035em;line-height:1.35;white-space:nowrap}",
      "[data-jdc-about-trigger][aria-current='page']{border-bottom:1px solid currentColor}",
      "@media(max-width:900px){.jdc-sitewide-about-layout{grid-template-columns:1fr}.jdc-sitewide-about-heading{padding-right:0;padding-bottom:38px}.jdc-sitewide-about-title{max-width:15ch}.jdc-sitewide-about-copy,.jdc-sitewide-about-film-stage{border-left:0;border-top:1px solid rgba(255,255,255,.2)}.jdc-sitewide-about-film{width:min(100%,360px)}}",
      "@media(max-width:767px){.jdc-sitewide-about-view{padding:104px 6vw 54px}.jdc-sitewide-about-contact{grid-template-columns:1fr;gap:14px}.jdc-sitewide-about-copy,.jdc-sitewide-about-film-stage{padding:26px 0}.jdc-sitewide-about-film-caption{white-space:normal}}"
    ].join("");
    (document.head || root).appendChild(style);
  }

  function buildAboutView() {
    view = document.getElementById("jdc-sitewide-about-view");
    if (view) {
      video = view.querySelector(".jdc-sitewide-about-film-video");
      return;
    }

    view = el("section", "jdc-sitewide-about-view");
    view.id = "jdc-sitewide-about-view";
    view.hidden = true;
    view.setAttribute("aria-labelledby", "jdc-sitewide-about-title");
    view.setAttribute("data-jdc-about-release", "pilot107");

    var layout = el("div", "jdc-sitewide-about-layout");
    var heading = el("header", "jdc-sitewide-about-heading");
    var title = el("h1", "jdc-sitewide-about-title", "Jos Diaz Contreras");
    title.id = "jdc-sitewide-about-title";
    append(heading, el("span", "jdc-sitewide-about-kicker", "About"), title);

    var copy = el("div", "jdc-sitewide-about-copy");
    append(
      copy,
      el("p", "", "Jos Diaz Contreras is a filmmaker and artist born in Mexico City. He came of age in New York, attending Stuyvesant High School before graduating from NYU in 2015. He co-founded Art Camp, an independent studio built around collaboration between filmmakers, animators, designers, musicians, and performers."),
      el("p", "", "His work moves between narrative film, documentary, music, animation, and commissioned projects. The films often begin with a performance, a place, or a small observed detail, then open outward into worlds shaped through photography, editing, sound, and design. He is interested in the point where intimate human gestures meet more constructed and technically complex forms."),
      el("p", "", "His films have received recognition from SXSW and D&AD, along with multiple Vimeo Staff Picks. He remains based in Brooklyn, but you may find him in Athens, São Paulo, Copenhagen, or Los Angeles.")
    );

    var contact = el("div", "jdc-sitewide-about-contact");
    var instagram = el("a", "jdc-sitewide-about-contact-link");
    instagram.href = "https://instagram.com/josdiazcontreras";
    instagram.target = "_blank";
    instagram.rel = "noopener noreferrer";
    append(instagram, el("span", "jdc-sitewide-about-contact-label", "Instagram"), el("span", "jdc-sitewide-about-contact-value", "@josdiazcontreras"));
    var email = el("a", "jdc-sitewide-about-contact-link");
    email.href = "mailto:jos@futuro.studio";
    append(email, el("span", "jdc-sitewide-about-contact-label", "Email"), el("span", "jdc-sitewide-about-contact-value", "jos@futuro.studio"));
    append(contact, instagram, email);
    copy.appendChild(contact);

    var filmStage = el("div", "jdc-sitewide-about-film-stage");
    var film = el("figure", "jdc-sitewide-about-film");
    var frame = el("div", "jdc-sitewide-about-film-frame");
    var poster = el("img", "jdc-sitewide-about-film-poster");
    poster.src = POSTER_URL;
    poster.alt = "";
    poster.setAttribute("aria-hidden", "true");
    video = el("video", "jdc-sitewide-about-film-video");
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = "none";
    video.poster = POSTER_URL;
    video.setAttribute("data-src", VIDEO_URL);
    video.setAttribute("aria-label", "Bon Iver Day One behind-the-scenes film");
    append(frame, poster, video);
    append(film, frame, el("figcaption", "jdc-sitewide-about-film-caption", "Bon Iver Day One BTS, Video: Kylin Solano"));
    filmStage.appendChild(film);
    append(layout, heading, copy, filmStage);
    view.appendChild(layout);
    document.body.appendChild(view);
  }

  function handleClick(event) {
    var link = event.target && event.target.closest ? event.target.closest("a") : null;
    if (!isHeaderContactLink(link)) return;
    setAboutLabel(link);
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (view && view.hidden) openAbout(true);
    else closeAbout(true);
  }

  function boot() {
    if (!document.body) return false;
    installStyles();
    buildAboutView();
    promoteHeaderLinks();
    document.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && view && !view.hidden) closeAbout(true);
    });
    new MutationObserver(function () {
      window.requestAnimationFrame(promoteHeaderLinks);
    }).observe(document.body, { childList: true, subtree: true });
    [100, 400, 1000, 2500].forEach(function (delay) {
      window.setTimeout(promoteHeaderLinks, delay);
    });
    if (window.location.pathname.replace(/\/+$/, "") === "/contact" || new URLSearchParams(window.location.search).get("jdc-about") === "1") {
      openAbout(false);
    }
    return true;
  }

  if (!boot()) document.addEventListener("DOMContentLoaded", boot, { once: true });
})();
