import { gsap, ScrollTrigger, SplitText, MQ } from "@/lib/gsap";
import { timecodeAt } from "@/lib/timecode";

/**
 * Style B About: heading letters + text reveal on scroll, masked portrait reveal,
 * drifting background shapes, and a keyframe timeline whose playhead is
 * scrubbed by scroll (the Concept A timeline idea, vertical).
 * Returns { revert } for useGSAP cleanup.
 */
export function animateAboutB(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const list = root.querySelector<HTMLElement>("[data-keylist]")!;
  const playhead = root.querySelector<HTMLElement>("[data-playhead]")!;
  const timecode = root.querySelector<HTMLElement>("[data-timecode]")!;
  const items = q("[data-key]") as HTMLElement[];
  const diamonds = q("[data-diamond]") as HTMLElement[];

  const mm = gsap.matchMedia();

  // Reduced motion: everything is already visible; all keyframes stay lit, playhead hidden.
  mm.add(MQ.motionOk, () => {
    // ── Heading letters
    const heading = q("[data-split]")[0];
    const split = SplitText.create(heading, { type: "chars", charsClass: "char" });
    gsap.from(split.chars, {
      yPercent: 120, rotate: () => gsap.utils.random(-20, 20), opacity: 0,
      duration: 1, ease: "back.out(1.6)", stagger: { each: 0.06, from: "random" },
      scrollTrigger: { trigger: heading, start: "top 85%", once: true },
    });
    gsap.set(heading, { visibility: "visible" });

    // ── Text blocks and keyframe rows rise in as they enter
    (q("[data-fade]") as HTMLElement[]).forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });

    // ── Portrait: masked wipe, image settles from a zoom
    const frame = q("[data-portrait]");
    const wipe = { trigger: frame[0], start: "top 85%", once: true };
    gsap.fromTo(frame, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out", scrollTrigger: wipe });
    gsap.fromTo(q("[data-portrait-img]"), { scale: 1.3 }, { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: wipe });

    // ── Background shapes drift at different speeds
    (q("[data-drift]") as HTMLElement[]).forEach((el) => {
      const d = Number(el.dataset.drift);
      gsap.to(el, {
        yPercent: d * 25, rotate: d * 40, ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    // ── Keyframe timeline: playhead follows scroll through the list
    const state = { p: 0 };
    let height = 0;
    let tops: number[] = [];

    const measure = () => {
      height = list.clientHeight;
      tops = items.map((li, i) => li.offsetTop + diamonds[i].offsetTop + diamonds[i].offsetHeight / 2);
    };
    const render = () => {
      const y = state.p * height;
      gsap.set(playhead, { y });
      timecode.textContent = timecodeAt(state.p);
      diamonds.forEach((d, i) => { d.dataset.on = String(y >= tops[i] - 1); });
    };

    gsap.set(playhead, { opacity: 1 });
    measure();
    render();

    ScrollTrigger.create({
      trigger: list, start: "top 65%", end: "bottom 55%",
      onRefresh: () => { measure(); render(); },
      onUpdate: (self) => {
        gsap.to(state, { p: self.progress, duration: 0.4, ease: "power2.out", overwrite: true, onUpdate: render });
      },
    });
    // Web fonts change text height → re-measure once they're ready.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => split.revert();
  });

  return { revert: () => mm.revert() };
}
