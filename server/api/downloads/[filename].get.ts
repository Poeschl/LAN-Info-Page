import { createReadStream, existsSync, statSync } from "node:fs";
import { basename, extname, join, resolve, sep } from "node:path";
import { getDownloadService } from "~~/server/services/DownloadService";
import { isAllowedDownloadFilename } from "#shared/utils/downloadFileTypes";

const CONTENT_TYPES: Record<string, string> = {
  ".exe": "application/vnd.microsoft.portable-executable",
  ".msi": "application/x-msi",
  ".zip": "application/zip",
  ".7z": "application/x-7z-compressed",
  ".rar": "application/vnd.rar",
  ".tar": "application/x-tar",
  ".gz": "application/gzip",
  ".tgz": "application/gzip",
};

/**
 * Serves downloadable files from the downloads folder (see DownloadService.getDownloadsDir()).
 * Only serves plain filenames without any path traversal, never hidden (dot) files, and only
 * installers/archives (see ALLOWED_DOWNLOAD_EXTENSIONS).
 */
export default defineEventHandler(async (event) => {
  const filenameParam = getRouterParam(event, "filename") ?? "";
  // Strip any path components a caller may try to sneak in via the param.
  const filename = basename(decodeURIComponent(filenameParam));

  if (filename.startsWith(".") || !isAllowedDownloadFilename(filename)) {
    throw createError({ status: 404, message: "File not found" });
  }

  const downloadsDir = resolve(getDownloadService().getDownloadsDir());
  const filePath = resolve(join(downloadsDir, filename));

  // Defense in depth: ensure the resolved path is still inside downloadsDir.
  if (!filePath.startsWith(downloadsDir + sep)) {
    throw createError({ status: 400, message: "Invalid file path" });
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    throw createError({ status: 404, message: "File not found" });
  }

  const contentType =
    CONTENT_TYPES[extname(filename).toLowerCase()] ??
    "application/octet-stream";

  setResponseHeader(event, "Content-Type", contentType);
  setResponseHeader(
    event,
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(filename)}"`,
  );
  setResponseHeader(event, "Cache-Control", "public, max-age=300");
  return sendStream(event, createReadStream(filePath));
});
