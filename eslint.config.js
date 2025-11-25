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
    ],
  },
  ...nextConfig,
];
