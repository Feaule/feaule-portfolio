import Navbar from "@/components/shared/Navbar";
import Hero from "./Hero";
import About from "./About";
import Projects from "./Projects";

/** Style B — Experimental Motion Lab. Sections are added checkpoint by checkpoint. */
export default function StyleB() {
  return (
    <>
      <Navbar variant="b" />
      <main id="main">
        <Hero />
        <About />
        <Projects />
      </main>
    </>
  );
}
