import { DataSource } from "typeorm";
import { applicationEnv } from "~~/Env";
import { useServerLogger } from "~~/server/plugins/00_logging";
import { PlayerStatSchema } from "~~/server/repositories/PlayerStatRepository";

const LOGGER = useServerLogger().getLogger("DatabaseConnection");

const AppDataSource = new DataSource({
  type: "postgres",
  host: applicationEnv.databaseHost,
  port: applicationEnv.databasePort,
  username: applicationEnv.databaseUser,
  password: applicationEnv.databasePassword,
  database: applicationEnv.databaseName,
  entities: [PlayerStatSchema],
  synchronize: false,
  logging: false,
});

let initPromise: Promise<void> | null = null;

export async function ensureDataSourceInitialized(): Promise<void> {
  if (AppDataSource.isInitialized) {
    return;
  }

  if (!initPromise) {
    initPromise = AppDataSource.initialize()
      .then(() => {
        LOGGER.info("Data Source has been initialized!");
      })
      .catch((error) => {
        LOGGER.error("Failed to initialize Data Source:");
        LOGGER.error(
          `Host: ${applicationEnv.databaseHost}:${applicationEnv.databasePort}`,
        );
        LOGGER.error(`Database: ${applicationEnv.databaseName}`);
        LOGGER.error(`Error: ${error.message}`);
        throw error;
      });
  }

  return initPromise;
}

export function getEntityManager() {
  if (!AppDataSource.isInitialized) {
    throw new Error(
      "Data Source is not initialized yet. Call ensureDataSourceInitialized() first.",
    );
  }
  return AppDataSource.manager;
}
