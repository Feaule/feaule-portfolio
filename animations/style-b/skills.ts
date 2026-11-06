import { gsap, SplitText, MQ } from "@/lib/gsap";

/** Style B skills: heading letters, then each group rises in and its tiles pop one by one. */
export function animateSkillsB(root: HTMLElement) {
  const q = gsap.utils.selector(root);
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

    (q("[data-group]") as HTMLElement[]).forEach((group) => {
      const trigger = { trigger: group, start: "top 85%", once: true };
      gsap.fromTo(group, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: trigger });
      gsap.from(group.querySelectorAll("[data-tile]"), {
        scale: 0.7, opacity: 0, duration: 0.7, stagger: 0.08, ease: "back.out(1.6)", delay: 0.15, scrollTrigger: trigger,
      });
    });

    return () => split.revert();
  });

  return { revert: () => mm.revert() };
}
