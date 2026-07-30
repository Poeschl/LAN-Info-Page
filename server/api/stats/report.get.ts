import { z } from "zod";
import { getPlayerStatService } from "~~/server/services/PlayerStatService";

/**
 * Query parameters as sent by the LAN Launcher client, compatible with the
 * original eti-lan/LANPage `stats.php` endpoint. All values are optional
 * except `macaddr1`, which is used as the unique key for a participant.
 */
const querySchema = z.object({
  hostname: z.string().optional(),
  macaddr1: z.string().min(1),
  macaddr2: z.string().optional(),
  board_manufacturer: z.string().optional(),
  baseboard: z.string().optional(),
  system_product_name: z.string().optional(),
  bios_release: z.string().optional(),
  cpu: z.string().optional(),
  gpu: z.string().optional(),
  windows_edition: z.string().optional(),
  player_name: z.string().optional(),
  current_game: z.string().optional(),
});

/**
 * Ingests a single participant's stats report. Intended to be called by the
 * LAN Launcher client on the trusted LAN party network - like the original
 * stats.php, this endpoint is intentionally unauthenticated.
 */
export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Content-Type", "text/plain; charset=utf-8");

  const parsed = querySchema.safeParse(getQuery(event));
  if (!parsed.success) {
    setResponseStatus(event, 400);
    return "error";
  }

  const query = parsed.data;
  const ipv4Address = getRequestIP(event, { xForwardedFor: true });

  try {
    await getPlayerStatService().report({
      hostname: query.hostname,
      macAddress1: query.macaddr1,
      macAddress2: query.macaddr2,
      ipv4Address,
      boardManufacturer: query.board_manufacturer,
      baseboard: query.baseboard,
      systemProductName: query.system_product_name,
      biosRelease: query.bios_release,
      cpu: query.cpu,
      gpu: query.gpu,
      windowsEdition: query.windows_edition,
      playerName: query.player_name,
      currentGame: query.current_game,
    });
    return "ok";
  } catch {
    setResponseStatus(event, 500);
    return "error";
  }
});
