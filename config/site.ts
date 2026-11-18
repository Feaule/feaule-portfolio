export type Variant = "a" | "b";

/**
 * Which concept the root route (/) renders.
 * Change the default here, or set NEXT_PUBLIC_ROOT_VARIANT=a|b in .env.local.
 */
const envVariant = process.env.NEXT_PUBLIC_ROOT_VARIANT;
export const rootVariant: Variant = envVariant === "a" || envVariant === "b" ? envVariant : "a";

/** Shared section order — both styles use the same ids so they stay comparable. */
export const sections = [
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;
