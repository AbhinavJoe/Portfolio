"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { subscribeFrame } from "@/lib/frame-loop";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    // Order 0: Lenis applies this frame's scroll before the scroll-trace
    // marker (order 10) reads window.scrollY.
    const unsubscribe = subscribeFrame((time) => lenis.raf(time), 0);

    return () => {
      unsubscribe();
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
