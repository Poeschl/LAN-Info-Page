export interface PlayerStat {
  id: string;
  hostname?: string;
  playerName?: string;
  ipv4Address?: string;
  boardManufacturer?: string;
  baseboard?: string;
  systemProductName?: string;
  cpu?: string;
  gpu?: string;
  windowsEdition?: string;
  currentGame?: string;
  /** ISO timestamp of the last time this asset reported in */
  lastSeenAt: string;
  /** Whether the asset reported in within the configured online threshold */
  online: boolean;
}

export interface PlayerStatsResponse {
  stats: PlayerStat[];
}
