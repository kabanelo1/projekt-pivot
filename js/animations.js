const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobileLike = window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const shouldUseLowMotion = isReducedMotion || isMobileLike;

// Mouse glow is desktop-only to avoid touch-scroll jank on mobile GPUs.
if (!shouldUseLowMotion && canHover) {
  document.addEventListener("mousemove", (event) => {
    const body = document.body;
    body.style.setProperty("--x", `${(event.clientX / window.innerWidth) * 100}%`);
    body.style.setProperty("--y", `${(event.clientY / window.innerHeight) * 100}%`);
  }, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  if (shouldUseLowMotion) {
    document.body.classList.add("low-motion");
  }

  const statCounters = document.querySelectorAll(".stat[data-target]");

  const animateCounter = (element, target) => {
    const duration = shouldUseLowMotion ? 1000 : 2000;
    const startTime = Date.now();

    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(target * progress);
      element.textContent = String(current);

      if (progress < 1) {
        window.requestAnimationFrame(update);
      } else {
        element.textContent = String(target);
      }
    };

    window.requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.animated) return;
      const stat = entry.target;
      const target = Number.parseInt(stat.dataset.target || "0", 10);
      const counterElement = stat.querySelector(".stat-counter");

      if (counterElement && Number.isFinite(target)) {
        stat.dataset.animated = "true";
        animateCounter(counterElement, target);
      }
      counterObserver.unobserve(stat);
    });
  }, { threshold: 0.3 });

  statCounters.forEach((stat) => counterObserver.observe(stat));

  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("click", function onButtonClick(event) {
      if (!(event instanceof MouseEvent)) return;
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.classList.add("ripple");

      const existing = this.querySelector(".ripple");
      if (existing) existing.remove();
      this.appendChild(ripple);
    });

    if (!shouldUseLowMotion && canHover) {
      button.addEventListener("mouseenter", function onButtonEnter() {
        this.style.filter = "brightness(1.1)";
      });

      button.addEventListener("mouseleave", function onButtonLeave() {
        this.style.filter = "brightness(1)";
      });
    }
  });

  const revealElements = document.querySelectorAll("[data-reveal]");
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach((element) => revealObserver.observe(element));
  }
});

window.addEventListener("load", () => {
  document.body.style.opacity = "1";
});
