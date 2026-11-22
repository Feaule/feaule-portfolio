import { gsap, SplitText, MQ } from "@/lib/gsap";
// Hologram foto mulai saat sekian porsi section About terlihat di layar (0–1).
const REVEAL_AT = 0.4;
/**
 * Style B About: heading letters, text rise-in, masked portrait reveal and
 * drifting background shapes. (The journey timeline now lives in Journey.)
 * Returns { revert } for useGSAP cleanup.
 */
export function animateAboutB(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const mm = gsap.matchMedia();

  // Reduced motion: everything is already visible, nothing animates.
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
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });

    // ── Portrait: hologram reveal (scan line + clip wipe + flicker + kotak hologram)
    const frame = q("[data-portrait]")[0] as HTMLElement;
    const img = q("[data-portrait-img]")[0] as HTMLElement;
    const fx = q("[data-holo-fx]")[0] as HTMLElement;
    const scan = q("[data-holo-scan]")[0] as HTMLElement;
    const cubes = q("[data-holo-cubes]")[0] as HTMLElement;
    const HIDDEN = "inset(0% 0% 100% 0%)";
    const SHOWN = "inset(0% 0% 0% 0%)";
    // const DUR = 1.4;
    const DUR = 1.0;   // lama garis scan menyapu foto (detik)
    const SPEED = 1;   // pengali kecepatan seluruh animasi. 1.4 = 40% lebih cepat
    const SCAN_EASE = "power2.inOut";

    gsap.set([img, fx], { clipPath: HIDDEN });
    gsap.set(img, { scale: 1.06 });
    gsap.set(fx, { opacity: 1 });

    // Mulai saat REVEAL_AT dari section terlihat, tapi tidak sebelum foto itu sendiri
    // benar-benar masuk layar (supaya tidak terlalu dahulu).
    const revealStart = () => {
      const vh = window.innerHeight;
      const needed = Math.min(root.offsetHeight * REVEAL_AT, vh * 0.8);
      const portraitTop = frame.getBoundingClientRect().top - root.getBoundingClientRect().top;
      return "top " + Math.round(Math.min(vh - needed, vh * 0.85 - portraitTop)) + "px";
    };

    const holo = gsap
      .timeline({ scrollTrigger: { trigger: root, start: revealStart, once: true, invalidateOnRefresh: true } })
      .set(scan, { opacity: 1 }, 0)
      .to([img, fx], { clipPath: SHOWN, duration: DUR, ease: SCAN_EASE }, 0)
      .to(scan, { y: () => frame.offsetHeight, duration: DUR, ease: SCAN_EASE }, 0)
      .to(img, { scale: 1, duration: DUR + 0.4, ease: "power3.out" }, 0)
      .to(img, { keyframes: { opacity: [0.35, 1, 0.55, 1, 0.8, 1], easeEach: "none" }, duration: 0.7 }, 0.1)
      .to(img, { keyframes: { x: [0, -6, 5, -3, 0], easeEach: "none" }, duration: 0.3 }, 0.35)
      .to(scan, { opacity: 0, duration: 0.25 }, DUR)
      .to(fx, { opacity: 0, duration: 1, ease: "power1.out" }, DUR * 0.6);

    // // Kotak hologram: tiap kotak muncul tepat saat garis scan melewati posisinya.
    // const scanEase = gsap.parseEase(SCAN_EASE);
    // const timeAt = (frac: number) => {
    //   // Kebalikan dari ease scan: kapan garis mencapai `frac` tinggi foto.
    //   let lo = 0, hi = 1;
    //   for (let k = 0; k < 20; k++) {
    //     const mid = (lo + hi) / 2;
    //     if (scanEase(mid) < frac) lo = mid; else hi = mid;
    //   }
    //   return hi;
    // };
    // const SIZES = [8, 12, 16, 22, 30];
    // const count = frame.offsetWidth > 420 ? 22 : 14;

    // for (let i = 0; i < count; i++) {
    //   const frac = gsap.utils.random(0.03, 0.97);
    //   const size = gsap.utils.random(SIZES);
    //   const filled = Math.random() < 0.45;
    //   const box = document.createElement("span");
    //   box.style.cssText =
    //     `position:absolute;left:${gsap.utils.random(4, 96).toFixed(1)}%;top:${(frac * 100).toFixed(1)}%;` +
    //     `width:${size}px;height:${size}px;` +
    //     (filled
    //       ? "background:color-mix(in srgb, var(--accent) 35%, transparent);"
    //       : "border:1px solid var(--accent);");
    //   cubes.appendChild(box);
    //   gsap.set(box, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });

    //   const peak = gsap.utils.random(0.8, 1.4);
    //   const life = gsap
    //     .timeline()
    //     .to(box, { scale: peak, opacity: 1, duration: 0.22, ease: "back.out(2.4)" })
    //     .to(box, { scale: peak * gsap.utils.random(0.45, 0.7), duration: 0.3, ease: "sine.inOut", yoyo: true, repeat: 1 })
    //     .to(box, { scale: 0, opacity: 0, duration: 0.4, ease: "power2.in" }, ">+0.1");
    //   holo.add(life, timeAt(frac) * DUR);
    // }

    // Kotak hologram: muncul berdekatan dengan garis scan, mengikuti geraknya ke bawah.
    const scanEase = gsap.parseEase(SCAN_EASE);
    const SIZES = [8, 12, 16, 22, 30];
    const count = frame.offsetWidth > 420 ? 20 : 12;
    const BAND = 6; // sebaran vertikal di sekitar garis (% tinggi foto). Kecil = lebih rapat ke garis.

    for (let i = 0; i < count; i++) {
      const t = (i + Math.random() * 0.8) / count; // waktu lahir (0..1), tersebar merata
      const top = gsap.utils.clamp(0, 100, scanEase(t) * 100 + gsap.utils.random(-BAND, BAND));
      const size = gsap.utils.random(SIZES);
      const filled = Math.random() < 0.45;
      const box = document.createElement("span");
      box.style.cssText =
        `position:absolute;left:${gsap.utils.random(4, 96).toFixed(1)}%;top:${top.toFixed(1)}%;` +
        `width:${size}px;height:${size}px;` +
        (filled
          ? "background:color-mix(in srgb, var(--accent) 35%, transparent);"
          : "border:1px solid var(--accent);");
      cubes.appendChild(box);
      gsap.set(box, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });

      const peak = gsap.utils.random(0.8, 1.4);
      const life = gsap
        .timeline()
        .to(box, { scale: peak, opacity: 1, duration: 0.16, ease: "back.out(2.4)" })
        .to(box, { scale: peak * gsap.utils.random(0.5, 0.75), duration: 0.16, ease: "sine.inOut", yoyo: true, repeat: 1 })
        .to(box, { scale: 0, opacity: 0, duration: 0.25, ease: "power2.in" });
      holo.add(life, t * DUR);
    }

    // Satu tombol untuk mempercepat atau memperlambat seluruh animasi hologram.
    holo.timeScale(SPEED);

    (q("[data-drift]") as HTMLElement[]).forEach((el) => {
      const d = Number(el.dataset.drift);
      gsap.to(el, {
        yPercent: d * 25, rotate: d * 40, ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    return () => {
      split.revert();
      cubes.replaceChildren(); // bersihkan kotak buatan JS
    };
  });

  return { revert: () => mm.revert() };
}