import { gsap, SplitText, MQ } from "@/lib/gsap";

/** Style B contact: heading letters, rows rise in one by one, background shapes drift. */
export function animateContactB(root: HTMLElement) {
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

    (q("[data-fade]") as HTMLElement[]).forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });

    (q("[data-drift]") as HTMLElement[]).forEach((el) => {
      const d = Number(el.dataset.drift);
      gsap.to(el, {
        yPercent: d * 25, rotate: d * 40, ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    return () => split.revert();
  });

  return { revert: () => mm.revert() };
}
