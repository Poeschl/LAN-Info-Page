import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { DownloadService } from "~~/server/services/DownloadService";
import { applicationEnv } from "~~/Env";

describe("DownloadService", () => {
  let service: DownloadService;
  let downloadsDir: string;
  const originalDownloadsPath = applicationEnv.downloadsPath;

  beforeEach(() => {
    // reset singleton
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (DownloadService as any).instance = undefined;
    downloadsDir = mkdtempSync(join(tmpdir(), "lan-info-downloads-"));
    applicationEnv.downloadsPath = downloadsDir;
    service = DownloadService.getInstance();
  });

  afterEach(() => {
    applicationEnv.downloadsPath = originalDownloadsPath;
    rmSync(downloadsDir, { recursive: true, force: true });
  });

  describe("getFiles", () => {
    it("should return an empty list when the downloads folder is empty", () => {
      // given / when
      const result = service.getFiles();

      // then
      expect(result).toEqual([]);
    });

    it("should return an empty list when the downloads folder does not exist", () => {
      // given
      applicationEnv.downloadsPath = join(downloadsDir, "does-not-exist");

      // when
      const result = service.getFiles();

      // then
      expect(result).toEqual([]);
    });

    it("should list files sorted by name with size, download url and category", () => {
      // given
      writeFileSync(join(downloadsDir, "zeta.zip"), "z".repeat(10));
      writeFileSync(join(downloadsDir, "alpha.tar.gz"), "hello");
      writeFileSync(join(downloadsDir, "setup.exe"), "hi");

      // when
      const result = service.getFiles();

      // then
      expect(result).toEqual([
        {
          name: "alpha.tar.gz",
          size: 5,
          url: "/api/downloads/alpha.tar.gz",
          category: "archive",
        },
        {
          name: "setup.exe",
          size: 2,
          url: "/api/downloads/setup.exe",
          category: "installer",
        },
        {
          name: "zeta.zip",
          size: 10,
          url: "/api/downloads/zeta.zip",
          category: "archive",
        },
      ]);
    });

    it("should ignore hidden (dot) files", () => {
      // given
      writeFileSync(join(downloadsDir, ".gitkeep"), "");
      writeFileSync(join(downloadsDir, "visible.zip"), "content");

      // when
      const result = service.getFiles();

      // then
      expect(result).toEqual([
        expect.objectContaining({ name: "visible.zip" }),
      ]);
    });

    it("should ignore files with a disallowed extension", () => {
      // given
      writeFileSync(join(downloadsDir, "readme.txt"), "content");
      writeFileSync(join(downloadsDir, "cover.png"), "content");
      writeFileSync(join(downloadsDir, "installer.exe"), "content");

      // when
      const result = service.getFiles();

      // then
      expect(result).toEqual([
        expect.objectContaining({ name: "installer.exe" }),
      ]);
    });
  });
});
