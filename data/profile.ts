
/**
 * Single source of truth for personal content.
 * Only content wrapped in Placeholder<T> is NOT real.
 */
export type Placeholder<T> = T & { placeholder: true };

export const profile = {
  name: "Feaule",
  tagline: "Code in Motion",
  role: "Informatics student",

  /**
   * Areas of interest, not a ranking of expertise.
   */
  focus: [
    "Frontend development",
    "Business Information Systems",
    "Digital product thinking",
    "Motion graphics",
  ],

  hero: {
    line: "Exploring technology through code, data, and creative expression.",
  },

  about: {
    lead: "I'm an Informatics student curious about how technology and creativity come together to shape digital experiences.",

    sections: [
      {
        title: "Beyond the Screen",
        text: "Exploring frontend development, UI/UX, and data through academic projects, including an apartment management system.",
      },
      {
        title: "Finding My Creative Side",
        text: "Outside the classroom, I discovered a love for visual storytelling through video editing, motion graphics, and organizational experiences.",
      },
    ],
  },

  /**
   * My Journey: the evolution of interests,
   * not dated career milestones.
   */
  journey: {
    title: "My Journey",
    stages: [
      {
        index: "01",
        title: "Discover",
        easing: "Linear",
        text: "Started exploring technology through Informatics.",
      },
      {
        index: "02",
        title: "Explore",
        easing: "Easy Ease",
        text: "Learning through code, interfaces, and data.",
      },
      {
        index: "03",
        title: "Create",
        easing: "Bezier",
        text: "Turning ideas into visuals and motion.",
      },
      {
        index: "04",
        title: "Evolve",
        easing: "Auto Bezier",
        text: "Connecting technical and creative perspectives.",
      },
    ],
  },

  portrait: {
    src: "/images/portrait.png" as string | null,
    fallbackSrc: "/images/portrait-placeholder.png",
    alt: "Portrait of Feaule",
    position: "50% 20%",
  },

  // Replace before publishing.
  contact: {
    placeholder: true,
    email: "hello@example.com",
    links: [
      { label: "GitHub", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  } as Placeholder<{
    email: string;
    links: { label: string; href: string }[];
  }>,
} as const;
