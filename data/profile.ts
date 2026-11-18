
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
    greeting: "Hola, Amigos!",
    intro: [
      "My name is Felix Augurius, an undergraduate Informatics student specializing in Business Information Systems at Petra Christian University.",
      // "I'm interested in exploring how technology, business, and creativity come together through digital products, data, and visual experiences.",
    ],

    sections: [
      {
        title: "Beyond the Screen",
        text: "Outside my academic life, I enjoy watching YouTube, playing games, etc whatever I like.",
      },
      {
        title: "Finding My Creative Side",
        text: "I also enjoy exploring visual creativity through video editing and motion graphics. Occasionally, I like wandering around the city, capturing little moments through photos and videos along the way.",
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
        title: "WANDER",
        text: "A curious mind, always looking around and finding new things to explore.",
      },
      {
        index: "02",
        title: "DISCOVER",
        text: "Exploring different interests through technology, visual arts, and creative experiences to find what inspires me.",
      },
      {
        index: "03",
        title: "EXPERIMENT",
        text: "Trying new tools and approaches. Not everything works, but every attempt adds a new perspective.",
      },
      {
        index: "04",
        title: "CONNECT",
        text: "Combining logical thinking with visual expression to see ideas from different angles.",
      },
      {
        index: "05",
        title: "EVOLVE",
        text: "Embracing new challenges and growing through learning and creating.",
      },
    ],
  },

  portrait: {
    src: "/images/portrait.webp" as string | null,
    fallbackSrc: "/images/portrait-placeholder.png",
    alt: "Portrait of Felix",
    position: "50% 20%",
  },

  /**
   * Contact. `href: null` renders a dashed "link to be added" row instead of a dead link.
   * `email` is optional — leave null to hide it, or set e.g. "you@example.com".
   */
  contact: {
    lead: "For inquiries, collaborations, or just a quick hello, my inbox is open.",
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
