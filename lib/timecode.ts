/** Shared "composition" clock: 3 seconds at 24 fps, shown as 00:00:SS:FF. */
export const FPS = 24;
export const DURATION = 3;

const pad = (n: number) => String(n).padStart(2, "0");

/** progress 0–1 → timecode string. */
export function timecodeAt(progress: number) {
  const frame = Math.round(progress * DURATION * FPS);
  return `00:00:${pad(Math.floor(frame / FPS))}:${pad(frame % FPS)}`;
}
