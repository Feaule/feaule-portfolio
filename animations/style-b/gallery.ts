import { gsap, MQ } from "@/lib/gsap";

/** How long each image stays before the next one wipes in. */
export const GALLERY_INTERVAL = 5000;

export type GalleryState = { index: number; playing: boolean };
export type GalleryControls = {
  next(): void;
  prev(): void;
  goTo(i: number): void;
  toggle(): void;
  destroy(): void;
};

const reduced = () => window.matchMedia(MQ.reduced).matches;

/**
 * Detail-view image carousel: a direction-aware masked wipe, the new image
 * settling from a slight zoom. A GSAP tween is the autoplay timer, so it can
 * pause cleanly (hover, focus, hidden tab, user toggle) and also drives the
 * progress line. Under reduced motion it starts paused and swaps instantly.
 */
export function createGallery(
  root: HTMLElement,
  opts: { count: number; interval?: number; onState: (s: GalleryState) => void },
): GalleryControls {
  const { count, onState } = opts;
  const interval = opts.interval ?? GALLERY_INTERVAL;
  const slides = Array.from(root.querySelectorAll<HTMLElement>("[data-slide]"));
  const media = slides.map((s) => s.querySelector<HTMLElement>("[data-slide-media]")!);
  const fill = root.querySelector<HTMLElement>("[data-fill]");

  let index = 0;
  let userPlaying = !reduced() && count > 1;
  let hover = false;
  const clock = { t: 0 };

  const emit = () => onState({ index, playing: userPlaying });
  const render = () => { if (fill) gsap.set(fill, { scaleX: (index + clock.t) / count }); };

  const timer = gsap.to(clock, {
    t: 1, duration: interval / 1000, ease: "none", paused: true,
    onUpdate: render,
    onComplete: () => goTo((index + 1) % count, 1),
  });

  const sync = () => {
    const run = userPlaying && !hover && !document.hidden && count > 1;
    if (run) timer.play(); else timer.pause();
  };

  function goTo(target: number, dir?: 1 | -1) {
    const to = ((target % count) + count) % count;
    const from = index;
    const d = dir ?? (to >= from ? 1 : -1);

    clock.t = 0;
    timer.pause(0);
    if (to === from) { render(); sync(); return; }

    index = to;
    render();
    emit();
    slides.forEach((s, i) => s.setAttribute("aria-hidden", String(i !== to)));
    gsap.killTweensOf([...slides, ...media]);

    if (reduced()) {
      gsap.set(slides, { visibility: "hidden", zIndex: 0 });
      gsap.set(slides[to], { visibility: "visible", clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(media, { clearProps: "transform" });
    } else {
      slides.forEach((s, i) => { if (i !== to && i !== from) gsap.set(s, { visibility: "hidden", zIndex: 0 }); });
      gsap.set(slides[from], { zIndex: 1 });
      gsap.set(slides[to], {
        visibility: "visible", zIndex: 2,
        clipPath: d > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
      });
      gsap.set(media[to], { scale: 1.12 });
      gsap.to(slides[to], {
        clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut",
        onComplete: () => {
          slides.forEach((s, i) => {
            if (i !== index) { gsap.set(s, { visibility: "hidden", zIndex: 0 }); gsap.set(media[i], { clearProps: "transform" }); }
          });
        },
      });
      gsap.to(media[to], { scale: 1, duration: 1.3, ease: "expo.out" });
      gsap.to(media[from], { xPercent: -d * 6, duration: 0.9, ease: "expo.inOut" });
    }
    sync();
  }

  // Initial state
  gsap.set(slides.slice(1), { visibility: "hidden" });
  render();
  emit();
  sync();

  const onEnter = () => { hover = true; sync(); };
  const onLeave = () => { hover = false; sync(); };
  const onFocusOut = (e: FocusEvent) => { if (!root.contains(e.relatedTarget as Node)) onLeave(); };
  const onVisibility = () => sync();
  root.addEventListener("pointerenter", onEnter);
  root.addEventListener("pointerleave", onLeave);
  root.addEventListener("focusin", onEnter);
  root.addEventListener("focusout", onFocusOut);
  document.addEventListener("visibilitychange", onVisibility);

  return {
    next: () => goTo(index + 1, 1),
    prev: () => goTo(index - 1, -1),
    goTo: (i) => goTo(i),
    toggle: () => { userPlaying = !userPlaying; emit(); sync(); },
    destroy() {
      timer.kill();
      gsap.killTweensOf([...slides, ...media]);
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("focusin", onEnter);
      root.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}
