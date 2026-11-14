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
const img = (src: string, alt: string): GalleryImage => ({ src, alt, art: "ring" });

export const projects: Project[] = [
  {
    slug: "data-science-modeling",
    title: "Data Science Modeling",
    summary: "PLACEHOLDER — add the project name, your role, and the user problem it addressed.",
    context: "Coursework",
    tags: ["Data Science", "SQL", "NoSQL", "Coursework"],
    // gallery: shots("Apartment Management System"),
    gallery: [
      img("/images/projects/pdds-1.png", "Data Science Project — image 1"),
      img("/images/projects/pdds-2.png", "Data Science Project — image 2"),
      img("/images/projects/pdds-3.png", "Data Science Project — image 3"),
    ],
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
    placeholder: true,
  },
  {
    slug: "ui-ux-project",
    title: "UI/UX project",
    summary: "PLACEHOLDER — add the project name, your role, and the user problem it addressed.",
    context: "UI/UX",
    tags: ["UI/UX"],
    // gallery: shots("UI/UX project"),
    gallery: [
      img("/images/projects/uiux-1.png", "UI/UX project — image 1"),
      img("/images/projects/uiux-2.png", "UI/UX project — image 2"),
      img("/images/projects/uiux-3.png", "UI/UX project — image 3"),
    ],
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
    slug: "ai-and-machine-learning",
    title: "AI and Machine Learning",
    summary: "Projects and research work focused on implementing AI and machine learning solutions.",
    context: "Academic Research",
    tags: ["AI", "Machine Learning", "Python", "TensorFlow"],
    // gallery: shots("AI and Machine Learning"),
    gallery: [
      img("/images/projects/aiml-1.png", "AI and Machine Learning — image 1"),
      img("/images/projects/aiml-2.png", "AI and Machine Learning — image 2"),
      img("/images/projects/aiml-3.png", "AI and Machine Learning — image 3"),
    ],
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
