import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// eslint-config-next still ships legacy eslintrc-style configs (a plain
// `{ extends: [...] }` object, not a flat-config array) — FlatCompat bridges
// that into the flat config this project's eslint.config.mjs uses. Importing
// "eslint-config-next/core-web-vitals" directly and spreading it, as this
// file used to, fails on two counts: ESM `import` needs the literal ".js"
// extension the package doesn't advertise, and even once resolved the
// module's export isn't iterable.
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
