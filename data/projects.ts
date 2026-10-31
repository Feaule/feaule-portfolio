/** Placeholder projects. Replace with real work; do not invent achievements. */
export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  year: string;
  /** Public path under /public/images, or null to render the labeled placeholder. */
  image: string | null;
  href: string | null;
  placeholder: boolean;
};

export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Project one",
    summary: "PLACEHOLDER — what it is, who it is for, and your role.",
    tags: ["Frontend"],
    year: "—",
    image: null,
    href: null,
    placeholder: true,
  },
  {
    slug: "project-two",
    title: "Project two",
    summary: "PLACEHOLDER — a business information systems or product project.",
    tags: ["Business Information Systems"],
    year: "—",
    image: null,
    href: null,
    placeholder: true,
  },
  {
    slug: "project-three",
    title: "Project three",
    summary: "PLACEHOLDER — a motion or interaction experiment.",
    tags: ["Motion"],
    year: "—",
    image: null,
    href: null,
    placeholder: true,
  },
];