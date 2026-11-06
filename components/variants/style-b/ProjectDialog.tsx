"use client";
import { useEffect, useRef } from "react";
import { gsap, MQ } from "@/lib/gsap";
import type { Project } from "@/data/projects";
import ProjectGallery from "./ProjectGallery";

const reduced = () => window.matchMedia(MQ.reduced).matches;

// Lock page scroll while open, compensating for the scrollbar so nothing shifts.
function lockScroll() {
  const sw = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.overflow = "hidden";
  document.body.style.paddingRight = sw > 0 ? `${sw}px` : "";
}
function unlockScroll() {
  document.documentElement.style.overflow = "";
  document.body.style.paddingRight = "";
}

/** Native <dialog>: focus trap, Esc, and inert background come for free. */
export default function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = dlg.current!;
    if (project && !d.open) {
      lockScroll();
      d.showModal();
      if (!reduced() && panel.current) {
        gsap.fromTo(panel.current, { y: 36, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" });
      }
    }
  }, [project]);

  useEffect(() => unlockScroll, []);

  const finish = () => {
    dlg.current?.close();
    unlockScroll();
    onClose();
  };
  const close = () => {
    if (reduced() || !panel.current) return finish();
    gsap.to(panel.current, { y: 24, opacity: 0, duration: 0.25, ease: "power2.in", onComplete: finish });
  };

  return (
    <dialog
      ref={dlg}
      aria-labelledby="project-dialog-title"
      onCancel={(e) => { e.preventDefault(); close(); }}
      onClick={(e) => { if (e.target === dlg.current) close(); }}
      className="m-auto max-h-[92svh] w-[min(100%-1.5rem,62rem)] overflow-hidden rounded-lg border border-line bg-surface p-0 text-fg backdrop:bg-bg/80 backdrop:backdrop-blur-sm"
    >
      {project && (
        <div ref={panel} className="flex max-h-[92svh] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 md:px-8">
            <div>
              <p className="font-mono text-xs text-soft">{project.context}</p>
              <h2 id="project-dialog-title" className="mt-1 font-lab text-2xl font-bold leading-tight md:text-3xl">
                {project.title}
              </h2>
            </div>
            <button
              type="button"
              aria-label="Close project details"
              onClick={close}
              className="grid size-10 shrink-0 place-items-center rounded-full border border-line transition-colors hover:border-accent hover:text-accent"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="m2 2 10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </button>
          </div>

          <div className="overflow-y-auto px-5 py-6 md:px-8 md:py-8">
            <ProjectGallery key={project.slug} project={project} />

            <div className="mt-8 grid gap-8 md:grid-cols-[7fr_5fr] md:gap-12">
              <div>
                {project.detail.overview.map((p) => (
                  <p key={p} className="mb-4 text-lg leading-relaxed text-soft last:mb-0">{p}</p>
                ))}
                <ul className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-soft">{t}</li>
                  ))}
                </ul>
              </div>

              <div>
                <dl>
                  {project.detail.facts.map((f) => (
                    <div key={f.label} className="border-t border-line py-3">
                      <dt className="text-xs text-soft">{f.label}</dt>
                      <dd className="mt-1">{f.value}</dd>
                    </div>
                  ))}
                </dl>
                {project.detail.links.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                    {project.detail.links.map((l) => (
                      <li key={l.href}>
                        <a href={l.href} target="_blank" rel="noreferrer" className="border-b border-accent pb-0.5 text-sm transition-colors hover:text-accent">
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
