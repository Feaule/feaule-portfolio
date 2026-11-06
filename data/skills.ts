/**
 * Skills are grouped by the same four areas as the hero's layers.
 * This is a toolkit, NOT a proficiency chart — there are deliberately no levels.
 *
 * Only list tools you can honestly claim. `placeholder: true` tiles render as
 * dashed "Tool name" slots. To add a logo, put an SVG/PNG you have the right to
 * use in /public/icons and set `icon` (e.g. "/icons/after-effects.svg").
 */
export type SkillItem = { name: string; icon: string | null; placeholder: boolean };
export type SkillGroup = { id: string; title: string; items: SkillItem[] };

const slot = (): SkillItem => ({ name: "Tool name", icon: null, placeholder: true });

export const skills = {
  /** DRAFT copy — edit freely. */
  intro: "A growing toolkit across code, data, design, and motion.",
  groups: [
    { id: "frontend", title: "Frontend development", items: [slot(), slot(), slot()] },
    {
      id: "bis",
      title: "Business Information Systems",
      items: [{ name: "Power BI", icon: null, placeholder: false }, slot(), slot()],
    },
    {
      id: "product",
      title: "Digital product thinking",
      items: [{ name: "UI/UX", icon: null, placeholder: false }, slot(), slot()],
    },
    {
      id: "motion",
      title: "Motion graphics",
      items: [{ name: "After Effects", icon: null, placeholder: false }, slot(), slot()],
    },
  ] as SkillGroup[],
};
