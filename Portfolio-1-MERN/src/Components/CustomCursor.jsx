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
  "summary",
  "label[for]",
  '[role="button"]',
  '[role="link"]',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
  '[data-cursor="hover"]',
].join(",");

const ringSpring = {
  damping: 25,
  stiffness: 300,
  mass: 0.45,
};

/**
 * Adds a decorative pointer only when the active device can hover precisely.
 * Native cursor behavior remains untouched on touch and coarse-pointer devices.
 */
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
    const syncCapability = () => {
      const nextEnabled = pointerQuery.matches;

      setEnabled(nextEnabled);

      if (!nextEnabled) {
        // Capability can change at runtime on hybrid devices. Resetting both the
        // React and ref state prevents a stale cursor flashing when a mouse returns.
        visibleRef.current = false;
        hoveringRef.current = false;
        setVisible(false);
        setHoveringInteractive(false);
        cursorX.set(-100);
        cursorY.set(-100);
      }
    };

    syncCapability();
    pointerQuery.addEventListener("change", syncCapability);

    return () => pointerQuery.removeEventListener("change", syncCapability);
  }, [cursorX, cursorY]);

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

    const handlePointerMove = (event) => {
      if (event.pointerType === "touch") {
        return;
      }

      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      syncVisible(true);

      const target = event.target instanceof Element ? event.target : null;
      syncInteractive(Boolean(target?.closest(INTERACTIVE_SELECTOR)));
    };

    const hideCursor = () => {
      syncVisible(false);
      syncInteractive(false);
    };

    root.classList.add("custom-cursor-active");
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointercancel", hideCursor);
    window.addEventListener("blur", hideCursor);
    root.addEventListener("mouseleave", hideCursor);

    return () => {
      root.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointercancel", hideCursor);
      window.removeEventListener("blur", hideCursor);
      root.removeEventListener("mouseleave", hideCursor);
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
