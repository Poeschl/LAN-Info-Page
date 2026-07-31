import { describe, expect, it } from "vitest";
import {
  getDownloadFileCategory,
  isAllowedDownloadFilename,
} from "#shared/utils/downloadFileTypes";

describe("downloadFileTypes", () => {
  describe("isAllowedDownloadFilename", () => {
    it.each([
      "installer.exe",
      "setup.MSI",
      "mod.zip",
      "mod.7z",
      "mod.rar",
      "backup.tar",
      "backup.tar.gz",
      "backup.tgz",
      "backup.tar.bz2",
      "archive.gz",
    ])("should allow %s", (name) => {
      expect(isAllowedDownloadFilename(name)).toBe(true);
    });

    it.each([
      "readme.txt",
      "cover.png",
      "notes.pdf",
      "no-extension",
    ])("should reject %s", (name) => {
      expect(isAllowedDownloadFilename(name)).toBe(false);
    });
  });

  describe("getDownloadFileCategory", () => {
    it.each([
      "installer.exe",
      "setup.MSI",
    ])("should categorize %s as installer", (name) => {
      expect(getDownloadFileCategory(name)).toBe("installer");
    });

    it.each([
      "mod.zip",
      "mod.7z",
      "mod.rar",
      "backup.tar",
      "backup.tar.gz",
      "backup.tgz",
      "backup.tar.bz2",
      "archive.gz",
    ])("should categorize %s as archive", (name) => {
      expect(getDownloadFileCategory(name)).toBe("archive");
    });

    it.each([
      "readme.txt",
      "cover.png",
      "no-extension",
    ])("should categorize %s as other", (name) => {
      expect(getDownloadFileCategory(name)).toBe("other");
    });
  });
});
