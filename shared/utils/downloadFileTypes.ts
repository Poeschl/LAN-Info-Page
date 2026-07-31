// Only installers (.exe, .msi) and common archive formats are allowed to be
// listed/downloaded. Checked via a case-insensitive suffix match so multi-part
// extensions like ".tar.gz" are handled correctly.

export type DownloadFileCategory = "installer" | "archive" | "other";

export const INSTALLER_EXTENSIONS = [".exe", ".msi"];

export const ARCHIVE_EXTENSIONS = [
  ".zip",
  ".7z",
  ".rar",
  ".tar",
  ".tar.gz",
  ".tgz",
  ".tar.bz2",
  ".gz",
];

export const ALLOWED_DOWNLOAD_EXTENSIONS = [
  ...INSTALLER_EXTENSIONS,
  ...ARCHIVE_EXTENSIONS,
];

export function isAllowedDownloadFilename(name: string): boolean {
  const lowerName = name.toLowerCase();
  return ALLOWED_DOWNLOAD_EXTENSIONS.some((extension) =>
    lowerName.endsWith(extension),
  );
}

/**
 * Categorizes a filename as "installer", "archive" or "other" (fallback for any
 * filename that does not match a known installer/archive extension), so the UI
 * can show a fitting icon per file.
 */
export function getDownloadFileCategory(name: string): DownloadFileCategory {
  const lowerName = name.toLowerCase();
  if (INSTALLER_EXTENSIONS.some((extension) => lowerName.endsWith(extension))) {
    return "installer";
  }
  if (ARCHIVE_EXTENSIONS.some((extension) => lowerName.endsWith(extension))) {
    return "archive";
  }
  return "other";
}
