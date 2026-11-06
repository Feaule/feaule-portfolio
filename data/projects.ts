/**
 * Projects. Only facts you have stated are filled in; everything else is
 * marked PLACEHOLDER. Gallery images are all missing for now — add files under
 * /public/images/projects and set `src` (e.g. "/images/projects/apartment-1.png").
 */
export type ProjectArt = "ring" | "square" | "path";

export type GalleryImage = {
  /** Public path, or null to show an abstract preview placeholder. */
  src: string | null;
  alt: string;
  /** Decorative shape used while `src` is null (mirrors the hero's layers). */
  art: ProjectArt;
};

export type ProjectFact = { label: string; value: string };

export type Project = {
  slug: string;
  title: string;
  /** Short version shown on the card. */
  summary: string;
  /** Short label above the title. */
  context: string;
  tags: string[];
  /** The first image is the card preview; the detail view cycles through all of them. */
  gallery: GalleryImage[];
  /** Longer version shown in the detail dialog. */
  detail: {
    overview: string[];
    facts: ProjectFact[];
    links: { label: string; href: string }[];
  };
  /** true = the text itself still needs your real details. */
  placeholder: boolean;
};

const shots = (title: string): GalleryImage[] => [
  { src: null, alt: `${title} — image 1 (to be added)`, art: "ring" },
  { src: null, alt: `${title} — image 2 (to be added)`, art: "square" },
  { src: null, alt: `${title} — image 3 (to be added)`, art: "path" },
];

export const projects: Project[] = [
  {
    slug: "apartment-management",
    title: "Apartment Management System",
    summary: "A CRUD-based apartment management system built as part of my coursework.",
    context: "Coursework",
    tags: ["CRUD", "Coursework"],
    gallery: shots("Apartment Management System"),
    detail: {
      overview: [
        "A CRUD-based apartment management system developed as part of my coursework.",
        "PLACEHOLDER — add what the system manages, its main features, and what you contributed.",
      ],
      facts: [
        { label: "Context", value: "Coursework" },
        { label: "Role", value: "PLACEHOLDER — your role" },
        { label: "Stack", value: "PLACEHOLDER — technologies used" },
      ],
      links: [],
    },
    placeholder: false,
  },
  {
    slug: "ui-ux-project",
    title: "UI/UX project",
    summary: "PLACEHOLDER — add the project name, your role, and the user problem it addressed.",
    context: "UI/UX",
    tags: ["UI/UX"],
    gallery: shots("UI/UX project"),
    detail: {
      overview: [
        "PLACEHOLDER — describe the problem, who the users were, and how the design solved it.",
      ],
      facts: [
        { label: "Context", value: "PLACEHOLDER — course, team, or client" },
        { label: "Role", value: "PLACEHOLDER — your role" },
        { label: "Tools", value: "PLACEHOLDER — design tools used" },
      ],
      links: [],
    },
    placeholder: true,
  },
  {
    slug: "motion-and-visuals",
    title: "Motion graphics & visual assets",
    summary: "Visual assets, video editing, and motion graphics made for university organizational committees.",
    context: "Organizational committees",
    tags: ["Motion graphics", "Video editing"],
    gallery: shots("Motion graphics & visual assets"),
    detail: {
      overview: [
        "Visual assets, video editing, and motion graphics made for university organizational committees.",
        "PLACEHOLDER — add examples, what the content was for, and the tools you used.",
      ],
      facts: [
        { label: "Context", value: "Organizational committees" },
        { label: "Tools", value: "PLACEHOLDER — software used" },
      ],
      links: [],
    },
    placeholder: false,
  },
];
