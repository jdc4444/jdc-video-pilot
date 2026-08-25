if (!window.__JDC_VIDEO_V2_ENABLED__) {

/* ================================================= */
/* 1. MASTER NAVIGATION CONTROLLER (JDC + CONTACT)   */
/* ================================================= */
document.addEventListener('click', (e) => {
  // A. JDC LOGO LOGIC (Scroll to Top)
  const logo = e.target.closest('.header-title-logo a, .header-mobile-logo a, .header-title-text a');

  if (logo) {
    if (document.body.classList.contains('homepage')) {
      e.preventDefault();
      e.stopPropagation();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  }

  // B. FOOTER DRAWER LOGIC
  const contactLink = e.target.closest('a[href*="/contact"], a[href*="contact"]');
  const footerClose = e.target.closest('.footer-close-btn');
  const footerDrawer = e.target.closest('footer#footer-sections');

  if (contactLink) {
    const text = contactLink.textContent.trim().toLowerCase();
    if (text === 'contact' || contactLink.href.includes('/contact')) {
      e.preventDefault(); e.stopPropagation();
      document.body.classList.add('show-footer');
      const footer = document.querySelector('footer#footer-sections');
      if (footer && !footer.querySelector('.footer-close-btn')) {
        const btn = document.createElement('div'); btn.className = 'footer-close-btn';
        footer.prepend(btn);
      }
      return;
    }
  }

  if (document.body.classList.contains('show-footer')) {
    if (footerClose || (!footerDrawer && !contactLink)) {
      e.preventDefault();
      document.body.classList.remove('show-footer');
    }
  }
}, { capture: true });

/* ================================================= */
/* 2. SMART VIDEO ENGINE (PERFORMANCE FIX)           */
/* ================================================= */
(function() {
  window.videoGlobalUnmute = false;

  // --- A. PERFORMANCE OBSERVER (Play Visible / Pause Hidden) ---
  const playbackObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        const p = video.play();
        if (p !== undefined) p.catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.1 });

  const initCustomUI = () => {
    const targets = document.querySelectorAll('.video-block, .sqs-block-video, .section-background, .sqs-video-background-native');

    targets.forEach(target => {
      // 1. Setup Video
      const video = target.querySelector('video');
      if (video) {
        if (!video.hasAttribute('playsinline')) {
            video.muted = true;
            video.setAttribute('playsinline', '');
            video.setAttribute('loop', '');
        }
        if (!video.dataset.observed) {
            playbackObserver.observe(video);
            video.dataset.observed = "true";
        }
      }

      // 2. Build UI
      if (target.dataset.uiHandled) return;
      if (document.body.classList.contains('homepage') && (target.classList.contains('section-background') || target.closest('.section-background'))) return;

      if (video) {
        video.controls = false; video.removeAttribute('controls');

        const ui = document.createElement('div'); ui.className = 'custom-video-ui';
        ui.innerHTML = `
          <div class="cv-scrubber-track"><div class="cv-scrubber-line"><div class="cv-scrubber-fill"></div></div></div>
          <div class="cv-buttons">
            <div class="cv-toggle-play"><svg class="cv-btn cv-icon-play" viewBox="0 0 24 24" style="display:none;"><path d="M8 5v14l11-7z"/></svg><svg class="cv-btn cv-icon-pause" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg></div>
            <div class="cv-toggle-mute"><svg class="cv-btn cv-icon-mute" viewBox="0 0 24 24" style="display:none;"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg><svg class="cv-btn cv-icon-unmute" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg></div>
          </div>`;

        const wrapper = video.parentNode;
        if(getComputedStyle(wrapper).position === 'static') wrapper.style.position = 'relative';
        wrapper.appendChild(ui);

        const playBtn = ui.querySelector('.cv-toggle-play');
        const muteBtn = ui.querySelector('.cv-toggle-mute');
        const scrubber = ui.querySelector('.cv-scrubber-track');
        const fill = ui.querySelector('.cv-scrubber-fill');
        const iPlay = playBtn.querySelector('.cv-icon-play');
        const iPause = playBtn.querySelector('.cv-icon-pause');
        const iMute = muteBtn.querySelector('.cv-icon-mute');
        const iUnmute = muteBtn.querySelector('.cv-icon-unmute');

        let isScrubbing = false;

        playBtn.addEventListener('click', (e) => { e.stopPropagation(); if(video.paused) video.play(); else video.pause(); });
        muteBtn.addEventListener('click', (e) => { e.stopPropagation(); video.muted = !video.muted; });

        const seek = (e) => {
           const rect = scrubber.getBoundingClientRect();
           const clientX = e.touches ? e.touches[0].clientX : e.clientX;
           let pos = (clientX - rect.left) / rect.width;
           if(pos < 0) pos = 0; if(pos > 1) pos = 1;
           if(video.duration) { video.currentTime = pos * video.duration; fill.style.width = (pos * 100) + '%'; }
        };
        const startScrub = (e) => { e.stopPropagation(); if(e.type !== 'mousedown') e.preventDefault(); isScrubbing = true; seek(e); };
        const moveScrub = (e) => { if(isScrubbing) { if(e.type !== 'mousemove') e.preventDefault(); seek(e); } };
        const stopScrub = () => { isScrubbing = false; };

        scrubber.addEventListener('mousedown', startScrub);
        document.addEventListener('mousemove', moveScrub);
        document.addEventListener('mouseup', stopScrub);
        scrubber.addEventListener('click', (e) => e.stopPropagation());

        const updateState = () => {
           if(video.paused) { iPlay.style.display = 'block'; iPause.style.display = 'none'; }
           else { iPlay.style.display = 'none'; iPause.style.display = 'block'; }
           if(video.muted) { iMute.style.display = 'block'; iUnmute.style.display = 'none'; }
           else { iMute.style.display = 'none'; iUnmute.style.display = 'block'; }
        };
        video.addEventListener('play', updateState);
        video.addEventListener('pause', updateState);
        video.addEventListener('volumechange', updateState);
        video.addEventListener('timeupdate', () => { if(!isScrubbing && video.duration) fill.style.width = ((video.currentTime / video.duration) * 100) + '%'; });
        updateState();

        target.addEventListener('click', (e) => {
           if(isScrubbing || e.target.closest('.custom-video-ui')) return;
           e.preventDefault(); e.stopPropagation();

           if(video.muted) {
              video.muted = false; video.volume = 0.5;
              window.videoGlobalUnmute = true;
              if(video.paused) video.play();
           } else {
              video.muted = true;
           }
        });

        let idleTimer;
        const hideUI = () => { ui.style.opacity = '0'; ui.style.visibility = 'hidden'; target.style.cursor = 'none'; };
        const showUI = () => { ui.style.opacity = '1'; ui.style.visibility = 'visible'; target.style.cursor = 'default'; clearTimeout(idleTimer); idleTimer = setTimeout(hideUI, 1000); };

        target.addEventListener('mousemove', showUI);
        target.addEventListener('mouseenter', () => {
          showUI();
          if (window.videoGlobalUnmute) {
             video.muted = false;
             video.volume = 0.5;
          }
        });
        target.addEventListener('mouseleave', () => {
          hideUI();
          video.muted = true;
          clearTimeout(idleTimer);
        });
      }
      target.dataset.uiHandled = "true";
    });
  };

  setInterval(initCustomUI, 1500);
})();

/* ================================================= */
/* 3. TEXT ANIMATION RESTORED (FIXES MISSING TEXT)   */
/* ================================================= */
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
      else entry.target.classList.remove('in-view');
    });
  }, { threshold: 0.05, rootMargin: "-20px" });

  setInterval(() => {
     document.querySelectorAll('.sqs-block-html, .sqs-block-image').forEach(el => observer.observe(el));
  }, 1000);
})();

/* ================================================= */
/* 4. HOMEPAGE BACKGROUND LINKER (FIXED)             */
/* ================================================= */
(function() {
  if (!document.body.classList.contains('homepage')) return;

  const linkBackgrounds = () => {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
      if (section.dataset.bgLinked) return;

      const textLink = section.querySelector('.sqs-block-html a');

      if (textLink) {
        section.style.cursor = 'pointer';
        section.addEventListener('click', (e) => {
          if (e.target.closest('a') || e.target.closest('.custom-video-ui')) return;
          window.location.href = textLink.href;
        });
        section.dataset.bgLinked = "true";
      }
    });
  };

  linkBackgrounds();
  setInterval(linkBackgrounds, 2000);
})();
}

