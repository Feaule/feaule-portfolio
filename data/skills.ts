/**
 * Group names come from the brief's focus areas.
 * Items are placeholders — list only skills you can honestly claim.
 */
export type SkillGroup = {
  id: string;
  title: string;
  items: string[];
  placeholder: boolean;
};

export const skillGroups: SkillGroup[] = [
  { id: "frontend", title: "Frontend development", items: ["Skill placeholder", "Skill placeholder", "Skill placeholder"], placeholder: true },
  { id: "bis", title: "Business Information Systems", items: ["Skill placeholder", "Skill placeholder", "Skill placeholder"], placeholder: true },
  { id: "product", title: "Digital product thinking", items: ["Skill placeholder", "Skill placeholder", "Skill placeholder"], placeholder: true },
  { id: "motion", title: "Motion graphics", items: ["Skill placeholder", "Skill placeholder", "Skill placeholder"], placeholder: true },
];