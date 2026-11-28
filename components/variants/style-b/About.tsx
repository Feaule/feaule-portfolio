"use client";
import { useEffect, useRef, useState } from "react";
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

const GREETINGS = [
  profile.about.greeting,
  "Halo, teman-teman!",
  "Hello, everyone!",
  "大家好！",
  "皆さん、こんにちは！",
];

export default function About() {
  const root = useRef<HTMLElement>(null);
  const [greeting, setGreeting] = useState(GREETINGS[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let index = 0;
    let timer: ReturnType<typeof setTimeout>;

    const type = (chars: string[], position = 0) => {
      if (position >= chars.length) {
        timer = setTimeout(erase, 3000);
        return;
      }

      setGreeting(chars.slice(0, position + 1).join(""));
      timer = setTimeout(() => type(chars, position + 1), 65);
    };

    const erase = (position = Array.from(GREETINGS[index]).length) => {
      if (position <= 0) {
        index = (index + 1) % GREETINGS.length;
        type(Array.from(GREETINGS[index]));
        return;
      }

      setGreeting(Array.from(GREETINGS[index]).slice(0, position - 1).join(""));
      timer = setTimeout(() => erase(position - 1), 40);
    };

    timer = setTimeout(erase, 4000);
    return () => clearTimeout(timer);
  }, []);

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
                  {/* Hologram overlays (dekoratif) */}
                  <div data-holo-fx aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0">
                    <span className="absolute inset-0 bg-accent/20" />
                    <span className="holo-lines absolute inset-0 opacity-80" />
                  </div>
                  <span
                    data-holo-scan
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-accent opacity-0 shadow-[0_0_18px_4px_color-mix(in_srgb,var(--accent)_70%,transparent)]"
                  />
                  <div data-holo-cubes aria-hidden="true" className="pointer-events-none absolute inset-0" />
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

          {/* Biography */}
          <div className="flex flex-col gap-10 md:gap-12">
            <div>
              <h3 data-fade aria-label="Greetings in Spanish, Indonesian, English, Mandarin, and Japanese" className="font-lab text-2xl font-bold leading-tight md:text-3xl">
                <span aria-hidden="true">{greeting}<span className="ml-0.5 inline-block h-[1em] translate-y-[0.15em] border-r-2 border-accent motion-safe:animate-pulse" /></span>
              </h3>
              {profile.about.intro.map((paragraph) => (
                <p key={paragraph} data-fade className="mt-4 max-w-2xl text-lg leading-relaxed text-soft">{paragraph}</p>
              ))}
            </div>

            {profile.about.sections.map((sec) => (
              <div key={sec.title} data-fade className="max-w-xl border-t border-line pt-6">
                <h3 className="font-lab text-base font-bold">{sec.title}</h3>
                <p className="mt-2 text-lg leading-relaxed text-soft">{sec.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
