import { gsap, MQ } from "@/lib/gsap";

/**
 * Style B footer/contact: items fade up in a quiet stagger, and the big
 * wordmark rises into place as you reach the bottom of the page (transform only).
 */
export function animateContactB(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const mm = gsap.matchMedia();

  mm.add(MQ.motionOk, () => {
    gsap.fromTo(q("[data-fade]"), { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: "power3.out",
      scrollTrigger: { trigger: root, start: "top 80%", once: true },
    });

    gsap.fromTo(q("[data-wordmark]"), { yPercent: 28 }, {
      yPercent: 0, ease: "none",
      scrollTrigger: { trigger: root, start: "top bottom", end: "bottom bottom", scrub: true },
    });
  });

  return { revert: () => mm.revert() };
}
