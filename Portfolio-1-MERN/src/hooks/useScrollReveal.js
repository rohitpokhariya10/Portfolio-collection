import { useEffect } from "react";

/**
 * Adds a visible class to reveal-marked elements when they enter the viewport.
 * Visibility never depends on browser observer support or a motion preference;
 * those capabilities only decide whether the entrance is animated.
 */
export const useScrollReveal = (dependency, enabled = true) => {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const elements = Array.from(document.querySelectorAll("[data-reveal]"));
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer;

    const revealAll = () => {
      elements.forEach((element) => element.classList.add("is-visible"));
    };

    const observeElements = () => {
      observer?.disconnect();
      observer = undefined;

      if (motionQuery.matches || !("IntersectionObserver" in window)) {
        revealAll();
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.16 },
      );

      elements.forEach((element) => observer.observe(element));
    };

    observeElements();
    motionQuery.addEventListener?.("change", observeElements);

    return () => {
      motionQuery.removeEventListener?.("change", observeElements);
      observer?.disconnect();
    };
  }, [dependency, enabled]);
};
