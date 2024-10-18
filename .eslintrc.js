/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "eslint-config-prettier",
  ],

  plugins: ["@typescript-eslint", "import", "prettier"],

  rules: {
    "vue/multi-word-component-names": "off",
    "prettier/prettier": "error",
  },
};
