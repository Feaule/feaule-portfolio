"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@/lib/gsap";
import { profile } from "@/data/profile";
import { animateAboutB } from "@/animations/style-b/about";

const CORNERS = [
  "left-3 top-3 border-l border-t",
  "right-3 top-3 border-r border-t",
  "bottom-3 left-3 border-b border-l",
  "bottom-3 right-3 border-b border-r",
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const anim = animateAboutB(root.current!);
      return () => anim.revert();
    },
    { scope: root },
  );

  const isPlaceholder = !profile.portrait.src;
  const src = profile.portrait.src ?? profile.portrait.fallbackSrc;

  return (
    <section id="about" ref={root} className="relative overflow-x-clip py-[var(--section-y)]">
      {/* Backdrop shapes: same language as the hero, drifting on scroll */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div data-drift="-1" className="absolute -left-[18vmin] top-[6%] size-[48vmin] rounded-full border border-line" />
        <div data-drift="1" className="absolute -right-[8vmin] bottom-[8%] size-[22vmin] rotate-12 rounded-[18%] border border-accent2 opacity-60" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <h2
          data-split
          className="font-lab text-[clamp(3.5rem,13vw,11rem)] font-extrabold leading-[0.9] tracking-tight"
        >
          About
        </h2>

        <div className="mt-12 grid gap-14 md:mt-16 md:grid-cols-[5fr_7fr] md:gap-16">
          {/* Portrait in a "comp window" */}
          <figure className="md:sticky md:top-24 md:self-start">
            <div className="relative">
              <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rounded-lg bg-surface md:translate-x-4 md:translate-y-4" />
              <div className="relative overflow-hidden rounded-lg border border-line bg-surface">
                <div className="flex items-center justify-between gap-4 border-b border-line px-3 py-2 font-mono text-xs text-soft">
                  <span className="truncate">{src.split("/").pop()}</span>
                  <span className="tabular-nums">4:5</span>
                </div>
                <div data-portrait className="relative aspect-[4/5]">
                  <Image
                    data-portrait-img
                    src={src}
                    alt={profile.portrait.alt}
                    fill
                    sizes="(min-width: 768px) 40vw, 90vw"
                    className="object-cover"
                    style={{ objectPosition: profile.portrait.position }}
                  />
                  {CORNERS.map((c) => (
                    <span key={c} aria-hidden="true" className={`absolute size-4 border-accent ${c}`} />
                  ))}
                </div>
              </div>
            </div>
            {isPlaceholder && (
              <figcaption className="mt-6 text-xs text-soft">
                Placeholder image. Add your photo to /public/images and set portrait.src in data/profile.ts.
              </figcaption>
            )}
          </figure>

          {/* Biography + journey */}
          <div className="flex flex-col gap-10 md:gap-12">
            <p data-fade className="font-lab text-2xl font-semibold leading-[1.15] md:text-[2.5rem]">
              {profile.about.lead}
            </p>

            {profile.about.sections.map((sec) => (
              <div key={sec.title} data-fade className="max-w-xl border-t border-line pt-6">
                <h3 className="font-lab text-base font-bold">{sec.title}</h3>
                <p className="mt-2 text-lg leading-relaxed text-soft">{sec.text}</p>
              </div>
            ))}

            <div className="mt-4 border-t border-line pt-8">
              <h3 data-fade className="mb-6 font-lab text-xl font-bold">{profile.journey.title}</h3>
              <ol data-keylist className="relative border-l border-line pl-8">
                {profile.journey.stages.map((st) => (
                  <li key={st.index} data-key data-state="past" data-fade className="group relative pb-10 last:pb-0">
                    <span
                      data-diamond
                      aria-hidden="true"
                      className="absolute -left-8 top-1.5 size-3 -translate-x-1/2 rotate-45 border border-accent bg-accent transition-[background-color,scale,box-shadow] group-data-[state=active]:scale-150 group-data-[state=active]:shadow-[0_0_0_4px_color-mix(in_srgb,var(--accent)_25%,transparent)] group-data-[state=future]:bg-bg"
                    />
                    <p aria-hidden="true" className="font-mono text-xs tabular-nums text-soft">
                      {st.index} · {st.easing}
                    </p>
                    <h4 className="mt-1 font-lab text-lg font-bold transition-colors group-data-[state=active]:text-accent">
                      {st.title}
                    </h4>
                    <p className="mt-1 max-w-md text-soft">{st.text}</p>
                  </li>
                ))}
                {/* Playhead: decorative, driven by scroll */}
                <div data-playhead aria-hidden="true" className="pointer-events-none absolute -left-3 right-0 top-0 h-px bg-accent/60 opacity-0">
                  <span className="absolute -top-[5px] left-[3px] size-2.5 rotate-45 bg-accent" />
                  <span data-timecode className="absolute -top-6 right-0 hidden bg-bg px-1 font-mono text-xs tabular-nums text-accent sm:block">
                    00:00:03:00
                  </span>
                </div>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
