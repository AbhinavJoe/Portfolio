"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FaSun, FaMoon } from "react-icons/fa6";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // next-themes can only know the resolved (system-aware) theme after
  // mounting on the client — rendering it during SSR/the first client
  // render would mismatch the server-rendered markup. Render a neutral,
  // non-interactive placeholder until then.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span aria-hidden className="inline-block h-9 w-9" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-text-dim transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:ring-accent"
    >
      {isDark ? <FaSun size={18} /> : <FaMoon size={18} />}
    </button>
  );
}
