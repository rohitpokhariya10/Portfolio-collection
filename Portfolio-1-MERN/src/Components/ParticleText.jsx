import { useEffect, useRef } from "react";

const TEXT_CANVAS_WIDTH = 1400;
const TEXT_CANVAS_HEIGHT = 320;
const MAX_FONT_SIZE = 220;
const ENTRANCE_DURATION = 1.7;
const CURSOR_RADIUS_PX = 150;
const CURSOR_FORCE_PX = 36;

const vertexShader = /* glsl */ `
  attribute vec3 aScatter;
  attribute float aDepth;
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
  uniform vec2 uMouseVelocity;
  uniform float uPointerStrength;
  uniform float uMouseRadius;
  uniform float uRepelStrength;
  uniform float uScrollProgress;
  uniform float uTravelSpeed;
  uniform vec3 uHighlightColor;

  varying vec3 vColor;
  varying float vAlpha;
  varying vec2 vTrailDirection;
  varying float vTrailStrength;

  float smootherStep(float value) {
    return value * value * value * (value * (value * 6.0 - 15.0) + 10.0);
  }

  void main() {
    float localProgress = clamp(
      (uProgress - aDelay) / max(0.001, 1.0 - aDelay),
      0.0,
      1.0
    );
    float assembled = smootherStep(localProgress);
    float settled = smoothstep(0.76, 1.0, assembled);

    vec3 transformed = mix(aScatter, position, assembled);
    float depthProgress = smootherStep(clamp(uScrollProgress, 0.0, 1.0));
    transformed.z += aDepth * depthProgress;

    float driftX = sin(uTime * (0.34 + aSeed * 0.18) + aSeed * 37.0);
    float driftY = cos(uTime * (0.3 + aSeed * 0.16) + aSeed * 29.0);
    transformed.xy += vec2(driftX, driftY) * 0.48 * settled;
    transformed.z += sin(uTime * 0.38 + aSeed * 41.0) * 0.9 * settled;

    float velocityLength = length(uMouseVelocity);
    float pointerSpeed = clamp(
      velocityLength / max(0.001, uMouseRadius * 7.5),
      0.0,
      1.0
    );
    float interactionRadius = uMouseRadius * (1.0 + pointerSpeed * 0.28);
    float mouseDistance = distance(transformed.xy, uMouse.xy);
    float softFalloff = 1.0 - smoothstep(
      interactionRadius * 0.08,
      interactionRadius,
      mouseDistance
    );
    float coreFalloff = 1.0 - smoothstep(
      0.0,
      interactionRadius * 0.36,
      mouseDistance
    );
    float repel = softFalloff
      * (0.82 + coreFalloff * 0.28)
      * uPointerStrength
      * settled;
    vec2 fallbackDirection = vec2(
      cos(aSeed * 31.4159),
      sin(aSeed * 31.4159)
    );
    vec2 repelDirection = mouseDistance > 0.001
      ? normalize(transformed.xy - uMouse.xy)
      : fallbackDirection;
    vec2 velocityDirection = velocityLength > 0.001
      ? uMouseVelocity / velocityLength
      : vec2(0.0);
    vec2 tangentDirection = vec2(-repelDirection.y, repelDirection.x);
    float turbulence = sin(aSeed * 53.0 + uTime * 4.2) * pointerSpeed;
    vec2 flowDirection = normalize(
      repelDirection
      + velocityDirection * pointerSpeed * 0.46
      + tangentDirection * turbulence * 0.24
    );
    float displacement = repel
      * uRepelStrength
      * (0.78 + aSeed * 0.44)
      * (1.0 + pointerSpeed * 0.72);
    transformed.xy += flowDirection * displacement;
    transformed.z += displacement
      * (0.3 + aSeed * 0.38)
      * (1.0 + pointerSpeed * 0.45);

    float scanPosition = mix(
      -820.0,
      820.0,
      smoothstep(0.42, 1.0, uProgress)
    );
    float scan = 1.0 - smoothstep(
      0.0,
      105.0,
      abs(position.x - scanPosition)
    );
    scan *= settled;

    vec4 modelViewPosition = modelViewMatrix * vec4(transformed, 1.0);
    float perspectiveScale = clamp(
      uCameraDistance / max(1.0, -modelViewPosition.z),
      0.55,
      2.2
    );
    vec2 radialVector = transformed.xy - cameraPosition.xy;
    float radialLength = length(radialVector);
    float closePass = smoothstep(0.9, 2.2, perspectiveScale);
    vTrailDirection = radialLength > 0.001
      ? radialVector / radialLength
      : vec2(0.0, 1.0);
    vTrailStrength = clamp(
      uTravelSpeed
      * smoothstep(0.28, 0.94, uScrollProgress)
      * (0.35 + closePass * 0.65),
      0.0,
      1.0
    );

    gl_Position = projectionMatrix * modelViewPosition;
    gl_PointSize = uPointSize
      * aSize
      * uPixelRatio
      * perspectiveScale
      * (
        1.0
        + scan * 0.22
        + repel * 0.14
        + pointerSpeed * repel * 0.08
        + vTrailStrength * 2.35
      );

    float interactiveHighlight = repel * (0.14 + pointerSpeed * 0.18);
    vColor = mix(
      color,
      uHighlightColor,
      max(scan * 0.62, interactiveHighlight)
    );
    float reveal = smoothstep(0.0, 0.2, localProgress);
    vAlpha = reveal * (0.84 + aSeed * 0.16) + scan * 0.06;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying vec2 vTrailDirection;
  varying float vTrailStrength;

  void main() {
    vec2 pointPosition = gl_PointCoord - vec2(0.5);
    float distanceFromCenter = length(pointPosition);
    float circleMask = 1.0 - smoothstep(0.34, 0.5, distanceFromCenter);
    vec2 trailNormal = vec2(-vTrailDirection.y, vTrailDirection.x);
    float distanceAlongTrail = abs(dot(pointPosition, vTrailDirection));
    float distanceAcrossTrail = abs(dot(pointPosition, trailNormal));
    float trailLength = 1.0 - smoothstep(0.16, 0.5, distanceAlongTrail);
    float trailWidth = 1.0 - smoothstep(0.035, 0.13, distanceAcrossTrail);
    float trailMask = trailLength * trailWidth * vTrailStrength * 0.78;
    float dotMask = max(circleMask, trailMask);
    float alpha = dotMask * vAlpha;

    if (alpha < 0.012) {
      discard;
    }

    gl_FragColor = vec4(vColor, alpha);
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
    return { tier: "mobile", step: 5, maxParticles: 3200 };
  }

  if (width <= 768) {
    return { tier: "tablet", step: 4, maxParticles: 5500 };
  }

  return { tier: "desktop", step: 3, maxParticles: 9000 };
};

const getDepthRange = (width) => (width <= 768 ? 24 : 280);

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

const createGeometry = (targets, text, THREE, displayWidth) => {
  const particleCount = targets.length;
  const positions = new Float32Array(particleCount * 3);
  const scatter = new Float32Array(particleCount * 3);
  const depths = new Float32Array(particleCount);
  const delays = new Float32Array(particleCount);
  const seeds = new Float32Array(particleCount);
  const sizes = new Float32Array(particleCount);
  const colors = new Float32Array(particleCount * 3);
  const random = createRandom(hashString(`${text}-${particleCount}`));
  const depthRandom = createRandom(hashString(`${text}-${particleCount}-depth`));
  const baseColor = new THREE.Color("#f7f1e8");
  const accentColor = new THREE.Color("#ff825c");
  const depthRange = getDepthRange(displayWidth);

  targets.forEach(([x, y], index) => {
    const positionIndex = index * 3;
    const seed = random();
    const angle = random() * Math.PI * 2;
    const radius = 18 + random() * 72;
    const depth = (depthRandom() - 0.5) * depthRange;
    const accentMix = random() > 0.9 ? 0.68 + random() * 0.3 : random() * 0.045;

    positions[positionIndex] = x + (random() - 0.5) * 0.65;
    positions[positionIndex + 1] = y + (random() - 0.5) * 0.65;
    positions[positionIndex + 2] = 0;

    scatter[positionIndex] = x
      + Math.cos(angle) * radius
      + (random() - 0.5) * 12;
    scatter[positionIndex + 1] = y
      + Math.sin(angle) * radius * 0.48
      + (random() - 0.5) * 10;
    scatter[positionIndex + 2] = (random() - 0.5) * 90;

    depths[index] = depth;
    delays[index] = Math.min(
      0.24,
      random() * 0.09 + ((x + TEXT_CANVAS_WIDTH / 2) / TEXT_CANVAS_WIDTH) * 0.13,
    );
    seeds[index] = seed;
    sizes[index] = 0.82 + random() * 0.36;

    colors[positionIndex] = baseColor.r
      + (accentColor.r - baseColor.r) * accentMix;
    colors[positionIndex + 1] = baseColor.g
      + (accentColor.g - baseColor.g) * accentMix;
    colors[positionIndex + 2] = baseColor.b
      + (accentColor.b - baseColor.b) * accentMix;
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
  geometry.setAttribute("aDepth", new THREE.BufferAttribute(depths, 1));
  geometry.setAttribute("aDelay", new THREE.BufferAttribute(delays, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();

  return geometry;
};

export const ParticleText = ({ text, active = true, scrollContainerRef }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount || !active) {
      return undefined;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactQuery = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    let destroyed = false;
    let initialized = false;
    let initializing = false;
    let isVisible = false;
    let reducedMotion = motionQuery.matches;
    let compactMotion = compactQuery.matches;
    let frameId = 0;
    let scrollReadFrameId = 0;
    let previousTime = 0;
    let activeTime = 0;
    let entranceElapsed = 0;
    let scrollProgress = 0;
    let scrollProgressTarget = 0;
    let travelSpeed = 0;
    let cameraStartZ = 1;
    let cameraEndZ = 1;
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
    let pointerVelocity;
    let pointerVelocityTarget;
    let pointerNdc;
    let raycaster;
    let pointerPlane;
    let cameraLookTarget;
    let tiltTargetX = 0;
    let tiltTargetY = 0;

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

    const applyCameraZoom = () => {
      if (!camera || !THREE || !cameraLookTarget) {
        return;
      }

      const zoomProgress = reducedMotion || compactMotion ? 0 : scrollProgress;
      const flightProgress = THREE.MathUtils.smoothstep(zoomProgress, 0, 1);
      const pathProgress = THREE.MathUtils.smoothstep(zoomProgress, 0.06, 1);
      const targetX = -TEXT_CANVAS_WIDTH * 0.16 * pathProgress;
      const targetY = TEXT_CANVAS_HEIGHT * 0.075 * Math.sin(pathProgress * Math.PI);

      camera.position.set(
        targetX + Math.sin(pathProgress * Math.PI) * 18,
        targetY,
        THREE.MathUtils.lerp(cameraStartZ, cameraEndZ, flightProgress),
      );
      cameraLookTarget.set(targetX * 0.96, targetY * 0.45, 0);
      camera.lookAt(cameraLookTarget);
    };

    const tick = (time) => {
      if (destroyed || !initialized || !isVisible || reducedMotion || document.hidden) {
        frameId = 0;
        return;
      }

      const elapsedDelta = Math.max(0, (time - previousTime) / 1000);
      const motionDelta = Math.min(elapsedDelta, 0.05);
      const pointerEasing = 1 - Math.exp(-motionDelta * 6.2);
      const strengthEasing = 1 - Math.exp(
        -motionDelta * (pointerStrengthTarget > pointerStrength ? 6.8 : 3.4),
      );
      const velocityEasing = 1 - Math.exp(-motionDelta * 9.5);
      const scrollEasing = 1 - Math.exp(-motionDelta * 7.5);
      previousTime = time;
      activeTime += Math.min(elapsedDelta, 0.1);
      entranceElapsed = Math.min(ENTRANCE_DURATION, entranceElapsed + elapsedDelta);
      const previousScrollProgress = scrollProgress;
      scrollProgress = THREE.MathUtils.lerp(
        scrollProgress,
        scrollProgressTarget,
        scrollEasing,
      );
      const scrollVelocity = Math.abs(scrollProgress - previousScrollProgress)
        / Math.max(motionDelta, 1 / 240);
      const travelSpeedTarget = Math.min(1, scrollVelocity * 0.16);
      travelSpeed = THREE.MathUtils.lerp(
        travelSpeed,
        travelSpeedTarget,
        1 - Math.exp(-motionDelta * 9),
      );
      const previousPointerX = pointerCurrent.x;
      const previousPointerY = pointerCurrent.y;
      pointerCurrent.lerp(pointerTarget, pointerEasing);
      const safeDelta = Math.max(motionDelta, 1 / 240);
      pointerVelocityTarget.set(
        (pointerCurrent.x - previousPointerX) / safeDelta,
        (pointerCurrent.y - previousPointerY) / safeDelta,
      );

      if (pointerStrengthTarget === 0) {
        pointerVelocityTarget.set(0, 0);
      } else {
        const maxVelocity = material.uniforms.uMouseRadius.value * 14;

        if (pointerVelocityTarget.length() > maxVelocity) {
          pointerVelocityTarget.setLength(maxVelocity);
        }
      }

      pointerVelocity.lerp(pointerVelocityTarget, velocityEasing);
      pointerStrength = THREE.MathUtils.lerp(
        pointerStrength,
        pointerStrengthTarget,
        strengthEasing,
      );
      applyCameraZoom();

      material.uniforms.uTime.value = activeTime;
      material.uniforms.uProgress.value = entranceElapsed / ENTRANCE_DURATION;
      material.uniforms.uScrollProgress.value = scrollProgress;
      material.uniforms.uTravelSpeed.value = travelSpeed;
      material.uniforms.uMouse.value.copy(pointerCurrent);
      material.uniforms.uMouseVelocity.value.copy(pointerVelocity);
      material.uniforms.uPointerStrength.value = pointerStrength;
      points.rotation.x = THREE.MathUtils.lerp(
        points.rotation.x,
        tiltTargetX,
        pointerEasing,
      );
      points.rotation.y = THREE.MathUtils.lerp(
        points.rotation.y,
        tiltTargetY,
        pointerEasing,
      );

      renderScene();

      const interactionSettled = pointerCurrent.distanceToSquared(pointerTarget) < 0.01
        && Math.abs(pointerStrength - pointerStrengthTarget) < 0.002
        && pointerVelocity.lengthSq() < 0.25
        && Math.abs(points.rotation.x - tiltTargetX) < 0.0002
        && Math.abs(points.rotation.y - tiltTargetY) < 0.0002;
      const scrollSettled = Math.abs(scrollProgress - scrollProgressTarget) < 0.0001
        && travelSpeed < 0.004;

      if (
        entranceElapsed >= ENTRANCE_DURATION
        && interactionSettled
        && scrollSettled
      ) {
        frameId = 0;
        return;
      }

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

    const updateScrollProgress = () => {
      const scrollContainer = scrollContainerRef?.current;
      let nextProgress = 0;

      if (!reducedMotion && !compactMotion && scrollContainer) {
        const bounds = scrollContainer.getBoundingClientRect();
        const scrollDistance = Math.max(
          1,
          scrollContainer.offsetHeight - window.innerHeight,
        );
        nextProgress = Math.min(1, Math.max(0, -bounds.top / scrollDistance));
      }

      if (Math.abs(nextProgress - scrollProgressTarget) < 0.0001) {
        return;
      }

      scrollProgressTarget = nextProgress;
      startLoop();
    };

    const requestScrollProgressUpdate = () => {
      if (scrollReadFrameId) {
        return;
      }

      scrollReadFrameId = window.requestAnimationFrame(() => {
        scrollReadFrameId = 0;
        updateScrollProgress();
      });
    };

    const resize = () => {
      if (!initialized || !renderer || !camera || !material) {
        return;
      }

      const { width, height } = mount.getBoundingClientRect();
      const renderWidth = Math.max(1, Math.round(width));
      const renderHeight = Math.max(1, Math.round(height));
      const pixelRatioCap = renderWidth <= 768 ? 1.25 : 1.5;
      const halfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const nextDensityTier = getDensitySettings(renderWidth).tier;

      if (densityTier && densityTier !== nextDensityTier && points) {
        const nextGeometry = createGeometry(
          sampleText(text, renderWidth),
          text,
          THREE,
          renderWidth,
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
      cameraStartZ = Math.max(
        distanceForHeight * 1.04,
        distanceForWidth * 1.12,
      );
      cameraEndZ = Math.max(36, cameraStartZ * 0.04);
      applyCameraZoom();
      camera.updateProjectionMatrix();

      const visibleWorldHeight = 2 * halfFov * cameraStartZ;
      const worldUnitsPerPixel = visibleWorldHeight / renderHeight;

      material.uniforms.uCameraDistance.value = cameraStartZ;
      material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
      material.uniforms.uMouseRadius.value = CURSOR_RADIUS_PX * worldUnitsPerPixel;
      material.uniforms.uRepelStrength.value = CURSOR_FORCE_PX * worldUnitsPerPixel;
      material.uniforms.uPointSize.value = renderWidth <= 768 ? 2 : 2.25;

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
      if (initializing || initialized || destroyed || reducedMotion) {
        return;
      }

      initializing = true;
      mount.classList.add("is-initializing");

      try {
        const fontReady = document.fonts
          ? Promise.all([
              document.fonts.load(
                `900 ${MAX_FONT_SIZE}px "Big Shoulders Display"`,
                text.toUpperCase(),
              ),
              document.fonts.ready,
            ]).catch(() => undefined)
          : Promise.resolve();
        const [threeModule] = await Promise.all([
          import("./particleTextThree"),
          fontReady,
        ]);

        if (destroyed || reducedMotion) {
          mount.classList.remove("is-initializing");
          return;
        }

        THREE = threeModule;
        pointerTarget = new THREE.Vector3();
        pointerCurrent = new THREE.Vector3();
        pointerVelocity = new THREE.Vector2();
        pointerVelocityTarget = new THREE.Vector2();
        pointerNdc = new THREE.Vector2();
        raycaster = new THREE.Raycaster();
        pointerPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        cameraLookTarget = new THREE.Vector3();

        const displayWidth = mount.getBoundingClientRect().width;
        const targets = sampleText(text, displayWidth);

        if (!targets.length) {
          throw new Error("No pixels were available for the particle text.");
        }

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(30, 1, 1, 12000);
        geometry = createGeometry(targets, text, THREE, displayWidth);
        densityTier = getDensitySettings(displayWidth).tier;
        material = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uProgress: { value: reducedMotion ? 1 : 0 },
            uPixelRatio: { value: 1 },
            uPointSize: { value: 2.05 },
            uCameraDistance: { value: 1 },
            uMouse: { value: new THREE.Vector3() },
            uMouseVelocity: { value: new THREE.Vector2() },
            uPointerStrength: { value: 0 },
            uMouseRadius: { value: CURSOR_RADIUS_PX },
            uRepelStrength: { value: CURSOR_FORCE_PX },
            uScrollProgress: { value: 0 },
            uTravelSpeed: { value: 0 },
            uHighlightColor: { value: new THREE.Color("#8bf0be") },
          },
          vertexShader,
          fragmentShader,
          transparent: true,
          depthWrite: false,
          blending: THREE.NormalBlending,
          toneMapped: false,
        });
        points = new THREE.Points(geometry, material);
        points.frustumCulled = false;
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
        updateScrollProgress();
        scrollProgress = scrollProgressTarget;
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
        tiltTargetX = -pointerNdc.y * 0.018;
        tiltTargetY = pointerNdc.x * 0.028;
        startLoop();
      }
    };

    const handlePointerLeave = () => {
      pointerStrengthTarget = 0;
      tiltTargetX = 0;
      tiltTargetY = 0;
      startLoop();
    };

    const handleMotionChange = (event) => {
      reducedMotion = event.matches;
      pointerStrength = 0;
      pointerStrengthTarget = 0;
      pointerVelocity?.set(0, 0);
      pointerVelocityTarget?.set(0, 0);
      tiltTargetX = 0;
      tiltTargetY = 0;

      if (!initialized) {
        if (!reducedMotion && isVisible) {
          initialize();
        }

        return;
      }

      if (reducedMotion) {
        entranceElapsed = ENTRANCE_DURATION;
        material.uniforms.uProgress.value = 1;
        material.uniforms.uTime.value = 0;
        material.uniforms.uPointerStrength.value = 0;
        material.uniforms.uScrollProgress.value = 0;
        material.uniforms.uTravelSpeed.value = 0;
        applyCameraZoom();
        stopLoop();
        renderScene();
        return;
      }

      entranceElapsed = ENTRANCE_DURATION;
      material.uniforms.uProgress.value = 1;
      updateScrollProgress();
      startLoop();
    };

    const handleCompactMotionChange = (event) => {
      compactMotion = event.matches;
      scrollProgress = 0;
      scrollProgressTarget = 0;
      travelSpeed = 0;

      if (!initialized) {
        return;
      }

      material.uniforms.uScrollProgress.value = 0;
      material.uniforms.uTravelSpeed.value = 0;
      applyCameraZoom();
      renderScene();

      if (!compactMotion) {
        updateScrollProgress();
        startLoop();
      }
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
            if (!reducedMotion) {
              initialize();
            }
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
    window.addEventListener("scroll", requestScrollProgressUpdate, { passive: true });
    window.addEventListener("resize", requestScrollProgressUpdate);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionQuery.addEventListener?.("change", handleMotionChange);
    compactQuery.addEventListener?.("change", handleCompactMotionChange);
    updateScrollProgress();

    return () => {
      destroyed = true;
      stopLoop();
      window.cancelAnimationFrame(scrollReadFrameId);
      intersectionObserver?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", requestScrollProgressUpdate);
      window.removeEventListener("scroll", requestScrollProgressUpdate);
      mount.removeEventListener("pointermove", handlePointerMove);
      mount.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      motionQuery.removeEventListener?.("change", handleMotionChange);
      compactQuery.removeEventListener?.("change", handleCompactMotionChange);
      mount.classList.remove("is-initializing", "is-ready");
      disposeScene();
    };
  }, [active, scrollContainerRef, text]);

  return (
    <div
      ref={mountRef}
      className="particle-signature"
      aria-hidden="true"
    >
      <span
        className="particle-signature__backdrop"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          display: "block",
          backgroundColor: "var(--color-ink)",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
      <span className="particle-signature__glow" aria-hidden="true" />
      <span className="particle-signature__fallback" aria-hidden="true">
        {text.toUpperCase()}
      </span>
    </div>
  );
};
