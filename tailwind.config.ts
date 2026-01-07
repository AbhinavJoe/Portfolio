import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.mdx"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-raised": "var(--bg-raised)",
        border: "var(--border)",
        text: "var(--text)",
        "text-dim": "var(--text-dim)",
        accent: "var(--accent)",
        "accent-strong": "var(--accent-strong)",
        teal: "var(--teal)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "IBM Plex Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
