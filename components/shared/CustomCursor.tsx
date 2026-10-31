"use client";
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/**
 * Decorative ring that trails the pointer. The native cursor stays visible.
 * Only mounts its behaviour on fine pointers with motion allowed.
 */
export default function CustomCursor() {
  const ring = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(`(hover: hover) and (pointer: fine) and ${MQ.motionOk}`, () => {
      const el = ring.current!;
      gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
      const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });

      const move = (e: PointerEvent) => {
        x(e.clientX); y(e.clientY);
        gsap.to(el, { opacity: 1, duration: 0.2, overwrite: "auto" });
      };
      const over = (e: PointerEvent) => {
        const hot = (e.target as Element).closest("a, button, [data-cursor]");
        gsap.to(el, { scale: hot ? 1.8 : 1, duration: 0.25 });
      };
      const leave = () => gsap.to(el, { opacity: 0, duration: 0.2 });

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerover", over);
      document.documentElement.addEventListener("pointerleave", leave);
      return () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerover", over);
        document.documentElement.removeEventListener("pointerleave", leave);
      };
    });
  }, { scope: ring });

  return (
    <div
      ref={ring}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] size-8 rounded-full border border-accent opacity-0 mix-blend-difference"
    />
  );
}