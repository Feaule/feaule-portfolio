"use client";
import { useRef, useState } from "react";
import { useGSAP } from "@/lib/gsap";
import { profile } from "@/data/profile";
import { animateHeroB, toggleLayer, pulseLayer } from "@/animations/style-b/hero";

// AE-style label colours for the layer rows; each shape uses the same colour.
const LABELS = ["var(--accent)", "var(--accent-2)", "var(--fg)", "var(--muted)"];

const MARQUEE = "Code in Motion  ✦  ";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState<boolean[]>(() => profile.focus.map(() => true));

  useGSAP(
    () => {
      const anim = animateHeroB(root.current!);
      return () => anim.revert();
    },
    { scope: root },
  );

  const toggle = (i: number) => {
    const next = visible.map((v, j) => (j === i ? !v : v));
    setVisible(next);
    toggleLayer(root.current!, i, next[i]);
  };

  return (
    <section
      id="top"
      ref={root}
      className="relative min-h-svh overflow-hidden"
    >
      {/* ── Stage: shape layers on a camera ─────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [perspective:1200px]">
        <div data-camera className="absolute inset-0 [transform-style:preserve-3d]">
          {/* Outlined marquee: big type as texture */}
          <div data-layer data-depth="0.4" className="absolute inset-x-0 top-[16%]">
            <div
              data-shape
              data-marquee
              className="flex w-max whitespace-pre font-lab text-[24vmin] font-extrabold leading-none text-transparent"
              style={{ WebkitTextStroke: "1px var(--line)" }}
            >
              <span>{MARQUEE.repeat(3)}</span>
              <span>{MARQUEE.repeat(3)}</span>
            </div>
          </div>

          {/* Frontend — ring with a dot in orbit */}
          <div data-layer data-focus="0" data-depth="0.6" className="absolute -right-[14vmin] top-[6%] size-[62vmin]">
            <div data-shape data-spin-slow className="relative size-full rounded-full border border-accent">
              <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
            </div>
          </div>

          {/* Business Information Systems — rotating rounded square */}
          <div data-layer data-focus="1" data-depth="1" className="absolute -left-[5vmin] top-[36%] size-[26vmin]">
            <div data-shape data-spin className="size-full rounded-[18%] border border-accent2" />
          </div>

          {/* Digital product thinking — solid circle, floats */}
          <div data-layer data-focus="2" data-depth="1.4" className="absolute bottom-[26%] right-[16%] size-[17vmin]">
            <div data-shape data-float className="size-full rounded-full bg-fg" />
          </div>

          {/* Motion graphics — motion path with a keyframe dot travelling along it */}
          <div data-layer data-focus="3" data-depth="0.8" className="absolute left-[26%] top-[8%] w-[56vmin]">
            <svg data-shape viewBox="0 0 300 200" className="block w-full overflow-visible">
              <path
                data-path d="M10 160 C 80 10, 150 10, 150 100 S 240 190, 290 40"
                fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="4 6"
              />
              {[[10, 160], [150, 100], [290, 40]].map(([x, y]) => (
                <rect key={x} x={x - 4} y={y - 4} width="8" height="8" fill="var(--bg)" stroke="var(--muted)" transform={`rotate(45 ${x} ${y})`} />
              ))}
              <circle data-path-dot r="7" fill="var(--accent)" />
            </svg>
          </div>

          {/* Anchor-point crosses */}
          {[["left-[44%] top-[58%]", "0.5"], ["right-[8%] bottom-[8%]", "1.2"]].map(([pos, d]) => (
            <div key={pos} data-layer data-depth={d} className={`absolute ${pos}`}>
              <svg data-shape width="22" height="22" viewBox="0 0 22 22" className="text-muted">
                <path d="M11 0v22M0 11h22" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* ── Foreground ─────────────────────────────────────── */}
      <div className="relative z-10 mx-auto flex min-h-svh max-w-7xl flex-col px-5 pb-6 pt-20 md:px-10 md:pb-10">
        <div className="flex flex-1 flex-col justify-center py-10">
          <h1
            data-split
            className="whitespace-nowrap font-lab text-[clamp(3rem,15.5vw,14rem)] font-extrabold leading-[0.9] tracking-tight"
          >
            {profile.name}
          </h1>
          <p data-fade className="mt-5 font-lab text-xl font-bold text-accent">
            {profile.tagline}
          </p>
          <p data-fade className="mt-2 max-w-lg text-lg leading-snug text-soft">
            {profile.hero.line}
          </p>
          <a
            data-fade
            href="#projects"
            className="mt-6 inline-block w-fit rounded-full bg-accent px-6 py-3 text-sm font-semibold text-bg transition-transform hover:scale-105"
          >
            See projects
          </a>
        </div>

        {/* Layer panel: the eye toggles each shape on the stage */}
        <div
          data-fade
          className="w-full rounded-lg border border-line bg-surface/85 p-2 backdrop-blur md:ml-auto md:w-80"
        >
          <p className="px-2 pb-1 pt-0.5 text-xs text-soft">Areas I&apos;m exploring</p>
          <ul>
            {profile.focus.map((name, i) => (
              <li key={name} className="flex items-center gap-1 rounded-md" onPointerEnter={() => pulseLayer(root.current!, i)}>
                <button
                  type="button"
                  aria-pressed={visible[i]}
                  aria-label={`${name} layer`}
                  onClick={() => toggle(i)}
                  onFocus={() => pulseLayer(root.current!, i)}
                  className="grid size-9 shrink-0 place-items-center rounded-md text-soft transition-colors hover:text-accent"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <path d="M1 9s3-5.5 8-5.5S17 9 17 9s-3 5.5-8 5.5S1 9 1 9Z" fill="none" stroke="currentColor" strokeWidth="1.5" opacity={visible[i] ? 1 : 0.35} />
                    {visible[i] ? <circle cx="9" cy="9" r="2.5" fill="currentColor" /> : <path d="M2 16 16 2" stroke="currentColor" strokeWidth="1.5" />}
                  </svg>
                </button>
                <span aria-hidden="true" className="size-3 shrink-0 rounded-[3px]" style={{ background: LABELS[i] }} />
                <span aria-hidden="true" className="w-4 text-right text-xs tabular-nums text-muted">{i + 1}</span>
                <span className={`truncate pl-1 text-sm ${visible[i] ? "text-fg" : "text-muted line-through"}`}>{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}