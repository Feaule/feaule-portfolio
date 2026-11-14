
/**
 * Single source of truth for personal content.
 * Only content wrapped in Placeholder<T> is NOT real.
 */
export type Placeholder<T> = T & { placeholder: true };
export type ContactLink = { id: string; label: string; handle: string | null; href: string | null };

export const profile = {
  name: "Feaule",
  tagline: "Code in Motion",
  role: "Informatics student",

  /**
   * Areas of interest, not a ranking of expertise.
   */
  focus: [
    "Shape Orbit",
    "Shape Rectangle",
    "Shape Full Circle",
    "Path Object",
  ],

  hero: {
    title: ["Felix", "Portfolio"],
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
    src: "/images/portrait.webp" as string | null,
    fallbackSrc: "/images/portrait-placeholder.png",
    alt: "Portrait of Feaule",
    position: "50% 20%",
  },

  /**
   * Contact. `href: null` renders a dashed "link to be added" row instead of a dead link.
   * `email` is optional — leave null to hide it, or set e.g. "you@example.com".
   */
  contact: {
    /** DRAFT copy — edit freely. */
    lead: "I'm looking for internship opportunities — feel free to say hello.",
    email: null as string | null,
    links: [
      { id: "github", label: "GitHub", handle: "github.com/Feaule", href: "https://github.com/Feaule" },
      { id: "linkedin", label: "LinkedIn", handle: "linkedin.com/in/felixleneka", href: "https://linkedin.com/in/felixleneka" },
      { id: "instagram", label: "Instagram", handle: "instagram.com/felixaugurius", href: "https://www.instagram.com/felixaugurius/" },
    ] as ContactLink[],
  },

  /** External portfolio (e.g. Google Drive) for editing projects. Add the URL when ready. */
  editing: {
    label: "Editing portfolio",
    handle: "Design and motion graphics work",
    summary: "More of my video editing and motion graphics work, collected in an external portfolio.",
    href: "https://drive.google.com/drive/folders/1DJG5akWDq_bVfd4wDv4t3OacHTDlsroS?usp=sharing" as string | null,
  },
} as const;
