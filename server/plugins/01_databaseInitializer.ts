import { defineNitroPlugin } from "#imports";
import { MigrateService } from "pg-flyway";
import { applicationEnv } from "~~/Env";
import { ensureDataSourceInitialized } from "~~/server/utils/database";
import { useServerLogger } from "~~/server/plugins/00_logging";
import type { Logger } from "loglevel";

let LOGGER: Logger;

/**
 * Initializes the database connection and runs pending migrations at startup.
 *
 * The database is only needed for collecting and displaying LAN party
 * participant stats, not for the main link list. Therefore failures here
 * are logged but do not stop the server from serving the page.
 */
export default defineNitroPlugin(async () => {
  LOGGER = useServerLogger().getLogger("DatabaseInitializer");

  const connected = await checkDatabaseConnection();
  if (connected) {
    await runMigrations();
  }
});

const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    LOGGER.info("Connecting to database...");
    await ensureDataSourceInitialized();
    return true;
  } catch (error) {
    LOGGER.warn(
      "Could not connect to the database. Participant stats will be unavailable until it is reachable.",
    );
    LOGGER.warn(`${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
};

const runMigrations = async () => {
  LOGGER.info("Running database migrations...");

  const databaseUrl = `postgres://${applicationEnv.databaseUser}:${applicationEnv.databasePassword}@${applicationEnv.databaseHost}:${applicationEnv.databasePort}/${applicationEnv.databaseName}`;

  const migrateService = new MigrateService({
    databaseUrl,
    locations: ["database/migrations"],
    historyTable: "database_schema_history",
    historySchema: "public",
    sqlMigrationSuffixes: [".sql"],
    sqlMigrationSeparator: "__",
    sqlMigrationStatementSeparator: ";",
    dryRun: false,
  });

  try {
    await migrateService.migrate();
    LOGGER.info("Database migrations completed successfully.");
  } catch (error) {
    LOGGER.error("Database migration failed.");
    LOGGER.error(`${error instanceof Error ? error.message : String(error)}`);
  } finally {
    migrateService.destroy();
  }
};
