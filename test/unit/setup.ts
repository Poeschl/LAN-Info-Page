import { vi } from "vitest";
import log from "loglevel";
import prefix from "loglevel-plugin-prefix";
import chalk from "chalk";

// Mock Nuxt's defineCachedFunction
// @ts-expect-error function is not defined in the global scope by default
global.defineCachedFunction = vi.fn((fn) => fn);

// Mock Nuxt's useStorage
// @ts-expect-error function is not defined in the global scope by default
global.useStorage = vi.fn(() => ({
  removeItem: vi.fn(() => Promise.resolve()),
  setItem: vi.fn(() => Promise.resolve()),
  getItem: vi.fn(() => Promise.resolve(null)),
}));

vi.mock("~~/server/utils/database", () => ({
  ensureDataSourceInitialized: vi.fn(() => Promise.resolve()),
  getEntityManager: vi.fn(() => {
    return {
      getRepository: vi.fn(() => {
        const repository = {
          find: vi.fn(() => Promise.resolve([])),
          findOne: vi.fn(() => Promise.resolve(null)),
          save: vi.fn((entity) => Promise.resolve(entity)),
          remove: vi.fn((entity) => Promise.resolve(entity)),
          createQueryBuilder: vi.fn(() => {
            const builder = {
              where: vi.fn(() => builder),
              orderBy: vi.fn(() => builder),
              getMany: vi.fn(() => Promise.resolve([])),
            };
            return builder;
          }),
          extend: vi.fn(() => repository),
        };
        return repository;
      }),
    };
  }),
}));

// Use the actual implementation of useServerLogger for tests
vi.mock("~~/server/plugins/00_logging", () => ({
  useServerLogger: () => {
    log.setLevel("debug"); // Set a default log level for tests

    prefix.reg(log);
    prefix.apply(log, {
      format(level, name, timestamp) {
        const levelColor = chalk.white;
        return `${chalk.gray(`[${timestamp}]`)} ${levelColor(level)}`;
      },
      levelFormatter(level) {
        return level.toUpperCase();
      },
      timestampFormatter(date) {
        return date.toISOString();
      },
    });

    return log;
  },
}));
