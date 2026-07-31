import { existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { applicationEnv } from "~~/Env";
import { useServerLogger } from "~~/server/plugins/00_logging";
import {
  getDownloadFileCategory,
  isAllowedDownloadFilename,
} from "#shared/utils/downloadFileTypes";
import type { DownloadFile } from "#shared/models/DownloadFile";

export class DownloadService {
  private static instance: DownloadService;
  private readonly log = useServerLogger().getLogger("DownloadService");

  private constructor() {}

  public static getInstance(): DownloadService {
    if (!DownloadService.instance) {
      DownloadService.instance = new DownloadService();
    }
    return DownloadService.instance;
  }

  /**
   * Absolute path of the folder holding files that participants can download.
   */
  public getDownloadsDir(): string {
    return resolve(process.cwd(), applicationEnv.downloadsPath);
  }

  /**
   * Lists all downloadable files in the downloads folder, sorted by name.
   * The folder is re-read on every call, so added/removed files are picked up without a restart.
   */
  public getFiles(): DownloadFile[] {
    const downloadsDir = this.getDownloadsDir();

    if (!existsSync(downloadsDir)) {
      this.log.warn(`Downloads folder not found at ${downloadsDir}`);
      return [];
    }

    try {
      return readdirSync(downloadsDir, { withFileTypes: true })
        .filter(
          (entry) =>
            entry.isFile() &&
            !entry.name.startsWith(".") &&
            isAllowedDownloadFilename(entry.name),
        )
        .map((entry) => this.toDownloadFile(downloadsDir, entry.name))
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      this.log.error(
        `Failed to read downloads folder at ${downloadsDir}:`,
        error,
      );
      return [];
    }
  }

  private toDownloadFile(downloadsDir: string, name: string): DownloadFile {
    const stats = statSync(join(downloadsDir, name));
    return {
      name,
      size: stats.size,
      url: `/api/downloads/${encodeURIComponent(name)}`,
      category: getDownloadFileCategory(name),
    };
  }
}

export function getDownloadService(): DownloadService {
  return DownloadService.getInstance();
}
