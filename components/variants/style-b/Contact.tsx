"use client";
import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { profile } from "@/data/profile";
import { sections } from "@/config/site";
import { animateContactB } from "@/animations/style-b/contact";
import Year from "@/components/shared/Year";
import SocialIcon, { type SocialId } from "@/components/shared/SocialIcon";

/**
 * Wipe-fill colours per destination. White text on every one of these is >= 5:1.
 * GitHub's mark is monochrome, so it follows the theme instead of a fixed colour.
 */
const BRAND: Record<SocialId, { bg: string; fg: string }> = {
  github: { bg: "var(--fg)", fg: "var(--bg)" },
  linkedin: { bg: "#0a66c2", fg: "#ffffff" },
  instagram: { bg: "#c13584", fg: "#ffffff" },
  editing: { bg: "#FECD06", fg: "#ffffff" },
};

const Arrow = ({ up = false }: { up?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
    {up ? (
      <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </svg>
);

/** The site footer: contact rows, section index, copyright, and a large wordmark. */
export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const anim = animateContactB(root.current!);
      return () => anim.revert();
    },
    { scope: root },
  );

  const { contact, editing } = profile;
  const items = [
    ...contact.links.map((l) => ({ id: l.id as SocialId, label: l.label, handle: l.handle, href: l.href })),
    { id: "editing" as SocialId, label: editing.label, handle: editing.handle, href: editing.href },
  ];
  const index = sections.filter((s) => s.id !== "contact");

  // One link row. Used for the social rows and for the Drive row at the bottom.
  const renderRow = (it: (typeof items)[number]) => (
    <li key={it.id} data-fade className="border-t border-line last:border-b">
      {it.href ? (
        <a
          href={it.href}
          target="_blank"
          rel="noreferrer"
          style={{ "--brand": BRAND[it.id].bg, "--brand-fg": BRAND[it.id].fg } as React.CSSProperties}
          className="group relative flex items-center gap-4 overflow-hidden px-3 py-5 transition-colors duration-300 hover:text-[var(--brand-fg)] focus-visible:text-[var(--brand-fg)] md:gap-6 md:px-4 md:py-6"
        >
          <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 bg-[var(--brand)] transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100" />
          <SocialIcon id={it.id} className="relative shrink-0" />
          <span className="relative min-w-0 flex-1">
            <span className="block font-lab text-2xl font-bold leading-tight md:text-3xl">
              {it.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </span>
            {it.handle && (
              <span className="mt-0.5 block truncate text-sm text-soft transition-colors duration-300 group-hover:text-[var(--brand-fg)] group-focus-visible:text-[var(--brand-fg)]">
                {it.handle}
              </span>
            )}
          </span>
          <span className="relative shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            <Arrow />
          </span>
        </a>
      ) : (
        <div className="flex items-center gap-4 border-dashed px-3 py-5 text-soft md:gap-6 md:px-4 md:py-6">
          <SocialIcon id={it.id} className="shrink-0 opacity-60" />
          <span className="min-w-0 flex-1">
            <span className="block font-lab text-2xl font-bold leading-tight md:text-3xl">{it.label}</span>
            <span className="mt-0.5 block text-sm">Link to be added</span>
          </span>
          <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full border border-dashed border-muted text-sm">+</span>
        </div>
      )}
    </li>
  );

  return (
    <footer id="contact" ref={root} data-invert className="relative overflow-hidden bg-bg pt-24 text-fg md:pt-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-14 md:grid-cols-12 md:items-stretch md:gap-x-8">
          {/* Contact, section links, and copyright share the left column. */}
          <div className="md:col-span-4 md:flex md:flex-col">
            <div>
              <h2 data-fade className="font-lab text-xl font-bold md:text-2xl">Contact</h2>
              <p data-fade className="mt-3 max-w-xs text-lg leading-snug text-soft">{contact.lead}</p>
              {contact.email && (
                <a data-fade href={`mailto:${contact.email}`} className="mt-6 inline-block break-all border-b border-accent pb-0.5 transition-colors hover:text-accent">
                  {contact.email}
                </a>
              )}
            </div>

            <nav aria-label="Footer" data-fade className="mt-8 md:mt-10">
              <ul className="space-y-1">
                {index.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="group flex items-center gap-3 py-1.5 text-lg">
                      <span className="font-mono text-xs tabular-nums text-soft">{String(i + 1).padStart(2, "0")}</span>
                      <span className="relative">
                        {s.label}
                        <span aria-hidden="true" className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                      </span>
                      <span aria-hidden="true" className="size-2 rotate-45 border border-accent opacity-0 transition-all duration-300 group-hover:bg-accent group-hover:opacity-100 group-focus-visible:bg-accent group-focus-visible:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div data-fade className="mt-10 text-sm text-soft md:mt-auto">
              <p>© <Year /> {profile.name}. {profile.tagline}.</p>
              <p className="mt-1">Built with Next.js, Tailwind CSS, and GSAP.</p>
            </div>
          </div>

          {/* Href rows. Hover wipes each row with the destination's colour. */}
          <ul className="md:col-span-7 md:col-start-6">
            {items.map(renderRow)}
          </ul>
        </div>

        <div className="mt-4 flex justify-center py-6">
          <a
            href="#top"
            className="group inline-flex items-center gap-2 py-2 text-sm text-soft transition-colors hover:text-fg focus-visible:text-fg"
          >
            <span>Back to top</span>
            <span className="transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
              <Arrow up />
            </span>
          </a>
        </div>
        {/* Wordmark: outlined type, cropped by the bottom edge */}
        {/* <div aria-hidden="true" className="mt-10 select-none overflow-hidden text-[min(17vw,14rem)] md:mt-14">
          <div className="h-[0.62em] overflow-hidden">
            <p
              data-wordmark
              className="font-lab font-extrabold leading-[0.85] tracking-tight text-transparent"
              style={{ WebkitTextStroke: "1.5px color-mix(in srgb, var(--fg) 20%, transparent)" }}
            >
              {profile.name}
            </p>
          </div>
        </div> */}
      </div>
    </footer>
  );
}
