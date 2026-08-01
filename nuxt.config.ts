// https://nuxt.com/docs/api/configuration/nuxt-config
import { readFileSync } from "fs";
import { resolve } from "path";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  build: {
    transpile: [
      "@fortawesome/vue-fontawesome",
      "@fortawesome/fontawesome-svg-core",
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/free-regular-svg-icons",
      "@fortawesome/free-brands-svg-icons",
    ],
  },
  css: ["~/assets/main.scss", "@fortawesome/fontawesome-svg-core/styles.css"],
  devtools: {
    enabled: process.env.NODE_ENV !== "production",

    timeline: {
      enabled: process.env.NODE_ENV !== "production",
    },
  },
  modules: ["@nuxt/eslint", "@nuxt/test-utils/module", "nuxt-auth-utils"],
  nitro: {
    moduleSideEffects: ["reflect-metadata"],
    rollupConfig: {
      output: {
        manualChunks: (id) => {
          if (id.includes("Env.ts")) {
            return "env";
          }
        },
      },
    },
  },
  runtimeConfig: {
    session: {
      password: "",
      cookie: {
        secure: false,
      },
    },
    public: {
      appVersion: JSON.parse(
        readFileSync(resolve(process.cwd(), "package.json"), "utf-8"),
      ).version,
    },
  },
});
