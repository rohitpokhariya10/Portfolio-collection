// Assembles the one-page portfolio in the editorial/collage reading order.
// The sections stay separate so each visual idea has a clear owner.
import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/layout/Navbar";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Projects } from "@/sections/Projects";
import { Contact } from "@/sections/Contact";
import { Skills } from "@/sections/Skills";
import { ProfessionalJourney } from "@/sections/ProfessionalJourney";
import { ContactCta } from "@/sections/ContactCta";
import { Footer } from "./layout/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLenisScroll } from "@/hooks/useLenisScroll";

const normalizePath = (pathname) =>
  pathname === "/" ? pathname : pathname.replace(/\/+$/, "");

const getRoute = () =>
  normalizePath(window.location.pathname) === "/contact" ? "contact" : "home";

const scrollToTarget = (target) => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (window.__lenis && !reduceMotion) {
    window.__lenis.scrollTo(target, {
      offset: 0,
      duration: 1.05,
    });
    return;
  }

  if (target === 0) {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    return;
  }

  target?.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
};

const App = () => {
  const [route, setRoute] = useState(getRoute);
  const hasMounted = useRef(false);
  const isContactRoute = route === "contact";

  useLenisScroll();
  useScrollReveal(route);

  useEffect(() => {
    if (route !== "home" || !window.location.hash) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      scrollToTarget(document.querySelector(window.location.hash));
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [route]);

  useEffect(() => {
    document.title = isContactRoute
      ? "Contact | Rohit Singh Pokhariya"
      : "Rohit Singh Pokhariya | Full Stack AI Developer";

    if (!hasMounted.current) {
      hasMounted.current = true;
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      const pageTitle = document.querySelector(
        isContactRoute ? "#contact-page-title" : "#home-page-title",
      );
      pageTitle?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [isContactRoute]);

  useEffect(() => {
    const syncRoute = () => setRoute(getRoute());

    const handleRouteClick = (event) => {
      if (
        event.button !== 0
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
        || !(event.target instanceof Element)
      ) {
        return;
      }

      const anchor = event.target.closest("a[href]");

      if (!anchor || event.defaultPrevented || anchor.target || anchor.hasAttribute("download")) {
        return;
      }

      const url = new URL(anchor.getAttribute("href"), window.location.href);
      const normalizedPath = normalizePath(url.pathname);

      if (url.origin !== window.location.origin || !["/", "/contact"].includes(normalizedPath)) {
        return;
      }

      event.preventDefault();
      window.history.pushState({}, "", `${normalizedPath}${url.hash}`);
      syncRoute();

      window.requestAnimationFrame(() => {
        if (url.hash && normalizedPath === "/") {
          scrollToTarget(document.querySelector(url.hash));
          return;
        }

        scrollToTarget(0);
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
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <Navbar />

      <main className="route-enter" key={route}>
        {isContactRoute ? (
          <Contact />
        ) : (
          <>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <ProfessionalJourney />
            <ContactCta />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
