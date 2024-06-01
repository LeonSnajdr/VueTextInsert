/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "@vue/eslint-config-prettier/skip-formatting",
    "@vue/eslint-config-typescript/recommended",
    "plugin:vue/vue3-strongly-recommended",
    "eslint:recommended",
    "./.eslint.cjs",
  ],
  parserOptions: {
    ecmaVersion: "latest"
  }
};
