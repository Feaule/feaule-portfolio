import Navbar from "@/components/shared/Navbar";
import Hero from "./Hero";

/** Style A — Kinetic Editorial. Sections are added checkpoint by checkpoint. */
export default function StyleA() {
  return (
    <>
      <Navbar variant="a" />
      <main id="main">
        <Hero />
      </main>
    </>
  );
}