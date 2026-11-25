import { gsap, ScrollTrigger } from "@/lib/gsap";

// Pinned horizontal scrub only on tablet/desktop with motion allowed.
// Mobile and reduced motion use native horizontal scrolling (CSS scroll-snap).
const PINNED = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

// Kapan kartu 01 mulai tumbuh (bagian atas section mencapai titik ini di layar).
const INTRO_START = "top 30%";
// Layar vertikal yang dihabiskan per perpindahan tahap. Naik = lebih pelan.
const SCREENS_PER_STEP = 0.6;
// Transisi masuk/keluar section (hanya opacity + scale, posisi tidak digeser).
const ENTER_OPACITY = 0.2; // opacity awal konten saat section baru muncul
const LEAVE_OPACITY = 0.25; // opacity akhir saat section meninggalkan layar
const LEAVE_SCREENS = 0.7; // jarak scroll (dalam layar) untuk memudar keluar

export function animateJourney(root: HTMLElement) {
  const viewport = root.querySelector<HTMLElement>("[data-viewport]")!;
  const track = root.querySelector<HTMLElement>("[data-track]")!;
  const fill = root.querySelector<HTMLElement>("[data-fill]")!;
  const playhead = root.querySelector<HTMLElement>("[data-playhead]")!;
  const content = root.querySelector<HTMLElement>("[data-content]");
  const items = Array.from(root.querySelectorAll<HTMLElement>("[data-stage]"));
  const markers = items.map((li) => li.querySelector<HTMLElement>("[data-marker]")!);

  const mm = gsap.matchMedia();
  let alive = true;

  mm.add(PINNED, () => {
    viewport.style.overflowX = "hidden";
    viewport.scrollLeft = 0;
    viewport.removeAttribute("tabindex");

    const enterEase = gsap.parseEase("power2.out");
    const leaveEase = gsap.parseEase("power2.in");
    const vh = () => window.innerHeight;

    let centers: number[] = [];
    let trackWidth = 1;
    let introduced = false; // false = semua tahap tersembunyi (sebelum intro)
    let lastP = 0;

    const distance = () => Math.max(1, track.scrollWidth - viewport.clientWidth);
    const scrollLength = () => Math.round(vh() * SCREENS_PER_STEP * (items.length - 1));

    const measure = () => {
      trackWidth = track.scrollWidth;
      centers = markers.map((m, i) => items[i].offsetLeft + m.offsetLeft + m.offsetWidth / 2);
    };

    const sync = (p: number) => {
      lastP = p;
      if (centers.length < 2) return;
      const pos = p * (items.length - 1);
      const i = Math.min(Math.floor(pos), items.length - 2);
      const x = centers[i] + (centers[i + 1] - centers[i]) * (pos - i);
      gsap.set(playhead, { x });
      gsap.set(fill, { scaleX: x / trackWidth });
      const active = introduced ? Math.round(pos) : -1;
      items.forEach((li, idx) => {
        li.dataset.state = idx < active ? "past" : idx === active ? "active" : "future";
      });
    };

    gsap.set(playhead, { opacity: 0 });
    measure();
    sync(0);

    // ── Pin + geser horizontal (progres di-ease, dengan jeda di awal dan akhir).
    const proxy = { p: 0 };
    const apply = () => {
      const e = gsap.utils.clamp(0, 1, proxy.p);
      gsap.set(track, { x: -distance() * e });
      sync(e);
    };

    const tween = gsap.to(proxy, {
      p: 1,
      ease: "none",
      onUpdate: apply,
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: () => "+=" + scrollLength(),
        pin: true,
        // Prepare the pin slightly before its start boundary when the page
        // scrolls quickly, preventing a visible catch-up/jump at entry.
        anticipatePin: 1,
        // Follow the scroll position directly; numeric scrub causes a visible
        // catch-up after sharp wheel or trackpad gestures.
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: () => {
          measure();
          apply();
        },
      },
    });
    const st = tween.scrollTrigger!;

    // ── Intro kartu 01: tumbuh saat section hampir ter-pin.
    const setIntro = (v: boolean) => {
      if (v === introduced) return;
      introduced = v;
      gsap.to(playhead, { opacity: v ? 1 : 0, duration: 0.5, overwrite: true });
      sync(lastP);
    };
    ScrollTrigger.create({
      trigger: root,
      start: INTRO_START,
      end: "max",
      onEnter: () => setIntro(true),
      onLeaveBack: () => setIntro(false),
      onRefresh: (self) => setIntro(self.progress > 0),
    });

    // ── Transisi masuk/keluar: hanya opacity + scale, selalu kontinu dan kembali
    //    ke nilai normal di batas pin, jadi tidak ada lompatan posisi.
    let enter = 0;
    let leave = 0;
    const paint = () => {
      if (!content) return;
      const e = enterEase(enter);
      const l = leaveEase(leave);
      gsap.set(content, {
        opacity: (ENTER_OPACITY + (1 - ENTER_OPACITY) * e) * (1 - (1 - LEAVE_OPACITY) * l),
        scale: (0.97 + 0.03 * e) * (1 - 0.03 * l),
        transformOrigin: "50% 40%",
      });
    };
    const enterST = ScrollTrigger.create({
      start: () => st.start - vh() * 0.9,
      end: () => st.start,
      onUpdate: (self) => { enter = self.progress; paint(); },
      onRefresh: (self) => { enter = self.progress; paint(); },
    });
    const leaveST = ScrollTrigger.create({
      start: () => st.end,
      end: () => st.end + vh() * LEAVE_SCREENS,
      onUpdate: (self) => { leave = self.progress; paint(); },
      onRefresh: (self) => { leave = self.progress; paint(); },
    });
    enter = enterST.progress;
    leave = leaveST.progress;
    paint();

    document.fonts?.ready.then(() => {
      if (alive) ScrollTrigger.refresh();
    });

    return () => {
      viewport.style.overflowX = "";
      viewport.setAttribute("tabindex", "0");
      items.forEach((li) => li.removeAttribute("data-state"));
      if (content) gsap.set(content, { clearProps: "opacity,transform" });
    };
  });

  return {
    revert: () => {
      alive = false;
      mm.revert();
    },
  };
}
