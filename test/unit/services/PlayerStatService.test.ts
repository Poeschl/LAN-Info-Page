import { beforeEach, describe, expect, it, vi } from "vitest";

import { PlayerStatService } from "~~/server/services/PlayerStatService";
import { applicationEnv } from "~~/Env";
import * as playerStatRepositoryModule from "~~/server/repositories/PlayerStatRepository";
import type { PlayerStatEntity } from "~~/server/repositories/PlayerStatRepository";

describe("PlayerStatService", () => {
  let service: PlayerStatService;
  const findOne = vi.fn();
  const save = vi.fn();
  const getMany = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // reset singleton
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (PlayerStatService as any).instance = undefined;
    applicationEnv.statsOnlineThresholdMinutes = 15;
    applicationEnv.statsExpireHours = 24;

    vi.spyOn(
      playerStatRepositoryModule,
      "getPlayerStatRepository",
    ).mockReturnValue({
      findOne,
      save,

      createQueryBuilder: vi.fn(() => {
        const builder = {
          where: vi.fn(() => builder),
          orderBy: vi.fn(() => builder),
          getMany,
        };
        return builder;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    service = PlayerStatService.getInstance();
  });

  describe("report", () => {
    it("should create a new report when no existing entry matches the mac address", async () => {
      // given
      findOne.mockResolvedValue(null);
      save.mockResolvedValue({});

      // when
      await service.report({
        macAddress1: "AA:BB:CC:DD:EE:FF",
        hostname: "test-pc",
        playerName: "Tester",
        currentGame: "TestGame",
      });

      // then
      expect(findOne).toHaveBeenCalledWith({
        where: { macAddress1: "AA:BB:CC:DD:EE:FF" },
      });
      expect(save).toHaveBeenCalledWith(
        expect.objectContaining({
          macAddress1: "AA:BB:CC:DD:EE:FF",
          hostname: "test-pc",
          playerName: "Tester",
          currentGame: "TestGame",
        }),
      );
    });

    it("should merge with the existing entry when the mac address is already known", async () => {
      // given
      findOne.mockResolvedValue({
        id: "existing-id",
        macAddress1: "AA:BB:CC:DD:EE:FF",
        playerName: "OldName",
      });
      save.mockResolvedValue({});

      // when
      await service.report({
        macAddress1: "AA:BB:CC:DD:EE:FF",
        playerName: "NewName",
      });

      // then
      expect(save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "existing-id",
          macAddress1: "AA:BB:CC:DD:EE:FF",
          playerName: "NewName",
        }),
      );
    });
  });

  describe("getStats", () => {
    it("should return an empty list when there are no reports", async () => {
      // given
      getMany.mockResolvedValue([]);

      // when
      const result = await service.getStats();

      // then
      expect(result).toEqual([]);
    });

    it("should map entities to the public shape ordered by player name", async () => {
      // given
      const entity: PlayerStatEntity = {
        id: "1",
        macAddress1: "AA:BB:CC:DD:EE:FF",
        macAddress2: null,
        hostname: "test-pc",
        ipv4Address: "10.0.0.5",
        boardManufacturer: "ASUS",
        baseboard: "ROG",
        systemProductName: null,
        biosRelease: null,
        cpu: "Intel i7",
        gpu: "RTX 3080",
        windowsEdition: "Windows 11",
        playerName: "Tester",
        currentGame: "TestGame",
        lastSeenAt: new Date(),
      };
      getMany.mockResolvedValue([entity]);

      // when
      const result = await service.getStats();

      // then
      expect(result).toEqual([
        expect.objectContaining({
          id: "1",
          hostname: "test-pc",
          playerName: "Tester",
          currentGame: "TestGame",
          online: true,
        }),
      ]);
    });
  });

  describe("toPlayerStat", () => {
    const baseEntity: PlayerStatEntity = {
      id: "1",
      macAddress1: "AA:BB:CC:DD:EE:FF",
      macAddress2: null,
      hostname: null,
      ipv4Address: null,
      boardManufacturer: null,
      baseboard: null,
      systemProductName: null,
      biosRelease: null,
      cpu: null,
      gpu: null,
      windowsEdition: null,
      playerName: null,
      currentGame: null,
      lastSeenAt: new Date(),
    };

    it("should mark the participant as online when the last report is within the threshold", () => {
      // given
      applicationEnv.statsOnlineThresholdMinutes = 15;
      const entity = {
        ...baseEntity,
        lastSeenAt: new Date(Date.now() - 5 * 60 * 1000),
      };

      // when
      const result = service.toPlayerStat(entity);

      // then
      expect(result.online).toBe(true);
    });

    it("should mark the participant as offline when the last report is older than the threshold", () => {
      // given
      applicationEnv.statsOnlineThresholdMinutes = 15;
      const entity = {
        ...baseEntity,
        lastSeenAt: new Date(Date.now() - 30 * 60 * 1000),
      };

      // when
      const result = service.toPlayerStat(entity);

      // then
      expect(result.online).toBe(false);
    });
  });
});
