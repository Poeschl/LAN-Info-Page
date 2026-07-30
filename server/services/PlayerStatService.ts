import { applicationEnv } from "~~/Env";
import { useServerLogger } from "~~/server/plugins/00_logging";
import {
  getPlayerStatRepository,
  type PlayerStatEntity,
} from "~~/server/repositories/PlayerStatRepository";
import { ensureDataSourceInitialized } from "~~/server/utils/database";
import type { PlayerStat } from "#shared/models/PlayerStat";

/**
 * Input as reported by the LAN Launcher client, compatible with the query
 * parameters of the original eti-lan/LANPage `stats.php` endpoint.
 */
export interface PlayerStatReport {
  hostname?: string;
  macAddress1: string;
  macAddress2?: string;
  ipv4Address?: string;
  boardManufacturer?: string;
  baseboard?: string;
  systemProductName?: string;
  biosRelease?: string;
  cpu?: string;
  gpu?: string;
  windowsEdition?: string;
  playerName?: string;
  currentGame?: string;
}

export class PlayerStatService {
  private static instance: PlayerStatService;
  private readonly log = useServerLogger().getLogger("PlayerStatService");

  private constructor() {}

  public static getInstance(): PlayerStatService {
    if (!PlayerStatService.instance) {
      PlayerStatService.instance = new PlayerStatService();
    }
    return PlayerStatService.instance;
  }

  /**
   * Stores or updates a participant's stats report, keyed by macAddress1.
   */
  public async report(input: PlayerStatReport): Promise<void> {
    await ensureDataSourceInitialized();
    const repository = getPlayerStatRepository();

    const existing = await repository.findOne({
      where: { macAddress1: input.macAddress1 },
    });

    await repository.save({
      ...existing,
      macAddress1: input.macAddress1,
      macAddress2: input.macAddress2 ?? null,
      hostname: input.hostname ?? null,
      ipv4Address: input.ipv4Address ?? null,
      boardManufacturer: input.boardManufacturer ?? null,
      baseboard: input.baseboard ?? null,
      systemProductName: input.systemProductName ?? null,
      biosRelease: input.biosRelease ?? null,
      cpu: input.cpu ?? null,
      gpu: input.gpu ?? null,
      windowsEdition: input.windowsEdition ?? null,
      playerName: input.playerName ?? null,
      currentGame: input.currentGame ?? null,
    });

    this.log.info(
      `Stored stats report for ${input.playerName ?? input.hostname ?? input.macAddress1}`,
    );
  }

  /**
   * Retrieves all participant stats that have reported in within the
   * configured expiry window, mapped to the public shape with a computed
   * online/offline status.
   */
  public async getStats(): Promise<PlayerStat[]> {
    await ensureDataSourceInitialized();
    const repository = getPlayerStatRepository();

    const expireBefore = new Date(
      Date.now() - applicationEnv.statsExpireHours * 60 * 60 * 1000,
    );

    const entities = await repository
      .createQueryBuilder("stat")
      .where("stat.lastSeenAt >= :expireBefore", { expireBefore })
      .orderBy("stat.playerName", "ASC")
      .getMany();

    return entities.map((entity) => this.toPlayerStat(entity));
  }

  public toPlayerStat(entity: PlayerStatEntity): PlayerStat {
    const onlineThresholdMs =
      applicationEnv.statsOnlineThresholdMinutes * 60 * 1000;
    const online =
      Date.now() - entity.lastSeenAt.getTime() <= onlineThresholdMs;

    return {
      id: entity.id,
      hostname: entity.hostname ?? undefined,
      playerName: entity.playerName ?? undefined,
      ipv4Address: entity.ipv4Address ?? undefined,
      boardManufacturer: entity.boardManufacturer ?? undefined,
      baseboard: entity.baseboard ?? undefined,
      systemProductName: entity.systemProductName ?? undefined,
      cpu: entity.cpu ?? undefined,
      gpu: entity.gpu ?? undefined,
      windowsEdition: entity.windowsEdition ?? undefined,
      currentGame: entity.currentGame ?? undefined,
      lastSeenAt: entity.lastSeenAt.toISOString(),
      online,
    };
  }
}

export function getPlayerStatService(): PlayerStatService {
  return PlayerStatService.getInstance();
}
