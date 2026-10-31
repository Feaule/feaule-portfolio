import { gsap, SplitText, MQ } from "@/lib/gsap";

/** The "composition": 3 seconds at 24 fps, like a short AE comp. */
const FPS = 24;
const DURATION = 3;
const pad = (n: number) => String(n).padStart(2, "0");
const timecodeOf = (frame: number) =>
  `00:00:${pad(Math.floor(frame / FPS))}:${pad(frame % FPS)}`;

/**
 * Style A hero: one orchestrated intro (masked letter reveal + a playhead that
 * "plays" the comp), then user-driven scrubbing and a quiet scroll drift.
 * Returns { revert } for useGSAP cleanup.
 */
export function animateHeroA(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const strip = root.querySelector<HTMLElement>("[data-timeline]")!;
  const playhead = root.querySelector<HTMLElement>("[data-playhead]")!;
  const curve = root.querySelector<HTMLElement>("[data-curve]")!;
  const timecode = root.querySelector<HTMLElement>("[data-timecode]")!;
  const keys = q("[data-key]") as HTMLElement[];

  // Playhead position (0–1). Everything on the strip is derived from it.
  const state = { f: 1 };
  let width = strip.clientWidth;
  let lastFrame = -1;

  const render = () => {
    gsap.set(playhead, { x: state.f * width });
    curve.style.clipPath = `inset(-4px ${(1 - state.f) * 100}% -4px 0)`;
    const frame = Math.round(state.f * DURATION * FPS);
    if (frame !== lastFrame) {
      lastFrame = frame;
      timecode.textContent = timecodeOf(frame);
    }
    for (const k of keys) k.dataset.on = String(state.f >= Number(k.dataset.at) - 0.001);
  };

  const ro = new ResizeObserver(() => {
    width = strip.clientWidth;
    render();
  });
  ro.observe(strip);

  const mm = gsap.matchMedia();

  // Reduced motion: finished frame, no animation.
  mm.add(MQ.reduced, () => {
    state.f = 1;
    render();
  });

  mm.add(MQ.motionOk, () => {
    state.f = 0;
    render();

    const split = SplitText.create(q("[data-split]"), { type: "lines,chars", mask: "lines" });
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.from(split.chars, { yPercent: 118, rotate: 6, duration: 1.4, stagger: 0.04 }, 0.1)
      .fromTo(q("[data-draw]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" }, 0.2)
      .fromTo(q("[data-fade]"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out" }, 0.6)
      .to(state, { f: 1, duration: 2.2, ease: "power2.inOut", onUpdate: render }, 0.7);
    gsap.set(q("[data-split]"), { visibility: "visible" });

    // Ambient: one dot circling the ring.
    gsap.to(q("[data-orbit]"), { rotation: 360, svgOrigin: "200 200", duration: 30, repeat: -1, ease: "none" });

    // Scroll: the two headline lines drift apart, the ring lags behind.
    const scrub = { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 };
    gsap.to(q('[data-split="1"]'), { xPercent: -6, ease: "none", scrollTrigger: scrub });
    gsap.to(q('[data-split="2"]'), { xPercent: 6, ease: "none", scrollTrigger: scrub });
    gsap.to(q("[data-ring-wrap]"), { yPercent: -18, ease: "none", scrollTrigger: scrub });

    // Hover / drag along the timeline to scrub it, like dragging the CTI in AE.
    const scrubTo = (f: number) =>
      gsap.to(state, { f, duration: 0.35, ease: "power3.out", overwrite: true, onUpdate: render });
    const move = (e: PointerEvent) => {
      const r = strip.getBoundingClientRect();
      scrubTo(gsap.utils.clamp(0, 1, (e.clientX - r.left) / r.width));
    };
    const leave = () => scrubTo(1);
    strip.addEventListener("pointermove", move);
    strip.addEventListener("pointerleave", leave);

    return () => {
      strip.removeEventListener("pointermove", move);
      strip.removeEventListener("pointerleave", leave);
      split.revert();
    };
  });

  return {
    revert() {
      mm.revert();
      ro.disconnect();
    },
  };
}