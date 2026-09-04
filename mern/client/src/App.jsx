import { useRef } from "react";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Showreel from "./components/Showreel.jsx";
import Capabilities from "./components/Capabilities.jsx";
import Projects from "./components/Projects.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";

import useReveal from "./hooks/useReveal.js";
import useTransition from "./hooks/useTransition.js";

export default function App() {
  const heroRef = useRef(null);
  const showreelRef = useRef(null);

  useReveal();

  useTransition(heroRef, showreelRef);

  return (
    <>
      <Navbar />

      <main>
        <Hero heroRef={heroRef} />

        <Showreel showreelRef={showreelRef} />

        <Capabilities />

        <Projects />

        <About />
      </main>

      <Contact />
    </>
  );
}