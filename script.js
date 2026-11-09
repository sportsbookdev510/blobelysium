/* =========================================================
   $BLOB — Unimpressed Reel  (v6)
   ========================================================= */
(function () {
  "use strict";

  const CONFIG = {
    NAME: "Blob",
    TICKER: "BLOB",
    CHAIN: "elysium",
    CA: "0xComingSoon",
    X: "https://x.com/BlobElysium_",
    TG: "",
    BUY: "https://www.blobmeme.com/swap",
    SWAP: "https://www.blobmeme.com/swap",
    BRIDGE: "https://www.blobmeme.com/bridge",
    CHART: "https://www.thekleos.pro/token/0xComingSoon",
    BLOBIFY: "https://www.blobmeme.com/blobify",
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- PRELOADER ---------- */
  const preloader = document.getElementById("preloader");
  const preloadLine = document.getElementById("preload-line");
  const preloadUgh = document.getElementById("preload-ugh");

  function finishPreloader() {
    if (!preloader) {
      document.body.classList.add("is-ready");
      return;
    }
    if (preloadLine) preloadLine.hidden = true;
    if (preloadUgh) preloadUgh.hidden = false;
    window.setTimeout(function () {
      preloader.classList.add("is-done");
      preloader.setAttribute("aria-busy", "false");
      document.body.classList.add("is-ready");
    }, 480);
  }

  if (reduceMotion) {
    if (preloader) {
      preloader.classList.add("is-done");
      preloader.setAttribute("aria-busy", "false");
      preloader.hidden = true;
    }
    document.body.classList.add("is-ready");
  } else {
    window.setTimeout(finishPreloader, 2200);
  }

  /* ---------- DRAWER ---------- */
  const toggle = document.getElementById("nav-toggle");
  const drawer = document.getElementById("drawer");
  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      const open = drawer.hasAttribute("hidden");
      if (open) {
        drawer.removeAttribute("hidden");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close menu");
      } else {
        drawer.setAttribute("hidden", "");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        drawer.setAttribute("hidden", "");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* ---------- COPY CA (toast only — never alert) ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (ok) resolve();
        else reject(new Error("copy failed"));
      } catch (err) {
        document.body.removeChild(ta);
        reject(err);
      }
    });
  }

  const toast = document.getElementById("ca-toast");
  function flashToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-on");
    window.setTimeout(function () {
      toast.classList.remove("is-on");
    }, 1800);
  }

  function wireCopy(btnId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener("click", function () {
      copyText(CONFIG.CA).then(
        function () {
          flashToast("Copied. Blob is still unimpressed.");
        },
        function () {
          flashToast("Could not copy. Select the CA manually.");
        }
      );
    });
  }
  wireCopy("copy-ca");
  wireCopy("copy-ca-2");

  /* ---------- LENIS + GSAP ---------- */
  let lenis = null;

  function initMotion() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      layoutStormStatic();
      showStaticFilmPoses();
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    if (!reduceMotion && typeof Lenis !== "undefined") {
      lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        smoothTouch: false,
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    if (reduceMotion) {
      layoutStormStatic();
      showStaticFilmPoses();
      showStaticSectionActors();
      return;
    }

    pinWorlds();
    filmReelMovie();
    sectionActorFilm();
    stormChaos();
    revealBits();
  }

  /* Per-world Ken Burns + copy/floater scrub (existing architecture) */
  function pinWorlds() {
    document.querySelectorAll(".world").forEach(function (world) {
      const pin = world.querySelector(".world__pin");
      const photoA = world.querySelector(".world__photo--a");
      const photoB = world.querySelector(".world__photo--b");
      const photoSolo = world.querySelector(".world__photo--solo");
      const copy = world.querySelector(".world__copy");
      const floaters = world.querySelectorAll(".world__floater");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: world,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
          pin: pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      if (photoA) {
        tl.fromTo(
          photoA,
          { scale: 1.12, xPercent: -2 },
          { scale: 1.22, xPercent: 2, ease: "none" },
          0
        );
      }
      if (photoSolo) {
        tl.fromTo(
          photoSolo,
          { scale: 1.1, yPercent: 0 },
          { scale: 1.22, yPercent: -4, ease: "none" },
          0
        );
      }
      if (photoB) {
        tl.fromTo(
          photoB,
          { opacity: 0, scale: 1.18 },
          { opacity: 1, scale: 1.08, ease: "none" },
          0.35
        );
        if (photoA) {
          tl.to(photoA, { opacity: 0.15, ease: "none" }, 0.4);
        }
      }

      if (copy) {
        tl.fromTo(
          copy.children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, ease: "none" },
          0.05
        );
      }

      floaters.forEach(function (f, i) {
        const dir = i % 2 === 0 ? 1 : -1;
        tl.fromTo(
          f,
          {
            y: 80 * dir,
            x: 40 * -dir,
            rotate: -18 * dir,
            opacity: 0,
            scale: 0.85,
          },
          {
            y: -40 * dir,
            x: 20 * dir,
            rotate: 12 * dir,
            opacity: 0.85,
            scale: 1,
            ease: "none",
          },
          0.15 + i * 0.08
        );
      });
    });
  }

  /* Sticky film-stage: crossfade + X travel + scale across the five reel chapters */
  function filmReelMovie() {
    const stage = document.getElementById("film-stage");
    if (!stage) return;
    const poses = gsap.utils.toArray(".film-stage__pose");
    const worlds = gsap.utils.toArray(".world");
    if (!poses.length || !worlds.length) return;

    gsap.set(poses, { opacity: 0, xPercent: 8, scale: 0.94 });
    gsap.set(poses[0], { opacity: 1, xPercent: 0, scale: 1 });
    poses[0].classList.add("is-active");

    worlds.forEach(function (world, i) {
      if (i === 0) return;
      const prev = poses[i - 1];
      const curr = poses[i];
      if (!prev || !curr) return;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: world,
            start: "top 70%",
            end: "top 15%",
            scrub: true,
            onEnter: function () {
              poses.forEach(function (p) {
                p.classList.remove("is-active");
              });
              curr.classList.add("is-active");
            },
            onLeaveBack: function () {
              poses.forEach(function (p) {
                p.classList.remove("is-active");
              });
              prev.classList.add("is-active");
            },
          },
        })
        .to(
          prev,
          { opacity: 0, xPercent: -14, scale: 0.9, ease: "none" },
          0
        )
        .fromTo(
          curr,
          { opacity: 0, xPercent: 12, scale: 0.92 },
          { opacity: 1, xPercent: 0, scale: 1, ease: "none" },
          0
        );
    });

    /* Exit booth pose as reel ends into storm */
    const last = poses[poses.length - 1];
    const storm = document.getElementById("storm");
    if (last && storm) {
      gsap.to(last, {
        opacity: 0,
        xPercent: -10,
        scale: 0.88,
        ease: "none",
        scrollTrigger: {
          trigger: storm,
          start: "top 90%",
          end: "top 40%",
          scrub: true,
        },
      });
    }
  }

  function showStaticFilmPoses() {
    /* Reduced motion / no GSAP: inject one large actor into each world pin */
    const map = {
      hotels: "assets/generated/blob-pose-hotel.png",
      dining: "assets/generated/blob-pose-dining.png",
      gardens: "assets/generated/blob-pose-garden.png",
      conf: "assets/generated/blob-pose-conference.png",
      booth: "assets/generated/blob-pose-booth.png",
    };
    document.querySelectorAll(".world").forEach(function (world) {
      const key = world.getAttribute("data-pose");
      const src = map[key];
      if (!src) return;
      const pin = world.querySelector(".world__pin");
      if (!pin || pin.querySelector(".world__actor-static")) return;
      const img = document.createElement("img");
      img.className = "world__actor-static section-actor";
      img.src = src;
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      img.style.cssText =
        "position:absolute;right:0;bottom:0;z-index:4;height:min(86svh,100%);max-width:min(92vw,1100px);opacity:0.95;";
      pin.appendChild(img);
    });
    const stage = document.getElementById("film-stage");
    if (stage) stage.style.display = "none";
  }

  function showStaticSectionActors() {
    document.querySelectorAll(".section-actor").forEach(function (el) {
      el.style.opacity = "0.9";
      el.style.transform = "none";
    });
  }

  /* Continue the film after the reel: storm → lore → tools → howto */
  function sectionActorFilm() {
    const beats = [
      { sel: ".section-actor--storm", trigger: "#storm", fromX: 14 },
      { sel: ".section-actor--lore", trigger: "#lore", fromX: 12 },
      { sel: ".section-actor--tools", trigger: "#tools", fromX: 10 },
      { sel: ".section-actor--howto", trigger: "#howto", fromX: 12 },
    ];

    beats.forEach(function (beat, i) {
      const el = document.querySelector(beat.sel);
      const trigger = document.querySelector(beat.trigger);
      if (!el || !trigger) return;

      gsap.set(el, { opacity: 0, xPercent: beat.fromX, scale: 0.92 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: trigger,
            start: "top 80%",
            end: "top 20%",
            scrub: true,
          },
        })
        .to(el, {
          opacity: 0.95,
          xPercent: 0,
          scale: 1,
          ease: "none",
        });

      /* Soft exit into next beat (except last) */
      if (i < beats.length - 1) {
        const nextTrigger = document.querySelector(beats[i + 1].trigger);
        if (nextTrigger) {
          gsap.to(el, {
            opacity: 0,
            xPercent: -10,
            scale: 0.9,
            ease: "none",
            scrollTrigger: {
              trigger: nextTrigger,
              start: "top 85%",
              end: "top 35%",
              scrub: true,
            },
          });
        }
      }
    });
  }

  function stormChaos() {
    const pile = document.getElementById("storm-pile");
    if (!pile) return;
    const stickers = Array.prototype.slice.call(pile.querySelectorAll(".storm__s"));
    const slots = scatterSlots(stickers.length);

    stickers.forEach(function (s, i) {
      const slot = slots[i];
      const rot = Number(s.getAttribute("data-rot") || 0);
      gsap.set(s, {
        xPercent: -50,
        yPercent: -50,
        left: "50%",
        top: "50%",
        x: 0,
        y: 0,
        rotate: rot,
        scale: 0.4,
        opacity: 0,
      });
      gsap.to(s, {
        x: slot.x,
        y: slot.y,
        rotate: rot + slot.spin,
        scale: slot.scale,
        opacity: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: pile,
          start: "top 75%",
          end: "top 25%",
          scrub: 0.5,
        },
      });
      gsap.to(s, {
        y: slot.y + (i % 2 === 0 ? -18 : 18),
        rotate: rot + slot.spin + (i % 2 === 0 ? 4 : -4),
        duration: 3.2 + (i % 5) * 0.35,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: i * 0.08,
      });
    });
  }

  function layoutStormStatic() {
    const pile = document.getElementById("storm-pile");
    if (!pile) return;
    const stickers = Array.prototype.slice.call(pile.querySelectorAll(".storm__s"));
    const slots = scatterSlots(stickers.length);
    stickers.forEach(function (s, i) {
      const slot = slots[i];
      const rot = Number(s.getAttribute("data-rot") || 0);
      s.style.left = "50%";
      s.style.top = "50%";
      s.style.transform =
        "translate(-50%, -50%) translate(" +
        slot.x +
        "px, " +
        slot.y +
        "px) rotate(" +
        (rot + slot.spin) +
        "deg) scale(" +
        slot.scale +
        ")";
      s.style.opacity = "1";
    });
  }

  function scatterSlots(n) {
    const out = [];
    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);
    const w = Math.min(window.innerWidth * 0.42, 480);
    const h = Math.min(window.innerHeight * 0.32, 260);
    for (let i = 0; i < n; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const nx = cols === 1 ? 0 : (c / (cols - 1) - 0.5) * 2;
      const ny = rows === 1 ? 0 : (r / (rows - 1) - 0.5) * 2;
      const jitterX = ((i * 37) % 17) - 8;
      const jitterY = ((i * 53) % 19) - 9;
      out.push({
        x: nx * w + jitterX * 4,
        y: ny * h + jitterY * 4,
        spin: ((i * 13) % 21) - 10,
        scale: 0.85 + ((i * 7) % 5) * 0.06,
      });
    }
    return out;
  }

  function revealBits() {
    gsap.utils.toArray(".lore__body p, .plate, .step, .howto__title, .tools__title").forEach(function (el) {
      gsap.from(el, {
        y: 36,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    });
  }

  /* ---------- CURSOR STICKER TRAIL ---------- */
  function initTrail() {
    const canvas = document.getElementById("sticker-trail");
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const imgs = [];
    const srcs = [
      "assets/tony/sticker-coffee.png",
      "assets/tony/sticker-suitcase.png",
      "assets/tony/sticker-bed.png",
      "assets/generated/blob-blink.gif",
    ];
    let loaded = 0;
    srcs.forEach(function (src) {
      const im = new Image();
      im.onload = function () {
        loaded += 1;
      };
      im.src = src;
      imgs.push(im);
    });

    const particles = [];
    let last = 0;
    window.addEventListener(
      "pointermove",
      function (e) {
        if (loaded < 1) return;
        const now = performance.now();
        if (now - last < 55) return;
        last = now;
        const im = imgs[Math.floor(Math.random() * imgs.length)];
        if (!im.complete) return;
        particles.push({
          x: e.clientX,
          y: e.clientY,
          img: im,
          life: 1,
          rot: (Math.random() - 0.5) * 50,
          size: 22 + Math.random() * 18,
          vx: (Math.random() - 0.5) * 0.6,
          vy: 0.4 + Math.random() * 0.8,
        });
        if (particles.length > 28) particles.shift();
      },
      { passive: true }
    );

    function tick() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 0.016;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += 0.4;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life) * 0.55;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- BLOBIFIER (client tool below official machine) ---------- */
  function initBlobifier() {
    const inCanvas = document.getElementById("blobify-in");
    const outCanvas = document.getElementById("blobify-out");
    const fileInput = document.getElementById("blobify-file");
    const handleInput = document.getElementById("blobify-handle");
    const fetchBtn = document.getElementById("blobify-x-btn");
    const dlBtn = document.getElementById("blobify-dl");
    const status = document.getElementById("blobify-status");
    if (!inCanvas || !outCanvas) return;

    const inCtx = inCanvas.getContext("2d");
    const outCtx = outCanvas.getContext("2d");
    const blobBase = new Image();
    blobBase.crossOrigin = "anonymous";
    blobBase.src = "assets/blob.png";

    function setStatus(msg) {
      if (status) status.textContent = msg || "";
    }

    function drawContain(ctx, img, size) {
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = "#0a1211";
      ctx.fillRect(0, 0, size, size);
      const scale = Math.min(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
    }

    function blobify(img) {
      drawContain(inCtx, img, inCanvas.width);
      outCtx.clearRect(0, 0, outCanvas.width, outCanvas.height);
      outCtx.fillStyle = "#0a1211";
      outCtx.fillRect(0, 0, outCanvas.width, outCanvas.height);

      const size = outCanvas.width;
      if (blobBase.complete && blobBase.naturalWidth) {
        const scale = Math.min(size / blobBase.width, size / blobBase.height) * 0.92;
        const w = blobBase.width * scale;
        const h = blobBase.height * scale;
        outCtx.drawImage(blobBase, (size - w) / 2, (size - h) / 2 + size * 0.04, w, h);
      }

      const badge = size * 0.34;
      const bx = size * 0.5;
      const by = size * 0.58;
      outCtx.save();
      outCtx.beginPath();
      outCtx.arc(bx, by, badge / 2, 0, Math.PI * 2);
      outCtx.closePath();
      outCtx.clip();
      const s = Math.max(badge / img.width, badge / img.height);
      const iw = img.width * s;
      const ih = img.height * s;
      outCtx.drawImage(img, bx - iw / 2, by - ih / 2, iw, ih);
      outCtx.restore();
      outCtx.beginPath();
      outCtx.arc(bx, by, badge / 2, 0, Math.PI * 2);
      outCtx.strokeStyle = "rgba(244,239,230,0.85)";
      outCtx.lineWidth = 4;
      outCtx.stroke();

      if (dlBtn) dlBtn.disabled = false;
      setStatus("Blobified. He is not happy about it.");
    }

    function loadUrl(url) {
      setStatus("Loading…");
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
        blobify(img);
      };
      img.onerror = function () {
        setStatus("Could not load that image.");
      };
      img.src = url;
    }

    if (fileInput) {
      fileInput.addEventListener("change", function () {
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = function () {
          blobify(img);
          URL.revokeObjectURL(url);
        };
        img.src = url;
      });
    }

    if (fetchBtn && handleInput) {
      fetchBtn.addEventListener("click", function () {
        let handle = (handleInput.value || "").trim().replace(/^@/, "");
        if (!handle) {
          setStatus("Type an X handle.");
          return;
        }
        const url = "https://unavatar.io/twitter/" + encodeURIComponent(handle) + "?fallback=false";
        loadUrl(url);
      });
    }

    if (dlBtn) {
      dlBtn.addEventListener("click", function () {
        const a = document.createElement("a");
        a.download = "blobified.png";
        a.href = outCanvas.toDataURL("image/png");
        a.click();
      });
    }

    document.querySelectorAll(".sample").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const inSrc = btn.getAttribute("data-in");
        const outSrc = btn.getAttribute("data-out");
        if (inSrc) {
          const img = new Image();
          img.onload = function () {
            drawContain(inCtx, img, inCanvas.width);
          };
          img.src = inSrc;
        }
        if (outSrc) {
          const img2 = new Image();
          img2.onload = function () {
            drawContain(outCtx, img2, outCanvas.width);
            if (dlBtn) dlBtn.disabled = false;
            setStatus("Sample loaded. Free. Blob is not happy about it.");
          };
          img2.src = outSrc;
        }
      });
    });

    const first = document.querySelector(".sample");
    if (first) first.click();
  }

  /* ---------- BOOT ---------- */
  function boot() {
    initMotion();
    initTrail();
    initBlobifier();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.__BLOB_CONFIG__ = CONFIG;
})();
