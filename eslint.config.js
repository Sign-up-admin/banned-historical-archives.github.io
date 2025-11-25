import nextConfig from "eslint-config-next";

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "coverage/**",
      "build/**",
      "dist/**",
      "**/*.d.ts",
      "**/*.config.js",
      "**/*.config.mjs",
    ],
  },
  ...nextConfig,
  {
    rules: {
      // Performance optimizations
      "react/jsx-no-undef": "error",
      "@next/next/no-img-element": "warn",

      // Modern React patterns
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",

      // Code quality
      "no-unused-vars": "warn",
      "prefer-const": "error",
      "no-var": "error",

      // TypeScript specific
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
];
