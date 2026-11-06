import type { ProjectArt as Kind } from "@/data/projects";

/**
 * Abstract stand-in for a missing image, using the hero's shape language.
 * `drift` marks it for the carousel's parallax effect (cards only).
 */
export default function ProjectArt({ kind, drift = false }: { kind: Kind; drift?: boolean }) {
  return (
    <div data-art={drift ? "" : undefined} aria-hidden="true" className="absolute inset-0 grid place-items-center">
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
