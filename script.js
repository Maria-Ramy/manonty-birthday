/* =========================================================
   OUR STORY — A Birthday Scrapbook
   script.js
   -----------------------------------------------------------
   Jump to these sections to edit content:
     1. TIMELINE_DATA        -> timeline photos / ages / text
     2. TAUNT_MESSAGES       -> the "NO" button's funny replies
     3. goToScreen()         -> screen navigation engine
     4. Memory Book logic    -> page turning
   ========================================================= */

(function () {
  "use strict";

  /* ============================================================
     0. SCREEN NAVIGATION ENGINE
  ============================================================ */
  const screens = Array.from(document.querySelectorAll(".screen"));
  const dots = Array.from(document.querySelectorAll("#progress-dots .dot"));
  let currentScreenIndex = 0;

  function goToScreen(index) {
    if (index < 0 || index >= screens.length) return;
    screens[currentScreenIndex].classList.remove("active");
    screens[index].classList.add("active");
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
    currentScreenIndex = index;

    // Trigger per-screen entrance behaviour
    if (index === 4) revealTimelineOnEnter();
    if (index === 5) revealFinalLetter();
  }

  /* clicking a progress dot allows re-visiting earlier sections */
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = parseInt(dot.dataset.screen, 10);
      if (target <= currentScreenIndex) goToScreen(target);
    });
  });

  /* ============================================================
     1. BACKGROUND MUSIC
     Replace assets/music.mp3 to change the song — nothing else
     needs to change.
  ============================================================ */
  const bgMusic = document.getElementById("bg-music");
  const musicToggle = document.getElementById("music-toggle");
  let musicStarted = false;
  let musicWantedOn = true;

  function tryStartMusic() {
    if (musicStarted) return;
    musicStarted = true;
    bgMusic.volume = 0.55;
    bgMusic.play().then(() => {
      musicToggle.textContent = "🔊";
      musicToggle.classList.add("playing");
    }).catch(() => {
      /* Autoplay blocked — user can press the button manually */
      musicStarted = false;
    });
  }

  // Start music on the very first interaction anywhere on the page
  ["click", "touchstart", "keydown"].forEach((evt) => {
    document.addEventListener(evt, tryStartMusic, { once: true, passive: true });
  });

  musicToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (bgMusic.paused) {
      bgMusic.play().catch(() => {});
      musicToggle.textContent = "🔊";
      musicToggle.classList.add("playing");
      musicWantedOn = true;
    } else {
      bgMusic.pause();
      musicToggle.textContent = "🔈";
      musicToggle.classList.remove("playing");
      musicWantedOn = false;
    }
  });

  /* ============================================================
     2. DECORATIVE ELEMENTS — sparkles & floating hearts
  ============================================================ */
  function spawnSparkles(containerId, count) {
    const el = document.getElementById(containerId);
    if (!el) return;
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.className = "sparkle";
      s.textContent = Math.random() > 0.5 ? "✦" : "✧";
      s.style.left = Math.random() * 96 + "%";
      s.style.top = Math.random() * 90 + "%";
      s.style.fontSize = 10 + Math.random() * 14 + "px";
      s.style.animationDelay = Math.random() * 4 + "s";
      s.style.animationDuration = 4 + Math.random() * 4 + "s";
      el.appendChild(s);
    }
  }

  function spawnHeartsLoop(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return null;
    function drop() {
      if (!el.isConnected) return;
      const h = document.createElement("span");
      h.className = "floating-heart";
      h.textContent = Math.random() > 0.5 ? "♥" : "❀";
      h.style.left = Math.random() * 92 + "%";
      h.style.setProperty("--drift", (Math.random() * 60 - 30) + "px");
      const duration = 6 + Math.random() * 5;
      h.style.animationDuration = duration + "s";
      h.style.fontSize = 12 + Math.random() * 14 + "px";
      el.appendChild(h);
      setTimeout(() => h.remove(), duration * 1000 + 200);
    }
    const interval = setInterval(drop, 900);
    drop();
    return interval;
  }

  spawnSparkles("sparkle-intro", 10);
  spawnSparkles("sparkle-cover", 8);

  /* ============================================================
     3. PAGE 1 -> PAGE 2
  ============================================================ */
  document.getElementById("btn-to-question").addEventListener("click", () => {
    goToScreen(1);
    if (!heartsQuestionInterval) heartsQuestionInterval = spawnHeartsLoop("hearts-question");
  });
  let heartsQuestionInterval = null;

  /* ============================================================
     4. PAGE 2 — THE FUNNY QUESTION (YES / escaping NO)
  ============================================================ */
  // EDIT HERE: add / remove / change the NO button's funny replies
  const TAUNT_MESSAGES = [
    "Try again 😌",
    "Nice try.",
    "Wrong answer.",
    "Absolutely not.",
    "Think again 👀",
    "You really thought that would work?",
    "Try the other one 😂",
    "Nope.",
    "That button doesn't work like that.",
    "Come on, you know the answer."
  ];

  const btnNo = document.getElementById("btn-no");
  const btnYes = document.getElementById("btn-yes");
  const taunt = document.getElementById("taunt-msg");
  const answerRow = document.querySelector(".answer-row");
  let taintIndex = -1;
  let noEscapeCount = 0;

  function randomTaunt() {
    let idx;
    do { idx = Math.floor(Math.random() * TAUNT_MESSAGES.length); } while (idx === taintIndex);
    taintIndex = idx;
    taunt.textContent = TAUNT_MESSAGES[idx];
    taunt.classList.add("show");
    clearTimeout(taunt._hideTimer);
    taunt._hideTimer = setTimeout(() => taunt.classList.remove("show"), 1800);
  }

  function escapeNoButton() {
    noEscapeCount++;
    btnNo.classList.add("escaping");

    const btnW = btnNo.offsetWidth || 130;
    const btnH = btnNo.offsetHeight || 56;
    const margin = 16;
    const maxX = Math.max(margin, window.innerWidth - btnW - margin);
    const maxY = Math.max(margin, window.innerHeight - btnH - margin);

    // Keep it reachable: random position within viewport bounds,
    // avoiding the very edges and never off-screen.
    const newX = margin + Math.random() * (maxX - margin);
    const newY = margin + Math.random() * (maxY - margin);

    btnNo.style.left = newX + "px";
    btnNo.style.top = newY + "px";

    // Slightly shrink after many attempts, but never below usable size,
    // to keep things funny without being frustrating.
    const scale = Math.max(0.8, 1 - noEscapeCount * 0.015);
    btnNo.style.transform = `scale(${scale})`;

    randomTaunt();
  }

  // Trigger escape on hover (desktop) so the cursor can never catch it,
  // and on touchstart (mobile) so a tap can't land on it either.
  btnNo.addEventListener("mouseenter", escapeNoButton);
  btnNo.addEventListener("touchstart", (e) => {
    e.preventDefault();
    escapeNoButton();
  }, { passive: false });
  btnNo.addEventListener("click", (e) => {
    // Safety net: if it somehow gets clicked, still don't accept "no"
    e.preventDefault();
    escapeNoButton();
  });

  const confirmOverlay = document.getElementById("confirm-overlay");
  btnYes.addEventListener("click", () => {
    confirmOverlay.classList.add("show");
    setTimeout(() => {
      confirmOverlay.classList.remove("show");
      goToScreen(2);
    }, 1600);
  });

  /* ============================================================
     5. PAGE 3 — BOOK COVER OPEN ANIMATION
  ============================================================ */
  const bookCover = document.getElementById("book-cover");
  const btnOpenBook = document.getElementById("btn-open-book");

  function openBookCover() {
    bookCover.classList.add("opening");
    setTimeout(() => {
      goToScreen(3);
      bookCover.classList.remove("opening");
    }, 650);
  }
  bookCover.addEventListener("click", openBookCover);
  btnOpenBook.addEventListener("click", openBookCover);

  /* ============================================================
     6. PAGE 3A — INTERACTIVE MEMORY BOOK (page turning)
  ============================================================ */
  const spreadLayers = [
    document.getElementById("spread-1"),
    document.getElementById("spread-2"),
    document.getElementById("spread-3")
  ];
  const TOTAL_SPREADS = spreadLayers.length;
  let currentSpread = 0;
  let isFlipping = false;

  const btnPrevPage = document.getElementById("btn-prev-page");
  const btnNextPage = document.getElementById("btn-next-page");
  const spreadIndicator = document.getElementById("spread-indicator");
  const btnBookContinue = document.getElementById("btn-book-continue");

  function setLayerState(layer, state) {
    layer.classList.remove("z-current", "z-next", "z-hidden", "flip-out-right", "flip-out-left");
    layer.classList.add(state);
  }

  function refreshSpreadLayers() {
    spreadLayers.forEach((layer, i) => {
      if (i === currentSpread) setLayerState(layer, "z-current");
      else if (i === currentSpread + 1) setLayerState(layer, "z-next");
      else setLayerState(layer, "z-hidden");
    });
    btnPrevPage.disabled = currentSpread === 0;
    btnNextPage.disabled = currentSpread === TOTAL_SPREADS - 1;
    spreadIndicator.textContent = `Spread ${currentSpread + 1} / ${TOTAL_SPREADS}`;
    btnBookContinue.style.display = currentSpread === TOTAL_SPREADS - 1 ? "inline-block" : "none";
  }

  function flipForward() {
    if (isFlipping || currentSpread >= TOTAL_SPREADS - 1) return;
    isFlipping = true;
    const current = spreadLayers[currentSpread];
    const next = spreadLayers[currentSpread + 1];
    setLayerState(next, "z-next"); // sits beneath, fully visible, ready to be revealed
    current.classList.add("flip-out-right");

    setTimeout(() => {
      currentSpread++;
      refreshSpreadLayers();
      isFlipping = false;
    }, 950);
  }

  function flipBackward() {
    if (isFlipping || currentSpread <= 0) return;
    isFlipping = true;
    const current = spreadLayers[currentSpread];
    const prev = spreadLayers[currentSpread - 1];
    // Temporarily place prev spread beneath current for the reveal
    prev.classList.remove("z-hidden");
    prev.classList.add("z-next");
    current.classList.add("flip-out-left");

    setTimeout(() => {
      currentSpread--;
      refreshSpreadLayers();
      isFlipping = false;
    }, 950);
  }

  btnNextPage.addEventListener("click", flipForward);
  btnPrevPage.addEventListener("click", flipBackward);

  btnBookContinue.addEventListener("click", () => {
    goToScreen(4);
  });

  // Touch swipe support for the book
  const bookStage = document.getElementById("book-stage");
  let touchStartX = null;
  bookStage.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  bookStage.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 45) {
      if (dx < 0) flipForward(); else flipBackward();
    }
    touchStartX = null;
  }, { passive: true });

  refreshSpreadLayers();

  /* ============================================================
     7. PAGE 4 — TIMELINE ("Phases of Your Moon")
  ============================================================ */
  // EDIT HERE 4: add / remove / edit timeline phases.
  // Each entry just needs an image path, a phase label, and a caption.
  // Remove any entries you don't want to use — the layout adapts automatically.
  const TIMELINE_DATA = [
    { img: "assets/images/timeline-1.jpg",  phase: "Phase 01", desc: "lamo8za hehe" },
    { img: "assets/images/timeline-2.jpg",  phase: "Phase 02", desc: "ndgna 4wya ahoo" },
    { img: "assets/images/timeline-3.jpg",  phase: "Phase 03", desc: "karizmaaa ehh" },
    { img: "assets/images/timeline-4.jpg",  phase: "Phase 04", desc: "karizmaaax2" },
    { img: "assets/images/timeline-5.jpg",  phase: "Phase 05", desc: "da3t el karizma" },
    { img: "assets/images/timeline-6.jpg",  phase: "Phase 06", desc: "7obk llmac mn wnta ad kedaa ( aw el akl 3mtn )" },
    { img: "assets/images/timeline-7.jpg",  phase: "Phase 07", desc: "3sl 3sll" },
    { img: "assets/images/timeline-8.jpg",  phase: "Phase 08", desc: "b2ena 21 koty koty" },
    { img: "assets/images/timeline-9.jpg",  phase: "Phase 09", desc: "4yaka we anaka we lbakaaa" },
    { img: "assets/images/timeline-10.jpg", phase: "Final",    desc: "agml sora b7bhaaaa", isFinal: true }
  ];

  const timelineTrack = document.getElementById("timeline-track");
  let timelineBuilt = false;
  let timelineObserver = null;

  function buildTimeline() {
    if (timelineBuilt) return;
    timelineBuilt = true;
    TIMELINE_DATA.forEach((item, i) => {
      const wrap = document.createElement("div");
      wrap.className = "tl-item " + (item.isFinal ? "final" : (i % 2 === 0 ? "side-left" : "side-right"));

      wrap.innerHTML = `
        <div class="tl-dot"></div>
        <div class="tl-card">
          <div class="tl-moon"><img src="${item.img}" alt="${item.desc}"></div>
          <span class="tl-phase script">${item.phase}</span>
          <p class="tl-title">${item.desc}</p>
        </div>`;
      timelineTrack.appendChild(wrap);
    });

    timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.25 });

    document.querySelectorAll(".tl-item").forEach((el) => timelineObserver.observe(el));
  }

  function revealTimelineOnEnter() {
    buildTimeline();
    // Reveal the first couple of items immediately even without scrolling
    const items = document.querySelectorAll(".tl-item");
    items.forEach((el, i) => { if (i < 2) el.classList.add("visible"); });
  }

  document.getElementById("btn-timeline-continue").addEventListener("click", () => {
    goToScreen(5);
  });

  /* ============================================================
     8. PAGE 5 — FINAL BIRTHDAY LETTER
  ============================================================ */
  const letterCard = document.getElementById("letter-card");
  let finalRevealed = false;
  let heartsFinalInterval = null;

  function revealFinalLetter() {
    if (finalRevealed) return;
    finalRevealed = true;
    setTimeout(() => letterCard.classList.add("show"), 200);
    heartsFinalInterval = spawnHeartsLoop("hearts-final");
  }

})();
