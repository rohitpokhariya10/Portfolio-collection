// Assembles the one-page portfolio in the editorial/collage reading order.
// The sections stay separate so each visual idea has a clear owner.
import { useEffect, useState } from "react";
import { Navbar } from "@/layout/Navbar";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Projects } from "@/sections/Projects";
import { Contact } from "@/sections/Contact";
import { Skills } from "@/sections/Skills";
import { ProfessionalJourney } from "@/sections/ProfessionalJourney";
import { Footer } from "./layout/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const getRoute = () => (window.location.pathname === "/contact" ? "contact" : "home");

const App = () => {
  const [route, setRoute] = useState(getRoute);
  const isContactRoute = route === "contact";

  useScrollReveal(route);

  useEffect(() => {
    const syncRoute = () => setRoute(getRoute());

    const handleRouteClick = (event) => {
      const anchor = event.target.closest("a[href]");

      if (!anchor || event.defaultPrevented || anchor.target || anchor.hasAttribute("download")) {
        return;
      }

      const url = new URL(anchor.getAttribute("href"), window.location.href);

      if (url.origin !== window.location.origin || !["/", "/contact"].includes(url.pathname)) {
        return;
      }

      event.preventDefault();
      window.history.pushState({}, "", `${url.pathname}${url.hash}`);
      syncRoute();

      window.requestAnimationFrame(() => {
        if (url.hash && url.pathname === "/") {
          document.querySelector(url.hash)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          return;
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    };

    document.addEventListener("click", handleRouteClick);
    window.addEventListener("popstate", syncRoute);

    return () => {
      document.removeEventListener("click", handleRouteClick);
      window.removeEventListener("popstate", syncRoute);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <Navbar />

      <main className="route-enter" key={route}>
        {isContactRoute ? (
          <Contact />
        ) : (
          <>
            <Hero />
            <About />
            <Projects />
            <Skills />
            <ProfessionalJourney />
          </>
        )}
      </main>

      <Footer showCta={!isContactRoute} />
    </div>
  );
};

export default App;
