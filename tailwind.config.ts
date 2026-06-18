import type { Config } from "tailwindcss";

const channel = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.mdx"],
  theme: {
    extend: {
      colors: {
        bg: channel("bg"),
        surface: channel("surface"),
        border: channel("border"),
        fg: channel("fg"),
        muted: channel("muted"),
        faint: channel("faint"),
        accent: channel("accent"),
        // Aliases so the blog, repo list and other pre-redesign components
        // keep resolving to the new palette without a rewrite.
        text: channel("fg"),
        "text-dim": channel("muted"),
        "bg-raised": channel("surface"),
        "accent-strong": channel("accent"),
        "accent-foreground": channel("bg"),
        teal: channel("accent"),
        "focus-strong": channel("fg"),
      },
      borderColor: { DEFAULT: channel("border") },
      maxWidth: { content: "48rem" },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        heading: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
