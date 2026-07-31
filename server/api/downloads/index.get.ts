import { getDownloadService } from "~~/server/services/DownloadService";
import type { DownloadsResponse } from "#shared/models/DownloadFile";

export default defineEventHandler(async (): Promise<DownloadsResponse> => {
  const files = getDownloadService().getFiles();
  return { files };
});
