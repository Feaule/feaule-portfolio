# Feaule Portfolio — Code in Motion

A motion-driven personal portfolio built with Next.js, TypeScript, and Tailwind CSS.

The portfolio presents my background as an Informatics student with interests in frontend development, Business Information Systems, digital products, and creative motion design.

## 1. Project Goals

Build a distinctive, responsive, and recruiter-friendly portfolio that combines:

- Frontend development and coding.
- Business Information Systems and digital product thinking.
- Creative direction, motion graphics, and visual storytelling.

The website should feel like a carefully art-directed digital experience, not a generic developer portfolio template.

## 2. Visual Direction

The visual identity is inspired by motion graphics and creative software such as Adobe After Effects, Premiere Pro, and other digital production tools.

Visual elements may include:
- Timeline tracks and layers.
- Keyframe markers and motion paths.
- Composition and preview panels.
- Playhead and progress indicators.
- Code editor interfaces, syntax highlighting, and terminal elements.
- Minimal interface details inspired by creative applications.

These elements should be integrated into the website's visual language rather than reproducing an actual editing application's interface.

Maintain a balance between motion graphics aesthetics and a clear, professional developer portfolio.

Avoid excessive interface decoration, fake technical data, unnecessary panels, and visual clutter.

## 3. Color System

Use the following core palette:

| Role | Color | Hex |
|---|---|---|
| Foundation | Abyssal Navy | `#07090E` |
| Structure | Smoked Charcoal | `#141923` |
| Accent | Kinetic Cyan | `#38BDF8` |
| Motion Accent | Spectral Indigo | `#818CF8` |
| Primary Text | Crystalline White | `#F8FAFC` |
| Secondary Text | Muted Slate | `#64748B` |

Dark mode is the primary visual identity.

Light mode must have its own carefully adjusted background, surface, text, border, and accent colors. Do not simply invert the dark palette.

Both modes must:
- Preserve the same visual identity and layout.
- Maintain readable contrast.
- Support a working theme toggle.
- Respect the user's system preference when no preference has been saved.
- Avoid theme flashing during page initialization.

## 4. Two Visual Concepts

Build two distinct visual directions using the same brand identity, content, and color system.

### Concept A — Kinetic Editorial

A clean, elegant, typography-driven direction.

Characteristics:
- Generous negative space.
- Strong typography and editorial composition.
- Minimal layer and timeline-inspired details.
- Subtle keyframe and motion-path graphics.
- Masked text and image reveals.
- Restrained cyan and indigo accents.
- Smooth, purposeful transitions.

The result should feel refined, modern, and professional.

### Concept B — Experimental Motion Lab

A more expressive and spatial direction.

Characteristics:
- Layered visual compositions.
- More prominent timeline and keyframe motifs.
- Camera-like movement and parallax.
- Dynamic project showcases.
- Experimental transitions and spatial layouts.
- Interactive motion-inspired elements.
- More expressive use of shapes and depth.

The result should feel like an interactive motion design experiment while remaining usable and readable.

Both concepts must support light and dark modes.

## 5. Website Structure

Suggested sections:

1. Hero — personal introduction and visual identity.
2. About — background, interests, and professional direction.
3. Skills — technical and creative skills.
4. Selected Projects — selected academic and personal projects.
5. Beyond Code — creative work and motion graphics.
6. Contact — professional contact information.

Each section may have its own motion language. Do not force identical animation patterns across all sections.

## 6. Motion Design Principles

Use GSAP and ScrollTrigger as the primary animation tools.

Use `@gsap/react` and `useGSAP()` where appropriate for animation lifecycle and cleanup.

Motion for React may be used for smaller UI interactions when useful.

Guidelines:
- Hero: kinetic typography, staggered reveals, and controlled shape movement.
- About: masked text reveals and subtle staggered transitions.
- Skills: horizontal carousel or timeline-inspired interaction.
- Projects: image masking, layered reveals, and optional pinned sections.
- Contact: a restrained, memorable outro.

Animations must be purposeful, smooth, and responsive.

Prioritize transform and opacity animations. Avoid unnecessary layout recalculations, excessive pinned sections, and expensive continuous animations.

Respect `prefers-reduced-motion` and provide simpler mobile alternatives.

Do not introduce Three.js unless a specific requirement justifies it.

## 7. Technical Stack

Existing project:
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- ESLint

Planned additions:
- GSAP
- GSAP ScrollTrigger
- `@gsap/react`
- Optional Motion for React

Do not install additional dependencies without first explaining why they are needed.

## 8. Architecture

Keep both concepts inside one Next.js project.

Suggested structure:

```text
app/
  page.tsx
  layout.tsx
  globals.css
  concept-a/
    page.tsx
  concept-b/
    page.tsx

components/
  shared/
    Navbar.tsx
    ThemeToggle.tsx
  variants/
    style-a/
    style-b/

animations/
  style-a/
  style-b/

data/
  profile.ts
  projects.ts
  skills.ts

public/
  images/
  icons/
  videos/
```

Requirements:
- `/concept-a` previews Concept A.
- `/concept-b` previews Concept B.
- `/` serves as the main entry point and eventually displays the selected concept.
- Shared content must be separated from presentation.
- Theme handling should be reusable across both concepts.
- Keep each concept's components and animation logic independent where appropriate.
- Avoid duplicating the entire application.

The final structure may be adjusted when there is a clear technical reason.

## 9. Content Integrity

This is a real personal portfolio.

Never invent:
- Projects or professional experience.
- Job titles or responsibilities.
- Project outcomes or performance metrics.
- Client names, testimonials, or achievements.

Use clearly labeled placeholders whenever information or assets are missing.

Keep project descriptions concise and accurately represent my contributions.

## 10. Development Workflow

Development must be incremental and milestone-based.

Do not implement the entire portfolio in one operation.

For every milestone:

1. Inspect the current project and relevant files.
2. Explain the objective and implementation plan.
3. Identify files that will be created or modified.
4. Implement only the approved milestone.
5. Run relevant lint, build, or other checks.
6. Fix issues introduced by the changes.
7. Summarize completed work and remaining limitations.
8. Suggest a specific Git commit message.
9. Stop and wait for my approval before proceeding.

Do not automatically proceed to the next milestone.

Do not commit automatically unless explicitly instructed. I will review and execute Git commits.

Keep changes focused so each commit represents one coherent unit of work.

## 11. Quality Requirements

- Responsive on desktop, tablet, and mobile.
- Accessible semantic HTML and keyboard interactions.
- Readable typography and sufficient color contrast.
- Working light/dark theme toggle.
- No broken routes or console errors.
- No unnecessary dependencies.
- No fabricated portfolio content.
- No excessive animations that interfere with navigation or readability.
- Maintainable, reusable, and well-organized code.

The final result should communicate both technical capability and creative thinking.