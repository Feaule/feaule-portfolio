export type Variant = "a" | "b";

/** Shared section order — both styles use the same ids so they stay comparable. */
export const sections = [
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;