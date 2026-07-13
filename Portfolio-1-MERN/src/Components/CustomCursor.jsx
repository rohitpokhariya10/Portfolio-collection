import { useEffect, useRef, useState } from "react";
import {
  motion as Motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  "input:not(:disabled)",
  "textarea:not(:disabled)",
  "select:not(:disabled)",
  "label[for]",
  '[role="button"]',
  '[data-cursor="hover"]',
].join(",");

const ringSpring = {
  damping: 25,
  stiffness: 300,
  mass: 0.45,
};

export const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, ringSpring);
  const ringY = useSpring(cursorY, ringSpring);
  const reduceMotion = Boolean(useReducedMotion());
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hoveringInteractive, setHoveringInteractive] = useState(false);
  const visibleRef = useRef(false);
  const hoveringRef = useRef(false);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncCapability = () => setEnabled(pointerQuery.matches);

    syncCapability();
    pointerQuery.addEventListener("change", syncCapability);

    return () => pointerQuery.removeEventListener("change", syncCapability);
  }, []);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const root = document.documentElement;

    const syncVisible = (nextVisible) => {
      if (visibleRef.current === nextVisible) {
        return;
      }

      visibleRef.current = nextVisible;
      setVisible(nextVisible);
    };

    const syncInteractive = (nextInteractive) => {
      if (hoveringRef.current === nextInteractive) {
        return;
      }

      hoveringRef.current = nextInteractive;
      setHoveringInteractive(nextInteractive);
    };

    const handleMouseMove = (event) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      syncVisible(true);

      const target = event.target instanceof Element ? event.target : null;
      syncInteractive(Boolean(target?.closest(INTERACTIVE_SELECTOR)));
    };

    const handleMouseLeave = () => {
      syncVisible(false);
      syncInteractive(false);
    };

    root.classList.add("custom-cursor-active");
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("blur", handleMouseLeave);
    root.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      root.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("blur", handleMouseLeave);
      root.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorX, cursorY, enabled]);

  if (!enabled) {
    return null;
  }

  const visualTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring", damping: 28, stiffness: 420, mass: 0.42 };

  return (
    <div className="custom-cursor" aria-hidden="true">
      <Motion.span
        className="custom-cursor__anchor"
        style={{ x: cursorX, y: cursorY }}
      >
        <Motion.span
          className="custom-cursor__dot"
          animate={{
            opacity: visible ? 1 : 0,
            scale: hoveringInteractive ? 0.82 : 1,
          }}
          transition={visualTransition}
        />
      </Motion.span>

      <Motion.span
        className="custom-cursor__anchor"
        style={{
          x: reduceMotion ? cursorX : ringX,
          y: reduceMotion ? cursorY : ringY,
        }}
      >
        <Motion.span
          className={`custom-cursor__ring ${
            hoveringInteractive ? "is-hovering" : ""
          }`}
          animate={{
            opacity: visible ? (hoveringInteractive ? 0.68 : 0.9) : 0,
            scale: hoveringInteractive ? 1.7 : 1,
          }}
          transition={visualTransition}
        />
      </Motion.span>
    </div>
  );
};
