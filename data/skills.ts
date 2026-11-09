import type { SkillIconId } from "@/components/shared/SkillIcon";

/**
 * Toolkit, grouped into four tracks. This is NOT a proficiency chart:
 * there are deliberately no levels, bars, or ratings, and the order within a
 * track is not a ranking.
 *
 * `icon` uses a glyph from SkillIcon. Where none exists, set `icon: null` and a
 * short `mono` (monogram) is shown instead. To use an official logo file later,
 * you can extend SkillItem with an image path.
 */
export type SkillItem = { name: string; icon: SkillIconId | null; mono?: string };
export type SkillTrack = { id: string; index: string; title: string; items: SkillItem[] };

export const skills = {
  /** Shown as "<NAME> / TOOLKIT". */
  eyebrowSuffix: "TOOLKIT",
  heading: "Skills in Motion",
  /** DRAFT copy — edit freely. */
  intro: "Tools I use and keep learning across code, data, and creative work.",
  tracks: [
    {
      id: "development",
      index: "01",
      title: "Development",
      items: [
        { name: "Java", icon: "java" },
        { name: "Python", icon: "python" },
        { name: "PHP", icon: "php" },
        { name: "HTML", icon: "html" },
        { name: "CSS", icon: "css" },
        { name: "JavaScript", icon: "javascript" },
        { name: "Laravel", icon: "laravel" },
        { name: "React", icon: "react" },
        { name: "Tailwind CSS", icon: "tailwindcss" },
        { name: "GSAP", icon: "gsap" },
      ],
    },
    {
      id: "data",
      index: "02",
      title: "Data & Business",
      items: [
        { name: "MySQL", icon: "mysql" },
        { name: "PostgreSQL", icon: "postgresql" },
        { name: "MongoDB", icon: "mongodb" },
        { name: "Microsoft Excel", icon: "excel" },
        { name: "Power BI", icon: "powerbi" },
      ],
    },
    {
      id: "tools",
      index: "03",
      title: "Development Tools",
      items: [
        { name: "Git", icon: "git" },
        { name: "GitHub", icon: "github" },
        { name: "Docker", icon: "docker" },
        { name: "Visual Studio Code", icon: "vscode" },
        { name: "IntelliJ IDEA", icon: "intellijidea" },
      ],
    },
    {
      id: "creative",
      index: "04",
      title: "Design & Creative Media",
      items: [
        { name: "Figma", icon: "figma" },
        { name: "Canva", icon: "canva" },
        { name: "Adobe Illustrator", icon: "illustrator" },
        { name: "Adobe After Effects", icon: "aftereffects" },
        { name: "Adobe Premiere Pro", icon: "premierepro" },
        { name: "CapCut", icon: "capcut", mono: "Cc" },
      ],
    },
  ] as SkillTrack[],
  /** Optional, secondary. Set to null to remove it from the footer line. */
  ai: { label: "AI-assisted workflow", tools: ["ChatGPT", "Gemini", "Claude"] } as
    | { label: string; tools: string[] }
    | null,
};
