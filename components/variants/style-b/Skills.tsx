"use client";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@/lib/gsap";
import { skills, type SkillItem } from "@/data/skills";
import { animateSkillsB } from "@/animations/style-b/skills";

// Same label colours as the hero's layers panel, so the two sections read as one system.
const LABELS = ["var(--accent)", "var(--accent-2)", "var(--fg)", "var(--muted)"];

/** Temporary monogram until a logo file is provided. */
const monogram = (name: string) => {
  const words = name.split(/\s+/);
  return (words.length > 1 ? words.map((w) => w[0]).join("") : name.slice(0, 2)).toUpperCase();
};

function Tile({ item }: { item: SkillItem }) {
  return (
    <li data-tile className="group flex w-24 flex-col items-center gap-2 md:w-28">
      <div
        className={`grid size-20 place-items-center rounded-2xl border bg-surface transition-[translate,border-color] group-hover:-translate-y-1 group-hover:border-accent md:size-24 ${
          item.placeholder ? "border-dashed border-muted" : "border-line"
        }`}
      >
        {item.icon ? (
          <Image src={item.icon} alt="" width={44} height={44} unoptimized />
        ) : (
          <span aria-hidden="true" className="font-lab text-xl font-bold text-soft">
            {item.placeholder ? "+" : monogram(item.name)}
          </span>
        )}
      </div>
      <span className="text-center text-sm text-soft">{item.name}</span>
    </li>
  );
}

export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const anim = animateSkillsB(root.current!);
      return () => anim.revert();
    },
    { scope: root },
  );

  return (
    <section id="skills" ref={root} className="relative overflow-x-clip py-[var(--section-y)]">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <h2
          data-split
          className="whitespace-nowrap font-lab text-[clamp(3rem,12vw,10.5rem)] font-extrabold leading-[0.9] tracking-tight"
        >
          Skills
        </h2>
        <p className="mt-6 max-w-md text-lg text-soft">{skills.intro}</p>

        <div className="mt-14 md:mt-20">
          {skills.groups.map((g, i) => (
            <div
              key={g.id}
              data-group
              className="grid gap-6 border-t border-line py-8 md:grid-cols-[16rem_1fr] md:gap-12 md:py-10"
            >
              <div className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1.5 size-3 shrink-0 rounded-[3px]" style={{ background: LABELS[i] }} />
                <h3 className="font-lab text-xl font-bold leading-tight">{g.title}</h3>
              </div>
              <ul className="flex flex-wrap gap-x-5 gap-y-8">
                {g.items.map((item, k) => (
                  <Tile key={`${g.id}-${k}`} item={item} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
