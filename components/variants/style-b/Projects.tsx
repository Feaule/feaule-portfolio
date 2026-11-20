"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@/lib/gsap";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { animateProjectsB, type CarouselApi, type CarouselNav } from "@/animations/style-b/projects";
import ProjectArt from "./ProjectArt";
import ProjectDialog from "./ProjectDialog";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const api = useRef<CarouselApi | null>(null);
  const total = projects.length + 1; // projects + the editing-portfolio link card
  const [open, setOpen] = useState<{ slug: string; rect: DOMRect | null } | null>(null);
  const [nav, setNav] = useState<CarouselNav>({ index: 0, atStart: true, atEnd: false });

  useGSAP(
    () => {
      api.current = animateProjectsB(root.current!, (n) =>
        setNav((prev) => (prev.index === n.index && prev.atStart === n.atStart && prev.atEnd === n.atEnd ? prev : n)),
      );
      return () => {
        api.current?.revert();
        api.current = null;
      };
    },
    { scope: root },
  );

  const arrow = "grid size-11 place-items-center rounded-full border border-line text-fg transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-35";
  const cardCls = "proj-card group relative col-start-1 row-start-1 w-[82vw] justify-self-center sm:w-[28rem] md:w-[42rem]";

  return (
    <section id="projects" ref={root} className="relative overflow-x-clip py-[var(--section-y)]">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 data-split className="whitespace-nowrap font-lab text-[clamp(2.75rem,11vw,10rem)] font-extrabold leading-[0.9] tracking-tight">
            Projects
          </h2>

          <div data-controls className="ml-auto flex items-center gap-3">
            <p aria-hidden="true" className="mr-2 font-mono text-sm tabular-nums text-soft">
              {pad(nav.index + 1)} / {pad(total)}
            </p>
            <button type="button" aria-label="Previous project" disabled={nav.atStart} onClick={() => api.current?.step(-1)} className={arrow}>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M11 3 5 9l6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button type="button" aria-label="Next project" disabled={nav.atEnd} onClick={() => api.current?.step(1)} className={arrow}>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="m7 3 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">Project {nav.index + 1} of {total}</p>

      {/* Coverflow stage: all cards share one grid cell; the engine positions them. */}
      <div
        data-stage
        data-fade
        data-cursor
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects"
        tabIndex={0}
        className="proj-stage mt-12 grid py-8 md:mt-14"
      >
        {projects.map((p, i) => (
          <article key={p.slug} data-card aria-roledescription="slide" aria-label={`${i + 1} of ${total}`} className={cardCls}>
            <div data-card-inner className="proj-inner relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface">
              <span data-dim aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-bg opacity-0" />
              <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-bg">
                <div data-media className="absolute inset-0 scale-110">
                  {p.gallery[0].src ? (
                    <Image src={p.gallery[0].src} alt={p.gallery[0].alt} fill sizes="(min-width: 768px) 42rem, 82vw" loading={i === 0 ? "eager" : "lazy"} draggable={false} className="object-cover" />
                  ) : (
                    <>
                      <ProjectArt kind={p.gallery[0].art} drift />
                      <p className="absolute bottom-3 left-4 text-xs text-soft">Preview to be added</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <p className="font-mono text-xs text-soft">{p.context}</p>
                <h3 className="mt-2 font-lab text-2xl font-bold leading-tight">
                  {/* Stretched button: the whole card opens the details (only once centred) */}
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    onClick={(e) =>
                      setOpen({
                        slug: p.slug,
                        rect: e.currentTarget.closest("[data-card-inner]")?.getBoundingClientRect() ?? null,
                      })
                    }
                    className="text-left outline-none after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
                  >
                    {p.title}
                  </button>
                </h3>
                <p className="mt-2 text-soft">{p.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-soft">{t}</li>
                  ))}
                </ul>
                <p aria-hidden="true" className="mt-auto pt-5 text-sm text-accent">
                  View details <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </p>
              </div>
            </div>
          </article>
        ))}

        {/* Last card: external portfolio for editing work */}
        <article data-card aria-roledescription="slide" aria-label={`${total} of ${total}`} className={cardCls}>
          <div
            data-card-inner
            className={`proj-inner relative flex h-full flex-col overflow-hidden rounded-lg border bg-surface ${
              profile.editing.href ? "border-accent" : "border-dashed border-muted"
            }`}
          >
            <span data-dim aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-bg opacity-0" />
            <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-bg">
              <div data-media aria-hidden="true" className="absolute inset-0 grid place-items-center">
                <div className="relative grid aspect-square h-[78%] place-items-center rounded-full border border-accent">
                  <svg width="44" height="44" viewBox="0 0 44 44"><path d="M15 9v26l22-13z" fill="var(--accent)" /></svg>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5 md:p-6">
              <p className="font-mono text-xs text-soft">External portfolio</p>
              <h3 className="mt-2 font-lab text-2xl font-bold leading-tight">
                {profile.editing.href ? (
                  <a
                    href={profile.editing.href}
                    target="_blank"
                    rel="noreferrer"
                    draggable={false}
                    className="outline-none after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
                  >
                    {profile.editing.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  profile.editing.label
                )}
              </h3>
              <p className="mt-2 text-soft">{profile.editing.summary}</p>
              <p className="mt-auto pt-5 text-sm text-accent">
                {profile.editing.href ? <span aria-hidden="true">Open portfolio ↗</span> : <span className="text-soft">Link to be added</span>}
              </p>
            </div>
          </div>
        </article>
      </div>

      <ProjectDialog
        project={projects.find((p) => p.slug === open?.slug) ?? null}
        origin={open?.rect ?? null}
        onClose={() => setOpen(null)}
      />
    </section>
  );
}