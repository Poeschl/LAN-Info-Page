import { defineConfig } from "vitest/config";
import { defineVitestProject } from "@nuxt/test-utils/config";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";

const mockCssPlugin = (): Plugin => ({
  name: "mock-css",
  resolveId(id) {
    if (id.endsWith(".scss") || id.endsWith(".css")) {
      return id;
    }
  },
  load(id) {
    if (id.endsWith(".scss") || id.endsWith(".css")) {
      return "export default {}";
    }
  },
});

const mockEnvPlugin = (): Plugin => ({
  name: "mock-env",
  resolveId(id) {
    // Match the Env module imports
    // The id can be "~~/Env", "~~/Env.ts", absolute path with "/Env.ts", or path ending with "//Env"
    if (
      id === "~~/Env" ||
      id === "~~/Env.ts" ||
      id.endsWith("/Env.ts") ||
      id.endsWith("/Env") ||
      id.endsWith("//Env")
    ) {
      return fileURLToPath(new URL("./test/mocks/Env.ts", import.meta.url));
    }
  },
});

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [mockEnvPlugin()],
        resolve: {
          alias: {
            "~~": fileURLToPath(new URL(".", import.meta.url)),
            "~": fileURLToPath(new URL(".", import.meta.url)),
            "#shared": fileURLToPath(new URL("./shared", import.meta.url)),
          },
        },
        test: {
          setupFiles: ["test/unit/setup.ts"],
          name: "unit",
          include: ["test/{e2e,unit}/**/*.test.ts"],
          environment: "node",
        },
      },
      await defineVitestProject({
        plugins: [mockCssPlugin(), mockEnvPlugin()],
        resolve: {
          alias: {
            "~~": fileURLToPath(new URL(".", import.meta.url)),
            "~": fileURLToPath(new URL("./app", import.meta.url)),
            "#shared": fileURLToPath(new URL("./shared", import.meta.url)),
          },
        },
        test: {
          setupFiles: [
            fileURLToPath(
              new URL("./test/component/setup.ts", import.meta.url),
            ),
          ],
          name: "component",
          include: ["test/component/**/*.test.ts"],
          environment: "nuxt",
        },
      }),
    ],
  },
});
