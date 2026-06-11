"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Icosahedron } from "@react-three/drei";
import type { Mesh } from "three";

// Reads the live values of the theme's CSS custom properties rather than
// hardcoding hex literals, so the wireframe/sparkles track the active
// light/dark palette instead of being stuck on one mode's color.
function useThemeColor(cssVar: string, fallback: string) {
  const [color, setColor] = useState(fallback);

  useEffect(() => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
    if (value) setColor(value);
  }, [cssVar]);

  return color;
}

export function HeroScene() {
  const sparkleColor = useThemeColor("--teal", "#5fe3c4");

  // The Canvas needs its own positioned wrapper: r3f sets `position: relative`
  // and `width/height: 100%` as inline styles on its container, and those beat
  // an `absolute inset-0` class — without the wrapper the canvas lays out as a
  // flex item in the hero row instead of sitting behind the content.
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        // r3f hard-codes `pointer-events: auto` inline on its container; the
        // scene is decorative, so keep it from swallowing clicks/selection.
        style={{ pointerEvents: "none" }}
      >
        <ambientLight intensity={0.6} />
        <Sparkles count={80} scale={6} size={2} speed={0.3} color={sparkleColor} />
      </Canvas>
    </div>
  );
}
