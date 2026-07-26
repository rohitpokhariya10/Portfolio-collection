import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Adds weighted page scrolling with Lenis while respecting live changes to the
 * user's reduced-motion preference.
 */
export const useLenisScroll = (enabled = true) => {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis;
    let frameId = 0;

    const destroyLenis = () => {
      if (!lenis) {
        return;
      }

      window.cancelAnimationFrame(frameId);
      frameId = 0;
      lenis.destroy();

      if (window.__lenis === lenis) {
        delete window.__lenis;
      }

      lenis = undefined;
    };

    const startLenis = () => {
      if (lenis || motionQuery.matches) {
        return;
      }

      lenis = new Lenis({
        duration: 1.3,
        easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 1.1,
      });

      // App-level anchor navigation uses the same instance, avoiding competing
      // native and enhanced scroll animations.
      window.__lenis = lenis;

      const raf = (time) => {
        if (!lenis) {
          return;
        }

        lenis.raf(time);
        frameId = window.requestAnimationFrame(raf);
      };

      frameId = window.requestAnimationFrame(raf);
    };

    const syncMotionPreference = () => {
      if (motionQuery.matches) {
        destroyLenis();
      } else {
        startLenis();
      }
    };

    syncMotionPreference();
    motionQuery.addEventListener?.("change", syncMotionPreference);

    return () => {
      motionQuery.removeEventListener?.("change", syncMotionPreference);
      destroyLenis();
    };
  }, [enabled]);
};
