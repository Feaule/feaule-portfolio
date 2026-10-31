/**
 * Single source of truth for personal content.
 * Anything with `placeholder: true` is NOT real content — replace before publishing.
 */
export type Placeholder<T> = T & { placeholder: true };

export const profile = {
  name: "Feaule",
  tagline: "Code in Motion",
  role: "Informatics student",
  /** Taken from the project brief: the four areas the portfolio covers. */
  focus: [
    "Frontend development",
    "Business Information Systems",
    "Digital product thinking",
    "Motion graphics",
  ],
  /** DRAFT hero copy derived from the brief — edit freely. */
  hero: {
    line: "I build interfaces, systems, and motion that belong together.",
  },
  intro: {
    placeholder: true,
    text: "PLACEHOLDER — one or two sentences on who you are and what kind of internship you want.",
  } as Placeholder<{ text: string }>,
  about: {
    placeholder: true,
    paragraphs: [
      "PLACEHOLDER — about paragraph 1: your background and what drew you to informatics.",
      "PLACEHOLDER — about paragraph 2: how you combine business systems thinking with frontend and motion work.",
    ],
  } as Placeholder<{ paragraphs: string[] }>,
  /** Biography as "keyframes". Replace with your real milestones, in order. */
  milestones: {
    placeholder: true,
    items: [
      { title: "PLACEHOLDER — milestone one", text: "PLACEHOLDER — where it started: your first contact with computers or design." },
      { title: "PLACEHOLDER — milestone two", text: "PLACEHOLDER — studying Informatics and what you focus on." },
      { title: "PLACEHOLDER — milestone three", text: "PLACEHOLDER — your first motion graphics or code project." },
      { title: "PLACEHOLDER — milestone four", text: "PLACEHOLDER — what you want to do in an internship." },
    ],
  } as Placeholder<{ items: { title: string; text: string }[] }>,
  portrait: {
    placeholder: true,
    /** Put your photo in /public/images and set e.g. "/images/portrait.jpg". null shows the placeholder. */
    src: null as string | null,
    fallbackSrc: "/images/portrait-placeholder.png",
    alt: "PLACEHOLDER — describe the portrait photo",
  } as Placeholder<{ src: string | null; fallbackSrc: string; alt: string }>,
  contact: {
    placeholder: true,
    email: "hello@example.com",
    links: [
      { label: "GitHub", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  } as Placeholder<{ email: string; links: { label: string; href: string }[] }>,
} as const;