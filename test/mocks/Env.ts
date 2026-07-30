/**
 * Mock environment configuration for tests.
 * This file replaces the actual Env.ts file during test execution.
 *
 * IMPORTANT: Keep this structure in sync with Env.template.
 * If Env.template changes, update this mock accordingly.
 */
export const applicationEnv = {
  databaseHost: "localhost",
  databasePort: 5432,
  databaseUser: "test",
  databasePassword: "test",
  databaseName: "test",
  linksConfigPath: "./config/links.yaml",
  statsOnlineThresholdMinutes: 15,
  statsExpireHours: 24,
  logLevel: "info",
  oidcOpenidAutoDiscoveryUrl: "",
  oidcClientId: "",
  oidcClientSecret: "",
};