if (window.__JDC_VIDEO_V2_ENABLED__) {
window.JDC_POSTERS = {
  "01cf1f30-f776-4c12-b875-317556ea587c": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/e024cc4a-c01e-4671-b430-f30b5f497079/01cf1f30-armando-young-prizefighter.jpg",
  "022de493-40c7-4154-a29f-384be407b074": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/da2354c2-c9a5-4fb3-8cf9-373d0fb2eafd/022de493-siberia-hills-lookbook.jpg",
  "04a6e835-4333-44c8-9371-fe856603b3c0": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/24fe5542-f096-4526-9bdc-faafb131b67b/04a6e835-amber-mark-out-of-this-world.jpg",
  "07132cec-1df9-4133-8a13-4a28afa7efaa": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/a669fe20-3b70-46b2-9a9d-1f55cc374456/07132cec-lovb-adidas.jpg",
  "07257d2f-870b-47ca-b96a-d56b26191fcb": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/fbaf4861-3312-4b0e-963f-b0af233ffec9/07257d2f-wynn-awakening.jpg",
  "0bb72f6a-74b8-4130-97f4-8c3c7eade70c": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/1ec8d5f1-e83d-4415-8ecd-d8f617c5f884/0bb72f6a-siberia-hills-lookbook.jpg",
  "0caab0b7-b429-4840-b26e-ae1c06db3ed8": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/3e987b8c-eb70-4c18-90c5-0a29d20eec3c/0caab0b7-tech.jpg",
  "0e764c18-3c49-4820-8dd1-e05116de7c4d": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/3dec4555-f31a-49af-a867-f6f6b2a5c645/0e764c18-bright-eyes-mariana-trench.jpg",
  "0fbbd3f2-ab5f-4c6f-bf83-1a6f716a6487": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/4413d319-73c0-45a4-9198-45174a8a870d/0fbbd3f2-nike-aja-sabrina.jpg",
  "13e63c0c-0ff8-476e-ab6b-45679130a4fe": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/fb93a02a-2501-465b-9c1b-397dbc4c0187/13e63c0c-kombilesa-mi-los-peinados.jpg",
  "14c221d2-d4b1-4bfd-baf5-784fd3d45d82": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/922d0664-c20c-4313-90ec-307331f49230/14c221d2-polymarket-make-your-own-market.jpg",
  "16c0fece-f3f8-4cb8-a60a-398c0669dfe4": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/93252948-1823-47fd-8ff8-1f1faa43a6eb/16c0fece-spotify-hip-hop-classics.jpg",
  "17745a68-44f3-4a45-b3dd-789fb1cddc05": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/be15b85d-4040-48de-b620-cb725c17e569/17745a68-tech.jpg",
  "1afd7cf7-f7eb-4345-9614-e989d5ea7aac": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/2ddc62c1-d91a-4eb4-a7e5-b9431f153054/1afd7cf7-bombas-spring-campaign.jpg",
  "1ba67a9c-081f-49f2-91b5-f70d57250d01": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/7b93d4c1-87e5-4775-b95e-998a2d5b0c6b/1ba67a9c-tech.jpg",
  "1d9bd042-3957-4c17-b472-214633973ffb": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/4fe1149b-2b82-4ad5-a54f-7411eadd6df6/1d9bd042-nike-aja-sabrina.jpg",
  "210e0681-2ffe-4c6a-b67f-c8441b6b31b5": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/169acee5-1b5b-4336-9300-6fe915d5bb15/210e0681-nike-aja-sabrina.jpg",
  "229157cc-c2eb-4231-8f1a-3bbd256dc316": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/6e60e12c-5f12-4ac6-ba04-ea585bb9e0df/229157cc-thom-yorke-last-i-heard.jpg",
  "23239866-e8b1-4c2c-8132-c0ee306b5dd6": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/047a38e9-6198-4560-88d8-97b6831d715e/23239866-nike-aja-sabrina.jpg",
  "27e4c31e-d11e-4359-9703-ff34a1c064ee": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/5aa7137f-b514-467f-b68d-4175a59f2d2c/27e4c31e-bombas-spring.jpg",
  "2acacb1c-6b84-416b-8994-7c6fe9622eae": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/314773f3-aa7b-45ac-88fb-14161e71afa5/2acacb1c-diamond-terrifier-action-fortress.jpg",
  "2bd13f1a-46d7-49df-bcbe-96e481f267be": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/51905bb8-dee7-4daf-956b-4f2b38ffd352/2bd13f1a-bombas-spring.jpg",
  "378cff19-7f11-4e2a-b701-dc3061475a4d": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/00d629eb-dfee-4f41-a7bb-f696255a628f/378cff19-spotify-hip-hop-classics.jpg",
  "37fcbc55-c6c6-46f1-ac58-6ce54da3d46f": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/5c3557b2-1df0-4027-a8c6-d03f88fabda6/37fcbc55-siberia-hills-lookbook.jpg",
  "398da2c2-90a7-4caf-8d40-a5c35b839320": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/a2b4097c-7f80-4e8a-8373-d88618fde54e/398da2c2-celeste-everyday.jpg",
  "3b58e12f-1a34-43bc-81db-7c64cedb68cd": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/14817582-3b8c-4672-b776-bca2a2d17ecb/3b58e12f-kelsey-lu-boys-noize-ride-or-die.jpg",
  "3b76b000-8a29-4aee-915d-858c0b1d1a42": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/29162fa8-9ed2-46e4-8544-9d9cbeb36353/3b76b000-polymarket-commercial.jpg",
  "41a705e0-e118-4f6e-bf45-f4585403b442": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/27eec08a-00a9-4466-acda-0d52e824d1e9/41a705e0-hulu-black-twitter-graphics.jpg",
  "43ad8f38-2795-45e1-ac47-43bcb8a935a6": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/23670475-1894-4090-a64b-80efc07eb089/43ad8f38-awakening-the-first-day.jpg",
  "460e4fcf-17dc-4a28-8da5-422463b21d8b": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/39dfd37c-7ad4-4774-b329-0293d71e6fb7/460e4fcf-siberia-hills-lookbook.jpg",
  "477191e0-7531-4b97-862c-56c1b0f8710a": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/58d90714-992c-4161-8b37-8d92ea9cdd89/477191e0-alignment-documentary.jpg",
  "4827aa1e-51d5-4b05-89d6-9a149fcc7728": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/45f608e1-44f2-4129-aba5-173bc284ee53/4827aa1e-bombas-spring.jpg",
  "49d7cacc-7149-46db-bc4d-010e1499e15d": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/dcc0191e-930c-4bcf-8bdf-f64612b8ef01/49d7cacc-hbo-shaq.jpg",
  "4c67c71c-5a65-4b8b-9051-4d309b41a59b": "https://jdc4444.github.io/jdc-video-pilot/media/4c67c71c-5a65-4b8b-9051-4d309b41a59b/v2-visible-start/poster.jpg",
  "4ca78e76-34c6-4d27-8a56-44cd3d65f673": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/252cc0a5-2b43-4bbc-b34c-608f7f527f8b/4ca78e76-siberia-hills-lookbook.jpg",
  "4cce7eaa-c9f9-499b-ab46-5ed510903833": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/4bf54827-7d05-4ed0-aa6d-23094384799f/4cce7eaa-bombas-spring.jpg",
  "51b8b69a-3f9b-41ac-a707-c550b218bebb": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/b9fcb0d6-77f8-42b9-be9a-0df34ca81edd/51b8b69a-siberia-hills-lookbook.jpg",
  "52552a86-e839-459b-b5d0-26218324489e": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/07531906-5ff5-498c-9d0a-de50b5f10b42/52552a86-lovb-adidas.jpg",
  "5502ebf4-7fa8-4a70-aad1-5f0e427667df": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/9754ea74-20b8-419b-a9f9-c78c23411a94/5502ebf4-bon-iver-day-one.jpg",
  "5534b4f2-b8e8-4cb8-8343-dc4634f86239": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/4c97c879-851d-4846-a2ef-f69d55c09e92/5534b4f2-laufey-tour-visuals.jpg",
  "56d1726f-dc13-4596-951d-a630bb754b1f": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/81c26a91-fc6c-4291-bd0c-b4067b8f1dbb/56d1726f-mitski-a-pearl.jpg",
  "57943004-8026-477d-8ecb-7d2b1e3ee29d": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/b3c11577-5bfd-4406-bfdb-81890b48a6b7/57943004-siberia-hills-lookbook.jpg",
  "591f9c82-8312-48e4-9192-eb42334a3820": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/1fc3534f-a69a-4fdd-84ac-84fd4097a7b7/591f9c82-case-studies.jpg",
  "613999fb-68be-4d45-b16f-25967c2cde19": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/97a31df5-2119-42c5-ac73-a20d10727d23/613999fb-shaq-hbo-graphics.jpg",
  "6307f97a-8c88-461d-8606-3f0ca6ed3cca": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/d951ef61-96f1-400a-af66-53032ac7b397/6307f97a-kombilesa-mi-los-peinados.jpg",
  "63457b5f-aa5c-417f-b7e1-c482982a6646": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/27574f3c-1996-4174-a7e0-4e70ff3cd383/63457b5f-siberia-hills-lookbook.jpg",
  "64cfc131-94f2-425f-9c65-4698933514b8": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/e8194d6e-d9a7-4156-a286-b7e561b925f7/64cfc131-alignment-documentary.jpg",
  "6ecd1580-8713-496d-b3d3-a3af1a99c927": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/78bfa6e5-aa0f-4a47-8819-632ebe66b1a4/6ecd1580-leave-one-volleyball.jpg",
  "6f6b9b33-4f7e-41b7-8997-806b3e3dd779": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/287b5013-c999-4c97-b88f-b27c0a7d9add/6f6b9b33-amber-mark-out-of-this-world.jpg",
  "724514d6-eaed-47ac-b4ce-95e776d7de6b": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/efc0ad64-b39e-4060-bc2d-683f1eb1ff5a/724514d6-siberia-hills-lookbook.jpg",
  "757b7b53-188b-4a7e-912d-ce6fda95f78b": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/889a82f3-5c6e-4222-bc60-b2773df68d8f/757b7b53-laufey-tour-visuals.jpg",
  "77c60549-63d1-4cd0-963b-00c0590cfb85": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/3bf7cc3f-4a56-47af-bbf4-80dbc5c70158/77c60549-gabriel-garzon-montano-acoustic-performances.jpg",
  "78a8a955-3e9f-4c28-afa2-83862143fb48": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/eb085706-a349-438b-90bc-3fbc1b7949a1/78a8a955-tech.jpg",
  "7b1fb21b-fb10-4d0b-b4ad-4884c4678ea4": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/0f9c1321-3d79-4b27-9348-c620b9c2aa80/7b1fb21b-mitski-a-pearl.jpg",
  "7c4d0d26-176a-4b68-9d96-b50be85fa963": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/e7346d19-9d62-46de-aab8-4be2057249ad/7c4d0d26-bombas-spring.jpg",
  "7e4f45ef-6cab-46df-988a-35fa3eca7b62": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/b638e6f0-3f7f-4e55-8b2b-8d8d3605da81/7e4f45ef-bombas-spring.jpg",
  "810f709b-4434-4da0-8528-393b8151500e": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/d829e5c3-f8bf-4438-aea2-a15dce5d166f/810f709b-bombas-dream-of-comfort.jpg",
  "81f65d79-209f-47bf-8c48-8b7bb204660b": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/6dee2d83-1ac5-48f8-9d13-86998ecdb446/81f65d79-bombas-spring.jpg",
  "8663b0eb-55ee-429b-ba0e-8557e216e4f5": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/b916c60b-9b1d-45c3-b1c1-42122a8d0921/8663b0eb-bombas-spring.jpg",
  "8673613f-639d-4112-9ee9-118843e73487": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/5d38d06a-8e20-4ef0-a81e-0082c36b7714/8673613f-gabriel-garzon-montano-acoustic.jpg",
  "86914fa6-e40d-4ccb-b557-966d0f36a8da": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/2c342394-2e3d-409c-af4d-0580eb40cd40/86914fa6-absolutely-paracosm.jpg",
  "88aa09b4-65ca-497c-8d4d-15c54b2335f9": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/c453dd7b-665b-44e5-9646-b00c54ff781c/88aa09b4-bombas-spring.jpg",
  "898e39cb-46f0-4f48-8509-5047bb937e58": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/584262a4-92c9-4f39-ab1a-e3fdb546c48d/898e39cb-tech.jpg",
  "8a2cda0d-0d51-4fbb-9167-99bfb997bb23": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/2fed1ad3-23fc-474f-839e-1be0d3a4b43b/8a2cda0d-bombas-spring.jpg",
  "8c69d810-20f3-437f-b545-2067f267630f": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/f955f8b7-1899-4319-b5b0-c2d4660995b7/8c69d810-polymarket-documentary.jpg",
  "904c4985-c1b1-4519-be0a-43050f2a9630": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/e262e30e-64d3-4b11-ab84-1b3de6e66d2a/904c4985-bright-eyes-mariana-trench.jpg",
  "90cf8a0d-bb12-4f1a-ad0b-204bdf285889": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/d993c405-47e7-4e53-8fb9-6bfb540ad538/90cf8a0d-bombas-spring.jpg",
  "92168202-0471-4e32-b5ad-aaf7a264452a": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/2f039278-2a23-416e-9ca3-1017b911c38b/92168202-spotify-hip-hop-classics.jpg",
  "930cc370-f192-49d7-9b0a-3c4208f67f22": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/ec4d5acd-79d8-496a-86ec-68b954f93e00/930cc370-bombas-spring.jpg",
  "9340c0e0-12c9-4ca7-a305-149c68f10acf": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/477ca114-53c6-4beb-8227-4bdade29cead/9340c0e0-nike-aja-sabrina.jpg",
  "9616c24b-c3cc-4f46-8e20-23e7a3830f52": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/1e92cf47-9c65-4605-aeac-cd15535c4648/9616c24b-lovb-adidas.jpg",
  "98fca04a-7159-4eac-a353-f64c3a108353": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/c7911e2a-0693-4eb6-b51a-2c4bb4591710/98fca04a-laufey-tour-visuals.jpg",
  "9aea1600-07e0-4c9d-847c-e1eb841c1069": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/b17dc4b9-4c23-46f5-b44d-f05697847cb6/9aea1600-lovb-adidas.jpg",
  "9d3472be-1575-4498-9abc-7ccc6bf75de2": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/1dcee482-b443-4660-8423-f8a6721677a2/9d3472be-tech.jpg",
  "9f20cb81-7c99-48df-b964-423360494531": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/eaf8b96d-0841-47b3-b7c2-a1034088b9c3/9f20cb81-bombas-spring.jpg",
  "a14688b6-e4c2-450a-bbd8-791291a25097": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/51f22bca-99f6-425a-8a4d-be0f75bf533f/a14688b6-gabriel-garzon-montano-acoustic-performances.jpg",
  "a7769f76-b8ea-441e-b4e0-550caafd9050": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/6c5e71f5-3eb4-420b-b0f9-6aad5cdb6364/a7769f76-tech.jpg",
  "a880ff3d-1c3e-4c20-8d3f-c725d00698e3": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/efcfdaea-13f3-47f5-82fd-3710b76a63c9/a880ff3d-bombas-spring.jpg",
  "abd8e6f6-52bb-4e14-9e42-84d42a4ca0dd": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/b228b5fc-0052-4be0-8e84-cd3158360c50/abd8e6f6-armando-young-belladonna.jpg",
  "ae59f18b-3f71-41e0-b22f-90ea367c5f3a": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/9ddc09e3-b9b7-432b-9cdf-41d0eb32f0b4/ae59f18b-siberia-hills-lookbook.jpg",
  "b256cc59-e6a8-4d9a-b035-428d8b457872": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/ad05c21e-7d59-4661-977a-224f84e67b17/b256cc59-bombas-spring.jpg",
  "b4e69304-f12e-4347-af33-3e05303acc7e": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/6207d246-cb8d-4598-a2fb-c88c9243dfa2/b4e69304-lovb-adidas.jpg",
  "b6f56952-67ec-4ea0-9e61-77413ca033d2": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/2d038c6f-1c18-48b3-abdf-0617611bb0a3/b6f56952-lovb-x-adidas.jpg",
  "b9b51322-980a-4522-a3aa-6e08c1b45ddd": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/8cdc6843-d36e-4312-a1ff-a5eae8326328/b9b51322-tech.jpg",
  "bd7ffb3a-2490-4803-bc98-d572c6e4ce91": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/fabfe3f1-fc75-463c-8424-11b6164b4aa6/bd7ffb3a-bombas-spring.jpg",
  "be702d74-314b-448c-89e5-1b33b4262932": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/bef2ace9-4297-44f5-9dd2-be73e2a81e2d/be702d74-kelsey-lu-boys-noize-ride-or-die.jpg",
  "be805e2e-0898-467c-9427-03822ab3c0dc": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/3c595cc1-cf6b-40a1-9cab-aca0d48bb6d6/be805e2e-bombas-spring.jpg",
  "bf043fca-6623-4f0e-b628-460f16053f30": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/934f1654-1d22-43db-9e0d-80ec0237fc4f/bf043fca-siberia-hills-lookbook.jpg",
  "c03fb192-12fc-4257-adcd-f12e4b640da2": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/c3f19316-01e7-4025-86a6-2f49e181d8ce/c03fb192-polymarket-documentary.jpg",
  "c07a7957-7369-4a2e-9e9d-a67314fcea3a": "https://jdc4444.github.io/jdc-video-pilot/media/c07a7957-7369-4a2e-9e9d-a67314fcea3a/v2-visible-start/poster.jpg",
  "c08b0c78-e086-4096-9985-7c3bc0c5114e": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/a247db8d-6888-47df-b9e0-75a2557e4416/c08b0c78-bombas-spring.jpg",
  "c0948cac-10ce-4881-8c0a-f70f041f6cfb": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/18108620-c3f6-4502-b9db-105413068837/c0948cac-nike-jordan-39.jpg",
  "c1e56f2c-33a3-4fb1-b221-a7c964548622": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/6d7c6ce3-72a1-4e49-9842-d4b3d4d1a10b/c1e56f2c-bon-iver-day-one.jpg",
  "c32c609a-125d-4a4d-979d-4f828b4ce28b": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/2f61547d-d416-400b-bc84-3a62af6fff99/c32c609a-lovb-launch.jpg",
  "c5babbbe-aa6c-46e5-b6b2-9b6caf4f2558": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/e15ae810-31a8-4dee-a64c-a212ce79865d/c5babbbe-bombas-spring.jpg",
  "c6d0e231-d085-4d4d-b1c7-6ea8b9e4853a": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/9cf798bb-5c3a-4bb3-9ae8-4d0b11dfbe94/c6d0e231-gabriel-garzon-montano-acoustic-performances.jpg",
  "c7b9e3e0-5dc5-475c-9de2-fb85378680d0": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/be1100d8-434f-4301-8134-edfdeeafc07d/c7b9e3e0-siberia-hills-lookbook.jpg",
  "c9139a30-4ee8-4b79-9ae5-f081af3f43d5": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/3dcd4ca6-457d-4eb4-9459-b2fc61bce61e/c9139a30-siberia-hills-lookbook.jpg",
  "ca8b291b-73b5-4c4d-ac1a-1462bbe956c5": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/3f857974-72f8-48d7-8036-a7b7714a52e6/ca8b291b-hulu-black-twitter.jpg",
  "cc69fc05-d021-44b6-9c23-84a73f79f2ea": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/7ffa0a41-e38a-4846-a626-7a818d144fba/cc69fc05-netflix-kings-of-tupelo.jpg",
  "cd307136-6bb9-43d9-8495-8af7ce5684cd": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/42353dd4-4c0b-4450-9048-77975ae8af9c/cd307136-siberia-hills-lookbook.jpg",
  "d1da6b8b-1e04-4762-b8cf-2c7c3f628bb4": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/326472a5-125b-4955-aac8-d2fe4683f8e9/d1da6b8b-nike-jordan-39.jpg",
  "d684e4b1-9e3a-4594-b9ed-b5876fa116fd": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/aa37e621-99dc-4aec-be27-c9f24e744f1b/d684e4b1-gabriel-garzon-montano-aguita.jpg",
  "d69fa373-f1bd-4edb-9a33-1f88e4d9e3d3": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/dbe7b2f2-1cac-4023-949b-23525e018069/d69fa373-siberia-hills-lookbook.jpg",
  "d8159dfa-1d50-4e71-b910-c97d573c1e17": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/079f32d9-9fdc-4a7d-9f0d-8592a4c3b876/d8159dfa-thom-yorke-last-i-heard.jpg",
  "dbfe5963-06be-42ba-ad12-53fb67cd9627": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/6d4071a7-32d1-4408-8e52-2045759a45d0/dbfe5963-tech.jpg",
  "dc827efa-9323-4c31-9621-0757ffffb6cb": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/dbd3f9c6-73c9-4d45-ba0c-7cb89bbc081f/dc827efa-lovb-adidas.jpg",
  "deeb729e-fa74-4ca2-903e-e1ddc5c49b6b": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/cbe83caa-b635-44f6-9df7-606c41f2f74b/deeb729e-spotify-hip-hop-classics.jpg",
  "df93c27e-5dd5-4b58-997d-6664af8af62d": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/c9450e84-e754-4f4a-aa9d-331eb09a57bb/df93c27e-alignment-documentary.jpg",
  "e900d19e-ae10-4142-8ab9-7f0cf9c900d8": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/4cb45434-fc20-446e-a423-a8d098a27fea/e900d19e-siberia-hills-lookbook.jpg",
  "ea306ce4-9f3d-4057-b5c9-953eff82c4b9": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/b6b8dbfe-fd26-4722-ab2c-03084ec33f62/ea306ce4-bombas-spring.jpg",
  "ed2b7d1e-36bb-4c44-9caf-4ce8b0b94255": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/4227de83-c0f7-4f2e-ad01-a2f9d107decd/ed2b7d1e-netflix-the-kings-of-tupelo.jpg",
  "edba3959-0eca-4ac9-a905-3509cf700da3": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/643be003-b682-40a5-8841-45a36080d23a/edba3959-armando-young-prizefighter.jpg",
  "edc2639e-d736-4107-8580-f3e1a864c81e": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/a651c16e-05d4-44b0-98d6-32d587b992af/edc2639e-gabriel-garzon-montano-aguita.jpg",
  "f2b6e655-df82-43f3-a5b2-37b03b255062": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/82680288-ea24-43ca-b4b5-60cb0d6cea01/f2b6e655-diamond-terrifier-action-fortress.jpg",
  "f30f9a87-0534-40cf-90a2-2a640b61bfb6": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/3ffe97a7-d8b1-4c5a-85d7-b3e88ff42d68/f30f9a87-bombas-spring.jpg",
  "f3502f3d-b76f-4b9c-96a1-d78ccf642691": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/cffca8f9-3f2e-4bb2-b1f4-6309e2097e22/f3502f3d-bon-iver-day-one.jpg",
  "f47d15d5-b1a3-4029-9d92-a3a46fd75748": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/9822fdd5-fe69-4aff-aecd-870d705d5b63/f47d15d5-bombas-dream-of-comfort.jpg",
  "f639e441-43ba-4ac7-84c0-b63c8f20af7b": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/81128560-7c00-4734-8b40-3d8bd355a1ca/f639e441-bombas-dream-of-comfort.jpg",
  "fc8b335a-bbab-426f-be91-bdbdd4798970": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/4ea39365-87d9-4262-b3cd-43a0b09c128c/fc8b335a-polymarket-documentary.jpg",
  "fdc694d9-7d0d-4e80-b49a-f27233bf9679": "https://images.squarespace-cdn.com/content/559d52abe4b0cebfa4f0b439/068c6626-04af-49bd-a480-457e2a1f87fe/fdc694d9-armando-young-belladonna.jpg"
};

window.JDC_VIDEO_PILOT = {
  "baseUrl": "https://jdc4444.github.io/jdc-video-pilot/",
  "routes": {
    "01cf1f30-f776-4c12-b875-317556ea587c": "media/01cf1f30-f776-4c12-b875-317556ea587c/master.m3u8",
    "04a6e835-4333-44c8-9371-fe856603b3c0": "media/04a6e835-4333-44c8-9371-fe856603b3c0/master.m3u8",
    "07257d2f-870b-47ca-b96a-d56b26191fcb": "media/07257d2f-870b-47ca-b96a-d56b26191fcb/master.m3u8",
    "0e764c18-3c49-4820-8dd1-e05116de7c4d": "media/0e764c18-3c49-4820-8dd1-e05116de7c4d/master.m3u8",
    "14c221d2-d4b1-4bfd-baf5-784fd3d45d82": "media/14c221d2-d4b1-4bfd-baf5-784fd3d45d82/master.m3u8",
    "16c0fece-f3f8-4cb8-a60a-398c0669dfe4": "media/16c0fece-f3f8-4cb8-a60a-398c0669dfe4/master.m3u8",
    "1afd7cf7-f7eb-4345-9614-e989d5ea7aac": "media/1afd7cf7-f7eb-4345-9614-e989d5ea7aac/master.m3u8",
    "229157cc-c2eb-4231-8f1a-3bbd256dc316": "media/229157cc-c2eb-4231-8f1a-3bbd256dc316/master.m3u8",
    "3b58e12f-1a34-43bc-81db-7c64cedb68cd": "media/3b58e12f-1a34-43bc-81db-7c64cedb68cd/master.m3u8",
    "49d7cacc-7149-46db-bc4d-010e1499e15d": "media/49d7cacc-7149-46db-bc4d-010e1499e15d/master.m3u8",
    "4c67c71c-5a65-4b8b-9051-4d309b41a59b": "media/4c67c71c-5a65-4b8b-9051-4d309b41a59b/v2-visible-start/master.m3u8",
    "56d1726f-dc13-4596-951d-a630bb754b1f": "media/56d1726f-dc13-4596-951d-a630bb754b1f/master.m3u8",
    "57943004-8026-477d-8ecb-7d2b1e3ee29d": "media/57943004-8026-477d-8ecb-7d2b1e3ee29d/master.m3u8",
    "6307f97a-8c88-461d-8606-3f0ca6ed3cca": "media/6307f97a-8c88-461d-8606-3f0ca6ed3cca/master.m3u8",
    "8673613f-639d-4112-9ee9-118843e73487": "media/8673613f-639d-4112-9ee9-118843e73487/master.m3u8",
    "9340c0e0-12c9-4ca7-a305-149c68f10acf": "media/9340c0e0-12c9-4ca7-a305-149c68f10acf/master.m3u8",
    "98fca04a-7159-4eac-a353-f64c3a108353": "media/98fca04a-7159-4eac-a353-f64c3a108353/master.m3u8",
    "c07a7957-7369-4a2e-9e9d-a67314fcea3a": "media/c07a7957-7369-4a2e-9e9d-a67314fcea3a/v2-visible-start/master.m3u8",
    "c32c609a-125d-4a4d-979d-4f828b4ce28b": "media/c32c609a-125d-4a4d-979d-4f828b4ce28b/master.m3u8",
    "ca8b291b-73b5-4c4d-ac1a-1462bbe956c5": "media/ca8b291b-73b5-4c4d-ac1a-1462bbe956c5/master.m3u8",
    "cc69fc05-d021-44b6-9c23-84a73f79f2ea": "media/cc69fc05-d021-44b6-9c23-84a73f79f2ea/master.m3u8",
    "d1da6b8b-1e04-4762-b8cf-2c7c3f628bb4": "media/d1da6b8b-1e04-4762-b8cf-2c7c3f628bb4/master.m3u8",
    "df93c27e-5dd5-4b58-997d-6664af8af62d": "media/df93c27e-5dd5-4b58-997d-6664af8af62d/master.m3u8",
    "edc2639e-d736-4107-8580-f3e1a864c81e": "media/edc2639e-d736-4107-8580-f3e1a864c81e/master.m3u8",
    "f2b6e655-df82-43f3-a5b2-37b03b255062": "media/f2b6e655-df82-43f3-a5b2-37b03b255062/master.m3u8",
    "f3502f3d-b76f-4b9c-96a1-d78ccf642691": "media/f3502f3d-b76f-4b9c-96a1-d78ccf642691/master.m3u8",
    "f47d15d5-b1a3-4029-9d92-a3a46fd75748": "media/f47d15d5-b1a3-4029-9d92-a3a46fd75748/master.m3u8",
    "fc8b335a-bbab-426f-be91-bdbdd4798970": "media/fc8b335a-bbab-426f-be91-bdbdd4798970/master.m3u8",
    "fdc694d9-7d0d-4e80-b49a-f27233bf9679": "media/fdc694d9-7d0d-4e80-b49a-f27233bf9679/master.m3u8"
  }
};

/* JDC demand-loaded HLS player. Requires jdc_header_video_gate.js to run first. */
(function () {
  "use strict";
  if (window.__JDC_SMART_VIDEO__) return;

  var HLS_JS_URL = "https://cdn.jsdelivr.net/npm/hls.js@1.7.1/dist/hls.min.js";
  var queryParams = new URLSearchParams(window.location.search);
  var pilotQuery = queryParams.get("jdc-video-pilot");
  var projectSpacingQuery = queryParams.get("jdc-project-spacing");
  var pilotConfig = window.JDC_VIDEO_PILOT || {};
  var pilotRoutes = pilotConfig.routes || {};
  var pilotBaseUrl = String(pilotConfig.baseUrl || "");
  var projectPage = window.location.pathname !== "/";
  var bombasProject = /^\/bombas-spring\/?$/.test(window.location.pathname) || queryParams.get("jdc-bombas-playlist") === "1";
  var pilotEnabled = pilotQuery !== "0" && !!pilotBaseUrl && window.location.pathname === "/";
  var projectSpacingEnabled = projectSpacingQuery !== "0" && projectPage;
  var connection = window.JDC_NETWORK_OVERRIDE || navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
  var effectiveType = String(connection.effectiveType || "").toLowerCase();
  var downlink = Number(connection.downlink || 0);
  var rtt = Number(connection.rtt || 0);
  var saveData = !!connection.saveData;
  var reducedMotion = !!window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var forceLow = saveData || effectiveType === "slow-2g" || effectiveType === "2g";
  var posterOnly = saveData || reducedMotion;
  var conservative = forceLow || effectiveType === "3g";
  var turbo = !posterOnly && !conservative && downlink >= 10 && (rtt === 0 || rtt <= 75);
  var visibleLimit = conservative ? 1 : 2;
  var preloadAhead = posterOnly ? 0 : conservative ? 1 : turbo ? 2 : 1;
  var preloadBehind = posterOnly || conservative ? 0 : 1;
  var maxActive = visibleLimit + preloadAhead + preloadBehind;
  var posterMap = window.JDC_POSTERS || {};
  var states = new Map();
  var visible = new Map();
  var activeStates = new Set();
  var startingStates = new Set();
  var desiredStates = new Set();
  var desiredOrder = [];
  var denseGallery = false;
  var galleryStartLimit = conservative ? 1 : 2;
  var galleryStartTimeout = Number(window.JDC_GALLERY_START_TIMEOUT) || (conservative ? 15000 : 10000);
  var galleryVisibleCount = 0;
  var galleryPeakStarting = 0;
  var galleryStartSequence = 0;
  var hlsPromise = null;
  var retryDelays = [1200, 3000, 8000];
  var hoverAudioPointer = window.matchMedia("(hover:hover) and (pointer:fine)");
  var hoverAudioEnabled = false;
  var hoverAudioBlocked = false;
  var bombasHighSourceCache = new Map();
  var bombasPrewarmCache = new Map();
  var bombasLeadPreloadAhead = posterOnly ? 0 : turbo ? 2 : 1;
  var BOMBAS_LEAD_ID = "69830d1dd969c935e4cff608";
  var BOMBAS_PLAYLIST_IDS = [
    "69831dfe42a89a75365ed7d6", "69831941383f4c6ac98dccd8", "6983196131e177390dc79fad",
    "6983199f13bccc4312ff3b06", "6983198c6ce4af36f32b9eea", "6983199534b0e62d46594408",
    "69831c1e354ad72ce5abadd0", "69831a800996c359619fddc5", "698319b76ce4af36f32ba4fa",
    "698319d4735abc74f7c4ce17", "698319cb62655f65698889c9", "698319540996c359619fbb5a",
    "69831ac90baebf2d9bd5ac03", "69831abe3ee1dd7c1e438a5d", "698319778a3301472d3b3253",
    "69831a8cbebb38507cf336cc", "6983194c708e544def3d2fe0", "698319de20827368275171f5",
    "6983196b19e5c542555720ea", "698319aaf1ec3c7c8728b618", "698319c0991ebd5edd34a505"
  ];
  var LAUFEY_GALLERY_CLIPS = [
    { number: 1, duration: 17.386, poster: "https://jdc4444.github.io/jdc-video-pilot/media/laufey/gallery/posters/laufey-1-first.jpg" },
    { number: 2, duration: 11.050, poster: "https://jdc4444.github.io/jdc-video-pilot/media/laufey/gallery/posters/laufey-2-first.jpg" },
    { number: 3, duration: 13.056, poster: "https://jdc4444.github.io/jdc-video-pilot/media/laufey/gallery/posters/laufey-3-first.jpg" },
    { number: 4, duration: 20.522, poster: "https://jdc4444.github.io/jdc-video-pilot/media/laufey/gallery/posters/laufey-4-first.jpg" },
    { number: 5, duration: 9.664, poster: "https://jdc4444.github.io/jdc-video-pilot/media/laufey/gallery/posters/laufey-5-first.jpg" },
    { number: 6, duration: 21.824, poster: "https://jdc4444.github.io/jdc-video-pilot/media/laufey/gallery/posters/laufey-6-first.jpg" },
    { number: 7, duration: 27.370, poster: "https://jdc4444.github.io/jdc-video-pilot/media/laufey/gallery/posters/laufey-7-first.jpg" },
    { number: 8, duration: 15.296, poster: "https://jdc4444.github.io/jdc-video-pilot/media/laufey/gallery/posters/laufey-8-first.jpg" }
  ];
  var POLYMARKET_GALLERY_CLIPS = [
    { number: 1, duration: 4.880, poster: "https://jdc4444.github.io/jdc-video-pilot/media/polymarket/gallery/posters/polymarket-gallery-1-first.jpg" },
    { number: 2, duration: 13.200, poster: "https://jdc4444.github.io/jdc-video-pilot/media/polymarket/gallery/posters/polymarket-gallery-2-first.jpg" },
    { number: 3, duration: 5.760, poster: "https://jdc4444.github.io/jdc-video-pilot/media/polymarket/gallery/posters/polymarket-gallery-3-first.jpg" },
    { number: 4, duration: 7.520, poster: "https://jdc4444.github.io/jdc-video-pilot/media/polymarket/gallery/posters/polymarket-gallery-4-first.jpg" },
    { number: 5, duration: 11.040, poster: "https://jdc4444.github.io/jdc-video-pilot/media/polymarket/gallery/posters/polymarket-gallery-5-first.jpg" },
    { number: 6, duration: 4.240, poster: "https://jdc4444.github.io/jdc-video-pilot/media/polymarket/gallery/posters/polymarket-gallery-6-first.jpg" },
    { number: 7, duration: 3.840, poster: "https://jdc4444.github.io/jdc-video-pilot/media/polymarket/gallery/posters/polymarket-gallery-7-first.jpg" }
  ];
  var LIMN_GALLERY_CLIPS = [
    { number: 1, duration: 4.967, poster: "https://jdc4444.github.io/jdc-video-pilot/media/limn/gallery/posters/limn-gallery-01-first.jpg" },
    { number: 2, duration: 3.500, poster: "https://jdc4444.github.io/jdc-video-pilot/media/limn/gallery/posters/limn-gallery-02-first.jpg" },
    { number: 3, duration: 7.433, poster: "https://jdc4444.github.io/jdc-video-pilot/media/limn/gallery/posters/limn-gallery-03-first.jpg" },
    { number: 4, duration: 16.633, poster: "https://jdc4444.github.io/jdc-video-pilot/media/limn/gallery/posters/limn-gallery-04-first.jpg" },
    { number: 5, duration: 13.733, poster: "https://jdc4444.github.io/jdc-video-pilot/media/limn/gallery/posters/limn-gallery-05-first.jpg" },
    { number: 6, duration: 21.067, poster: "https://jdc4444.github.io/jdc-video-pilot/media/limn/gallery/posters/limn-gallery-06-first.jpg" },
    { number: 7, duration: 39.333, poster: "https://jdc4444.github.io/jdc-video-pilot/media/limn/gallery/posters/limn-gallery-07-first.jpg" },
    { number: 8, duration: 18.033, poster: "https://jdc4444.github.io/jdc-video-pilot/media/limn/gallery/posters/limn-gallery-08-first.jpg" },
    { number: 9, duration: 28.367, poster: "https://jdc4444.github.io/jdc-video-pilot/media/limn/gallery/posters/limn-gallery-09-first.jpg" },
    { number: 10, duration: 51.333, poster: "https://jdc4444.github.io/jdc-video-pilot/media/limn/gallery/posters/limn-gallery-10-first.jpg" },
    { number: 11, duration: 19.967, poster: "https://jdc4444.github.io/jdc-video-pilot/media/limn/gallery/posters/limn-gallery-11-first.jpg" },
    { number: 12, duration: 18.367, poster: "https://jdc4444.github.io/jdc-video-pilot/media/limn/gallery/posters/limn-gallery-12-first.jpg" }
  ];
  window.videoGlobalUnmute = false;

  function installProjectSpacing() {
    if (!projectSpacingEnabled || document.body.classList.contains("sqs-edit-mode")) return;
    var article = document.querySelector("article.page-regions");
    var engine = article && article.querySelector("section[data-fluid-engine-section] .fluid-engine");
    if (!engine) return;
    var introSection = engine.closest("section[data-fluid-engine-section]");
    var gallerySection = introSection && introSection.nextElementSibling;
    var galleryEngine = bombasProject && gallerySection && gallerySection.querySelector(".fluid-engine");
    var galleryBlocks = galleryEngine ? Array.prototype.slice.call(galleryEngine.children).filter(function (element) {
      return element.classList && element.classList.contains("fe-block");
    }) : [];

    var wrappers = Array.prototype.slice.call(engine.children).filter(function (element) {
      return element.classList && element.classList.contains("fe-block");
    });
    var lead = wrappers.find(function (element) { return element.querySelector(".sqs-block-video"); });
    var title = wrappers.find(function (element) { return element.querySelector(".sqs-block-html h1, .sqs-block-html h2, .sqs-block-html h3"); });
    var body = wrappers.find(function (element) {
      return element !== title && element.querySelector(".sqs-block-html p");
    });
    if (!lead || !title || !body) return;
    var trailing = wrappers.filter(function (element) {
      return element !== lead && element !== title && element !== body;
    });
    var heading = title.querySelector("h1, h2, h3");
    if (!heading) return;
    var leadShell = lead.querySelector(".sqs-block-video") || lead;
    function currentLeadMedia() {
      return lead.querySelector(".native-video-player") || lead.querySelector(".jdc-video-stage") || leadShell;
    }
    var header = document.querySelector("header#header");
    if (!header) return;

    if (!document.getElementById("jdc-project-spacing-styles")) {
      var style = document.createElement("style");
      style.id = "jdc-project-spacing-styles";
      style.textContent = [
        ".jdc-project-spacing .jdc-project-spacing-engine{transform:translateY(var(--jdc-project-top-shift,0px))!important}",
        ".jdc-project-spacing .jdc-project-spacing-engine>.jdc-project-following-block{translate:0 var(--jdc-project-media-shift,0px)!important}",
        ".jdc-project-spacing .jdc-bombas-gallery-section .jdc-bombas-gallery-block{translate:0 var(--jdc-bombas-gallery-block-shift,0px)!important}",
        ".jdc-project-spacing .jdc-project-info-band{display:flex!important;flex-wrap:wrap!important;align-items:flex-start!important;align-content:flex-start!important;column-gap:clamp(24px,3vw,48px)!important;row-gap:16px!important;box-sizing:border-box!important;min-width:0!important;min-height:min-content!important;overflow:visible!important;transform:translateY(var(--jdc-project-spacing-shift,0px))!important;z-index:4}",
        ".jdc-project-spacing .jdc-project-info-band>.jdc-project-title-block,.jdc-project-spacing .jdc-project-info-band>.jdc-project-body-block{position:relative!important;inset:auto!important;box-sizing:border-box!important;height:auto!important;min-height:0!important;transform:none!important;align-self:flex-start!important}",
        ".jdc-project-spacing .jdc-project-info-band>.jdc-project-title-block{flex:1 1 var(--jdc-project-title-basis,420px)!important;min-width:min(100%,var(--jdc-project-title-basis,420px))!important}",
        ".jdc-project-spacing .jdc-project-info-band>.jdc-project-body-block{flex:0 1 clamp(260px,28vw,360px)!important;min-width:min(100%,260px)!important}",
        ".jdc-project-spacing .jdc-project-info-band>.fe-block>.sqs-block,.jdc-project-spacing .jdc-project-info-band>.fe-block .sqs-block-content,.jdc-project-spacing .jdc-project-info-band>.fe-block .sqs-text-block-container,.jdc-project-spacing .jdc-project-info-band>.fe-block .sqs-html-content{height:auto!important;min-height:0!important}",
        ".jdc-project-spacing .jdc-project-title-block h1,.jdc-project-spacing .jdc-project-title-block h2,.jdc-project-spacing .jdc-project-title-block h3{margin:0!important;width:100%!important;max-width:none!important;transform:none!important;transform-origin:left top!important;white-space:normal!important;overflow-wrap:break-word!important}",
        ".jdc-project-spacing .jdc-project-info-band.jdc-project-info-stacked{flex-direction:column!important;flex-wrap:nowrap!important}",
        ".jdc-project-spacing .jdc-project-info-band.jdc-project-info-stacked>.jdc-project-title-block,.jdc-project-spacing .jdc-project-info-band.jdc-project-info-stacked>.jdc-project-body-block{flex:0 0 auto!important;width:100%!important;min-width:0!important}",
        "@media(min-width:768px){.jdc-project-spacing .jdc-project-info-band>.jdc-project-title-block{padding-left:clamp(40px,6vw,96px)!important}.jdc-project-spacing .jdc-project-info-band:not(.jdc-project-info-stacked)>.jdc-project-body-block .sqs-block-html{box-sizing:border-box!important;padding-left:clamp(20px,2.25vw,36px)!important}.jdc-project-spacing .jdc-project-info-band.jdc-project-info-stacked>.jdc-project-body-block{padding-left:clamp(40px,6vw,96px)!important}.jdc-project-spacing .jdc-project-info-band.jdc-project-info-stacked>.jdc-project-body-block .sqs-block-html{padding-left:0!important}}",
        "@media(max-width:767px){.jdc-project-spacing .jdc-project-info-band{flex-direction:column!important;flex-wrap:nowrap!important;column-gap:0!important;row-gap:16px!important}.jdc-project-spacing .jdc-project-info-band>.jdc-project-title-block,.jdc-project-spacing .jdc-project-info-band>.jdc-project-body-block{flex:0 0 auto!important;width:100%!important;min-width:0!important;padding-left:0!important}.jdc-project-spacing .jdc-project-info-band>.jdc-project-body-block .sqs-block-html{padding-left:0!important}}"
      ].join("");
      document.head.appendChild(style);
    }

    document.body.classList.add("jdc-project-spacing");
    engine.classList.add("jdc-project-spacing-engine");
    lead.classList.add("jdc-project-lead-block");
    title.classList.add("jdc-project-title-block");
    body.classList.add("jdc-project-body-block");
    trailing.forEach(function (element) { element.classList.add("jdc-project-following-block"); });
    if (galleryBlocks.length) {
      gallerySection.classList.add("jdc-bombas-gallery-section");
      galleryBlocks.forEach(function (element) { element.classList.add("jdc-bombas-gallery-block"); });
    }
    var infoBand = document.createElement("div");
    infoBand.className = "jdc-project-info-band";
    title.parentNode.insertBefore(infoBand, title);
    infoBand.appendChild(title);
    infoBand.appendChild(body);

    [
      ["margin", "0"],
      ["width", "100%"],
      ["max-width", "none"],
      ["transform", "none"],
      ["transform-origin", "left top"],
      ["white-space", "normal"],
      ["overflow-wrap", "break-word"]
    ].forEach(function (pair) { heading.style.setProperty(pair[0], pair[1], "important"); });

    var pending = false;
    var rerun = false;
    var measureCanvas = document.createElement("canvas");
    var measureContext = measureCanvas.getContext("2d");
    function pixel(value) {
      return Number.parseFloat(value) || 0;
    }
    function setPixel(element, property, value) {
      element.style.setProperty(property, Math.round(value * 100) / 100 + "px");
    }
    function gridArea(element) {
      var values = getComputedStyle(element).gridArea.split("/").map(function (value) {
        return Number.parseInt(value, 10);
      });
      return values.length === 4 && values.every(Number.isFinite) ? values : null;
    }
    function setInfoGrid(desktop) {
      var titleArea = gridArea(title);
      var bodyArea = gridArea(body);
      if (!titleArea || !bodyArea) return;
      var followingStarts = trailing.map(gridArea).filter(Boolean).map(function (area) { return area[0]; }).filter(function (start) {
        return start > titleArea[0];
      });
      var nextStart = followingStarts.length ? Math.min.apply(Math, followingStarts) : Infinity;
      var rowEnd = titleArea[2];
      if (!Number.isFinite(nextStart) || (bodyArea[0] >= titleArea[0] && bodyArea[2] <= nextStart)) {
        rowEnd = Math.max(rowEnd, bodyArea[2]);
      }
      var columnStart = Math.min(titleArea[1], bodyArea[1]);
      var columnEnd = Math.max(titleArea[3], bodyArea[3]);
      infoBand.style.setProperty("grid-area", [titleArea[0], columnStart, rowEnd, columnEnd].join(" / "), "important");

      var fontSize = desktop
        ? Math.min(36, Math.max(31, window.innerWidth * 0.027))
        : Math.min(34, Math.max(28, window.innerWidth * 0.075));
      heading.style.setProperty("font-size", Math.round(fontSize * 100) / 100 + "px", "important");
      heading.style.setProperty("line-height", "1.08", "important");
      var headingStyle = getComputedStyle(heading);
      var intrinsicWidth = 0;
      if (measureContext) {
        measureContext.font = headingStyle.font;
        intrinsicWidth = measureContext.measureText(heading.textContent.trim()).width;
        var letterSpacing = pixel(headingStyle.letterSpacing);
        if (letterSpacing) intrinsicWidth += Math.max(0, heading.textContent.trim().length - 1) * letterSpacing;
      }
      var titlePadding = desktop ? Math.min(96, Math.max(40, window.innerWidth * 0.06)) : 0;
      var titleBasis = Math.max(420, Math.ceil(intrinsicWidth + titlePadding));
      infoBand.style.setProperty("--jdc-project-title-basis", titleBasis + "px");
      infoBand.classList.remove("jdc-project-info-stacked");
      var titleRect = title.getBoundingClientRect();
      var bodyRect = body.getBoundingClientRect();
      var stacked = !desktop || bodyRect.top > titleRect.top + 2;
      infoBand.classList.toggle("jdc-project-info-stacked", stacked);
      document.body.setAttribute("data-jdc-project-info-flow", stacked ? "stacked" : "side-by-side");
    }
    function headerTextBottom(headerRect) {
      var rectangles = Array.prototype.slice.call(header.querySelectorAll("a, .header-title, .header-nav-item")).map(function (element) {
        return { element: element, rect: element.getBoundingClientRect() };
      }).filter(function (item) {
        var text = item.element.textContent.trim().toLowerCase();
        return text && text !== "skip to content" && item.rect.width > 0 && item.rect.height > 0 &&
          item.rect.left >= -1 && item.rect.right <= window.innerWidth + 1 &&
          item.rect.top >= headerRect.top - 1 && item.rect.bottom <= headerRect.bottom + 1;
      }).map(function (item) { return item.rect.bottom; });
      return rectangles.length ? Math.max.apply(Math, rectangles) : headerRect.bottom;
    }
    function visibleMedia(element) {
      return element.querySelector(".native-video-player") ||
        element.querySelector(".jdc-video-stage") ||
        element.querySelector(".sqs-block-video") ||
        element.querySelector(".sqs-block-image img") ||
        element.querySelector("img") || element;
    }
    function placeFollowingMedia(gap) {
      trailing.forEach(function (element) { element.style.removeProperty("--jdc-project-media-shift"); });
      var items = trailing.map(function (element, index) {
        var area = gridArea(element);
        return { element: element, media: visibleMedia(element), row: area ? area[0] : index + 10000, index: index };
      }).sort(function (left, right) { return left.row - right.row || left.index - right.index; });
      var rows = [];
      items.forEach(function (item) {
        var row = rows[rows.length - 1];
        if (!row || row.key !== item.row) {
          row = { key: item.row, items: [] };
          rows.push(row);
        }
        row.items.push(item);
      });
      var desiredTop = infoBand.getBoundingClientRect().bottom + gap;
      var lastBottom = infoBand.getBoundingClientRect().bottom;
      var shifts = [];
      rows.forEach(function (row) {
        var currentTop = Math.min.apply(Math, row.items.map(function (item) {
          return item.media.getBoundingClientRect().top;
        }));
        var shift = desiredTop - currentTop;
        row.items.forEach(function (item) { setPixel(item.element, "--jdc-project-media-shift", shift); });
        lastBottom = Math.max.apply(Math, row.items.map(function (item) {
          return item.media.getBoundingClientRect().bottom;
        }));
        desiredTop = lastBottom + gap;
        shifts.push(shift);
      });
      return { lastBottom: lastBottom, shifts: shifts, media: items.map(function (item) { return item.media; }) };
    }
    function placeBombasGallery(gap) {
      if (!bombasProject || !introSection || !gallerySection || !galleryBlocks.length || !gallerySection.querySelector(".sqs-block-video")) return null;
      introSection.style.removeProperty("margin-bottom");
      galleryBlocks.forEach(function (element) { element.style.removeProperty("--jdc-bombas-gallery-block-shift"); });
      var textBottom = Math.max(title.getBoundingClientRect().bottom, body.getBoundingClientRect().bottom);
      var firstGalleryMedia = gallerySection.querySelector(".sqs-block-video");
      var sectionShift = textBottom + gap - gallerySection.getBoundingClientRect().top;
      setPixel(introSection, "margin-bottom", Math.min(0, sectionShift));
      var blockShift = gallerySection.getBoundingClientRect().top - firstGalleryMedia.getBoundingClientRect().top;
      galleryBlocks.forEach(function (element) { setPixel(element, "--jdc-bombas-gallery-block-shift", blockShift); });
      var actualGap = firstGalleryMedia.getBoundingClientRect().top - textBottom;
      var overlap = textBottom - gallerySection.getBoundingClientRect().top;
      return { shift: Math.min(0, sectionShift), blockShift: blockShift, gap: actualGap, overlap: overlap };
    }
    function schedule() {
      if (pending) {
        rerun = true;
        return;
      }
      pending = true;
      requestAnimationFrame(function () {
        var desktop = window.matchMedia("(min-width:768px)").matches;
        setInfoGrid(desktop);
        var gap = desktop ? Math.min(52, Math.max(32, window.innerWidth * 0.03)) : 24;
        engine.style.removeProperty("padding-bottom");
        engine.style.removeProperty("margin-bottom");
        if (bombasProject && introSection) introSection.style.removeProperty("margin-bottom");
        trailing.forEach(function (element) { element.style.removeProperty("--jdc-project-media-shift"); });
        var headerRect = header.getBoundingClientRect();
        var leadMedia = currentLeadMedia();
        var leadRect = leadMedia.getBoundingClientRect();
        var engineStyle = getComputedStyle(engine);
        var currentTopShift = pixel(engineStyle.getPropertyValue("--jdc-project-top-shift"));
        var headerBottom = headerTextBottom(headerRect);
        var topDelta = headerBottom + gap - leadRect.top;
        setPixel(engine, "--jdc-project-top-shift", currentTopShift + topDelta);

        leadRect = leadMedia.getBoundingClientRect();
        var infoRect = infoBand.getBoundingClientRect();
        var infoStyle = getComputedStyle(infoBand);
        var currentInfoShift = pixel(infoStyle.getPropertyValue("--jdc-project-spacing-shift"));
        var infoDelta = leadRect.bottom + gap - infoRect.top;
        setPixel(infoBand, "--jdc-project-spacing-shift", currentInfoShift + infoDelta);

        var flow = placeFollowingMedia(gap);
        var engineRect = engine.getBoundingClientRect();
        var contentBottom = Math.max(leadMedia.getBoundingClientRect().bottom, infoBand.getBoundingClientRect().bottom, flow.lastBottom);
        var endShift = contentBottom + gap - engineRect.bottom;
        setPixel(engine, "padding-bottom", Math.max(0, endShift));
        setPixel(engine, "margin-bottom", Math.min(0, endShift));
        leadRect = currentLeadMedia().getBoundingClientRect();
        currentTopShift = pixel(getComputedStyle(engine).getPropertyValue("--jdc-project-top-shift"));
        topDelta = headerBottom + gap - leadRect.top;
        setPixel(engine, "--jdc-project-top-shift", currentTopShift + topDelta);
        var bombasGalleryFlow = placeBombasGallery(gap);
        document.body.setAttribute("data-jdc-project-spacing", desktop ? "desktop" : "mobile");
        document.body.setAttribute("data-jdc-project-edge-gap", Math.round(gap * 100) / 100);
        document.body.setAttribute("data-jdc-project-header-bottom", Math.round(headerBottom * 100) / 100);
        document.body.setAttribute("data-jdc-project-media-shifts", flow.shifts.map(function (value) {
          return Math.round(value * 100) / 100;
        }).join(","));
        document.body.setAttribute("data-jdc-project-end-shift", Math.round(endShift * 100) / 100);
        if (bombasGalleryFlow) {
          document.body.setAttribute("data-jdc-bombas-gallery-shift", Math.round(bombasGalleryFlow.shift * 100) / 100);
          document.body.setAttribute("data-jdc-bombas-gallery-block-shift", Math.round(bombasGalleryFlow.blockShift * 100) / 100);
          document.body.setAttribute("data-jdc-bombas-gallery-gap", Math.round(bombasGalleryFlow.gap * 100) / 100);
          document.body.setAttribute("data-jdc-bombas-gallery-overlap", Math.round(bombasGalleryFlow.overlap * 100) / 100);
        }
        pending = false;
        if (rerun) {
          rerun = false;
          schedule();
        }
      });
    }

    window.addEventListener("resize", schedule, { passive: true });
    if (window.ResizeObserver) {
      var resizeObserver = new ResizeObserver(schedule);
      resizeObserver.observe(header);
      resizeObserver.observe(leadShell);
      resizeObserver.observe(currentLeadMedia());
      resizeObserver.observe(infoBand);
      resizeObserver.observe(title);
      resizeObserver.observe(body);
      trailing.forEach(function (element) { resizeObserver.observe(visibleMedia(element)); });
      window.__JDC_PROJECT_SPACING_OBSERVER__ = resizeObserver;
    }
    var mutationObserver = new MutationObserver(function () {
      if (resizeObserver) resizeObserver.observe(currentLeadMedia());
      schedule();
    });
    mutationObserver.observe(lead, { childList: true, subtree: true });
    window.__JDC_PROJECT_SPACING_MUTATION_OBSERVER__ = mutationObserver;
    ["loadedmetadata", "loadeddata", "canplay", "resize"].forEach(function (eventName) {
      lead.addEventListener(eventName, schedule, true);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
    window.addEventListener("load", schedule, { once: true });
    [120, 350, 800, 1600, 3200, 6000].forEach(function (delay) { setTimeout(schedule, delay); });
    var settleStarted = Date.now();
    var settleTimer = setInterval(function () {
      schedule();
      if (Date.now() - settleStarted >= 15000) clearInterval(settleTimer);
    }, 500);
    window.__JDC_PROJECT_SPACING_SETTLE_TIMER__ = settleTimer;
    schedule();
  }

  function installBlockAspectStyles() {
    if (document.getElementById("jdc-project-aspect-ratios")) return;
    var style = document.createElement("style");
    style.id = "jdc-project-aspect-ratios";
    style.textContent = [
      ".jdc-video-shell.jdc-video-block{width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:var(--jdc-video-aspect,16/9)!important;background-size:contain}",
      ".jdc-video-shell.jdc-video-block>.native-video-player,.jdc-video-shell.jdc-video-block>.jdc-video-stage{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;min-height:0!important;padding:0!important;padding-bottom:0!important;aspect-ratio:var(--jdc-video-aspect,16/9)!important}",
      ".jdc-video-shell.jdc-video-block video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:contain!important}",
      ".jdc-video-shell.jdc-video-background>.native-video-player,.jdc-video-shell.jdc-video-background>.jdc-video-stage{z-index:2!important}",
      "@media(min-width:768px) and (orientation:landscape){.jdc-project-spacing .jdc-project-lead-block .jdc-video-shell.jdc-video-portrait-lead{width:min(100%,var(--jdc-portrait-lead-width))!important;margin-left:auto!important;margin-right:auto!important}}"
    ].join("");
    document.head.appendChild(style);
  }

  function installLaufeyGallery() {
    if (!/^\/laufey-tour-visuals\/?$/.test(window.location.pathname)) return false;

    var clipsByNumber = new Map();
    document.querySelectorAll("[data-jdc-video]").forEach(function (shell) {
      var config = parse(shell, "data-jdc-video");
      var duration = Number(config && config.durationSeconds);
      if (!Number.isFinite(duration)) return;
      var match = LAUFEY_GALLERY_CLIPS.reduce(function (best, candidate) {
        var difference = Math.abs(duration - candidate.duration);
        return !best || difference < best.difference ? { clip: candidate, difference: difference } : best;
      }, null);
      if (!match || match.difference > 0.35 || clipsByNumber.has(match.clip.number)) return;
      clipsByNumber.set(match.clip.number, {
        shell: shell,
        config: config,
        number: match.clip.number,
        poster: match.clip.poster
      });
    });
    if (![1, 2, 3, 4, 5, 6, 7].every(function (number) { return clipsByNumber.has(number); })) return false;

    var clips = Array.from(clipsByNumber.values()).sort(function (a, b) { return a.number - b.number; });
    var section = clips[0].shell.closest(".page-section, section");
    if (!section || !clips.every(function (clip) { return clip.shell.closest(".page-section, section") === section; })) return false;
    var previousSection = section.previousElementSibling;
    if (previousSection && previousSection.matches(".page-section, section") && !previousSection.querySelector(".sqs-block, [data-jdc-native-video]")) {
      previousSection.classList.add("jdc-laufey-empty-section");
      previousSection.setAttribute("aria-hidden", "true");
    }

    clips.forEach(function (clip) {
      clip.shell.setAttribute("data-jdc-poster", clip.poster);
      clip.shell.setAttribute("data-jdc-laufey-clip", String(clip.number));
    });

    var contentWrapper = section.querySelector(":scope > .content-wrapper") || section.querySelector(".content-wrapper");
    if (!contentWrapper) return false;
    var content = contentWrapper.querySelector(":scope > .content") || contentWrapper;
    var wrappers = clips.map(function (clip) { return clip.shell.closest(".fe-block") || clip.shell; });
    if (new Set(wrappers).size !== clips.length) return false;

    if (!document.getElementById("jdc-laufey-gallery-styles")) {
      var style = document.createElement("style");
      style.id = "jdc-laufey-gallery-styles";
      style.textContent = [
        ".jdc-laufey-gallery-section{min-height:0!important;height:auto!important}",
        ".jdc-laufey-empty-section{display:none!important}",
        ".jdc-laufey-gallery-section>.content-wrapper{display:block!important;box-sizing:border-box!important;min-height:0!important;padding-top:clamp(20px,2.2vw,34px)!important;padding-bottom:clamp(20px,2.2vw,34px)!important}",
        ".jdc-laufey-gallery-section>.content-wrapper>.content,.jdc-laufey-gallery-section>.content-wrapper>.fluid-engine{display:none!important}",
        ".jdc-laufey-gallery-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:clamp(10px,1.2vw,18px)!important;width:100%!important;box-sizing:border-box!important}",
        ".jdc-laufey-gallery-grid>.jdc-laufey-gallery-item{position:relative!important;inset:auto!important;grid-area:auto!important;transform:none!important;width:100%!important;height:auto!important;min-width:0!important;min-height:0!important}",
        ".jdc-laufey-gallery-grid>.jdc-laufey-gallery-item>.sqs-block{box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;padding:0!important}",
        ".jdc-laufey-gallery-grid .sqs-block-content{height:auto!important;min-height:0!important}",
        ".jdc-laufey-gallery-grid [data-jdc-video]{display:block!important;width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:16/9!important;background-position:center!important;background-size:cover!important}",
        "@media(max-width:1023px){.jdc-laufey-gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}",
        "@media(max-width:767px){.jdc-laufey-gallery-section>.content-wrapper{padding-top:14px!important;padding-bottom:14px!important}.jdc-laufey-gallery-grid{grid-template-columns:1fr!important;gap:12px!important}}"
      ].join("");
      document.head.appendChild(style);
    }

    var grid = section.querySelector(":scope > .content-wrapper > .jdc-laufey-gallery-grid");
    if (!grid) {
      grid = document.createElement("div");
      grid.className = "jdc-laufey-gallery-grid";
      content.appendChild(grid);
    }
    grid.setAttribute("data-jdc-laufey-gallery-count", String(clips.length));
    grid.setAttribute("data-jdc-laufey-gallery-expected", "8");
    wrappers.forEach(function (wrapper, index) {
      wrapper.classList.add("jdc-laufey-gallery-item");
      wrapper.setAttribute("data-jdc-laufey-order", String(clips[index].number));
    });
    var currentWrappers = Array.prototype.slice.call(grid.children);
    if (wrappers.some(function (wrapper, index) { return currentWrappers[index] !== wrapper; })) {
      wrappers.forEach(function (wrapper) { grid.appendChild(wrapper); });
    }
    section.classList.add("jdc-laufey-gallery-section");
    section.setAttribute("data-jdc-laufey-gallery", clipsByNumber.has(8) ? "ready" : "processing-clip-8");
    return true;
  }

  function installPolymarketGallery() {
    if (!/^\/polymarket-make-your-own-market\/?$/.test(window.location.pathname)) return false;

    var clipsByNumber = new Map();
    document.querySelectorAll("[data-jdc-video]").forEach(function (shell) {
      var config = parse(shell, "data-jdc-video");
      var duration = Number(config && config.durationSeconds);
      if (!Number.isFinite(duration)) return;
      var match = POLYMARKET_GALLERY_CLIPS.reduce(function (best, candidate) {
        var difference = Math.abs(duration - candidate.duration);
        return !best || difference < best.difference ? { clip: candidate, difference: difference } : best;
      }, null);
      if (!match || match.difference > 0.35 || clipsByNumber.has(match.clip.number)) return;
      clipsByNumber.set(match.clip.number, {
        shell: shell,
        config: config,
        number: match.clip.number,
        poster: match.clip.poster
      });
    });
    if (![1, 2, 3, 4, 5, 6].every(function (number) { return clipsByNumber.has(number); })) return false;

    var clips = Array.from(clipsByNumber.values()).sort(function (a, b) { return a.number - b.number; });
    var section = clips[0].shell.closest(".page-section, section");
    if (!section || !clips.every(function (clip) { return clip.shell.closest(".page-section, section") === section; })) return false;

    clips.forEach(function (clip) {
      clip.shell.setAttribute("data-jdc-poster", clip.poster);
      clip.shell.setAttribute("data-jdc-polymarket-clip", String(clip.number));
    });

    var content = section.querySelector(":scope > .content-wrapper") || section.querySelector(".content-wrapper");
    if (!content) return false;
    var wrappers = clips.map(function (clip) { return clip.shell.closest(".fe-block") || clip.shell; });
    if (new Set(wrappers).size !== clips.length) return false;

    if (!document.getElementById("jdc-polymarket-gallery-styles")) {
      var style = document.createElement("style");
      style.id = "jdc-polymarket-gallery-styles";
      style.textContent = [
        ".jdc-polymarket-gallery-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:clamp(10px,1.2vw,18px)!important;width:100%!important;box-sizing:border-box!important;margin-top:clamp(20px,2.2vw,34px)!important;margin-bottom:clamp(20px,2.2vw,34px)!important}",
        ".jdc-polymarket-gallery-grid>.jdc-polymarket-gallery-item{position:relative!important;inset:auto!important;grid-area:auto!important;transform:none!important;width:100%!important;height:auto!important;min-width:0!important;min-height:0!important}",
        ".jdc-polymarket-gallery-grid>.jdc-polymarket-gallery-item>.sqs-block{box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;padding:0!important}",
        ".jdc-polymarket-gallery-grid .sqs-block-content{height:auto!important;min-height:0!important}",
        ".jdc-polymarket-gallery-grid [data-jdc-video]{display:block!important;width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:16/9!important;background-position:center!important;background-size:cover!important}",
        "@media(max-width:1023px){.jdc-polymarket-gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}",
        "@media(max-width:767px){.jdc-polymarket-gallery-grid{grid-template-columns:1fr!important;gap:12px!important;margin-top:14px!important;margin-bottom:14px!important}}"
      ].join("");
      document.head.appendChild(style);
    }

    var grid = content.querySelector(":scope > .jdc-polymarket-gallery-grid");
    if (!grid) {
      grid = document.createElement("div");
      grid.className = "jdc-polymarket-gallery-grid";
      content.appendChild(grid);
    }
    grid.setAttribute("data-jdc-polymarket-gallery-count", String(clips.length));
    wrappers.forEach(function (wrapper, index) {
      wrapper.classList.add("jdc-polymarket-gallery-item");
      wrapper.setAttribute("data-jdc-polymarket-order", String(clips[index].number));
    });
    var currentWrappers = Array.prototype.slice.call(grid.children);
    if (wrappers.some(function (wrapper, index) { return currentWrappers[index] !== wrapper; })) {
      wrappers.forEach(function (wrapper) { grid.appendChild(wrapper); });
    }
    section.classList.add("jdc-polymarket-gallery-section");
    section.setAttribute("data-jdc-polymarket-gallery", "ready");
    return true;
  }

  function installLimnGallery() {
    if (!/^\/tobias-rees-limn\/?$/.test(window.location.pathname)) return false;

    var clipsByNumber = new Map();
    document.querySelectorAll("[data-jdc-video]").forEach(function (shell) {
      var config = parse(shell, "data-jdc-video");
      var duration = Number(config && config.durationSeconds);
      if (!Number.isFinite(duration)) return;
      var match = LIMN_GALLERY_CLIPS.reduce(function (best, candidate) {
        var difference = Math.abs(duration - candidate.duration);
        return !best || difference < best.difference ? { clip: candidate, difference: difference } : best;
      }, null);
      if (!match || match.difference > 0.35 || clipsByNumber.has(match.clip.number)) return;
      clipsByNumber.set(match.clip.number, {
        shell: shell,
        config: config,
        number: match.clip.number,
        poster: match.clip.poster
      });
    });
    if (!LIMN_GALLERY_CLIPS.every(function (clip) { return clipsByNumber.has(clip.number); })) return false;

    var clips = Array.from(clipsByNumber.values()).sort(function (a, b) { return a.number - b.number; });
    var section = clips[0].shell.closest(".page-section, section");
    if (!section || !clips.every(function (clip) { return clip.shell.closest(".page-section, section") === section; })) return false;

    clips.forEach(function (clip) {
      clip.shell.setAttribute("data-jdc-poster", clip.poster);
      clip.shell.setAttribute("data-jdc-limn-clip", String(clip.number));
    });

    var content = section.querySelector(":scope > .content-wrapper") || section.querySelector(".content-wrapper");
    if (!content) return false;
    var wrappers = clips.map(function (clip) { return clip.shell.closest(".fe-block") || clip.shell; });
    if (new Set(wrappers).size !== clips.length) return false;

    if (!document.getElementById("jdc-limn-gallery-styles")) {
      var style = document.createElement("style");
      style.id = "jdc-limn-gallery-styles";
      style.textContent = [
        ".jdc-limn-gallery-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:clamp(10px,1.2vw,18px)!important;width:100%!important;box-sizing:border-box!important;margin-top:clamp(20px,2.2vw,34px)!important;margin-bottom:clamp(20px,2.2vw,34px)!important}",
        ".jdc-limn-gallery-grid>.jdc-limn-gallery-item{position:relative!important;inset:auto!important;grid-area:auto!important;transform:none!important;width:100%!important;height:auto!important;min-width:0!important;min-height:0!important}",
        ".jdc-limn-gallery-grid>.jdc-limn-gallery-item>.sqs-block{box-sizing:border-box!important;width:100%!important;height:auto!important;min-height:0!important;padding:0!important}",
        ".jdc-limn-gallery-grid .sqs-block-content{height:auto!important;min-height:0!important}",
        ".jdc-limn-gallery-grid [data-jdc-video]{display:block!important;width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:var(--jdc-video-aspect,2/1)!important;background-position:center!important;background-size:contain!important}",
        "@media(max-width:767px){.jdc-limn-gallery-grid{grid-template-columns:1fr!important;gap:12px!important;margin-top:14px!important;margin-bottom:14px!important}}"
      ].join("");
      document.head.appendChild(style);
    }

    var grid = content.querySelector(":scope > .jdc-limn-gallery-grid");
    if (!grid) {
      grid = document.createElement("div");
      grid.className = "jdc-limn-gallery-grid";
      content.appendChild(grid);
    }
    grid.setAttribute("data-jdc-limn-gallery-count", String(clips.length));
    wrappers.forEach(function (wrapper, index) {
      wrapper.classList.add("jdc-limn-gallery-item");
      wrapper.setAttribute("data-jdc-limn-order", String(clips[index].number));
    });
    var currentWrappers = Array.prototype.slice.call(grid.children);
    if (wrappers.some(function (wrapper, index) { return currentWrappers[index] !== wrapper; })) {
      wrappers.forEach(function (wrapper) { grid.appendChild(wrapper); });
    }
    section.classList.add("jdc-limn-gallery-section");
    section.setAttribute("data-jdc-limn-gallery", "ready");
    return true;
  }

  function parse(element, attribute) {
    try { return JSON.parse(element.getAttribute(attribute) || "{}"); }
    catch (error) { console.warn("JDC video config could not be parsed", error); return null; }
  }

  function squarespaceHlsUrl(config) {
    return String(config.alexandriaUrl || "").replace("{variant}", "playlist.m3u8");
  }

  function pilotHlsUrl(config) {
    var route = pilotRoutes[config.systemDataId];
    if (!pilotEnabled || !route) return "";
    try { return new URL(String(route), pilotBaseUrl).href; }
    catch (error) { return ""; }
  }

  function hlsUrl(state) {
    var pilotUrl = !state.pilotFailed && pilotHlsUrl(state.config);
    state.usingPilot = !!pilotUrl;
    state.shell.classList.toggle("jdc-video-pilot", state.usingPilot);
    return pilotUrl || squarespaceHlsUrl(state.config);
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
      document.head.appendChild(script);
    });
    return hlsPromise;
  }

  function setPoster(shell, config) {
    var poster = posterMap[config.systemDataId] || shell.getAttribute("data-jdc-poster");
    if (!poster) return;
    shell.style.setProperty("--jdc-poster", "url(\"" + String(poster).replace(/\"/g, "%22") + "\")");
  }

  function configuredAspect(config) {
    var ratio = Number(config && config.aspectRatio);
    if (Number.isFinite(ratio) && ratio > 0) return ratio;
    var firstVariant = String(config && config.systemDataVariants || "").split(",")[0].split(":");
    var width = Number(firstVariant[0]);
    var height = Number(firstVariant[1]);
    return Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0 ? width / height : 16 / 9;
  }

  function hasConfiguredAspect(config) {
    var ratio = Number(config && config.aspectRatio);
    return Number.isFinite(ratio) && ratio > 0;
  }

  function setBlockAspect(state, ratio, source) {
    if (!state || state.kind !== "block") return;
    ratio = Number(ratio);
    if (!Number.isFinite(ratio) || ratio <= 0) return;
    var value = String(Math.round(ratio * 100000000) / 100000000);
    state.shell.style.setProperty("--jdc-video-aspect", value);
    state.shell.style.setProperty("--jdc-portrait-lead-width", String(Math.round(ratio * 80 * 1000) / 1000) + "vh");
    var portraitLead = projectPage && ratio < 0.8 && !!state.shell.closest(".jdc-project-lead-block");
    state.shell.classList.toggle("jdc-video-portrait-lead", portraitLead);
    [
      ["width", "100%"], ["height", "auto"], ["min-height", "0"],
      ["aspect-ratio", value], ["background-size", "contain"]
    ].forEach(function (pair) { state.shell.style.setProperty(pair[0], pair[1], "important"); });
    if (portraitLead) state.shell.style.removeProperty("width");
    state.stage.style.setProperty("--jdc-video-aspect", value);
    [
      ["position", "absolute"], ["inset", "0"], ["width", "100%"],
      ["height", "100%"], ["min-height", "0"], ["padding", "0"],
      ["padding-bottom", "0"], ["aspect-ratio", value]
    ].forEach(function (pair) { state.stage.style.setProperty(pair[0], pair[1], "important"); });
    if (state.video) {
      [
        ["position", "absolute"], ["inset", "0"], ["width", "100%"],
        ["height", "100%"], ["object-fit", "contain"]
      ].forEach(function (pair) { state.video.style.setProperty(pair[0], pair[1], "important"); });
    }
    state.shell.setAttribute("data-jdc-aspect-source", source || "config");
  }

  function makeControls(state) {
    if (state.kind !== "block") return;
    var controls = document.createElement("div");
    controls.className = "jdc-video-controls";
    controls.innerHTML = '<button type="button" data-jdc-play>Pause</button><div class="jdc-video-progress" aria-hidden="true"><span></span></div><button type="button" data-jdc-mute>Sound</button>';
    state.shell.appendChild(controls);
    state.controls = controls;
    controls.querySelector("[data-jdc-play]").addEventListener("click", function (event) {
      event.stopPropagation();
      if (!state.video) return activate(state, true);
      state.video.paused ? state.video.play().catch(function () {}) : state.video.pause();
    });
    controls.querySelector("[data-jdc-mute]").addEventListener("click", function (event) {
      event.stopPropagation();
      toggleAudio(state);
    });
  }

  function publishHoverAudio() {
    var mode = hoverAudioPointer.matches ? (hoverAudioBlocked ? "gesture-required" : hoverAudioEnabled ? "enabled" : "hover-ready") : "click-only";
    if (document.body) document.body.setAttribute("data-jdc-hover-audio", mode);
    if (window.__JDC_SMART_VIDEO__) {
      window.__JDC_SMART_VIDEO__.hoverAudioAvailable = hoverAudioPointer.matches;
      window.__JDC_SMART_VIDEO__.hoverAudioEnabled = hoverAudioEnabled;
      window.__JDC_SMART_VIDEO__.hoverAudioBlocked = hoverAudioBlocked;
    }
  }

  function enableHoverAudio() {
    hoverAudioEnabled = true;
    hoverAudioBlocked = false;
    window.videoGlobalUnmute = true;
    publishHoverAudio();
  }

  function restoreMutedAfterBlockedHover(state, video) {
    if (!state || !state.video || state.video !== video) return;
    hoverAudioBlocked = true;
    hoverAudioEnabled = false;
    window.videoGlobalUnmute = false;
    video.muted = true;
    video.play().catch(function () {});
    updateControls(state);
    publishHoverAudio();
  }

  function unmuteState(state) {
    if (!state || !state.video) return;
    var video = state.video;
    video.volume = 0.5;
    video.muted = false;
    if (!video.paused) {
      setTimeout(function () {
        if (!state.video || state.video !== video || video.muted || !state.hovered) return;
        if (video.paused) restoreMutedAfterBlockedHover(state, video);
        else {
          hoverAudioBlocked = false;
          publishHoverAudio();
        }
      }, 180);
      return;
    }
    var playPromise = video.play();
    if (!playPromise || typeof playPromise.then !== "function") return;
    playPromise.then(function () {
      hoverAudioBlocked = false;
      publishHoverAudio();
    }).catch(function () {
      restoreMutedAfterBlockedHover(state, video);
    });
  }

  function toggleAudio(state) {
    if (!state) return;
    if (!state.video) {
      state.unmuteOnMount = true;
      enableHoverAudio();
      activate(state, true);
      return;
    }
    if (state.video.muted) {
      enableHoverAudio();
      unmuteState(state);
    } else {
      state.video.muted = true;
    }
    state.video.play().catch(function () {});
  }

  function updateControls(state) {
    if (!state.controls || !state.video) return;
    state.controls.querySelector("[data-jdc-play]").textContent = state.video.paused ? "Play" : "Pause";
    state.controls.querySelector("[data-jdc-mute]").textContent = state.video.muted ? "Sound" : "Mute";
    var progress = state.video.duration ? state.video.currentTime / state.video.duration * 100 : 0;
    state.controls.querySelector(".jdc-video-progress > span").style.width = progress + "%";
  }

  function publishLimits() {
    if (!window.__JDC_SMART_VIDEO__) return;
    window.__JDC_SMART_VIDEO__.visibleLimit = visibleLimit;
    window.__JDC_SMART_VIDEO__.preloadAhead = preloadAhead;
    window.__JDC_SMART_VIDEO__.preloadBehind = preloadBehind;
    window.__JDC_SMART_VIDEO__.maxActive = maxActive;
    window.__JDC_SMART_VIDEO__.projectPage = projectPage;
    window.__JDC_SMART_VIDEO__.denseGallery = denseGallery;
    window.__JDC_SMART_VIDEO__.galleryStartLimit = galleryStartLimit;
    window.__JDC_SMART_VIDEO__.galleryStartTimeout = galleryStartTimeout;
    window.__JDC_SMART_VIDEO__.galleryVisibleCount = galleryVisibleCount;
    window.__JDC_SMART_VIDEO__.galleryQueuedCount = desiredOrder.filter(function (state) {
      return !state.video && !state.retryTimer;
    }).length;
    window.__JDC_SMART_VIDEO__.galleryStartingCount = startingStates.size;
    window.__JDC_SMART_VIDEO__.galleryPeakStarting = galleryPeakStarting;
    if (document.body) {
      document.body.setAttribute("data-jdc-video-version", window.__JDC_SMART_VIDEO__.version);
      document.body.setAttribute("data-jdc-gallery-start-limit", galleryStartLimit);
      document.body.setAttribute("data-jdc-gallery-visible", galleryVisibleCount);
      document.body.setAttribute("data-jdc-gallery-queued", window.__JDC_SMART_VIDEO__.galleryQueuedCount);
      document.body.setAttribute("data-jdc-gallery-starting", startingStates.size);
      document.body.setAttribute("data-jdc-gallery-peak-starting", galleryPeakStarting);
      document.body.setAttribute("data-jdc-gallery-active", activeStates.size);
    }
  }

  function maybeExpandPreload(video) {
    if (denseGallery || posterOnly || conservative || preloadAhead >= 2) return;
    if (video.readyState < 3 || video.videoWidth < 1280) return;
    preloadAhead = 2;
    maxActive = visibleLimit + preloadAhead + preloadBehind;
    publishLimits();
    scheduleReconcile();
  }

  function releaseStartSlot(state, outcome) {
    if (!state) return;
    if (state.startupTimer) {
      clearTimeout(state.startupTimer);
      state.startupTimer = null;
    }
    if (!startingStates.delete(state)) return;
    state.starting = false;
    state.startupOutcome = outcome || "ready";
    state.shell.setAttribute("data-jdc-startup", state.startupOutcome);
    publishLimits();
    scheduleReconcile();
  }

  function reserveStartSlot(state) {
    if (!denseGallery || !state || state.starting) return;
    state.starting = true;
    state.startupOutcome = "starting";
    startingStates.add(state);
    galleryPeakStarting = Math.max(galleryPeakStarting, startingStates.size);
    galleryStartSequence += 1;
    state.shell.setAttribute("data-jdc-startup", "starting");
    state.shell.setAttribute("data-jdc-start-sequence", galleryStartSequence);
    state.startupTimer = setTimeout(function () {
      /* A slow or silent stream must not permanently block every clip behind it. */
      releaseStartSlot(state, "yielded-after-timeout");
    }, galleryStartTimeout);
    publishLimits();
  }

  function setBombasPlaylistClip(state, index) {
    if (!state || !state.bombasPlaylist || !state.bombasPlaylist.length) return;
    state.bombasPlaylistIndex = (index + state.bombasPlaylist.length) % state.bombasPlaylist.length;
    state.config = state.bombasPlaylist[state.bombasPlaylistIndex];
    state.shell.setAttribute("data-jdc-bombas-playlist-index", state.bombasPlaylistIndex + 1);
    state.shell.setAttribute("data-jdc-bombas-playlist-id", state.config.id || "");
    setPoster(state.shell, state.config);
  }

  function absoluteMediaUrl(value, baseUrl) {
    try { return new URL(String(value || ""), baseUrl).href; }
    catch (error) { return ""; }
  }

  function highestRendition(masterText, masterUrl) {
    var lines = String(masterText || "").split(/\r?\n/);
    var renditions = [];
    lines.forEach(function (line, index) {
      if (line.indexOf("#EXT-X-STREAM-INF:") !== 0) return;
      var resolution = /RESOLUTION=(\d+)x(\d+)/i.exec(line);
      var bandwidth = /(?:AVERAGE-)?BANDWIDTH=(\d+)/i.exec(line);
      var mediaLine = "";
      for (var next = index + 1; next < lines.length; next += 1) {
        if (!lines[next] || lines[next].charAt(0) === "#") continue;
        mediaLine = lines[next];
        break;
      }
      var url = absoluteMediaUrl(mediaLine, masterUrl);
      if (!url) return;
      var width = resolution ? Number(resolution[1]) : 0;
      var height = resolution ? Number(resolution[2]) : 0;
      renditions.push({
        url: url,
        width: width,
        height: height,
        bandwidth: bandwidth ? Number(bandwidth[1]) : 0
      });
    });
    renditions.sort(function (a, b) {
      return b.width * b.height - a.width * a.height || b.bandwidth - a.bandwidth;
    });
    if (renditions.length) return renditions[0];
    if (lines.some(function (line) { return line.indexOf("#EXTINF:") === 0; })) {
      return { url: masterUrl, width: 0, height: 0, bandwidth: 0 };
    }
    throw new Error("Bombas high-resolution rendition was not found");
  }

  function resolveBombasHighSource(config) {
    var key = String(config && (config.systemDataId || config.id) || "");
    if (bombasHighSourceCache.has(key)) return bombasHighSourceCache.get(key);
    var masterUrl = squarespaceHlsUrl(config || {});
    var request = fetch(masterUrl, { mode: "cors", credentials: "omit", cache: "force-cache" }).then(function (response) {
      if (!response.ok) throw new Error("Bombas master playlist returned " + response.status);
      return response.text();
    }).then(function (text) {
      var rendition = highestRendition(text, masterUrl);
      if (rendition.width && rendition.width < 1280) throw new Error("Bombas high-resolution rendition is below 1280 pixels wide");
      return rendition;
    }).catch(function (error) {
      bombasHighSourceCache.delete(key);
      throw error;
    });
    bombasHighSourceCache.set(key, request);
    return request;
  }

  function firstMediaRequest(mediaText, mediaUrl) {
    var lines = String(mediaText || "").split(/\r?\n/);
    var keyMatch = /#EXT-X-KEY:[^\n]*URI="([^"]+)"/i.exec(mediaText);
    var rangeLength = 0;
    var rangeOffset = 0;
    var segmentUrl = "";
    for (var index = 0; index < lines.length; index += 1) {
      if (lines[index].indexOf("#EXT-X-BYTERANGE:") === 0) {
        var range = /#EXT-X-BYTERANGE:(\d+)(?:@(\d+))?/.exec(lines[index]);
        rangeLength = range ? Number(range[1]) : 0;
        rangeOffset = range && range[2] ? Number(range[2]) : 0;
      }
      if (lines[index].indexOf("#EXTINF:") !== 0) continue;
      for (var next = index + 1; next < lines.length; next += 1) {
        if (lines[next].indexOf("#EXT-X-BYTERANGE:") === 0) {
          var pendingRange = /#EXT-X-BYTERANGE:(\d+)(?:@(\d+))?/.exec(lines[next]);
          rangeLength = pendingRange ? Number(pendingRange[1]) : 0;
          rangeOffset = pendingRange && pendingRange[2] ? Number(pendingRange[2]) : 0;
          continue;
        }
        if (!lines[next] || lines[next].charAt(0) === "#") continue;
        segmentUrl = absoluteMediaUrl(lines[next], mediaUrl);
        break;
      }
      if (segmentUrl) break;
    }
    return {
      keyUrl: keyMatch ? absoluteMediaUrl(keyMatch[1], mediaUrl) : "",
      segmentUrl: segmentUrl,
      rangeLength: rangeLength,
      rangeOffset: rangeOffset
    };
  }

  function prewarmBombasClip(config) {
    var key = String(config && (config.systemDataId || config.id) || "");
    if (!key) return Promise.resolve("skipped");
    if (bombasPrewarmCache.has(key)) return bombasPrewarmCache.get(key);
    var request = resolveBombasHighSource(config).then(function (rendition) {
      return fetch(rendition.url, { mode: "cors", credentials: "omit", cache: "force-cache" }).then(function (response) {
        if (!response.ok) throw new Error("Bombas high playlist returned " + response.status);
        return response.text().then(function (text) { return { text: text, url: response.url || rendition.url }; });
      });
    }).then(function (media) {
      var first = firstMediaRequest(media.text, media.url);
      var requests = [];
      if (first.keyUrl) {
        requests.push(fetch(first.keyUrl, { mode: "cors", credentials: "omit", cache: "force-cache" }).then(function (response) {
          if (!response.ok) throw new Error("Bombas key returned " + response.status);
          return response.arrayBuffer();
        }));
      }
      if (first.segmentUrl) {
        var headers = {};
        if (first.rangeLength > 0) headers.Range = "bytes=" + first.rangeOffset + "-" + (first.rangeOffset + first.rangeLength - 1);
        requests.push(fetch(first.segmentUrl, { mode: "cors", credentials: "omit", cache: "force-cache", headers: headers }).then(function (response) {
          if (!response.ok && response.status !== 206) throw new Error("Bombas segment returned " + response.status);
          return response.arrayBuffer();
        }));
      }
      return Promise.all(requests).then(function () { return "ready"; });
    }).catch(function (error) {
      bombasPrewarmCache.delete(key);
      throw error;
    });
    bombasPrewarmCache.set(key, request);
    return request;
  }

  function prewarmBombasUpcoming(state) {
    if (!state || !state.bombasPlaylistLead || !state.bombasPlaylist || !bombasLeadPreloadAhead) return;
    var targets = [];
    for (var offset = 1; offset <= bombasLeadPreloadAhead; offset += 1) {
      targets.push(state.bombasPlaylist[(state.bombasPlaylistIndex + offset) % state.bombasPlaylist.length]);
    }
    state.shell.setAttribute("data-jdc-bombas-preload-limit", bombasLeadPreloadAhead);
    state.shell.setAttribute("data-jdc-bombas-preload-ids", targets.map(function (config) { return config.id || ""; }).join(","));
    state.shell.setAttribute("data-jdc-bombas-preload-status", "warming");
    var preloadToken = state.shell.getAttribute("data-jdc-bombas-preload-ids");
    state.bombasPreloadToken = preloadToken;
    var chain = Promise.resolve();
    targets.forEach(function (config) {
      chain = chain.then(function () { return prewarmBombasClip(config); });
    });
    chain.then(function () {
      if (state.bombasPlaylistLead && state.bombasPreloadToken === preloadToken) state.shell.setAttribute("data-jdc-bombas-preload-status", "ready");
    }).catch(function () {
      if (state.bombasPlaylistLead && state.bombasPreloadToken === preloadToken) state.shell.setAttribute("data-jdc-bombas-preload-status", "retry-next-clip");
    });
  }

  function advanceBombasPlaylist(state) {
    if (!state || !state.bombasPlaylist || !state.bombasPlaylist.length || state.bombasAdvancing) return;
    state.bombasAdvancing = true;
    var carryAudio = !!(state.video && !state.video.muted && state.hovered && hoverAudioEnabled);
    unload(state);
    setBombasPlaylistClip(state, state.bombasPlaylistIndex + 1);
    state.unmuteOnMount = carryAudio;
    activate(state, true);
    state.bombasAdvancing = false;
  }

  function configureBombasPlaylist() {
    if (!bombasProject) return;
    var registered = Array.from(states.values()).filter(function (state) { return state.kind === "block"; });
    var lead = registered.find(function (state) {
      return state.bombasPlaylistLead || (state.config && state.config.id === BOMBAS_LEAD_ID);
    });
    if (!lead || lead.bombasPlaylistConfigured) return;
    var configsById = new Map();
    registered.forEach(function (state) {
      if (state.config && state.config.id) configsById.set(state.config.id, state.config);
    });
    var playlist = BOMBAS_PLAYLIST_IDS.map(function (id) { return configsById.get(id); }).filter(Boolean);
    if (playlist.length !== BOMBAS_PLAYLIST_IDS.length) return;
    lead.bombasPlaylistLead = true;
    lead.bombasPlaylistConfigured = true;
    lead.bombasOriginalConfig = lead.config;
    lead.bombasPlaylist = playlist;
    lead.bombasPlaylistIndex = -1;
    lead.shell.setAttribute("data-jdc-bombas-playlist", "true");
    lead.shell.setAttribute("data-jdc-bombas-playlist-count", playlist.length);
    lead.shell.setAttribute("data-jdc-bombas-playlist-order", BOMBAS_PLAYLIST_IDS.join(","));
    lead.shell.setAttribute("data-jdc-bombas-quality-policy", "highest-rendition-only");
    lead.shell.setAttribute("data-jdc-bombas-preload-limit", bombasLeadPreloadAhead);
    setBombasPlaylistClip(lead, 0);
  }

  function mountVideo(state) {
    var video = document.createElement("video");
    video.playsInline = true;
    video.muted = true;
    video.loop = !state.bombasPlaylistLead;
    video.preload = "metadata";
    video.setAttribute("aria-label", state.config.filename || "Portfolio video");
    state.stage.replaceChildren(video);
    state.video = video;
    state.unmuteOnPlaying = state.unmuteOnMount || (state.kind === "block" && state.hovered && hoverAudioEnabled && hoverAudioPointer.matches);
    state.unmuteOnMount = false;
    setBlockAspect(state, configuredAspect(state.config), hasConfiguredAspect(state.config) ? "config" : "variant");
    ["play", "pause", "volumechange", "timeupdate"].forEach(function (eventName) {
      video.addEventListener(eventName, function () { updateControls(state); });
    });
    video.addEventListener("playing", function () {
      state.retryCount = 0;
      state.shell.classList.add("jdc-video-playing");
      state.shell.classList.remove("jdc-video-poster-only");
      releaseStartSlot(state, "playing");
      maybeExpandPreload(video);
      if (state.unmuteOnPlaying && hoverAudioPointer.matches) {
        state.unmuteOnPlaying = false;
        if (state.hovered || window.videoGlobalUnmute) unmuteState(state);
      }
    });
    video.addEventListener("canplay", function () {
      state.shell.classList.add("jdc-video-ready");
      releaseStartSlot(state, "canplay");
      maybeExpandPreload(video);
      prewarmBombasUpcoming(state);
    }, { once: true });
    video.addEventListener("loadedmetadata", function () {
      if (!hasConfiguredAspect(state.config) && video.videoWidth && video.videoHeight) {
        setBlockAspect(state, video.videoWidth / video.videoHeight, "metadata");
      }
    }, { once: true });
    video.addEventListener("resize", function () {
      if (!hasConfiguredAspect(state.config) && video.videoWidth && video.videoHeight) {
        setBlockAspect(state, video.videoWidth / video.videoHeight, "metadata");
      }
      maybeExpandPreload(video);
    });
    video.addEventListener("error", function () { scheduleRetry(state); });
    video.addEventListener("ended", function () {
      if (state.bombasPlaylistLead && state.video === video) advanceBombasPlaylist(state);
    });
    return video;
  }

  function unload(state, preserveRetry) {
    if (!state) return;
    releaseStartSlot(state, "unloaded");
    if (!preserveRetry && state.retryTimer) {
      clearTimeout(state.retryTimer);
      state.retryTimer = null;
      state.retryCount = 0;
    }
    if (state.video) state.video.pause();
    if (state.hls) { state.hls.destroy(); state.hls = null; }
    if (state.video) {
      state.video.removeAttribute("src");
      state.video.load();
      state.video.remove();
    }
    state.video = null;
    state.unmuteOnPlaying = false;
    state.loading = false;
    state.shell.classList.remove("jdc-video-playing", "jdc-video-ready");
    state.shell.classList.remove("jdc-video-pilot");
    state.shell.classList.add("jdc-video-poster-only");
    updateControls(state);
    activeStates.delete(state);
  }

  function scheduleRetry(state) {
    if (!state || state.retryTimer || !desiredStates.has(state)) return;
    if (state.usingPilot && !state.pilotFailed) {
      state.pilotFailed = true;
      unload(state, true);
      setTimeout(function () {
        if (desiredStates.has(state)) activate(state, false);
      }, 0);
      return;
    }
    var attempt = Math.min(state.retryCount || 0, retryDelays.length - 1);
    var delay = retryDelays[attempt];
    state.retryCount = attempt + 1;
    unload(state, true);
    state.retryTimer = setTimeout(function () {
      state.retryTimer = null;
      if (desiredStates.has(state)) activate(state, false);
    }, delay);
  }

  function activate(state, userInitiated) {
    if (state && state.retryTimer) {
      if (!userInitiated) return;
      clearTimeout(state.retryTimer);
      state.retryTimer = null;
    }
    if (!state || state.loading || state.video) {
      if (state && state.video && userInitiated) state.video.play().catch(function () {});
      return;
    }
    if (posterOnly && !userInitiated) return;
    if (denseGallery && !userInitiated && startingStates.size >= galleryStartLimit) return;
    if (!denseGallery && !activeStates.has(state) && activeStates.size >= maxActive) {
      var oldest = activeStates.values().next().value;
      if (oldest) unload(oldest);
    }
    activeStates.add(state);
    reserveStartSlot(state);
    state.loading = true;
    var video = mountVideo(state);
    var source = hlsUrl(state);

    function beginSource(finalSource, qualityLabel) {
      if (!activeStates.has(state) || state.video !== video) return;
      var lockedBombasLead = state.bombasPlaylistLead && qualityLabel === "bombas-1080p-locked";
      var nativeAppleHls = navigator.vendor === "Apple Computer, Inc." &&
        video.canPlayType("application/vnd.apple.mpegurl") &&
        !/(CriOS|FxiOS|EdgiOS)/.test(navigator.userAgent);
      if (nativeAppleHls) {
        state.shell.setAttribute("data-jdc-start-quality", lockedBombasLead ? qualityLabel : "native-adaptive");
        video.src = finalSource;
        state.loading = false;
        video.play().catch(function () {});
        return;
      }

      ensureHls().then(function (Hls) {
        if (!activeStates.has(state) || state.video !== video) return;
        if (!Hls.isSupported()) throw new Error("HLS playback is not supported in this browser");
        var hls = new Hls({
          /* Gallery tiles may start light; the Bombas lead receives a single locked 1080p media playlist. */
          startLevel: lockedBombasLead ? 0 : denseGallery ? 0 : turbo ? (state.usingPilot ? 2 : 1) : conservative ? 0 : -1,
          startFragPrefetch: true,
          capLevelToPlayerSize: true,
          capLevelOnFPSDrop: !lockedBombasLead,
          maxBufferLength: lockedBombasLead ? (conservative ? 8 : turbo ? 30 : 15) : denseGallery ? (conservative ? 6 : 10) : conservative ? 8 : turbo ? 30 : 15,
          maxMaxBufferLength: lockedBombasLead ? (conservative ? 12 : turbo ? 60 : 25) : denseGallery ? (conservative ? 10 : 18) : conservative ? 12 : turbo ? 60 : 25,
          backBufferLength: 0
        });
        state.shell.setAttribute("data-jdc-start-quality", lockedBombasLead ? qualityLabel : denseGallery ? "lowest-first" : "adaptive");
        state.hls = hls;
        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, function () { hls.loadSource(finalSource); });
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          state.loading = false;
          video.play().catch(function () {});
        });
        hls.on(Hls.Events.ERROR, function (_event, data) {
          if (!data.fatal) return;
          console.warn("JDC video playback error", data);
          scheduleRetry(state);
        });
      }).catch(function (error) {
        console.warn(error);
        scheduleRetry(state);
      });
    }

    if (!state.bombasPlaylistLead) {
      beginSource(source, "adaptive");
      return;
    }

    state.shell.setAttribute("data-jdc-start-quality", "waiting-for-bombas-high");
    resolveBombasHighSource(state.config).then(function (rendition) {
      if (!activeStates.has(state) || state.video !== video) return;
      state.bombasHighLocked = true;
      state.bombasHighSource = rendition.url;
      state.shell.setAttribute("data-jdc-bombas-high-width", rendition.width || 1920);
      state.shell.setAttribute("data-jdc-bombas-high-height", rendition.height || 1080);
      state.shell.setAttribute("data-jdc-bombas-high-bandwidth", rendition.bandwidth || "");
      beginSource(rendition.url, "bombas-1080p-locked");
    }).catch(function (error) {
      console.warn("JDC Bombas high-resolution source error", error);
      scheduleRetry(state);
    });
  }

  function rankedVisible() {
    return Array.from(visible.entries())
      .filter(function (entry) { return entry[1] >= 0.08; })
      .sort(function (a, b) { return b[1] - a[1]; });
  }

  function rankedGalleryVisible() {
    var viewportCenter = window.innerHeight / 2;
    return Array.from(visible.entries())
      .filter(function (entry) { return entry[1] >= 0.08; })
      .map(function (entry) {
        var rect = entry[0].shell.getBoundingClientRect();
        return {
          state: entry[0],
          ratio: entry[1],
          distance: Math.abs((rect.top + rect.bottom) / 2 - viewportCenter)
        };
      })
      .sort(function (a, b) {
        return a.distance - b.distance || b.ratio - a.ratio || a.state.order - b.state.order;
      });
  }

  function galleryPlaybackOrder() {
    var ranked = rankedGalleryVisible();
    var order = ranked.map(function (entry) { return entry.state; });
    galleryVisibleCount = order.length;
    if (!order.length) return order;

    /* Prime one clip in either scroll direction, but only after every visible clip. */
    var ordered = Array.from(states.values());
    var indexes = order.map(function (state) { return ordered.indexOf(state); });
    var first = Math.min.apply(Math, indexes);
    var last = Math.max.apply(Math, indexes);
    if (first > 0) order.push(ordered[first - 1]);
    if (last >= 0 && last + 1 < ordered.length) order.push(ordered[last + 1]);
    return order;
  }

  function playbackWindow() {
    var ranked = rankedVisible();
    var primary = ranked.slice(0, visibleLimit).map(function (entry) { return entry[0]; });
    var desired = new Set(primary);
    var preloadSlots = preloadAhead + preloadBehind;
    if (!primary.length) return desired;

    ranked.slice(visibleLimit).some(function (entry) {
      if (preloadSlots <= 0) return true;
      desired.add(entry[0]);
      preloadSlots -= 1;
      return false;
    });

    var ordered = Array.from(states.values());
    var desiredIndexes = Array.from(desired).map(function (state) { return ordered.indexOf(state); });
    var first = Math.min.apply(Math, desiredIndexes);
    var last = Math.max.apply(Math, desiredIndexes);
    var behindSlots = Math.min(preloadBehind, preloadSlots);
    for (var before = first - 1; before >= 0 && behindSlots > 0; before -= 1) {
      desired.add(ordered[before]);
      behindSlots -= 1;
      preloadSlots -= 1;
    }
    for (var index = last + 1; index < ordered.length && preloadSlots > 0; index += 1) {
      desired.add(ordered[index]);
      preloadSlots -= 1;
    }
    for (var fallback = first - 1; fallback >= 0 && preloadSlots > 0; fallback -= 1) {
      if (desired.has(ordered[fallback])) continue;
      desired.add(ordered[fallback]);
      preloadSlots -= 1;
    }
    return desired;
  }

  function reconcile() {
    desiredOrder = posterOnly ? [] : denseGallery ? galleryPlaybackOrder() : Array.from(playbackWindow());
    if (!denseGallery) galleryVisibleCount = rankedVisible().length;
    var desired = new Set(desiredOrder);
    desiredStates = desired;
    if (denseGallery) {
      var visibleDemand = new Set(desiredOrder.slice(0, galleryVisibleCount));
      var waitingVisible = desiredOrder.some(function (state, index) {
        return index < galleryVisibleCount && !state.video && !state.retryTimer;
      });
      if (waitingVisible) {
        Array.from(startingStates).forEach(function (state) {
          if (!visibleDemand.has(state)) unload(state);
        });
      }
    }
    Array.from(activeStates).forEach(function (state) {
      if (!desired.has(state)) unload(state);
    });
    desiredOrder.forEach(function (state) { activate(state, false); });
    publishLimits();
  }

  var pendingReconcile = false;
  function scheduleReconcile() {
    if (pendingReconcile) return;
    pendingReconcile = true;
    requestAnimationFrame(function () { pendingReconcile = false; reconcile(); });
  }

  var intersection = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var state = states.get(entry.target);
      if (!state) return;
      entry.isIntersecting ? visible.set(state, entry.intersectionRatio) : visible.delete(state);
    });
    scheduleReconcile();
  }, { threshold: [0, 0.08, 0.25, 0.5, 0.75], rootMargin: "0px" });

  function register(shell, config, kind) {
    if (!config || !config.alexandriaUrl || shell.__jdcRegistered) return;
    shell.__jdcRegistered = true;
    shell.classList.add("jdc-video-shell", kind === "block" ? "jdc-video-block" : "jdc-video-background", "jdc-video-poster-only");
    setPoster(shell, config);
    var stage = shell.querySelector(".native-video-player") || shell;
    if (stage === shell) {
      stage = document.createElement("div");
      stage.className = "jdc-video-stage";
      shell.appendChild(stage);
    }
    var state = { shell: shell, stage: stage, config: config, kind: kind, order: states.size, video: null, hls: null, loading: false, starting: false, startupTimer: null, startupOutcome: "poster", controls: null, retryCount: 0, retryTimer: null, pilotFailed: false, usingPilot: false, hovered: false, unmuteOnMount: false, unmuteOnPlaying: false };
    setBlockAspect(state, configuredAspect(config), "config");
    states.set(shell, state);
    makeControls(state);
    if (kind === "block") {
      shell.addEventListener("click", function (event) {
        if (event.target.closest(".jdc-video-controls")) return;
        toggleAudio(state);
      });
      shell.addEventListener("mouseenter", function () {
        state.hovered = true;
        if (!hoverAudioPointer.matches) return;
        enableHoverAudio();
        if (state.video) {
          unmuteState(state);
        } else {
          state.unmuteOnMount = true;
          activate(state, true);
        }
      });
      shell.addEventListener("mouseleave", function () {
        state.hovered = false;
        if (hoverAudioPointer.matches && state.video) state.video.muted = true;
      });
    }
    intersection.observe(shell);
  }

  function scan(root) {
    (root || document).querySelectorAll("[data-jdc-native-video]").forEach(function (element) {
      register(element, parse(element, "data-jdc-native-video"), "background");
    });
    (root || document).querySelectorAll("[data-jdc-video]").forEach(function (element) {
      register(element, parse(element, "data-jdc-video"), "block");
    });
    denseGallery = projectPage && Array.from(states.values()).filter(function (state) {
      return state.kind === "block";
    }).length >= 3;
    configureBombasPlaylist();
    document.body.setAttribute("data-jdc-video-loading-mode", denseGallery ? "progressive-gallery" : "standard");
    publishLimits();
  }

  function start() {
    installBlockAspectStyles();
    installLaufeyGallery();
    installPolymarketGallery();
    installLimnGallery();
    installProjectSpacing();
    scan(document);
    publishHoverAudio();
    var mutations = new MutationObserver(function (records) {
      installLaufeyGallery();
      installPolymarketGallery();
      installLimnGallery();
      records.forEach(function (record) {
        record.addedNodes.forEach(function (node) { if (node.nodeType === 1) scan(node.parentElement || node); });
      });
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    window.__JDC_SMART_VIDEO__.mutations = mutations;
  }

  window.__JDC_SMART_VIDEO__ = {
    version: "adaptive-prefetch-pilot-25-polymarket-seven-limn-gallery-inline",
    states: states,
    activate: activate,
    unload: unload,
    activeStates: activeStates,
    startingStates: startingStates,
    posterOnly: posterOnly,
    conservative: conservative,
    turbo: turbo,
    pilotEnabled: pilotEnabled,
    projectPage: projectPage,
    projectSpacingEnabled: projectSpacingEnabled,
    bombasProject: bombasProject,
    bombasPlaylistIds: BOMBAS_PLAYLIST_IDS.slice(),
    bombasLeadQualityPolicy: "highest-rendition-only",
    bombasLeadPreloadAhead: bombasLeadPreloadAhead,
    bombasHighSourceCache: bombasHighSourceCache,
    bombasPrewarmCache: bombasPrewarmCache,
    denseGallery: denseGallery,
    galleryStartLimit: galleryStartLimit,
    galleryStartTimeout: galleryStartTimeout,
    galleryVisibleCount: galleryVisibleCount,
    galleryQueuedCount: 0,
    galleryStartingCount: 0,
    galleryPeakStarting: galleryPeakStarting,
    pilotBaseUrl: pilotBaseUrl,
    pilotAssetIds: Object.keys(pilotRoutes),
    visibleLimit: visibleLimit,
    preloadAhead: preloadAhead,
    preloadBehind: preloadBehind,
    maxActive: maxActive
  };

  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start, { once: true }) : start();
})();

