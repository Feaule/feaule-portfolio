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
  portrait: {
    placeholder: true,
    src: null as string | null, // e.g. "/images/portrait.jpg"
    alt: "PLACEHOLDER — describe the portrait photo",
  } as Placeholder<{ src: string | null; alt: string }>,
  contact: {
    placeholder: true,
    email: "hello@example.com",
    links: [
      { label: "GitHub", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  } as Placeholder<{ email: string; links: { label: string; href: string }[] }>,
} as const;