import { gsap, SplitText, MQ } from "@/lib/gsap";

export type CarouselNav = { index: number; atStart: boolean; atEnd: boolean };

const reduced = () => window.matchMedia(MQ.reduced).matches;

/**
 * Style B projects: a native scroll-snap carousel (works without JS), enhanced with
 * a camera-like depth effect, mouse drag, and intro reveals.
 * `onNav` reports the active card so React can render the counter and arrows.
 */
export function animateProjectsB(root: HTMLElement, onNav: (n: CarouselNav) => void) {
  const q = gsap.utils.selector(root);
  const track = root.querySelector<HTMLElement>("[data-track]")!;
  const cards = q("[data-card]") as HTMLElement[];
  const inners = q("[data-card-inner]") as HTMLElement[];
  const arts = cards.map((c) => c.querySelector<HTMLElement>("[data-art]"));

  let depthOn = false;
  let raf = 0;

  const step = () => (cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].offsetWidth);

  const update = () => {
    raf = 0;
    const s = step();
    const max = track.scrollWidth - track.clientWidth;
    const pos = track.scrollLeft / s; // fractional card index at the left edge
    const atStart = track.scrollLeft <= 2;
    const atEnd = track.scrollLeft >= max - 2;
    const index = atEnd ? cards.length - 1 : gsap.utils.clamp(0, cards.length - 1, Math.round(pos));
    onNav({ index, atStart, atEnd });

    if (depthOn) {
      cards.forEach((_, i) => {
        const d = i - pos;
        const a = Math.min(Math.abs(d), 1);
        gsap.set(inners[i], { scale: 1 - a * 0.05 });
        if (arts[i]) gsap.set(arts[i], { x: -d * 36 });
      });
    }
  };
  const queue = () => { if (!raf) raf = requestAnimationFrame(update); };

  track.addEventListener("scroll", queue, { passive: true });
  const ro = new ResizeObserver(queue);
  ro.observe(track);
  update();

  const mm = gsap.matchMedia();

  mm.add(MQ.motionOk, () => {
    depthOn = true;
    update();

    // Intro: heading letters, controls and cards
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
    gsap.fromTo(cards, { opacity: 0, y: 60 }, {
      opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out",
      scrollTrigger: { trigger: track, start: "top 85%", once: true },
    });

    return () => { depthOn = false; split.revert(); };
  });

  // Mouse drag-to-scroll (fine pointers only; touch uses native swipe)
  mm.add("(hover: hover) and (pointer: fine)", () => {
    let down = false, startX = 0, startLeft = 0, moved = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true; moved = 0; startX = e.clientX; startLeft = track.scrollLeft;
      track.style.scrollSnapType = "none";
      track.style.userSelect = "none";
      track.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      track.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      track.style.scrollSnapType = "";
      track.style.userSelect = "";
      track.style.cursor = "";
      const i = gsap.utils.clamp(0, cards.length - 1, Math.round(track.scrollLeft / step()));
      track.scrollTo({ left: i * step(), behavior: reduced() ? "auto" : "smooth" });
    };
    // A drag must not trigger the link under the pointer.
    const onClick = (e: MouseEvent) => {
      if (moved > 5) { e.preventDefault(); e.stopPropagation(); }
      moved = 0;
    };

    track.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    track.addEventListener("click", onClick, true);
    return () => {
      track.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      track.removeEventListener("click", onClick, true);
    };
  });

  return {
    revert() {
      mm.revert();
      ro.disconnect();
      track.removeEventListener("scroll", queue);
      cancelAnimationFrame(raf);
    },
  };
}

/** Prev / next arrows: move exactly one card. */
export function stepCarousel(root: HTMLElement, dir: 1 | -1) {
  const track = root.querySelector<HTMLElement>("[data-track]")!;
  const cards = root.querySelectorAll<HTMLElement>("[data-card]");
  const s = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].offsetWidth;
  track.scrollBy({ left: dir * s, behavior: reduced() ? "auto" : "smooth" });
}
