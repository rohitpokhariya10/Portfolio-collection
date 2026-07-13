import { useEffect, useRef } from "react";

const TEXT_CANVAS_WIDTH = 1400;
const TEXT_CANVAS_HEIGHT = 320;
const MAX_FONT_SIZE = 220;
const ENTRANCE_DURATION = 2.6;

const vertexShader = /* glsl */ `
  attribute vec3 aScatter;
  attribute float aDelay;
  attribute float aSeed;
  attribute float aSize;
  attribute vec3 color;

  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  uniform float uPointSize;
  uniform float uCameraDistance;
  uniform vec3 uMouse;
  uniform float uPointerStrength;
  uniform float uMouseRadius;
  uniform float uRepelStrength;

  varying vec3 vColor;
  varying float vAlpha;

  float easeOutCubic(float value) {
    return 1.0 - pow(1.0 - value, 3.0);
  }

  void main() {
    float localProgress = clamp(
      (uProgress - aDelay) / max(0.001, 1.0 - aDelay),
      0.0,
      1.0
    );
    float assembled = easeOutCubic(localProgress);
    float settled = smoothstep(0.62, 1.0, assembled);

    vec3 transformed = mix(aScatter, position, assembled);

    float shimmerX = sin(uTime * (0.72 + aSeed * 0.45) + aSeed * 37.0);
    float shimmerY = cos(uTime * (0.64 + aSeed * 0.38) + aSeed * 29.0);
    transformed.xy += vec2(shimmerX, shimmerY) * 1.25 * settled;
    transformed.z += sin(uTime * 0.8 + aSeed * 41.0) * 2.2 * settled;

    float mouseDistance = distance(transformed.xy, uMouse.xy);
    float repel = (1.0 - smoothstep(0.0, uMouseRadius, mouseDistance))
      * uPointerStrength
      * settled;
    vec2 fallbackDirection = vec2(
      cos(aSeed * 31.4159),
      sin(aSeed * 31.4159)
    );
    vec2 repelDirection = mouseDistance > 0.001
      ? normalize(transformed.xy - uMouse.xy)
      : fallbackDirection;
    transformed.xy += repelDirection * repel * uRepelStrength;

    vec4 modelViewPosition = modelViewMatrix * vec4(transformed, 1.0);
    float perspectiveScale = clamp(
      uCameraDistance / max(1.0, -modelViewPosition.z),
      0.55,
      2.2
    );

    gl_Position = projectionMatrix * modelViewPosition;
    gl_PointSize = uPointSize * aSize * uPixelRatio * perspectiveScale;

    vColor = color;
    vAlpha = mix(0.28, 1.0, assembled);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
    float glow = 1.0 - smoothstep(0.08, 0.5, distanceFromCenter);
    float core = 1.0 - smoothstep(0.0, 0.16, distanceFromCenter);
    float alpha = (glow * 0.72 + core * 0.28) * vAlpha;

    if (alpha < 0.01) {
      discard;
    }

    gl_FragColor = vec4(vColor * (0.82 + core * 0.32), alpha);
    #include <colorspace_fragment>
  }
`;

