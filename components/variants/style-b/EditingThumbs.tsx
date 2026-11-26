"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { EditingThumb } from "@/data/profile";

const INTERVAL = 3200; // jeda antar pergantian untuk gambar statis (ms)
const FIRST_DELAY = 1200; // jeda pergantian pertama setelah kartu aktif (ms)
const ONLY_WHEN_ACTIVE = true; // true = hanya berganti saat kartu ada di tengah carousel

type NetworkConnection = EventTarget & { saveData?: boolean };

function getConnection() {
  return typeof navigator === "undefined"
    ? undefined
    : (navigator as Navigator & { connection?: NetworkConnection }).connection;
}

function subscribeToConnection(listener: () => void) {
  const connection = getConnection();
  connection?.addEventListener("change", listener);
  return () => connection?.removeEventListener("change", listener);
}

function getCanVideo() {
  return !getConnection()?.saveData;
}

export default function EditingThumbs({ thumbs }: { thumbs: EditingThumb[] }) {
  const box = useRef<HTMLDivElement>(null);
  const cur = useRef(0);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  const flags = useRef({ inView: false, active: !ONLY_WHEN_ACTIVE, tab: true });
  const n = thumbs.length;
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [armed, setArmed] = useState(false); // gambar ke-2+ dan video baru dimuat setelah kartu terlihat
  const canVideo = useSyncExternalStore(subscribeToConnection, getCanVideo, () => false);
  const [run, setRun] = useState(false);

  // Pengamat: terlihat di layar, tab aktif, dan kartu sedang di tengah carousel.
  useEffect(() => {
    const el = box.current;
    if (!el || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const f = flags.current;
    const update = () => setRun(f.inView && f.active && f.tab);

    const io = new IntersectionObserver(
      ([e]) => {
        f.inView = e.isIntersecting;
        if (e.isIntersecting) setArmed(true);
        update();
      },
      { threshold: 0.3 },
    );
    io.observe(el);

    const onVis = () => { f.tab = !document.hidden; update(); };
    document.addEventListener("visibilitychange", onVis);

    let mo: MutationObserver | undefined;
    const card = el.closest<HTMLElement>("[data-card]");
    if (ONLY_WHEN_ACTIVE && card) {
      const read = () => { f.active = card.dataset.active === "true"; update(); };
      mo = new MutationObserver(read);
      mo.observe(card, { attributes: true, attributeFilter: ["data-active"] });
      read();
    }

    return () => {
      io.disconnect();
      mo?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [n]);

  // Timer pergantian: tiap gambar/klip bisa punya lama tampil sendiri (hold).
  useEffect(() => {
    if (!run || n < 2) return;
    let t = 0;
    const tick = () => {
      setPrev(cur.current);
      cur.current = (cur.current + 1) % n;
      setIndex(cur.current);
      t = window.setTimeout(tick, thumbs[cur.current].hold ?? INTERVAL);
    };
    t = window.setTimeout(tick, thumbs[cur.current].hold ?? FIRST_DELAY);
    return () => clearTimeout(t);
  }, [run, n, thumbs]);

  // Putar klip hanya untuk slide yang tampil; sisanya di-pause.
  useEffect(() => {
    vids.current.forEach((v, i) => {
      if (!v) return;
      if (run && i === index) {
        v.currentTime = 0;
        v.play().catch(() => {}); // autoplay ditolak: gambar tetap tampil
      } else if (!(run && i === prev)) {
        v.pause(); // slide yang sedang memudar keluar dibiarkan jalan dulu
      }
    });
  }, [index, prev, run, armed, canVideo]);

  // Belum ada gambar: tampilkan ring dekoratif seperti sebelumnya.
  if (n === 0) {
    return (
      <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
        <div className="relative grid aspect-square h-[78%] place-items-center rounded-full border border-accent">
          <svg width="44" height="44" viewBox="0 0 44 44"><path d="M15 9v26l22-13z" fill="var(--accent)" /></svg>
        </div>
      </div>
    );
  }

  return (
    <div ref={box} aria-hidden="true" className="absolute inset-0">
      {thumbs.map((t, i) =>
        i === 0 || armed ? (
          <div
            key={t.src}
            data-state={i === index ? "in" : i === prev ? "out" : "idle"}
            className="thumb-slide absolute inset-0"
          >
            <Image
              src={t.src}
              alt=""
              fill
              sizes="(min-width: 768px) 42rem, 82vw"
              loading={i === 0 ? "lazy" : "eager"}
              draggable={false}
              className="object-cover"
            />
            {t.video && canVideo && armed && (
              <video
                ref={(el) => { vids.current[i] = el; }}
                muted
                loop
                playsInline
                preload="metadata"
                disablePictureInPicture
                tabIndex={-1}
                className="absolute inset-0 size-full object-cover"
              >
                {t.video.webm && <source src={t.video.webm} type="video/webm" />}
                {t.video.mp4 && <source src={t.video.mp4} type="video/mp4" />}
              </video>
            )}
          </div>
        ) : null,
      )}
      {n > 1 && (
        <div className="absolute bottom-3 right-4 z-10 flex gap-1.5">
          {thumbs.map((t, i) => (
            <span
              key={t.src}
              className={`size-1.5 rotate-45 border border-accent transition-colors duration-500 ${i === index ? "bg-accent" : ""}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
