"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Icosahedron } from "@react-three/drei";
import type { Mesh } from "three";

function WireframeCore() {
  const meshRef = useRef<Mesh>(null);
  const scrollProgress = useRef(0);
  // The canvas fills the hero section exactly, so its own rect is the range
  // over which the scene is actually on screen. Measuring against that (rather
  // than the whole document) means the tilt completes as the hero scrolls past
  // the top of the viewport, instead of needing a full-page scroll to finish.
  const canvasEl = useThree((state) => state.gl.domElement);

  useFrame((_, delta) => {
    const rect = canvasEl.getBoundingClientRect();
    const total = rect.height || 1;
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    scrollProgress.current = scrolled / total;

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x = scrollProgress.current * Math.PI * 0.5;
    }
  });

  return (
    <Icosahedron ref={meshRef} args={[1.6, 1]}>
      <meshBasicMaterial color="#8b7cf6" wireframe />
    </Icosahedron>
  );
}

export function HeroScene() {
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
        <WireframeCore />
        <Sparkles count={80} scale={6} size={2} speed={0.3} color="#5fe3c4" />
      </Canvas>
    </div>
  );
}