const hashString = (value) => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const createRandom = (seed) => {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const getDensitySettings = (width) => {
  if (width <= 480) {
    return { tier: "mobile", step: 5, maxParticles: 4500 };
  }

  if (width <= 768) {
    return { tier: "tablet", step: 4, maxParticles: 7000 };
  }

  return { tier: "desktop", step: 3, maxParticles: 12000 };
};

const sampleText = (text, displayWidth) => {
  const canvas = document.createElement("canvas");
  canvas.width = TEXT_CANVAS_WIDTH;
  canvas.height = TEXT_CANVAS_HEIGHT;

  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    throw new Error("A 2D canvas context is required to sample the particle text.");
  }

  const displayText = text.toUpperCase();
  const fontFamily = '"Big Shoulders Display", "Arial Narrow", Impact, sans-serif';

  context.font = `900 ${MAX_FONT_SIZE}px ${fontFamily}`;
  const measuredWidth = context.measureText(displayText).width;
  const fittedSize = Math.min(
    MAX_FONT_SIZE,
    (MAX_FONT_SIZE * TEXT_CANVAS_WIDTH * 0.91) / measuredWidth,
  );

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#ffffff";
  context.font = `900 ${fittedSize}px ${fontFamily}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(displayText, canvas.width / 2, canvas.height / 2 + fittedSize * 0.035);

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const { step, maxParticles } = getDensitySettings(displayWidth);
  const candidates = [];

  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const alpha = pixels[(y * canvas.width + x) * 4 + 3];

      if (alpha > 96) {
        candidates.push([x - canvas.width / 2, -(y - canvas.height / 2)]);
      }
    }
  }

  if (candidates.length <= maxParticles) {
    return candidates;
  }

  const random = createRandom(hashString(`${displayText}-${step}`));
  const stride = candidates.length / maxParticles;

  return Array.from({ length: maxParticles }, (_, index) => {
    const start = index * stride;
    const candidateIndex = Math.min(
      candidates.length - 1,
      Math.floor(start + random() * stride),
    );

    return candidates[candidateIndex];
  });
};

const createGeometry = (targets, text, THREE) => {
  const particleCount = targets.length;
  const positions = new Float32Array(particleCount * 3);
  const scatter = new Float32Array(particleCount * 3);
  const delays = new Float32Array(particleCount);
  const seeds = new Float32Array(particleCount);
  const sizes = new Float32Array(particleCount);
  const colors = new Float32Array(particleCount * 3);
  const random = createRandom(hashString(`${text}-${particleCount}`));
  const cream = new THREE.Color("#ede9df");
  const signalRed = new THREE.Color("#e23b33");

  targets.forEach(([x, y], index) => {
    const positionIndex = index * 3;
    const seed = random();
    const angle = random() * Math.PI * 2;
    const radius = TEXT_CANVAS_WIDTH * (0.42 + random() * 0.5);
    const accentMix = random() > 0.92 ? 0.72 + random() * 0.2 : random() * 0.035;

    positions[positionIndex] = x;
    positions[positionIndex + 1] = y;
    positions[positionIndex + 2] = 0;

    scatter[positionIndex] = Math.cos(angle) * radius + (random() - 0.5) * 180;
    scatter[positionIndex + 1] = Math.sin(angle) * radius * 0.42 + (random() - 0.5) * 180;
    scatter[positionIndex + 2] = (random() - 0.5) * 520;

    delays[index] = Math.min(
      0.48,
      random() * 0.34 + ((x + TEXT_CANVAS_WIDTH / 2) / TEXT_CANVAS_WIDTH) * 0.12,
    );
    seeds[index] = seed;
    sizes[index] = 0.72 + random() * 0.72;

    colors[positionIndex] = cream.r + (signalRed.r - cream.r) * accentMix;
    colors[positionIndex + 1] = cream.g + (signalRed.g - cream.g) * accentMix;
    colors[positionIndex + 2] = cream.b + (signalRed.b - cream.b) * accentMix;
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
  geometry.setAttribute("aDelay", new THREE.BufferAttribute(delays, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();

  return geometry;
};

export const ParticleText = ({ text, label = text }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return undefined;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let destroyed = false;
    let initialized = false;
    let initializing = false;
    let isVisible = false;
    let reducedMotion = motionQuery.matches;
    let frameId = 0;
    let previousTime = 0;
    let activeTime = 0;
    let entranceElapsed = 0;
    let pointerStrength = 0;
    let pointerStrengthTarget = 0;
    let scene;
    let camera;
    let renderer;
    let geometry;
    let material;
    let points;
    let intersectionObserver;
    let resizeObserver;
    let densityTier;
    let THREE;
    let pointerTarget;
    let pointerCurrent;
    let pointerNdc;
    let raycaster;
    let pointerPlane;

    const renderScene = () => {
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    const stopLoop = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
    };

    const tick = (time) => {
      if (destroyed || !initialized || !isVisible || reducedMotion || document.hidden) {
        frameId = 0;
        return;
      }

      const elapsedDelta = Math.max(0, (time - previousTime) / 1000);
      const motionDelta = Math.min(elapsedDelta, 0.05);
      const easing = 1 - Math.exp(-motionDelta * 9);
      previousTime = time;
      activeTime += Math.min(elapsedDelta, 0.1);
      entranceElapsed = Math.min(ENTRANCE_DURATION, entranceElapsed + elapsedDelta);
      pointerCurrent.lerp(pointerTarget, easing);
      pointerStrength = THREE.MathUtils.lerp(
        pointerStrength,
        pointerStrengthTarget,
        easing,
      );

      material.uniforms.uTime.value = activeTime;
      material.uniforms.uProgress.value = entranceElapsed / ENTRANCE_DURATION;
      material.uniforms.uMouse.value.copy(pointerCurrent);
      material.uniforms.uPointerStrength.value = pointerStrength;

      renderScene();
      frameId = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (
        frameId
        || destroyed
        || !initialized
        || !isVisible
        || reducedMotion
        || document.hidden
      ) {
        return;
      }

      previousTime = performance.now();
      frameId = window.requestAnimationFrame(tick);
    };

    const resize = () => {
      if (!initialized || !renderer || !camera || !material) {
        return;
      }

      const { width, height } = mount.getBoundingClientRect();
      const renderWidth = Math.max(1, Math.round(width));
      const renderHeight = Math.max(1, Math.round(height));
      const pixelRatioCap = renderWidth <= 768 ? 1.5 : 2;
      const halfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const nextDensityTier = getDensitySettings(renderWidth).tier;

      if (densityTier && densityTier !== nextDensityTier && points) {
        const nextGeometry = createGeometry(
          sampleText(text, renderWidth),
          text,
          THREE,
        );

        points.geometry = nextGeometry;
        geometry.dispose();
        geometry = nextGeometry;
        densityTier = nextDensityTier;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioCap));
      renderer.setSize(renderWidth, renderHeight, false);

      camera.aspect = renderWidth / renderHeight;
      const distanceForHeight = (TEXT_CANVAS_HEIGHT * 0.54) / halfFov;
      const distanceForWidth = (TEXT_CANVAS_WIDTH * 0.5) / (halfFov * camera.aspect);
      camera.position.z = Math.max(
        distanceForHeight * 1.04,
        distanceForWidth * 1.12,
      );
      camera.updateProjectionMatrix();

      const visibleWorldHeight = 2 * halfFov * camera.position.z;
      const worldUnitsPerPixel = visibleWorldHeight / renderHeight;

      material.uniforms.uCameraDistance.value = camera.position.z;
      material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
      material.uniforms.uMouseRadius.value = 72 * worldUnitsPerPixel;
      material.uniforms.uRepelStrength.value = 22 * worldUnitsPerPixel;
      material.uniforms.uPointSize.value = renderWidth <= 768 ? 2.05 : 2.35;

      if (reducedMotion || isVisible) {
        renderScene();
      }
    };

    const disposeScene = () => {
      if (points && scene) {
        scene.remove(points);
      }

      geometry?.dispose();
      material?.dispose();

      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss?.();
        renderer.domElement.remove();
      }

      geometry = undefined;
      material = undefined;
      renderer = undefined;
      scene = undefined;
      camera = undefined;
      points = undefined;
      initialized = false;
    };

    const initialize = async () => {
      if (initializing || initialized || destroyed) {
        return;
      }

      initializing = true;
      mount.classList.add("is-initializing");

      try {
        const fontReady = document.fonts
          ? Promise.all([
              document.fonts.load(
                `900 ${MAX_FONT_SIZE}px "Big Shoulders Display"`,
                text,
              ),
              document.fonts.ready,
            ]).catch(() => undefined)
          : Promise.resolve();
        const [threeModule] = await Promise.all([
          import("./particleTextThree"),
          fontReady,
        ]);

        if (destroyed) {
          return;
        }

        THREE = threeModule;
        pointerTarget = new THREE.Vector3();
        pointerCurrent = new THREE.Vector3();
        pointerNdc = new THREE.Vector2();
        raycaster = new THREE.Raycaster();
        pointerPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

        const displayWidth = mount.getBoundingClientRect().width;
        const targets = sampleText(text, displayWidth);

        if (!targets.length) {
          throw new Error("No pixels were available for the particle text.");
        }

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(30, 1, 1, 3000);
        geometry = createGeometry(targets, text, THREE);
        densityTier = getDensitySettings(displayWidth).tier;
        material = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uProgress: { value: reducedMotion ? 1 : 0 },
            uPixelRatio: { value: 1 },
            uPointSize: { value: 2.35 },
            uCameraDistance: { value: 1 },
            uMouse: { value: new THREE.Vector3() },
            uPointerStrength: { value: 0 },
            uMouseRadius: { value: 90 },
            uRepelStrength: { value: 24 },
          },
          vertexShader,
          fragmentShader,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          toneMapped: false,
        });
        points = new THREE.Points(geometry, material);
        scene.add(points);

        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        });
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.className = "particle-signature__canvas";
        renderer.domElement.setAttribute("aria-hidden", "true");
        mount.appendChild(renderer.domElement);

        initialized = true;
        entranceElapsed = reducedMotion ? ENTRANCE_DURATION : 0;
        resize();
        renderScene();
        mount.classList.add("is-ready");
        mount.classList.remove("is-initializing");

        if (!reducedMotion) {
          startLoop();
        }
      } catch (error) {
        console.warn("Particle text could not be initialized; using the text fallback.", error);
        mount.classList.remove("is-initializing", "is-ready");
        disposeScene();
      } finally {
        initializing = false;
      }
    };

    const handlePointerMove = (event) => {
      if (!initialized || reducedMotion || event.pointerType === "touch") {
        return;
      }

      const bounds = mount.getBoundingClientRect();
      pointerNdc.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointerNdc, camera);

      if (raycaster.ray.intersectPlane(pointerPlane, pointerTarget)) {
        if (pointerStrengthTarget === 0) {
          pointerCurrent.copy(pointerTarget);
        }

        pointerStrengthTarget = 1;
      }
    };

    const handlePointerLeave = () => {
      pointerStrengthTarget = 0;
    };

    const handleMotionChange = (event) => {
      reducedMotion = event.matches;
      pointerStrength = 0;
      pointerStrengthTarget = 0;

      if (!initialized) {
        return;
      }

      if (reducedMotion) {
        entranceElapsed = ENTRANCE_DURATION;
        material.uniforms.uProgress.value = 1;
        material.uniforms.uTime.value = 0;
        material.uniforms.uPointerStrength.value = 0;
        stopLoop();
        renderScene();
        return;
      }

      entranceElapsed = ENTRANCE_DURATION;
      material.uniforms.uProgress.value = 1;
      startLoop();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    };

    if ("IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;

          if (isVisible) {
            initialize();
            startLoop();
          } else {
            stopLoop();
          }
        },
        { threshold: 0.08 },
      );
      intersectionObserver.observe(mount);
    } else {
      isVisible = true;
      initialize();
    }

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
    } else {
      window.addEventListener("resize", resize);
    }

    mount.addEventListener("pointermove", handlePointerMove, { passive: true });
    mount.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionQuery.addEventListener?.("change", handleMotionChange);

    return () => {
      destroyed = true;
      stopLoop();
      intersectionObserver?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      mount.removeEventListener("pointermove", handlePointerMove);
      mount.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      motionQuery.removeEventListener?.("change", handleMotionChange);
      mount.classList.remove("is-initializing", "is-ready");
      disposeScene();
    };
  }, [text]);

  return (
    <div
      ref={mountRef}
      className="particle-signature"
      role="img"
      aria-label={label}
    >
      <span className="particle-signature__fallback" aria-hidden="true">
        {text}
      </span>
    </div>
  );
};
