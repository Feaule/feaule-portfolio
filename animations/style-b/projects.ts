import { gsap, SplitText, MQ } from "@/lib/gsap";

export type CarouselNav = { index: number; atStart: boolean; atEnd: boolean };
export type CarouselApi = { goTo: (i: number) => void; step: (dir: 1 | -1) => void; revert: () => void };

/**
 * Style B projects: transform-driven coverflow. One float `pos` (the fractional
 * card index at the centre) is tweened; every card derives its position, scale,
 * tilt, dimming and blur from its distance to `pos`.
 * Supports drag/swipe, trackpad swipe, arrows, keyboard and click-to-centre.
 */
export function animateProjectsB(root: HTMLElement, onNav: (n: CarouselNav) => void): CarouselApi {
  const q = gsap.utils.selector(root);
  const stage = root.querySelector<HTMLElement>("[data-stage]")!;
  const cards = q("[data-card]") as HTMLElement[];
  const inners = cards.map((c) => c.querySelector<HTMLElement>("[data-card-inner]")!);
  const dims = cards.map((c) => c.querySelector<HTMLElement>("[data-dim]")!);
  const medias = cards.map((c) => c.querySelector<HTMLElement>("[data-media]"));
  const last = cards.length - 1;
  const calm = window.matchMedia(MQ.reduced);

  const state = { pos: 0 };
  let target = 0;
  let unit = 500; // horizontal distance between the centre card and its neighbour
  let reported = -1;

  const measure = () => {
    unit = cards[0].offsetWidth * (window.innerWidth < 640 ? 0.9 : 0.8);
  };

  const render = () => {
    const p = state.pos;
    cards.forEach((card, i) => {
      const d = i - p;
      const a = Math.abs(d);
      const s = Math.sign(d);
      const near = Math.min(a, 1);
      const far = Math.min(Math.max(a - 1, 0), 1);

      gsap.set(card, {
        x: s * unit * (near + 0.5 * far + 0.3 * Math.max(a - 2, 0)),
        scale: 1 - 0.16 * near - 0.08 * far,
        rotationY: -s * (near * 16 + far * 4),
        transformPerspective: 1600,
        zIndex: 50 - Math.round(a * 10),
        autoAlpha: a > 2.6 ? 0 : 1 - far * 0.5,
      });
      gsap.set(dims[i], { opacity: near * 0.5 + far * 0.25 });
      const blur = calm.matches ? 0 : near * 1.6 + far * 1.2;
      gsap.set(inners[i], { filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none" });
      if (medias[i]) gsap.set(medias[i], { x: gsap.utils.clamp(-1.5, 1.5, -d) * 22 });
    });
  };

  const setActive = (i: number) => {
    if (i === reported) return;
    reported = i;
    cards.forEach((c, k) => { c.dataset.active = String(k === i); });
    onNav({ index: i, atStart: i === 0, atEnd: i === last });
  };

  const goTo = (i: number) => {
    target = gsap.utils.clamp(0, last, Math.round(i));
    setActive(target);
    if (calm.matches) {
      gsap.killTweensOf(state);
      state.pos = target;
      render();
      return;
    }
    gsap.to(state, { pos: target, duration: 1.1, ease: "power3.out", overwrite: true, onUpdate: render });
  };
  const step = (dir: 1 | -1) => goTo(target + dir);

  measure();
  render();
  setActive(0);

  const ro = new ResizeObserver(() => { measure(); render(); });
  ro.observe(stage);

  // ── Drag / swipe (mouse + touch; vertical page scroll still works via touch-action: pan-y)
  let down = false, dragging = false, suppressClick = false;
  let startX = 0, startPos = 0, lastX = 0, lastT = 0, vel = 0;

  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    down = true; dragging = false;
    startX = lastX = e.clientX; startPos = state.pos; lastT = performance.now(); vel = 0;
    gsap.killTweensOf(state);
  };
  const onMove = (e: PointerEvent) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!dragging && Math.abs(dx) > 6) {
      dragging = true;
      stage.setPointerCapture(e.pointerId);
      stage.dataset.dragging = "true";
    }
    if (!dragging) return;
    const now = performance.now();
    vel = 0.8 * vel + 0.2 * ((e.clientX - lastX) / Math.max(1, now - lastT));
    lastX = e.clientX; lastT = now;
    state.pos = gsap.utils.clamp(-0.35, last + 0.35, startPos - dx / unit);
    setActive(gsap.utils.clamp(0, last, Math.round(state.pos)));
    render();
  };
  const onUp = (e: PointerEvent) => {
    if (!down) return;
    down = false;
    if (!dragging) return;
    dragging = false;
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 0);
    delete stage.dataset.dragging;
    if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
    goTo(state.pos - (vel * 320) / unit);
  };

  // Click: a drag never opens anything; a side card only moves to the centre first.
  const onClick = (e: MouseEvent) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-card]");
    if (!card) return;
    if (suppressClick) { e.preventDefault(); e.stopPropagation(); return; }
    const i = cards.indexOf(card);
    if (i !== target) { e.preventDefault(); e.stopPropagation(); goTo(i); }
  };

  // Keyboard focus on a side card brings it to the centre (mouse focus is ignored).
  const onFocusIn = (e: FocusEvent) => {
    const t = e.target as HTMLElement;
    if (!t.matches(":focus-visible")) return;
    const card = t.closest<HTMLElement>("[data-card]");
    if (card && cards.indexOf(card) !== target) goTo(cards.indexOf(card));
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    else if (e.key === "Home") { e.preventDefault(); goTo(0); }
    else if (e.key === "End") { e.preventDefault(); goTo(last); }
  };

  // Horizontal trackpad swipe: one card per gesture, vertical scroll untouched.
  let acc = 0, wheelLock = false, wheelTimer = 0;
  const onWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    if (wheelLock) return;
    acc += e.deltaX;
    if (Math.abs(acc) > 50) {
      step(acc > 0 ? 1 : -1);
      acc = 0; wheelLock = true;
      wheelTimer = window.setTimeout(() => { wheelLock = false; }, 450);
    }
  };

  stage.addEventListener("pointerdown", onDown);
  stage.addEventListener("pointermove", onMove);
  stage.addEventListener("pointerup", onUp);
  stage.addEventListener("pointercancel", onUp);
  stage.addEventListener("click", onClick, true);
  stage.addEventListener("focusin", onFocusIn);
  stage.addEventListener("keydown", onKey);
  stage.addEventListener("wheel", onWheel, { passive: false });

  const mm = gsap.matchMedia();
  mm.add(MQ.motionOk, () => {
    const heading = q("[data-split]")[0];
    const split = SplitText.create(heading, { type: "chars", charsClass: "char" });
    gsap.from(split.chars, {
      yPercent: 120, rotate: () => gsap.utils.random(-20, 20), opacity: 0,
      duration: 1, ease: "back.out(1.6)", stagger: { each: 0.06, from: "random" },
      scrollTrigger: { trigger: heading, start: "top 85%", once: true },
    });
    gsap.set(heading, { visibility: "visible" });
    gsap.fromTo(q("[data-controls]"), { opacity: 0, y: 16 }, {
      opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: heading, start: "top 85%", once: true },
    });
    gsap.fromTo(stage, { opacity: 0, y: 60 }, {
      opacity: 1, y: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: stage, start: "top 88%", once: true },
    });
    return () => split.revert();
  });

  return {
    goTo,
    step,
    revert() {
      mm.revert();
      ro.disconnect();
      gsap.killTweensOf(state);
      clearTimeout(wheelTimer);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      stage.removeEventListener("click", onClick, true);
      stage.removeEventListener("focusin", onFocusIn);
      stage.removeEventListener("keydown", onKey);
      stage.removeEventListener("wheel", onWheel);
    },
  };
}