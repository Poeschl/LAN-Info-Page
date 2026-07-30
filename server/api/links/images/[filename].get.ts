import { createReadStream, existsSync, statSync } from "node:fs";
import { basename, extname, join, resolve, sep } from "node:path";
import { getLinkService } from "~~/server/services/LinkService";

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

/**
 * Serves link images from the images folder next to the links config file
 * (see LinkService.getImagesDir()). Only serves plain filenames without any
 * path traversal, and only known image extensions.
 */
export default defineEventHandler(async (event) => {
  const filenameParam = getRouterParam(event, "filename") ?? "";
  // Strip any path components a caller may try to sneak in via the param.
  const filename = basename(decodeURIComponent(filenameParam));

  const extension = extname(filename).toLowerCase();
  const contentType = CONTENT_TYPES[extension];
  if (!contentType) {
    throw createError({ status: 400, message: "Unsupported image type" });
  }

  const imagesDir = resolve(getLinkService().getImagesDir());
  const filePath = resolve(join(imagesDir, filename));

  // Defense in depth: ensure the resolved path is still inside imagesDir.
  if (!filePath.startsWith(imagesDir + sep)) {
    throw createError({ status: 400, message: "Invalid image path" });
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    throw createError({ status: 404, message: "Image not found" });
  }

  setResponseHeader(event, "Content-Type", contentType);
  setResponseHeader(event, "Cache-Control", "public, max-age=300");
  return sendStream(event, createReadStream(filePath));
});
