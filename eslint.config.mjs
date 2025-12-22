import dprintConfig from "@effect/eslint-plugin/configs/dprint";
import nx from "@nx/eslint-plugin";

export default [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],
  ...dprintConfig,
  {
    ignores: [
      "**/dist",
      "**/node_modules",
      "**/build",
      "**/coverage",
      "**/generated",
      "**/out-tsc",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "@effect/no-import-from-barrel-package": "error",
      "@typescript-eslint/object-curly-spacing": "off",
      "@typescript-eslint/comma-dangle": "off",
      "@typescript-eslint/brace-style": "off",
      "@typescript-eslint/indent": "off",
      "@typescript-eslint/quotes": "off",
      "@typescript-eslint/semi": "off",
    },
  },
];
