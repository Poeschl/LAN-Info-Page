import type { PlayerStatsResponse } from "#shared/models/PlayerStat";

export const useStatsApi = () => {
  const getStats = async (): Promise<PlayerStatsResponse> => {
    return $fetch("/api/stats");
  };

  return { getStats };
};
