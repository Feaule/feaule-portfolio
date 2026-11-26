import Navbar from "@/components/shared/Navbar";
import Hero from "./Hero";
import About from "./About";
import Journey from "./Journey";
import Skills from "./Skills";
import Projects from "./Projects";
import Contact from "./Contact";

/** Style B — Experimental Motion Lab. Sections are added checkpoint by checkpoint. */
export default function StyleB() {
  return (
    <>
      <Navbar variant="b" showSwitch={false}/>
      <main id="main">
        <Hero />
        <About />
        <Journey />
        <Skills />
        <Projects />
      </main>
      <Contact />
    </>
  );
}
