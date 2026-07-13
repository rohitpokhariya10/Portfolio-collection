import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/portfolio";

const MINIMUM_DURATION = 3000;
const MAXIMUM_ASSET_WAIT = 3200;
const EXIT_DURATION = 720;

const preloadImage = (source) => {
  const image = new Image();
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };
    const handleLoad = () => {
      if (typeof image.decode === "function") {
        image.decode().then(finish, finish);
        return;
      }

      finish();
    };

    image.addEventListener("load", handleLoad, { once: true });
    image.addEventListener("error", finish, { once: true });
    image.src = source;

    if (image.complete && image.naturalWidth > 0) {
      handleLoad();
    }
  });
};

export const LoadingScreen = ({ onExitStart, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const onExitStartRef = useRef(onExitStart);
  const onCompleteRef = useRef(onComplete);

  onExitStartRef.current = onExitStart;
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minimumDuration = reduceMotion ? 220 : MINIMUM_DURATION;
    const maximumAssetWait = reduceMotion ? 1200 : MAXIMUM_ASSET_WAIT;
    const exitDuration = reduceMotion ? 40 : EXIT_DURATION;
    const startedAt = performance.now();
    const fontReady = document.fonts
      ? Promise.allSettled([
          document.fonts.load('900 1em "Big Shoulders Display"', "Rohit Pokhariya"),
          document.fonts.load('700 1em "Space Mono"', "Portfolio loading"),
          document.fonts.ready,
        ])
      : Promise.resolve();
    let assetsReady = false;
    let disposed = false;
    let exitStarted = false;
    let frameId = 0;
    let exitTimer = 0;

    document.documentElement.classList.add("site-is-loading");

    const readinessTimer = window.setTimeout(() => {
      assetsReady = true;
    }, maximumAssetWait);

    Promise.allSettled([
      fontReady,
      preloadImage(profile.logo),
      preloadImage(profile.photo),
    ]).then(() => {
      if (!disposed) {
        assetsReady = true;
        window.clearTimeout(readinessTimer);
      }
    });

    const updateProgress = (time) => {
      if (disposed) {
        return;
      }

      const elapsed = time - startedAt;
      const durationProgress = Math.min(1, elapsed / minimumDuration);
      const easedProgress = 1 - (1 - durationProgress) ** 3;
      const waitingProgress = 92 + Math.min(
        6,
        Math.floor(Math.max(0, elapsed - minimumDuration) / 360),
      );
      const nextProgress = elapsed < minimumDuration
        ? Math.round(easedProgress * 92)
        : assetsReady
          ? 100
          : waitingProgress;

      setProgress((currentProgress) => Math.max(currentProgress, nextProgress));

      if (nextProgress >= 100 && !exitStarted) {
        exitStarted = true;
        setProgress(100);
        setIsExiting(true);
        onExitStartRef.current?.();

        exitTimer = window.setTimeout(() => {
          if (!disposed) {
            onCompleteRef.current?.();
          }
        }, exitDuration);
        return;
      }

      frameId = window.requestAnimationFrame(updateProgress);
    };

    frameId = window.requestAnimationFrame(updateProgress);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(exitTimer);
      window.clearTimeout(readinessTimer);
      document.documentElement.classList.remove("site-is-loading");
    };
  }, []);

  const formattedProgress = String(progress).padStart(2, "0");
  const accessibleProgress = progress === 100 ? 100 : Math.floor(progress / 10) * 10;

  return (
    <div
      className={`site-loader ${isExiting ? "is-exiting" : ""}`}
      style={{ "--loader-duration": `${MINIMUM_DURATION}ms` }}
      aria-busy={!isExiting}
    >
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isExiting ? "Portfolio ready" : "Preparing Rohit Pokhariya's portfolio"}
      </span>

      <div className="site-loader__grid" aria-hidden="true" />
      <div className="site-loader__mint-panel" aria-hidden="true" />

      <div className="site-loader__topline utility-label">
        <span>RSP / Portfolio 2026</span>
        <span className="site-loader__system-status">
          <span className="site-loader__status-dot" aria-hidden="true" />
          {isExiting ? "Ready / entering" : "System / loading"}
        </span>
      </div>

      <div className="site-loader__main">
        <p className="site-loader__kicker utility-label">
          Full-stack AI developer / Dehradun, India
        </p>

        <div className="site-loader__name" aria-hidden="true">
          <span className="site-loader__word site-loader__word--solid">
            <span>Rohit</span>
          </span>
          <span className="site-loader__word site-loader__word--outline">
            <span>Pokhariya</span>
          </span>
        </div>

        <div className="site-loader__microcopy utility-label" aria-hidden="true">
          <span className="site-loader__ball-runner">
            <span className="site-loader__ball" />
          </span>
          <span>Design</span>
          <span>Code</span>
          <span>AI</span>
          <span>Ship</span>
        </div>
      </div>

      <span className="site-loader__shape site-loader__shape--butter" aria-hidden="true" />

      <div className="site-loader__progress">
        <div className="site-loader__progress-copy">
          <span className="utility-label">Loading digital experience</span>
          <span className="site-loader__percentage">{formattedProgress}</span>
        </div>
        <div
          className="site-loader__progress-track"
          role="progressbar"
          aria-label="Loading portfolio"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={accessibleProgress}
          aria-valuetext={isExiting ? "Portfolio ready" : `${accessibleProgress}% loaded`}
        >
          <span style={{ "--loader-progress": `${progress}%` }} />
        </div>
      </div>

      <div className="site-loader__ticker" aria-hidden="true">
        <div className="site-loader__ticker-track">
          <span>PRODUCT ENGINEERING • CREATIVE DEVELOPMENT • AI SYSTEMS • </span>
          <span>PRODUCT ENGINEERING • CREATIVE DEVELOPMENT • AI SYSTEMS • </span>
          <span>PRODUCT ENGINEERING • CREATIVE DEVELOPMENT • AI SYSTEMS • </span>
        </div>
      </div>
    </div>
  );
};
