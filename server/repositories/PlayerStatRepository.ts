import type { EntityManager, Repository } from "typeorm";
import { EntitySchema } from "typeorm";

/**
 * Persisted representation of a single LAN party participant's asset/stats
 * report, as sent by the LAN Launcher client (compatible with the query
 * parameters of the original stats.php: hostname, macaddr1, macaddr2, etc.).
 *
 * Rows are keyed by `macAddress1` - a new report for an already known MAC
 * address updates the existing row instead of inserting a duplicate.
 */
export class PlayerStatEntity {
  id!: string;
  macAddress1!: string;
  macAddress2!: string | null;
  hostname!: string | null;
  ipv4Address!: string | null;
  boardManufacturer!: string | null;
  baseboard!: string | null;
  systemProductName!: string | null;
  biosRelease!: string | null;
  cpu!: string | null;
  gpu!: string | null;
  windowsEdition!: string | null;
  playerName!: string | null;
  currentGame!: string | null;
  lastSeenAt!: Date;
}

export const PlayerStatSchema = new EntitySchema<PlayerStatEntity>({
  name: "player_stats",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    macAddress1: {
      name: "mac_address1",
      type: "varchar",
      length: 64,
      unique: true,
    },
    macAddress2: {
      name: "mac_address2",
      type: "varchar",
      length: 64,
      nullable: true,
    },
    hostname: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    ipv4Address: {
      name: "ipv4_address",
      type: "varchar",
      length: 64,
      nullable: true,
    },
    boardManufacturer: {
      name: "board_manufacturer",
      type: "varchar",
      length: 255,
      nullable: true,
    },
    baseboard: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    systemProductName: {
      name: "system_product_name",
      type: "varchar",
      length: 255,
      nullable: true,
    },
    biosRelease: {
      name: "bios_release",
      type: "varchar",
      length: 255,
      nullable: true,
    },
    cpu: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    gpu: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    windowsEdition: {
      name: "windows_edition",
      type: "varchar",
      length: 255,
      nullable: true,
    },
    playerName: {
      name: "player_name",
      type: "varchar",
      length: 255,
      nullable: true,
    },
    currentGame: {
      name: "current_game",
      type: "varchar",
      length: 255,
      nullable: true,
    },
    lastSeenAt: {
      name: "last_seen_at",
      type: "timestamp",
      updateDate: true,
    },
  },
});

export const getPlayerStatRepository = (
  entityManager: EntityManager = getEntityManager(),
): Repository<PlayerStatEntity> => {
  return entityManager.getRepository(PlayerStatSchema).extend({});
};
