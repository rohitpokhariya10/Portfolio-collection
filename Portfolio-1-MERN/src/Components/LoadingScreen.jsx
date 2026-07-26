import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/portfolio";

const MAXIMUM_CRITICAL_WAIT = 1250;
const EXIT_DURATION = 420;
const REDUCED_EXIT_DURATION = 140;

/**
 * Holds the application behind a short, bounded preload for assets that affect
 * the first meaningful frame. Failures are non-blocking because every visual has
 * a CSS or system-font fallback.
 */
export const LoadingScreen = ({
  preloadParticleHero = true,
  onExitStart,
  onComplete,
}) => {
  const [reduceMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const shouldPreloadParticleHero = preloadParticleHero && !reduceMotion;
  const totalTasks = shouldPreloadParticleHero ? 3 : 2;
  const [completedTasks, setCompletedTasks] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const onExitStartRef = useRef(onExitStart);
  const onCompleteRef = useRef(onComplete);

  // Callback refs keep the preload lifecycle stable when a parent re-renders;
  // only the latest callbacks are invoked when the asynchronous work settles.
  onExitStartRef.current = onExitStart;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const exitDuration = reduceMotion ? REDUCED_EXIT_DURATION : EXIT_DURATION;
    const fontTasks = document.fonts
      ? [
          document.fonts.load(
            '900 1em "Big Shoulders Display"',
            profile.shortName,
          ),
          document.fonts.load('700 1em "Space Mono"', profile.role),
        ]
      : [Promise.resolve(), Promise.resolve()];
    const criticalTasks = shouldPreloadParticleHero
      ? [...fontTasks, import("./particleTextThree")]
      : fontTasks;
    let disposed = false;
    let exitStarted = false;
    let exitTimer = 0;
    let safetyTimer = 0;
    let settledTasks = 0;

    setCompletedTasks(0);
    setIsExiting(false);
    document.documentElement.classList.add("site-is-loading");

    const startExit = () => {
      if (disposed || exitStarted) {
        return;
      }

      exitStarted = true;
      window.clearTimeout(safetyTimer);
      setIsExiting(true);
      onExitStartRef.current?.();

      exitTimer = window.setTimeout(() => {
        if (!disposed) {
          onCompleteRef.current?.();
        }
      }, exitDuration);
    };

    const trackedTasks = criticalTasks.map((task) =>
      Promise.resolve(task)
        .catch(() => undefined)
        .then(() => {
          if (disposed) {
            return;
          }

          settledTasks += 1;
          setCompletedTasks(settledTasks);
        }),
    );

    Promise.all(trackedTasks).then(startExit);
    // A slow font service, dynamic import, or browser cache must never strand the
    // user on a loading screen. Late tasks may settle during the exit animation.
    safetyTimer = window.setTimeout(startExit, MAXIMUM_CRITICAL_WAIT);

    return () => {
      disposed = true;
      window.clearTimeout(exitTimer);
      window.clearTimeout(safetyTimer);
      document.documentElement.classList.remove("site-is-loading");
    };
  }, [reduceMotion, shouldPreloadParticleHero]);

  const progress = (completedTasks / totalTasks) * 100;
  const progressText = isExiting
    ? "Entering portfolio"
    : `${completedTasks} of ${totalTasks} critical assets ready`;

  return (
    <div
      className={`site-loader ${isExiting ? "is-exiting" : ""}`}
      aria-busy={!isExiting}
    >
      <span className="sr-only" role="status" aria-live="polite">
        {isExiting ? "Entering portfolio" : "Preparing Rohit Pokhariya's portfolio"}
      </span>

      <div className="site-loader__content">
        <div className="site-loader__mark" aria-hidden="true">
          <span>{profile.initials}</span>
        </div>

        <p className="site-loader__role utility-label">{profile.role}</p>

        <div
          className="site-loader__progress"
          role="progressbar"
          aria-label="Loading portfolio"
          aria-valuemin="0"
          aria-valuemax={totalTasks}
          aria-valuenow={completedTasks}
          aria-valuetext={progressText}
        >
          <span style={{ "--loader-progress": `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};
