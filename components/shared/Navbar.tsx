import Link from "next/link";
import { sections } from "@/config/site";
import { profile } from "@/data/profile";
import ThemeToggle from "./ThemeToggle";

type Props = { variant: "a" | "b"; showSwitch?: boolean };

export default function Navbar({ variant, showSwitch = true }: Props) {
  const display = variant === "a" ? "font-serif text-2xl" : "font-lab text-lg font-bold tracking-tight";
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/80 backdrop-blur">
      <nav aria-label="Primary" className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-5 md:px-10">
        <a href="#top" className={display}>{profile.name}</a>

        <ul className="flex items-center gap-4 text-sm text-soft md:gap-8">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="transition-colors hover:text-accent">{s.label}</a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {showSwitch && (
            <div className="hidden items-center gap-1 text-xs text-muted sm:flex" aria-label="Compare concepts">
              <Link href="/concept-a" aria-current={variant === "a" ? "page" : undefined}
                className={`grid min-h-6 min-w-6 place-items-center ${variant === "a" ? "text-accent" : "hover:text-fg"}`}>A</Link>
              <span aria-hidden="true">/</span>
              <Link href="/" aria-current={variant === "b" ? "page" : undefined}
                className={`grid min-h-6 min-w-6 place-items-center ${variant === "b" ? "text-accent" : "hover:text-fg"}`}>B</Link>
            </div>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
