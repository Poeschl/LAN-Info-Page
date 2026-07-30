import type { Health } from "~~/server/models/Health";

export default eventHandler(async (): Promise<Health> => {
  return {
    status: "ok",
    version: useRuntimeConfig().public.appVersion || "unknown",
  };
});
