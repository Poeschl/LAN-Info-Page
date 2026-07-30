import { useServerLogger } from "~~/server/plugins/00_logging";
import { getPlayerStatService } from "~~/server/services/PlayerStatService";
import type { PlayerStatsResponse } from "#shared/models/PlayerStat";

const log = useServerLogger().getLogger("StatsApi");

/**
 * Public endpoint returning all currently known participant stats, with a
 * computed online/offline status. Visible to every visitor, logged in or not.
 * Like the rest of the public page, this degrades gracefully (empty list)
 * instead of failing if the database is currently unreachable.
 */
export default defineEventHandler(async (): Promise<PlayerStatsResponse> => {
  try {
    const stats = await getPlayerStatService().getStats();
    return { stats };
  } catch (error) {
    log.warn("Could not load participant stats:", error);
    return { stats: [] };
  }
});
