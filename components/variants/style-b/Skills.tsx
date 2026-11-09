"use client";
import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { profile } from "@/data/profile";
import { skills, type SkillItem } from "@/data/skills";
import { animateSkillsB } from "@/animations/style-b/skills";
import SkillIcon from "@/components/shared/SkillIcon";

// Track colours come from semantic tokens (same order as the hero's Layers panel).
const TRACK_COLORS = ["var(--accent)", "var(--accent-2)", "var(--fg)", "var(--muted)"];

/** Decorative ruler: 40 minor ticks and 4 major ticks, drawn with gradients (no DOM per tick). */
const MINOR = "repeating-linear-gradient(to right, var(--muted) 0 1px, transparent 1px 2.5%)";
const MAJOR = "repeating-linear-gradient(to right, var(--fg-soft) 0 1px, transparent 1px 25%)";

function Tile({ item, odd }: { item: SkillItem; odd: boolean }) {
  return (
    <li data-tile data-shape className="group relative flex flex-col items-center px-1">
      {/* lane line segment + keyframe diamond */}
      <span aria-hidden="true" className="absolute inset-x-0 top-[5px] h-px bg-line" />
      <span
        aria-hidden="true"
        data-key
        className="relative z-10 size-[11px] rotate-45 border border-[var(--track)] bg-surface transition-colors duration-300 group-hover:bg-accent"
      />
      {/* connector: alternate lengths give the staggered, floating rhythm on desktop */}
      <span aria-hidden="true" className={`w-px bg-line ${odd ? "h-4 md:h-8" : "h-4"}`} />

      <div className="grid size-14 place-items-center rounded-xl border border-line bg-bg text-soft transition-[translate,border-color,color] duration-300 group-hover:-translate-y-1 group-hover:border-accent group-hover:text-accent md:size-16">
        {item.icon ? (
          <SkillIcon id={item.icon} />
        ) : (
          <span aria-hidden="true" className="font-lab text-lg font-bold">{item.mono}</span>
        )}
      </div>
      <span className="mt-2 text-center text-xs leading-tight text-soft">{item.name}</span>
    </li>
  );
}

export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const anim = animateSkillsB(root.current!);
      return () => anim.revert();
    },
    { scope: root },
  );

  const total = skills.tracks.reduce((n, t) => n + t.items.length, 0);

  return (
    <section id="skills" ref={root} className="relative overflow-x-clip py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        {/* Header */}
        <p data-eyebrow data-fade className="font-mono text-xs tracking-[0.2em] text-soft">
          {profile.name.toUpperCase()} / {skills.eyebrowSuffix}
        </p>
        <h2
          data-split
          className="mt-4 font-lab text-[clamp(2.5rem,8.5vw,7.5rem)] font-extrabold leading-[0.95] tracking-tight"
        >
          {skills.heading}
        </h2>
        <p data-intro data-fade className="mt-6 max-w-md text-lg text-soft">{skills.intro}</p>

        {/* Workbench */}
        <div data-bench className="relative mt-12 overflow-hidden rounded-lg border border-line bg-surface md:mt-16">
          {/* Playhead layer (decorative, desktop only) */}
          <div
            data-lane-area
            aria-hidden="true"
            className="pointer-events-none absolute bottom-11 left-[13rem] right-0 top-0 z-20 hidden md:block"
          >
            <div data-playhead className="absolute inset-y-0 left-0 w-px bg-accent opacity-0">
              <span className="absolute -left-[4px] top-1 size-[9px] rotate-45 bg-accent" />
            </div>
          </div>

          {/* Ruler (desktop only) */}
          <div data-ruler data-fade aria-hidden="true" className="hidden border-b border-line md:grid md:grid-cols-[13rem_1fr]">
            <div className="flex items-end border-r border-line px-5 pb-2 font-mono text-xs tabular-nums text-soft">00:00:00:00</div>
            <div className="relative h-11 px-0">
              <div className="flex justify-between px-1 pt-2 font-mono text-[11px] tabular-nums text-soft">
                <span>00:00</span><span>00:01</span><span>00:02</span><span>00:03</span><span>00:04</span>
              </div>
              <div data-ticks className="absolute inset-x-0 bottom-0 h-2" style={{ backgroundImage: MINOR }} />
              <div className="absolute inset-x-0 bottom-0 h-3.5 opacity-80" style={{ backgroundImage: MAJOR }} />
            </div>
          </div>

          {/* Tracks */}
          {skills.tracks.map((t, ti) => (
            <section
              key={t.id}
              data-track
              data-fade
              aria-labelledby={`track-${t.id}`}
              style={{ "--track": TRACK_COLORS[ti] } as React.CSSProperties}
              className="grid border-b border-line md:grid-cols-[13rem_1fr]"
            >
              <div className="flex items-start gap-3 px-5 pt-6 md:border-r md:border-line md:py-8">
                <span aria-hidden="true" className="mt-1.5 size-3 shrink-0 rounded-[3px] bg-[var(--track)]" />
                <div>
                  <p className="font-mono text-xs tabular-nums text-soft">{t.index}</p>
                  <h3 id={`track-${t.id}`} className="mt-1 font-lab text-lg font-bold leading-tight">{t.title}</h3>
                  <p className="mt-1 font-mono text-xs text-soft">{t.items.length} tools</p>
                </div>
              </div>

              <ul className="grid grid-cols-3 gap-y-6 px-4 pb-6 pt-5 sm:grid-cols-5 md:px-5 md:pb-8 md:pt-8 xl:grid-cols-10">
                {t.items.map((item, i) => (
                  <Tile key={item.name} item={item} odd={i % 2 === 1} />
                ))}
              </ul>
            </section>
          ))}

          {/* Footer metadata */}
          <div
            data-bench-footer
            data-fade
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-3 font-mono text-xs text-soft md:px-6"
          >
            <span>{total} tools · {skills.tracks.length} tracks</span>
            {skills.ai && (
              <span>
                {skills.ai.label}: {skills.ai.tools.join(", ")}
              </span>
            )}
            <span aria-hidden="true" className="tabular-nums">00:00:04:00</span>
          </div>
        </div>
      </div>
    </section>
  );
}
