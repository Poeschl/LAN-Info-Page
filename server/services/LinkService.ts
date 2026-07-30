import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { createHash } from "node:crypto";
import yaml from "js-yaml";
import { applicationEnv } from "~~/Env";
import { useServerLogger } from "~~/server/plugins/00_logging";
import {
  LinksConfigSchema,
  type LinkConfigEntry,
} from "~~/server/schemas/LinkConfigSchema";
import type { Link } from "#shared/models/Link";

export class LinkService {
  private static instance: LinkService;
  private readonly log = useServerLogger().getLogger("LinkService");

  private constructor() {}

  public static getInstance(): LinkService {
    if (!LinkService.instance) {
      LinkService.instance = new LinkService();
    }
    return LinkService.instance;
  }

  /**
   * Reads and validates the links configuration YAML file.
   * The file is re-read on every call so changes are picked up without a restart.
   */
  public getLinks(isAdmin: boolean): Link[] {
    const entries = this.readConfig();
    return entries
      .filter((entry) => isAdmin || !entry.adminOnly)
      .map((entry) => this.toLink(entry));
  }

  /**
   * Absolute path of the folder holding the link images, located next to the
   * links config file (e.g. "./config/images" for a config at "./config/links.yaml").
   */
  public getImagesDir(): string {
    const configPath = resolve(process.cwd(), applicationEnv.linksConfigPath);
    return join(dirname(configPath), "images");
  }

  private readConfig(): LinkConfigEntry[] {
    const configPath = resolve(process.cwd(), applicationEnv.linksConfigPath);

    if (!existsSync(configPath)) {
      this.log.warn(`Links config file not found at ${configPath}`);
      return [];
    }

    try {
      const raw = yaml.load(readFileSync(configPath, "utf8"));
      const parsed = LinksConfigSchema.parse(raw ?? {});
      return parsed.links;
    } catch (error) {
      this.log.error(`Failed to parse links config at ${configPath}:`, error);
      return [];
    }
  }

  private toLink(entry: LinkConfigEntry): Link {
    return {
      id: this.buildId(entry.title, entry.url),
      title: entry.title,
      url: entry.url,
      description: entry.description,
      icon: entry.icon,
      imageUrl: entry.image
        ? `/api/links/images/${encodeURIComponent(entry.image)}`
        : undefined,
      category: entry.category,
      adminOnly: entry.adminOnly,
    };
  }

  private buildId(title: string, url: string): string {
    return createHash("sha256")
      .update(`${title}:${url}`)
      .digest("hex")
      .slice(0, 12);
  }
}

export function getLinkService(): LinkService {
  return LinkService.getInstance();
}
