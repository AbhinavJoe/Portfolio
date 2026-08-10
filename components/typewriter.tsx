"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const TYPE_MS = 55;
const DELETE_MS = 28;
const HOLD_MS = 2000;
const GAP_MS = 250;

/**
 * Types each phrase out, holds it for ~2s, erases it, then moves to the next.
 * Renders the first phrase in full on the server and on first paint, so the
 * markup is meaningful before hydration. Under reduced motion it never
 * animates: the first phrase just stays put (auto-changing text would need a
 * pause control, and the other phrases are decorative).
 */
export function Typewriter({ phrases }: { phrases: string[] }) {
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(phrases[0] ?? "");

  useEffect(() => {
    if (reducedMotion || phrases.length < 2) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let i = 0;
    let shown = phrases[0];

    const later = (fn: () => void, ms: number) => {
      timer = setTimeout(() => !cancelled && fn(), ms);
    };

    const erase = () => {
      if (shown.length > 0) {
        shown = shown.slice(0, -1);
        setText(shown);
        later(erase, DELETE_MS);
        return;
      }
      i = (i + 1) % phrases.length;
      setIndex(i);
      later(type, GAP_MS);
    };

    const type = () => {
      const target = phrases[i];
      if (shown.length < target.length) {
        shown = target.slice(0, shown.length + 1);
        setText(shown);
        later(type, TYPE_MS);
        return;
      }
      later(erase, HOLD_MS);
    };

    later(erase, HOLD_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [phrases, reducedMotion]);

  return (
    <span data-phrase-index={index}>
      {/* Keeps the line's height stable while it's briefly empty between phrases. */}
      {text || "​"}
    </span>
  );
}
