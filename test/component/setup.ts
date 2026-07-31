import { beforeAll, vi } from "vitest";
import { registerEndpoint } from "@nuxt/test-utils/runtime";

// Mock CSS imports to prevent resolution errors
vi.mock("~/assets/main.scss", () => ({}));
vi.mock("~/assets/custom-variables.scss", () => ({}));
vi.mock("@fortawesome/fontawesome-svg-core/styles.css", () => ({}));

// Mock useUserSession to bypass auth middleware
vi.mock("#auth-utils", () => ({
  useUserSession: () => ({
    loggedIn: { value: true },
    user: { value: { username: "test" } },
    clear: vi.fn(),
    fetch: vi.fn(),
  }),
}));

beforeAll(() => {
  // Mock /api/auth endpoint to prevent fetch errors
  registerEndpoint("/api/auth", () => ({
    method: "oauth2",
  }));

  // Mock /api/links endpoint to prevent API calls during tests
  registerEndpoint("/api/links", () => ({
    links: [],
    isAdmin: false,
  }));

  // Mock /api/stats endpoint to prevent API calls during tests
  registerEndpoint("/api/stats", () => ({
    stats: [],
  }));

  // Mock /api/downloads endpoint to prevent API calls during tests
  registerEndpoint("/api/downloads", () => ({
    files: [],
  }));
});
