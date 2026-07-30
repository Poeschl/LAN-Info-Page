import withNuxt from "./.nuxt/eslint.config.mjs";
import pluginVue from "eslint-plugin-vue";
import eslint from "@eslint/js";

export default withNuxt(
  eslint.configs.recommended,
  pluginVue.configs["flat/recommended"],
  {
    languageOptions: {
      ecmaVersion: "latest",
    },
  },
  {
    rules: {
      "vue/html-indent": "off",
      "vue/attributes-order": "off",
      "vue/max-attributes-per-line": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "vue/html-closing-bracket-spacing": "off",
      "vue/attribute-hyphenation": ["error", "never"],
      "vue/v-on-event-hyphenation": ["error", "never"],
      "vue/multi-word-component-names": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-unused-vars": "off",
      "vue/no-multiple-template-root": "off",
    },
  },
);
