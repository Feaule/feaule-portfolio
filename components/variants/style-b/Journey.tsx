"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { profile } from "@/data/profile";
import { animateJourney } from "@/animations/style-b/journey";

export default function Journey() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const anim = animateJourney(root.current!);
      return () => anim.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="journey"
      ref={root}
      aria-labelledby="journey-heading"
      className="relative py-[var(--section-y)] md:flex md:min-h-svh md:flex-col md:justify-center"
    >
      <div data-content className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <h2
          id="journey-heading"
          className="font-lab text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold leading-[0.9] tracking-tight"
        >
          {profile.journey.title}
        </h2>

        <div
          data-viewport
          role="region"
          aria-label="Journey milestones"
          tabIndex={0}
          className="journey-viewport relative -mx-5 mt-10 scroll-px-5 overflow-x-auto overflow-y-hidden px-5 pb-4 [scrollbar-width:thin] md:mx-0 md:mt-14 md:px-0"
        >
          <div data-track className="relative w-max md:h-[26rem]">
            {/* Rail, progress fill, playhead (decorative) */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[13px] h-px bg-line md:top-1/2" />
            <div
              data-fill
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-[13px] h-px origin-left scale-x-0 bg-accent md:top-1/2"
            />
            <div data-playhead aria-hidden="true" className="pointer-events-none absolute left-0 top-[13px] size-0 opacity-0 md:top-1/2">
              <span className="absolute left-0 top-0 size-6 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-accent" />
            </div>

            <ol className="flex gap-6 md:h-full md:gap-0">
              {profile.journey.stages.map((stage, i) => {
                const above = i % 2 === 0;
                return (
                  <li
                    key={stage.index}
                    data-stage
                    data-side={above ? "above" : "below"}
                    className="journey-stage group relative w-[min(82vw,22rem)] shrink-0 snap-start pt-10 md:h-full md:w-[20rem] md:pt-0"
                  >
                    <span
                      data-marker
                      aria-hidden="true"
                      className="absolute left-0 top-2 size-[11px] rotate-45 border border-accent bg-bg transition-[background-color,scale] duration-300 md:top-1/2 md:-translate-y-1/2 group-data-[state=active]:scale-125 group-data-[state=active]:bg-accent group-data-[state=past]:bg-accent"
                    />
                    <span
                      aria-hidden="true"
                      className={`journey-stem absolute left-[5px] hidden w-px bg-line md:block md:h-8 ${above ? "md:bottom-1/2" : "md:top-1/2"}`}
                    />

                    <div
                      className={`journey-card relative md:absolute md:left-0 md:w-[18rem] ${
                        above ? "md:bottom-[calc(50%+2rem)]" : "md:top-[calc(50%+2rem)]"
                      }`}
                    >
                      <span aria-hidden="true" className="journey-frame pointer-events-none absolute inset-0" />
                      <div className="relative px-4 py-3">
                        <p className="font-mono text-xs tabular-nums tracking-[0.18em] text-soft">{stage.index}</p>
                        <h3 className="mt-1 font-lab text-xl font-bold tracking-wide md:text-2xl">{stage.title}</h3>
                        <div className="journey-desc">
                          <div>
                            <p className="pt-2 text-sm leading-relaxed text-soft">{stage.text}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
        <p className="mt-2 font-mono text-xs text-soft md:hidden">
          Swipe to explore <span aria-hidden="true">→</span>
        </p>
      </div>
    </section>
  );
}