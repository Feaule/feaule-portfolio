import { gsap, ScrollTrigger } from "@/lib/gsap";

// Pinned horizontal scrub only on tablet/desktop with motion allowed.
// Mobile and reduced motion use native horizontal scrolling (CSS scroll-snap).
const PINNED = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

export function animateJourney(root: HTMLElement) {
  const viewport = root.querySelector<HTMLElement>("[data-viewport]")!;
  const track = root.querySelector<HTMLElement>("[data-track]")!;
  const fill = root.querySelector<HTMLElement>("[data-fill]")!;
  const playhead = root.querySelector<HTMLElement>("[data-playhead]")!;
  const items = Array.from(root.querySelectorAll<HTMLElement>("[data-stage]"));
  const markers = items.map((li) => li.querySelector<HTMLElement>("[data-marker]")!);

  const mm = gsap.matchMedia();
  let alive = true;

  mm.add(PINNED, () => {
    viewport.style.overflowX = "hidden";
    viewport.scrollLeft = 0;
    viewport.removeAttribute("tabindex"); // nothing to scroll by keyboard while pinned

    let centers: number[] = [];
    let trackWidth = 1;

    const distance = () => Math.max(1, track.scrollWidth - viewport.clientWidth);
    // Vertical scroll spent on the pin. Slightly shorter than the horizontal
    // distance so the section never feels like a trap. Tune 0.9 if needed.
    const scrollLength = () => Math.max(700, Math.round(distance() * 1.2));

    const measure = () => {
      trackWidth = track.scrollWidth;
      centers = markers.map((m, i) => items[i].offsetLeft + m.offsetLeft + m.offsetWidth / 2);
    };

    const sync = (p: number) => {
      if (centers.length < 2) return;
      const pos = p * (items.length - 1);
      const i = Math.min(Math.floor(pos), items.length - 2);
      const x = centers[i] + (centers[i + 1] - centers[i]) * (pos - i);
      gsap.set(playhead, { x });
      gsap.set(fill, { scaleX: x / trackWidth });
      const active = Math.round(pos);
      items.forEach((li, idx) => {
        li.dataset.state = idx < active ? "past" : idx === active ? "active" : "future";
      });
    };

    gsap.set(playhead, { opacity: 1 });
    measure();
    sync(0);

    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      onUpdate: function (this: gsap.core.Tween) {
        sync(this.progress());
      },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: () => "+=" + scrollLength(),
        pin: true,
        anticipatePin: 1,
        scrub: 0.5,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          measure();
          sync(self.progress);
        },
      },
    });

    // Web fonts change text widths, so re-measure once they're ready.
    document.fonts?.ready.then(() => {
      if (alive) ScrollTrigger.refresh();
    });

    return () => {
      viewport.style.overflowX = "";
      viewport.setAttribute("tabindex", "0");
      items.forEach((li) => li.removeAttribute("data-state"));
    };
  });

  return {
    revert: () => {
      alive = false;
      mm.revert();
    },
  };
}