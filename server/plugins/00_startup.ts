import log from "loglevel";
import { defineNitroPlugin, useRuntimeConfig } from "#imports";

export default defineNitroPlugin(() => {
  const { appVersion } = useRuntimeConfig().public;
  log.info(`Lan Page backend v${appVersion} starting...`);
});
