(() => {
  "use strict";

  const cover = document.querySelector("#cover");
  const skipLink = document.querySelector("#skipLink");
  const openButton = document.querySelector("#openGift");
  const experience = document.querySelector("#experience");
  const audio = document.querySelector("#springRain");
  const musicToggle = document.querySelector("#musicToggle");
  const musicLabel = document.querySelector("#musicLabel");
  const musicStatus = document.querySelector("#musicStatus");
  const progressFill = document.querySelector("#progressFill");
  const memories = document.querySelector("#memories");
  const linePaths = [...document.querySelectorAll(".journey-line__draw, .journey-line__glow")];
  const birthday = document.querySelector("#birthday");
  const acceptWish = document.querySelector("#acceptWish");
  const wishMessage = document.querySelector("#wishMessage");
  const celebrationLayer = document.querySelector("#celebrationLayer");
  const secretTrigger = document.querySelector("#secretTrigger");
  const secretGift = document.querySelector("#secretGift");
  const secretCard = document.querySelector("#secretCard");
  const secretReturn = document.querySelector("#secretReturn");
  const foodCards = [...document.querySelectorAll("[data-food-card]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let opening = false;
  let experienceOpened = false;
  let revealObserver;
  let scrollFrame = 0;
  let focusBeforeSecret = null;
  let secretCloseTimer = 0;

  audio.volume = 0.4;
  audio.loop = true;

  function setMusicState(isPlaying, message) {
    musicToggle.classList.toggle("is-playing", isPlaying);
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
    musicToggle.setAttribute(
      "aria-label",
      isPlaying ? "暂停背景音乐：春雨里洗过的太阳" : "播放背景音乐：春雨里洗过的太阳"
    );
    musicLabel.textContent = isPlaying ? "暂停音乐" : "播放音乐";
    musicStatus.textContent = message || (isPlaying ? "背景音乐正在播放" : "背景音乐已暂停");
  }

  async function playMusic() {
    audio.volume = 0.4;
    musicToggle.classList.remove("is-attention");

    try {
      await audio.play();
      setMusicState(true, "背景音乐正在播放，音量百分之四十");
      return true;
    } catch (error) {
      setMusicState(false, "浏览器没有允许播放，请再次点击右下角的播放音乐按钮");
      musicToggle.classList.add("is-attention");
      musicLabel.textContent = "点击播放音乐";
      return false;
    }
  }

  function updateScrollProgress() {
    scrollFrame = 0;

    if (!experienceOpened) {
      return;
    }

    const pageMax = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const pageProgress = pageMax === 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / pageMax));
    progressFill.style.transform = `scaleY(${pageProgress})`;

    const memoryRect = memories.getBoundingClientRect();
    const memoryTop = memoryRect.top + window.scrollY;
    const travelStart = memoryTop - window.innerHeight * 0.28;
    const travelDistance = memories.offsetHeight + window.innerHeight * 0.4;
    const lineProgress = Math.min(
      1,
      Math.max(0, (window.scrollY - travelStart) / Math.max(1, travelDistance))
    );
    const dashOffset = String(1 - lineProgress);

    linePaths.forEach((path) => {
      path.style.strokeDashoffset = dashOffset;
    });
  }

  function queueScrollUpdate() {
    if (scrollFrame) {
      return;
    }
    scrollFrame = window.requestAnimationFrame(updateScrollProgress);
  }

  function revealVisibleItems() {
    document.querySelectorAll(".reveal").forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  function initReveals() {
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      revealVisibleItems();
      return;
    }

    revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
  }

  function finishOpening() {
    cover.classList.add("is-complete");
    cover.setAttribute("aria-hidden", "true");
    experience.inert = false;
    skipLink.inert = false;
    experience.removeAttribute("aria-hidden");
    experienceOpened = true;
    document.body.classList.remove("is-locked");
    document.body.classList.add("is-experience-open");
    window.scrollTo(0, 0);
    initReveals();
    queueScrollUpdate();
    musicToggle.focus({ preventScroll: true });
  }

  openButton.addEventListener("click", () => {
    if (opening) {
      return;
    }

    opening = true;
    playMusic();
    cover.classList.add("is-opening");
    openButton.disabled = true;

    const openingDuration = reducedMotion.matches ? 500 : 2350;
    window.setTimeout(finishOpening, openingDuration);
  });

  musicToggle.addEventListener("click", () => {
    if (audio.paused) {
      playMusic();
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => {
    setMusicState(true, "背景音乐正在播放");
  });

  audio.addEventListener("pause", () => {
    setMusicState(false, "背景音乐已暂停");
  });

  audio.addEventListener("error", () => {
    setMusicState(false, "音频没有加载成功，请确认 assets/spring-rain.mp3 文件存在");
    musicToggle.classList.add("is-attention");
    musicLabel.textContent = "音乐未就绪";
  });

  function launchCelebration() {
    if (reducedMotion.matches) {
      return;
    }

    celebrationLayer.replaceChildren();
    const bursts = [
      { x: 18, y: 28, delay: 100, color: "--color-gold-600", count: 22, stretch: 126 },
      { x: 52, y: 18, delay: 500, color: "--color-gold-400", count: 26, stretch: 158 },
      { x: 82, y: 33, delay: 900, color: "--color-forest-700", count: 22, stretch: 118 }
    ];

    bursts.forEach((burst, burstIndex) => {
      const firework = document.createElement("span");
      firework.className = "firework";
      firework.style.setProperty("--fx", `${burst.x}%`);
      firework.style.setProperty("--fy", `${burst.y}%`);
      firework.style.setProperty("--delay", `${burst.delay}ms`);
      firework.style.setProperty("--core-duration", "700ms");
      firework.style.setProperty("--party-color", `var(${burst.color})`);

      for (let index = 0; index < burst.count; index += 1) {
        const particle = document.createElement("span");
        const angle = (Math.PI * 2 * index) / burst.count + burstIndex * 0.18;
        const radius = burst.stretch * (0.72 + (index % 3) * 0.14);
        particle.className = "firework__particle";
        particle.style.setProperty("--angle", `${angle}rad`);
        particle.style.setProperty("--radius", `${radius}px`);
        particle.style.setProperty("--piece-length", `${index % 3 === 0 ? 20 : 12}px`);
        particle.style.setProperty("--piece-thickness", `${index % 5 === 0 ? 3 : 2}px`);
        particle.style.setProperty("--piece-duration", `${1080 + (index % 6) * 55}ms`);
        particle.style.setProperty("--delay", `${burst.delay + (index % 5) * 24}ms`);
        firework.append(particle);
      }

      celebrationLayer.append(firework);
    });

    const confettiColors = [
      "--color-gold-600",
      "--color-wax",
      "--color-forest-700",
      "--color-gold-400"
    ];

    for (let index = 0; index < 34; index += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti";
      piece.style.setProperty("--cx", `${(index * 37 + 9) % 94 + 3}%`);
      piece.style.setProperty("--drift", `${((index % 7) - 3) * 24}px`);
      piece.style.setProperty("--spin", `${180 + ((index * 73) % 540)}deg`);
      piece.style.setProperty("--piece-width", `${index % 4 === 0 ? 10 : 6}px`);
      piece.style.setProperty("--piece-height", `${index % 3 === 0 ? 16 : 10}px`);
      piece.style.setProperty("--piece-radius", `${index % 5 === 0 ? "50%" : "1px"}`);
      piece.style.setProperty("--piece-duration", `${2800 + (index % 6) * 220}ms`);
      piece.style.setProperty("--delay", `${index * 38}ms`);
      piece.style.setProperty("--party-color", `var(${confettiColors[index % confettiColors.length]})`);
      celebrationLayer.append(piece);
    }
  }

  acceptWish.addEventListener("click", () => {
    if (birthday.classList.contains("is-blessed")) {
      return;
    }

    birthday.classList.add("is-blessed");
    acceptWish.setAttribute("aria-pressed", "true");
    acceptWish.querySelector("span").textContent = "祝福已收下";
    wishMessage.hidden = false;
    launchCelebration();
  });

  foodCards.forEach((card) => {
    card.addEventListener("click", () => {
      const isRemembered = card.getAttribute("aria-pressed") === "true";
      card.setAttribute("aria-pressed", String(!isRemembered));
    });
  });

  function trapSecretFocus(event) {
    if (event.key !== "Tab") {
      return;
    }

    const focusable = [
      ...secretGift.querySelectorAll(
        "button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])"
      )
    ];
    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    const activeInsideButton = focusable.includes(active);

    if (event.shiftKey && (active === first || !activeInsideButton)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !activeInsideButton)) {
      event.preventDefault();
      first.focus();
    }
  }

  function openSecret() {
    window.clearTimeout(secretCloseTimer);
    focusBeforeSecret = document.activeElement;
    experience.inert = true;
    skipLink.inert = true;
    musicToggle.inert = true;
    document.body.classList.add("is-locked");
    secretGift.hidden = false;
    secretGift.setAttribute("aria-hidden", "false");
    document.addEventListener("keydown", trapSecretFocus);

    window.requestAnimationFrame(() => {
      secretGift.classList.add("is-open");
      secretCard.focus({ preventScroll: true });
    });
  }

  function closeSecret() {
    secretGift.classList.remove("is-open");
    secretGift.setAttribute("aria-hidden", "true");
    experience.inert = false;
    skipLink.inert = false;
    musicToggle.inert = false;
    document.body.classList.remove("is-locked");
    document.removeEventListener("keydown", trapSecretFocus);

    const closeDuration = reducedMotion.matches ? 160 : 650;
    secretCloseTimer = window.setTimeout(() => {
      secretGift.hidden = true;
      if (focusBeforeSecret instanceof HTMLElement) {
        focusBeforeSecret.focus({ preventScroll: true });
      }
    }, closeDuration);
  }

  secretTrigger.addEventListener("click", openSecret);
  secretReturn.addEventListener("click", closeSecret);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !secretGift.hidden) {
      closeSecret();
    }
  });

  window.addEventListener("scroll", queueScrollUpdate, { passive: true });
  window.addEventListener("resize", queueScrollUpdate, { passive: true });

  reducedMotion.addEventListener("change", () => {
    if (revealObserver) {
      revealObserver.disconnect();
    }
    if (experienceOpened) {
      initReveals();
    }
  });

  queueScrollUpdate();
})();