/* Existing JDC navigation/text behavior, retained without recurring timers. */
(function () {
  "use strict";
  if (window.__JDC_SITE_BEHAVIORS__) return;
  window.__JDC_SITE_BEHAVIORS__ = true;

  document.addEventListener("click", function (event) {
    var logo = event.target.closest(".header-title-logo a, .header-mobile-logo a, .header-title-text a");
    if (logo && document.body.classList.contains("homepage")) {
      event.preventDefault();
      event.stopPropagation();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    var contact = event.target.closest('a[href*="/contact"], a[href*="contact"]');
    var close = event.target.closest(".footer-close-btn");
    var drawer = event.target.closest("footer#footer-sections");
    if (contact && (contact.textContent.trim().toLowerCase() === "contact" || contact.href.includes("/contact"))) {
      event.preventDefault();
      event.stopPropagation();
      document.body.classList.add("show-footer");
      var footer = document.querySelector("footer#footer-sections");
      if (footer && !footer.querySelector(".footer-close-btn")) {
        var button = document.createElement("div");
        button.className = "footer-close-btn";
        footer.prepend(button);
      }
      return;
    }
    if (document.body.classList.contains("show-footer") && (close || (!drawer && !contact))) {
      event.preventDefault();
      document.body.classList.remove("show-footer");
    }
  }, true);

  var textObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      entry.target.classList.toggle("in-view", entry.isIntersecting);
    });
  }, { threshold: 0.05, rootMargin: "-20px" });

  function observeText(root) {
    (root || document).querySelectorAll(".sqs-block-html, .sqs-block-image").forEach(function (element) {
      if (element.__jdcTextObserved) return;
      element.__jdcTextObserved = true;
      textObserver.observe(element);
    });
  }

  function linkBackgrounds(root) {
    if (!document.body.classList.contains("homepage")) return;
    (root || document).querySelectorAll(".page-section").forEach(function (section) {
      if (section.__jdcBackgroundLinked) return;
      var textLink = section.querySelector(".sqs-block-html a");
      if (!textLink) return;
      section.__jdcBackgroundLinked = true;
      section.style.cursor = "pointer";
      section.addEventListener("click", function (event) {
        if (event.target.closest("a, .jdc-video-controls")) return;
        window.location.href = textLink.href;
      });
    });
  }

  function scan(root) {
    observeText(root);
    linkBackgrounds(root);
  }

  function start() {
    scan(document);
    new MutationObserver(function (records) {
      records.forEach(function (record) {
        record.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) scan(node.parentElement || node);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start, { once: true }) : start();
})();
}
