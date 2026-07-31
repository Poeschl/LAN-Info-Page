import { useRequestFetch } from "#imports";
import type { PlayerStatsResponse } from "#shared/models/PlayerStat";

export const useStatsApi = () => {
  const requestFetch = useRequestFetch();

  const getStats = async (): Promise<PlayerStatsResponse> => {
    return requestFetch("/api/stats");
  };

  return { getStats };
};
