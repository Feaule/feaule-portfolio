"use client";
import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { profile } from "@/data/profile";
import { animateContactB } from "@/animations/style-b/contact";

// Same label colours as the hero's layers panel.
const LABELS = ["var(--accent)", "var(--accent-2)", "var(--fg)", "var(--muted)"];

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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
  const rows = [
    ...contact.links.map((l) => ({ id: l.id, label: l.label, handle: l.handle, href: l.href })),
    { id: "editing", label: editing.label, handle: editing.handle, href: editing.href },
  ];

  return (
    <section id="contact" ref={root} className="relative overflow-x-clip py-24 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div data-drift="1" className="absolute -right-[16vmin] top-[4%] size-[52vmin] rounded-full border border-line" />
        <div data-drift="-1" className="absolute -left-[6vmin] bottom-[10%] size-[20vmin] -rotate-12 rounded-[18%] border border-accent2 opacity-60" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <h2
          data-split
          className="whitespace-nowrap font-lab text-[clamp(2.75rem,11vw,10rem)] font-extrabold leading-[0.9] tracking-tight"
        >
          Contact
        </h2>

        <p data-fade className="mt-8 max-w-xl font-lab text-2xl font-semibold leading-snug md:text-3xl">
          {contact.lead}
        </p>

        {contact.email && (
          <a
            data-fade
            href={`mailto:${contact.email}`}
            className="mt-8 inline-block break-all border-b-2 border-accent pb-1 font-lab text-2xl font-bold transition-colors hover:text-accent md:text-4xl"
          >
            {contact.email}
          </a>
        )}

        <ul className="mt-14 md:mt-20">
          {rows.map((r, i) => (
            <li key={r.id} data-fade className="border-t border-line last:border-b">
              {r.href ? (
                <a href={r.href} target="_blank" rel="noreferrer" className="group flex items-center gap-4 py-6 md:gap-8 md:py-8">
                  <span aria-hidden="true" className="size-3 shrink-0 rounded-[3px]" style={{ background: LABELS[i] }} />
                  <span className="min-w-0 transition-transform duration-300 group-hover:translate-x-2">
                    <span className="block font-lab text-2xl font-bold md:text-4xl">
                      {r.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                    {r.handle && <span className="mt-1 block text-sm text-soft md:text-base">{r.handle}</span>}
                  </span>
                  <span className="ml-auto grid size-11 shrink-0 place-items-center rounded-full border border-line transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
                    <Arrow />
                  </span>
                </a>
              ) : (
                <div className="flex items-center gap-4 py-6 md:gap-8 md:py-8">
                  <span aria-hidden="true" className="size-3 shrink-0 rounded-[3px] opacity-60" style={{ background: LABELS[i] }} />
                  <span className="min-w-0">
                    <span className="block font-lab text-2xl font-bold text-soft md:text-4xl">{r.label}</span>
                    <span className="mt-1 block text-sm text-soft md:text-base">Link to be added</span>
                  </span>
                  <span aria-hidden="true" className="ml-auto grid size-11 shrink-0 place-items-center rounded-full border border-dashed border-muted text-soft">+</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
