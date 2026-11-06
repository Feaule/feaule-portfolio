"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@/lib/gsap";
import type { Project } from "@/data/projects";
import { createGallery, type GalleryControls, type GalleryState } from "@/animations/style-b/gallery";
import ProjectArt from "./ProjectArt";

const pad = (n: number) => String(n).padStart(2, "0");
const btn =
  "grid size-10 shrink-0 place-items-center rounded-full border border-line text-fg transition-colors hover:border-accent hover:text-accent";

export default function ProjectGallery({ project }: { project: Project }) {
  const root = useRef<HTMLDivElement>(null);
  const ctl = useRef<GalleryControls | null>(null);
  const [s, setS] = useState<GalleryState>({ index: 0, playing: true });
  const n = project.gallery.length;

  useGSAP(
    () => {
      const g = createGallery(root.current!, { count: n, onState: setS });
      ctl.current = g;
      return () => { g.destroy(); ctl.current = null; };
    },
    { scope: root, dependencies: [n] },
  );

  return (
    <div ref={root} role="group" aria-roledescription="carousel" aria-label={`${project.title} images`}>
      <div className="relative aspect-[16/10] max-h-[46svh] w-full overflow-hidden rounded-md border border-line bg-bg" aria-live={s.playing ? "off" : "polite"}>
        {project.gallery.map((g, i) => (
          <div
            key={i}
            data-slide
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}`}
            aria-hidden={i !== 0}
            className={`absolute inset-0 ${i === 0 ? "" : "invisible"}`}
          >
            <div data-slide-media className="absolute inset-0">
              {g.src ? (
                <Image src={g.src} alt={g.alt} fill sizes="(min-width: 768px) 56rem, 92vw" className="object-cover" />
              ) : (
                <>
                  <ProjectArt kind={g.art} />
                  <p className="absolute bottom-3 left-4 text-xs text-soft">Image {i + 1} to be added</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {n > 1 && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
          {/* Timeline: the line fills across all images; diamonds jump to each one */}
          <div className="relative mx-3 h-8 w-[calc(100%-1.5rem)] md:w-auto md:flex-1">
            <div className="absolute inset-x-0 top-1/2 h-px bg-line" />
            <div data-fill className="absolute inset-x-0 top-1/2 h-px origin-left scale-x-0 bg-accent" />
            {project.gallery.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show image ${i + 1}`}
                aria-current={s.index === i}
                onClick={() => ctl.current?.goTo(i)}
                style={{ left: `${(i / n) * 100}%` }}
                className="absolute top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center"
              >
                <span className={`size-2.5 rotate-45 border border-accent transition-colors ${s.index >= i ? "bg-accent" : "bg-surface"}`} />
              </button>
            ))}
          </div>

          <p aria-hidden="true" className="mr-auto font-mono text-sm tabular-nums text-soft md:mr-0">{pad(s.index + 1)} / {pad(n)}</p>
          <button type="button" aria-label="Previous image" onClick={() => ctl.current?.prev()} className={btn}>
            <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true"><path d="M11 3 5 9l6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" aria-label="Next image" onClick={() => ctl.current?.next()} className={btn}>
            <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true"><path d="m7 3 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" aria-label={s.playing ? "Pause image rotation" : "Play image rotation"} onClick={() => ctl.current?.toggle()} className={btn}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              {s.playing ? <path d="M3 1.5v11M10 1.5v11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="M3 1.5v11l9-5.5z" fill="currentColor" />}
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
