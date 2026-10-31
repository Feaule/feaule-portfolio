"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@/lib/gsap";
import { projects, type Project } from "@/data/projects";
import { animateProjectsB, stepCarousel, type CarouselNav } from "@/animations/style-b/projects";

const pad = (n: number) => String(n).padStart(2, "0");

/** Abstract stand-in for a missing screenshot, using the hero's shape language. */
function PlaceholderArt({ kind }: { kind: Project["art"] }) {
  return (
    <div data-art aria-hidden="true" className="absolute inset-0 grid place-items-center">
      {kind === "ring" && (
        <div className="relative aspect-square h-[78%] rounded-full border border-accent">
          <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
        </div>
      )}
      {kind === "square" && <div className="aspect-square h-[52%] rotate-12 rounded-[18%] border border-accent2" />}
      {kind === "path" && (
        <svg viewBox="0 0 300 200" className="w-[70%] overflow-visible">
          <path d="M10 160 C 80 10, 150 10, 150 100 S 240 190, 290 40" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="4 6" />
          <circle cx="150" cy="100" r="7" fill="var(--accent)" />
        </svg>
      )}
    </div>
  );
}

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const [nav, setNav] = useState<CarouselNav>({ index: 0, atStart: true, atEnd: false });

  useGSAP(
    () => {
      const anim = animateProjectsB(root.current!, (n) =>
        setNav((prev) => (prev.index === n.index && prev.atStart === n.atStart && prev.atEnd === n.atEnd ? prev : n)),
      );
      return () => anim.revert();
    },
    { scope: root },
  );

  const arrow = "grid size-11 place-items-center rounded-full border border-line text-fg transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-35";

  return (
    <section id="projects" ref={root} className="relative overflow-x-clip py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 data-split className="whitespace-nowrap font-lab text-[clamp(2.75rem,11vw,10rem)] font-extrabold leading-[0.9] tracking-tight">
            Projects
          </h2>

          <div data-controls className="ml-auto flex items-center gap-3">
            <p aria-hidden="true" className="mr-2 font-mono text-sm tabular-nums text-soft">
              {pad(nav.index + 1)} / {pad(projects.length)}
            </p>
            <button type="button" aria-label="Previous project" disabled={nav.atStart} onClick={() => stepCarousel(root.current!, -1)} className={arrow}>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M11 3 5 9l6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button type="button" aria-label="Next project" disabled={nav.atEnd} onClick={() => stepCarousel(root.current!, 1)} className={arrow}>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="m7 3 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Track bleeds to the screen edge but starts aligned with the content column */}
      <div
        data-track
        data-cursor
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects"
        tabIndex={0}
        className="mt-12 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [--gutter:max(1.25rem,calc((100vw_-_80rem)/2_+_1.25rem))] [scrollbar-width:none] md:mt-16 md:[--gutter:max(2.5rem,calc((100vw_-_80rem)/2_+_2.5rem))] pl-[var(--gutter)] pr-[var(--gutter)] scroll-pl-[var(--gutter)] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((p, i) => (
          <article
            key={p.slug}
            data-card
            data-fade
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${projects.length}`}
            className="w-[82vw] shrink-0 snap-start sm:w-[28rem] md:w-[42rem]"
          >
            <div data-card-inner className="overflow-hidden rounded-lg border border-line bg-surface">
              <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-bg">
                {p.image ? (
                  <Image src={p.image} alt={`${p.title} preview`} fill sizes="(min-width: 768px) 42rem, 82vw" className="object-cover" />
                ) : (
                  <>
                    <PlaceholderArt kind={p.art} />
                    <p className="absolute bottom-3 left-4 text-xs text-soft">Preview to be added</p>
                  </>
                )}
              </div>
              <div className="p-5 md:p-6">
                <p className="font-mono text-xs text-soft">{p.context}</p>
                <h3 className="mt-2 font-lab text-2xl font-bold leading-tight">{p.title}</h3>
                <p className="mt-2 text-soft">{p.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-soft">{t}</li>
                  ))}
                </ul>
                {p.href && (
                  <a href={p.href} target="_blank" rel="noreferrer" className="mt-5 inline-block border-b border-accent pb-0.5 text-sm transition-colors hover:text-accent">
                    View project
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
