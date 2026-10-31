import { gsap, ScrollTrigger, SplitText, MQ } from "@/lib/gsap";

/**
 * Style B hero: shape layers on a "camera" that reacts to the pointer and
 * dollies on scroll. Idle loops pause when the hero is off-screen.
 * Returns { revert } for useGSAP cleanup.
 */
export function animateHeroB(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const camera = root.querySelector<HTMLElement>("[data-camera]")!;
  const layers = q("[data-layer]") as HTMLElement[];
  const mm = gsap.matchMedia();

  mm.add(MQ.motionOk, () => {
    const split = SplitText.create(q("[data-split]"), { type: "chars", charsClass: "char" });

    // ── Intro: shapes pop in, title letters drop in at random
    const tl = gsap.timeline();
    tl.fromTo(q("[data-shape]"), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, stagger: 0.12, ease: "back.out(1.5)" }, 0)
      .from(split.chars, { yPercent: -140, rotate: () => gsap.utils.random(-30, 30), opacity: 0, duration: 1.1, ease: "back.out(1.8)", stagger: { each: 0.07, from: "random" } }, 0.25)
      .fromTo(q("[data-fade]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" }, 0.9);
    gsap.set(q("[data-split]"), { visibility: "visible" });

    // ── Idle loops (collected so they can pause off-screen)
    const loops: gsap.core.Animation[] = [];
    loops.push(
      gsap.to(q("[data-spin-slow]"), { rotation: 360, duration: 40, repeat: -1, ease: "none" }),
      gsap.to(q("[data-spin]"), { rotation: -360, duration: 26, repeat: -1, ease: "none" }),
      gsap.to(q("[data-float]"), { y: "-=3vmin", duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut" }),
      gsap.to(q("[data-marquee]"), { xPercent: -50, duration: 32, repeat: -1, ease: "none" }),
      gsap.to(q("[data-path-dot]"), {
        motionPath: { path: "[data-path]", align: "[data-path]", alignOrigin: [0.5, 0.5] },
        duration: 4.5, repeat: -1, yoyo: true, ease: "power1.inOut",
      }),
    );
    ScrollTrigger.create({
      trigger: root, start: "top bottom", end: "bottom top",
      onToggle: (self) => loops.forEach((a) => a.paused(!self.isActive)),
    });

    // ── Scroll: camera dolly + per-layer parallax (transform only, no pin)
    const scrub = { trigger: root, start: "top top", end: "bottom top", scrub: true };
    gsap.to(camera, { scale: 1.2, ease: "none", scrollTrigger: scrub });
    layers.forEach((el) => {
      gsap.to(el, { yPercent: -Number(el.dataset.depth) * 22, ease: "none", scrollTrigger: scrub });
    });

    // ── Pointer camera + title letter hops (fine pointers only)
    const mmPointer = gsap.matchMedia();
    mmPointer.add("(hover: hover) and (pointer: fine)", () => {
      const setters = layers.map((el) => ({
        depth: Number(el.dataset.depth),
        x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
        y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
      }));
      const rotY = gsap.quickTo(camera, "rotationY", { duration: 1, ease: "power3" });
      const rotX = gsap.quickTo(camera, "rotationX", { duration: 1, ease: "power3" });

      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        setters.forEach((s) => { s.x(-nx * s.depth * 70); s.y(-ny * s.depth * 50); });
        rotY(nx * 7); rotX(-ny * 5);
      };
      const onLeave = () => {
        setters.forEach((s) => { s.x(0); s.y(0); });
        rotY(0); rotX(0);
      };
      const onHop = (e: PointerEvent) => {
        const c = (e.target as Element).closest(".char");
        if (c) gsap.fromTo(c, { y: 0, rotate: 0 }, { y: -18, rotate: gsap.utils.random(-14, 14), duration: 0.22, yoyo: true, repeat: 1, ease: "power2.out", overwrite: "auto" });
      };
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
      root.addEventListener("pointerover", onHop);
      return () => {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
        root.removeEventListener("pointerover", onHop);
      };
    });

    return () => { mmPointer.revert(); split.revert(); };
  });

  return { revert: () => mm.revert() };
}

/** Show/hide one shape layer (the eye toggle). Instant under reduced motion. */
export function toggleLayer(root: HTMLElement, index: number, visible: boolean) {
  const target = root.querySelectorAll(`[data-focus="${index}"]`);
  const reduce = window.matchMedia(MQ.reduced).matches;
  gsap.to(target, {
    opacity: visible ? 1 : 0,
    scale: visible ? 1 : 0.6,
    duration: reduce ? 0 : 0.5,
    ease: "back.out(1.6)",
  });
}

/** Brief pulse so hovering a layer row shows which shape it controls. */
export function pulseLayer(root: HTMLElement, index: number) {
  if (window.matchMedia(MQ.reduced).matches) return;
  gsap.fromTo(
    root.querySelectorAll(`[data-focus="${index}"]`),
    { scale: 1 }, { scale: 1.12, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out", overwrite: "auto" },
  );
}