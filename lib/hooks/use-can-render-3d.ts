import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export function useCanRender3D(): boolean {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCanRender(false);
      return;
    }
    const isWideEnough = window.innerWidth >= 768;
    setCanRender(isWideEnough && detectWebGL());
  }, [prefersReducedMotion]);

  return canRender;
}
