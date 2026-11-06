import Navbar from "@/components/shared/Navbar";
import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import Projects from "./Projects";
import Contact from "./Contact";
import Footer from "@/components/shared/Footer";

/** Style B — Experimental Motion Lab. Sections are added checkpoint by checkpoint. */
export default function StyleB() {
  return (
    <>
      <Navbar variant="b" />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
