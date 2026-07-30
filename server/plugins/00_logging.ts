import chalk from "chalk";
import log from "loglevel";
import prefix from "loglevel-plugin-prefix";
import { applicationEnv } from "~~/Env";
import { defineNitroPlugin } from "#imports";

const VALID_LOG_LEVELS = ["trace", "debug", "info", "warn", "error", "silent"];

export default defineNitroPlugin(() => {
  const configuredLevel = applicationEnv.logLevel || "info";
  const logLevel = VALID_LOG_LEVELS.includes(configuredLevel.toLowerCase())
    ? configuredLevel
    : "info";
  log.setLevel(logLevel as log.LogLevelDesc);

  prefix.reg(log);
  prefix.apply(log, {
    format(level, name, timestamp) {
      return `${chalk.gray(`[${timestamp}]`)} ${chalk.bgGrey(`${name}`)}:`;
    },
    levelFormatter(level) {
      return level.toUpperCase();
    },
    timestampFormatter(date) {
      return date.toISOString();
    },
  });

  console.log("Logging initialized with level:", logLevel);
});

export function useServerLogger() {
  return log;
}
