import { getLinkService } from "~~/server/services/LinkService";
import { getAuthService } from "~~/server/services/AuthService";
import type { LinksResponse } from "#shared/models/Link";

export default defineEventHandler(async (event): Promise<LinksResponse> => {
  const isAdmin = await getAuthService().isAdmin(event);
  const links = getLinkService().getLinks(isAdmin);

  return { links, isAdmin };
});
