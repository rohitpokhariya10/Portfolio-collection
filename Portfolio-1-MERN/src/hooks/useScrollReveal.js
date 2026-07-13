import { useEffect } from "react";

/**
 * Adds a visible class to reveal-marked elements when they enter the viewport.
 * It keeps motion declarative in the markup and respects reduced-motion users.
 */
export const useScrollReveal = (dependency, enabled = true) => {
  useEffect(() => {
    if (!enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const elements = Array.from(document.querySelectorAll("[data-reveal]"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.16 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [dependency, enabled]);
};
