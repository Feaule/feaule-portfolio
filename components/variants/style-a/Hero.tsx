"use client";
import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { profile } from "@/data/profile";
import { animateHeroA } from "@/animations/style-a/hero";

// One easing curve (like AE's graph editor). Keyframe diamonds sit on it:
// x/y are the cubic Bézier evaluated at t = 0, .25, .5, .75, 1 (viewBox 1000×100).
const CURVE = "M0 90 C 400 90, 600 10, 1000 10";
const KEYS = [
  { x: 0, y: 90 },
  { x: 26.9, y: 77.5 },
  { x: 50, y: 50 },
  { x: 73.1, y: 22.5 },
  { x: 100, y: 10 },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const anim = animateHeroA(root.current!);
      return () => anim.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      className="relative min-h-svh overflow-hidden"
    >
      {/* Geometry: a thin ring with one dot in orbit */}
      <div
        data-ring-wrap
        aria-hidden="true"
        className="pointer-events-none absolute -right-[22vw] top-[10vh] w-[78vw] max-w-[860px]"
      >
        <svg viewBox="0 0 400 400" className="block w-full overflow-visible">
          <circle cx="200" cy="200" r="198" fill="none" stroke="var(--line)" strokeWidth="1" />
          <circle
            data-draw
            cx="200" cy="200" r="198" fill="none" stroke="var(--accent)" strokeWidth="1"
            pathLength={1} strokeDasharray="1" strokeLinecap="round"
            transform="rotate(-90 200 200)"
          />
          <g data-orbit>
            <circle cx="200" cy="2" r="5" fill="var(--accent)" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex min-h-svh max-w-7xl flex-col justify-between gap-10 px-5 pb-8 pt-24 md:px-10">
        <div className="max-w-md" data-fade>
          <p className="text-soft">
            <span className="text-fg">{profile.name}</span>, {profile.role.toLowerCase()}
          </p>
        </div>

        <h1 className="font-serif text-[length:min(30vw,27vh,22rem)] leading-[0.92] tracking-[-0.02em]">
          <span data-split="1" className="block">Code in</span>
          <span data-split="2" className="block pl-[0.6em]">Motion</span>
        </h1>

        <div className="grid gap-8 md:grid-cols-[minmax(0,26rem)_1fr] md:items-end md:gap-16">
          <div data-fade>
            <p className="text-lg leading-snug text-fg">{profile.hero.line}</p>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-soft">
              {profile.focus.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <a
              href="#projects"
              className="mt-6 inline-block border-b border-accent pb-0.5 text-sm transition-colors hover:text-accent"
            >
              See selected work
            </a>
          </div>

          {/* Timeline: purely decorative, but you can scrub it with the pointer. */}
          <div data-fade aria-hidden="true">
            <p data-timecode className="mb-2 text-right font-mono text-sm tabular-nums text-soft">
              00:00:03:00
            </p>
            <div data-timeline data-cursor className="relative h-24 touch-pan-y select-none md:h-28">
              <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
                {Array.from({ length: 51 }).map((_, i) => (
                  <line
                    key={i} x1={i * 20} x2={i * 20} y1={100} y2={i % 5 === 0 ? 88 : 94}
                    stroke="var(--muted)" strokeWidth="1" vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>
              <svg
                data-curve viewBox="0 0 1000 100" preserveAspectRatio="none"
                className="absolute inset-0 size-full overflow-visible"
              >
                <path d={CURVE} fill="none" stroke="var(--accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </svg>
              {KEYS.map((k) => (
                <span
                  key={k.x}
                  data-key
                  data-at={k.x / 100}
                  data-on="true"
                  style={{ left: `${k.x}%`, top: `${k.y}%` }}
                  className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-accent bg-bg transition-colors data-[on=true]:bg-accent"
                />
              ))}
              <div data-playhead className="absolute inset-y-0 left-0 w-0">
                <span className="absolute inset-y-0 w-px -translate-x-1/2 bg-fg" />
                <span className="absolute -top-1 size-2 -translate-x-1/2 rotate-45 bg-fg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}