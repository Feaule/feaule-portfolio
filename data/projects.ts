/**
 * Projects. Only facts you have stated are filled in; everything else is
 * marked PLACEHOLDER. Media (screenshots, reels) is missing for all three —
 * add files under /public/images and set `image`.
 */
export type ProjectArt = "ring" | "square" | "path";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  /** Short label above the title, e.g. where the project happened. */
  context: string;
  tags: string[];
  /** Public path, e.g. "/images/apartment-system.png". null shows an abstract preview placeholder. */
  image: string | null;
  href: string | null;
  /** Decorative shape used while `image` is null (mirrors the hero's layers). */
  art: ProjectArt;
  /** true = the text itself still needs your real details. */
  placeholder: boolean;
};

export const projects: Project[] = [
  {
    slug: "apartment-management",
    title: "Apartment Management System",
    summary: "A CRUD-based apartment management system built as part of my coursework.",
    context: "Coursework",
    tags: ["CRUD", "Coursework"],
    image: null,
    href: null,
    art: "ring",
    placeholder: false,
  },
  {
    slug: "ui-ux-project",
    title: "UI/UX project",
    summary: "PLACEHOLDER — add the project name, your role, and the user problem it addressed.",
    context: "UI/UX",
    tags: ["UI/UX"],
    image: null,
    href: null,
    art: "square",
    placeholder: true,
  },
  {
    slug: "motion-and-visuals",
    title: "Motion graphics & visual assets",
    summary: "Visual assets, video editing, and motion graphics made for university organizational committees.",
    context: "Organizational committees",
    tags: ["Motion graphics", "Video editing"],
    image: null,
    href: null,
    art: "path",
    placeholder: false,
  },
];
