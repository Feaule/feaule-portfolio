import { gsap, SplitText, MQ } from "@/lib/gsap";

/**
 * Style B skills ("Motion Lab" workbench). Moderate and one-shot:
 * heading reveal, then ONE timeline when the workbench enters view —
 * ruler draws, tracks stagger in, tiles fade up, keyframe diamonds scale in,
 * and the playhead sweeps across once. Transform + opacity only, no loops, no pin.
 * Under reduced motion nothing runs: the CSS never hides content in that case.
 */
export function animateSkillsB(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const mm = gsap.matchMedia();

  mm.add(MQ.motionOk, () => {
    // ── Header
    const heading = q("[data-split]")[0];
    const split = SplitText.create(heading, { type: "words,chars", charsClass: "char" });
    gsap.from(split.chars, {
      yPercent: 60, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.025,
      scrollTrigger: { trigger: heading, start: "top 85%", once: true },
    });
    gsap.set(heading, { visibility: "visible" });

    gsap.fromTo(q("[data-eyebrow], [data-intro]"), { opacity: 0, y: 14 }, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
      scrollTrigger: { trigger: heading, start: "top 85%", once: true },
    });

    // ── Workbench timeline
    const bench = q("[data-bench]")[0];
    const lane = q("[data-lane-area]")[0] as HTMLElement | undefined;
    const playhead = q("[data-playhead]")[0];
    const tracks = q("[data-track]") as HTMLElement[];

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: bench, start: "top 75%", once: true },
    });

    tl.fromTo(q("[data-ruler]"), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0)
      .fromTo(q("[data-ticks]"), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.inOut", transformOrigin: "left center" }, 0);

    tracks.forEach((track, i) => {
      const at = 0.2 + i * 0.12;
      tl.fromTo(track, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, at)
        .fromTo(track.querySelectorAll("[data-tile]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 }, at + 0.15)
        .fromTo(track.querySelectorAll("[data-key]"), { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.05 }, at + 0.25);
    });

    // Playhead: one sweep across the lanes (desktop only — the area is display:none below md).
    if (playhead && lane) {
      tl.set(playhead, { opacity: 1 }, 0.3)
        .fromTo(playhead, { x: 0 }, { x: () => lane.offsetWidth, duration: 1.6, ease: "power2.inOut" }, 0.3)
        .to(playhead, { opacity: 0, duration: 0.4 }, ">");
    }

    tl.fromTo(q("[data-bench-footer]"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 1.4);

    return () => split.revert();
  });

  return { revert: () => mm.revert() };
}
