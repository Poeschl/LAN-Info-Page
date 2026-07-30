import type { ChalkInstance } from "chalk";
import chalk from "chalk";
import log from "loglevel";
import prefix from "loglevel-plugin-prefix";

const DEFAULT_LOCAL_LOGLEVEL = "debug";

const LEVEL_COLORS: { [key: string]: ChalkInstance } = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
};

export default defineNuxtPlugin(() => {
  log.setLevel(DEFAULT_LOCAL_LOGLEVEL);

  prefix.reg(log);
  prefix.apply(log, {
    format(level, name, timestamp) {
      const levelColor = LEVEL_COLORS[level] || chalk.white;
      return `${chalk.gray(`[${timestamp}]`)} ${levelColor(level)}`;
    },
    levelFormatter(level) {
      return level.toUpperCase();
    },
    timestampFormatter(date) {
      return date.toISOString();
    },
  });
});
